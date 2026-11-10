from sqlalchemy import Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="student")  # student, faculty, admin
    status = Column(String(50), default="approved")  # pending, approved, rejected
    department = Column(String(100), default="Electronics & Communication Engineering")
    usn = Column(String(50), nullable=True)  # University Seat Number e.g. 4GW...
    phone_number = Column(String(50), nullable=True)  # Faculty / User phone contact
    avatar_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    reset_code = Column(String(50), nullable=True)
    reset_code_expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    test_attempts = relationship("TestAttempt", back_populates="user", cascade="all, delete-orphan")
    practice_attempts = relationship("PracticeAttempt", back_populates="user", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("StudyGoal", back_populates="user", cascade="all, delete-orphan")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(20), nullable=True)
    category = Column(String(50), default="Core")  # Core, Electronics, Communication, Control & Systems, Mathematics, Lab
    description = Column(Text, nullable=True)
    icon_name = Column(String(50), default="BookOpen")
    topics_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    topics = relationship("Topic", back_populates="subject", cascade="all, delete-orphan")
    resources = relationship("Resource", back_populates="subject")
    questions = relationship("Question", back_populates="subject")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    title = Column(String(150), nullable=False)
    order_index = Column(Integer, default=1)
    summary = Column(Text, nullable=True)

    subject = relationship("Subject", back_populates="topics")
    lessons = relationship("Lesson", back_populates="topic", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="topic")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    title = Column(String(200), nullable=False)
    
    # 5 Tab Content sections as shown in Reference Screenshot 4:
    concept_content = Column(Text, nullable=True)
    formulae_content = Column(Text, nullable=True)
    examples_content = Column(Text, nullable=True)
    gate_points_content = Column(Text, nullable=True)
    common_mistakes_content = Column(Text, nullable=True)
    
    diagram_url = Column(String(500), nullable=True)
    diagram_caption = Column(String(255), nullable=True)
    order_index = Column(Integer, default=1)
    status = Column(String(50), default="published")  # draft, pending, published

    topic = relationship("Topic", back_populates="lessons")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    question_type = Column(String(20), default="MCQ")  # MCQ, MSQ, NAT
    difficulty = Column(String(20), default="Medium")  # Easy, Medium, Hard
    marks = Column(Float, default=1.0)
    negative_marks = Column(Float, default=0.33)  # 0.33 for 1 mark, 0.66 for 2 marks, 0 for NAT
    
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=True)  # List of string options e.g. ["A", "B", "C", "D"]
    correct_answer = Column(String(255), nullable=False)
    explanation = Column(Text, nullable=True)
    gate_year = Column(String(100), nullable=True)  # e.g. "GATE 2024 – February 2024"
    status = Column(String(50), default="published")

    subject = relationship("Subject", back_populates="questions")
    topic = relationship("Topic", back_populates="questions")


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    test_type = Column(String(50), default="Full Mock Test")  # Full Mock Test, Subject Test, Topic Test, Previous Year Papers
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    duration_minutes = Column(Integer, default=90)
    total_marks = Column(Integer, default=100)
    total_questions = Column(Integer, default=50)
    difficulty = Column(String(20), default="Medium")
    status = Column(String(50), default="published")
    year = Column(Integer, nullable=True)
    paper_url = Column(String(500), nullable=True)
    answer_key_url = Column(String(500), nullable=True)
    source_url = Column(String(500), nullable=True)
    source_name = Column(String(100), nullable=True)
    questions_list = Column(JSON, nullable=True)  # Array of question IDs in sequence
    created_at = Column(DateTime, default=datetime.utcnow)

    attempts = relationship("TestAttempt", back_populates="test", cascade="all, delete-orphan")


class TestAttempt(Base):
    __tablename__ = "test_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    score = Column(Float, default=0.0)
    accuracy = Column(Float, default=0.0)
    total_questions = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)
    unanswered_count = Column(Integer, default=0)
    time_taken_seconds = Column(Integer, default=0)
    answers = Column(JSON, nullable=True)  # {question_id: selected_option}
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="test_attempts")
    test = relationship("Test", back_populates="attempts")


class PracticeAttempt(Base):
    __tablename__ = "practice_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    selected_answer = Column(String(255), nullable=False)
    is_correct = Column(Boolean, nullable=False)
    time_taken_seconds = Column(Integer, default=0)
    attempted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="practice_attempts")
    question = relationship("Question")


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    resource_type = Column(String(50), default="Study Notes")  # Study Notes, Formula Sheets, Previous Year Questions, Reference Material, Video Lectures, Lab / Practical Resources
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    author_name = Column(String(100), default="ECE Faculty")
    file_url = Column(String(500), nullable=True)
    file_size_mb = Column(Float, default=2.4)
    is_downloadable = Column(Boolean, default=True)
    status = Column(String(50), default="published")
    created_at = Column(DateTime, default=datetime.utcnow)

    subject = relationship("Subject", back_populates="resources")


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_type = Column(String(50), nullable=False)  # question, resource, lesson
    item_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="bookmarks")


class StudyGoal(Base):
    __tablename__ = "study_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    goal_text = Column(String(255), default="Solve 50 questions (Any subject)")
    target_count = Column(Integer, default=50)
    completed_count = Column(Integer, default=20)
    target_date = Column(String(50), default="30 Sep 2025")
    is_completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="goals")