import json
import random
from typing import Any, Dict, List, Optional, Tuple

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import (
    Test,
    TestAttempt,
    Question,
    User,
    Subject,
    Topic,
)
from app.schemas.schemas import (
    TestResponse,
    TestSubmit,
    TestAttemptResponse,
)

from app.services.question_generator import ensure_topic_questions, ensure_subject_questions

router = APIRouter(prefix="/tests", tags=["Tests & Exams"])

REQUIRED_QUESTIONS = 50
FULL_MOCK_DURATION = 90
SUBJECT_TOPIC_DURATION = 75
TOPIC_PRACTICE_QUESTIONS = 50
MAX_PRACTICE_QUESTIONS = 50

FULL_MOCK_DISTRIBUTION = {
    "MCQ": 30,
    "MSQ": 10,
    "NAT": 10,
}


# ---------------------------------------------------------
# Helper functions
# ---------------------------------------------------------

def normalize_text(value: Any) -> str:
    return str(value or "").strip().lower()


def parse_questions_list(value: Any) -> List[int]:
    if not value:
        return []

    if isinstance(value, str):
        try:
            value = json.loads(value)
        except (ValueError, TypeError):
            return []

    if not isinstance(value, list):
        return []

    result = []
    for item in value:
        try:
            result.append(int(item))
        except (ValueError, TypeError):
            continue

    return result


def normalize_question_type(value: Any) -> str:
    value = normalize_text(value).upper()

    aliases = {
        "MULTIPLE CHOICE": "MCQ",
        "MULTIPLE-CHOICE": "MCQ",
        "SINGLE CORRECT": "MCQ",
        "MULTIPLE SELECT": "MSQ",
        "MULTIPLE SELECT QUESTION": "MSQ",
        "NUMERICAL": "NAT",
        "NUMERICAL ANSWER TYPE": "NAT",
    }

    return aliases.get(value, value)


def published_questions_query(db: Session):
    return db.query(Question).filter(
        func.lower(func.trim(Question.status)) == "published"
    )


def get_ordered_questions(db: Session, test: Test) -> List[Question]:
    question_ids = parse_questions_list(test.questions_list)

    if not question_ids:
        return []

    questions = (
        db.query(Question)
        .filter(Question.id.in_(question_ids))
        .all()
    )

    question_map = {question.id: question for question in questions}

    return [
        question_map[question_id]
        for question_id in question_ids
        if question_id in question_map
    ]


def effective_duration(test_type: str) -> int:
    normalized = normalize_text(test_type)

    if "mock" in normalized or "full" in normalized:
        return FULL_MOCK_DURATION

    return SUBJECT_TOPIC_DURATION


def safe_question_data(question: Question) -> Dict[str, Any]:
    options = question.options

    if isinstance(options, str):
        try:
            options = json.loads(options)
        except (ValueError, TypeError):
            options = []

    return {
        "id": question.id,
        "question_id": question.id,
        "question_text": question.question_text,
        "question_type": normalize_question_type(question.question_type),
        "options": options or [],
        "marks": question.marks,
        "negative_marks": question.negative_marks,
        "difficulty": question.difficulty,
        "topic_id": question.topic_id,
        "subject_id": question.subject_id,
        "gate_year": question.gate_year,
    }


def build_test_response(test: Test, questions: List[Question]) -> Dict[str, Any]:
    type_counts = {"MCQ": 0, "MSQ": 0, "NAT": 0}
    for q in questions:
        q_type = normalize_question_type(q.question_type)
        type_counts[q_type] = type_counts.get(q_type, 0) + 1

    return {
        "id": test.id,
        "test_id": test.id,
        "title": test.title,
        "test_type": test.test_type,
        "subject_id": test.subject_id,
        "duration_minutes": test.duration_minutes,
        "total_marks": test.total_marks,
        "total_questions": len(questions),
        "difficulty": test.difficulty,
        "status": test.status,
        "year": getattr(test, "year", None),
        "paper_url": getattr(test, "paper_url", None),
        "answer_key_url": getattr(test, "answer_key_url", None),
        "source_url": getattr(test, "source_url", None),
        "source_name": getattr(test, "source_name", None),
        "question_type_counts": type_counts,
        "questions": [safe_question_data(q) for q in questions],
    }


