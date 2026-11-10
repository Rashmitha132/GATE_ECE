from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.models import User, TestAttempt, PracticeAttempt, StudyGoal, Question, Subject, Topic
from app.schemas.schemas import DashboardStats
from app.core.security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Student Dashboard & Analytics"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Total questions pool in database
    total_questions_pool = db.query(Question).filter(Question.status == "published").count()

    # 2. Real practice attempts & Unique questions attempted
    practice_attempts = db.query(PracticeAttempt).filter(PracticeAttempt.user_id == current_user.id).all()
    test_attempts = db.query(TestAttempt).filter(TestAttempt.user_id == current_user.id).order_by(TestAttempt.created_at.desc()).all()

    practice_q_count = len(practice_attempts)
    practice_correct = sum(1 for a in practice_attempts if a.is_correct)

    test_q_count = sum(t.correct_count + t.incorrect_count for t in test_attempts)
    test_correct = sum(t.correct_count for t in test_attempts)

    total_attempted = practice_q_count + test_q_count
    total_correct = practice_correct + test_correct

    # Set of unique question IDs answered across practice and tests
    attempted_qids = set(pa.question_id for pa in practice_attempts if pa.question_id)
    for ta in test_attempts:
        if isinstance(ta.answers, dict):
            for qid_str, ans in ta.answers.items():
                if ans is not None and str(ans).strip() != "":
                    try:
                        attempted_qids.add(int(qid_str))
                    except (ValueError, TypeError):
                        pass

    unique_attempted_count = min(len(attempted_qids), total_questions_pool)

    accuracy = round((total_correct / total_attempted) * 100, 1) if total_attempted > 0 else 0.0
    overall_progress = round((unique_attempted_count / total_questions_pool) * 100, 1) if total_questions_pool > 0 else 0.0

    # 3. Dynamic greeting based on current server time
    hour = datetime.now().hour
    if hour < 12:
        greeting = "Good morning"
    elif hour < 17:
        greeting = "Good afternoon"
    else:
        greeting = "Good evening"

    # 4. Study streak calculation
    attempt_dates = set()
    for pa in practice_attempts:
        if pa.attempted_at:
            attempt_dates.add(pa.attempted_at.date())
    for ta in test_attempts:
        if ta.created_at:
            attempt_dates.add(ta.created_at.date())

    today = datetime.utcnow().date()
    streak = 0
    check_date = today
    if check_date not in attempt_dates:
        check_date = today - timedelta(days=1)
    
    while check_date in attempt_dates:
        streak += 1
        check_date -= timedelta(days=1)

    # 5. Study Goal
    goal = db.query(StudyGoal).filter(StudyGoal.user_id == current_user.id).first()
    # Count attempts made today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_attempts_count = db.query(PracticeAttempt).filter(
        PracticeAttempt.user_id == current_user.id,
        PracticeAttempt.attempted_at >= today_start
    ).count()

    goal_text = goal.goal_text if goal else "Daily Practice: Solve 50 questions (Any subject)"
    goal_target = goal.target_count if goal else 50
    goal_prog = today_attempts_count

    # 6. Real Subject-wise progress
    subjects = db.query(Subject).all()
    subject_progress = []
    for s in subjects:
        sub_questions = db.query(Question.id).filter(Question.subject_id == s.id, Question.status == "published").all()
        sub_q_ids = set(q[0] for q in sub_questions)
        total_sub_q = len(sub_q_ids)
        
        if total_sub_q > 0:
            user_attempted_in_sub = len(attempted_qids.intersection(sub_q_ids))
            pct = round((user_attempted_in_sub / total_sub_q) * 100)
        else:
            pct = 0
        subject_progress.append({
            "subject": s.name,
            "progress": pct
        })

    # 7. Real Weak Topics (topics with attempts where accuracy < 75%)
    topic_attempts = {}
    for pa in practice_attempts:
        q = pa.question
        if q and q.topic_id:
            tid = q.topic_id
            if tid not in topic_attempts:
                topic_attempts[tid] = {"correct": 0, "total": 0, "subject_name": q.subject.name if q.subject else "Core"}
            topic_attempts[tid]["total"] += 1
            if pa.is_correct:
                topic_attempts[tid]["correct"] += 1

    weak_topics = []
    for tid, data in topic_attempts.items():
        topic_acc = round((data["correct"] / data["total"]) * 100)
        if topic_acc < 75:
            topic_obj = db.query(Topic).filter(Topic.id == tid).first()
            if topic_obj:
                weak_topics.append({
                    "topic": topic_obj.title,
                    "subject": data["subject_name"],
                    "accuracy": topic_acc
                })

    # Sort weak topics lowest accuracy first
    weak_topics.sort(key=lambda x: x["accuracy"])
    weak_topics = weak_topics[:5]

    # 8. Real Recent Performance from TestAttempt
    recent_perf = []
    for ta in test_attempts[:5]:
        test_title = ta.test.title if ta.test else f"Test #{ta.test_id}"
        total_marks = ta.test.total_marks if ta.test else 100
        recent_perf.append({
            "test": test_title,
            "score": f"{ta.score:.1f}/{total_marks}",
            "accuracy": f"{ta.accuracy:.0f}%",
            "date": ta.created_at.strftime("%d %b") if ta.created_at else "Recently"
        })

    # 9. Continue Learning dynamic calculation
    continue_learning = None
    if practice_attempts:
        last_attempt = practice_attempts[-1]
        if last_attempt.question and last_attempt.question.subject:
            sub = last_attempt.question.subject
            topic = last_attempt.question.topic
            continue_learning = {
                "subject": sub.name,
                "topic": topic.title if topic else "General Practice",
                "progress_text": f"{sub.name} Practice",
                "progress_pct": next((sp["progress"] for sp in subject_progress if sp["subject"] == sub.name), 10)
            }
    if not continue_learning and subjects:
        first_sub = subjects[0]
        first_topic = db.query(Topic).filter(Topic.subject_id == first_sub.id).first()
        continue_learning = {
            "subject": first_sub.name,
            "topic": first_topic.title if first_topic else "Introduction",
            "progress_text": "Get started",
            "progress_pct": 0
        }

    return {
        "full_name": current_user.full_name,
        "greeting": greeting,
        "overall_progress": overall_progress,
        "questions_attempted": unique_attempted_count,
        "total_questions_pool": total_questions_pool,
        "accuracy": accuracy,
        "study_streak_days": streak,
        "today_goal_text": goal_text,
        "today_goal_progress": goal_prog,
        "today_goal_target": goal_target,
        "subject_progress": subject_progress,
        "weak_topics": weak_topics,
        "recent_performance": recent_perf,
        "continue_learning": continue_learning
    }

