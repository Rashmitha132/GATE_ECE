"""
Seed/Populate each of the 11 GATE ECE subjects with at least 50 verified questions.
"""
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import SessionLocal
from app.models.models import Subject, Question
from app.services.question_generator import ensure_subject_questions

def main():
    db = SessionLocal()
    print("=== POPULATING 50+ QUESTIONS PER GATE ECE SUBJECT ===")
    subjects = db.query(Subject).order_by(Subject.id).all()
    for s in subjects:
        existing = db.query(Question).filter(Question.subject_id == s.id, Question.status == "published").count()
        print(f"\nSubject {s.id}: {s.name} - Currently has {existing} questions")
        qs = ensure_subject_questions(db, s.id, required_count=50)
        total = db.query(Question).filter(Question.subject_id == s.id, Question.status == "published").count()
        print(f"  -> Now has {total} questions! (Returned batch: {len(qs)})")
    
    overall_total = db.query(Question).count()
    print(f"\nTotal questions in database: {overall_total}")
    db.close()

if __name__ == "__main__":
    main()
