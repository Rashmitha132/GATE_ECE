# GATE ECE — Complete College GATE Preparation Platform
### GSSS Institute of Engineering and Technology for Women (GSSSIETW), Mysuru

This platform is a full-stack, production-quality GATE ECE preparation and assessment web application crafted to faithfully mirror the institutional UI/UX design specifications.

---

## 🏛️ System Architecture

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7, Lucide Icons, Recharts, TanStack Query, Axios.
* **Backend**: FastAPI (Python 3.14), SQLAlchemy 2.x, Pydantic v2, SQLite (local development) / PostgreSQL (production), JWT security & RBAC.
* **Design Identity**: GSSSIETW Deep Burgundy (`#701a2b`), Rose highlights (`#fbf5f5`, `#f7ebeb`), Editorial Serif Headings, High-resolution Indian female engineering student hero imagery.

---

## 📸 Implemented Screens (Matching Reference Screenshots)

1. **Public Landing Page** (`/`): GSSSIETW institutional header, hero image banner, core subjects grid, platform pillars, progress CTA.
2. **Student Dashboard** (`/dashboard`): Daily goal tracker, donut progress chart, continue learning card, quick actions, subject bars, weak topics diagnostics, streak, recent tests.
3. **Subjects Screen** (`/subjects`): Syllabus browser for all 10 GATE ECE subjects (Maths, Networks, Signals, EDC, Analog, Digital, Controls, Communications, EMFT, Lab), category pills, subject search, quick revision links.
4. **Learn Screen** (`/learn`): "Concepts Made Simple" view with 5 content tabs (*Concept, Formulae, Examples, GATE Points, Common Mistakes*), circuit schematics, and interactive practice triggers.
5. **Practice Screen** (`/practice`): Mixed questions (50 Qs), subject practice, topic practice, saved questions, instant answer validation, step-by-step explanations, recent activity.
6. **Tests Screen** (`/tests`): Live timed mock tests (90 mins), GATE negative marking scheme evaluation (+1 / -0.33), question navigation, and real-time score calculation.
7. **Performance Analytics** (`/performance`): Recharts trend graph across attempts, readiness meter, strengths vs. weak topics diagnostics, test history.
8. **Study Resources Library** (`/resources`): Searchable library with filters for Study Notes, Formula Sheets, PYQs, Textbooks, Video Lectures, and Lab Guides.
9. **Faculty & Admin Portals** (`/faculty`, `/admin`): Role-protected dashboards for authoring questions, publishing resources, and reviewing student registrations.

---

## 🚀 Local Development Setup

### 1. Prerequisites
* **Node.js** (v18+ or v20+) and **npm**
* **Python** (v3.10+ to v3.14)

### 2. Backend Setup
```bash
cd backend

# Create & activate virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt # or pip install fastapi uvicorn pydantic email-validator sqlalchemy alembic pytest httpx python-multipart passlib[bcrypt] python-jose[cryptography] python-dotenv

# Run backend server
uvicorn app.main:app --reload --port 8000
```
*Backend API docs will be available at:* `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd ../frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
*Frontend application will be available at:* `http://localhost:5173`

---

## 🔑 Default Seeded Demo Accounts

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Student** | `student@gsss.edu.in` | `student123` | Student account for practice, tests, and tracking |
| **Faculty** | `faculty.ece@gsssietw.ac.in` | `faculty123` | Can author questions and publish resources |
| **Admin** | `admin@gsssietw.ac.in` | `admin123` | Can approve user registrations and manage roles |

---

## ☁️ Deployment Instructions

### Frontend (Vercel)
1. Push repository to GitHub.
2. Link the repository to [Vercel](https://vercel.com).
3. Set the Root Directory to `frontend`.
4. Configure Build Command: `npm run build`, Output Directory: `dist`.
5. Set Environment Variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`.

### Backend (Render)
1. Link repository to [Render](https://render.com) as a Web Service.
2. Set Root Directory to `backend`.
3. Set Build Command: `pip install -r requirements.txt`.
4. Set Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
5. Add Environment Variables from `.env.example`.

### Database & Storage (Supabase)
1. Create a project at [Supabase](https://supabase.com).
2. Copy the Connection String into `DATABASE_URL` in your backend environment variables.
3. FastAPI will automatically connect and create all tables and relationships on boot.
