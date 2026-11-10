"""
Comprehensive, Syllabus-Strict Question Generation Service for GATE ECE.
Covers all 11 GATE ECE subjects with technically accurate mathematical, numerical (NAT),
multiple choice (MCQ), and multiple select (MSQ) questions.
"""

import math
import random
import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.models import Question, Topic, Subject


def _format_nat(val: float) -> str:
    if abs(val - round(val)) < 1e-5:
        return str(int(round(val)))
    return f"{val:.2f}".rstrip("0").rstrip(".")


class TopicQuestionFactory:
    """
    Factory generating mathematically rigorous, verified GATE ECE questions
    for any syllabus topic with high variation.
    """

    @staticmethod
    def generate_for_topic(subject_id: int, topic: Topic, count: int, existing_texts: set) -> List[Dict[str, Any]]:
        title_lower = topic.title.lower()
        questions = []
        attempts = 0
        max_attempts = max(count * 80, 5000)

        while len(questions) < count and attempts < max_attempts:
            attempts += 1
            seed = random.randint(1, 100000000)
            q_data = TopicQuestionFactory._create_single_question(subject_id, topic, title_lower, seed)
            if not q_data:
                continue

            q_text = q_data["question_text"].strip()
            if q_text in existing_texts:
                continue

            existing_texts.add(q_text)
            questions.append(q_data)

        return questions

    @staticmethod
    def _create_single_question(subject_id: int, topic: Topic, t_title: str, seed: int) -> Optional[Dict[str, Any]]:
        q_types = ["MCQ", "MCQ", "MCQ", "MSQ", "NAT"]
        chosen_type = q_types[seed % len(q_types)]

        if subject_id == 1:
            return TopicQuestionFactory._gen_math_question(subject_id, topic, t_title, chosen_type)
        elif subject_id == 2:
            return TopicQuestionFactory._gen_network_question(subject_id, topic, t_title, chosen_type)
        elif subject_id == 3:
            return TopicQuestionFactory._gen_signals_question(subject_id, topic, t_title, chosen_type)
        elif subject_id == 4:
            return TopicQuestionFactory._gen_edc_question(subject_id, topic, t_title, chosen_type)
        elif subject_id == 5:
            return TopicQuestionFactory._gen_analog_question(subject_id, topic, t_title, chosen_type)
        elif subject_id == 6:
            return TopicQuestionFactory._gen_digital_question(subject_id, topic, t_title, chosen_type)
        elif subject_id == 7:
            return TopicQuestionFactory._gen_control_question(subject_id, topic, t_title, chosen_type)
        elif subject_id == 8:
            return TopicQuestionFactory._gen_comm_question(subject_id, topic, t_title, chosen_type)
        elif subject_id == 9:
            return TopicQuestionFactory._gen_emft_question(subject_id, topic, t_title, chosen_type)
        elif subject_id == 10:
            return TopicQuestionFactory._gen_lab_question(subject_id, topic, t_title, chosen_type)
        elif subject_id == 11:
            return TopicQuestionFactory._gen_aptitude_question(subject_id, topic, t_title, chosen_type)
        return TopicQuestionFactory._gen_math_question(subject_id, topic, t_title, chosen_type)

    # -------------------------------------------------------------
    # 1. ENGINEERING MATHEMATICS GENERATOR
    # -------------------------------------------------------------
    @staticmethod
    def _gen_math_question(subject_id: int, topic: Topic, t_title: str, q_type: str) -> Dict[str, Any]:
        variant = random.randint(0, 12)
        if variant == 0:
            a = random.choice([2, 3, 4, 5, 6, 7, 8, 9])
            b = random.choice([1, 2, 3, 4, 5, 6, 7])
            c = random.choice([0, 1, 2, 3, 4, 5])
            d = random.choice([2, 3, 4, 5, 6, 7, 8, 9])
            det = (a * d) - (b * c)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"For the 2 x 2 matrix A = [[{a}, {b}], [{c}, {d}]], the determinant det(A) is ________ (in integer).",
                "options": None, "correct_answer": str(det),
                "explanation": f"det(A) = ({a} x {d}) - ({b} x {c}) = {a*d} - {b*c} = {det}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 1:
            a = random.choice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            d = random.choice([2, 3, 4, 5, 6, 7, 8, 9, 10, 12])
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"For a 2 x 2 matrix A with diagonal elements a11 = {a} and a22 = {d}, the sum of its eigenvalues (trace) is ________ (in integer).",
                "options": None, "correct_answer": str(a + d),
                "explanation": f"The sum of the eigenvalues of any square matrix equals its trace: trace(A) = {a} + {d} = {a + d}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 2:
            n = random.choice([2, 3, 4, 5, 6])
            k = random.choice([2, 3, 4, 5, 6, 7])
            ans = round(k ** (n + 1) / (n + 1), 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"Evaluate the definite integral integral (from 0 to {k}) x^{n} dx. The value is ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(ans),
                "explanation": f"integral x^{n} dx = [x^{n+1} / ({n}+1)] from 0 to {k} = {k}^{n+1} / {n+1} = {_format_nat(ans)}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 3:
            p = random.choice([0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5])
            n = random.choice([3, 4, 5, 6, 7, 8])
            p_zero = round((1 - p) ** n, 4)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"A fair binomial experiment consists of {n} independent trials with probability of success p = {p}. What is the probability of obtaining exactly zero successes? ________. (Round off to 4 decimal places).",
                "options": None, "correct_answer": f"{p_zero:.4f}",
                "explanation": f"P(X = 0) = (1 - p)^{n} = (1 - {p})^{n} = {p_zero:.4f}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 4:
            a = random.choice([1, 2, 3, 4, 5, 6, 7, 8, 9])
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MCQ",
                "difficulty": "Medium", "marks": 1.0, "negative_marks": 0.33,
                "question_text": f"What is the unilateral Laplace transform of the function f(t) = e^({a}t) u(t)?",
                "options": [f"1 / (s - {a})", f"1 / (s + {a})", f"{a} / (s - {a})", f"1 / s^2"],
                "correct_answer": f"1 / (s - {a})",
                "explanation": f"L{{e^(at) u(t)}} = 1 / (s - a) for Re(s) > a. Here a = {a}, so L{{e^({a}t)}} = 1 / (s - {a}).",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 5:
            w = random.choice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            w2 = w * w
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MCQ",
                "difficulty": "Medium", "marks": 1.0, "negative_marks": 0.33,
                "question_text": f"The general solution of the second-order ODE d^2y/dx^2 + {w2} y = 0 is:",
                "options": [
                    f"C1 cos({w}x) + C2 sin({w}x)",
                    f"C1 e^({w}x) + C2 e^(-{w}x)",
                    f"(C1 + C2 x) e^({w}x)",
                    f"C1 cos({w2}x) + C2 sin({w2}x)"
                ],
                "correct_answer": f"C1 cos({w}x) + C2 sin({w}x)",
                "explanation": f"Auxiliary equation m^2 + {w2} = 0 gives roots m = +- j{w}. Solution is C1 cos({w}x) + C2 sin({w}x).",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 6:
            lam = random.choice([1.2, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 6.0])
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A random variable X follows a Poisson distribution with mean parameter lambda = {lam}. What is the variance Var(X)? ________.",
                "options": None, "correct_answer": _format_nat(lam),
                "explanation": "For a Poisson distribution, Mean = Variance = lambda. Therefore, Var(X) = lambda.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 7:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MSQ",
                "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                "question_text": "Which of the following statements is/are TRUE for any real symmetric matrix A?",
                "options": [
                    "All eigenvalues of A are real numbers.",
                    "Eigenvectors corresponding to distinct eigenvalues of A are mutually orthogonal.",
                    "The matrix A is always invertible.",
                    "A is always diagonalizable by an orthogonal matrix."
                ],
                "correct_answer": json.dumps([
                    "All eigenvalues of A are real numbers.",
                    "Eigenvectors corresponding to distinct eigenvalues of A are mutually orthogonal.",
                    "A is always diagonalizable by an orthogonal matrix."
                ]),
                "explanation": "Real symmetric matrices have real eigenvalues, orthogonal eigenvectors for distinct eigenvalues, and can be orthogonally diagonalized. Invertibility is not guaranteed (eigenvalues can be zero).",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 8:
            k = random.choice([2, 3, 4, 5, 6, 7, 8, 9])
            div_val = 3 * k
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"For the vector field F = {k}x i + {k}y j + {k}z k, the divergence del . F is ________ (in integer).",
                "options": None, "correct_answer": str(div_val),
                "explanation": f"del . F = d({k}x)/dx + d({k}y)/dy + d({k}z)/dz = {k} + {k} + {k} = {div_val}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 9:
            a = random.choice([2, 3, 4, 5, 6, 7, 8])
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"Evaluate the limit L = lim_(x -> 0) [sin({a}x) / x]. The value is ________ (in integer).",
                "options": None, "correct_answer": str(a),
                "explanation": f"lim_(x -> 0) [sin({a}x) / x] = {a} x lim_(x -> 0) [sin({a}x) / ({a}x)] = {a} x 1 = {a}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 10:
            m = random.choice([2, 3, 4, 5, 6, 8])
            c_int = random.choice([1, 2, 3, 4, 5])
            slope = m
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"What is the gradient (slope) dy/dx of the straight line curve y = {m}x + {c_int}? ________ (in integer).",
                "options": None, "correct_answer": str(slope),
                "explanation": f"dy/dx = d({m}x + {c_int})/dx = {m}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 11:
            a_int = random.choice([1, 2, 3, 4, 5])
            b_int = random.choice([6, 7, 8, 9, 10])
            ans = b_int - a_int
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"Evaluate the definite integral integral (from {a_int} to {b_int}) dx. The value is ________ (in integer).",
                "options": None, "correct_answer": str(ans),
                "explanation": f"integral dx = [x] from {a_int} to {b_int} = {b_int} - {a_int} = {ans}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        else:
            n = random.choice([4, 5, 6, 7, 8, 9, 10])
            ncr = math.comb(n, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"How many distinct pairs of items can be selected from a set of {n} items? C({n}, 2) = ________.",
                "options": None, "correct_answer": str(ncr),
                "explanation": f"C({n}, 2) = {n}! / (2! x ({n}-2)!) = ({n} x {n-1}) / 2 = {ncr}.",
                "gate_year": "GATE Standard", "status": "published"
            }

    # -------------------------------------------------------------
    # 2. NETWORK THEORY GENERATOR
    # -------------------------------------------------------------
    @staticmethod
    def _gen_network_question(subject_id: int, topic: Topic, t_title: str, q_type: str) -> Dict[str, Any]:
        variant = random.randint(0, 11)
        if variant == 0:
            r1 = random.choice([4, 6, 8, 10, 12, 15, 20, 24, 30, 40, 50])
            r2 = random.choice([4, 6, 8, 10, 12, 15, 20, 24, 30, 40, 50])
            r_eq = round((r1 * r2) / (r1 + r2), 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"Two resistors R1 = {r1} Ohm and R2 = {r2} Ohm are connected in parallel. The equivalent resistance R_eq in Ohm is ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(r_eq),
                "explanation": f"R_eq = (R1 x R2) / (R1 + R2) = ({r1} x {r2}) / ({r1} + {r2}) = {_format_nat(r_eq)} Ohm.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 1:
            r = random.choice([10, 20, 30, 40, 50, 60, 80, 100, 120])
            c = random.choice([10, 20, 25, 40, 50, 100, 200, 250, 500])
            tau_ms = round(r * c / 1000.0, 3)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A series RC circuit has resistance R = {r} Ohm and capacitance C = {c} uF. The time constant tau in milliseconds (ms) is ________.",
                "options": None, "correct_answer": _format_nat(tau_ms),
                "explanation": f"tau = R x C = {r} Ohm x {c} x 10^-6 F = {tau_ms} ms.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 2:
            vth = random.choice([10, 12, 15, 18, 20, 24, 30, 36, 40, 48, 60])
            rth = random.choice([2, 3, 4, 5, 6, 8, 10, 12, 15])
            pmax = round((vth ** 2) / (4 * rth), 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"A linear active DC network has Thevenin voltage V_th = {vth} V and Thevenin resistance R_th = {rth} Ohm. The maximum power delivered to a variable load resistor R_L is ________ W. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(pmax),
                "explanation": f"P_max = V_th^2 / (4 R_th) = ({vth}^2) / (4 x {rth}) = {_format_nat(pmax)} W when R_L = R_th.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 3:
            l = random.choice([1, 2, 4, 5, 10, 20])
            c = random.choice([1, 2, 4, 5, 10])
            w0 = round(1.0 / math.sqrt(l * c * 1e-6), 1)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"A series RLC resonant circuit has L = {l} mH and C = {c} uF. The resonant angular frequency w0 in rad/s is ________. (Round off to integer).",
                "options": None, "correct_answer": str(int(round(w0))),
                "explanation": f"w0 = 1 / sqrt(LC) = 1 / sqrt({l}x10^-3 x {c}x10^-6) = {int(round(w0))} rad/s.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 4:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MSQ",
                "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                "question_text": "Which of the following conditions is/are REQUIRED for Tellegen's theorem to be valid in an electrical network?",
                "options": [
                    "Kirchhoff's Current Law (KCL) must be satisfied at all nodes.",
                    "Kirchhoff's Voltage Law (KVL) must be satisfied in all loops.",
                    "All circuit components must be strictly linear and bilateral.",
                    "The network graph topology must be identical for both sets of voltages and currents."
                ],
                "correct_answer": json.dumps([
                    "Kirchhoff's Current Law (KCL) must be satisfied at all nodes.",
                    "Kirchhoff's Voltage Law (KVL) must be satisfied in all loops.",
                    "The network graph topology must be identical for both sets of voltages and currents."
                ]),
                "explanation": "Tellegen's theorem depends only on KCL, KVL, and graph topology. It is valid for linear/non-linear, active/passive, and time-variant/invariant elements.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 5:
            z11 = random.choice([10, 15, 20, 25, 30, 40])
            z22 = random.choice([10, 15, 20, 25, 30, 40])
            z12 = random.choice([2, 4, 5, 8, 10])
            det_z = (z11 * z22) - (z12 * z12)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"A reciprocal two-port network has impedance parameters Z11 = {z11} Ohm, Z22 = {z22} Ohm, and Z12 = Z21 = {z12} Ohm. The determinant of the impedance matrix deltaZ in Ohm^2 is ________ (in integer).",
                "options": None, "correct_answer": str(det_z),
                "explanation": f"deltaZ = Z11 Z22 - Z12 Z21 = ({z11} x {z22}) - ({z12} x {z12}) = {det_z} Ohm^2.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 6:
            r = random.choice([5, 10, 15, 20, 25, 30, 40, 50])
            l = random.choice([10, 20, 40, 50, 100, 200])
            tau_ms = round(l / r, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A series RL circuit has resistance R = {r} Ohm and inductance L = {l} mH. What is the circuit time constant tau in milliseconds (ms)? ________.",
                "options": None, "correct_answer": _format_nat(tau_ms),
                "explanation": f"tau = L / R = {l} mH / {r} Ohm = {_format_nat(tau_ms)} ms.",
                "gate_year": "GATE Standard", "status": "published"
            }
        else:
            v_dc = random.choice([10, 15, 20, 24, 30, 36, 48, 60, 72, 100])
            r_load = random.choice([2, 4, 5, 8, 10, 12, 15, 20, 25])
            i_curr = round(v_dc / r_load, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In a DC circuit, a voltage source of {v_dc} V is connected across a resistor of {r_load} Ohm. What is the current flowing in Amperes? ________.",
                "options": None, "correct_answer": _format_nat(i_curr),
                "explanation": f"I = V / R = {v_dc} / {r_load} = {_format_nat(i_curr)} A.",
                "gate_year": "GATE Standard", "status": "published"
            }

    # -------------------------------------------------------------
    # 3. SIGNALS & SYSTEMS GENERATOR
    # -------------------------------------------------------------
    @staticmethod
    def _gen_signals_question(subject_id: int, topic: Topic, t_title: str, q_type: str) -> Dict[str, Any]:
        variant = random.randint(0, 11)
        if variant == 0:
            fm = random.choice([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30])
            fs_nyq = 2 * fm
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A continuous-time signal x(t) has maximum bandwidth (highest frequency component) of f_m = {fm} kHz. The minimum Nyquist sampling rate in kHz to avoid aliasing is ________.",
                "options": None, "correct_answer": str(fs_nyq),
                "explanation": f"Nyquist rate f_s = 2 x f_m = 2 x {fm} kHz = {fs_nyq} kHz.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 1:
            a = random.choice([1, 2, 3, 4, 5, 6, 7, 8, 10])
            energy = round(1.0 / (2 * a), 3)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"Calculate the total energy E of the continuous-time signal x(t) = e^(-{a}t) u(t). The value in Joules is ________. (Round off to 3 decimal places).",
                "options": None, "correct_answer": _format_nat(energy),
                "explanation": f"E = integral |x(t)|^2 dt = integral (from 0 to inf) e^(-2*{a}t) dt = 1 / (2 x {a}) = {_format_nat(energy)} J.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 2:
            n = random.choice([4, 6, 8, 10, 12, 14, 16, 20, 24])
            w0 = round(2 * math.pi / n, 3)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A discrete-time periodic sequence x[n] has fundamental period N = {n}. What is its fundamental digital angular frequency w0 in rad/sample? ________. (Round off to 3 decimal places).",
                "options": None, "correct_answer": _format_nat(w0),
                "explanation": f"w0 = 2*pi / N = 2*pi / {n} = {_format_nat(w0)} rad/sample.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 3:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MSQ",
                "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                "question_text": "Which of the following conditions is/are REQUIRED for an LTI system with impulse response h(t) to be both CAUSAL and STABLE (BIBO)?",
                "options": [
                    "h(t) = 0 for all t < 0",
                    "integral (from -inf to inf) |h(t)| dt < inf (absolutely integrable)",
                    "All poles of its transfer function H(s) must lie strictly in the open left-half s-plane.",
                    "The system must have an equal number of poles and zeros."
                ],
                "correct_answer": json.dumps([
                    "h(t) = 0 for all t < 0",
                    "integral (from -inf to inf) |h(t)| dt < inf (absolutely integrable)",
                    "All poles of its transfer function H(s) must lie strictly in the open left-half s-plane."
                ]),
                "explanation": "Statements A, B, and C define causality and BIBO stability for continuous-time LTI systems.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 4:
            k_val = random.choice([10, 15, 20, 25, 30, 40, 50, 60, 80])
            a_val = random.choice([2, 4, 5, 8, 10, 12, 16])
            fval = round(k_val / a_val, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A stable system has Laplace transform X(s) = {k_val} / [s (s + {a_val})]. By the Final Value Theorem, x(inf) = lim_(t -> inf) x(t) is ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(fval),
                "explanation": f"x(inf) = lim_(s -> 0) s X(s) = {k_val} / {a_val} = {_format_nat(fval)}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 5:
            l1 = random.choice([3, 4, 5, 6, 7, 8])
            l2 = random.choice([3, 4, 5, 6, 7, 8])
            conv_len = l1 + l2 - 1
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"If sequence x[n] has non-zero length {l1} samples and sequence h[n] has non-zero length {l2} samples, the length of their linear convolution y[n] = x[n] * h[n] is ________ samples.",
                "options": None, "correct_answer": str(conv_len),
                "explanation": f"Length of linear convolution = L1 + L2 - 1 = {l1} + {l2} - 1 = {conv_len}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        else:
            w_val = random.choice([10, 20, 50, 100, 200, 500])
            f_hz = round(w_val / (2 * math.pi), 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A sinusoidal signal has angular frequency w = {w_val} rad/s. What is its cyclic frequency f in Hertz (Hz)? ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(f_hz),
                "explanation": f"f = w / (2*pi) = {w_val} / (2*pi) = {_format_nat(f_hz)} Hz.",
                "gate_year": "GATE Standard", "status": "published"
            }

    # -------------------------------------------------------------
    # 4. ELECTRONIC DEVICES (EDC) GENERATOR
    # -------------------------------------------------------------
    @staticmethod
    def _gen_edc_question(subject_id: int, topic: Topic, t_title: str, q_type: str) -> Dict[str, Any]:
        variant = random.randint(0, 11)
        if variant == 0:
            na_exp = random.choice([16, 17, 18])
            nd_exp = random.choice([15, 16, 17])
            vt = 0.026
            ni_sq = 1e20
            na = 10 ** na_exp
            nd = 10 ** nd_exp
            vbi = round(vt * math.log((na * nd) / ni_sq), 3)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"A silicon p-n junction at T = 300 K (V_t = 26 mV, n_i = 10^10 cm^-3) has doping concentrations N_A = 10^{na_exp} cm^-3 and N_D = 10^{nd_exp} cm^-3. The built-in potential V_bi in Volts is ________. (Round off to 3 decimal places).",
                "options": None, "correct_answer": _format_nat(vbi),
                "explanation": f"V_bi = V_t x ln(N_A x N_D / n_i^2) = 0.026 x ln(10^{na_exp + nd_exp} / 10^20) = {_format_nat(vbi)} V.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 1:
            beta = random.choice([40, 50, 60, 80, 100, 120, 150, 180, 200, 250, 300, 400])
            alpha = round(beta / (beta + 1), 4)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A BJT operating in the forward active region has common-emitter current gain beta = {beta}. What is its common-base current gain alpha? ________. (Round off to 4 decimal places).",
                "options": None, "correct_answer": f"{alpha:.4f}",
                "explanation": f"alpha = beta / (beta + 1) = {beta} / ({beta} + 1) = {alpha:.4f}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 2:
            un = random.choice([800, 900, 1000, 1100, 1200, 1300, 1350, 1400, 1500, 1600])
            dn = round(un * 0.0259, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"According to the Einstein relation at room temperature (V_t = 25.9 mV), if electron mobility is mu_n = {un} cm^2/(V.s), the electron diffusion coefficient D_n in cm^2/s is ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(dn),
                "explanation": f"D_n = mu_n x V_t = {un} x 0.0259 = {_format_nat(dn)} cm^2/s.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 3:
            vgs = random.choice([1.8, 2.0, 2.2, 2.5, 3.0, 3.3, 3.5, 4.0, 4.5, 5.0])
            vt = random.choice([0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2])
            vov = round(vgs - vt, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"An n-channel MOSFET with threshold voltage V_th = {vt} V is biased with gate-to-source voltage V_GS = {vgs} V. The overdrive voltage V_ov in Volts is ________.",
                "options": None, "correct_answer": _format_nat(vov),
                "explanation": f"V_ov = V_GS - V_th = {vgs} - {vt} = {_format_nat(vov)} V.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 4:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MSQ",
                "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                "question_text": "Which of the following statements regarding a reverse-biased PN junction diode is/are TRUE?",
                "options": [
                    "The depletion region width increases with increase in reverse bias voltage.",
                    "Depletion capacitance (transition capacitance) decreases with increase in reverse bias voltage.",
                    "The reverse saturation current is strongly dependent on temperature.",
                    "The electric field in the depletion region is maximum at the metallurgical junction."
                ],
                "correct_answer": json.dumps([
                    "The depletion region width increases with increase in reverse bias voltage.",
                    "Depletion capacitance (transition capacitance) decreases with increase in reverse bias voltage.",
                    "The reverse saturation current is strongly dependent on temperature.",
                    "The electric field in the depletion region is maximum at the metallurgical junction."
                ]),
                "explanation": "All four statements correctly describe physical properties of a reverse-biased PN junction.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 5:
            nd_exp = random.choice([15, 16, 17])
            ni_exp = 10
            p_exp = 20 - nd_exp
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In silicon at 300 K with n_i = 10^10 cm^-3, donor doping is N_D = 10^{nd_exp} cm^-3. By mass-action law, the minority hole concentration p in cm^-3 is 10^k, where exponent k is ________ (in integer).",
                "options": None, "correct_answer": str(p_exp),
                "explanation": f"p = n_i^2 / n = 10^20 / 10^{nd_exp} = 10^{p_exp} cm^-3.",
                "gate_year": "GATE Standard", "status": "published"
            }
        else:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MCQ",
                "difficulty": "Medium", "marks": 1.0, "negative_marks": 0.33,
                "question_text": "In a MOSFET operating in saturation, the transconductance g_m is proportional to:",
                "options": [
                    "sqrt(I_D) at constant (W/L)",
                    "I_D^2 at constant (W/L)",
                    "1 / sqrt(I_D)",
                    "Independent of drain current I_D"
                ],
                "correct_answer": "sqrt(I_D) at constant (W/L)",
                "explanation": "In saturation, g_m = sqrt(2 mu C_ox (W/L) I_D), which is directly proportional to sqrt(I_D).",
                "gate_year": "GATE Standard", "status": "published"
            }

    # -------------------------------------------------------------
    # 5. ANALOG CIRCUITS GENERATOR
    # -------------------------------------------------------------
    @staticmethod
    def _gen_analog_question(subject_id: int, topic: Topic, t_title: str, q_type: str) -> Dict[str, Any]:
        variant = random.randint(0, 11)
        if variant == 0:
            rf = random.choice([10, 15, 20, 30, 40, 50, 60, 80, 100, 120, 150, 200])
            r1 = random.choice([1, 2, 4, 5, 10, 15, 20])
            gain = round(rf / r1, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"An ideal Op-Amp inverting amplifier has input resistor R1 = {r1} kOhm and feedback resistor R_f = {rf} kOhm. What is the magnitude of the closed-loop voltage gain |A_v|? ________.",
                "options": None, "correct_answer": _format_nat(gain),
                "explanation": f"|A_v| = R_f / R1 = {rf} / {r1} = {_format_nat(gain)}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 1:
            rf = random.choice([9, 18, 27, 36, 45, 54, 72, 90, 99])
            r1 = random.choice([1, 2, 3, 5, 6, 9, 10, 11])
            gain = round(1 + (rf / r1), 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"An ideal Op-Amp non-inverting amplifier has R1 = {r1} kOhm (grounded) and feedback resistor R_f = {rf} kOhm. What is the closed-loop voltage gain A_v? ________.",
                "options": None, "correct_answer": _format_nat(gain),
                "explanation": f"A_v = 1 + (R_f / R1) = 1 + ({rf} / {r1}) = {_format_nat(gain)}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 2:
            sr = random.choice([0.5, 0.8, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 8.0, 10.0])
            vm = random.choice([2.0, 3.0, 4.0, 5.0, 8.0, 10.0])
            fmax = round((sr * 1e6) / (2 * math.pi * vm) / 1000.0, 1)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"An Op-Amp with slew rate SR = {sr} V/us produces an undistorted sinusoidal output of peak amplitude V_m = {vm} V. What is the full-power bandwidth f_max in kHz? ________. (Round off to 1 decimal place).",
                "options": None, "correct_answer": _format_nat(fmax),
                "explanation": f"SR = 2*pi*f_max*V_m => f_max = SR / (2*pi*V_m) = ({sr} x 10^6) / (2*pi x {vm}) = {_format_nat(fmax)} kHz.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 3:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MSQ",
                "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                "question_text": "Which of the following statements is/are TRUE for an ideal operational amplifier?",
                "options": [
                    "Open-loop voltage gain is infinite.",
                    "Input impedance is infinite and input bias currents are zero.",
                    "Output impedance is zero.",
                    "Common-Mode Rejection Ratio (CMRR) is infinite."
                ],
                "correct_answer": json.dumps([
                    "Open-loop voltage gain is infinite.",
                    "Input impedance is infinite and input bias currents are zero.",
                    "Output impedance is zero.",
                    "Common-Mode Rejection Ratio (CMRR) is infinite."
                ]),
                "explanation": "All listed characteristics are defining properties of an ideal operational amplifier.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 4:
            vz = random.choice([4.7, 5.1, 5.6, 6.2, 6.8, 8.2, 9.1, 10.0, 12.0, 15.0])
            vs = random.choice([15.0, 18.0, 20.0, 24.0, 28.0, 30.0, 36.0])
            rs = random.choice([0.5, 1.0, 1.5, 2.0])
            iz = round((vs - vz) / rs, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"In a Zener diode voltage regulator circuit with input voltage V_s = {vs} V, series resistor R_s = {rs} kOhm, and Zener breakdown voltage V_Z = {vz} V, what is the Zener current I_Z in mA under no-load condition? ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(iz),
                "explanation": f"I_Z = (V_s - V_Z) / R_s = ({vs} - {vz}) / {rs} = {_format_nat(iz)} mA.",
                "gate_year": "GATE Standard", "status": "published"
            }
        else:
            vm = random.choice([10, 12, 15, 20, 24, 30, 40, 50])
            vdc = round(vm / math.pi, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In a half-wave rectifier with ideal diode supplied by a sinusoidal AC voltage of peak value V_m = {vm} V, the average DC output voltage V_dc in Volts is ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(vdc),
                "explanation": f"V_dc = V_m / pi = {vm} / pi = {_format_nat(vdc)} V.",
                "gate_year": "GATE Standard", "status": "published"
            }

    # -------------------------------------------------------------
    # 6. DIGITAL CIRCUITS GENERATOR
    # -------------------------------------------------------------
    @staticmethod
    def _gen_digital_question(subject_id: int, topic: Topic, t_title: str, q_type: str) -> Dict[str, Any]:
        variant = random.randint(0, 11)
        if variant == 0:
            n = random.choice([4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16])
            min_val = -(2 ** (n - 1))
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In an {n}-bit signed two's complement integer representation, what is the most negative integer that can be represented? ________.",
                "options": None, "correct_answer": str(min_val),
                "explanation": f"The range of n-bit 2's complement is -2^(n-1) to +2^(n-1)-1. For n = {n}, min = -2^{n-1} = {min_val}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 1:
            total_mux = random.choice([4, 8, 16, 32, 64, 128, 256])
            n_select = int(math.log2(total_mux))
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"To design a multiplexer that selects from {total_mux} input data lines, the number of select lines required is ________.",
                "options": None, "correct_answer": str(n_select),
                "explanation": f"Number of select lines = log2({total_mux}) = {n_select}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 2:
            mod = random.choice([5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 18, 20, 24, 25, 30, 32, 40, 48, 50, 60, 64])
            ff = math.ceil(math.log2(mod))
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"What is the minimum number of flip-flops required to construct a synchronous MOD-{mod} counter? ________.",
                "options": None, "correct_answer": str(ff),
                "explanation": f"2^(n-1) < MOD <= 2^n => for MOD = {mod}, minimum n = {ff} flip-flops.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 3:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MSQ",
                "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                "question_text": "Which of the following gates is/are classified as UNIVERSAL logic gates?",
                "options": ["NAND gate", "NOR gate", "AND gate", "XOR gate"],
                "correct_answer": json.dumps(["NAND gate", "NOR gate"]),
                "explanation": "NAND and NOR gates can implement any Boolean function without requiring other gate types.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 4:
            n = random.choice([6, 8, 10, 12, 14, 16])
            vr = random.choice([2.5, 3.3, 5.0, 10.0])
            res = round(vr / ((2 ** n) - 1) * 1000, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"An {n}-bit Digital-to-Analog Converter (DAC) has a full-scale reference voltage of V_ref = {vr} V. What is the resolution (voltage step size) in millivolts (mV)? ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(res),
                "explanation": f"Step size = V_ref / (2^{n} - 1) = {vr} / {2**n - 1} = {_format_nat(res)} mV.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 5:
            fin_khz = random.choice([100, 200, 400, 500, 800, 1000, 1200, 1600])
            mod = random.choice([4, 5, 8, 10, 16, 20, 25, 50])
            fout_khz = round(fin_khz / mod, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A clock signal with frequency f_in = {fin_khz} kHz is applied to the clock input of a MOD-{mod} frequency divider counter. The output frequency in kHz is ________.",
                "options": None, "correct_answer": _format_nat(fout_khz),
                "explanation": f"f_out = f_in / MOD = {fin_khz} / {mod} = {_format_nat(fout_khz)} kHz.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 6:
            bits = random.choice([4, 8, 16, 32])
            ha_count = 2 * bits
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"To construct an {bits}-bit ripple carry parallel adder using Half Adders and OR gates, what is the total number of Half Adders required? ________ (in integer).",
                "options": None, "correct_answer": str(ha_count),
                "explanation": f"Each 1-bit full adder requires 2 Half Adders. For {bits} bits: {bits} x 2 = {ha_count} Half Adders.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 7:
            dec_num = random.choice([13, 19, 23, 27, 29, 31, 35, 42, 53, 61, 75])
            bin_str = bin(dec_num)[2:]
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"Convert the binary number ({bin_str})_2 into its decimal equivalent. The decimal value is ________.",
                "options": None, "correct_answer": str(dec_num),
                "explanation": f"({bin_str})_2 = {dec_num} in decimal.",
                "gate_year": "GATE Standard", "status": "published"
            }
        else:
            n_bits = random.choice([4, 6, 8, 10, 12])
            n_states = 2 ** n_bits
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In a digital sequential circuit with {n_bits} flip-flops, what is the maximum number of distinct internal states? ________.",
                "options": None, "correct_answer": str(n_states),
                "explanation": f"Maximum states = 2^n = 2^{n_bits} = {n_states}.",
                "gate_year": "GATE Standard", "status": "published"
            }

    # -------------------------------------------------------------
    # 7. CONTROL SYSTEMS GENERATOR (SFG & GENERAL DIVERSITY)
    # -------------------------------------------------------------
    @staticmethod
    def _gen_control_question(subject_id: int, topic: Topic, t_title: str, q_type: str) -> Dict[str, Any]:
        is_sfg = any(k in t_title for k in ["signal flow", "mason", "sfg", "block diagram", "graph"])

        if is_sfg:
            variant = random.randint(0, 13)
            if variant == 0:
                p1 = random.choice([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20])
                l1 = random.choice([-0.1, -0.2, -0.25, -0.4, -0.5, -0.6, -0.75, -0.8, -1.0, -1.2, -1.5, -2.0])
                delta = round(1 - l1, 2)
                t_val = round(p1 / delta, 2)
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                    "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                    "question_text": f"In a single-loop signal flow graph, the forward path gain is P1 = {p1} and the single feedback loop gain is L1 = {l1}. According to Mason's Gain Formula, the closed-loop transmittance T is ________. (Round off to two decimal places).",
                    "options": None, "correct_answer": _format_nat(t_val),
                    "explanation": f"Using Mason's Formula: T = P1 / delta = P1 / (1 - L1) = {p1} / (1 - ({l1})) = {p1} / {delta} = {_format_nat(t_val)}.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            elif variant == 1:
                l1 = random.choice([-1, -2, -3, -4, -5, -6, -8])
                l2 = random.choice([-1, -2, -3, -4, -5, -6, -8])
                prod = l1 * l2
                delta = 1 - (l1 + l2) + prod
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                    "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                    "question_text": f"A signal flow graph has two non-touching feedback loops with individual gains L1 = {l1} and L2 = {l2}. The graph determinant delta is ________ (in integer).",
                    "options": None, "correct_answer": str(delta),
                    "explanation": f"delta = 1 - (L1 + L2) + (L1 x L2) = 1 - ({l1 + l2}) + ({prod}) = {delta}.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            elif variant == 2:
                p1 = random.choice([2, 3, 4, 5, 6, 8, 10])
                p2 = random.choice([1, 2, 3, 4, 5, 6, 8])
                l1 = random.choice([-1, -2, -3, -4, -5])
                l2 = random.choice([-1, -2, -3, -4, -5])
                delta = 1 - (l1 + l2)
                t_val = round((p1 + p2) / delta, 2)
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                    "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                    "question_text": f"A signal flow graph has two forward paths P1 = {p1} and P2 = {p2}. There are two touching feedback loops with gains L1 = {l1} and L2 = {l2}, both touching all forward paths. The transmittance T = C/R is ________. (Round off to two decimal places).",
                    "options": None, "correct_answer": _format_nat(t_val),
                    "explanation": f"delta = 1 - (L1 + L2) = 1 - ({l1 + l2}) = {delta}. Since loops touch all paths, delta1 = delta2 = 1. T = (P1 + P2) / delta = {p1 + p2} / {delta} = {_format_nat(t_val)}.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            elif variant == 3:
                h = random.choice([0.1, 0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8])
                trans = round(1.0 / (1.0 - h), 2)
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                    "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                    "question_text": f"In a signal flow graph, a node has a self-loop with branch gain H = {h}. When eliminating this self-loop, the transmittance of incoming signals through this node is multiplied by ________. (Round off to two decimal places).",
                    "options": None, "correct_answer": _format_nat(trans),
                    "explanation": f"Eliminating a self-loop of gain H divides branch gains entering the node by (1 - H): 1 / (1 - {h}) = {_format_nat(trans)}.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            elif variant == 4:
                g1 = random.choice([2, 3, 4, 5, 6, 8, 10])
                g2 = random.choice([2, 3, 4, 5, 6, 8, 10])
                g3 = random.choice([1, 2, 3, 4, 5])
                g_tot = g1 * g2 * g3
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                    "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                    "question_text": f"Three non-interacting functional blocks with individual transfer gains G1 = {g1}, G2 = {g2}, and G3 = {g3} are connected in series (cascade). The overall forward path gain is ________ (in integer).",
                    "options": None, "correct_answer": str(g_tot),
                    "explanation": f"Cascade connection gain G = G1 x G2 x G3 = {g1} x {g2} x {g3} = {g_tot}.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            elif variant == 5:
                p1 = random.choice([2, 4, 5, 8, 10, 12])
                l1 = random.choice([-1, -2, -3, -4, -5])
                delta = 1 - l1
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                    "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                    "question_text": f"A signal flow graph has determinant delta = {delta} and a forward path P1 = {p1} that touches the single feedback loop L1 = {l1}. The path factor delta1 for this forward path is ________ (in integer).",
                    "options": None, "correct_answer": "1",
                    "explanation": "delta1 is obtained from delta by eliminating loops that touch path P1. Since the loop touches P1, setting its gain to zero yields delta1 = 1 - 0 = 1.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            elif variant == 6:
                p1 = random.choice([2, 3, 4, 5, 6])
                p2 = random.choice([2, 3, 4, 5, 6])
                l1 = random.choice([-1, -2, -3, -4])
                delta = 1 - l1
                delta1 = 1
                delta2 = 1 - l1
                t_val = round(((p1 * delta1) + (p2 * delta2)) / delta, 2)
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                    "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                    "question_text": f"In a signal flow graph, path P1 = {p1} touches feedback loop L1 = {l1}, while path P2 = {p2} does NOT touch loop L1. The closed-loop transfer function T = C/R is ________. (Round off to two decimal places).",
                    "options": None, "correct_answer": _format_nat(t_val),
                    "explanation": f"delta = 1 - L1 = {delta}. Path P1 touches L1 => delta1 = 1. Path P2 does not touch L1 => delta2 = 1 - L1 = {delta2}. T = (P1 delta1 + P2 delta2) / delta = ({p1}x1 + {p2}x{delta2}) / {delta} = {_format_nat(t_val)}.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            elif variant == 7:
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "MSQ",
                    "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                    "question_text": "Which of the following statements regarding Signal Flow Graphs (SFG) is/are TRUE?",
                    "options": [
                        "Signal flow graphs are applicable strictly to linear time-invariant systems described by algebraic equations.",
                        "Signals travel along branches in the direction indicated by branch arrows only.",
                        "A forward path passes through any node at most once.",
                        "Mason's Gain formula is valid only when feedback loops do not touch each other."
                    ],
                    "correct_answer": json.dumps([
                        "Signal flow graphs are applicable strictly to linear time-invariant systems described by algebraic equations.",
                        "Signals travel along branches in the direction indicated by branch arrows only.",
                        "A forward path passes through any node at most once."
                    ]),
                    "explanation": "Statements A, B, and C are foundational rules of SFG. Statement D is false because Mason's formula explicitly handles touching and non-touching loops.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            elif variant == 8:
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "MCQ",
                    "difficulty": "Medium", "marks": 1.0, "negative_marks": 0.33,
                    "question_text": "When moving a summing point BEHIND (after) a functional block of transfer function G(s), what modification must be made to the incoming signal branch at that summing point?",
                    "options": [
                        "Insert a block of transfer function 1 / G(s)",
                        "Insert a block of transfer function G(s)",
                        "Multiply the signal by G(s)^2",
                        "No change is required in the incoming branch"
                    ],
                    "correct_answer": "Insert a block of transfer function 1 / G(s)",
                    "explanation": "Moving a summing point from input of G(s) to output of G(s) requires inserting 1/G(s) in the branch to maintain equivalence.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            elif variant == 9:
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "MCQ",
                    "difficulty": "Medium", "marks": 1.0, "negative_marks": 0.33,
                    "question_text": "When moving a pick-off (take-off) point AHEAD OF (before) a functional block of transfer function G(s), what modification must be made to the branch originating from that pick-off point?",
                    "options": [
                        "Insert a block of transfer function G(s)",
                        "Insert a block of transfer function 1 / G(s)",
                        "Divide the signal by G(s)^2",
                        "No change is required"
                    ],
                    "correct_answer": "Insert a block of transfer function G(s)",
                    "explanation": "Moving a pick-off point from output of G(s) to input of G(s) requires multiplying by G(s) to preserve the original extracted signal.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            elif variant == 10:
                l1 = random.choice([-1, -2, -3, -4])
                l2 = random.choice([-1, -2, -3, -4])
                l3 = random.choice([-1, -2, -3, -4])
                prod13 = l1 * l3
                delta = 1 - (l1 + l2 + l3) + prod13
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                    "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                    "question_text": f"A control system SFG has three individual feedback loops L1 = {l1}, L2 = {l2}, and L3 = {l3}. Loop L2 touches both L1 and L3, but L1 and L3 do NOT touch each other. What is the graph determinant delta? ________ (in integer).",
                    "options": None, "correct_answer": str(delta),
                    "explanation": f"delta = 1 - (L1 + L2 + L3) + (L1 x L3) = 1 - ({l1 + l2 + l3}) + ({prod13}) = {delta}.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            elif variant == 11:
                g = random.choice([2, 4, 5, 8, 10, 15, 20])
                h = random.choice([0.1, 0.2, 0.25, 0.5])
                gh = round(g * h, 2)
                clg = round(g / (1 + gh), 2)
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                    "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                    "question_text": f"A canonical negative feedback closed-loop system has forward path gain G = {g} and feedback factor H = {h}. What is the overall closed-loop transfer function C(s)/R(s)? ________. (Round off to two decimal places).",
                    "options": None, "correct_answer": _format_nat(clg),
                    "explanation": f"C/R = G / (1 + GH) = {g} / (1 + {gh}) = {_format_nat(clg)}.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            elif variant == 12:
                p1 = random.choice([2, 3, 4, 5, 6, 8])
                p2 = random.choice([2, 3, 4, 5, 6, 8])
                p3 = random.choice([1, 2, 3, 4])
                tot = p1 + p2 + p3
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                    "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                    "question_text": f"Three parallel feedforward paths connect the input node to the output node with gains P1 = {p1}, P2 = {p2}, and P3 = {p3}. If the system has no feedback loops (delta = 1), what is the total transmittance? ________ (in integer).",
                    "options": None, "correct_answer": str(tot),
                    "explanation": f"With no feedback loops, delta = 1 and delta_k = 1. Transmittance T = P1 + P2 + P3 = {p1} + {p2} + {p3} = {tot}.",
                    "gate_year": "GATE Standard", "status": "published"
                }
            else:
                return {
                    "subject_id": subject_id, "topic_id": topic.id, "question_type": "MCQ",
                    "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.33,
                    "question_text": "In a signal flow graph, an input node (source node) is defined as a node that has:",
                    "options": [
                        "Only outgoing branches",
                        "Only incoming branches",
                        "Both incoming and outgoing branches",
                        "At least one self-loop"
                    ],
                    "correct_answer": "Only outgoing branches",
                    "explanation": "A source (input) node is a node that possesses exclusively outgoing branches and no incoming branches.",
                    "gate_year": "GATE Standard", "status": "published"
                }

        # General Control Systems variants
        variant = random.randint(0, 11)
        if variant == 0:
            wn = random.choice([2, 3, 4, 5, 6, 8, 10, 12, 15, 20])
            k = wn ** 2
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"The closed-loop transfer function of a standard second-order system is T(s) = {k} / (s^2 + 2s + {k}). What is the natural undamped frequency w_n in rad/s? ________.",
                "options": None, "correct_answer": str(wn),
                "explanation": f"s^2 + 2*zeta*w_n s + w_n^2 = s^2 + 2s + {k} => w_n^2 = {k} => w_n = {wn} rad/s.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 1:
            z = random.choice([0.2, 0.4, 0.5, 0.6, 0.707, 0.8])
            wn = random.choice([2, 4, 5, 8, 10, 20])
            ts = round(4 / (z * wn), 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"A second-order control system has damping ratio zeta = {z} and natural frequency w_n = {wn} rad/s. Using the 2% tolerance band criterion, the settling time t_s is ________ seconds. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(ts),
                "explanation": f"t_s = 4 / (zeta x w_n) = 4 / ({z} x {wn}) = {_format_nat(ts)} s.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 2:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MCQ",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.33,
                "question_text": "In a negative feedback control system with open-loop transfer function G(s)H(s), the gain margin (GM) in dB is defined as:",
                "options": [
                    "-20 log10 |G(jw_pc) H(jw_pc)|",
                    "20 log10 |G(jw_gc) H(jw_gc)|",
                    "180 deg + angle G(jw_pc) H(jw_pc)",
                    "180 deg - angle G(jw_gc) H(jw_gc)"
                ],
                "correct_answer": "-20 log10 |G(jw_pc) H(jw_pc)|",
                "explanation": "Gain margin GM (in dB) = -20 log10 |G(jw_pc)H(jw_pc)|, evaluated at the phase crossover frequency w_pc.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 3:
            p = random.choice([3, 4, 5, 6, 7])
            z = random.choice([1, 2, 3])
            diff = p - z
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"The open-loop transfer function of a unity feedback system has {p} open-loop poles and {z} open-loop zeros. The number of root locus branches terminating at infinity is ________ (in integer).",
                "options": None, "correct_answer": str(diff),
                "explanation": f"Number of asymptotes = P - Z = {p} - {z} = {diff}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 4:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MSQ",
                "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                "question_text": "Which of the following effects is/are produced by adding a PHASE-LEAD compensator to a feedback control system?",
                "options": [
                    "Increases system bandwidth and improves transient response speed.",
                    "Increases phase margin, enhancing relative stability.",
                    "Zero is placed closer to origin than pole in the s-plane.",
                    "Reduces high-frequency noise susceptibility."
                ],
                "correct_answer": json.dumps([
                    "Increases system bandwidth and improves transient response speed.",
                    "Increases phase margin, enhancing relative stability.",
                    "Zero is placed closer to origin than pole in the s-plane."
                ]),
                "explanation": "A lead compensator increases phase margin, improves speed and bandwidth, and has its zero closer to the origin than its pole. It increases high-frequency gain, making it more sensitive to noise.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 5:
            kp = random.choice([2, 3, 4, 5, 7, 8, 9, 10, 15, 20])
            ess = round(1.0 / (1 + kp), 3)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"A Type 0 unity feedback system has positional error constant K_p = {kp}. The steady-state error e_ss for a unit step input is ________. (Round off to 3 decimal places).",
                "options": None, "correct_answer": _format_nat(ess),
                "explanation": f"e_ss = 1 / (1 + K_p) = 1 / (1 + {kp}) = {_format_nat(ess)}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        else:
            kv = random.choice([2, 4, 5, 10, 20, 25, 50])
            ess = round(1.0 / kv, 3)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A Type 1 unity feedback system has velocity error constant K_v = {kv} s^-1. What is the steady-state error e_ss for a unit ramp input? ________. (Round off to 3 decimal places).",
                "options": None, "correct_answer": _format_nat(ess),
                "explanation": f"e_ss = 1 / K_v = 1 / {kv} = {_format_nat(ess)}.",
                "gate_year": "GATE Standard", "status": "published"
            }

    # -------------------------------------------------------------
    # 8. COMMUNICATION SYSTEMS GENERATOR
    # -------------------------------------------------------------
    @staticmethod
    def _gen_comm_question(subject_id: int, topic: Topic, t_title: str, q_type: str) -> Dict[str, Any]:
        variant = random.randint(0, 11)
        if variant == 0:
            pc = random.choice([100, 200, 300, 400, 500, 800, 1000, 1500, 2000, 2500, 3000])
            mu = random.choice([0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])
            pt = round(pc * (1 + (mu ** 2) / 2.0), 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"An AM transmitter radiates unmodulated carrier power P_c = {pc} W. When sinusoidally modulated with modulation index mu = {mu}, the total transmitted power P_t in Watts is ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(pt),
                "explanation": f"P_t = P_c (1 + mu^2 / 2) = {pc} x (1 + {mu}^2 / 2) = {_format_nat(pt)} W.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 1:
            df = random.choice([20, 25, 30, 40, 50, 60, 75, 80, 100, 120])
            fm = random.choice([5, 8, 10, 12, 15, 20, 25])
            bw = 2 * (df + fm)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A frequency modulated (FM) wave has frequency deviation deltaf = {df} kHz and modulating signal frequency f_m = {fm} kHz. According to Carson's rule, the approximate transmission bandwidth in kHz is ________.",
                "options": None, "correct_answer": str(bw),
                "explanation": f"Carson's BW = 2(deltaf + f_m) = 2({df} + {fm}) = {bw} kHz.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 2:
            n = random.choice([4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16])
            levels = 2 ** n
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In a Pulse Code Modulation (PCM) system using an {n}-bit uniform quantizer, the total number of quantization levels L is ________.",
                "options": None, "correct_answer": str(levels),
                "explanation": f"Number of quantization levels L = 2^n = 2^{n} = {levels}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 3:
            b = random.choice([1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000])
            snr = random.choice([3, 7, 15, 31, 63, 127, 255])
            c = int(b * math.log2(1 + snr))
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"An AWGN channel has bandwidth B = {b} Hz and signal-to-noise ratio S/N = {snr}. According to Shannon-Hartley theorem, the channel capacity C in bits/second (bps) is ________ (in integer).",
                "options": None, "correct_answer": str(c),
                "explanation": f"C = B log2(1 + S/N) = {b} x log2(1 + {snr}) = {c} bps.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 4:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MSQ",
                "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                "question_text": "Which of the following digital modulation techniques has/have CONSTANT envelope?",
                "options": ["Binary Phase Shift Keying (BPSK)", "Binary Frequency Shift Keying (BFSK)", "Minimum Shift Keying (MSK)", "16-Quadrature Amplitude Modulation (16-QAM)"],
                "correct_answer": json.dumps(["Binary Frequency Shift Keying (BFSK)", "Minimum Shift Keying (MSK)"]),
                "explanation": "BFSK and MSK have constant envelope, allowing non-linear power amplifiers without distortion. BPSK and QAM have amplitude variations.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 5:
            fs = random.choice([550, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400])
            fif = 455
            f_img = fs + (2 * fif)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In a standard AM superheterodyne broadcast receiver with Intermediate Frequency f_IF = 455 kHz, what is the image frequency in kHz when tuned to incoming carrier f_s = {fs} kHz? ________.",
                "options": None, "correct_answer": str(f_img),
                "explanation": f"f_image = f_s + 2 f_IF = {fs} + 2(455) = {f_img} kHz.",
                "gate_year": "GATE Standard", "status": "published"
            }
        else:
            fm = random.choice([2, 3, 4, 5, 8, 10])
            dsb_bw = 2 * fm
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In a Double Sideband Suppressed Carrier (DSB-SC) modulation system with message bandwidth f_m = {fm} kHz, what is the transmission bandwidth in kHz? ________.",
                "options": None, "correct_answer": str(dsb_bw),
                "explanation": f"Transmission bandwidth for DSB-SC = 2 x f_m = 2 x {fm} = {dsb_bw} kHz.",
                "gate_year": "GATE Standard", "status": "published"
            }

    # -------------------------------------------------------------
    # 9. ELECTROMAGNETICS (EMFT) GENERATOR (EXPANDED TO 150+ UNIQUE)
    # -------------------------------------------------------------
    @staticmethod
    def _gen_emft_question(subject_id: int, topic: Topic, t_title: str, q_type: str) -> Dict[str, Any]:
        variant = random.randint(0, 11)
        if variant == 0:
            er = random.choice([4, 9, 16, 25, 36, 49, 64, 81, 100])
            vp = round(3e8 / math.sqrt(er) / 1e8, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A uniform plane wave propagates in a non-magnetic lossless dielectric with relative permittivity eps_r = {er} and mu_r = 1. What is the phase velocity v_p in units of x 10^8 m/s? ________.",
                "options": None, "correct_answer": _format_nat(vp),
                "explanation": f"v_p = c / sqrt(eps_r) = 3x10^8 / sqrt({er}) = {_format_nat(vp)} x 10^8 m/s.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 1:
            er = random.choice([4, 9, 16, 25, 36, 49])
            eta = round(377.0 / math.sqrt(er), 1)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"What is the intrinsic wave impedance eta in Ohms of a lossless non-magnetic medium with relative permittivity eps_r = {er}? (Take free-space impedance eta0 = 377 Ohm). ________. (Round off to 1 decimal place).",
                "options": None, "correct_answer": _format_nat(eta),
                "explanation": f"eta = eta0 / sqrt(eps_r) = 377 / sqrt({er}) = {_format_nat(eta)} Ohm.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 2:
            zl = random.choice([75, 100, 125, 150, 200, 250, 300, 400, 500])
            z0 = random.choice([50, 75, 100])
            gamma = round((zl - z0) / (zl + z0), 3)
            vswr = round((1 + gamma) / (1 - gamma), 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"A lossless transmission line of characteristic impedance Z0 = {z0} Ohm is terminated in a purely resistive load R_L = {zl} Ohm. What is the Voltage Standing Wave Ratio (VSWR)? ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(vswr),
                "explanation": f"Gamma = (R_L - Z0) / (R_L + Z0) = ({zl} - {z0}) / ({zl} + {z0}) = {gamma}. VSWR = (1 + Gamma)/(1 - Gamma) = {_format_nat(vswr)}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 3:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MSQ",
                "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                "question_text": "Which of the following equations represent Maxwell's equations in differential form for time-varying electromagnetic fields?",
                "options": [
                    "del x E = -dB/dt (Faraday's Law)",
                    "del x H = J + dD/dt (Ampere-Maxwell Law)",
                    "del . D = rho_v (Gauss's Law for Electric Field)",
                    "del . B = 0 (Gauss's Law for Magnetic Field)"
                ],
                "correct_answer": json.dumps([
                    "del x E = -dB/dt (Faraday's Law)",
                    "del x H = J + dD/dt (Ampere-Maxwell Law)",
                    "del . D = rho_v (Gauss's Law for Electric Field)",
                    "del . B = 0 (Gauss's Law for Magnetic Field)"
                ]),
                "explanation": "All four equations are Maxwell's foundational electromagnetic equations.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 4:
            a = random.choice([2, 2.5, 3, 4, 5, 6, 8, 10])
            fc = round((3e10) / (2 * a) / 1e9, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"For an air-filled rectangular waveguide with broader cross-sectional dimension a = {a} cm, the cutoff frequency f_c for dominant TE10 mode in GHz is ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(fc),
                "explanation": f"f_c = c / (2a) = 3x10^10 cm/s / (2 x {a} cm) = {fc} GHz.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 5:
            z0 = random.choice([50, 75, 100])
            zl = random.choice([25, 50, 100, 200, 300])
            zin = round((z0 ** 2) / zl, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"A quarter-wave (lambda / 4) lossless transmission line with characteristic impedance Z0 = {z0} Ohm is terminated in a load impedance Z_L = {zl} Ohm. The input impedance Z_in in Ohm is ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(zin),
                "explanation": f"Z_in = Z0^2 / Z_L = ({z0}^2) / {zl} = {_format_nat(zin)} Ohm.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 6:
            r_val = random.choice([1, 2, 3, 4, 5, 10])
            q_val = random.choice([2, 4, 5, 10])
            # E = q / (4 pi eps0 r^2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A point charge Q = {q_val} nC is placed at the origin in free space. The electric potential V at distance r = {r_val} m is k / r V, where for 1/(4*pi*eps0) = 9x10^9 N.m^2/C^2, the potential in Volts is ________ (in integer).",
                "options": None, "correct_answer": str(int(9 * q_val / r_val)),
                "explanation": f"V = (9 x 10^9 x {q_val} x 10^-9) / {r_val} = {int(9 * q_val / r_val)} V.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 7:
            er = random.choice([2, 4, 5, 9, 10])
            area = random.choice([0.01, 0.02, 0.05, 0.1])
            d_mm = random.choice([1, 2, 5])
            d_m = d_mm * 1e-3
            c_pf = round((er * 8.854e-12 * area / d_m) * 1e12, 1)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 2.0, "negative_marks": 0.0,
                "question_text": f"A parallel-plate capacitor with plate area A = {area} m^2 and separation d = {d_mm} mm is filled with dielectric eps_r = {er}. What is the capacitance in picofarads (pF)? ________. (Round off to 1 decimal place).",
                "options": None, "correct_answer": _format_nat(c_pf),
                "explanation": f"C = eps_r eps0 A / d = {er} x 8.854x10^-12 x {area} / ({d_mm}x10^-3) = {_format_nat(c_pf)} pF.",
                "gate_year": "GATE Standard", "status": "published"
            }
        else:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MCQ",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.33,
                "question_text": "In a lossless rectangular waveguide, what is the relation between phase velocity v_p, group velocity v_g, and the speed of light in the medium c?",
                "options": [
                    "v_p x v_g = c^2",
                    "v_p / v_g = c",
                    "v_p + v_g = 2 c",
                    "v_p x v_g = c"
                ],
                "correct_answer": "v_p x v_g = c^2",
                "explanation": "In any uniform waveguide, the product of phase velocity and group velocity is strictly constant: v_p x v_g = c^2.",
                "gate_year": "GATE Standard", "status": "published"
            }

    # -------------------------------------------------------------
    # 10. ELECTRONICS DEVICES LAB GENERATOR
    # -------------------------------------------------------------
    @staticmethod
    def _gen_lab_question(subject_id: int, topic: Topic, t_title: str, q_type: str) -> Dict[str, Any]:
        variant = random.randint(0, 11)
        if variant == 0:
            ra = random.choice([10, 15, 20, 25, 30, 40, 50, 60, 80, 100])
            rb = random.choice([10, 15, 20, 25, 30, 40, 50, 60, 80, 100])
            duty = round(((ra + rb) / (ra + 2 * rb)) * 100, 1)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In an IC 555 astable multivibrator experiment with timing resistors R_A = {ra} kOhm and R_B = {rb} kOhm, what is the output duty cycle percentage (%)? ________. (Round off to 1 decimal place).",
                "options": None, "correct_answer": _format_nat(duty),
                "explanation": f"Duty cycle = (R_A + R_B) / (R_A + 2 R_B) x 100% = ({ra} + {rb}) / ({ra} + 2x{rb}) x 100% = {_format_nat(duty)}%.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 1:
            nx = random.choice([1, 2, 3, 4, 5, 6])
            ny = random.choice([1, 2, 3, 4, 5])
            fx = random.choice([50, 100, 150, 200, 250, 300, 400, 500, 1000])
            fy = round(fx * (nx / ny), 1)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Medium", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In a cathode ray oscilloscope (CRO) experiment, the Lissajous pattern makes {nx} tangencies along the horizontal axis and {ny} tangencies along the vertical axis. If horizontal frequency is f_x = {fx} Hz, the vertical frequency f_y in Hz is ________.",
                "options": None, "correct_answer": _format_nat(fy),
                "explanation": f"f_y / f_x = (Horizontal tangencies) / (Vertical tangencies) = {nx} / {ny} => f_y = {fx} x ({nx}/{ny}) = {_format_nat(fy)} Hz.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 2:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MCQ",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.33,
                "question_text": "In a diode forward-bias I-V measurement laboratory experiment, dynamic forward resistance r_d is given by:",
                "options": ["deltaV_D / deltaI_D", "V_D / I_D", "deltaI_D / deltaV_D", "1 / (V_D x I_D)"],
                "correct_answer": "deltaV_D / deltaI_D",
                "explanation": "Dynamic resistance r_d is the reciprocal of the slope of the forward I-V characteristic curve: r_d = deltaV_D / deltaI_D.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 3:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MSQ",
                "difficulty": "Hard", "marks": 2.0, "negative_marks": 0.0,
                "question_text": "Which of the following safety precautions is/are MANDATORY while handling MOSFET devices in an electronics hardware laboratory?",
                "options": [
                    "Use grounded anti-static wrist straps to prevent electrostatic discharge (ESD) gate oxide breakdown.",
                    "Keep MOSFET leads shorted together during transport and storage before soldering.",
                    "Ensure laboratory soldering irons have grounded tips.",
                    "Apply high reverse bias gate-source voltage before connecting power supply."
                ],
                "correct_answer": json.dumps([
                    "Use grounded anti-static wrist straps to prevent electrostatic discharge (ESD) gate oxide breakdown.",
                    "Keep MOSFET leads shorted together during transport and storage before soldering.",
                    "Ensure laboratory soldering irons have grounded tips."
                ]),
                "explanation": "MOSFETs are extremely sensitive to ESD damage due to their ultra-thin SiO2 gate dielectric. Grounded wrist straps, shorted leads, and grounded iron tips protect them.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 4:
            c = random.choice([0.01, 0.02, 0.05, 0.1, 0.22, 0.47])
            r = random.choice([10, 15, 22, 33, 47, 68, 100, 120])
            pw = round(1.1 * r * c, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In a 555 monostable multivibrator circuit with R = {r} kOhm and C = {c} uF, what is the output pulse duration W in milliseconds (ms)? ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(pw),
                "explanation": f"Pulse duration W = 1.1 x R x C = 1.1 x {r} kOhm x {c} uF = {_format_nat(pw)} ms.",
                "gate_year": "GATE Standard", "status": "published"
            }
        else:
            v_nl = random.choice([12.0, 12.2, 12.5, 15.0])
            v_fl = random.choice([11.5, 11.8, 12.0, 14.5])
            reg = round(((v_nl - v_fl) / v_fl) * 100, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In a power supply laboratory testing experiment, the no-load output voltage is V_NL = {v_nl} V and the full-load output voltage is V_FL = {v_fl} V. What is the percentage voltage regulation (%)? ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(reg),
                "explanation": f"Voltage regulation = ((V_NL - V_FL) / V_FL) x 100% = (({v_nl} - {v_fl}) / {v_fl}) x 100% = {_format_nat(reg)}%.",
                "gate_year": "GATE Standard", "status": "published"
            }

    # -------------------------------------------------------------
    # 11. GENERAL APTITUDE GENERATOR
    # -------------------------------------------------------------
    @staticmethod
    def _gen_aptitude_question(subject_id: int, topic: Topic, t_title: str, q_type: str) -> Dict[str, Any]:
        variant = random.randint(0, 11)
        if variant == 0:
            cp = random.choice([200, 250, 300, 400, 500, 600, 750, 800, 1000, 1200, 1500, 2000])
            p = random.choice([10, 12, 15, 20, 25, 30, 35, 40, 50])
            sp = int(cp * (1 + (p / 100.0)))
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"An item with cost price Rs {cp} is sold at a profit of {p}%. What is its selling price in rupees? ________.",
                "options": None, "correct_answer": str(sp),
                "explanation": f"SP = CP x (1 + Profit% / 100) = {cp} x (1 + {p}/100) = Rs {sp}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 1:
            da = random.choice([6, 8, 10, 12, 15, 18, 20, 24, 30])
            db = random.choice([8, 10, 12, 15, 20, 24, 30, 36, 40, 60])
            tot = round((da * db) / (da + db), 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"Person A can complete a work in {da} days, and Person B can complete the same work in {db} days. Working together, how many days will they take to complete the work? ________ days. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(tot),
                "explanation": f"Time = ({da} x {db}) / ({da} + {db}) = {_format_nat(tot)} days.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 2:
            speed = random.choice([36, 54, 72, 90, 108, 126, 144, 162, 180, 216])
            speed_ms = int(speed * 5 / 18)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A vehicle travels at a speed of {speed} km/h. What is its speed in meters per second (m/s)? ________.",
                "options": None, "correct_answer": str(speed_ms),
                "explanation": f"Speed in m/s = {speed} x (5/18) = {speed_ms} m/s.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 3:
            p = random.choice([1000, 2000, 3000, 4000, 5000, 8000, 10000, 12000, 15000, 20000])
            r = random.choice([4, 5, 6, 8, 10, 12, 15])
            t = random.choice([2, 3, 4, 5])
            si = int(p * r * t / 100)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A principal sum of Rs {p} is invested at simple interest rate of {r}% per annum for {t} years. What is the simple interest earned in rupees? ________.",
                "options": None, "correct_answer": str(si),
                "explanation": f"SI = (P x R x T) / 100 = ({p} x {r} x {t}) / 100 = Rs {si}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 4:
            n = random.choice([5, 6, 7, 8, 9, 10, 11, 12, 15])
            r = random.choice([2, 3])
            ncr = math.comb(n, r)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"In how many distinct ways can a committee of {r} members be selected from a group of {n} eligible candidates? ________.",
                "options": None, "correct_answer": str(ncr),
                "explanation": f"C({n}, {r}) = {n}! / ({r}! x ({n - r})!) = {ncr}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        elif variant == 5:
            m = random.choice([3, 4, 5, 6, 8, 10])
            w = random.choice([2, 3, 4, 5, 6])
            tot = m + w
            # Prob of picking a man
            p_val = round(m / tot, 2)
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "NAT",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.0,
                "question_text": f"A room contains {m} men and {w} women. If one person is chosen at random, what is the probability of selecting a man? ________. (Round off to two decimal places).",
                "options": None, "correct_answer": _format_nat(p_val),
                "explanation": f"Probability = {m} / ({m} + {w}) = {m} / {tot} = {_format_nat(p_val)}.",
                "gate_year": "GATE Standard", "status": "published"
            }
        else:
            return {
                "subject_id": subject_id, "topic_id": topic.id, "question_type": "MCQ",
                "difficulty": "Easy", "marks": 1.0, "negative_marks": 0.33,
                "question_text": "Choose the most appropriate word to complete the sentence: 'The team worked ________ throughout the night to finish the project on schedule.'",
                "options": ["tirelessly", "tiresomely", "tiredly", "tiringly"],
                "correct_answer": "tirelessly",
                "explanation": "'Tirelessly' means with great effort and energy without stopping.",
                "gate_year": "GATE Standard", "status": "published"
            }


def ensure_topic_questions(db: Session, topic_id: int, required_count: int = 50) -> List[Question]:
    """
    Ensures that the specified topic has at least `required_count` published questions.
    Generates missing questions on the fly and saves them to the database.
    """
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        return []

    subject = db.query(Subject).filter(Subject.id == topic.subject_id).first()
    if not subject:
        return []

    existing = (
        db.query(Question)
        .filter(
            Question.topic_id == topic_id,
            Question.status == "published"
        )
        .all()
    )

    if len(existing) >= required_count:
        return (sorted(existing, key=lambda q: 0 if (q.gate_year and "GATE 20" in q.gate_year) else 1))[:required_count]

    existing_texts = {q.question_text.strip() for q in existing}
    all_qs = list(existing)

    attempts = 0
    while len(all_qs) < required_count and attempts < 40:
        attempts += 1
        needed = required_count - len(all_qs)
        gen_batch = TopicQuestionFactory.generate_for_topic(
            subject_id=subject.id,
            topic=topic,
            count=needed,
            existing_texts=existing_texts
        )
        if not gen_batch:
            break

        for q_dict in gen_batch:
            q_obj = Question(
                subject_id=q_dict["subject_id"],
                topic_id=q_dict["topic_id"],
                question_type=q_dict["question_type"],
                difficulty=q_dict.get("difficulty", "Medium"),
                marks=q_dict.get("marks", 1.0),
                negative_marks=q_dict.get("negative_marks", 0.33),
                question_text=q_dict["question_text"],
                options=q_dict.get("options"),
                correct_answer=q_dict["correct_answer"],
                explanation=q_dict.get("explanation"),
                gate_year=q_dict.get("gate_year", "GATE Standard"),
                status="published"
            )
            db.add(q_obj)
            all_qs.append(q_obj)

        db.commit()

    return (sorted(all_qs, key=lambda q: 0 if (q.gate_year and "GATE 20" in q.gate_year) else 1))[:required_count]


def ensure_subject_questions(db: Session, subject_id: int, required_count: int = 50) -> List[Question]:
    """
    Ensures that the specified subject has at least `required_count` published questions.
    Distributes generation across the subject's topics until required_count is met.
    """
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        return []

    existing = (
        db.query(Question)
        .filter(
            Question.subject_id == subject_id,
            Question.status == "published"
        )
        .all()
    )

    if len(existing) >= required_count:
        random.shuffle(existing)
        return (sorted(existing, key=lambda q: 0 if (q.gate_year and "GATE 20" in q.gate_year) else 1))[:required_count]

    topics = db.query(Topic).filter(Topic.subject_id == subject_id).order_by(Topic.order_index).all()
    if not topics:
        return existing

    existing_texts = {q.question_text.strip() for q in existing}
    all_qs = list(existing)

    attempts = 0
    while len(all_qs) < required_count and attempts < 35:
        attempts += 1
        made_progress = False

        for t in topics:
            if len(all_qs) >= required_count:
                break
            needed = required_count - len(all_qs)
            to_gen = min(5, needed)
            gen_batch = TopicQuestionFactory.generate_for_topic(
                subject_id=subject_id,
                topic=t,
                count=to_gen,
                existing_texts=existing_texts
            )
            if gen_batch:
                made_progress = True
                for q_dict in gen_batch:
                    q_obj = Question(
                        subject_id=q_dict["subject_id"],
                        topic_id=q_dict["topic_id"],
                        question_type=q_dict["question_type"],
                        difficulty=q_dict.get("difficulty", "Medium"),
                        marks=q_dict.get("marks", 1.0),
                        negative_marks=q_dict.get("negative_marks", 0.33),
                        question_text=q_dict["question_text"],
                        options=q_dict.get("options"),
                        correct_answer=q_dict["correct_answer"],
                        explanation=q_dict.get("explanation"),
                        gate_year=q_dict.get("gate_year", "GATE Standard"),
                        status="published"
                    )
                    db.add(q_obj)
                    all_qs.append(q_obj)

        db.commit()
        if not made_progress:
            break

    random.shuffle(all_qs)
    return (sorted(all_qs, key=lambda q: 0 if (q.gate_year and "GATE 20" in q.gate_year) else 1))[:required_count]
