import os
import sqlite3
import datetime

PUBLIC_DIR = r"C:\Users\Dr.SRINIVASA T\.gemini\antigravity\scratch\gate-ece\frontend\public\resources"
DB_PATH = r"C:\Users\Dr.SRINIVASA T\.gemini\antigravity\scratch\gate-ece\backend\gate_ece.db"

os.makedirs(PUBLIC_DIR, exist_ok=True)

def generate_pdf(path, title, subtitle, subject, sections):
    objects = []
    
    current_lines = []
    current_lines.append(('HEADER', 'GSSS INSTITUTE OF ENGINEERING & TECHNOLOGY FOR WOMEN, MYSURU'))
    current_lines.append(('SUBHEADER', 'Department of Electronics & Communication Engineering | GATE Preparation Portal'))
    current_lines.append(('DIVIDER', ''))
    current_lines.append(('TITLE', title))
    current_lines.append(('SUBTITLE', f'Subject: {subject} | {subtitle}'))
    current_lines.append(('DIVIDER', ''))

    for sec_title, sec_paras in sections:
        current_lines.append(('SEC_TITLE', sec_title))
        for p in sec_paras:
            words = p.split(' ')
            cur = ''
            for w in words:
                if len(cur) + len(w) + 1 <= 88:
                    cur = (cur + ' ' + w).strip()
                else:
                    current_lines.append(('TEXT', cur))
                    cur = w
            if cur:
                current_lines.append(('TEXT', cur))
        current_lines.append(('SPACE', ''))

    pages_data = []
    cur_page = []
    for item in current_lines:
        cur_page.append(item)
        if len(cur_page) >= 44:
            pages_data.append(cur_page)
            cur_page = []
    if cur_page:
        pages_data.append(cur_page)

    page_contents = []
    for p_idx, page_items in enumerate(pages_data):
        stream_cmds = ['BT']
        y = 800
        for kind, val in page_items:
            safe_text = val.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
            if kind == 'HEADER':
                stream_cmds.append(f'/F2 12 Tf 0.44 0.10 0.17 rg 45 {y} Td ({safe_text}) Tj')
                y -= 15
            elif kind == 'SUBHEADER':
                stream_cmds.append(f'/F1 9 Tf 0.35 0.35 0.35 rg 45 {y} Td ({safe_text}) Tj')
                y -= 14
            elif kind == 'DIVIDER':
                y -= 4
            elif kind == 'TITLE':
                stream_cmds.append(f'/F2 14 Tf 0.08 0.08 0.08 rg 45 {y} Td ({safe_text}) Tj')
                y -= 16
            elif kind == 'SUBTITLE':
                stream_cmds.append(f'/F2 9.5 Tf 0.44 0.10 0.17 rg 45 {y} Td ({safe_text}) Tj')
                y -= 16
            elif kind == 'SEC_TITLE':
                y -= 5
                stream_cmds.append(f'/F2 10.5 Tf 0.44 0.10 0.17 rg 45 {y} Td ({safe_text}) Tj')
                y -= 13
            elif kind == 'TEXT':
                stream_cmds.append(f'/F1 8.5 Tf 0.15 0.15 0.15 rg 45 {y} Td ({safe_text}) Tj')
                y -= 11
            elif kind == 'SPACE':
                y -= 5
        # Footer
        stream_cmds.append(f'/F1 8 Tf 0.5 0.5 0.5 rg 45 35 Td (Page {p_idx+1} of {len(pages_data)} | GSSSIETW ECE GATE Resource) Tj')
        stream_cmds.append('ET')
        stream_bytes = '\n'.join(stream_cmds).encode('latin1', errors='replace')
        page_contents.append(stream_bytes)

    out = bytearray()
    out.extend(b'%PDF-1.4\n')
    xref = {}

    def write_obj(num, body):
        xref[num] = len(out)
        out.extend(f'{num} 0 obj\n'.encode('ascii'))
        out.extend(body)
        out.extend(b'\nendobj\n')

    cat_id = 1
    font1_id = 2
    font2_id = 3
    pages_id = 4

    next_id = 5
    page_obj_ids = []
    content_obj_ids = []
    for _ in page_contents:
        page_obj_ids.append(next_id)
        next_id += 1
        content_obj_ids.append(next_id)
        next_id += 1

    write_obj(font1_id, b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
    write_obj(font2_id, b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')

    kids_str = ' '.join(f'{pid} 0 R' for pid in page_obj_ids)
    write_obj(pages_id, f'<< /Type /Pages /Kids [{kids_str}] /Count {len(page_obj_ids)} >>'.encode('ascii'))
    write_obj(cat_id, f'<< /Type /Catalog /Pages {pages_id} 0 R >>'.encode('ascii'))

    for i in range(len(page_contents)):
        pid = page_obj_ids[i]
        cid = content_obj_ids[i]
        cbytes = page_contents[i]
        write_obj(cid, f'<< /Length {len(cbytes)} >>\nstream\n'.encode('ascii') + cbytes + b'\nendstream')
        write_obj(pid, f'<< /Type /Page /Parent {pages_id} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 {font1_id} 0 R /F2 {font2_id} 0 R >> >> /Contents {cid} 0 R >>'.encode('ascii'))

    xref_offset = len(out)
    total_objs = next_id
    out.extend(f'xref\n0 {total_objs}\n0000000000 65535 f \n'.encode('ascii'))
    for num in range(1, total_objs):
        offset = xref[num]
        out.extend(f'{offset:010d} 00000 n \n'.encode('ascii'))

    out.extend(f'trailer\n<< /Size {total_objs} /Root {cat_id} 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n'.encode('ascii'))

    with open(path, 'wb') as f:
        f.write(out)
    return round(len(out) / (1024 * 1024), 2)

RESOURCES_DATA = [
    # 1. Engineering Mathematics
    {
        "filename": "engineering_mathematics_formula_sheet.pdf",
        "title": "Engineering Mathematics — GATE Formula Sheet & Revision Digest",
        "subtitle": "Complete Syllabus Formulae: Linear Algebra, Calculus, Differential Equations, Complex Variables",
        "subject_id": 1,
        "resource_type": "Formula Sheets",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. LINEAR ALGEBRA", [
                "Matrix Determinants: det(AB) = det(A)*det(B); det(kA) = k^n * det(A) for n x n matrix.",
                "Eigenvalues & Trace: Sum of eigenvalues = Trace(A); Product of eigenvalues = det(A).",
                "Eigenvalues of A^k are lambda^k; Eigenvalues of A^-1 are 1/lambda.",
                "Cayley-Hamilton Theorem: Every square matrix satisfies its own characteristic polynomial P(A) = 0.",
                "Rank of Matrix: Number of linearly independent row/column vectors. System Ax=B has solution iff Rank(A) = Rank([A|B])."
            ]),
            ("2. CALCULUS & VECTOR CALCULUS", [
                "Limits: L'Hopital Rule applies for 0/0 and inf/inf: lim f(x)/g(x) = lim f'(x)/g'(x).",
                "Taylor Series: f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)^2/2! + ...",
                "Max-Min (2 variables): r = f_xx, t = f_yy, s = f_xy. If rt - s^2 > 0 and r > 0 -> Minimum; if r < 0 -> Maximum.",
                "Gauss Divergence Theorem: Volume Integral of (div F) dV = Surface Integral of F . dS.",
                "Stokes Theorem: Surface Integral of (curl F) . dS = Line Integral of F . dr."
            ]),
            ("3. DIFFERENTIAL EQUATIONS & COMPLEX VARIABLES", [
                "First-order Linear ODE: dy/dx + P(x)y = Q(x) -> Integrating Factor IF = exp(int P dx); y * IF = int (Q * IF) dx + C.",
                "Cauchy-Riemann Equations: u_x = v_y and u_y = -v_x for analytic function f(z) = u + jv.",
                "Cauchy Integral Formula: f(a) = (1 / 2*pi*j) * contour_integral [f(z) / (z - a)] dz.",
                "Residue at simple pole: Res(z=a) = lim_{z->a} (z - a)*f(z)."
            ]),
            ("4. PROBABILITY & STATISTICS", [
                "Conditional Probability: P(A|B) = P(A cap B) / P(B); Bayes Theorem: P(A_i|B) = P(B|A_i)P(A_i) / Sum P(B|A_k)P(A_k).",
                "Mean & Variance: E[X] = int x*f(x) dx; Var(X) = E[X^2] - (E[X])^2.",
                "Poisson Distribution: P(X=k) = (lambda^k * exp(-lambda)) / k!; Mean = Var = lambda.",
                "Normal Distribution: f(x) = (1 / (sigma*sqrt(2*pi))) * exp(-(x - mu)^2 / (2*sigma^2))."
            ])
        ]
    },
    {
        "filename": "engineering_mathematics_notes.pdf",
        "title": "Engineering Mathematics — Comprehensive GATE Concept Notes",
        "subtitle": "Detailed Theoretical Notes, Solved GATE Examples and Short-cut Methods",
        "subject_id": 1,
        "resource_type": "Study Notes",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. MATRICES & SYSTEM OF LINEAR EQUATIONS", [
                "A system of m linear equations in n variables Ax = b is consistent if and only if rank(A) = rank([A|b]).",
                "If rank(A) = rank([A|b]) = n, the system has a unique solution.",
                "If rank(A) = rank([A|b]) < n, there exist infinitely many solutions with (n - r) free parameters.",
                "Homogeneous system Ax = 0 always has trivial solution x = 0; non-trivial solutions exist if and only if det(A) = 0."
            ]),
            ("2. NUMERICAL METHODS & ROOT FINDING", [
                "Newton-Raphson Method: x_{n+1} = x_n - f(x_n)/f'(x_n). Quadratic convergence (order = 2).",
                "Trapezoidal Rule: Integral = (h/2) * [(y_0 + y_n) + 2*(y_1 + y_2 + ... + y_{n-1})]; Global error is O(h^2).",
                "Simpson's 1/3 Rule: Integral = (h/3) * [(y_0 + y_n) + 4*(sum odd) + 2*(sum even)]; Global error is O(h^4)."
            ])
        ]
    },
    # 2. Network Theory
    {
        "filename": "network_theory_formula_sheet.pdf",
        "title": "Network Theory — Essential GATE Formula Sheet & Circuit Theorems",
        "subtitle": "KCL/KVL, Thevenin, Norton, Maximum Power, Transient Formulas & Two-Port Parameters",
        "subject_id": 2,
        "resource_type": "Formula Sheets",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. BASIC CIRCUIT LAWS & THEOREMS", [
                "Ohm's Law: V = I*R; Power P = V*I = I^2 * R = V^2 / R.",
                "KCL: Sum of currents entering node = 0; KVL: Sum of voltage drops around any closed loop = 0.",
                "Thevenin Theorem: Linear bilateral active network can be replaced by Vth in series with Rth.",
                "Norton Theorem: Replace network by In in parallel with Rth where In = Vth / Rth (Short circuit current).",
                "Maximum Power Transfer Theorem (DC): R_L = Rth -> P_max = Vth^2 / (4 * Rth).",
                "Maximum Power Transfer Theorem (AC): Z_L = Zth* (complex conjugate matching) -> P_max = |Vth|^2 / (4 * Rth)."
            ]),
            ("2. TRANSIENTS & STEADY STATE ANALYSIS", [
                "First-order RC Circuit: v_C(t) = v_C(inf) + [v_C(0+) - v_C(inf)] * exp(-t / RC); Time constant tau = RC.",
                "First-order RL Circuit: i_L(t) = i_L(inf) + [i_L(0+) - i_L(inf)] * exp(-t / (L/R)); Time constant tau = L / R.",
                "Inductor Continuity: i_L(0+) = i_L(0-); Capacitor Continuity: v_C(0+) = v_C(0-).",
                "Series RLC Resonance: omega_0 = 1 / sqrt(LC); Quality Factor Q = (1/R) * sqrt(L/C); Bandwidth BW = omega_0 / Q = R/L.",
                "Parallel RLC Resonance: omega_0 = 1 / sqrt(LC); Quality Factor Q = R * sqrt(C/L); Bandwidth BW = 1 / (RC)."
            ]),
            ("3. TWO-PORT NETWORK MATRICES", [
                "Z-Parameters: V1 = z11*I1 + z12*I2; V2 = z21*I1 + z22*I2. Reciprocity: z12 = z21; Symmetry: z11 = z22.",
                "Y-Parameters: I1 = y11*V1 + y12*V2; I2 = y21*V1 + y22*V2. Reciprocity: y12 = y21; Symmetry: y11 = y22.",
                "h-Parameters: V1 = h11*I1 + h12*V2; I2 = h21*I1 + h22*V2. Reciprocity: h12 = -h21; Symmetry: h11*h22 - h12*h21 = 1.",
                "ABCD Transmission: V1 = A*V2 - B*I2; I1 = C*V2 - D*I2. Reciprocity: AD - BC = 1; Symmetry: A = D."
            ])
        ]
    },
    {
        "filename": "network_theory_notes.pdf",
        "title": "Network Theory — Topic-wise Comprehensive Notes",
        "subtitle": "Network Topology, AC Circuit Analysis, Resonance and State Equations",
        "subject_id": 2,
        "resource_type": "Study Notes",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. GRAPH THEORY & INCIDENCE MATRICES", [
                "Number of Tree Branches (twigs) = n - 1 (where n is number of nodes).",
                "Number of Links (cords) = b - (n - 1) (where b is number of branches).",
                "Fundamental Cut-set Matrix Q_f relates branch voltages to twig voltages.",
                "Fundamental Tie-set Matrix B_f relates branch currents to loop link currents: B_f * Q_f^T = 0."
            ]),
            ("2. TWO-PORT INTERCONNECTIONS", [
                "Series-Series: Z_total = Z_A + Z_B.",
                "Parallel-Parallel: Y_total = Y_A + Y_B.",
                "Cascade Interconnection: [T_total] = [T_A] * [T_B]."
            ])
        ]
    },
    # 3. Signals & Systems
    {
        "filename": "signals_and_systems_formula_sheet.pdf",
        "title": "Signals & Systems — Comprehensive Formula Sheet",
        "subtitle": "CTFT, DTFT, Laplace, Z-Transform Properties & Sampling Theorem",
        "subject_id": 3,
        "resource_type": "Formula Sheets",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. SIGNAL CLASSIFICATION & PROPERTIES", [
                "Energy of CT Signal: E = int_{-inf}^{inf} |x(t)|^2 dt; Power P = lim_{T->inf} (1/2T) int_{-T}^{T} |x(t)|^2 dt.",
                "Unit Impulse delta(t): int x(t)*delta(t-t0) dt = x(t0); x(t)*delta'(t) = -x'(t)*delta(t).",
                "Even-Odd Decomposition: x_e(t) = [x(t) + x(-t)] / 2; x_o(t) = [x(t) - x(-t)] / 2.",
                "LTI System Output: y(t) = x(t) * h(t) = int_{-inf}^{inf} x(tau)*h(t - tau) dtau (Convolution Integral)."
            ]),
            ("2. FOURIER TRANSFORM PAIRS & THEOREMS", [
                "Duality: If x(t) <-> X(w), then X(t) <-> 2*pi*x(-w).",
                "Rectangular Pulse rect(t/T) <-> T * sinc(wT / 2*pi); Triangular tri(t/T) <-> (T/2) * sinc^2(wT / 4*pi).",
                "Parseval's Theorem: int |x(t)|^2 dt = (1 / 2*pi) int |X(w)|^2 dw.",
                "Time Differentiation: d/dt x(t) <-> j*w*X(w); Time Integration: int x(t) dt <-> X(w)/(j*w) + pi*X(0)*delta(w)."
            ]),
            ("3. LAPLACE & Z-TRANSFORMS", [
                "Laplace: X(s) = int x(t)*exp(-st) dt. ROC never contains any poles.",
                "Stability of LTI System: System is BIBO stable iff ROC of H(s) includes the jw axis; for causal, all poles in left half plane.",
                "Z-Transform: X(z) = sum x[n]*z^(-n). Unit circle in z-plane corresponds to jw axis in s-plane: z = exp(jw).",
                "Causal LTI Stable System in Z-Domain: All poles lie strictly inside the unit circle (|z| < 1)."
            ]),
            ("4. SAMPLING THEOREM", [
                "Nyquist Rate: f_s >= 2 * f_max; Nyquist Interval: T_s <= 1 / (2 * f_max).",
                "Bandpass Sampling: f_s = (2 * f_H) / k, where k = floor(f_H / BW).",
                "Ideal Reconstruction Filter: H(w) = T_s for |w| < w_s/2, 0 otherwise (Sinc interpolation in time domain)."
            ])
        ]
    },
    # 4. Electronic Devices (EDC)
    {
        "filename": "electronic_devices_formula_sheet.pdf",
        "title": "Electronic Devices & Semiconductors — GATE Formula Reference",
        "subtitle": "Semiconductor Physics, Carrier Transport, P-N Junction, BJT & MOSFET Equations",
        "subject_id": 4,
        "resource_type": "Formula Sheets",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. SEMICONDUCTOR PHYSICS", [
                "Mass Action Law: n * p = n_i^2 = N_c * N_v * exp(-E_g / kT).",
                "Intrinsic Concentration n_i is proportional to T^(3/2) * exp(-E_g / (2kT)).",
                "Einstein Relation: D_n / mu_n = D_p / mu_p = V_t = kT / q (26 mV at 300 K).",
                "Drift Current Density: J_drift = q * (n*mu_n + p*mu_p) * E; Conductivity sigma = q*(n*mu_n + p*mu_p).",
                "Diffusion Current Density: J_diff = q*D_n*(dn/dx) - q*D_p*(dp/dx)."
            ]),
            ("2. P-N JUNCTION & DIODES", [
                "Built-in Potential V_bi = V_t * ln(N_A * N_D / n_i^2).",
                "Depletion Width: W = sqrt([2*eps / q] * [1/N_A + 1/N_D] * [V_bi - V_applied]).",
                "Junction Depletion Capacitance: C_j = eps * A / W proportional to (V_bi - V)^(-1/2) for abrupt junction.",
                "Ideal Diode Equation: I = I_0 * [exp(V / (eta*V_t)) - 1]; Dynamic AC Resistance r_d = eta*V_t / I_D."
            ]),
            ("3. MOSFET PHYSICS & CHARACTERISTICS", [
                "Threshold Voltage: V_th = V_FB + 2*phi_F + [sqrt(2*eps_s*q*N_A*(2*phi_F))] / C_ox.",
                "Cutoff Region: V_GS < V_th -> I_D = 0.",
                "Triode / Linear Region: V_DS < V_GS - V_th -> I_D = mu_n*C_ox*(W/L) * [(V_GS - V_th)*V_DS - V_DS^2 / 2].",
                "Saturation Region: V_DS >= V_GS - V_th -> I_D = (1/2)*mu_n*C_ox*(W/L) * (V_GS - V_th)^2 * (1 + lambda*V_DS).",
                "Transconductance g_m = dI_D / dV_GS = sqrt(2 * mu_n * C_ox * (W/L) * I_D) = 2*I_D / (V_GS - V_th)."
            ])
        ]
    },
    # 5. Analog Circuits
    {
        "filename": "analog_circuits_formula_sheet.pdf",
        "title": "Analog Circuits — High-Yield Formula Sheet",
        "subtitle": "BJT/FET Biasing, Small Signal Amplifiers, Op-Amp Topologies & Feedback Circuits",
        "subject_id": 5,
        "resource_type": "Formula Sheets",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. BJT SMALL SIGNAL AMPLIFIERS", [
                "Transconductance g_m = I_C / V_t; Input resistance r_pi = beta / g_m = (beta * V_t) / I_C; r_e = alpha / g_m approx 1 / g_m.",
                "Common Emitter (CE) Voltage Gain: A_v = -g_m * (R_C || r_o || R_L). Input Resistance R_in = r_pi.",
                "CE with Emitter Resistor R_E: A_v approx -R_C / (r_e + R_E) approx -R_C / R_E.",
                "Common Collector (Emitter Follower): A_v approx 1; High input resistance, low output resistance (Buffer)."
            ]),
            ("2. OPERATIONAL AMPLIFIER (OP-AMP) CIRCUITS", [
                "Virtual Ground Concept: For ideal Op-Amp with negative feedback, V_+ = V_-, input currents I_+ = I_- = 0.",
                "Inverting Amplifier: V_out / V_in = -R_f / R_1; Input impedance R_in = R_1.",
                "Non-Inverting Amplifier: V_out / V_in = 1 + R_f / R_1; Input impedance R_in = inf.",
                "Integrator: V_out = -(1 / R*C) * int V_in dt; Differentiator: V_out = -R*C * (dV_in / dt).",
                "Slew Rate: SR = max |dV_out / dt|; Full power bandwidth f_max = SR / (2*pi*V_peak)."
            ]),
            ("3. FEEDBACK AMPLIFIERS & OSCILLATORS", [
                "Closed-loop Gain: A_f = A / (1 + A*beta); Desensitivity factor D = 1 + A*beta.",
                "Bandwidth Enhancement: BW_f = BW * (1 + A*beta); Gain-Bandwidth Product remains constant.",
                "Barkhausen Criterion for Oscillation: Loop gain |A*beta| = 1 and phase shift angle(A*beta) = 0 or 360 degrees.",
                "Wien Bridge Oscillator: f_0 = 1 / (2*pi*R*C); Minimum amplifier gain A_v >= 3 (R_f / R_1 >= 2)."
            ])
        ]
    },
    # 6. Digital Circuits
    {
        "filename": "digital_circuits_formula_sheet.pdf",
        "title": "Digital Circuits & Systems — Quick Revision Formula Sheet",
        "subtitle": "Boolean Minimization, Combinational Blocks, Sequential Counters & ADC/DAC Equations",
        "subject_id": 6,
        "resource_type": "Formula Sheets",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. BOOLEAN ALGEBRA & LOGIC GATES", [
                "De Morgan's Theorems: (A + B)' = A' * B'; (A * B)' = A' + B'.",
                "Consensus Theorem: AB + A'C + BC = AB + A'C (BC is redundant).",
                "XOR Properties: A xor 0 = A; A xor 1 = A'; A xor A = 0; A xor A' = 1.",
                "Universal Gates: NAND and NOR. Minimum 2-input NAND gates for XOR = 4; for XNOR = 5."
            ]),
            ("2. COMBINATIONAL LOGIC BLOCKS", [
                "Multiplexer: 2^n to 1 MUX has n select lines. Any n-variable boolean function can be realized using 2^(n-1) to 1 MUX.",
                "Half Adder: Sum = A xor B, Carry = A*B; Full Adder: Sum = A xor B xor Cin, Carry = AB + Cin*(A xor B).",
                "Decoder: n to 2^n decoder generates all 2^n minterms."
            ]),
            ("3. SEQUENTIAL CIRCUITS & COUNTERS", [
                "Flip-Flop Characteristic Equations: JK: Q_{next} = J*Q' + K'*Q; T: Q_{next} = T xor Q; D: Q_{next} = D.",
                "MOD-N Counter: Requires n flip-flops where 2^(n-1) < N <= 2^n. Output frequency f_out = f_clock / N.",
                "Ring Counter: n flip-flops provide MOD-n states (f_out = f_clock / n).",
                "Johnson (Twisted Ring) Counter: n flip-flops provide MOD-2n states (f_out = f_clock / 2n)."
            ]),
            ("4. DATA CONVERTERS (ADC & DAC)", [
                "DAC Resolution: Step Size = V_FS / (2^n - 1) approx V_FS / 2^n.",
                "ADC Conversion Time: Successive Approximation (SAR) = n * T_clk; Dual Slope = 2^(n+1) * T_clk; Flash ADC = 1 * T_clk (Fastest)."
            ])
        ]
    },
    # 7. Control Systems
    {
        "filename": "control_systems_formulas.pdf",
        "title": "Control Systems — Master Formula Sheet & Stability Guide",
        "subtitle": "Time Response, Routh-Hurwitz, Root Locus, Nyquist Criterion & State Space",
        "subject_id": 7,
        "resource_type": "Formula Sheets",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. TRANSFER FUNCTIONS & MASON'S GAIN FORMULA", [
                "Overall Gain T = (1 / Delta) * sum P_k * Delta_k.",
                "P_k = forward path gain; Delta = 1 - (sum individual loops) + (sum product two non-touching loops) - ...",
                "Delta_k = value of Delta for path that does not touch path k."
            ]),
            ("2. TIME DOMAIN SPECIFICATIONS (SECOND ORDER SYSTEM)", [
                "Characteristic Equation: s^2 + 2*zeta*omega_n*s + omega_n^2 = 0.",
                "Damping Factor zeta: Undamped (0), Underdamped (0 < zeta < 1), Critically damped (1), Overdamped (> 1).",
                "Rise Time: t_r = (pi - beta) / omega_d where omega_d = omega_n * sqrt(1 - zeta^2) and beta = atan(sqrt(1-zeta^2) / zeta).",
                "Peak Time: t_p = pi / omega_d; Maximum Peak Overshoot: M_p = exp(-pi*zeta / sqrt(1 - zeta^2)) * 100%.",
                "Settling Time: t_s = 4 / (zeta*omega_n) [for 2% tolerance band]; t_s = 3 / (zeta*omega_n) [for 5% band]."
            ]),
            ("3. FREQUENCY DOMAIN & NYQUIST CRITERION", [
                "Phase Margin: PM = 180 + angle[G(j*w_gc)*H(j*w_gc)], where |G(j*w_gc)*H(j*w_gc)| = 1.",
                "Gain Margin: GM = 1 / |G(j*w_pc)*H(j*w_pc)| (in dB: GM_dB = -20*log10 |G(j*w_pc)|), where angle = -180 deg.",
                "Nyquist Stability Criterion: N = P - Z, where N = net clockwise encirclements of (-1+j0), P = open-loop poles in RHP, Z = closed-loop poles in RHP.",
                "For Closed-loop Stability: Z = 0 -> N must equal P (or N counter-clockwise = P)."
            ]),
            ("4. STATE SPACE ANALYSIS", [
                "State Equation: x_dot = A*x + B*u; Output Equation: y = C*x + D*u.",
                "Transfer Function: G(s) = C * (sI - A)^(-1) * B + D.",
                "Controllability Matrix: Q_c = [B | AB | A^2*B | ... | A^(n-1)*B]. Controllable iff rank(Q_c) = n.",
                "Observability Matrix: Q_o = [C^T | A^T*C^T | ... | (A^T)^(n-1)*C^T]^T. Observable iff rank(Q_o) = n."
            ])
        ]
    },
    # 8. Communication Systems
    {
        "filename": "communication_systems_formula_sheet.pdf",
        "title": "Communication Systems — Essential Formula Guide",
        "subtitle": "Analog AM/FM, Noise Analysis, Digital Modulation & Information Theory",
        "subject_id": 8,
        "resource_type": "Formula Sheets",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. ANALOG MODULATION (AM & FM)", [
                "Standard AM: s(t) = A_c * [1 + mu * m(t)] * cos(2*pi*f_c*t). Total Power: P_t = P_c * (1 + mu^2 / 2).",
                "AM Transmission Efficiency: eta = (mu^2) / (2 + mu^2); Max efficiency = 33.3% for tone modulation.",
                "FM Signal: s(t) = A_c * cos(2*pi*f_c*t + 2*pi*k_f * int m(t) dt); Frequency Deviation: Delta_f = k_f * max|m(t)|.",
                "Carson's Rule for FM Bandwidth: BW = 2 * (Delta_f + f_m) = 2 * f_m * (beta + 1), where beta = Delta_f / f_m."
            ]),
            ("2. NOISE & SNR IN ANALOG RECEIVERS", [
                "Thermal Noise Power: N = k * T * B (where k = 1.38e-23 J/K).",
                "Noise Figure: NF = (SNR_in) / (SNR_out); Friis Formula for Cascaded Stages: F = F1 + (F2-1)/G1 + (F3-1)/(G1*G2).",
                "FM Threshold Effect: Below threshold (approx 10 dB input CNR), output SNR deteriorates rapidly (clicks/pops)."
            ]),
            ("3. DIGITAL MODULATION & BIT ERROR PROBABILITY", [
                "BPSK: Constellation distance d = 2*sqrt(E_b); Bit Error Probability: P_e = Q(sqrt(2 * E_b / N_0)).",
                "QPSK: Transmits 2 bits/symbol; Symbol error P_s approx 2*Q(sqrt(2*E_b/N_0)); Bandwidth efficiency = 2 bps/Hz.",
                "BFSK (Coherent): Constellation distance d = sqrt(2*E_b); Bit Error Probability: P_e = Q(sqrt(E_b / N_0))."
            ]),
            ("4. INFORMATION THEORY & SHANNON CAPACITY", [
                "Entropy H(X) = -sum p_i * log2(p_i) bits/symbol. Max entropy = log2(M) for M equally likely symbols.",
                "Shannon-Hartley Channel Capacity: C = B * log2(1 + S/N) bits per second.",
                "Shannon Limit: Minimum E_b / N_0 for error-free transmission as B -> inf is ln(2) = -1.59 dB."
            ])
        ]
    },
    # 9. Electromagnetics (EMFT)
    {
        "filename": "electromagnetics_formula_sheet.pdf",
        "title": "Electromagnetics (EMFT) — Core Formula Sheet",
        "subtitle": "Maxwell's Equations, Plane Waves, Transmission Lines & Antennas",
        "subject_id": 9,
        "resource_type": "Formula Sheets",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. MAXWELL'S EQUATIONS", [
                "Gauss's Law for Electrostatics: div D = rho_v; Integral: Surface integral D . dS = Q_enclosed.",
                "Gauss's Law for Magnetism: div B = 0 (No magnetic monopoles).",
                "Faraday's Law: curl E = -dB/dt; Ampere-Maxwell Law: curl H = J + dD/dt (dD/dt is displacement current).",
                "Continuity Equation: div J = -d(rho_v)/dt."
            ]),
            ("2. UNIFORM PLANE WAVES", [
                "Wave Velocity: v = 1 / sqrt(mu * eps); In free space c = 3e8 m/s.",
                "Intrinsic Impedance: eta = sqrt(mu / eps); In free space eta_0 = sqrt(mu_0 / eps_0) = 120*pi approx 377 Ohms.",
                "Poynting Vector (Instantaneous Power Density): S = E x H W/m^2; Average Power: S_avg = (1/2) * Real(E x H*).",
                "Skin Depth: delta = 1 / sqrt(pi * f * mu * sigma) (Depth where wave amplitude decays to 1/e of surface value)."
            ]),
            ("3. TRANSMISSION LINES & SMITH CHART", [
                "Characteristic Impedance: Z_0 = sqrt((R + jwL) / (G + jwC)); Lossless: Z_0 = sqrt(L / C).",
                "Voltage Reflection Coefficient: Gamma = (Z_L - Z_0) / (Z_L + Z_0).",
                "Voltage Standing Wave Ratio: VSWR = (1 + |Gamma|) / (1 - |Gamma|); Range 1 <= VSWR < inf.",
                "Input Impedance of Lossless Line: Z_in(l) = Z_0 * [Z_L + j*Z_0*tan(beta*l)] / [Z_0 + j*Z_L*tan(beta*l)].",
                "Quarter Wave Transformer (l = lambda/4): Z_in = Z_0^2 / Z_L -> Used for matching load to line."
            ])
        ]
    },
    # 10. Electronics Devices Lab
    {
        "filename": "electronics_devices_lab_guide.pdf",
        "title": "Electronics Devices & Circuits Lab — Comprehensive Practical Guide",
        "subtitle": "Diode IV Curves, BJT/FET Biasing, Op-Amp Experiments & Viva Voce",
        "subject_id": 10,
        "resource_type": "Lab / Practical Resources",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. DIODE CHARACTERISTICS EXPERIMENT", [
                "Silicon Diode Cut-in Voltage V_gamma approx 0.7V; Germanium V_gamma approx 0.3V.",
                "Forward static resistance R_dc = V_f / I_f; Dynamic ac resistance r_ac = delta V_f / delta I_f = 26 mV / I_f.",
                "Zener Diode in Reverse Breakdown: Acts as stable voltage regulator when I_zmin < I_z < I_zmax."
            ]),
            ("2. BJT COMMON EMITTER EXPERIMENT", [
                "Input Characteristics (I_B vs V_BE at constant V_CE): Dynamic input resistance r_in = delta V_BE / delta I_B.",
                "Output Characteristics (I_C vs V_CE at constant I_B): Output resistance r_out = delta V_CE / delta I_C.",
                "Current Amplification Factor: beta = delta I_C / delta I_B."
            ]),
            ("3. OP-AMP LINEAR APPLICATIONS EXPERIMENT", [
                "Inverting Amplifier Design: Choose R1 = 1k, Rf = 10k -> Gain = -10.",
                "Non-Inverting Amplifier Design: Choose R1 = 1k, Rf = 9k -> Gain = 10.",
                "555 Timer Astable Multivibrator: Frequency f = 1.44 / [(R_A + 2*R_B) * C]; Duty Cycle = (R_A + R_B) / (R_A + 2*R_B)."
            ])
        ]
    },
    # 11. General Aptitude
    {
        "filename": "general_aptitude_notes.pdf",
        "title": "General Aptitude — GATE Verbal & Numerical Ability Handout",
        "subtitle": "Grammar, Reasoning, Quantitative Aptitude & Spatial Visualization",
        "subject_id": 11,
        "resource_type": "Study Notes",
        "author": "ECE Faculty, GSSSIETW",
        "sections": [
            ("1. NUMERICAL COMPUTATION & REASONING", [
                "Percentages: Final Value = Initial * (1 +/- x/100); Successive percentage change: a + b + (ab/100).",
                "Permutations & Combinations: P(n, r) = n! / (n-r)!; C(n, r) = n! / [r! * (n-r)!].",
                "Probability: P(Event) = Favorable Outcomes / Total Outcomes.",
                "Speed, Time & Distance: Speed = Distance / Time; Average Speed = (2 * S1 * S2) / (S1 + S2) for equal distances."
            ]),
            ("2. CRITICAL REASONING & VERBAL ABILITY", [
                "Subject-Verb Agreement: Singular subjects require singular verbs (e.g., 'Neither of the signals IS present').",
                "Conditional Sentences: If + past perfect (had done) -> would have + past participle.",
                "Syllogisms: Venn diagram technique for universal positive (All A are B), particular positive (Some A are B), and negative statements."
            ])
        ]
    },
    # Previous Year Papers
    {
        "filename": "gate_2024_ece_solved.pdf",
        "title": "GATE 2024 ECE Official Exam — Full Solutions & Question Explanations",
        "subtitle": "Complete 65 Questions Solved with Detailed Mathematical Derivations",
        "subject_id": 8,
        "resource_type": "Previous Year Questions",
        "author": "GSSSIETW GATE Committee",
        "sections": [
            ("GATE 2024 ECE EXAM OVERVIEW", [
                "Organizing Institute: IISc Bangalore.",
                "Total Marks: 100 Marks (15 Marks General Aptitude + 13 Marks Engineering Mathematics + 72 Marks Core ECE).",
                "Negative Marking: 1/3 for 1-mark MCQ, 2/3 for 2-mark MCQ; Zero negative marking for NAT and MSQ."
            ]),
            ("KEY QUESTIONS & STEP-BY-STEP DERIVATIONS", [
                "Q1: Fourier Transform of sinc pulse -> Ideal lowpass filter in frequency domain with rectangular spectrum.",
                "Q2: MOSFET Threshold shift with body effect -> sqrt(2*phi_F + V_SB) - sqrt(2*phi_F) calculation yields delta V_th = 0.28 V.",
                "Q3: Routh-Hurwitz stability criterion for K/[s(s+2)(s+4)] yields critical gain K_marg = 48 for marginal oscillation.",
                "Q4: Minimum boolean realization for F(A,B,C) = Sigma m(0,1,2,3) yields single literal A'."
            ])
        ]
    },
    {
        "filename": "gate_2023_ece_solved.pdf",
        "title": "GATE 2023 ECE Official Exam — Complete Solved Paper",
        "subtitle": "Organizing Institute: IIT Kanpur | All 65 Questions with Worked Solutions",
        "subject_id": 8,
        "resource_type": "Previous Year Questions",
        "author": "GSSSIETW GATE Committee",
        "sections": [
            ("GATE 2023 ECE HIGHLIGHTS", [
                "Organizing Institute: IIT Kanpur.",
                "Cutoff Marks: General 29.9, OBC-NCL 26.9, SC/ST/PwD 19.9.",
                "Emphasis was placed on Semiconductor Physics, Two-Port Networks, and Digital Modulation schemes."
            ]),
            ("SOLVED HIGH-YIELD PROBLEMS", [
                "Q1: Silicon p-n junction diode dynamic resistance at 2.6 mA forward current -> r_d = 26 mV / 2.6 mA = 10 Ohms.",
                "Q2: Open loop transfer function phase crossover frequency -> w_pc = 2.83 rad/s; Gain Margin = 12.4 dB.",
                "Q3: 16-QAM symbol error probability and spectral efficiency = 4 bps/Hz."
            ])
        ]
    },
    # Official NPTEL Video Lectures
    {
        "filename": "nptel_gate_ece_curriculum.pdf",
        "title": "NPTEL GATE ECE Portal & Video Lecture Syllabus Map",
        "subtitle": "Official Ministry of Education NPTEL / SWAYAM GATE Preparation Directory",
        "subject_id": 8,
        "resource_type": "Video Lectures",
        "file_url": "https://gate.nptel.ac.in/",
        "author": "NPTEL / IIT Madras & IIT Bombay",
        "sections": [
            ("OFFICIAL NPTEL GATE PORTAL ENROLLMENT", [
                "Official Portal Link: https://gate.nptel.ac.in/",
                "Students can directly enroll into free GATE video lecture series created by IIT professors.",
                "Features include: 500+ hours of modular video lectures, previous year question walk-throughs, and live doubt clearance sessions."
            ]),
            ("RECOMMENDED NPTEL VIDEO COURSES FOR ECE", [
                "1. Signals & Systems by Prof. V. M. Gadre (IIT Bombay) — https://nptel.ac.in/courses/108101005",
                "2. Analog Electronic Circuits by Prof. S. C. Dutta Roy (IIT Delhi) & Prof. Radhakrishna Rao (IIT Madras) — https://nptel.ac.in/courses/117106030",
                "3. Digital Electronic Circuits by IIT Madras Faculty — https://nptel.ac.in/courses/117106086",
                "4. Control Engineering by Prof. Ramkrishna Pasumarthy (IIT Madras) — https://nptel.ac.in/courses/108106098",
                "5. Principles of Communication by Prof. Bikash Kumar Dey (IIT Bombay) — https://nptel.ac.in/courses/117101051",
                "6. Electromagnetic Waves & Radiating Systems by Prof. R. K. Shevgaonkar (IIT Bombay) — https://nptel.ac.in/courses/117101056"
            ])
        ]
    }
]

print("Starting generation of PDF files and database population...")

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Clear old placeholder resources
cur.execute("DELETE FROM resources")
conn.commit()

for res in RESOURCES_DATA:
    pdf_filename = res["filename"]
    pdf_path = os.path.join(PUBLIC_DIR, pdf_filename)
    
    # Generate actual PDF file
    file_size_mb = generate_pdf(
        pdf_path,
        res["title"],
        res["subtitle"],
        f"GATE ECE (Subject ID: {res['subject_id']})",
        res["sections"]
    )
    
    # Determine URL
    file_url = res.get("file_url") or f"/resources/{pdf_filename}"
    
    cur.execute("""
        INSERT INTO resources (title, resource_type, subject_id, author_name, file_url, file_size_mb, is_downloadable, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, 'published', datetime('now'))
    """, (
        res["title"],
        res["resource_type"],
        res["subject_id"],
        res["author"],
        file_url,
        max(0.1, file_size_mb)
    ))
    print(f"Generated: {pdf_filename} ({file_size_mb} MB) -> Saved to DB")

conn.commit()
cur.execute("SELECT count(*) FROM resources")
total_res = cur.fetchone()[0]
print(f"\nAll done! Total active study resources in database: {total_res}")
conn.close()
