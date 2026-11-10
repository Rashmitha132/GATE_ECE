from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from typing import List, Optional
from app.core.database import get_db
from app.models.models import Question, PracticeAttempt, User, Bookmark
from app.schemas.schemas import QuestionResponse, PracticeSubmit, PracticeResultResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/practice", tags=["Practice"])

@router.get("/count")
def get_practice_question_count(
    subject_id: Optional[int] = None,
    topic_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    base_query = db.query(Question).filter(Question.status == "published")
    if topic_id:
        base_query = base_query.filter(Question.topic_id == topic_id)
    elif subject_id:
        base_query = base_query.filter(Question.subject_id == subject_id)
    
    query = base_query
    if difficulty and difficulty != "All":
        query = query.filter(Question.difficulty == difficulty)
    
    count = query.count()
    
    diff_counts = {
        "All": base_query.count(),
        "Easy": base_query.filter(Question.difficulty == "Easy").count(),
        "Medium": base_query.filter(Question.difficulty == "Medium").count(),
        "Hard": base_query.filter(Question.difficulty == "Hard").count(),
    }
    
    return {
        "count": count,
        "difficulty_counts": diff_counts,
        "subject_id": subject_id,
        "topic_id": topic_id,
        "difficulty": difficulty
    }

@router.get("/bank-stats")
def get_question_bank_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total = db.query(Question).filter(Question.status == "published").count()
    mcq_count = db.query(Question).filter(Question.status == "published", Question.question_type == "MCQ").count()
    msq_count = db.query(Question).filter(Question.status == "published", Question.question_type == "MSQ").count()
    nat_count = db.query(Question).filter(Question.status == "published", Question.question_type == "NAT").count()
    
    distinct_subjects = db.query(func.count(func.distinct(Question.subject_id))).filter(Question.status == "published").scalar() or 0
    
    easy_count = db.query(Question).filter(Question.status == "published", Question.difficulty == "Easy").count()
    medium_count = db.query(Question).filter(Question.status == "published", Question.difficulty == "Medium").count()
    hard_count = db.query(Question).filter(Question.status == "published", Question.difficulty == "Hard").count()
    
    pyq_count = db.query(Question).filter(Question.status == "published", Question.gate_year.isnot(None), Question.gate_year != "").count()

    return {
        "total_questions": total,
        "subjects_covered": distinct_subjects,
        "mcq_count": mcq_count,
        "msq_count": msq_count,
        "nat_count": nat_count,
        "advanced_count": msq_count + nat_count,
        "easy_count": easy_count,
        "medium_count": medium_count,
        "hard_count": hard_count,
        "pyq_count": pyq_count
    }

@router.get("/questions", response_model=List[QuestionResponse])
def get_practice_questions(
    subject_id: Optional[int] = None,
    topic_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    question_type: Optional[str] = None,
    limit: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.services.question_generator import ensure_topic_questions, ensure_subject_questions

    # If limit is not explicitly provided, faculty gets full repository view (up to 2500), student gets 50
    effective_limit = limit
    if effective_limit is None or effective_limit == 0:
        if current_user.role in ["faculty", "admin"]:
            effective_limit = 2500
        else:
            effective_limit = 50

    if topic_id:
        existing_topic_count = db.query(Question).filter(
            Question.topic_id == topic_id,
            Question.status == "published"
        ).count()
        if existing_topic_count < effective_limit:
            try:
                ensure_topic_questions(db, topic_id, required_count=effective_limit)
            except Exception as e:
                print(f"Practice topic question generation notice: {e}")

    elif subject_id:
        existing_sub_count = db.query(Question).filter(
            Question.subject_id == subject_id,
            Question.status == "published"
        ).count()
        if existing_sub_count < effective_limit:
            try:
                ensure_subject_questions(db, subject_id, required_count=effective_limit)
            except Exception as e:
                print(f"Practice subject question generation notice: {e}")

    query = db.query(Question).filter(Question.status == "published")
    if subject_id:
        query = query.filter(Question.subject_id == subject_id)
    if topic_id:
        query = query.filter(Question.topic_id == topic_id)
    if difficulty and difficulty != "All":
        query = query.filter(Question.difficulty == difficulty)
    if question_type and question_type != "All":
        query = query.filter(Question.question_type == question_type)

    if current_user.role not in ["faculty", "admin"]:
        query = query.order_by(func.random())
    else:
        query = query.order_by(Question.id.asc())
        
    questions = query.limit(effective_limit).all()

    # Fallback to subject questions if topic is empty
    if not questions and topic_id and subject_id:
        fallback_query = db.query(Question).filter(
            Question.status == "published",
            Question.subject_id == subject_id
        )
        if difficulty and difficulty != "All":
            fallback_query = fallback_query.filter(Question.difficulty == difficulty)
        if question_type and question_type != "All":
            fallback_query = fallback_query.filter(Question.question_type == question_type)
        if current_user.role not in ["faculty", "admin"]:
            fallback_query = fallback_query.order_by(func.random())
        else:
            fallback_query = fallback_query.order_by(Question.id.asc())
        questions = fallback_query.limit(effective_limit).all()
        if current_user.role not in ["faculty", "admin"]:
            fallback_query = fallback_query.order_by(func.random())
        questions = fallback_query.limit(limit).all()

    results = []
    for q in questions:
        item = QuestionResponse.from_orm(q)
        if q.subject:
            item.subject_name = q.subject.name
        if q.gate_year:
            item.gate_year = q.gate_year
        if current_user.role in ["faculty", "admin"]:
            item.correct_answer = q.correct_answer
            item.explanation = q.explanation
        else:
            item.correct_answer = None
            item.explanation = None
        results.append(item)
    return results

@router.post("/questions")
def create_question(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["faculty", "admin"]:
        raise HTTPException(status_code=403, detail="Faculty or Admin access required")
    
    topic_id_raw = payload.get("topic_id")
    topic_id = None
    if topic_id_raw not in (None, "", "null", 0, "0"):
        try:
            topic_id = int(topic_id_raw)
        except (ValueError, TypeError):
            topic_id = None

    q = Question(
        subject_id=int(payload.get("subject_id", 1)),
        topic_id=topic_id,
        question_text=payload.get("question_text", ""),
        question_type=payload.get("question_type", "MCQ"),
        difficulty=payload.get("difficulty", "Medium"),
        marks=float(payload.get("marks", 1.0)),
        options=payload.get("options", []),
        correct_answer=payload.get("correct_answer", ""),
        explanation=payload.get("explanation", ""),
        gate_year=payload.get("gate_year", "Faculty Contribution"),
        status="published"
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return {"message": "Question authored and saved to database successfully", "id": q.id}


@router.post("/submit", response_model=PracticeResultResponse)
def submit_practice_question(
    attempt_in: PracticeSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    question = db.query(Question).filter(Question.id == attempt_in.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    is_correct = (attempt_in.selected_answer.strip() == question.correct_answer.strip())
    
    # Record attempt
    pa = PracticeAttempt(
        user_id=current_user.id,
        question_id=question.id,
        selected_answer=attempt_in.selected_answer,
        is_correct=is_correct,
        time_taken_seconds=attempt_in.time_taken_seconds
    )
    db.add(pa)
    db.commit()
    
    return {
        "is_correct": is_correct,
        "correct_answer": question.correct_answer,
        "explanation": question.explanation,
        "selected_answer": attempt_in.selected_answer
    }

@router.get("/saved")
def get_saved_questions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookmarks = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.item_type == "question"
    ).order_by(Bookmark.created_at.desc()).all()
    
    question_ids = [b.item_id for b in bookmarks]
    if not question_ids:
        return []
    
    questions = db.query(Question).filter(Question.id.in_(question_ids)).all()
    q_map = {q.id: q for q in questions}
    
    results = []
    for b in bookmarks:
        q = q_map.get(b.item_id)
        if q:
            results.append({
                "id": q.id,
                "bookmark_id": b.id,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "difficulty": q.difficulty,
                "marks": q.marks,
                "options": q.options or [],
                "subject_id": q.subject_id,
                "subject_name": q.subject.name if q.subject else "Core ECE",
                "topic_id": q.topic_id,
                "topic_title": q.topic.title if q.topic else None,
                "gate_year": q.gate_year,
                "created_at": b.created_at.isoformat() if b.created_at else None
            })
    return results

@router.post("/saved/{question_id}")
def toggle_saved_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.item_type == "question",
        Bookmark.item_id == question_id
    ).first()
    
    if existing:
        db.delete(existing)
        db.commit()
        return {"saved": False, "question_id": question_id, "message": "Question removed from saved"}
    else:
        q = db.query(Question).filter(Question.id == question_id).first()
        if not q:
            raise HTTPException(status_code=404, detail="Question not found")
        b = Bookmark(
            user_id=current_user.id,
            item_type="question",
            item_id=question_id
        )
        db.add(b)
        db.commit()
        return {"saved": True, "question_id": question_id, "message": "Question saved successfully"}


@router.get("/stats")
def get_practice_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.models import Subject, Topic
    attempts = db.query(PracticeAttempt).filter(PracticeAttempt.user_id == current_user.id).order_by(PracticeAttempt.attempted_at.desc()).all()
    
    total_q = len(attempts)
    correct_q = sum(1 for a in attempts if a.is_correct)
    accuracy = round((correct_q / total_q) * 100, 1) if total_q > 0 else 0.0
    total_seconds = sum(a.time_taken_seconds or 0 for a in attempts)
    
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    if hours > 0:
        time_spent_str = f"{hours}h {minutes}m"
    elif minutes > 0:
        time_spent_str = f"{minutes} mins"
    else:
        time_spent_str = "0 mins"

    # Recent activity
    recent_activity = []
    for a in attempts[:6]:
        q = a.question
        sub_name = q.subject.name if (q and q.subject) else "Practice Question"
        topic_title = q.topic.title if (q and q.topic) else "General"
        recent_activity.append({
            "title": f"{sub_name} ({topic_title})",
            "date": a.attempted_at.strftime("%d %b %Y") if a.attempted_at else "Recently",
            "is_correct": a.is_correct,
            "status": "Correct" if a.is_correct else "Incorrect"
        })

    # Continue where you left off
    last_left_off = None
    if attempts:
        last = attempts[0]
        l_q = last.question
        if l_q and l_q.subject:
            last_left_off = {
                "subject": l_q.subject.name,
                "topic": l_q.topic.title if l_q.topic else "Core Practice",
                "question_id": l_q.id
            }

    # Quick Access Subjects with real DB counts and user progress
    subjects = db.query(Subject).all()
    user_attempted_q_ids = set(a.question_id for a in attempts)
    quick_access = []
    for s in subjects[:5]:
        sub_questions = db.query(Question.id).filter(Question.subject_id == s.id, Question.status == "published").all()
        sub_q_ids = set(q[0] for q in sub_questions)
        total_sub_q = len(sub_q_ids)
        attempted_sub_q = len(sub_q_ids.intersection(user_attempted_q_ids))
        prog = round((attempted_sub_q / total_sub_q) * 100) if total_sub_q > 0 else 0
        quick_access.append({
            "name": s.name,
            "progress": prog,
            "count": f"{total_sub_q} questions"
        })

    return {
        "total_questions": total_q,
        "correct_answers": correct_q,
        "accuracy": accuracy,
        "time_spent": time_spent_str,
        "recent_activity": recent_activity,
        "continue_left_off": last_left_off,
        "quick_access": quick_access
    }
