# 20 Rigorous GATE ECE MSQ Questions (Multiple Select Questions)
# In GATE, MSQs have one or more than one correct option, NO partial marking, and ZERO negative marking.

MSQ_QUESTIONS = [
    # ------------------ ENGINEERING MATHEMATICS ------------------
    {
        "subject_id": 1,
        "topic_keyword": "Linear Algebra",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2024",
        "question_text": "Let A be an n × n real symmetric matrix. Which of the following statements is/are ALWAYS TRUE?",
        "options": [
            "All eigenvalues of A are real",
            "Eigenvectors corresponding to distinct eigenvalues of A are mutually orthogonal",
            "A is always invertible",
            "A is always diagonalizable"
        ],
        "correct_answer": ["All eigenvalues of A are real", "Eigenvectors corresponding to distinct eigenvalues of A are mutually orthogonal", "A is always diagonalizable"],
        "explanation": "Properties of real symmetric matrices:\n- The eigenvalues of any real symmetric matrix are strictly real (Statement A is True).\n- Eigenvectors corresponding to distinct eigenvalues of a real symmetric matrix are orthogonal (Statement B is True).\n- A real symmetric matrix is always orthogonally diagonalizable: A = Q Λ Q^T (Statement D is True).\n- A real symmetric matrix can have zero eigenvalues, so it is not necessarily invertible (Statement C is False).",
        "status": "published"
    },
    {
        "subject_id": 1,
        "topic_keyword": "Calculus",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2023",
        "question_text": "Which of the following functions f(x, y) is/are harmonic in the complex plane (satisfies Laplace equation ∂^2f/∂x^2 + ∂^2f/∂y^2 = 0)?",
        "options": [
            "f(x, y) = x^2 - y^2",
            "f(x, y) = e^x cos(y)",
            "f(x, y) = x^2 + y^2",
            "f(x, y) = 2xy"
        ],
        "correct_answer": ["f(x, y) = x^2 - y^2", "f(x, y) = e^x cos(y)", "f(x, y) = 2xy"],
        "explanation": "Evaluate ∇^2 f = f_xx + f_yy:\n- Option A: f_xx = 2, f_yy = -2 => 2 - 2 = 0 (Harmonic).\n- Option B: f_xx = e^x cos(y), f_yy = -e^x cos(y) => sum = 0 (Harmonic).\n- Option C: f_xx = 2, f_yy = 2 => 2 + 2 = 4 ≠ 0 (Not harmonic).\n- Option D: f_xx = 0, f_yy = 0 => 0 + 0 = 0 (Harmonic).\nHence A, B, and D are harmonic.",
        "status": "published"
    },

    # ------------------ NETWORK THEORY ------------------
    {
        "subject_id": 2,
        "topic_keyword": "Circuit Elements",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2024",
        "question_text": "Which of the following statements is/are TRUE for a series RLC resonant circuit at resonance?",
        "options": [
            "The net reactive impedance of the circuit is zero",
            "The power factor of the circuit is unity",
            "The circuit current reaches its minimum value",
            "The voltage across the inductor can be significantly larger than the source voltage"
        ],
        "correct_answer": [
            "The net reactive impedance of the circuit is zero",
            "The power factor of the circuit is unity",
            "The voltage across the inductor can be significantly larger than the source voltage"
        ],
        "explanation": "At series resonance: XL = XC => net reactance X = 0 (Statement A True). Total impedance Z = R (minimum), so current I = V / R is MAXIMUM, not minimum (Statement C False). Power factor cos(θ) = R / Z = 1 (Statement B True). The voltage across inductor is VL = Q * Vsource. For Q > 1, VL exceeds the source voltage (voltage magnification) (Statement D True).",
        "status": "published"
    },
    {
        "subject_id": 2,
        "topic_keyword": "Transient",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2023",
        "question_text": "Which of the following properties hold true for any linear, passive, reciprocal two-port network?",
        "options": [
            "z12 = z21",
            "y12 = y21",
            "AD - BC = 1",
            "h12 = h21"
        ],
        "correct_answer": ["z12 = z21", "y12 = y21", "AD - BC = 1"],
        "explanation": "Conditions for reciprocity in two-port networks:\n- Z-parameters: z12 = z21 (True)\n- Y-parameters: y12 = y21 (True)\n- ABCD transmission parameters: AD - BC = 1 (True)\n- h-parameters: the condition for reciprocity is h12 = -h21, NOT h12 = h21 (Statement D False).",
        "status": "published"
    },

    # ------------------ SIGNALS & SYSTEMS ------------------
    {
        "subject_id": 3,
        "topic_keyword": "System Properties",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2024",
        "question_text": "Which of the following signals has/have a discrete-time Fourier transform (DTFT) that converges?",
        "options": [
            "x[n] = (0.5)^n u[n]",
            "x[n] = (-0.8)^n u[n]",
            "x[n] = 2^n u[n]",
            "x[n] = δ[n] + δ[n - 1]"
        ],
        "correct_answer": [
            "x[n] = (0.5)^n u[n]",
            "x[n] = (-0.8)^n u[n]",
            "x[n] = δ[n] + δ[n - 1]"
        ],
        "explanation": "A discrete-time signal has a convergent DTFT if it is absolutely summable: Σ |x[n]| < ∞ (meaning the unit circle |z| = 1 lies within its z-transform ROC).\n- Option A: |0.5| < 1 => absolutely summable, DTFT converges.\n- Option B: |-0.8| = 0.8 < 1 => absolutely summable, DTFT converges.\n- Option C: |2| > 1 => sum diverges, DTFT does not converge.\n- Option D: Finite duration signal => sum is 2 < ∞, DTFT converges.",
        "status": "published"
    },
    {
        "subject_id": 3,
        "topic_keyword": "Fourier",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2023",
        "question_text": "Which of the following operations on a real-valued signal x(t) will produce a real and even Fourier transform X(ω)?",
        "options": [
            "x(t) is real and even",
            "x(t) = [g(t) + g(-t)] / 2 where g(t) is real",
            "x(t) is real and odd",
            "x(t) = cos(10t)"
        ],
        "correct_answer": [
            "x(t) is real and even",
            "x(t) = [g(t) + g(-t)] / 2 where g(t) is real",
            "x(t) = cos(10t)"
        ],
        "explanation": "Fourier transform symmetry properties:\n- If x(t) is real and even, its Fourier transform X(ω) is purely real and even (Option A True).\n- [g(t) + g(-t)] / 2 is the even part of a real signal g(t), hence real and even (Option B True).\n- cos(10t) is a real and even signal, so its transform π[δ(ω - 10) + δ(ω + 10)] is real and even (Option D True).\n- If x(t) is real and odd, its Fourier transform is purely imaginary and odd (Option C False).",
        "status": "published"
    },

    # ------------------ ELECTRONIC DEVICES (EDC) ------------------
    {
        "subject_id": 4,
        "topic_keyword": "Semiconductor",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2024",
        "question_text": "Which of the following statements regarding intrinsic and extrinsic semiconductors at thermal equilibrium is/are TRUE?",
        "options": [
            "The product of electron and hole concentrations is ni^2 regardless of donor or acceptor doping",
            "In an n-type semiconductor, the Fermi energy level Ef lies closer to the conduction band Ec",
            "As temperature increases, the Fermi level in an extrinsic semiconductor moves toward the intrinsic Fermi level Efi",
            "The intrinsic carrier concentration ni is independent of temperature"
        ],
        "correct_answer": [
            "The product of electron and hole concentrations is ni^2 regardless of donor or acceptor doping",
            "In an n-type semiconductor, the Fermi energy level Ef lies closer to the conduction band Ec",
            "As temperature increases, the Fermi level in an extrinsic semiconductor moves toward the intrinsic Fermi level Efi"
        ],
        "explanation": "Mass action law n*p = ni^2 holds under thermal equilibrium for both intrinsic and non-degenerately doped extrinsic semiconductors (Option A True). For n-type, donor states near Ec raise Ef closer to Ec (Option B True). At high temperatures, thermal generation dominates dopant ionization (ni >> Nd), causing the semiconductor to become intrinsic and Ef to shift toward Efi (Option C True). ni ∝ T^(3/2) e^(-Eg / (2kT)) is strongly temperature-dependent (Option D False).",
        "status": "published"
    },
    {
        "subject_id": 4,
        "topic_keyword": "MOSFET",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2023",
        "question_text": "Which of the following mechanisms can lead to a reduction in the threshold voltage Vt of a short-channel MOSFET (short-channel effects)?",
        "options": [
            "Drain-Induced Barrier Lowering (DIBL)",
            "Velocity saturation of carriers in the channel",
            "Charge sharing between source/drain depletion regions and the gate",
            "Hot carrier injection into gate oxide"
        ],
        "correct_answer": [
            "Drain-Induced Barrier Lowering (DIBL)",
            "Charge sharing between source/drain depletion regions and the gate"
        ],
        "explanation": "In short-channel MOSFETs:\n- DIBL: High drain bias causes the drain depletion region to interact with the channel, lowering the source-to-channel potential barrier and reducing Vt (True).\n- Charge sharing: The source and drain depletion regions support a fraction of the depletion charge under the gate, so less gate charge is needed to invert the channel, reducing Vt (True).\n- Velocity saturation affects drain current saturation, not Vt reduction (False).\n- Hot carrier injection typically causes trapped oxide charge, shifting Vt over time (usually increasing it or degrading gm), not the primary short-channel Vt roll-off mechanism (False).",
        "status": "published"
    },

    # ------------------ ANALOG CIRCUITS ------------------
    {
        "subject_id": 5,
        "topic_keyword": "Op-Amp",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2024",
        "question_text": "An ideal operational amplifier possesses which of the following characteristics?",
        "options": [
            "Infinite open-loop differential gain (Ad = ∞)",
            "Infinite input impedance (Rin = ∞)",
            "Zero output impedance (Rout = 0)",
            "Infinite common-mode rejection ratio (CMRR = ∞)"
        ],
        "correct_answer": [
            "Infinite open-loop differential gain (Ad = ∞)",
            "Infinite input impedance (Rin = ∞)",
            "Zero output impedance (Rout = 0)",
            "Infinite common-mode rejection ratio (CMRR = ∞)"
        ],
        "explanation": "All four are canonical characteristics of an ideal op-amp: infinite voltage gain, infinite input resistance, zero output resistance, infinite CMRR, infinite slew rate, and infinite bandwidth.",
        "status": "published"
    },
    {
        "subject_id": 5,
        "topic_keyword": "Feedback",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2023",
        "question_text": "Which of the following effects are caused by applying negative voltage-series feedback to an amplifier?",
        "options": [
            "Increased input impedance Rif = Ri * (1 + Aβ)",
            "Decreased output impedance Rof = Ro / (1 + Aβ)",
            "Increased gain-bandwidth product",
            "Reduced harmonic distortion and output noise generated inside the loop"
        ],
        "correct_answer": [
            "Increased input impedance Rif = Ri * (1 + Aβ)",
            "Decreased output impedance Rof = Ro / (1 + Aβ)",
            "Reduced harmonic distortion and output noise generated inside the loop"
        ],
        "explanation": "Voltage-series feedback (series input, shunt output):\n- Series at input increases input impedance by (1 + Aβ) (Option A True).\n- Shunt at output decreases output impedance by (1 + Aβ) (Option B True).\n- Reduces non-linear distortion and internal noise by (1 + Aβ) (Option D True).\n- Gain-bandwidth product remains CONSTANT for a single-pole amplifier; feedback does not increase the gain-bandwidth product (Option C False).",
        "status": "published"
    },

    # ------------------ DIGITAL CIRCUITS ------------------
    {
        "subject_id": 6,
        "topic_keyword": "Boolean",
        "question_type": "MSQ",
        "difficulty": "Easy",
        "marks": 1.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2024",
        "question_text": "Which of the following logic gates is/are classified as UNIVERSAL logic gates?",
        "options": [
            "NAND gate",
            "NOR gate",
            "AND gate",
            "XOR gate"
        ],
        "correct_answer": ["NAND gate", "NOR gate"],
        "explanation": "NAND and NOR gates can implement all three basic Boolean functions (NOT, AND, OR) without requiring any other type of gate. Thus, NAND and NOR are universal gates. AND and XOR alone cannot implement a NOT gate without constant high/low inputs.",
        "status": "published"
    },
    {
        "subject_id": 6,
        "topic_keyword": "Number Systems",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2023",
        "question_text": "Which of the following statements is/are correct regarding digital flip-flops?",
        "options": [
            "In an SR flip-flop, the condition S = 1 and R = 1 leads to an invalid/indeterminate state",
            "A JK flip-flop toggles its output when J = 1, K = 1, and a clock pulse arrives",
            "A T flip-flop can be constructed by connecting the J and K inputs of a JK flip-flop together",
            "A D flip-flop cannot be used to divide the clock frequency by 2"
        ],
        "correct_answer": [
            "In an SR flip-flop, the condition S = 1 and R = 1 leads to an invalid/indeterminate state",
            "A JK flip-flop toggles its output when J = 1, K = 1, and a clock pulse arrives",
            "A T flip-flop can be constructed by connecting the J and K inputs of a JK flip-flop together"
        ],
        "explanation": "Statements A, B, and C are correct fundamental properties of SR, JK, and T flip-flops. Statement D is false because connecting Q' to D of a D flip-flop creates a toggle flip-flop that divides clock frequency by 2.",
        "status": "published"
    },

    # ------------------ CONTROL SYSTEMS ------------------
    {
        "subject_id": 7,
        "topic_keyword": "Mathematical Modelling",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2024",
        "question_text": "For a stable, minimum-phase open-loop transfer function G(s)H(s), which of the following statements is/are TRUE?",
        "options": [
            "Both Gain Margin and Phase Margin are positive",
            "The gain crossover frequency ωgc is less than the phase crossover frequency ωpc",
            "The Nyquist plot does not encircle the critical point (-1, j0)",
            "Phase Margin is negative"
        ],
        "correct_answer": [
            "Both Gain Margin and Phase Margin are positive",
            "The gain crossover frequency ωgc is less than the phase crossover frequency ωpc",
            "The Nyquist plot does not encircle the critical point (-1, j0)"
        ],
        "explanation": "For a stable minimum-phase system:\n- GM > 0 dB and PM > 0° (Option A True, Option D False).\n- Gain crossover frequency ωgc < phase crossover frequency ωpc (Option B True).\n- Since there are no open-loop RHP poles (P = 0) and the closed-loop system is stable (N = 0), the Nyquist plot does not encircle (-1, j0) (Option C True).",
        "status": "published"
    },
    {
        "subject_id": 7,
        "topic_keyword": "Block Diagrams",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2023",
        "question_text": "Which of the following controllers is/are capable of reducing the steady-state error of a control system to zero for a step input?",
        "options": [
            "Proportional-Integral (PI) Controller",
            "Proportional-Integral-Derivative (PID) Controller",
            "Proportional (P) Controller with finite gain",
            "Proportional-Derivative (PD) Controller"
        ],
        "correct_answer": [
            "Proportional-Integral (PI) Controller",
            "Proportional-Integral-Derivative (PID) Controller"
        ],
        "explanation": "Integral control introduces a pole at s = 0 (increasing the system Type number by 1). This infinite DC gain forces the steady-state error for step inputs to zero. Therefore, PI and PID controllers eliminate steady-state error. P and PD controllers have finite DC gain and retain a finite steady-state error.",
        "status": "published"
    },

    # ------------------ COMMUNICATIONS ------------------
    {
        "subject_id": 8,
        "topic_keyword": "Amplitude Modulation",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2024",
        "question_text": "Which of the following statements is/are correct regarding digital modulation schemes?",
        "options": [
            "BPSK has a higher power efficiency (lower BER for given Eb/N0) than orthogonal BFSK",
            "QPSK achieves twice the spectral efficiency (bps/Hz) of BPSK",
            "16-QAM has higher spectral efficiency than QPSK",
            "16-PSK is more power efficient than 16-QAM"
        ],
        "correct_answer": [
            "BPSK has a higher power efficiency (lower BER for given Eb/N0) than orthogonal BFSK",
            "QPSK achieves twice the spectral efficiency (bps/Hz) of BPSK",
            "16-QAM has higher spectral efficiency than QPSK"
        ],
        "explanation": "BPSK has bit error probability Q(sqrt(2Eb/N0)), whereas coherent orthogonal BFSK has Q(sqrt(Eb/N0)), meaning BPSK is 3 dB more power-efficient (Option A True). QPSK transmits 2 bits/s/Hz compared to 1 bit/s/Hz for BPSK (Option B True). 16-QAM transmits 4 bits/s/Hz compared to 2 for QPSK (Option C True). 16-QAM has larger minimum Euclidean distance between constellation points for the same average power than 16-PSK, making 16-QAM MORE power efficient than 16-PSK (Option D False).",
        "status": "published"
    },
    {
        "subject_id": 8,
        "topic_keyword": "Angle Modulation",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2023",
        "question_text": "Which of the following statements about wideband Frequency Modulation (WBFM) is/are TRUE?",
        "options": [
            "FM exhibits a capture effect where a stronger station suppresses a weaker station on the same frequency",
            "The amplitude of the FM carrier remains constant regardless of the modulating signal",
            "FM requires less transmission bandwidth than standard AM",
            "Pre-emphasis and de-emphasis filtering are used in FM to improve the high-frequency SNR"
        ],
        "correct_answer": [
            "FM exhibits a capture effect where a stronger station suppresses a weaker station on the same frequency",
            "The amplitude of the FM carrier remains constant regardless of the modulating signal",
            "Pre-emphasis and de-emphasis filtering are used in FM to improve the high-frequency SNR"
        ],
        "explanation": "WBFM properties: Constant envelope ensures immunity to amplitude noise and allows non-linear C-class amplifiers (Option B True). Capture effect suppresses weaker co-channel signals (Option A True). Noise PSD in FM increases quadratically with frequency (parabolic noise), so pre-emphasis at transmitter and de-emphasis at receiver boost high-frequency SNR (Option D True). FM bandwidth 2(Δf + fm) is significantly GREATER than AM bandwidth 2fm (Option C False).",
        "status": "published"
    },

    # ------------------ ELECTROMAGNETICS (EMFT) ------------------
    {
        "subject_id": 9,
        "topic_keyword": "Vector Calculus",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2024",
        "question_text": "For a uniform plane wave propagating in a non-magnetic lossless dielectric medium (μ = μ0, ε = 4ε0), which of the following statements is/are TRUE?",
        "options": [
            "The phase velocity of the wave is 1.5 × 10^8 m/s",
            "The intrinsic impedance of the medium is 60π Ω",
            "The electric and magnetic field vectors are mutually perpendicular and perpendicular to direction of propagation",
            "The attenuation constant α of the medium is non-zero"
        ],
        "correct_answer": [
            "The phase velocity of the wave is 1.5 × 10^8 m/s",
            "The intrinsic impedance of the medium is 60π Ω",
            "The electric and magnetic field vectors are mutually perpendicular and perpendicular to direction of propagation"
        ],
        "explanation": "Lossless dielectric (σ = 0):\n- Phase velocity vp = c / sqrt(εr) = (3 * 10^8) / sqrt(4) = 1.5 * 10^8 m/s (Option A True).\n- Intrinsic impedance η = η0 / sqrt(εr) = 120π / 2 = 60π Ω ≈ 188.5 Ω (Option B True).\n- In a TEM uniform plane wave, E ⊥ H and both are perpendicular to k (Option C True).\n- For a lossless medium (σ = 0), attenuation constant α = 0 (Option D False).",
        "status": "published"
    },
    {
        "subject_id": 9,
        "topic_keyword": "Electrostatic",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2023",
        "question_text": "Which of the following statements is/are TRUE regarding electromagnetic boundary conditions at an interface between two different dielectric media with no surface charge (ρs = 0) and no surface current (Js = 0)?",
        "options": [
            "The tangential component of the electric field E is continuous across the boundary (Et1 = Et2)",
            "The normal component of the electric displacement field D is continuous across the boundary (Dn1 = Dn2)",
            "The tangential component of magnetic field H is continuous across the boundary (Ht1 = Ht2)",
            "The normal component of the magnetic flux density B is continuous across the boundary (Bn1 = Bn2)"
        ],
        "correct_answer": [
            "The tangential component of the electric field E is continuous across the boundary (Et1 = Et2)",
            "The normal component of the electric displacement field D is continuous across the boundary (Dn1 = Dn2)",
            "The tangential component of magnetic field H is continuous across the boundary (Ht1 = Ht2)",
            "The normal component of the magnetic flux density B is continuous across the boundary (Bn1 = Bn2)"
        ],
        "explanation": "Standard Maxwell boundary conditions with ρs = 0 and Js = 0:\n1. ∮ E · dl = 0 => Et1 = Et2 (continuous tangential E).\n2. ∯ D · ds = 0 => Dn1 - Dn2 = ρs = 0 => Dn1 = Dn2 (continuous normal D).\n3. ∮ H · dl = 0 => Ht1 - Ht2 = Js = 0 => Ht1 = Ht2 (continuous tangential H).\n4. ∯ B · ds = 0 => Bn1 = Bn2 (continuous normal B always, since no magnetic charges exist).\nAll four statements are True.",
        "status": "published"
    },

    # ------------------ GENERAL APTITUDE ------------------
    {
        "subject_id": 11,
        "topic_keyword": "Quantitative",
        "question_type": "MSQ",
        "difficulty": "Medium",
        "marks": 2.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2024",
        "question_text": "If x and y are positive integers such that x^2 - y^2 = 35, which of the following can be the value of (x + y)?",
        "options": [
            "35",
            "7",
            "5",
            "1"
        ],
        "correct_answer": ["35", "7"],
        "explanation": "x^2 - y^2 = (x - y)(x + y) = 35.\nSince x, y are positive integers, x + y > x - y > 0.\nFactor pairs of 35 are: (35, 1) and (7, 5).\nCase 1: (x + y) = 35 and (x - y) = 1 => 2x = 36 => x = 18, y = 17 (valid positive integers).\nCase 2: (x + y) = 7 and (x - y) = 5 => 2x = 12 => x = 6, y = 1 (valid positive integers).\nTherefore, (x + y) can be 35 or 7. It cannot be 5 or 1 because x + y must be strictly greater than x - y.",
        "status": "published"
    },
    {
        "subject_id": 11,
        "topic_keyword": "Analytical",
        "question_type": "MSQ",
        "difficulty": "Easy",
        "marks": 1.0,
        "negative_marks": 0.0,
        "gate_year": "GATE 2023",
        "question_text": "Consider the statement: 'All engineers are problem solvers. Some problem solvers are inventors.' Which of the following conclusions CANNOT be logically deduced with certainty?",
        "options": [
            "All engineers are inventors",
            "Some engineers are inventors",
            "No engineer is an inventor",
            "Some inventors are problem solvers"
        ],
        "correct_answer": [
            "All engineers are inventors",
            "Some engineers are inventors",
            "No engineer is an inventor"
        ],
        "explanation": "From 'All E are P' and 'Some P are I':\n- The middle term P is undistributed in both premises (in 'All E are P', P is predicate of affirmative proposition, so undistributed; in 'Some P are I', P is subject of particular proposition, so undistributed). By the fallacy of the undistributed middle, no direct conclusion relating E and I can be deduced with certainty.\n- Hence: 'All E are I' cannot be deduced; 'Some E are I' cannot be deduced; 'No E is I' cannot be deduced.\n- However, 'Some P are I' directly implies 'Some I are P' by conversion (Option D is deduced with certainty).\nTherefore, A, B, and C CANNOT be logically deduced with certainty.",
        "status": "published"
    }
]