def choose_full_mock_questions(db: Session) -> List[Question]:
    selected = []

    for question_type, required_count in FULL_MOCK_DISTRIBUTION.items():
        candidates = published_questions_query(db).all()

        candidates = [
            q for q in candidates
            if normalize_question_type(q.question_type) == question_type
            and q.id not in {item.id for item in selected}
        ]

        if len(candidates) < required_count:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Full Mock Test requires {required_count} published "
                    f"{question_type} questions, but only {len(candidates)} were found."
                ),
            )

        selected.extend(random.sample(candidates, required_count))

    random.shuffle(selected)
    return selected


def create_generated_test(
    db: Session,
    title: str,
    test_type: str,
    questions: List[Question],
    subject_id: Optional[int] = None,
    topic_id: Optional[int] = None,
) -> Test:
    total_marks = sum(float(q.marks or 1.0) for q in questions)

    duration = (
        FULL_MOCK_DURATION if ("mock" in normalize_text(test_type) or "full" in normalize_text(test_type))
        else SUBJECT_TOPIC_DURATION
    )

    test = Test(
        title=title,
        test_type=test_type,
        subject_id=subject_id,
        duration_minutes=duration,
        total_marks=int(total_marks),
        total_questions=len(questions),
        difficulty="Mixed",
        status="published",
        questions_list=[q.id for q in questions],
    )

    db.add(test)
    db.commit()
    db.refresh(test)

    return test


# ---------------------------------------------------------
# Evaluation Engine (Strict GATE ECE Rules)
# ---------------------------------------------------------

def evaluate_single_question(question: Question, user_answer: Any) -> Tuple[bool, bool, float, float]:
    """
    Evaluates a single question answer according to official GATE rules.
    Returns: (is_correct, is_unanswered, marks_awarded, penalty_deducted)
    """
    if user_answer is None:
        return False, True, 0.0, 0.0

    if isinstance(user_answer, str) and not user_answer.strip():
        return False, True, 0.0, 0.0

    if isinstance(user_answer, list) and len(user_answer) == 0:
        return False, True, 0.0, 0.0

    q_type = normalize_question_type(question.question_type)
    marks = float(question.marks or 1.0)
    raw_neg = float(question.negative_marks or 0.0)

    # Decode options list
    options = question.options
    if isinstance(options, str):
        try:
            options = json.loads(options)
        except Exception:
            options = []
    if not isinstance(options, list):
        options = []

    correct_raw = question.correct_answer

    # 1. MCQ Evaluation (Negative marking: 1 mark -> 1/3, 2 marks -> 2/3)
    if q_type == "MCQ":
        neg = raw_neg if raw_neg > 0 else (0.66 if marks >= 2.0 else 0.33)
        u_str = str(user_answer).strip()
        c_str = str(correct_raw).strip()

        # Check exact string match
        if normalize_text(u_str) == normalize_text(c_str):
            return True, False, marks, 0.0

        # Check letter to option text match
        if len(u_str) == 1 and u_str.upper() in ["A", "B", "C", "D"]:
            idx = ord(u_str.upper()) - 65
            if 0 <= idx < len(options) and normalize_text(options[idx]) == normalize_text(c_str):
                return True, False, marks, 0.0

        # Check option text to letter match
        if len(c_str) == 1 and c_str.upper() in ["A", "B", "C", "D"]:
            idx = ord(c_str.upper()) - 65
            if 0 <= idx < len(options) and normalize_text(options[idx]) == normalize_text(u_str):
                return True, False, marks, 0.0

        return False, False, 0.0, neg

    # 2. MSQ Evaluation (Multiple Select: NO negative marking in GATE)
    elif q_type == "MSQ":
        # Parse correct options
        if isinstance(correct_raw, list):
            correct_list = [str(x).strip() for x in correct_raw]
        elif isinstance(correct_raw, str):
            try:
                parsed = json.loads(correct_raw)
                if isinstance(parsed, list):
                    correct_list = [str(x).strip() for x in parsed]
                else:
                    correct_list = [x.strip() for x in correct_raw.split(",") if x.strip()]
            except Exception:
                correct_list = [x.strip() for x in correct_raw.split(",") if x.strip()]
        else:
            correct_list = []

        if isinstance(user_answer, list):
            user_list = [str(x).strip() for x in user_answer]
        else:
            user_list = [str(user_answer).strip()]

        def canonicalize_msq(items):
            canon = set()
            for it in items:
                it_clean = it.strip()
                if len(it_clean) == 1 and it_clean.upper() in ["A", "B", "C", "D"]:
                    idx = ord(it_clean.upper()) - 65
                    if 0 <= idx < len(options):
                        canon.add(normalize_text(options[idx]))
                    else:
                        canon.add(normalize_text(it_clean))
                else:
                    canon.add(normalize_text(it_clean))
            return canon

        c_set = canonicalize_msq(correct_list)
        u_set = canonicalize_msq(user_list)

        if c_set and u_set and c_set == u_set:
            return True, False, marks, 0.0
        else:
            # STRICT GATE RULE: Zero negative marks for MSQ
            return False, False, 0.0, 0.0

    # 3. NAT Evaluation (Numerical Answer Type: NO negative marking in GATE)
    elif q_type == "NAT":
        u_str = str(user_answer).strip()
        c_str = str(correct_raw).strip()

        is_corr = False
        try:
            u_val = float(u_str)
            if "to" in c_str.lower():
                parts = c_str.lower().split("to")
                min_v = float(parts[0].strip())
                max_v = float(parts[1].strip())
                is_corr = (min_v <= u_val <= max_v)
            else:
                c_val = float(c_str)
                tol = max(0.05, abs(c_val) * 0.01)
                is_corr = abs(u_val - c_val) <= tol
        except (ValueError, TypeError):
            is_corr = (normalize_text(u_str) == normalize_text(c_str))

        if is_corr:
            return True, False, marks, 0.0
        else:
            # STRICT GATE RULE: Zero negative marks for NAT
            return False, False, 0.0, 0.0

    # Fallback
    if normalize_text(user_answer) == normalize_text(correct_raw):
        return True, False, marks, 0.0
    return False, False, 0.0, raw_neg


