import os
import sys
import json
import sqlite3

if sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

DB_PATH = os.path.join(os.path.dirname(__file__), "gate_ece.db")

VERIFIED_PAPERS = [
    {
        "year": 2025,
        "title": "GATE 2025 ECE Official Paper",
        "test_type": "Previous Year Papers",
        "duration_minutes": 90,
        "total_marks": 100,
        "total_questions": 50,
        "difficulty": "Hard",
        "status": "published",
        "source_name": "IIT Roorkee",
        "source_url": "https://gate2025.iitr.ac.in/",
        "paper_url": "https://gate2025.iitr.ac.in/question-papers.html",
        "answer_key_url": "https://gate2025.iitr.ac.in/question-papers.html",
    },
    {
        "year": 2024,
        "title": "GATE 2024 ECE Official Paper",
        "test_type": "Previous Year Papers",
        "duration_minutes": 90,
        "total_marks": 100,
        "total_questions": 50,
        "difficulty": "Hard",
        "status": "published",
        "source_name": "IISc Bangalore",
        "source_url": "https://gate2024.iisc.ac.in/",
        "paper_url": "https://gate2024.iisc.ac.in/question-papers/",
        "answer_key_url": "https://gate2024.iisc.ac.in/wp-content/uploads/2024/ECKey.pdf",
    },
    {
        "year": 2023,
        "title": "GATE 2023 ECE Official Paper",
        "test_type": "Previous Year Papers",
        "duration_minutes": 90,
        "total_marks": 100,
        "total_questions": 50,
        "difficulty": "Hard",
        "status": "published",
        "source_name": "IIT Kanpur",
        "source_url": "https://gate.iitk.ac.in/",
        "paper_url": "https://gate.iitk.ac.in/",
        "answer_key_url": "https://gate.iitk.ac.in/",
    },
    {
        "year": 2022,
        "title": "GATE 2022 ECE Official Paper",
        "test_type": "Previous Year Papers",
        "duration_minutes": 90,
        "total_marks": 100,
        "total_questions": 50,
        "difficulty": "Medium",
        "status": "published",
        "source_name": "IIT Kharagpur",
        "source_url": "https://gate.iitkgp.ac.in/",
        "paper_url": "https://gate.iitkgp.ac.in/",
        "answer_key_url": "https://gate.iitkgp.ac.in/",
    },
    {
        "year": 2021,
        "title": "GATE 2021 ECE Official Paper",
        "test_type": "Previous Year Papers",
        "duration_minutes": 90,
        "total_marks": 100,
        "total_questions": 50,
        "difficulty": "Medium",
        "status": "published",
        "source_name": "IIT Bombay",
        "source_url": "https://gate.iitb.ac.in/",
        "paper_url": "https://gate.iitb.ac.in/",
        "answer_key_url": "https://gate.iitb.ac.in/",
    },
    {
        "year": 2020,
        "title": "GATE 2020 ECE Official Paper",
        "test_type": "Previous Year Papers",
        "duration_minutes": 90,
        "total_marks": 100,
        "total_questions": 50,
        "difficulty": "Medium",
        "status": "published",
        "source_name": "IIT Delhi",
        "source_url": "https://gate.iitd.ac.in/",
        "paper_url": "https://gate.iitd.ac.in/",
        "answer_key_url": "https://gate.iitd.ac.in/",
    },
    {
        "year": 2019,
        "title": "GATE 2019 ECE Official Paper",
        "test_type": "Previous Year Papers",
        "duration_minutes": 90,
        "total_marks": 100,
        "total_questions": 50,
        "difficulty": "Medium",
        "status": "published",
        "source_name": "IIT Madras",
        "source_url": "https://gate.iitm.ac.in/",
        "paper_url": "https://gate.iitm.ac.in/",
        "answer_key_url": "https://gate.iitm.ac.in/",
    },
]

def migrate_and_seed():
    print(f"Opening database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # 1. Ensure columns exist on tests table
    columns_to_add = [
        ("year", "INTEGER"),
        ("paper_url", "TEXT"),
        ("answer_key_url", "TEXT"),
        ("source_url", "TEXT"),
        ("source_name", "TEXT"),
    ]
    
    c.execute("PRAGMA table_info(tests)")
    existing_cols = {col[1] for col in c.fetchall()}
    
    for col_name, col_type in columns_to_add:
        if col_name not in existing_cols:
            print(f"Adding column '{col_name}' ({col_type}) to 'tests' table...")
            c.execute(f"ALTER TABLE tests ADD COLUMN {col_name} {col_type}")
    conn.commit()

    # Get sample questions for test practice
    c.execute("SELECT id, question_type FROM questions WHERE status = 'published'")
    all_qs = c.fetchall()
    mcq_ids = [q[0] for q in all_qs if str(q[1]).upper() == "MCQ"]
    msq_ids = [q[0] for q in all_qs if str(q[1]).upper() == "MSQ"]
    nat_ids = [q[0] for q in all_qs if str(q[1]).upper() == "NAT"]
    default_50_questions = mcq_ids[:30] + msq_ids[:10] + nat_ids[:10]
    default_q_json = json.dumps(default_50_questions)

    # 2. Seed or update verified papers
    for p in VERIFIED_PAPERS:
        # Check by year or title
        c.execute("SELECT id, questions_list FROM tests WHERE year = ? OR title = ?", (p["year"], p["title"]))
        row = c.fetchone()
        if row:
            test_id, q_list = row
            # If questions_list is empty, attach default 50 questions
            final_q_list = q_list if q_list else default_q_json
            c.execute(
                """
                UPDATE tests
                SET title = ?, test_type = ?, duration_minutes = ?, total_marks = ?, total_questions = ?,
                    difficulty = ?, status = 'published', source_name = ?, source_url = ?,
                    paper_url = ?, answer_key_url = ?, year = ?, questions_list = ?
                WHERE id = ?
                """,
                (
                    p["title"],
                    p["test_type"],
                    p["duration_minutes"],
                    p["total_marks"],
                    p["total_questions"],
                    p["difficulty"],
                    p["source_name"],
                    p["source_url"],
                    p["paper_url"],
                    p["answer_key_url"],
                    p["year"],
                    final_q_list,
                    test_id,
                ),
            )
            print(f"✓ Updated existing test #{test_id}: {p['title']} (Year {p['year']})")
        else:
            c.execute(
                """
                INSERT INTO tests (
                    title, test_type, duration_minutes, total_marks, total_questions,
                    difficulty, status, source_name, source_url, paper_url,
                    answer_key_url, year, questions_list, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, datetime('now'))
                """,
                (
                    p["title"],
                    p["test_type"],
                    p["duration_minutes"],
                    p["total_marks"],
                    p["total_questions"],
                    p["difficulty"],
                    p["source_name"],
                    p["source_url"],
                    p["paper_url"],
                    p["answer_key_url"],
                    p["year"],
                    default_q_json,
                ),
            )
            print(f"✓ Inserted verified test #{c.lastrowid}: {p['title']} (Year {p['year']})")

    conn.commit()

    # Verify count of published Previous Year Papers
    c.execute("SELECT id, year, title, source_name, status, paper_url FROM tests WHERE test_type = 'Previous Year Papers'")
    pyqs = c.fetchall()
    print(f"\nTotal Published Previous Year Papers in Database: {len(pyqs)}")
    for p in pyqs:
        print(f" - [{p[1]}] {p[2]} (Organized by {p[3]} | Status: {p[4]})")
        print(f"   Paper Link: {p[5]}")

    conn.close()
    print("\n✓ Database migration and paper seeding completed successfully!")

if __name__ == "__main__":
    migrate_and_seed()
