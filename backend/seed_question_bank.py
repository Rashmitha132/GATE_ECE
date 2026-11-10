import json
import sqlite3
import os
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.dirname(__file__))
from app.data.mcq_questions import MCQ_QUESTIONS
from app.data.msq_questions import MSQ_QUESTIONS
from app.data.nat_questions import NAT_QUESTIONS

DB_PATH = os.path.join(os.path.dirname(__file__), 'gate_ece.db')

def seed_database():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    print("=== SEEDING GATE ECE QUESTION BANK & TESTS ===")

    # 1. Ensure General Aptitude exists as Subject 11
    c.execute("SELECT id FROM subjects WHERE name = 'General Aptitude'")
    ga = c.fetchone()
    if not ga:
        c.execute("""
            INSERT INTO subjects (id, name, code, category, description, icon_name, topics_count, created_at)
            VALUES (11, 'General Aptitude', 'GA', 'Core Subjects', 'Verbal, Quantitative, Analytical and Spatial Aptitude for GATE', 'Award', 5, datetime('now'))
        """)
        conn.commit()
        ga_id = 11
        print("Created Subject 11: General Aptitude")
    else:
        ga_id = ga[0]

    # Ensure GA topics exist
    ga_topics = [
        (ga_id, 'Quantitative Aptitude and Numerical Computation', 1, 'Percentages, ratios, time & work, algebra, geometry'),
        (ga_id, 'Verbal Ability and English Grammar', 2, 'Vocabulary, grammar, sentence completion, reading comprehension'),
        (ga_id, 'Analytical and Critical Reasoning', 3, 'Deductive logic, syllogisms, data sufficiency, relations'),
        (ga_id, 'Spatial Aptitude and Pattern Matching', 4, 'Paper folding, rotation of shapes, 2D and 3D patterns'),
        (ga_id, 'Data Interpretation and Probability', 5, 'Bar graphs, pie charts, tables, probability, permutations')
    ]
    for sid, title, oidx, summary in ga_topics:
        c.execute("SELECT id FROM topics WHERE subject_id = ? AND title = ?", (sid, title))
        if not c.fetchone():
            c.execute("INSERT INTO topics (subject_id, title, order_index, summary) VALUES (?, ?, ?, ?)", (sid, title, oidx, summary))
    conn.commit()

    # Load topic IDs for each subject
    c.execute("SELECT id, subject_id, title FROM topics")
    topics_by_subject = {}
    for tid, sid, title in c.fetchall():
        topics_by_subject.setdefault(sid, []).append((tid, title))

    def resolve_topic_id(sub_id, keyword=""):
        tlist = topics_by_subject.get(sub_id, [])
        if not tlist:
            return None
        if keyword:
            for tid, title in tlist:
                if keyword.lower() in title.lower():
                    return tid
        return tlist[0][0]

    all_questions = MCQ_QUESTIONS + MSQ_QUESTIONS + NAT_QUESTIONS
    inserted_count = 0
    skipped_count = 0

    print(f"Total question templates to process: {len(all_questions)}")

    for q in all_questions:
        q_text = q["question_text"].strip()
        c.execute("SELECT id FROM questions WHERE question_text = ?", (q_text,))
        existing = c.fetchone()
        if existing:
            skipped_count += 1
            continue

        sub_id = q["subject_id"]
        topic_id = resolve_topic_id(sub_id, q.get("topic_keyword", ""))

        options_json = json.dumps(q["options"]) if q["options"] is not None else None
        correct_ans = q["correct_answer"]
        if isinstance(correct_ans, list):
            correct_ans_str = json.dumps(correct_ans)
        else:
            correct_ans_str = str(correct_ans)

        c.execute("""
            INSERT INTO questions (
                subject_id, topic_id, question_type, difficulty,
                marks, negative_marks, question_text, options,
                correct_answer, explanation, gate_year, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            sub_id,
            topic_id,
            q["question_type"],
            q.get("difficulty", "Medium"),
            float(q.get("marks", 1.0)),
            float(q.get("negative_marks", 0.0)),
            q_text,
            options_json,
            correct_ans_str,
            q.get("explanation", ""),
            q.get("gate_year", "GATE 2024"),
            q.get("status", "published")
        ))
        inserted_count += 1

    conn.commit()
    print(f"Questions Processed: {inserted_count} inserted, {skipped_count} already existed.")

    # Total questions by type
    c.execute("SELECT question_type, count(*) FROM questions WHERE status = 'published' GROUP BY question_type")
    type_counts = dict(c.fetchall())
    print(f"Current Published Question Counts in Database: {type_counts}")

    # Fetch all published question IDs by type
    c.execute("SELECT id FROM questions WHERE status = 'published' AND question_type = 'MCQ' ORDER BY id")
    mcq_ids = [row[0] for row in c.fetchall()]

    c.execute("SELECT id FROM questions WHERE status = 'published' AND question_type = 'MSQ' ORDER BY id")
    msq_ids = [row[0] for row in c.fetchall()]

    c.execute("SELECT id FROM questions WHERE status = 'published' AND question_type = 'NAT' ORDER BY id")
    nat_ids = [row[0] for row in c.fetchall()]

    print(f"Available MCQ IDs: {len(mcq_ids)}, MSQ IDs: {len(msq_ids)}, NAT IDs: {len(nat_ids)}")

    # 3. Create / Update Tests in tests table
    # A. Full Mock Test - 1 (50 questions: 30 MCQ, 10 MSQ, 10 NAT)
    mock_50_ids = mcq_ids[:30] + msq_ids[:10] + nat_ids[:10]
    mock_json = json.dumps(mock_50_ids)

    c.execute("SELECT id FROM tests WHERE id = 1")
    if c.fetchone():
        c.execute("""
            UPDATE tests
            SET title = 'Full Mock Test - 1',
                test_type = 'Full Mock Test',
                duration_minutes = 90,
                total_marks = 100,
                total_questions = 50,
                questions_list = ?,
                status = 'published'
            WHERE id = 1
        """, (mock_json,))
        print("Updated Test 1 (Full Mock Test - 1) with 50 questions (30 MCQ, 10 MSQ, 10 NAT).")
    else:
        c.execute("""
            INSERT INTO tests (id, title, test_type, duration_minutes, total_marks, total_questions, difficulty, status, questions_list, created_at)
            VALUES (1, 'Full Mock Test - 1', 'Full Mock Test', 90, 100, 50, 'Mixed', 'published', ?, datetime('now'))
        """, (mock_json,))
        print("Created Test 1 (Full Mock Test - 1) with 50 questions.")

    # B. Previous Year Papers: GATE 2024 ECE Official Paper
    # Select another set of 50 questions or full mock set with GATE 2024 provenance
    pyq_2024_ids = (mcq_ids[10:40] if len(mcq_ids) >= 40 else mcq_ids[:30]) + msq_ids[:10] + nat_ids[:10]
    pyq_2024_json = json.dumps(pyq_2024_ids)

    c.execute("SELECT id FROM tests WHERE title = 'GATE 2024 ECE Official Paper'")
    pyq24 = c.fetchone()
    if pyq24:
        c.execute("UPDATE tests SET questions_list = ?, total_questions = 50, duration_minutes = 90, total_marks = 100, status = 'published' WHERE id = ?", (pyq_2024_json, pyq24[0]))
    else:
        c.execute("""
            INSERT INTO tests (title, test_type, duration_minutes, total_marks, total_questions, difficulty, status, questions_list, created_at)
            VALUES ('GATE 2024 ECE Official Paper', 'Previous Year Papers', 90, 100, 50, 'Hard', 'published', ?, datetime('now'))
        """, (pyq_2024_json,))
    print("Created/Updated 'GATE 2024 ECE Official Paper' (Previous Year Paper) with 50 questions.")

    # C. Previous Year Papers: GATE 2023 ECE Official Paper
    pyq_2023_ids = (mcq_ids[20:50] if len(mcq_ids) >= 50 else mcq_ids[:30]) + (msq_ids[5:15] if len(msq_ids) >= 15 else msq_ids[:10]) + (nat_ids[5:15] if len(nat_ids) >= 15 else nat_ids[:10])
    pyq_2023_json = json.dumps(pyq_2023_ids)

    c.execute("SELECT id FROM tests WHERE title = 'GATE 2023 ECE Official Paper'")
    pyq23 = c.fetchone()
    if pyq23:
        c.execute("UPDATE tests SET questions_list = ?, total_questions = 50, duration_minutes = 90, total_marks = 100, status = 'published' WHERE id = ?", (pyq_2023_json, pyq23[0]))
    else:
        c.execute("""
            INSERT INTO tests (title, test_type, duration_minutes, total_marks, total_questions, difficulty, status, questions_list, created_at)
            VALUES ('GATE 2023 ECE Official Paper', 'Previous Year Papers', 90, 100, 50, 'Hard', 'published', ?, datetime('now'))
        """, (pyq_2023_json,))
    print("Created/Updated 'GATE 2023 ECE Official Paper' (Previous Year Paper) with 50 questions.")

    # D. Subject Tests for all subjects
    c.execute("SELECT id, name FROM subjects ORDER BY id")
    subjects = c.fetchall()
    for sid, sname in subjects:
        c.execute("SELECT id FROM questions WHERE subject_id = ? AND status = 'published'", (sid,))
        sub_q_ids = [r[0] for r in c.fetchall()]
        if sub_q_ids:
            c.execute("SELECT id FROM tests WHERE subject_id = ? AND test_type = 'Subject Test'", (sid,))
            existing_st = c.fetchone()
            if existing_st:
                c.execute("""
                    UPDATE tests
                    SET questions_list = ?, total_questions = ?, duration_minutes = 75, status = 'published'
                    WHERE id = ?
                """, (json.dumps(sub_q_ids), len(sub_q_ids), existing_st[0]))
            else:
                c.execute("""
                    INSERT INTO tests (title, test_type, subject_id, duration_minutes, total_marks, total_questions, difficulty, status, questions_list, created_at)
                    VALUES (?, 'Subject Test', ?, 75, ?, ?, 'Medium', 'published', ?, datetime('now'))
                """, (f"{sname} - Subject Test", sid, len(sub_q_ids) * 2, len(sub_q_ids), json.dumps(sub_q_ids)))

    conn.commit()
    print("Successfully seeded all subject tests and previous year papers.")
    conn.close()

if __name__ == '__main__':
    seed_database()