# ---------------------------------------------------------
# Schemas
# ---------------------------------------------------------

from pydantic import BaseModel

class GenerateTestRequest(BaseModel):
    test_type: str
    subject_id: Optional[int] = None
    topic_id: Optional[int] = None


# ---------------------------------------------------------
# GET all available tests
# ---------------------------------------------------------

@router.get("/", response_model=List[TestResponse])
def get_tests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Test)
        .filter(func.lower(func.trim(Test.status)) == "published")
        .order_by(Test.created_at.desc())
        .all()
    )


# ---------------------------------------------------------
# Generate a test
# ---------------------------------------------------------

@router.post("/generate")
def generate_test(
    request: GenerateTestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    test_type = normalize_text(request.test_type)

    if "mock" in test_type or "full" in test_type:
        questions = choose_full_mock_questions(db)

        test = create_generated_test(
            db=db,
            title="Full Mock Test - 50 Questions",
            test_type="Full Mock Test",
            questions=questions,
        )

    elif "topic" in test_type:
        if not request.subject_id or not request.topic_id:
            raise HTTPException(
                status_code=400,
                detail="Select both a subject and a topic.",
            )

        topic = (
            db.query(Topic)
            .filter(
                Topic.id == request.topic_id,
                Topic.subject_id == request.subject_id,
            )
            .first()
        )

        if not topic:
            raise HTTPException(
                status_code=404,
                detail="The selected topic was not found for this subject.",
            )

        questions = ensure_topic_questions(db, topic.id, required_count=REQUIRED_QUESTIONS)

        if len(questions) < REQUIRED_QUESTIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Topic Test requires {REQUIRED_QUESTIONS} published questions, but only {len(questions)} could be found or generated.",
            )

        test = create_generated_test(
            db=db,
            title=f"{topic.title} - Topic Test",
            test_type="Topic Test",
            questions=questions,
            subject_id=request.subject_id,
            topic_id=request.topic_id,
        )

    elif "subject" in test_type:
        if not request.subject_id:
            raise HTTPException(
                status_code=400,
                detail="Select a subject before generating the test.",
            )

        subject = (
            db.query(Subject)
            .filter(Subject.id == request.subject_id)
            .first()
        )

        if not subject:
            raise HTTPException(
                status_code=404,
                detail="The selected subject was not found.",
            )

        questions = ensure_subject_questions(db, subject.id, required_count=REQUIRED_QUESTIONS)

        if len(questions) < REQUIRED_QUESTIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Subject Test requires {REQUIRED_QUESTIONS} published questions, but only {len(questions)} could be found or generated.",
            )

        test = create_generated_test(
            db=db,
            title=f"{subject.name} - Subject Test",
            test_type="Subject Test",
            questions=questions,
            subject_id=request.subject_id,
        )

    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported test type. Choose Full Mock Test, Subject Test, or Topic Test.",
        )

    return build_test_response(test, questions)


