import sys
import json
import os

if sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import func
from app.core.database import SessionLocal
from app.models.models import User, Test, Question, TestAttempt, Subject, Topic
from app.schemas.schemas import TestSubmit
from app.routers.tests import (
    generate_test,
    submit_test,
    get_my_attempts,
    get_test_stats,
    GenerateTestRequest,
    evaluate_single_question,
)

def run_tests():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "student@gsssietw.ac.in").first()
    assert user is not None, "Student user not found"
    print(f"Testing with student: {getattr(user, 'full_name', user.email)} ({user.email})")

    print("\n--- 1. Full Mock Test Generation ---")
    mock_payload = GenerateTestRequest(test_type="Full Mock Test")
    mock_resp = generate_test(mock_payload, db=db, current_user=user)
    
    questions = mock_resp.get("questions", [])
    print(f"Total questions in Full Mock Test: {len(questions)}")
    assert len(questions) == 50, f"Expected 50 questions, got {len(questions)}"
    
    counts = mock_resp.get("question_type_counts", {})
    print(f"Question Type Counts: {counts}")
    assert counts.get("MCQ") == 30, f"Expected 30 MCQs, got {counts.get('MCQ')}"
    assert counts.get("MSQ") == 10, f"Expected 10 MSQs, got {counts.get('MSQ')}"
    assert counts.get("NAT") == 10, f"Expected 10 NATs, got {counts.get('NAT')}"

    # Verify no correct answers or explanations leaked before submission
    for q in questions:
        assert q.get("correct_answer") is None, f"Answer leaked in question {q['id']}"
        assert q.get("explanation") is None, f"Explanation leaked in question {q['id']}"
    print("Verified: Zero answer/explanation leakage before submission.")

    print("\n--- 2. Subject Test Generation ---")
    sub_payload = GenerateTestRequest(test_type="Subject Test", subject_id=1)
    sub_resp = generate_test(sub_payload, db=db, current_user=user)
    print(f"Subject Test (Analog Electronics) questions count: {len(sub_resp.get('questions', []))}")
    assert len(sub_resp.get("questions", [])) > 0, "No questions returned for Subject Test"

    print("\n--- 3. Topic Test Generation ---")
    valid_topic = db.query(Topic).filter(Topic.subject_id == 1).first()
    assert valid_topic is not None, "Topic not found for subject 1"
    top_payload = GenerateTestRequest(test_type="Topic Test", subject_id=1, topic_id=valid_topic.id)
    top_resp = generate_test(top_payload, db=db, current_user=user)
    print(f"Topic Test ({valid_topic.title}) questions count: {len(top_resp.get('questions', []))}")
    assert len(top_resp.get("questions", [])) <= 5, "Topic test should have at most 5 questions"

    print("\n--- 4. Previous Year Papers ---")
    pyqs = db.query(Test).filter(Test.test_type == "Previous Year Papers", func.lower(Test.status) == "published").all()
    print(f"Found {len(pyqs)} official published Previous Year Papers:")
    for p in pyqs:
        print(f" - {p.title}: {p.total_questions} Qs, {p.duration_minutes} min, marks: {p.total_marks}")
    assert len(pyqs) >= 2, "Expected GATE 2024 and 2023 papers to be published"

    print("\n--- 5. Submission and Scoring Verification ---")
    mock_test_id = mock_resp["test_id"]
    test_obj = db.query(Test).filter(Test.id == mock_test_id).first()

    # Query db questions
    db_questions = {q.id: q for q in db.query(Question).filter(Question.id.in_([q["id"] for q in questions])).all()}

    mcqs = [q for q in questions if q.get("question_type") == "MCQ"]
    msqs = [q for q in questions if q.get("question_type") == "MSQ"]
    nats = [q for q in questions if q.get("question_type") == "NAT"]

    answers = {}
    # MCQ correct
    q_mcq_corr = mcqs[0]
    answers[str(q_mcq_corr["id"])] = db_questions[q_mcq_corr["id"]].correct_answer
    # MCQ wrong
    q_mcq_wrong = mcqs[1]
    answers[str(q_mcq_wrong["id"])] = "WRONG_ANSWER"

    # MSQ correct
    q_msq_corr = msqs[0]
    corr_msq_val = db_questions[q_msq_corr["id"]].correct_answer
    answers[str(q_msq_corr["id"])] = json.loads(corr_msq_val) if isinstance(corr_msq_val, str) and corr_msq_val.startswith("[") else corr_msq_val
    # MSQ wrong (0 negative marks in GATE)
    q_msq_wrong = msqs[1]
    answers[str(q_msq_wrong["id"])] = ["WRONG_SELECTION"]

    # NAT correct
    q_nat_corr = nats[0]
    answers[str(q_nat_corr["id"])] = str(db_questions[q_nat_corr["id"]].correct_answer)
    # NAT wrong (0 negative marks in GATE)
    q_nat_wrong = nats[1]
    answers[str(q_nat_wrong["id"])] = "99999.9"

    sub_payload = TestSubmit(
        test_id=mock_test_id,
        time_taken_seconds=1800,
        answers=answers,
    )

    submit_res = submit_test(sub_payload, db=db, current_user=user)
    print("Submitted successfully. Results:")
    print(f" - Score: {submit_res['score']} / {submit_res['total_marks']}")
    print(f" - Percentage: {submit_res['percentage']}%")
    print(f" - Accuracy: {submit_res['accuracy']}%")
    print(f" - Correct: {submit_res['correct_count']}")
    print(f" - Incorrect: {submit_res['incorrect_count']}")
    print(f" - Unanswered: {submit_res['unanswered_count']}")
    print(f" - Question Reviews Count: {len(submit_res['question_reviews'])}")
    print(f" - Subject Breakdown Count: {len(submit_res['subject_breakdown'])}")

    assert submit_res["correct_count"] >= 3, "Expected at least 3 correct"
    assert submit_res["incorrect_count"] >= 3, "Expected at least 3 incorrect"
    assert len(submit_res["question_reviews"]) == 50, "Expected 50 question reviews"

    # Check that reviews have answers and explanations
    first_rev = submit_res["question_reviews"][0]
    assert first_rev["correct_answer"] is not None, "Review missing correct answer"
    assert first_rev["explanation"] is not None, "Review missing explanation"
    print("Verified: Detailed explanations and correct answers are now included in reviews.")

    print("\n--- 6. My Attempts & Student Stats ---")
    my_attempts = get_my_attempts(db=db, current_user=user)
    print(f"Total attempts recorded for student: {len(my_attempts)}")
    assert len(my_attempts) > 0, "No attempts recorded"

    stats = get_test_stats(db=db, current_user=user)
    print(f"Stats overview: {stats}")
    assert stats["total_attempts"] > 0, "Stats show 0 attempts"

    db.close()
    print("\n✓ ALL END-TO-END TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
