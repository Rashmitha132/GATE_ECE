from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "student"
    department: str = "Electronics & Communication Engineering"
    usn: Optional[str] = None
    phone_number: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    usn: Optional[str] = None
    phone_number: Optional[str] = None
    role: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email_or_usn: str

class ResetPasswordRequest(BaseModel):
    email_or_usn: str
    reset_code: str
    new_password: str

class BroadcastCredentialsRequest(BaseModel):
    default_password: Optional[str] = "GsssGate@2026"
    target_role: Optional[str] = None  # "student", "faculty", or None for all

class UserResponse(UserBase):
    id: int
    status: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TopicResponse(BaseModel):
    id: int
    subject_id: int
    title: str
    order_index: int
    summary: Optional[str] = None
    questions_count: Optional[int] = 0
    class Config:
        from_attributes = True

class SubjectResponse(BaseModel):
    id: int
    name: str
    code: Optional[str] = None
    category: str
    description: Optional[str] = None
    icon_name: str
    topics_count: int
    questions_count: Optional[int] = 0
    progress_percent: Optional[float] = 0.0
    topics: Optional[List[TopicResponse]] = []
    class Config:
        from_attributes = True

class LessonResponse(BaseModel):
    id: int
    topic_id: int
    title: str
    concept_content: Optional[str] = None
    formulae_content: Optional[str] = None
    examples_content: Optional[str] = None
    gate_points_content: Optional[str] = None
    common_mistakes_content: Optional[str] = None
    diagram_url: Optional[str] = None
    diagram_caption: Optional[str] = None
    order_index: int
    class Config:
        from_attributes = True

class QuestionResponse(BaseModel):
    id: int
    subject_id: int
    subject_name: Optional[str] = None
    topic_id: Optional[int] = None
    question_type: str
    difficulty: str
    marks: float
    question_text: str
    options: Optional[List[str]] = []
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    gate_year: Optional[str] = None
    class Config:
        from_attributes = True

class PracticeSubmit(BaseModel):
    question_id: int
    selected_answer: str
    time_taken_seconds: int = 30

class PracticeResultResponse(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: Optional[str] = None
    selected_answer: str

class TestResponse(BaseModel):
    id: int
    title: str
    test_type: str
    subject_id: Optional[int] = None
    duration_minutes: int
    total_marks: int
    total_questions: int
    difficulty: str
    status: Optional[str] = "published"
    year: Optional[int] = None
    paper_url: Optional[str] = None
    answer_key_url: Optional[str] = None
    source_url: Optional[str] = None
    source_name: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class TestSubmit(BaseModel):
    test_id: int
    time_taken_seconds: int
    answers: dict  # {question_id: selected_option}

class TestAttemptResponse(BaseModel):
    id: int
    test_id: int
    test_title: Optional[str] = None
    total_marks: Optional[int] = None
    score: float
    accuracy: float
    total_questions: int
    correct_count: int
    incorrect_count: int
    unanswered_count: int
    time_taken_seconds: int
    created_at: datetime
    class Config:
        from_attributes = True

class ResourceResponse(BaseModel):
    id: int
    title: str
    resource_type: str
    subject_id: int
    subject_name: Optional[str] = None
    author_name: str
    file_url: Optional[str] = None
    file_size_mb: float
    is_downloadable: bool
    created_at: datetime
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    full_name: str
    greeting: str
    overall_progress: float
    questions_attempted: int
    total_questions_pool: int
    accuracy: float
    study_streak_days: int
    today_goal_text: str
    today_goal_progress: int
    today_goal_target: int
    subject_progress: List[dict]
    weak_topics: List[dict]
    recent_performance: List[dict]
    continue_learning: Optional[dict] = None