# ---------------------------------------------------------
# Test Evaluation Helper
# ---------------------------------------------------------

def compute_test_submission_review(
    db: Session,
    test: Test,
    submitted_answers: Dict[str, Any],
) -> Dict[str, Any]:
    questions = get_ordered_questions(db, test)
    subjects = db.query(Subject).all()
    subject_map = {s.id: s.name for s in subjects}

    correct_count = 0
    incorrect_count = 0
    unanswered_count = 0
    raw_score = 0.0

    question_reviews = []
    subject_stats = {}

    for question in questions:
        user_answer = submitted_answers.get(
            str(question.id),
            submitted_answers.get(question.id),
        )

        is_corr, is_unans, marks_won, penalty = evaluate_single_question(question, user_answer)

        if is_unans:
            unanswered_count += 1
        elif is_corr:
            correct_count += 1
            raw_score += marks_won
        else:
            incorrect_count += 1
            raw_score -= penalty

        # Options for review
        opts = question.options
        if isinstance(opts, str):
            try:
                opts = json.loads(opts)
            except Exception:
                opts = []

        sub_name = subject_map.get(question.subject_id, "Core ECE")

        # Track subject breakdown
        if sub_name not in subject_stats:
            subject_stats[sub_name] = {
                "subject": sub_name,
                "total": 0,
                "correct": 0,
                "incorrect": 0,
                "unanswered": 0,
                "score": 0.0,
            }
        subject_stats[sub_name]["total"] += 1
        if is_corr:
            subject_stats[sub_name]["correct"] += 1
            subject_stats[sub_name]["score"] += marks_won
        elif is_unans:
            subject_stats[sub_name]["unanswered"] += 1
        else:
            subject_stats[sub_name]["incorrect"] += 1
            subject_stats[sub_name]["score"] -= penalty

        # Build detailed review
        question_reviews.append({
            "id": question.id,
            "question_id": question.id,
            "question_text": question.question_text,
            "question_type": normalize_question_type(question.question_type),
            "options": opts or [],
            "marks": question.marks,
            "negative_marks": question.negative_marks,
            "difficulty": question.difficulty,
            "user_answer": user_answer,
            "correct_answer": question.correct_answer,
            "is_correct": is_corr,
            "is_unanswered": is_unans,
            "explanation": question.explanation,
            "subject_name": sub_name,
            "gate_year": question.gate_year,
        })

    # Clean up subject scores
    for k in subject_stats:
        subject_stats[k]["score"] = round(max(0.0, subject_stats[k]["score"]), 2)

    total_questions = len(questions)
    final_score = round(max(0.0, raw_score), 2)
    attempted_count = correct_count + incorrect_count
    accuracy = (
        round((correct_count / attempted_count) * 100, 1)
        if attempted_count > 0
        else 0.0
    )
    total_test_marks = float(test.total_marks or 100)
    percentage = (
        round(max(0.0, min(100.0, (final_score / total_test_marks) * 100)), 1)
        if total_test_marks > 0
        else 0.0
    )

    return {
        "final_score": final_score,
        "percentage": percentage,
        "accuracy": accuracy,
        "total_questions": total_questions,
        "correct_count": correct_count,
        "incorrect_count": incorrect_count,
        "unanswered_count": unanswered_count,
        "question_reviews": question_reviews,
        "subject_breakdown": list(subject_stats.values()),
    }


# ---------------------------------------------------------
# Submit a test & Calculate Verified Score
# ---------------------------------------------------------

