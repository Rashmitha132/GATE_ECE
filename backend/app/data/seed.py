from sqlalchemy.orm import Session
from app.models.models import User, Subject, Topic, Lesson, Question, Test, Resource, StudyGoal, TestAttempt, PracticeAttempt
from app.core.security import get_password_hash
from datetime import datetime, timedelta

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).filter(User.email == "student@gsssietw.ac.in").first():
        return {"message": "Database already seeded."}

    # 1. Create Default Users (Generic student account, plus faculty and admin)
    student = User(
        email="student@gsssietw.ac.in",
        hashed_password=get_password_hash("password123"),
        full_name="ECE Student",
        role="student",
        status="approved",
        department="Electronics & Communication Engineering",
        usn="4GW22EC001",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        is_active=True
    )

    faculty = User(
        email="faculty.ece@gsssietw.ac.in",
        hashed_password=get_password_hash("faculty123"),
        full_name="ECE Faculty Member",
        role="faculty",
        status="approved",
        department="Electronics & Communication Engineering",
        usn="FAC-ECE-01",
        is_active=True
    )

    admin = User(
        email="admin@gsssietw.ac.in",
        hashed_password=get_password_hash("admin123"),
        full_name="Administrator GSSSIETW",
        role="admin",
        status="approved",
        department="Academic Administration",
        is_active=True
    )

    db.add_all([student, faculty, admin])
    db.commit()
    db.refresh(student)

    # 2. Seed All 10 GATE ECE Subjects matching Reference Screenshots exactly
    subjects_data = [
        {
            "name": "Engineering Mathematics",
            "code": "MA",
            "category": "Mathematics",
            "description": "Calculus, Linear Algebra, Probability & Statistics, Differential Equations",
            "icon_name": "Sigma",
            "topics_count": 8
        },
        {
            "name": "Network Theory",
            "code": "NT",
            "category": "Core Subjects",
            "description": "Network Analysis, Graph Theory, Transient Response, Two-port Networks",
            "icon_name": "Network",
            "topics_count": 6
        },
        {
            "name": "Signals & Systems",
            "code": "SS",
            "category": "Core Subjects",
            "description": "Signals, LTI Systems, Fourier Analysis, Z-Transforms, Laplace",
            "icon_name": "Activity",
            "topics_count": 7
        },
        {
            "name": "Electronic Devices",
            "code": "EDC",
            "category": "Electronics",
            "description": "Semiconductors, Diodes, Transistors (BJT & MOSFET), Carrier Transport",
            "icon_name": "Cpu",
            "topics_count": 7
        },
        {
            "name": "Analog Circuits",
            "code": "AC",
            "category": "Electronics",
            "description": "Amplifiers, Oscillators, Feedback, Op-Amps, Rectifiers, Voltage Regulators",
            "icon_name": "Zap",
            "topics_count": 6
        },
        {
            "name": "Digital Circuits",
            "code": "DC",
            "category": "Electronics",
            "description": "Logic Gates, Flip-Flops, Number Systems, Counters, Microprocessors",
            "icon_name": "Binary",
            "topics_count": 6
        },
        {
            "name": "Control Systems",
            "code": "CS",
            "category": "Control & Systems",
            "description": "Transfer Functions, Stability, Root Locus, Bode Plots, State-Space",
            "icon_name": "Settings",
            "topics_count": 6
        },
        {
            "name": "Communication Systems",
            "code": "COMM",
            "category": "Communication",
            "description": "AM/FM, Modulation, Wave Propagation, Digital Comm, Noise Analysis",
            "icon_name": "Radio",
            "topics_count": 7
        },
        {
            "name": "Electromagnetics (EMFT)",
            "code": "EMFT",
            "category": "Core Subjects",
            "description": "Fields, Waves, Transmission Lines, Waveguides, Antennas",
            "icon_name": "Compass",
            "topics_count": 5
        },
        {
            "name": "Electronics Devices Lab",
            "code": "LAB",
            "category": "Lab",
            "description": "Experiments, Viva, Practical Concepts, Circuit Testing",
            "icon_name": "FlaskConical",
            "topics_count": 4
        }
    ]

    subject_objects = {}
    for s_item in subjects_data:
        sub = Subject(**s_item)
        db.add(sub)
        db.commit()
        db.refresh(sub)
        subject_objects[sub.name] = sub

    # 3. Seed Topics & Lessons (Analog Circuits -> Semiconductor Diodes detailed matching Screen 4)
    ac_sub = subject_objects["Analog Circuits"]
    topic_diodes = Topic(
        subject_id=ac_sub.id,
        title="Semiconductor Diodes",
        order_index=1,
        summary="Structure of p-n junction, V-I characteristics, Rectifiers, Zener diode, and applications"
    )
    db.add(topic_diodes)
    db.commit()
    db.refresh(topic_diodes)

    # Detailed Lesson matching Screen 4:
    lesson_diodes = Lesson(
        topic_id=topic_diodes.id,
        title="Diodes — Semiconductor Diodes",
        concept_content="""### 1. Introduction
A diode is a two-terminal semiconductor device that allows current to flow in only one direction. It is made of a p-n junction and works based on the principle of unidirectional conductivity.

#### Key Points:
* **Conducts in forward bias**, blocks in reverse bias.
* **Made of p-type and n-type** semiconductor materials.
* **Widely used** for rectification, wave shaping, protection, and signal processing.

### 2. Types of Diodes
* **Rectifier Diode**: Used for AC to DC conversion with high current handling.
* **Zener Diode**: Designed to operate safely in reverse breakdown, providing precise voltage regulation.
* **LED (Light Emitting Diode)**: Emits light when forward biased via radiative recombination.
* **Photodiode**: Converts light photon energy into electrical current under reverse bias.""",
        formulae_content="""### Essential GATE Formulas:
* **Shockley Diode Equation**:
  $$I = I_0 \\left( e^{\\frac{V}{\\eta V_T}} - 1 \\right)$$
  Where $V_T = \\frac{kT}{q} \\approx 26\\text{ mV}$ at room temperature ($300\\text{ K}$), $\\eta = 1$ for Ge, $\\eta = 2$ for Si.
* **Dynamic Resistance ($r_d$)**:
  $$r_d = \\frac{dV}{dI} = \\frac{\\eta V_T}{I_D}$$
* **Transition Capacitance ($C_T$) under Reverse Bias**:
  $$C_T = \\frac{\\epsilon A}{W} \\propto (V_0 + V_R)^{-1/2}$$ (for abrupt junction)
* **Diffusion Capacitance ($C_D$) under Forward Bias**:
  $$C_D = \\frac{\\tau \\cdot I_D}{\\eta V_T}$$""",
        examples_content="""### Worked GATE Example:
**Question:** In a silicon p-n junction diode at $300\\text{ K}$, reverse saturation current $I_0 = 10\\text{ nA}$. Determine dynamic resistance at forward current of $2.6\\text{ mA}$ (assume $\\eta = 1$).

**Solution:**
1. Dynamic resistance formula:
   $$r_d = \\frac{\\eta V_T}{I_D}$$
2. Given $V_T = 26\\text{ mV} = 0.026\\text{ V}$, $I_D = 2.6\\text{ mA} = 2.6 \\times 10^{-3}\\text{ A}$:
   $$r_d = \\frac{1 \\times 26\\text{ mV}}{2.6\\text{ mA}} = 10\\,\\Omega$$
3. Therefore, small signal dynamic resistance is **10 Ohms**.""",
        gate_points_content="""### High-Yield GATE Focus Areas:
* **Cut-in Voltage**: $0.7\\text{ V}$ for Silicon, $0.3\\text{ V}$ for Germanium.
* **Temperature Coefficient**: Reverse saturation current doubles for every $10^\\circ\\text{C}$ rise in temperature.
* **Zener vs Avalanche Breakdown**:
  * Zener breakdown occurs below $6\\text{ V}$ due to high electric field in heavily doped junctions (Negative temperature coefficient).
  * Avalanche breakdown occurs above $6\\text{ V}$ due to carrier impact ionization (Positive temperature coefficient).""",
        common_mistakes_content="""### Common Mistakes to Avoid in Exam:
* **Forgetting $V_T$ value in mV vs Volts**: Always keep units consistent when calculating exponents.
* **Assuming diode is ideal**: Unless stated as ideal, do not omit the $0.7\\text{ V}$ barrier potential during node voltage analysis.
* **Reverse saturation current sensitivity**: Overlooking that $I_0$ depends heavily on temperature, not on reverse voltage beyond a few tenths of a volt.""",
        diagram_url="/images/diode_pn_diagram.svg",
        diagram_caption="Figure 1: Structure and symbol of a p-n junction diode",
        order_index=1,
        status="published"
    )
    db.add(lesson_diodes)

    # 4. Seed Questions for Practice & Tests across Core Subjects
    questions_data = [
        {
            "subject_id": ac_sub.id,
            "topic_id": topic_diodes.id,
            "question_type": "MCQ",
            "difficulty": "Medium",
            "marks": 1.0,
            "question_text": "A silicon p-n junction diode has a reverse saturation current of 10 nA. At 300 K, what is its dynamic AC resistance when the forward bias current is 2.6 mA? (Take thermal voltage = 26 mV, ideality factor = 1)",
            "options": ["5 Ω", "10 Ω", "20 Ω", "50 Ω"],
            "correct_answer": "10 Ω",
            "explanation": "Dynamic resistance rd = (eta * Vt) / Id = (1 * 26 mV) / 2.6 mA = 10 Ohms.",
            "gate_year": "GATE 2022"
        },
        {
            "subject_id": ac_sub.id,
            "topic_id": topic_diodes.id,
            "question_type": "MCQ",
            "difficulty": "Easy",
            "marks": 1.0,
            "question_text": "Which of the following breakdown mechanisms possesses a negative temperature coefficient of breakdown voltage?",
            "options": ["Avalanche Breakdown", "Zener Breakdown", "Thermal Runaway", "Dielectric Breakdown"],
            "correct_answer": "Zener Breakdown",
            "explanation": "In Zener breakdown (heavily doped, < 6V), valence electrons gain thermal energy causing breakdown at lower voltages as temp increases, hence negative temperature coefficient.",
            "gate_year": "GATE 2020"
        },
        {
            "subject_id": subject_objects["Control Systems"].id,
            "topic_id": None,
            "question_type": "MCQ",
            "difficulty": "Medium",
            "marks": 2.0,
            "question_text": "The open-loop transfer function of a unity negative feedback system is G(s) = K / [s(s + 2)(s + 4)]. The value of K for which the system is marginally stable is:",
            "options": ["24", "48", "96", "12"],
            "correct_answer": "48",
            "explanation": "Characteristic equation is s(s+2)(s+4) + K = 0 => s^3 + 6s^2 + 8s + K = 0. Routh-Hurwitz array shows row s^1 is (48 - K)/6. For marginal stability, 48 - K = 0 => K = 48.",
            "gate_year": "GATE 2023"
        },
        {
            "subject_id": subject_objects["Network Theory"].id,
            "topic_id": None,
            "question_type": "MCQ",
            "difficulty": "Medium",
            "marks": 1.0,
            "question_text": "Maximum power is transferred from a source with internal impedance Z_s = (10 + j15) Ω to a load with impedance Z_L. The value of load impedance Z_L must be:",
            "options": ["(10 + j15) Ω", "(10 - j15) Ω", "10 Ω", "18 Ω"],
            "correct_answer": "(10 - j15) Ω",
            "explanation": "By Maximum Power Transfer Theorem for AC circuits, Z_L must be equal to the complex conjugate of Z_s: Z_L = 10 - j15 Ohms.",
            "gate_year": "GATE 2021"
        },
        {
            "subject_id": subject_objects["Digital Circuits"].id,
            "topic_id": None,
            "question_type": "MCQ",
            "difficulty": "Easy",
            "marks": 1.0,
            "question_text": "The minimal boolean expression for the function F(A, B, C) = Σm(0, 1, 2, 3) is:",
            "options": ["A'", "B'", "C'", "A'B'"],
            "correct_answer": "A'",
            "explanation": "Min-terms 0, 1, 2, 3 correspond to A = 0 regardless of B and C. Hence F = A'.",
            "gate_year": "GATE 2019"
        },
        {
            "subject_id": subject_objects["Signals & Systems"].id,
            "topic_id": None,
            "question_type": "MCQ",
            "difficulty": "Medium",
            "marks": 2.0,
            "question_text": "The Fourier transform of a rectangular pulse of width T and amplitude A centered at origin is:",
            "options": ["AT sinc(fT)", "A sinc(fT)", "AT cos(2πfT)", "A/(1 + j2πf)"],
            "correct_answer": "AT sinc(fT)",
            "explanation": "Fourier transform of rect(t/T) of height A is AT * sinc(fT) or AT * [sin(πfT)/(πfT)].",
            "gate_year": "GATE 2024"
        }
    ]

    question_objects = []
    for q_item in questions_data:
        q = Question(**q_item)
        db.add(q)
        db.commit()
        db.refresh(q)
        question_objects.append(q)

    # 5. Seed Tests matching Reference Screenshot 6
    tests_data = [
        {
            "title": "Full Mock Test - 1",
            "test_type": "Full Mock Test",
            "subject_id": None,
            "duration_minutes": 90,
            "total_marks": 100,
            "total_questions": 50,
            "difficulty": "Medium",
            "questions_list": [q.id for q in question_objects]
        },
        {
            "title": "Network Theory - Test",
            "test_type": "Subject Test",
            "subject_id": subject_objects["Network Theory"].id,
            "duration_minutes": 75,
            "total_marks": 50,
            "total_questions": 30,
            "difficulty": "Medium",
            "questions_list": [q.id for q in question_objects if q.subject_id == subject_objects["Network Theory"].id]
        },
        {
            "title": "Analog Circuits - Test",
            "test_type": "Subject Test",
            "subject_id": subject_objects["Analog Circuits"].id,
            "duration_minutes": 75,
            "total_marks": 50,
            "total_questions": 30,
            "difficulty": "Easy",
            "questions_list": [q.id for q in question_objects if q.subject_id == subject_objects["Analog Circuits"].id]
        },
        {
            "title": "Control Systems - Test",
            "test_type": "Subject Test",
            "subject_id": subject_objects["Control Systems"].id,
            "duration_minutes": 75,
            "total_marks": 50,
            "total_questions": 30,
            "difficulty": "Hard",
            "questions_list": [q.id for q in question_objects if q.subject_id == subject_objects["Control Systems"].id]
        }
    ]

    for t_item in tests_data:
        t = Test(**t_item)
        db.add(t)

    # 6. Seed Resources matching Reference Screenshot 8
    resources_data = [
        {
            "title": "Network Theory — Topic-wise Notes (PDF)",
            "resource_type": "Study Notes",
            "subject_id": subject_objects["Network Theory"].id,
            "author_name": "Prof. S. Anitha",
            "file_url": "/resources/network_theory_notes.pdf",
            "file_size_mb": 4.2
        },
        {
            "title": "Control Systems — Formula Sheet (PDF)",
            "resource_type": "Formula Sheets",
            "subject_id": subject_objects["Control Systems"].id,
            "author_name": "ECE Faculty, GSSSIETW",
            "file_url": "/resources/control_systems_formulas.pdf",
            "file_size_mb": 1.8
        },
        {
            "title": "GATE 2024 – Electronics & Communication Solved (PDF)",
            "resource_type": "Previous Year Questions",
            "subject_id": subject_objects["Analog Circuits"].id,
            "author_name": "GSSSIETW Faculty Team",
            "file_url": "/resources/gate_2024_ece_solved.pdf",
            "file_size_mb": 6.5
        },
        {
            "title": "Signals & Systems — Video Lecture Series",
            "resource_type": "Video Lectures",
            "subject_id": subject_objects["Signals & Systems"].id,
            "author_name": "NPTEL / GSSS ECE",
            "file_url": "https://nptel.ac.in/courses/ece",
            "file_size_mb": 0.0
        },
        {
            "title": "Analog Integrated Circuits — Reference Textbook Notes",
            "resource_type": "Reference Material",
            "subject_id": subject_objects["Analog Circuits"].id,
            "author_name": "Sedra & Smith Study Digest",
            "file_url": "/resources/sedra_smith_digest.pdf",
            "file_size_mb": 8.1
        },
        {
            "title": "Microcontrollers & Embedded Systems Lab Guide",
            "resource_type": "Lab / Practical Resources",
            "subject_id": subject_objects["Electronics Devices Lab"].id,
            "author_name": "Prof. Manjula Devi",
            "file_url": "/resources/embedded_lab_guide.pdf",
            "file_size_mb": 3.7
        }
    ]

    for r_item in resources_data:
        r = Resource(**r_item)
        db.add(r)

    # 7. Seed Initial Student Activity for ECE Student
    goal = StudyGoal(
        user_id=student.id,
        goal_text="Solve 50 questions (Any subject)",
        target_count=50,
        completed_count=20,
        target_date="30 Sep 2025"
    )
    db.add(goal)

    # Practice attempt for student
    for q in question_objects:
        pa = PracticeAttempt(
            user_id=student.id,
            question_id=q.id,
            selected_answer=q.correct_answer,
            is_correct=True,
            time_taken_seconds=45,
            attempted_at=datetime.utcnow() - timedelta(days=1)
        )
        db.add(pa)

    db.commit()
    return {"message": "Database seeded successfully with GSSSIETW syllabus and student profile."}