@router.get("/performance")
def get_performance_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_faculty_or_admin = current_user.role in ["faculty", "admin"]
    
    if is_faculty_or_admin:
        # Department Batch Analytics: strictly aggregate enrolled students
        practice_attempts = db.query(PracticeAttempt).join(User, PracticeAttempt.user_id == User.id).filter(User.role == "student").all()
        test_attempts = db.query(TestAttempt).join(User, TestAttempt.user_id == User.id).filter(User.role == "student").order_by(TestAttempt.created_at.asc()).all()
    else:
        # Individual Student Analytics
        practice_attempts = db.query(PracticeAttempt).filter(PracticeAttempt.user_id == current_user.id).all()
        test_attempts = db.query(TestAttempt).filter(TestAttempt.user_id == current_user.id).order_by(TestAttempt.created_at.asc()).all()

    practice_q_count = len(practice_attempts)
    practice_correct = sum(1 for a in practice_attempts if a.is_correct)

    test_q_count = sum(t.correct_count + t.incorrect_count for t in test_attempts)
    test_correct = sum(t.correct_count for t in test_attempts)

    total_attempted = practice_q_count + test_q_count
    total_correct = practice_correct + test_correct
    accuracy = round((total_correct / total_attempted) * 100, 1) if total_attempted > 0 else 0.0

    # Unique questions attempted
    attempted_qids = set(pa.question_id for pa in practice_attempts if pa.question_id)
    for ta in test_attempts:
        if isinstance(ta.answers, dict):
            for qid_str, ans in ta.answers.items():
                if ans is not None and str(ans).strip() != "":
                    try:
                        attempted_qids.add(int(qid_str))
                    except (ValueError, TypeError):
                        pass
    unique_attempted_count = len(attempted_qids)

    avg_test_score = round(sum(t.score for t in test_attempts) / len(test_attempts), 1) if test_attempts else 0.0

    # Trend data
    trend_data = []
    for i, t in enumerate(test_attempts[-10:]):
        trend_data.append({
            "test": t.test.title if t.test else f"Test {i + 1}",
            "accuracy": round(t.accuracy, 1),
            "score": round(t.score, 1)
        })

    # Recent tests (reversed - most recent first)
    recent_tests = []
    for t in reversed(test_attempts[-8:]):
        minutes = (t.time_taken_seconds or 0) // 60
        secs = (t.time_taken_seconds or 0) % 60
        time_str = f"{minutes}m {secs}s" if minutes > 0 else f"{secs}s"
        total_m = t.test.total_marks if t.test else 100
        
        display_name = f"{t.user.full_name} ({t.test.title if t.test else 'Mock Test'})" if is_faculty_or_admin and t.user else (t.test.title if t.test else f"Test #{t.test_id}")
        recent_tests.append({
            "name": display_name,
            "student_name": t.user.full_name if t.user else "Student",
            "score": f"{t.score:.1f} / {total_m}",
            "accuracy": f"{t.accuracy:.0f}%",
            "time": time_str,
            "date": t.created_at.strftime("%d %b %Y") if t.created_at else "Recently"
        })

    # Subject performance
    subjects = db.query(Subject).all()
    subject_performance = []
    for s in subjects:
        sub_questions = db.query(Question).filter(Question.subject_id == s.id, Question.status == "published").all()
        sub_q_ids = set(q.id for q in sub_questions)
        total_sub_q = len(sub_q_ids)
        
        # Attempts in this subject
        sub_attempts = [pa for pa in practice_attempts if pa.question_id in sub_q_ids]
        sub_attempted_count = len(set(pa.question_id for pa in sub_attempts))
        sub_prog = round((sub_attempted_count / total_sub_q) * 100) if total_sub_q > 0 else 0
        sub_correct = sum(1 for pa in sub_attempts if pa.is_correct)
        sub_acc = round((sub_correct / len(sub_attempts)) * 100) if sub_attempts else 0
        
        subject_performance.append({
            "subject": s.name,
            "accuracy": f"{sub_acc}%",
            "progress": sub_prog
        })

    total_students = db.query(User).filter(User.role == "student").count()

    return {
        "overall_accuracy": accuracy,
        "questions_attempted": unique_attempted_count,
        "average_test_score": avg_test_score,
        "tests_count": len(test_attempts),
        "total_students": total_students,
        "is_batch_view": is_faculty_or_admin,
        "trend_data": trend_data,
        "subject_performance": subject_performance,
        "recent_tests": recent_tests
    }