@router.post("/submit")
def submit_test(
    submission: TestSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    test = db.query(Test).filter(Test.id == submission.test_id).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found.")

    submitted_answers = getattr(submission, "answers", {}) or {}
    review_data = compute_test_submission_review(db, test, submitted_answers)

    attempt = TestAttempt(
        user_id=current_user.id,
        test_id=test.id,
        score=review_data["final_score"],
        accuracy=review_data["accuracy"],
        total_questions=review_data["total_questions"],
        correct_count=review_data["correct_count"],
        incorrect_count=review_data["incorrect_count"],
        unanswered_count=review_data["unanswered_count"],
        time_taken_seconds=getattr(submission, "time_taken_seconds", 0) or 0,
        answers=submitted_answers,
        is_completed=True,
    )

    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return {
        "id": attempt.id,
        "test_id": test.id,
        "test_title": test.title,
        "score": review_data["final_score"],
        "total_marks": test.total_marks,
        "percentage": review_data["percentage"],
        "accuracy": review_data["accuracy"],
        "total_questions": review_data["total_questions"],
        "correct_count": review_data["correct_count"],
        "incorrect_count": review_data["incorrect_count"],
        "unanswered_count": review_data["unanswered_count"],
        "time_taken_seconds": attempt.time_taken_seconds,
        "is_completed": attempt.is_completed,
        "created_at": attempt.created_at,
        "question_reviews": review_data["question_reviews"],
        "subject_breakdown": review_data["subject_breakdown"],
    }


# ---------------------------------------------------------
# My test attempts
# ---------------------------------------------------------

@router.get("/my-attempts")
def get_my_attempts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    attempts = (
        db.query(TestAttempt)
        .filter(TestAttempt.user_id == current_user.id)
        .order_by(TestAttempt.created_at.desc())
        .all()
    )

    results = []
    for attempt in attempts:
        test = db.query(Test).filter(Test.id == attempt.test_id).first()
        test_title = test.title if test else f"Practice Test #{attempt.test_id}"
        total_marks = int(test.total_marks) if (test and test.total_marks and test.total_marks > 0) else 100

        raw_score = float(attempt.score) if attempt.score is not None else 0.0
        final_score = round(max(0.0, raw_score), 2)
        percentage = round(max(0.0, min(100.0, (final_score / total_marks) * 100.0)), 1)
        status = "Completed" if attempt.is_completed else "In Progress"

        created_at_val = attempt.created_at
        if created_at_val and hasattr(created_at_val, "isoformat"):
            created_at_str = created_at_val.isoformat()
        else:
            created_at_str = str(created_at_val) if created_at_val else ""

        results.append({
            "id": attempt.id,
            "test_id": attempt.test_id,
            "test_title": test_title,
            "score": final_score,
            "total_marks": total_marks,
            "percentage": percentage,
            "accuracy": round(float(attempt.accuracy or 0.0), 1),
            "status": status,
            "total_questions": attempt.total_questions,
            "correct_count": attempt.correct_count,
            "incorrect_count": attempt.incorrect_count,
            "unanswered_count": attempt.unanswered_count,
            "time_taken_seconds": attempt.time_taken_seconds,
            "is_completed": attempt.is_completed,
            "created_at": created_at_str,
        })

    return results


# ---------------------------------------------------------
# Test statistics overview
# ---------------------------------------------------------

@router.get("/stats/overview")
def get_test_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    attempts = (
        db.query(TestAttempt)
        .filter(TestAttempt.user_id == current_user.id)
        .order_by(TestAttempt.created_at.desc())
        .all()
    )

    valid_percentages = []
    valid_scores = []
    valid_accuracies = []
    total_completed = 0

    for attempt in attempts:
        if not attempt.is_completed:
            continue

        test = db.query(Test).filter(Test.id == attempt.test_id).first()
        total_marks = float(test.total_marks) if (test and test.total_marks and test.total_marks > 0) else 100.0

        raw_score = float(attempt.score) if attempt.score is not None else 0.0
        clamped_score = max(0.0, raw_score)
        pct = max(0.0, min(100.0, (clamped_score / total_marks) * 100.0))

        valid_percentages.append(pct)
        valid_scores.append(clamped_score)
        valid_accuracies.append(float(attempt.accuracy or 0.0))
        total_completed += 1

    total_attempts = len(attempts)

    if valid_percentages:
        best_pct = round(max(valid_percentages), 1)
        avg_pct = round(sum(valid_percentages) / len(valid_percentages), 1)
        best_score = round(max(valid_scores), 2)
        avg_score = round(sum(valid_scores) / len(valid_scores), 2)
        avg_acc = round(sum(valid_accuracies) / len(valid_accuracies), 1)
    else:
        best_pct = 0.0
        avg_pct = 0.0
        best_score = 0.0
        avg_score = 0.0
        avg_acc = 0.0

    return {
        "total_tests_attempted": total_attempts,
        "total_attempts": total_attempts,
        "completed_attempts": total_completed,
        "best_score": best_score,
        "best_percentage": best_pct,
        "average_score": avg_score,
        "average_percentage": avg_pct,
        "average_accuracy": avg_acc,
    }


# ---------------------------------------------------------
# Get specific attempt detail / review
# ---------------------------------------------------------

@router.get("/attempts/{attempt_id}")
def get_attempt_detail(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    attempt = db.query(TestAttempt).filter(TestAttempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Test attempt not found.")

    role = normalize_text(getattr(current_user, "role", ""))
    if attempt.user_id != current_user.id and role not in {"faculty", "admin"}:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to view this attempt.",
        )

    test = db.query(Test).filter(Test.id == attempt.test_id).first()
    if not test:
        raise HTTPException(
            status_code=404,
            detail="The associated test was not found.",
        )

    raw_answers = attempt.answers or {}
    if isinstance(raw_answers, str):
        try:
            raw_answers = json.loads(raw_answers)
        except Exception:
            raw_answers = {}

    review_data = compute_test_submission_review(db, test, raw_answers)

    return {
        "id": attempt.id,
        "test_id": test.id,
        "test_title": test.title,
        "score": review_data["final_score"],
        "total_marks": test.total_marks,
        "percentage": review_data["percentage"],
        "accuracy": review_data["accuracy"],
        "total_questions": review_data["total_questions"],
        "correct_count": review_data["correct_count"],
        "incorrect_count": review_data["incorrect_count"],
        "unanswered_count": review_data["unanswered_count"],
        "time_taken_seconds": attempt.time_taken_seconds,
        "is_completed": attempt.is_completed,
        "created_at": attempt.created_at,
        "question_reviews": review_data["question_reviews"],
        "subject_breakdown": review_data["subject_breakdown"],
    }


# ---------------------------------------------------------
# Faculty/admin: batch submissions
# ---------------------------------------------------------

@router.get("/batch-submissions")
def get_batch_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    role = normalize_text(getattr(current_user, "role", ""))

    if role not in {"faculty", "admin"}:
        raise HTTPException(
            status_code=403,
            detail="Only faculty or admin users can view batch submissions.",
        )

    attempts = (
        db.query(TestAttempt)
        .order_by(TestAttempt.created_at.desc())
        .all()
    )

    results = []
    for attempt in attempts:
        user = db.query(User).filter(User.id == attempt.user_id).first()
        test = db.query(Test).filter(Test.id == attempt.test_id).first()
        test_title = test.title if test else "Test"
        total_marks = test.total_marks if test else 100
        raw_score = float(attempt.score) if attempt.score is not None else 0.0
        final_score = round(max(0.0, raw_score), 2)
        percentage = round(max(0.0, min(100.0, (final_score / total_marks) * 100.0)), 1)

        created_at_val = attempt.created_at
        if created_at_val and hasattr(created_at_val, "isoformat"):
            created_at_str = created_at_val.isoformat()
        else:
            created_at_str = str(created_at_val) if created_at_val else ""

        results.append({
            "id": attempt.id,
            "user_id": attempt.user_id,
            "student_name": user.full_name if user else "Student",
            "student_id": user.usn if user and user.usn else (f"STU-{user.id}" if user else "—"),
            "test_id": attempt.test_id,
            "test_title": test_title,
            "total_marks": total_marks,
            "score": final_score,
            "percentage": percentage,
            "accuracy": round(float(attempt.accuracy or 0.0), 1),
            "total_questions": attempt.total_questions,
            "correct_count": attempt.correct_count,
            "incorrect_count": attempt.incorrect_count,
            "unanswered_count": attempt.unanswered_count,
            "time_taken_seconds": attempt.time_taken_seconds,
            "status": "Completed" if attempt.is_completed else "In Progress",
            "created_at": created_at_str,
        })

    return results


# ---------------------------------------------------------
# Get one test with its questions (placed last to prevent capturing fixed routes)
# ---------------------------------------------------------

@router.get("/{test_id}")
def get_test(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    test = db.query(Test).filter(Test.id == test_id).first()

    if not test:
        raise HTTPException(status_code=404, detail="Test not found.")

    questions = get_ordered_questions(db, test)

    return build_test_response(test, questions)