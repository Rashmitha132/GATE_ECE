from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from typing import List, Optional

from app.core.database import get_db
from app.models.models import (
    Subject,
    Topic,
    Lesson,
    User,
    Question,
    PracticeAttempt,
)
from app.schemas.schemas import (
    SubjectResponse,
    TopicResponse,
    LessonResponse,
)
from app.core.security import get_current_user, get_optional_current_user

router = APIRouter(prefix="/subjects", tags=["Subjects & Lessons"])


# ---------------------------------------------------------
# GET ALL SUBJECTS
# ---------------------------------------------------------

@router.get("", response_model=List[SubjectResponse])
def get_subjects(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    query = db.query(Subject)

    if category and category.strip().lower() != "all subjects":
        query = query.filter(Subject.category == category)

    subjects = query.order_by(Subject.id.asc()).all()

    attempted_question_ids = set()

    if current_user:
        attempts = (
            db.query(PracticeAttempt.question_id)
            .filter(PracticeAttempt.user_id == current_user.id)
            .all()
        )
        attempted_question_ids = {
            row[0] for row in attempts if row[0] is not None
        }

    sub_q_counts = dict(
        db.query(Question.subject_id, func.count(Question.id))
        .filter(Question.status == "published")
        .group_by(Question.subject_id)
        .all()
    )
    topic_q_counts = dict(
        db.query(Question.topic_id, func.count(Question.id))
        .filter(Question.status == "published", Question.topic_id.isnot(None))
        .group_by(Question.topic_id)
        .all()
    )

    results = []

    for subject in subjects:
        response = SubjectResponse.from_orm(subject)
        response.questions_count = sub_q_counts.get(subject.id, 0)

        if response.topics:
            for top_resp in response.topics:
                top_resp.questions_count = topic_q_counts.get(top_resp.id, 0)

        question_ids = {
            row[0]
            for row in (
                db.query(Question.id)
                .filter(
                    Question.subject_id == subject.id,
                    Question.status == "published",
                )
                .all()
            )
        }

        if question_ids:
            attempted_count = len(
                question_ids.intersection(attempted_question_ids)
            )
            response.progress_percent = round(
                attempted_count / len(question_ids) * 100, 1
            )
        else:
            response.progress_percent = 0.0

        results.append(response)

    return results


# ---------------------------------------------------------
# GET TOPICS FOR A SELECTED SUBJECT
# ---------------------------------------------------------

@router.get("/{subject_id}/topics", response_model=List[TopicResponse])
def get_topics(
    subject_id: int,
    db: Session = Depends(get_db),
):
    # Confirm that the subject exists.
    subject = (
        db.query(Subject)
        .filter(Subject.id == subject_id)
        .first()
    )

    if subject is None:
        raise HTTPException(
            status_code=404,
            detail=f"Subject with ID {subject_id} was not found.",
        )

    # Fetch only topics linked to this subject.
    topics = (
        db.query(Topic)
        .filter(Topic.subject_id == subject.id)
        .order_by(Topic.order_index.asc(), Topic.id.asc())
        .all()
    )

    topic_q_counts = dict(
        db.query(Question.topic_id, func.count(Question.id))
        .filter(Question.status == "published", Question.subject_id == subject_id)
        .group_by(Question.topic_id)
        .all()
    )

    results = []
    for t in topics:
        t_resp = TopicResponse.from_orm(t)
        t_resp.questions_count = topic_q_counts.get(t.id, 0)
        results.append(t_resp)
    return results


# ---------------------------------------------------------
# GET LESSONS FOR A TOPIC
# ---------------------------------------------------------

@router.get(
    "/topics/{topic_id}/lessons",
    response_model=List[LessonResponse],
)
def get_topic_lessons(
    topic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    topic = (
        db.query(Topic)
        .filter(Topic.id == topic_id)
        .first()
    )

    if topic is None:
        raise HTTPException(
            status_code=404,
            detail="Topic not found.",
        )

    lessons = (
        db.query(Lesson)
        .filter(Lesson.topic_id == topic_id)
        .order_by(Lesson.order_index.asc(), Lesson.id.asc())
        .all()
    )

    return lessons


# ---------------------------------------------------------
# GET ONE LESSON
# ---------------------------------------------------------

@router.get("/lessons/{lesson_id}", response_model=LessonResponse)
def get_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lesson = (
        db.query(Lesson)
        .filter(Lesson.id == lesson_id)
        .first()
    )

    if lesson is None:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found.",
        )

    return lesson


# ---------------------------------------------------------
# GET ONE SUBJECT
# Keep this route after the more specific routes above.
# ---------------------------------------------------------

@router.get("/{subject_id}", response_model=SubjectResponse)
def get_subject_detail(
    subject_id: int,
    db: Session = Depends(get_db),
):
    subject = (
        db.query(Subject)
        .filter(Subject.id == subject_id)
        .first()
    )

    if subject is None:
        raise HTTPException(
            status_code=404,
            detail="Subject not found.",
        )

    response = SubjectResponse.from_orm(subject)
    response.questions_count = (
        db.query(Question.id)
        .filter(Question.subject_id == subject_id, Question.status == "published")
        .count()
    )
    topic_q_counts = dict(
        db.query(Question.topic_id, func.count(Question.id))
        .filter(Question.status == "published", Question.subject_id == subject_id)
        .group_by(Question.topic_id)
        .all()
    )
    if response.topics:
        for top_resp in response.topics:
            top_resp.questions_count = topic_q_counts.get(top_resp.id, 0)

    return response