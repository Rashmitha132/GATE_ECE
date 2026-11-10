from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.data.seed import seed_database
from app.data.pyq_data import seed_authentic_pyqs
from app.routers import auth, subjects, practice, tests, resources, dashboard

# Create tables
Base.metadata.create_all(bind=engine)

# Auto seed database on import so tables and demo data are always ready
db = SessionLocal()
try:
    seed_database(db)
    seed_authentic_pyqs(db)
finally:
    db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db = SessionLocal()
    try:
        seed_database(db)
        seed_authentic_pyqs(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Backend API for GSSSIETW GATE ECE Learning & Assessment Platform",
    lifespan=lifespan
)

# Configure CORS: Restricted to trusted domains in production, local origins in development
allowed_origins_env = getattr(settings, "ALLOWED_ORIGINS", "")
if allowed_origins_env:
    origins = [orig.strip() for orig in allowed_origins_env.split(",") if orig.strip()]
else:
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(subjects.router, prefix=settings.API_V1_STR)
app.include_router(practice.router, prefix=settings.API_V1_STR)
app.include_router(tests.router, prefix=settings.API_V1_STR)
app.include_router(resources.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "institution": "GSSS Institute of Engineering and Technology for Women, Mysuru",
        "platform": "GATE ECE Preparation Platform",
        "status": "online",
        "docs": "/docs"
    }
