import { TopicItem } from "./types";

export const signalsSystemsTopics: TopicItem[] = [
  {
    "title": "Discrete Fourier Transform (DFT) and Circular Convolution",
    "summary": "Finite-length frequency representation X[k], twiddle factor W_N properties, and circular convolution versus linear convolution with zero-padding.",
    "orderIndex": 13,
    "lesson": {
      "intro": "The Discrete Fourier Transform (DFT) transforms a finite-length discrete-time sequence x[n] of length N into a discrete-frequency sequence X[k] of the same length. Multiplication of two DFTs corresponds to CIRCULAR convolution in the time domain, NOT linear convolution. To perform linear convolution using DFTs, the sequences must be zero-padded to at least (L + M - 1) points. This is a top-yield GATE DSP topic.",
      "simple": "The continuous Fourier transform produces an infinite, continuous curve. Computers cannot store infinite curves; they can only store discrete numbers. The DFT samples the DTFT at N equally spaced frequency points omega_k = 2*pi*k / N, enabling digital spectrum computation.",
      "why": "Underpins digital audio filtering, spectral estimation, radar range-Doppler processing, and OFDM communication modulation.",
      "points": [
        "DFT Definition: X[k] = sum_{n=0}^{N-1} x[n] * W_N^(k*n), where W_N = e^(-j*2*pi/N) (Twiddle factor).",
        "Inverse DFT: x[n] = (1/N) * sum_{k=0}^{N-1} X[k] * W_N^(-k*n).",
        "Twiddle Factor Properties: Periodicity: W_N^(k + N) = W_N^k; Symmetry: W_N^(k + N/2) = -W_N^k.",
        "Circular Convolution: x1[n] (*) x2[n] = sum_{m=0}^{N-1} x1[m] * x2[((n - m))_N].",
        "Linear vs Circular: Linear convolution of length L and M yields length L + M - 1.",
        "Zero-Padding Rule: To compute linear convolution via N-point DFT, choose N >= L + M - 1."
      ],
      "formulas": [
        {
          "equation": "X[k] = \\sum_{n=0}^{N-1} x[n] W_N^{kn}, \\quad W_N = e^{-j\\frac{2\\pi}{N}}",
          "meaning": "Analysis equation of the N-point Discrete Fourier Transform.",
          "conditions": "k = 0, 1, ..., N-1."
        },
        {
          "equation": "x_1[n] \\, \\textcircled{N} \\, x_2[n] \\stackrel{\\mathcal{DFT}}{\\longleftrightarrow} X_1[k] \\cdot X_2[k]",
          "meaning": "Circular convolution property of the DFT.",
          "conditions": "Both sequences of length N."
        },
        {
          "equation": "N \\ge L + M - 1",
          "meaning": "Minimum DFT length to avoid circular time-aliasing when computing linear convolution.",
          "conditions": "x1 has length L, x2 has length M."
        }
      ],
      "example": {
        "question": "Given x1[n] = [1, 2] (length L = 2) and x2[n] = [2, 1] (length M = 2). (a) Find their 2-point circular convolution. (b) Find their linear convolution.",
        "given": [
          "x1 = [1, 2]",
          "x2 = [2, 1]"
        ],
        "steps": [
          "Step 1: Circular convolution matrix for x2: Col 0 = [2, 1]^T, Col 1 = [1, 2]^T.",
          "Step 2: y_circ = [[2, 1], [1, 2]] * [1, 2]^T = [2*1 + 1*2, 1*1 + 2*2]^T = [4, 5].",
          "Step 3: Linear convolution: y_lin[0] = 1*2 = 2. y_lin[1] = 1*1 + 2*2 = 5. y_lin[2] = 2*1 = 2.",
          "Step 4: Notice y_circ[0] = y_lin[0] + y_lin[2] = 2 + 2 = 4 (time-aliased!)."
        ],
        "answer": "Circular convolution = [4, 5]; Linear convolution = [2, 5, 2]."
      },
      "gate": [
        "GATE question: Notice that circular convolution wraps around: y_circ[n] = sum of aliases y_lin[n + r*N].",
        "DFT of real even sequence is real and even.",
        "Parseval's relation: sum |x[n]|^2 = (1/N) * sum |X[k]|^2."
      ],
      "mistakes": [
        "Confusing linear convolution with circular convolution.",
        "Forgetting the 1/N factor in IDFT.",
        "Setting zero-padding length to L + M instead of L + M - 1."
      ],
      "diagram": "math",
      "diagramTitle": "Discrete Fourier Transform Twiddle Factor Circle and Circular Shift",
      "diagramCaption": "Twiddle factor W_N^k lies on the complex unit circle. Circular convolution wraps around modulo N.",
      "studyGuide": [
        "1. Learn twiddle factor definitions and symmetry.",
        "2. Compute 4-point DFTs using matrix form.",
        "3. Perform circular convolution using concentric circle method.",
        "4. Apply zero-padding to achieve linear convolution.",
        "5. Solve GATE DFT symmetry and Parseval problems."
      ],
      "practiceQuestions": [
        {
          "question": "Two sequences of lengths 5 and 7 are to be convolved linearly using DFT. What is the minimum number of points N required for the DFT?",
          "type": "NAT",
          "answer": "11",
          "explanation": "Minimum N = L + M - 1 = 5 + 7 - 1 = 11 points."
        },
        {
          "question": "If X[k] is the 4-point DFT of x[n] = [1, 0, 1, 0], what is the value of X[0]?",
          "type": "NAT",
          "answer": "2",
          "explanation": "X[0] = sum_{n=0}^{N-1} x[n] = 1 + 0 + 1 + 0 = 2."
        }
      ],
      "quickRevision": "DFT: X[k] = sum x[n] W_N^(kn). Circular convolution: X1[k]*X2[k]. Linear convolution requires N >= L + M - 1 to avoid time-domain aliasing.",
      "relatedTopics": [
        "DTFT and Frequency Response",
        "Fourier Transform",
        "Sampling Theorem"
      ]
    }
  },
  {
    "title": "Fast Fourier Transform (FFT) Algorithms",
    "summary": "Radix-2 Decimation-in-Time (DIT) and Decimation-in-Frequency (DIF) butterfly architectures slashing complexity from O(N^2) to O(N log2 N).",
    "orderIndex": 14,
    "lesson": {
      "intro": "Direct computation of an N-point DFT requires N^2 complex multiplications and N(N - 1) complex additions. The Fast Fourier Transform (FFT), pioneered by Cooley and Tukey, exploits the symmetry and periodicity of the twiddle factors (W_N) to decompose an N-point DFT into smaller DFTs. For N = 2^m (Radix-2), this slashes computational complexity to (N/2)*log2(N) multiplications, making real-time digital signal processing possible.",
      "simple": "Think of calculating a tournament bracket: instead of having all 1024 players play every other player (1,000,000 matches), you pair them up in rounds. In 10 rounds, the tournament is decided! FFT uses the exact same divide-and-conquer strategy, computing a 1024-point DFT in 5,120 operations instead of 1,048,576.",
      "why": "Used in every Wi-Fi chip, 4G/5G baseband modem (OFDM), medical MRI imaging, and digital audio processor.",
      "points": [
        "Direct DFT Complexity: O(N^2) complex multiplications and additions.",
        "Radix-2 FFT Complexity: (N/2)*log2(N) complex multiplications and N*log2(N) complex additions.",
        "Speedup Ratio: ~ (2 * N) / log2(N). For N = 1024, FFT is over 200 times faster!",
        "Decimation-in-Time (DIT): Splits x[n] into even-indexed and odd-indexed samples. Input requires Bit-Reversal ordering; Output is in natural sequential order.",
        "Decimation-in-Frequency (DIF): Splits X[k] into even and odd frequency bins. Input is in natural order; Output is in Bit-Reversal ordering.",
        "Basic Butterfly Operation: Combines two inputs A and B using twiddle factor W to produce X = A + W*B and Y = A - W*B."
      ],
      "formulas": [
        {
          "equation": "C_{direct} = N^2, \\quad C_{FFT} = \\frac{N}{2} \\log_2 N",
          "meaning": "Comparison of complex multiplications between direct DFT and Radix-2 FFT.",
          "conditions": "N is an integer power of 2 (N = 2^m)."
        },
        {
          "equation": "N_{stages} = \\log_2 N, \\quad N_{butterflies/stage} = \\frac{N}{2}",
          "meaning": "Structural parameters of an N-point Radix-2 FFT signal flow graph.",
          "conditions": "Radix-2 algorithm."
        },
        {
          "equation": "X = A + W_N^r B, \\quad Y = A - W_N^r B",
          "meaning": "Radix-2 DIT butterfly computation.",
          "conditions": "Dual outputs sharing common complex multiplication."
        }
      ],
      "example": {
        "question": "Calculate the number of complex multiplications saved by using a 64-point Radix-2 FFT instead of direct DFT computation.",
        "given": [
          "N = 64 points"
        ],
        "steps": [
          "Step 1: Direct DFT multiplications: N^2 = 64^2 = 4096.",
          "Step 2: Number of stages in Radix-2 FFT: log2(64) = 6.",
          "Step 3: Multiplications in Radix-2 FFT: (N/2) * log2(N) = (64/2) * 6 = 32 * 6 = 192.",
          "Step 4: Multiplications saved = 4096 - 192 = 3904."
        ],
        "answer": "3904 complex multiplications are saved (95.3% computation reduction)."
      },
      "gate": [
        "DIT-FFT: Input is Bit-Reversed, Output is Normal. DIF-FFT: Input is Normal, Output is Bit-Reversed.",
        "Bit-reversal example for 8 points: index 1 (001) maps to index 4 (100); index 3 (011) maps to index 6 (110).",
        "Number of butterflies per stage is always N/2."
      ],
      "mistakes": [
        "Confusing DIT and DIF bit-reversal locations.",
        "Forgetting that log2(N) gives the number of stages.",
        "Using log10 instead of base-2 logarithm."
      ],
      "diagram": "waveform",
      "diagramTitle": "Radix-2 Decimation-in-Time 8-Point FFT Butterfly Flow Graph",
      "diagramCaption": "3 stages of 4 butterflies each. Input is bit-reversed (0, 4, 2, 6, 1, 5, 3, 7). Output is natural order.",
      "studyGuide": [
        "1. Understand twiddle factor symmetry: W_N^(k + N/2) = -W_N^k.",
        "2. Derive 2-point butterfly equations.",
        "3. Perform bit-reversal permutations.",
        "4. Draw 8-point DIT and DIF flow graphs.",
        "5. Solve GATE complexity and flow-graph numericals."
      ],
      "practiceQuestions": [
        {
          "question": "How many complex multiplications are required to compute a 256-point DFT using the Radix-2 FFT algorithm?",
          "type": "NAT",
          "answer": "1024",
          "explanation": "(N/2) * log2(N) = (256 / 2) * log2(256) = 128 * 8 = 1024 complex multiplications."
        },
        {
          "question": "In an 8-point Radix-2 DIT FFT, the input sample x[3] is mapped by bit-reversal to which position?",
          "type": "MCQ",
          "options": [
            "x[6]",
            "x[4]",
            "x[5]",
            "x[3]"
          ],
          "answer": "x[6]",
          "explanation": "3 in binary is 011. Reversing the bits gives 110, which is decimal 6."
        }
      ],
      "quickRevision": "FFT: Reduces DFT complexity from O(N^2) to (N/2)*log2(N). DIT has bit-reversed input, normal output. DIF has normal input, bit-reversed output. Butterfly: A +- W*B.",
      "relatedTopics": [
        "Discrete Fourier Transform (DFT) and Circular Convolution",
        "DTFT and Frequency Response",
        "Fourier Transform"
      ]
    }
  },
  {
    "title": "Hilbert Transform and Analytic Signals",
    "summary": "Quadrature 90-degree phase shift operator H(jw) = -j*sgn(w), single-sideband (SSB) modulation, and envelope detection via analytic signal z(t) = x(t) + j*x_hat(t).",
    "orderIndex": 15,
    "lesson": {
      "intro": "The Hilbert Transform is a linear mathematical operator that shifts the phase of all positive-frequency components of a signal by -90 degrees (-pi/2) and all negative-frequency components by +90 degrees (+pi/2) without altering their amplitudes. In communication systems and signal processing, combining a real signal x(t) with its Hilbert transform x_hat(t) creates the complex 'Analytic Signal' z(t) = x(t) + j*x_hat(t), which possesses strictly zero negative-frequency content.",
      "simple": "Think of the Hilbert transform like a universal 90-degree phase shifter: cos(wt) becomes sin(wt), and sin(wt) becomes -cos(wt). It doesn't change the loudness (amplitude) of any frequency, only its timing.",
      "why": "Essential for generating Single-Sideband (SSB) voice communications, instantaneous frequency tracking, and envelope demodulation.",
      "points": [
        "Impulse Response: h(t) = 1 / (pi * t).",
        "Frequency Response: H(j*omega) = -j * sgn(omega) = -j for omega > 0, and +j for omega < 0.",
        "Ideal 90-degree Phase Shifter: |H(j*omega)| = 1 for all omega (all-pass magnitude).",
        "Analytic Signal: z(t) = x(t) + j * x_hat(t). Spectrum Z(f) = 2 * X(f) for f > 0, and Z(f) = 0 for f < 0.",
        "Energy Conservation: A signal x(t) and its Hilbert transform x_hat(t) have identical energy and are mutually ORTHOGONAL: integral x(t)*x_hat(t) dt = 0.",
        "Double Hilbert Transform: Applying the Hilbert transform twice results in the negative of the original signal: H{H{x(t)}} = -x(t)."
      ],
      "formulas": [
        {
          "equation": "\\hat{x}(t) = \\mathcal{H}\\{x(t)\\} = x(t) * \\frac{1}{\\pi t} = \\frac{1}{\\pi} \\int_{-\\infty}^{\\infty} \\frac{x(\\tau)}{t - \\tau} d\\tau",
          "meaning": "Time-domain Hilbert transform convolution definition.",
          "conditions": "Cauchy principal value integral."
        },
        {
          "equation": "H(j\\omega) = -j \\operatorname{sgn}(\\omega) = \\begin{cases} -j = 1 \\angle -90^\\circ & \\omega > 0 \\\\ 0 & \\omega = 0 \\\\ +j = 1 \\angle +90^\\circ & \\omega < 0 \\end{cases}",
          "meaning": "Frequency response of the ideal Hilbert transformer.",
          "conditions": "Real physical signals."
        },
        {
          "equation": "z(t) = x(t) + j\\hat{x}(t) = A(t) e^{j\\theta(t)}",
          "meaning": "Complex analytic signal where A(t) is instantaneous envelope and theta(t) is phase.",
          "conditions": "Z(f) contains zero negative frequencies."
        }
      ],
      "example": {
        "question": "Find the Hilbert transform of the signal x(t) = 3*cos(100*pi*t) + 4*sin(200*pi*t).",
        "given": [
          "x(t) = 3*cos(100*pi*t) + 4*sin(200*pi*t)"
        ],
        "steps": [
          "Step 1: Hilbert transform shifts positive frequency components by -90 degrees.",
          "Step 2: H{cos(w0*t)} = sin(w0*t).",
          "Step 3: H{sin(w0*t)} = -cos(w0*t).",
          "Step 4: Apply linearity: H{x(t)} = 3*sin(100*pi*t) + 4*(-cos(200*pi*t)) = 3*sin(100*pi*t) - 4*cos(200*pi*t)."
        ],
        "answer": "x_hat(t) = 3*sin(100*pi*t) - 4*cos(200*pi*t)."
      },
      "gate": [
        "Applying Hilbert transform twice: H{H{x(t)}} = -x(t).",
        "Hilbert transform of a constant DC value is ZERO.",
        "x(t) and x_hat(t) have identical auto-correlation and power spectral density."
      ],
      "mistakes": [
        "Thinking H{sin(wt)} = cos(wt); it is -cos(wt)!",
        "Assuming Hilbert transform changes signal energy; energy is identical."
      ],
      "diagram": "waveform",
      "diagramTitle": "Hilbert Transform Frequency Response and Analytic Spectrum",
      "diagramCaption": "Magnitude is unity all-pass. Phase is -90 deg for positive f and +90 deg for negative f. Analytic signal has zero negative spectrum.",
      "studyGuide": [
        "1. Memorize H(jw) = -j*sgn(w).",
        "2. Learn transforms of standard sinusoids (cos -> sin, sin -> -cos).",
        "3. Construct analytic signal z(t) = x(t) + j*x_hat(t).",
        "4. Understand SSB modulation generation: s(t) = m(t)*cos(wc*t) +- m_hat(t)*sin(wc*t).",
        "5. Prove orthogonality between x(t) and x_hat(t)."
      ],
      "practiceQuestions": [
        {
          "question": "What is the Hilbert transform of the signal x(t) = 5*sin(50t)?",
          "type": "MCQ",
          "options": [
            "-5*cos(50t)",
            "5*cos(50t)",
            "-5*sin(50t)",
            "5*sin(50t)"
          ],
          "answer": "-5*cos(50t)",
          "explanation": "H{sin(wt)} = -cos(wt). Therefore, H{5*sin(50t)} = -5*cos(50t)."
        },
        {
          "question": "If the Hilbert transform operator H is applied FOUR times consecutively to a signal x(t), the resulting signal is:",
          "type": "MCQ",
          "options": [
            "+x(t)",
            "-x(t)",
            "j*x(t)",
            "0"
          ],
          "answer": "+x(t)",
          "explanation": "H{H{x(t)}} = -x(t). Applying it twice more: H{H{-x(t)}} = -(-x(t)) = +x(t)."
        }
      ],
      "quickRevision": "Hilbert Transform: H(jw) = -j*sgn(w) (-90 deg phase shift). cos -> sin, sin -> -cos. H{H{x}} = -x. Analytic signal z(t) = x + j*x_hat eliminates negative frequencies.",
      "relatedTopics": [
        "Fourier Transform",
        "DSB-SC and SSB-SC Modulation Techniques",
        "Amplitude Modulation (AM)"
      ]
    }
  },
  {
    "title": "Minimum Phase, Maximum Phase, and All-Pass Systems",
    "summary": "Pole-zero factorization H(z) = H_min(z) * H_ap(z), minimum group delay properties, and spectral factorization of LTI systems.",
    "orderIndex": 16,
    "lesson": {
      "intro": "LTI systems with identical magnitude frequency responses |H(w)| can possess vastly different phase and delay characteristics depending on zero locations. A Minimum Phase system has all its poles AND all its zeros strictly inside the unit circle (|z| < 1 for discrete-time) or left-half plane (s-plane). A Maximum Phase system has all zeros outside the unit circle. An All-Pass system has constant magnitude gain (|H(w)| = 1) and is used for phase equalization.",
      "simple": "Think of a minimum-phase system like the shortest path to a destination: it delivers the desired frequency gain with the minimum possible time delay. Moving a zero from inside the unit circle to outside mirrors the frequency magnitude identically, but adds unwanted extra delay.",
      "why": "Crucial in audio equalizer design, feedback control stability, seismic signal deconvolution, and channel equalization.",
      "points": [
        "Minimum Phase System: All poles and zeros are INSIDE the unit circle (|z| < 1). Both H(z) and its inverse 1/H(z) are causal and stable.",
        "Maximum Phase System: All poles inside, but all zeros are OUTSIDE the unit circle (|z| > 1).",
        "Mixed Phase System: Zeros lie both inside and outside the unit circle.",
        "All-Pass System H_ap(z): Magnitude is constant unity (|H_ap(e^jw)| = 1 for all w). Poles at p_k paired with zeros at 1/p_k*.",
        "Any non-minimum phase system can be decomposed uniquely as: H(z) = H_min(z) * H_ap(z).",
        "Minimum Energy Delay: Among all causal systems having the same magnitude response, the minimum phase system has its energy concentrated nearest the start of the impulse response."
      ],
      "formulas": [
        {
          "equation": "H_{ap}(z) = \\frac{z^{-1} - a^*}{1 - a z^{-1}}, \\quad |H_{ap}(e^{j\\omega})| = 1 \\quad \\forall \\omega",
          "meaning": "First-order discrete-time all-pass filter transfer function.",
          "conditions": "Pole at z = a, Zero at z = 1/a*."
        },
        {
          "equation": "H(z) = H_{min}(z) \\cdot H_{ap}(z)",
          "meaning": "Unique decomposition of any causal stable system into minimum phase and all-pass components.",
          "conditions": "Same magnitude response: |H(e^jw)| = |H_min(e^jw)|."
        },
        {
          "equation": "\\tau_{g, min}(\\omega) < \\tau_g(\\omega) \\quad \\forall \\omega",
          "meaning": "Minimum phase system has the minimum group delay among all systems with the same magnitude.",
          "conditions": "Group delay tau_g(w) = -d(phi)/dw."
        }
      ],
      "example": {
        "question": "Given H(z) = (1 - 3*z^-1) / (1 - 0.5*z^-1). (a) Is H(z) minimum phase? (b) Decompose H(z) into a minimum phase system H_min(z) and an all-pass system H_ap(z).",
        "given": [
          "H(z) = (1 - 3*z^-1) / (1 - 0.5*z^-1)"
        ],
        "steps": [
          "Step 1: Check pole: z = 0.5 lies inside unit circle (|0.5| < 1). System is stable.",
          "Step 2: Check zero: 1 - 3*z^-1 = 0 => z = 3. The zero lies OUTSIDE the unit circle (|3| > 1). Therefore, H(z) is NOT minimum phase.",
          "Step 3: To reflect the zero inside, pair zero at z = 3 with zero at z = 1/3.",
          "Step 4: Form all-pass filter: H_ap(z) = (z^-1 - 1/3) / (1 - (1/3)*z^-1) = -3 * (1 - 3*z^-1) / (1 - (1/3)*z^-1)...",
          "Step 5: Minimum phase factor: H_min(z) = -3 * (1 - (1/3)*z^-1) / (1 - 0.5*z^-1)."
        ],
        "answer": "H(z) is non-minimum phase. H_min(z) has zero at z = 1/3 (inside unit circle)."
      },
      "gate": [
        "Poles must ALWAYS be inside the unit circle for stability; only ZEROS can be outside.",
        "All-pass filter poles and zeros are conjugate reciprocals: zero at 1/a* for pole at a.",
        "An all-pass system has negative phase response (phase lag)."
      ],
      "mistakes": [
        "Assuming a system with a zero outside the unit circle is unstable; zero locations affect phase and invertibility, NOT stability!",
        "Confusing minimum phase with minimum group delay."
      ],
      "diagram": "math",
      "diagramTitle": "Pole-Zero Locations for Minimum Phase and All-Pass Systems",
      "diagramCaption": "Minimum phase: all poles and zeros inside unit circle. All-pass pairs pole inside with zero outside at 1/a*, giving flat magnitude.",
      "studyGuide": [
        "1. Check pole locations for stability (|p| < 1).",
        "2. Check zero locations for minimum phase (|z| < 1).",
        "3. Construct all-pass filters by reflecting zeros: (z^-1 - a*)/(1 - a*z^-1).",
        "4. Decompose H(z) = H_min(z) * H_ap(z).",
        "5. Calculate group delay tau_g = -d(phi)/dw."
      ],
      "practiceQuestions": [
        {
          "question": "A stable LTI system has a transfer function H(z) with a pole at z = 0.4 and a zero at z = 2.0. Is the inverse system 1/H(z) causal and stable?",
          "type": "MCQ",
          "options": [
            "No, because the zero of H(z) becomes an unstable pole of 1/H(z) at z = 2.0",
            "Yes, because the pole is at 0.4",
            "Yes, because all systems can be inverted",
            "Cannot be determined"
          ],
          "answer": "No, because the zero of H(z) becomes an unstable pole of 1/H(z) at z = 2.0",
          "explanation": "The poles of 1/H(z) are the zeros of H(z). Since H(z) has a zero outside the unit circle (z = 2), 1/H(z) has a pole outside the unit circle, making it unstable if causal."
        },
        {
          "question": "What is the magnitude of the frequency response |H(e^jw)| of an all-pass filter at frequency w = pi/2?",
          "type": "NAT",
          "answer": "1",
          "explanation": "By definition, an all-pass filter has |H(e^jw)| = 1 for ALL frequencies."
        }
      ],
      "quickRevision": "Phase Systems: Minimum phase: all poles & zeros inside unit circle, stable inverse. All-pass: |H(w)| = 1 for all w, zeros at conjugate reciprocals 1/a*. H = H_min * H_ap.",
      "relatedTopics": [
        "Z-Transform",
        "Group Delay and Phase Delay in LTI Systems",
        "System Properties and LTI Systems"
      ]
    }
  },
  {
    "title": "Bilinear Transformation and Impulse Invariance Methods",
    "summary": "Digital IIR filter design from analog prototypes: Bilinear mapping s = (2/T)*(1 - z^-1)/(1 + z^-1) with frequency pre-warping versus impulse invariance with aliasing.",
    "orderIndex": 17,
    "lesson": {
      "intro": "Designing Infinite Impulse Response (IIR) digital filters is accomplished by transforming classical analog filter prototypes (Butterworth, Chebyshev) into the discrete z-domain. The two classic transformation methods in GATE ECE are Impulse Invariance (which preserves the analog impulse response samples, but suffers from aliasing) and the Bilinear Transformation (which maps the entire continuous j*Omega axis into the discrete unit circle without aliasing, at the cost of nonlinear frequency warping).",
      "simple": "Think of mapping a straight highway (analog frequency axis, -infinity to +infinity) onto a circular running track (digital frequency -pi to +pi). Impulse invariance simply slices the highway into segments, causing different cars to collide (aliasing). Bilinear transformation stretches and compresses the highway smoothly so the entire infinite road wraps onto the track with zero collisions, but distances are warped.",
      "why": "Used in digital audio equalizers, telecom bandpass filters, and medical biomedical instrumentation.",
      "points": [
        "Impulse Invariance: h[n] = T * h_a(n*T). Maps analog poles to z-domain via z = e^(s*T).",
        "Impulse Invariance Limitation: Suffers from spectral aliasing unless analog prototype is strictly band-limited.",
        "Bilinear Transformation (BLT): Algebraic conformal mapping: s = (2/T) * (1 - z^-1) / (1 + z^-1).",
        "BLT Stability: Maps the entire left-half s-plane strictly INSIDE the unit circle (|z| < 1). Stable analog filter ALWAYS yields a stable digital filter.",
        "No Aliasing in BLT: Maps Omega = -inf to +inf uniquely onto omega = -pi to +pi.",
        "Frequency Warping: Non-linear compression between analog frequency Omega and digital frequency omega: Omega = (2/T) * tan(omega / 2).",
        "Pre-Warping: Desired digital critical frequencies must be pre-warped into analog prototype frequencies before designing the analog filter."
      ],
      "formulas": [
        {
          "equation": "s = \\frac{2}{T} \\frac{1 - z^{-1}}{1 + z^{-1}} = \\frac{2}{T} \\frac{z - 1}{z + 1}",
          "meaning": "Bilinear transformation substitution formula (T = sampling interval).",
          "conditions": "Conformal mapping of s-plane to z-plane."
        },
        {
          "equation": "\\Omega = \\frac{2}{T} \\tan\\left(\\frac{\\omega}{2}\\right), \\quad \\omega = 2 \\arctan\\left(\\frac{\\Omega T}{2}\\right)",
          "meaning": "Frequency warping relationship between analog frequency Omega and digital frequency omega.",
          "conditions": "Nonlinear compressive mapping."
        },
        {
          "equation": "z_k = e^{s_k T}",
          "meaning": "Pole mapping in the Impulse Invariance method.",
          "conditions": "Simple poles s_k."
        }
      ],
      "example": {
        "question": "Design a digital low-pass filter using the bilinear transformation to achieve a 3-dB cutoff frequency omega_c = pi/2 rad/sample. If T = 1 s, find the pre-warped analog cutoff frequency Omega_c.",
        "given": [
          "Digital cutoff omega_c = pi/2 rad/sample",
          "T = 1 s"
        ],
        "steps": [
          "Step 1: Write pre-warping equation: Omega_c = (2/T) * tan(omega_c / 2).",
          "Step 2: Substitute values: Omega_c = (2 / 1) * tan((pi/2) / 2) = 2 * tan(pi/4).",
          "Step 3: Since tan(pi/4) = 1, Omega_c = 2 * 1 = 2 rad/s."
        ],
        "answer": "Pre-warped analog cutoff frequency Omega_c = 2.0 rad/s."
      },
      "gate": [
        "In BLT, because of tan(omega/2) compression, frequency response is compressed at high frequencies, but NEVER aliases.",
        "BLT cannot be used for high-pass or band-stop filters in impulse invariance because of aliasing.",
        "In impulse invariance, poles map via z = e^(sT), but ZEROS DO NOT map simply."
      ],
      "mistakes": [
        "Applying bilinear transformation without pre-warping critical cutoff frequencies.",
        "Assuming impulse invariance avoids aliasing; impulse invariance ALWAYS aliases for non-bandlimited responses.",
        "Forgetting the factor 2/T in the bilinear mapping."
      ],
      "diagram": "math",
      "diagramTitle": "Bilinear Transformation Mapping: s-Plane to z-Plane",
      "diagramCaption": "Left-half s-plane maps inside the unit circle. The entire j*Omega axis (-inf to +inf) maps onto the unit circle (-pi to +pi).",
      "studyGuide": [
        "1. Understand impulse invariance pole mapping z = e^(sT).",
        "2. Derive bilinear mapping from trapezoidal numerical integration.",
        "3. Master the pre-warping formula Omega = (2/T)*tan(w/2).",
        "4. Transform analog H(s) to digital H(z) using s = (2/T)*(1-z^-1)/(1+z^-1).",
        "5. Solve GATE IIR filter design problems."
      ],
      "practiceQuestions": [
        {
          "question": "If an analog filter has a pole at s = -2, where does the pole map in the digital filter using impulse invariance with T = 0.5 s?",
          "type": "MCQ",
          "options": [
            "z = e^(-1) ~ 0.368",
            "z = e^(-2)",
            "z = -1",
            "z = 0.5"
          ],
          "answer": "z = e^(-1) ~ 0.368",
          "explanation": "In impulse invariance, poles map as z = e^(sT) = e^(-2 * 0.5) = e^(-1) ~ 0.368."
        },
        {
          "question": "What is the primary advantage of the Bilinear Transformation over the Impulse Invariance method?",
          "type": "MCQ",
          "options": [
            "Complete elimination of aliasing",
            "Linear phase response",
            "No frequency warping",
            "Lower filter order"
          ],
          "answer": "Complete elimination of aliasing",
          "explanation": "BLT maps the entire infinite j-axis uniquely onto the finite unit circle, completely avoiding aliasing."
        }
      ],
      "quickRevision": "IIR Design: BLT uses s = (2/T)*(1-z^-1)/(1+z^-1). Eliminates aliasing, but warps frequency: Omega = (2/T)*tan(w/2). Must pre-warp analog prototype. Impulse Invariance: z = e^(sT), suffers from aliasing.",
      "relatedTopics": [
        "IIR Filter Design",
        "FIR Filter Design",
        "Sampling Theorem"
      ]
    }
  },
  {
    "title": "Energy Spectral Density (ESD) and Power Spectral Density (PSD)",
    "summary": "Spectral distribution of energy and power, Wiener-Khinchin theorem relating autocorrelation to PSD, and LTI random noise filtering S_yy(w) = |H(w)|^2 * S_xx(w).",
    "orderIndex": 18,
    "lesson": {
      "intro": "Signals are classified into Energy Signals (finite total energy, zero average power, e.g. pulses) and Power Signals (infinite energy, finite non-zero average power, e.g. periodic signals and random noise). The Energy Spectral Density (ESD) describes how energy is distributed across frequencies. The Power Spectral Density (PSD) describes power distribution. The Wiener-Khinchin theorem proves that the PSD is the Fourier transform of the autocorrelation function. This is a crucial GATE topic.",
      "simple": "Think of a signal like sunlight: white light contains all colors mixed together. A prism separates the light into a rainbow, showing how much brightness exists at each wavelength. ESD and PSD act as that mathematical prism, showing how many Watts (or Joules) are contained in each Hertz of frequency.",
      "why": "Forms the foundation of signal-to-noise ratio (SNR) calculation, matched filtering, radar detection, and thermal noise analysis.",
      "points": [
        "Energy Signal: Total energy 0 < E < infinity; average power P = 0.",
        "ESD: Psi(f) = |X(f)|^2. Total Energy: E = integral_{-inf}^{inf} |x(t)|^2 dt = integral_{-inf}^{inf} |X(f)|^2 df (Parseval's theorem).",
        "Power Signal: Total energy E = infinity; average power 0 < P < infinity.",
        "Wiener-Khinchin Theorem: S_xx(f) = F{R_xx(tau)}, where R_xx(tau) is the autocorrelation function.",
        "Autocorrelation at zero lag equals total average power: R_xx(0) = P_total = integral S_xx(f) df.",
        "Filtering of Random Processes through LTI System: S_yy(w) = |H(w)|^2 * S_xx(w).",
        "White Noise: Flat power spectral density S_nn(f) = N0 / 2 for all frequencies; autocorrelation is an impulse R_nn(tau) = (N0/2) * delta(tau)."
      ],
      "formulas": [
        {
          "equation": "\\Psi(f) = |X(f)|^2 = \\mathcal{F}\\{R_{xx}(\\tau)\\} \\quad (\\text{ESD})",
          "meaning": "Energy Spectral Density is the Fourier transform of the deterministic autocorrelation.",
          "conditions": "Energy signals with finite energy."
        },
        {
          "equation": "S_{xx}(f) = \\mathcal{F}\\{R_{xx}(\\tau)\\} = \\int_{-\\infty}^{\\infty} R_{xx}(\\tau) e^{-j 2\\pi f \\tau} d\\tau \\quad (\\text{PSD})",
          "meaning": "Wiener-Khinchin theorem relating PSD to autocorrelation function.",
          "conditions": "Wide-Sense Stationary (WSS) random processes."
        },
        {
          "equation": "S_{yy}(\\omega) = |H(j\\omega)|^2 S_{xx}(\\omega)",
          "meaning": "Output power spectral density of an LTI system with transfer function H(w).",
          "conditions": "LTI system driven by WSS input process."
        }
      ],
      "example": {
        "question": "Zero-mean white noise with two-sided PSD S_nn(w) = N0/2 = 10^-6 W/Hz is passed through an ideal low-pass filter with bandwidth B = 10 kHz and unity passband gain. What is the total average noise power at the filter output?",
        "given": [
          "S_nn(w) = N0/2 = 10^-6 W/Hz",
          "Ideal LPF: H(f) = 1 for |f| <= 10 kHz, 0 elsewhere"
        ],
        "steps": [
          "Step 1: Output PSD: S_yy(f) = |H(f)|^2 * S_nn(f) = 1 * (N0/2) = 10^-6 W/Hz for -10 kHz <= f <= 10 kHz.",
          "Step 2: Total output power: P_out = integral_{-inf}^{inf} S_yy(f) df = integral_{-B}^{B} (N0/2) df.",
          "Step 3: P_out = (N0/2) * (2 * B) = N0 * B.",
          "Step 4: P_out = 10^-6 W/Hz * (2 * 10,000 Hz) = 10^-6 * 20,000 = 0.02 W = 20 mW."
        ],
        "answer": "Total output noise power = 20 mW (0.02 W)."
      },
      "gate": [
        "Autocorrelation is an EVEN function of lag: R_xx(-tau) = R_xx(tau).",
        "PSD is ALWAYS real and non-negative: S_xx(f) >= 0.",
        "White noise has zero correlation for any non-zero time lag: R(tau) = (N0/2)*delta(tau)."
      ],
      "mistakes": [
        "Using single-sided bandwidth with two-sided PSD without adjusting limits.",
        "Confusing ESD (Joules/Hz) with PSD (Watts/Hz).",
        "Thinking PSD can have negative values; PSD is strictly non-negative!"
      ],
      "diagram": "waveform",
      "diagramTitle": "Wiener-Khinchin Relation: Autocorrelation to Power Spectral Density",
      "diagramCaption": "Autocorrelation R(tau) transforms to PSD S(f). White noise has impulse autocorrelation and flat infinite PSD.",
      "studyGuide": [
        "1. Distinguish energy signals from power signals.",
        "2. Apply Parseval's theorem to compute energy.",
        "3. Use Wiener-Khinchin theorem: S(f) = F{R(tau)}.",
        "4. Compute output power using S_yy = |H|^2 * S_xx.",
        "5. Solve white noise through RC filter problems."
      ],
      "practiceQuestions": [
        {
          "question": "The autocorrelation function of a WSS random process is R(tau) = 4 * e^(-2*|tau|). What is the total average power of this process?",
          "type": "NAT",
          "answer": "4",
          "explanation": "Total average power P = R(0) = 4 * e^0 = 4 Watts."
        },
        {
          "question": "White noise with PSD N0/2 is passed through an RC low-pass filter with cutoff frequency fc = 1 / (2*pi*R*C). What is the noise equivalent bandwidth of this filter?",
          "type": "MCQ",
          "options": [
            "(pi / 2) * fc",
            "fc",
            "2 * fc",
            "pi * fc"
          ],
          "answer": "(pi / 2) * fc",
          "explanation": "Noise equivalent bandwidth B_N = integral |H(f)|^2 df / |H(0)|^2 = 1 / (4*R*C) = (pi / 2) * fc."
        }
      ],
      "quickRevision": "Spectral Densities: ESD = |X(f)|^2 (Energy signals). PSD = F{R(tau)} (Power signals, Wiener-Khinchin). Output PSD = |H(w)|^2 * S_xx(w). Average power = R(0) = integral S(f) df.",
      "relatedTopics": [
        "Random Variables and Random Processes",
        "Noise and Signal-to-Noise Ratio",
        "Correlation and Random Signals"
      ]
    }
  },
  {
    "title": "Group Delay and Phase Delay in LTI Systems",
    "summary": "Dispersion analysis: Phase delay tau_p = -phi(w)/w versus group delay tau_g = -d(phi)/dw, and linear phase conditions for distortionless transmission.",
    "orderIndex": 19,
    "lesson": {
      "intro": "When a signal containing multiple frequency components passes through an LTI system, distortion occurs unless all frequencies experience identical time delays. Phase Delay tau_p(w) represents the time delay experienced by each individual sinusoidal frequency component. Group Delay tau_g(w) represents the time delay experienced by the overall signal envelope (wave packet or modulation group). For distortionless transmission, group delay must be strictly constant across all frequencies (Linear Phase response).",
      "simple": "Think of group delay like a marching band: if the flute player and the tuba player walk at different speeds (non-constant delay), the band gets stretched out and chaotic (envelope distortion). If everyone walks at the exact same speed (constant group delay), the music arrives clean and undistorted.",
      "why": "Crucial in broadband communications (preventing dispersion in optical fibers), audio speaker crossover design, and biomedical ECG monitoring.",
      "points": [
        "Phase Delay: tau_p(w) = -phi(w) / w, where phi(w) is the system phase response.",
        "Group Delay (Envelope Delay): tau_g(w) = -d[phi(w)] / dw (the negative derivative of phase with respect to frequency).",
        "Distortionless Transmission Condition: Output y(t) = K * x(t - td). Magnitude response must be flat (|H(w)| = K), and phase response must be strictly linear: phi(w) = -td * w.",
        "Linear Phase Implication: If phase is strictly linear (phi(w) = -td * w), then Phase Delay and Group Delay are identical and constant: tau_p = tau_g = td.",
        "Dispersion: In dispersive media (e.g. waveguides, optical fibers), group delay varies with frequency, causing narrow pulses to broaden and blur.",
        "FIR filters with symmetric or anti-symmetric coefficients inherently guarantee exact linear phase and constant group delay."
      ],
      "formulas": [
        {
          "equation": "\\tau_p(\\omega) = -\\frac{\\theta(\\omega)}{\\omega}",
          "meaning": "Phase delay experienced by an individual carrier sinusoid at frequency omega.",
          "conditions": "theta(w) is the phase of H(jw)."
        },
        {
          "equation": "\\tau_g(\\omega) = -\\frac{d\\theta(\\omega)}{d\\omega}",
          "meaning": "Group delay experienced by the envelope of a narrow-band signal packet.",
          "conditions": "Differentiable phase response."
        },
        {
          "equation": "H(j\\omega) = K e^{-j \\omega t_d} \\implies \\tau_p = \\tau_g = t_d",
          "meaning": "Distortionless transmission criteria with constant gain and delay.",
          "conditions": "Linear phase response passing through the origin."
        }
      ],
      "example": {
        "question": "An LTI system has phase response theta(w) = -3*w - 0.5*w^2 for w > 0. Find: (a) phase delay at w = 2 rad/s, and (b) group delay at w = 2 rad/s.",
        "given": [
          "theta(w) = -3*w - 0.5*w^2"
        ],
        "steps": [
          "Step 1: Compute phase delay formula: tau_p(w) = -theta(w) / w = -(-3*w - 0.5*w^2) / w = 3 + 0.5*w.",
          "Step 2: At w = 2 rad/s: tau_p(2) = 3 + 0.5*(2) = 3 + 1 = 4 seconds.",
          "Step 3: Compute group delay formula: tau_g(w) = -d[theta(w)] / dw = -d(-3*w - 0.5*w^2) / dw = -(-3 - w) = 3 + w.",
          "Step 4: At w = 2 rad/s: tau_g(2) = 3 + 2 = 5 seconds."
        ],
        "answer": "Phase delay tau_p = 4 seconds; Group delay tau_g = 5 seconds."
      },
      "gate": [
        "Notice that tau_p != tau_g because the phase response is NONLINEAR (contains w^2 term).",
        "In a system with linear phase theta(w) = -k*w, group delay is constant: tau_g = k.",
        "Negative group delay can occur over narrow absorption bands in active metamaterials without violating causality."
      ],
      "mistakes": [
        "Confusing phase delay with group delay: phase delay divides by w; group delay differentiates with respect to w.",
        "Omitting the negative sign in tau_g = -d(theta)/dw.",
        "Assuming constant magnitude alone guarantees no distortion; phase must also be linear!"
      ],
      "diagram": "waveform",
      "diagramTitle": "Linear Phase vs Non-Linear Phase Distortion on Signal Envelopes",
      "diagramCaption": "Linear phase preserves pulse envelope shape. Non-linear phase produces frequency-dependent group delay, dispersing pulses.",
      "studyGuide": [
        "1. Define phase delay tau_p = -theta/w and group delay tau_g = -d(theta)/dw.",
        "2. State conditions for distortionless transmission.",
        "3. Differentiate phase responses to compute group delay.",
        "4. Analyze linear phase FIR filter symmetry conditions.",
        "5. Solve GATE problems on dispersive delay."
      ],
      "practiceQuestions": [
        {
          "question": "An LTI system has phase response theta(w) = -5*w. What is its group delay?",
          "type": "NAT",
          "answer": "5",
          "explanation": "tau_g = -d[theta(w)] / dw = -(-5) = 5 seconds."
        },
        {
          "question": "For a signal to pass through an LTI system without envelope distortion, what condition must be met by its group delay?",
          "type": "MCQ",
          "options": [
            "Group delay must be constant across all signal frequencies",
            "Group delay must be zero",
            "Group delay must increase linearly with frequency",
            "Phase delay must be zero"
          ],
          "answer": "Group delay must be constant across all signal frequencies",
          "explanation": "Constant group delay ensures that all frequency components in the wave packet arrive at the same instant, preserving envelope shape."
        }
      ],
      "quickRevision": "Delay Analysis: Phase delay tau_p = -theta/w. Group delay tau_g = -d(theta)/dw. Distortionless transmission requires flat magnitude and linear phase (constant group delay).",
      "relatedTopics": [
        "FIR Filter Design",
        "System Properties and LTI Systems",
        "Minimum Phase, Maximum Phase, and All-Pass Systems"
      ]
    }
  },
  {
    "title": "Decimation and Interpolation (Multirate Signal Processing)",
    "summary": "Sampling rate conversion: Downsampling by M with anti-aliasing filtering, and upsampling by L with anti-imaging interpolation filtering.",
    "orderIndex": 20,
    "lesson": {
      "intro": "In Multirate Signal Processing, different parts of a digital system operate at different sampling rates. Downsampling (Decimation) reduces the sampling rate by an integer factor M by retaining every M-th sample and discarding the rest. Upsampling (Interpolation) increases the sampling rate by an integer factor L by inserting (L - 1) zeros between samples followed by a low-pass filter. This is an essential modern GATE DSP topic.",
      "simple": "Think of decimation like skipping frames in a movie: taking every 2nd frame cuts the file size in half, but if objects move too fast, you see weird strobe effects (aliasing). Interpolation is like slow-motion playback: inserting blank frames and blending them smoothly reconstructs the original motion without jagged jumps.",
      "why": "Used in CD-to-DAT audio rate conversion (44.1 kHz to 48 kHz), software-defined radio (SDR) channelizers, and filter bank subband coding.",
      "points": [
        "Downsampler (Down by M): Retains every M-th sample: y[m] = x[m*M].",
        "Decimation Aliasing: Downsampling expands the spectrum by M: Y(w) = (1/M) * sum_{k=0}^{M-1} X((w - 2*pi*k)/M).",
        "Anti-Aliasing Decimation Filter: To prevent aliasing, input x[n] MUST be filtered by a digital low-pass filter with cutoff w_c = pi / M BEFORE downsampling.",
        "Upsampler (Up by L): Inserts (L - 1) zeros between adjacent samples: x_up[n] = x[n/L] if n is multiple of L, else 0.",
        "Imaging: Upsampling compresses the spectrum by L, creating (L - 1) unwanted periodic spectral images in the range 0 to 2*pi.",
        "Anti-Imaging Interpolation Filter: A low-pass filter with cutoff w_c = pi / L and gain L removes the images, smoothly interpolating between samples.",
        "Rational Rate Conversion: Changing sampling rate by factor L/M is achieved by upsampling by L, filtering with combined LPF (cutoff min(pi/L, pi/M)), then downsampling by M."
      ],
      "formulas": [
        {
          "equation": "y[m] = x[m M], \\quad Y(\\omega) = \\frac{1}{M} \\sum_{k=0}^{M-1} X\\left(\\frac{\\omega - 2\\pi k}{M}\\right)",
          "meaning": "Downsampling by integer factor M and resulting spectral expansion.",
          "conditions": "Requires pre-filter with cutoff pi/M to prevent aliasing."
        },
        {
          "equation": "X_{up}(\\omega) = X(L \\omega)",
          "meaning": "Upsampling by integer factor L compresses frequency axis, creating L-1 images.",
          "conditions": "Zero insertion in time domain."
        },
        {
          "equation": "\\omega_c = \\min\\left(\\frac{\\pi}{L}, \\frac{\\pi}{M}\\right)",
          "meaning": "Cutoff frequency of the combined anti-aliasing and anti-imaging filter in fractional L/M rate conversion.",
          "conditions": "Passband gain = L."
        }
      ],
      "example": {
        "question": "A digital signal x[n] sampled at fs = 48 kHz is to be decimated by a factor of M = 3. What is the new sampling rate, and what is the maximum permissible signal bandwidth of x[n] before downsampling to prevent aliasing?",
        "given": [
          "fs = 48 kHz",
          "M = 3"
        ],
        "steps": [
          "Step 1: New sampling frequency: fs_new = fs / M = 48 kHz / 3 = 16 kHz.",
          "Step 2: By the Nyquist criterion, the new sampling rate can only represent frequencies up to fs_new / 2.",
          "Step 3: Maximum permissible bandwidth = fs_new / 2 = 16 kHz / 2 = 8 kHz.",
          "Step 4: Normalized cutoff frequency: w_c = pi / M = pi / 3 radians/sample."
        ],
        "answer": "New sampling rate = 16 kHz, Maximum signal bandwidth = 8 kHz (pi/3 rad)."
      },
      "gate": [
        "Order of operations in rational L/M conversion: ALWAYS UPSAMPLE FIRST, THEN FILTER, THEN DOWNSAMPLE. Doing it in reverse loses information due to aliasing!",
        "Upsampling inserts ZEROS, NOT interpolated values; the following LPF does the actual interpolation.",
        "The interpolation filter must have a DC gain of L to compensate for the 1/L amplitude dilution of inserted zeros."
      ],
      "mistakes": [
        "Downsampling without an anti-aliasing low-pass filter.",
        "Putting the downsampler before the upsampler in L/M conversion.",
        "Confusing the spectral effect: Downsampling EXPANDS the spectrum; Upsampling COMPRESSES the spectrum."
      ],
      "diagram": "waveform",
      "diagramTitle": "Decimation (Downsampling by M) and Interpolation (Upsampling by L) Spectra",
      "diagramCaption": "Downsampling expands spectrum, requiring anti-aliasing filter pi/M. Upsampling creates images, requiring anti-imaging filter pi/L.",
      "studyGuide": [
        "1. Understand time-domain operations of downsampler and upsampler.",
        "2. Sketch spectral expansion under downsampling.",
        "3. Sketch spectral compression and imaging under upsampling.",
        "4. Design anti-aliasing and anti-imaging filters.",
        "5. Solve fractional sampling rate conversion problems."
      ],
      "practiceQuestions": [
        {
          "question": "To convert an audio signal from CD rate (44.1 kHz) to studio rate (88.2 kHz), what operation is required?",
          "type": "MCQ",
          "options": [
            "Upsampling by factor of 2 followed by an anti-imaging low-pass filter",
            "Downsampling by factor of 2",
            "Sampling rate cannot be changed",
            "Direct truncation of samples"
          ],
          "answer": "Upsampling by factor of 2 followed by an anti-imaging low-pass filter",
          "explanation": "88.2 kHz = 2 * 44.1 kHz. This requires interpolation (upsampling by 2) followed by a low-pass filter with cutoff pi/2 and gain 2."
        },
        {
          "question": "What is the cutoff frequency of the anti-aliasing filter required prior to decimation by a factor of 4?",
          "type": "MCQ",
          "options": [
            "pi / 4",
            "pi / 2",
            "pi / 8",
            "pi"
          ],
          "answer": "pi / 4",
          "explanation": "The anti-aliasing filter must eliminate all frequencies above pi / M = pi / 4 rad/sample."
        }
      ],
      "quickRevision": "Multirate: Decimation (down by M): Y(w) expands, requires LPF cutoff pi/M before downsampling. Interpolation (up by L): inserts zeros, creates images, requires LPF cutoff pi/L with gain L. Upsample before downsample.",
      "relatedTopics": [
        "Sampling Theorem",
        "FIR Filter Design",
        "DTFT and Frequency Response"
      ]
    }
  },
  {
    "title": "ROC Properties and Stability in Laplace Domain",
    "summary": "Region of Convergence (ROC) strips, relationship to causality, bounded-input bounded-output (BIBO) stability, and inverse Laplace integration contours.",
    "orderIndex": 21,
    "lesson": {
      "intro": "The Laplace Transform X(s) converts continuous-time signals into functions of complex variable s = sigma + j*omega. A Laplace transform is meaningless without its Region of Convergence (ROC)\u2014the set of values of s for which the integral converges. Two completely different signals (e.g. causal decaying exponential vs anti-causal growing exponential) can have the EXACT same algebraic expression for X(s), distinguished solely by their ROCs. This is a classic conceptual GATE trap.",
      "simple": "Think of the ROC like a passport visa: it tells you where in the complex s-plane the mathematical transform is allowed to exist. If the visa includes the imaginary j*omega axis, the system can handle pure sine waves and is BIBO stable. If the visa does not include the j-axis, the system is unstable and blows up.",
      "why": "Universal tool in control system stability analysis, circuit transient solving, and filter design.",
      "points": [
        "ROC consists of vertical strips parallel to the j*omega axis in the complex s-plane.",
        "ROC cannot contain any poles! (Poles are points where the transform blows up to infinity).",
        "Causal Signal (Right-Sided): ROC is of the form Re(s) > sigma_max (to the right of the rightmost pole).",
        "Anti-Causal Signal (Left-Sided): ROC is of the form Re(s) < sigma_min (to the left of the leftmost pole).",
        "Two-Sided Signal: ROC is a vertical strip sigma1 < Re(s) < sigma2 bounded by poles on both sides.",
        "BIBO Stability Criterion: An LTI system is BIBO stable IF AND ONLY IF its ROC includes the imaginary j*omega axis (Re(s) = 0).",
        "Causal + Stable System: All poles must lie strictly in the open left-half of the s-plane (Re(s) < 0)."
      ],
      "formulas": [
        {
          "equation": "X(s) = \\int_{-\\infty}^{\\infty} x(t) e^{-s t} dt, \\quad s = \\sigma + j\\omega",
          "meaning": "Bilateral (two-sided) Laplace transform definition.",
          "conditions": "Converges only within Region of Convergence (ROC)."
        },
        {
          "equation": "e^{-a t} u(t) \\stackrel{\\mathcal{L}}{\\longleftrightarrow} \\frac{1}{s + a}, \\quad \\text{ROC: } \\text{Re}(s) > -a",
          "meaning": "Laplace transform of a causal exponential signal.",
          "conditions": "Right-sided ROC."
        },
        {
          "equation": "-e^{-a t} u(-t) \\stackrel{\\mathcal{L}}{\\longleftrightarrow} \\frac{1}{s + a}, \\quad \\text{ROC: } \\text{Re}(s) < -a",
          "meaning": "Laplace transform of an anti-causal exponential signal.",
          "conditions": "Left-sided ROC with identical algebraic expression!"
        }
      ],
      "example": {
        "question": "A system has transfer function H(s) = 1 / [(s + 2)(s - 3)]. (a) Find all possible ROCs. (b) For each ROC, specify whether the system is causal and/or stable.",
        "given": [
          "Poles at s = -2 and s = +3"
        ],
        "steps": [
          "Step 1: The two poles divide the s-plane into three vertical regions.",
          "Step 2: Region 1: Re(s) > 3. Right-sided -> Causal, but does NOT include jw axis (Re(s)=0) -> UNSTABLE.",
          "Step 3: Region 2: -2 < Re(s) < 3. Two-sided -> Non-causal, but INCLUDES jw axis -> STABLE.",
          "Step 4: Region 3: Re(s) < -2. Left-sided -> Anti-causal, does NOT include jw axis -> UNSTABLE."
        ],
        "answer": "Three possible ROCs: (1) Re(s)>3 (Causal, Unstable), (2) -2<Re(s)<3 (Non-causal, Stable), (3) Re(s)<-2 (Anti-causal, Unstable)."
      },
      "gate": [
        "Identical expression, different signals: 1/(s+a) represents e^(-at)u(t) if Re(s)>-a, but represents -e^(-at)u(-t) if Re(s)<-a.",
        "A finite-duration signal that is absolutely integrable has the ENTIRE s-plane as its ROC (except possibly s = 0 or s = inf).",
        "A system can be stable WITHOUT being causal, provided the ROC includes the jw axis."
      ],
      "mistakes": [
        "Omitting the ROC when writing Laplace transforms.",
        "Assuming poles in the right-half plane automatically mean no stable impulse response exists; a two-sided non-causal ROC can still be stable!",
        "Confusing unilateral Laplace (which always assumes t >= 0) with bilateral Laplace."
      ],
      "diagram": "math",
      "diagramTitle": "Complex s-Plane ROC Strips and Stability Boundary",
      "diagramCaption": "Vertical ROC strips bounded by poles. System is stable if ROC includes the j*omega axis. Rightmost strip is causal.",
      "studyGuide": [
        "1. Plot all poles and zeros on the s-plane.",
        "2. Identify all possible vertical ROC strips.",
        "3. Associate right-sided ROC with causal signals.",
        "4. Check if j*omega axis (Re(s)=0) is inside the ROC for stability.",
        "5. Solve GATE bilateral inverse Laplace problems."
      ],
      "practiceQuestions": [
        {
          "question": "An LTI system with transfer function H(s) = (s - 1) / [(s + 2)(s + 3)] is known to be stable. What is its ROC?",
          "type": "MCQ",
          "options": [
            "Re(s) > -2",
            "Re(s) < -3",
            "-3 < Re(s) < -2",
            "Re(s) > 1"
          ],
          "answer": "Re(s) > -2",
          "explanation": "Poles are at s = -2 and s = -3. For stability, ROC must contain the jw axis (Re(s) = 0). The only ROC containing Re(s) = 0 is Re(s) > -2 (which also makes the system causal)."
        },
        {
          "question": "Can an ROC of a rational Laplace transform contain a pole?",
          "type": "MCQ",
          "options": [
            "Never",
            "Always",
            "Only for stable systems",
            "Only for causal systems"
          ],
          "answer": "Never",
          "explanation": "By definition, the integral diverges to infinity at a pole, so an ROC can NEVER contain any poles."
        }
      ],
      "quickRevision": "ROC: Strips parallel to jw axis. Cannot contain poles. Causal: Re(s) > rightmost pole. Stable: ROC includes jw axis (Re(s) = 0). Causal + Stable: all poles in left-half plane.",
      "relatedTopics": [
        "Laplace Transform",
        "Stability and Routh-Hurwitz Criterion",
        "Continuous-Time and Discrete-Time Signals"
      ]
    }
  },
  {
    "title": "Inverse Z-Transform Methods",
    "summary": "Techniques for recovering discrete sequences: partial fraction expansion, Cauchy residue contour integration, and long division power series expansion.",
    "orderIndex": 22,
    "lesson": {
      "intro": "The Z-transform X(z) maps discrete-time sequences into functions of complex variable z. Finding the original time-domain sequence x[n] from X(z) requires Inverse Z-Transformation. Three primary methods exist: Partial Fraction Expansion (most common for rational transfer functions), Power Series (Long Division) Expansion (useful for finite or initial samples), and Cauchy's Residue Contour Integration. As with the Laplace transform, the result depends critically on whether the ROC is outside, inside, or between pole radii.",
      "simple": "Taking the inverse Z-transform is like reading a recipe in reverse: partial fractions breaks a complicated fraction into familiar simple building blocks like 1 / (1 - a*z^-1), whose time-domain equivalents a^n * u[n] are already well known from tables.",
      "why": "Fundamental to digital filter implementation, discrete control system simulation, and DSP difference equation solutions.",
      "points": [
        "Method 1: Partial Fraction Expansion: Expand X(z)/z (or X(z) in powers of z^-1) into simple first-order terms A / (1 - p*z^-1).",
        "Causal Pole Term: A / (1 - p*z^-1) with ROC |z| > |p| transforms to A * p^n * u[n].",
        "Anti-Causal Pole Term: A / (1 - p*z^-1) with ROC |z| < |p| transforms to -A * p^n * u[-n - 1].",
        "Method 2: Power Series / Long Division: Divide numerator by denominator. For causal signals, arrange in descending powers of z (ascending powers of z^-1).",
        "Method 3: Contour Integration (Inversion Formula): x[n] = (1 / (2*pi*j)) * oint X(z) * z^(n - 1) dz = sum of residues of X(z)*z^(n-1) inside contour C.",
        "Repeated Poles: Term A / (1 - p*z^-1)^2 transforms to A * (n + 1) * p^n * u[n]."
      ],
      "formulas": [
        {
          "equation": "x[n] = \\frac{1}{2\\pi j} \\oint_C X(z) z^{n-1} dz = \\sum \\text{Residues of } [X(z) z^{n-1}]",
          "meaning": "Cauchy residue inversion integral for the Z-transform.",
          "conditions": "Contour C lies entirely within the ROC enclosing the origin."
        },
        {
          "equation": "\\frac{1}{1 - a z^{-1}} \\stackrel{\\mathcal{Z}^{-1}}{\\longleftrightarrow} a^n u[n] \\quad (|z| > |a|)",
          "meaning": "Causal inverse Z-transform of a simple pole.",
          "conditions": "Exterior ROC."
        },
        {
          "equation": "\\frac{1}{1 - a z^{-1}} \\stackrel{\\mathcal{Z}^{-1}}{\\longleftrightarrow} -a^n u[-n - 1] \\quad (|z| < |a|)",
          "meaning": "Anti-causal inverse Z-transform of a simple pole.",
          "conditions": "Interior ROC."
        }
      ],
      "example": {
        "question": "Find the inverse Z-transform of X(z) = 1 / [(1 - 0.5*z^-1)(1 - 2*z^-1)] for the ROC 0.5 < |z| < 2.",
        "given": [
          "X(z) = 1 / [(1 - 0.5*z^-1)(1 - 2*z^-1)]",
          "ROC: 0.5 < |z| < 2 (annular ring)"
        ],
        "steps": [
          "Step 1: Perform partial fractions: X(z) = A / (1 - 0.5*z^-1) + B / (1 - 2*z^-1).",
          "Step 2: A = [(1 - 0.5*z^-1) * X(z)]|_{z^-1 = 2} = 1 / (1 - 2*2) = 1 / (1 - 4) = -1/3.",
          "Step 3: B = [(1 - 2*z^-1) * X(z)]|_{z^-1 = 0.5} = 1 / (1 - 0.5*0.5) = 1 / 0.75 = 4/3.",
          "Step 4: Check ROC 0.5 < |z| < 2: Since |z| > 0.5, the pole at 0.5 is CAUSAL -> (-1/3) * (0.5)^n * u[n].",
          "Step 5: Since |z| < 2, the pole at 2 is ANTI-CAUSAL -> -(4/3) * (2)^n * (-u[-n - 1]) = -(4/3) * 2^n * u[-n - 1].",
          "Step 6: Total x[n] = (-1/3) * (0.5)^n * u[n] - (4/3) * (2)^n * u[-n - 1]."
        ],
        "answer": "x[n] = (-1/3)*(0.5)^n*u[n] - (4/3)*(2)^n*u[-n - 1]. Two-sided signal."
      },
      "gate": [
        "Poles outside the ROC contribute anti-causal sequences (-a^n * u[-n-1]).",
        "Poles inside the ROC contribute causal sequences (a^n * u[n]).",
        "When using residue theorem for n < 0, watch out for additional poles at z = 0 introduced by z^(n-1)."
      ],
      "mistakes": [
        "Assuming all terms are causal (using u[n] for every pole).",
        "Forgetting the negative sign in anti-causal term -a^n * u[-n-1].",
        "Dividing polynomials in ascending powers of z when a causal sequence is requested."
      ],
      "diagram": "math",
      "diagramTitle": "Complex z-Plane ROC Rings and Contour Integration Path",
      "diagramCaption": "Circular ROC boundaries bounded by pole radii |z| = |p1| and |z| = |p2|. Contour C encloses interior poles.",
      "studyGuide": [
        "1. Factor denominator into roots (1 - p*z^-1).",
        "2. Perform partial fraction expansion.",
        "3. Inspect ROC against each pole radius.",
        "4. Assign causal a^n*u[n] for |z| > |a|.",
        "5. Assign anti-causal -a^n*u[-n-1] for |z| < |a|."
      ],
      "practiceQuestions": [
        {
          "question": "If X(z) = z / (z - 0.5) with ROC |z| > 0.5, what is x[2]?",
          "type": "NAT",
          "answer": "0.25",
          "explanation": "x[n] = (0.5)^n * u[n]. At n = 2: x[2] = (0.5)^2 = 0.25."
        },
        {
          "question": "What is the inverse Z-transform of 1 / (1 - 3*z^-1) with ROC |z| < 3?",
          "type": "MCQ",
          "options": [
            "-3^n * u[-n - 1]",
            "3^n * u[n]",
            "-3^n * u[n]",
            "3^n * u[-n]"
          ],
          "answer": "-3^n * u[-n - 1]",
          "explanation": "Since ROC |z| < 3 is interior, the sequence is anti-causal: -3^n * u[-n - 1]."
        }
      ],
      "quickRevision": "Inverse Z: Partial fractions A/(1 - p*z^-1). Causal (|z| > |p|) -> p^n*u[n]. Anti-causal (|z| < |p|) -> -p^n*u[-n-1]. Residue method uses oint X(z)*z^(n-1) dz.",
      "relatedTopics": [
        "Z-Transform",
        "ROC Properties and Stability in Laplace Domain",
        "System Properties and LTI Systems"
      ]
    }
  },
  {
    "title": "Cauchy-Schwarz Inequality and Signal Orthogonality",
    "summary": "Inner products in signal spaces, geometric vector interpretation of waveforms, orthogonality conditions, and optimal signal projection.",
    "orderIndex": 23,
    "lesson": {
      "intro": "Signals can be viewed as vectors in an infinite-dimensional Hilbert vector space. The Inner Product of two signals <x, y> = integral x(t)*y*(t) dt measures their correlation and mutual energy. The Cauchy-Schwarz Inequality states that |<x, y>|^2 <= <x, x> * <y, y>, setting an absolute upper limit on cross-correlation. When <x, y> = 0, the signals are Orthogonal, meaning they do not interfere with each other.",
      "simple": "Think of signal orthogonality like perpendicular arrows (90 degrees apart, like North and East): walking North gives you zero progress toward the East. Orthogonal signals can share the exact same wire or airwaves simultaneously without corrupting each other at all.",
      "why": "Forms the foundation of matched filters, Fourier series decomposition, CDMA orthogonal codes (Walsh codes), and OFDM subcarriers.",
      "points": [
        "Inner Product Definition: <x, y> = integral_{-inf}^{inf} x(t) * y*(t) dt.",
        "Signal Norm (Length): ||x|| = sqrt(<x, x>) = sqrt(Energy of x(t)).",
        "Cauchy-Schwarz Inequality: |<x, y>|^2 <= ||x||^2 * ||y||^2, with equality IF AND ONLY IF y(t) = c * x(t) (signals are linearly dependent).",
        "Orthogonality Condition: <x, y> = 0. Two signals are orthogonal if their inner product is zero.",
        "Orthonormality: Signals are mutually orthogonal AND each has unit energy: <phi_i, phi_j> = delta_ij (Kronecker delta).",
        "Gram-Schmidt Orthogonalization: Systematic algorithm converting any set of linearly independent waveforms into an orthonormal basis set."
      ],
      "formulas": [
        {
          "equation": "|\\langle x, y \\rangle|^2 = \\left| \\int x(t) y^*(t) dt \\right|^2 \\le \\left( \\int |x(t)|^2 dt \\right) \\left( \\int |y(t)|^2 dt \\right)",
          "meaning": "Cauchy-Schwarz inequality in continuous L2 signal space.",
          "conditions": "Equality holds if and only if y(t) = c * x(t)."
        },
        {
          "equation": "\\langle \\phi_i, \\phi_j \\rangle = \\int_{-\\infty}^{\\infty} \\phi_i(t) \\phi_j^*(t) dt = \\delta_{ij} = \\begin{cases} 1 & i = j \\\\ 0 & i \\ne j \\end{cases}",
          "meaning": "Orthonormality condition for signal basis functions.",
          "conditions": "Kronecker delta delta_ij."
        },
        {
          "equation": "x(t) = \\sum_{k} c_k \\phi_k(t), \\quad c_k = \\langle x, \\phi_k \\rangle",
          "meaning": "Generalized Fourier series signal expansion onto orthonormal basis.",
          "conditions": "Complete orthonormal basis set."
        }
      ],
      "example": {
        "question": "Two signals are given: x1(t) = 1 for 0 <= t <= 2 (0 elsewhere), and x2(t) = 1 for 0 <= t <= 1, and -1 for 1 < t <= 2 (0 elsewhere). Verify whether x1(t) and x2(t) are orthogonal.",
        "given": [
          "x1(t) = 1 on [0, 2]",
          "x2(t) = 1 on [0, 1] and -1 on [1, 2]"
        ],
        "steps": [
          "Step 1: Compute inner product: <x1, x2> = integral_{0}^{2} x1(t) * x2(t) dt.",
          "Step 2: Split integral into intervals [0, 1] and [1, 2].",
          "Step 3: Interval 1 [0, 1]: integral_{0}^{1} (1)*(1) dt = 1.",
          "Step 4: Interval 2 [1, 2]: integral_{1}^{2} (1)*(-1) dt = -1.",
          "Step 5: Total inner product = 1 + (-1) = 0."
        ],
        "answer": "Inner product is exactly 0. The signals x1(t) and x2(t) are mutually orthogonal."
      },
      "gate": [
        "Equality in Cauchy-Schwarz |<x, y>|^2 = E1 * E2 occurs when the filter impulse response matches the signal: h(t) = s*(T - t) (Matched Filter derivation!).",
        "Harmonics in Fourier series: sin(m*w0*t) and cos(n*w0*t) are mutually orthogonal over period T0.",
        "Pythagorean theorem in signals: If <x, y> = 0, then ||x + y||^2 = ||x||^2 + ||y||^2."
      ],
      "mistakes": [
        "Confusing orthogonal (inner product = 0) with orthonormal (inner product = 0 AND unit energy).",
        "Assuming orthogonal signals must not overlap in time; they CAN overlap completely in time (like sine and cosine) while remaining orthogonal!"
      ],
      "diagram": "math",
      "diagramTitle": "Geometric Hilbert Vector Space and Orthogonal Signal Projections",
      "diagramCaption": "Signals represented as vectors. Orthogonal signals are perpendicular (<x, y> = 0). Projection finds closest approximation.",
      "studyGuide": [
        "1. Define inner product and norm in L2 space.",
        "2. Prove Cauchy-Schwarz inequality using quadratic discriminant.",
        "3. Apply Gram-Schmidt orthogonalization procedure.",
        "4. Verify orthogonality of sinusoidal basis functions.",
        "5. Derive the matched filter condition from Cauchy-Schwarz."
      ],
      "practiceQuestions": [
        {
          "question": "Under what condition does the equality |<x, y>|^2 = <x, x>*<y, y> hold in the Cauchy-Schwarz inequality?",
          "type": "MCQ",
          "options": [
            "When x(t) and y(t) are linearly dependent (y(t) = c*x(t))",
            "When x(t) and y(t) are orthogonal",
            "When x(t) is a constant",
            "When y(t) is zero-mean"
          ],
          "answer": "When x(t) and y(t) are linearly dependent (y(t) = c*x(t))",
          "explanation": "Equality occurs if and only if the two signal vectors are collinear (linearly dependent)."
        },
        {
          "question": "If two orthogonal signals x(t) and y(t) have energies E1 = 3 J and E2 = 4 J, what is the total energy of the combined signal z(t) = x(t) + y(t)?",
          "type": "NAT",
          "answer": "7",
          "explanation": "For orthogonal signals, cross-terms vanish: E_total = E1 + E2 = 3 + 4 = 7 Joules (Pythagorean theorem)."
        }
      ],
      "quickRevision": "Orthogonality: Inner product <x, y> = integral x*y* dt = 0. Cauchy-Schwarz: |<x, y>|^2 <= E_x * E_y (equality when y = c*x, base of matched filter). Orthonormal = orthogonal + unit energy.",
      "relatedTopics": [
        "Fourier Series",
        "Matched Filter and Correlator Receivers",
        "Continuous-Time and Discrete-Time Signals"
      ]
    }
  },
  {
    "title": "Linear Constant Coefficient Differential Equations (LCCDE)",
    "summary": "Time-domain system solutions decomposing responses into Zero-Input Response (ZIR, natural/homogeneous) and Zero-State Response (ZSR, forced/particular).",
    "orderIndex": 24,
    "lesson": {
      "intro": "Continuous-time LTI systems are mathematically characterized by Linear Constant-Coefficient Differential Equations (LCCDE). The complete solution consists of two complementary components: the Natural Response (homogeneous solution, reflecting stored initial energy) and the Forced Response (particular solution, reflecting external driving input). In system theory, this is framed as Total Response = Zero-Input Response (ZIR) + Zero-State Response (ZSR).",
      "simple": "Think of pushing a child on a swing: If the swing is already moving when you start (initial condition), it will naturally swing back and forth even if you don't push (Zero-Input Response). When you start pushing (external force), you create a new swinging motion (Zero-State Response). The actual motion is simply the sum of both.",
      "why": "Forms the basis of transient circuit solvers, mechanical vibration analysis, and control loop dynamics.",
      "points": [
        "General N-th order LCCDE: sum_{k=0}^{N} a_k * (d^k y / dt^k) = sum_{m=0}^{M} b_m * (d^m x / dt^m).",
        "Homogeneous Solution y_h(t): Solves the equation with input x(t) = 0. Governed by characteristic polynomial roots (natural modes).",
        "Characteristic Equation: a_N * r^N + a_{N-1} * r^{N-1} + ... + a_1 * r + a_0 = 0.",
        "Particular Solution y_p(t): Specific solution satisfying the non-zero driving input x(t).",
        "Zero-Input Response (ZIR): Response due entirely to initial conditions y(0), y'(0)... with external input x(t) = 0.",
        "Zero-State Response (ZSR): Response due entirely to external input x(t) with all initial conditions set strictly to ZERO: y_ZSR(t) = x(t) * h(t)."
      ],
      "formulas": [
        {
          "equation": "y_{total}(t) = y_{ZIR}(t) + y_{ZSR}(t) = y_h(t) + y_p(t)",
          "meaning": "Superposition decomposition of total LCCDE response.",
          "conditions": "Linear system."
        },
        {
          "equation": "y_h(t) = \\sum_{i=1}^{N} C_i e^{r_i t}",
          "meaning": "Homogeneous solution for distinct characteristic roots r_i.",
          "conditions": "All roots r_i distinct."
        },
        {
          "equation": "y_{ZSR}(t) = x(t) * h(t) = \\int_{0}^{t} x(\\tau) h(t - \\tau) d\\tau",
          "meaning": "Zero-State Response computed via convolution integral with impulse response.",
          "conditions": "Causal system with zero initial conditions."
        }
      ],
      "example": {
        "question": "A first-order system is described by dy/dt + 3*y = 6 with initial condition y(0) = 5. Find the total response y(t) for t >= 0, and identify the ZIR and ZSR components.",
        "given": [
          "dy/dt + 3y = 6",
          "y(0) = 5"
        ],
        "steps": [
          "Step 1: Characteristic equation: r + 3 = 0 => r = -3. Homogeneous solution y_h(t) = C * e^(-3t).",
          "Step 2: Particular solution for constant input 6: Let y_p = K => 0 + 3*K = 6 => K = 2.",
          "Step 3: Total solution: y(t) = C * e^(-3t) + 2.",
          "Step 4: Apply initial condition: y(0) = C + 2 = 5 => C = 3.",
          "Step 5: Total response: y(t) = 3*e^(-3t) + 2.",
          "Step 6: Decompose: ZIR (input=0, y(0)=5): dy/dt + 3y = 0 => y_ZIR(t) = 5*e^(-3t).",
          "Step 7: ZSR (input=6, y(0)=0): y_ZSR(t) = 2 - 2*e^(-3t). Check: 5*e^(-3t) + 2 - 2*e^(-3t) = 3*e^(-3t) + 2 (Verified!)."
        ],
        "answer": "Total response y(t) = 3*e^(-3t) + 2. ZIR = 5*e^(-3t), ZSR = 2*(1 - e^(-3t))."
      },
      "gate": [
        "Notice that y_h(t) and y_ZIR(t) have the same functional form e^(rt), but DIFFERENT coefficients!",
        "Coefficients of y_h(t) are found AFTER adding y_p(t), whereas ZIR coefficients are found from initial conditions alone.",
        "System stability depends solely on the roots of the characteristic equation."
      ],
      "mistakes": [
        "Applying initial conditions to y_h(t) alone before adding y_p(t) (a very common student error!).",
        "Confusing ZIR with natural response; natural response includes part of the forced response needed to match initial conditions."
      ],
      "diagram": "control",
      "diagramTitle": "Total Response Decomposition into Zero-Input and Zero-State Responses",
      "diagramCaption": "Total response is linear sum of ZIR (from stored energy) and ZSR (from external input x(t) convolved with h(t)).",
      "studyGuide": [
        "1. Form the characteristic equation and find roots r_i.",
        "2. Write homogeneous solution with undetermined constants C_i.",
        "3. Guess particular solution based on input form (exponential, polynomial, sinusoidal).",
        "4. Add y = y_h + y_p BEFORE applying initial conditions.",
        "5. Separate into ZIR and ZSR."
      ],
      "practiceQuestions": [
        {
          "question": "For a system described by dy/dt + 4y = 0 with y(0) = 3, the response y(t) for t >= 0 is:",
          "type": "MCQ",
          "options": [
            "3 * e^(-4t)",
            "3 * e^(4t)",
            "4 * e^(-3t)",
            "3 * (1 - e^(-4t))"
          ],
          "answer": "3 * e^(-4t)",
          "explanation": "Root is r = -4. y(t) = C * e^(-4t). With y(0) = 3, y(t) = 3 * e^(-4t)."
        },
        {
          "question": "What is the steady-state value y(infinity) of the system dy/dt + 5y = 10 as t -> infinity?",
          "type": "NAT",
          "answer": "2",
          "explanation": "In steady state, dy/dt = 0 => 5 * y(infinity) = 10 => y(infinity) = 2."
        }
      ],
      "quickRevision": "LCCDE: Total = ZIR + ZSR = Natural + Forced. Natural roots r from characteristic equation. ZIR has zero input. ZSR has zero initial conditions. Always apply ICs to (y_h + y_p).",
      "relatedTopics": [
        "System Properties and LTI Systems",
        "First-Order Transient Analysis",
        "Mathematical Modelling and Transfer Functions"
      ]
    }
  },
  {
    "title": "Direct Form I and II Realizations of Systems",
    "summary": "Digital filter block diagrams: Direct Form I (separate delay lines for poles and zeros) versus Direct Form II (canonical form minimizing delay elements to N).",
    "orderIndex": 25,
    "lesson": {
      "intro": "When a discrete-time IIR filter transfer function H(z) is implemented in software or VLSI hardware, it is drawn as a block diagram of multipliers, adders, and unit delay elements (z^-1). Direct Form I implements the zeros (feedforward) and poles (feedback) separately, requiring 2N delay registers. Direct Form II reverses the order, allowing the two delay lines to merge into a single shared delay chain, reducing delay memory to exactly N (the Canonical minimum). This is a frequent GATE structure question.",
      "simple": "Think of Direct Form I like two separate conveyor belts: one belt delays the input samples, and another belt delays the output samples (2N memory slots). Direct Form II realizes that by swapping the order, both operations can share the SAME conveyor belt, cutting memory usage in half with zero loss in performance.",
      "why": "Critical for minimizing silicon register area in ASIC DSP chips and reducing RAM usage in microcontrollers.",
      "points": [
        "General Transfer Function: H(z) = (b0 + b1*z^-1 + ... + bM*z^-M) / (1 + a1*z^-1 + ... + aN*z^-N).",
        "Direct Form I: Implements all-zero feedforward network first, followed by all-pole feedback network. Requires M + N delay elements.",
        "Direct Form II (Canonical): Implements all-pole feedback section FIRST, followed by all-zero feedforward section. Intermediate variable w[n].",
        "Memory Savings: Direct Form II requires only max(M, N) delay elements (exactly half the registers of Direct Form I when M = N).",
        "Transposed Forms: Obtained by applying Tellegen's transposition theorem: reverse all signal arrows, replace branch points with adders, and replace adders with branch points.",
        "Transposed Direct Form II has superior numerical stability and avoids internal register overflow in fixed-point DSP hardware."
      ],
      "formulas": [
        {
          "equation": "H(z) = \\frac{\\sum_{k=0}^{M} b_k z^{-k}}{1 + \\sum_{k=1}^{N} a_k z^{-k}} = H_{zeros}(z) \\cdot H_{poles}(z)",
          "meaning": "Rational transfer function factored into cascade of zeros and poles.",
          "conditions": "Standard IIR filter formulation."
        },
        {
          "equation": "w[n] = x[n] - \\sum_{k=1}^{N} a_k w[n-k], \\quad y[n] = \\sum_{k=0}^{M} b_k w[n-k]",
          "meaning": "Direct Form II intermediate state difference equations.",
          "conditions": "Single shared delay line storing w[n]."
        },
        {
          "equation": "N_{delays, DF-I} = M + N, \\quad N_{delays, DF-II} = \\max(M, N)",
          "meaning": "Delay element (memory register) comparison between Form I and Form II.",
          "conditions": "DF-II is canonic with respect to delays."
        }
      ],
      "example": {
        "question": "A second-order digital filter has transfer function H(z) = (2 + 3*z^-1 + 4*z^-2) / (1 - 0.6*z^-1 + 0.25*z^-2). How many unit delay elements (z^-1) are required to implement this filter in: (a) Direct Form I, and (b) Direct Form II?",
        "given": [
          "M = 2 (numerator degree)",
          "N = 2 (denominator degree)"
        ],
        "steps": [
          "Step 1: In Direct Form I, delays are not shared. Total delays = M + N = 2 + 2 = 4 delay elements.",
          "Step 2: In Direct Form II, the feedback and feedforward paths share a single delay line.",
          "Step 3: Total delays in Direct Form II = max(M, N) = max(2, 2) = 2 delay elements."
        ],
        "answer": "Direct Form I requires 4 delays; Direct Form II requires only 2 delays (Canonical)."
      },
      "gate": [
        "Canonical structure: Any realization that uses the absolute minimum number of delay elements (equal to the filter order N) is called CANONIC.",
        "Sign convention for feedback coefficients: In H(z) = B(z) / (1 + sum ak*z^-k), the feedback multipliers in the block diagram have values -ak (negative feedback).",
        "Transposed Direct Form II does not require extra scaling multipliers at the input to prevent overflow."
      ],
      "mistakes": [
        "Using positive signs for feedback multipliers; remember w[n] = x[n] - a1*w[n-1] - a2*w[n-2].",
        "Confusing Direct Form I and II memory counts.",
        "Thinking Direct Form II reduces the number of multipliers; it reduces DELAYS, but the number of multipliers remains the same (M + N + 1)."
      ],
      "diagram": "circuit",
      "diagramTitle": "Direct Form I vs Canonical Direct Form II Filter Realizations",
      "diagramCaption": "Direct Form I uses 2N delays. Direct Form II shares a central delay line, cutting delay registers to N.",
      "studyGuide": [
        "1. Write difference equations from H(z).",
        "2. Draw Direct Form I with separate input and output delay lines.",
        "3. Reverse the order of poles and zeros to construct Direct Form II.",
        "4. Verify shared central delay nodes w[n-k].",
        "5. Apply transposition rules: reverse arrows, swap branch/adder."
      ],
      "practiceQuestions": [
        {
          "question": "How many delay elements (z^-1) are required for a canonical Direct Form II realization of a 4th-order IIR filter?",
          "type": "NAT",
          "answer": "4",
          "explanation": "A canonical realization uses the minimum number of delay elements equal to the order of the system: N = 4."
        },
        {
          "question": "Transposing a digital filter block diagram according to Tellegen's theorem involves which set of operations?",
          "type": "MCQ",
          "options": [
            "Reversing all signal flow arrows, swapping pickoff nodes and adders, and interchanging input and output",
            "Inverting all multiplier coefficients",
            "Replacing all delays with differentiators",
            "Doubling the sampling rate"
          ],
          "answer": "Reversing all signal flow arrows, swapping pickoff nodes and adders, and interchanging input and output",
          "explanation": "Transposition reverses arrow directions, swaps branching points with adders, and interchanges input X and output Y without altering H(z)."
        }
      ],
      "quickRevision": "Realizations: Direct Form I needs M+N delays. Direct Form II (canonic) needs max(M, N) delays by sharing central delay line w[n]. Transposed form reverses flow arrows, keeps same H(z).",
      "relatedTopics": [
        "IIR Filter Design",
        "Z-Transform",
        "FIR Filter Design"
      ]
    }
  },
  {
    "title": "Reconstruction of Continuous Signals from Samples",
    "summary": "Ideal Whittaker-Shannon interpolation formula using sinc basis functions, zero-order hold (ZOH) DAC reconstruction, and post-filtering.",
    "orderIndex": 26,
    "lesson": {
      "intro": "The Sampling Theorem proves that a bandlimited continuous signal x(t) can be completely reconstructed from its discrete samples x[n] = x(n*Ts), provided fs > 2*B. The mathematical interpolation operator that accomplishes perfect reconstruction is the Whittaker-Shannon Sinc Interpolation Formula. In real hardware, DACs implement a staircase Zero-Order Hold (ZOH) followed by an analog reconstruction low-pass smoothing filter. This is a foundational GATE communication and DSP topic.",
      "simple": "Think of sampling like taking still snapshots of a dancer. Sinc interpolation is like a magical smooth animator: each sample creates a smooth sinc wave centered at that sample's time, and when you add all these overlapping sinc waves together, they sum up to recreate the exact, perfectly smooth continuous dance with ZERO error.",
      "why": "Used in CD player DAC audio reconstruction, software-defined radio waveform synthesis, and medical signal monitors.",
      "points": [
        "Nyquist Condition: Reversible sampling requires fs >= 2*B (or Ts <= 1 / (2*B)).",
        "Whittaker-Shannon Formula: x(t) = sum_{n=-inf}^{inf} x(n*Ts) * sinc((t - n*Ts) / Ts).",
        "Sinc Interpolation Property: sinc(0) = 1 at t = n*Ts, and sinc(m) = 0 at all other sample instants t = k*Ts (zero inter-symbol interference).",
        "Frequency Domain: Ideal reconstruction corresponds to multiplying the sampled periodic spectrum X_p(f) by an ideal brick-wall low-pass filter H(f) with bandwidth B and gain Ts.",
        "Zero-Order Hold (ZOH): Real DACs hold each sample constant for Ts, producing a staircase wave. Impulse response: h_zoh(t) = rect((t - Ts/2) / Ts).",
        "ZOH Frequency Roll-Off: H_zoh(f) = Ts * sinc(f*Ts) * e^(-j*pi*f*Ts). Introduces high-frequency droop that must be compensated with an analog post-filter."
      ],
      "formulas": [
        {
          "equation": "x(t) = \\sum_{n=-\\infty}^{\\infty} x(n T_s) \\operatorname{sinc}\\left(\\frac{t - n T_s}{T_s}\\right) = \\sum_{n=-\\infty}^{\\infty} x(n T_s) \\frac{\\sin(\\pi(t - n T_s)/T_s)}{\\pi(t - n T_s)/T_s}",
          "meaning": "Whittaker-Shannon ideal interpolation formula.",
          "conditions": "Signal bandlimited to B <= 1 / (2*Ts)."
        },
        {
          "equation": "H_{ideal}(f) = \\begin{cases} T_s & |f| \\le \\frac{f_s}{2} \\\\ 0 & |f| > \\frac{f_s}{2} \\end{cases}",
          "meaning": "Frequency response of ideal reconstruction low-pass filter.",
          "conditions": "Passband gain Ts cancels the 1/Ts factor from sampling."
        },
        {
          "equation": "|H_{ZOH}(f)| = T_s \\left| \\operatorname{sinc}(f T_s) \\right| = T_s \\left| \\frac{\\sin(\\pi f T_s)}{\\pi f T_s} \\right|",
          "meaning": "Frequency response magnitude of a practical Zero-Order Hold DAC.",
          "conditions": "Staircase reconstruction."
        }
      ],
      "example": {
        "question": "A continuous-time signal x(t) is bandlimited to B = 1 kHz and sampled at the Nyquist rate fs = 2 kHz. If sample values are x(0) = 4 and all other samples are zero, what is the continuous reconstructed signal x(t) at t = 0.25 ms?",
        "given": [
          "B = 1 kHz",
          "fs = 2 kHz -> Ts = 1/2000 = 0.5 ms = 0.5 * 10^-3 s",
          "x(0) = 4, x(n) = 0 for n != 0"
        ],
        "steps": [
          "Step 1: Write Shannon reconstruction formula: x(t) = sum x(n*Ts) * sinc((t - n*Ts)/Ts).",
          "Step 2: Since only x(0) is non-zero: x(t) = 4 * sinc(t / Ts).",
          "Step 3: At t = 0.25 ms: t / Ts = 0.25 ms / 0.5 ms = 0.5.",
          "Step 4: Compute sinc(0.5) = sin(pi * 0.5) / (pi * 0.5) = sin(pi/2) / (pi/2) = 1 / (pi/2) = 2 / pi.",
          "Step 5: x(0.25 ms) = 4 * (2 / pi) = 8 / pi = 2.546."
        ],
        "answer": "x(0.25 ms) = 8 / pi = 2.55 V."
      },
      "gate": [
        "Sinc basis functions have infinite duration in time; practical reconstruction truncates with windowing.",
        "At exact sample points t = k*Ts, only the k-th sinc term is non-zero (equals 1); all other sinc terms are exactly zero.",
        "ZOH droop at the Nyquist frequency (f = fs/2) is sinc(0.5) = 2/pi = 0.637 (-3.92 dB loss), requiring an equalizing anti-sinc filter."
      ],
      "mistakes": [
        "Using normalized sinc(x) = sin(x)/x instead of sin(pi*x)/(pi*x).",
        "Believing ZOH alone perfectly reconstructs the signal without an analog smoothing filter.",
        "Thinking ideal sinc interpolation can be implemented with finite causal analog filters."
      ],
      "diagram": "waveform",
      "diagramTitle": "Whittaker-Shannon Sinc Interpolation and ZOH Staircase Reconstruction",
      "diagramCaption": "Overlapping sinc pulses sum to recreate smooth original waveform. ZOH creates staircase wave with sinc droop.",
      "studyGuide": [
        "1. State the Whittaker-Shannon interpolation formula.",
        "2. Understand why sinc(t/Ts) is the impulse response of an ideal brick-wall LPF.",
        "3. Calculate interpolated values between sample points.",
        "4. Analyze ZOH frequency response and high-frequency sinc droop.",
        "5. Design anti-imaging analog reconstruction filters."
      ],
      "practiceQuestions": [
        {
          "question": "What is the value of sinc(0.5) = sin(pi*0.5) / (pi*0.5)?",
          "type": "MCQ",
          "options": [
            "2 / pi ~ 0.637",
            "1.0",
            "0.5",
            "0.0"
          ],
          "answer": "2 / pi ~ 0.637",
          "explanation": "sin(pi/2) / (pi/2) = 1 / (pi/2) = 2 / pi ~ 0.637."
        },
        {
          "question": "In ideal reconstruction of a signal sampled at rate fs, what is the cutoff frequency of the required low-pass filter?",
          "type": "MCQ",
          "options": [
            "fs / 2",
            "fs",
            "2 * fs",
            "fs / 4"
          ],
          "answer": "fs / 2",
          "explanation": "The filter must pass the baseband spectrum up to the Nyquist frequency fs/2 and reject all periodic spectral copies above fs/2."
        }
      ],
      "quickRevision": "Reconstruction: Ideal interpolation uses x(t) = sum x(nTs)*sinc((t-nTs)/Ts). Corresponds to brick-wall LPF with cutoff fs/2 and gain Ts. ZOH DAC produces staircase with sinc(f*Ts) droop.",
      "relatedTopics": [
        "Sampling Theorem",
        "Continuous-Time and Discrete-Time Signals",
        "DTFT and Frequency Response"
      ]
    }
  },
  {
    "title": "Bandpass Sampling Theorem and Anti-Aliasing Filters",
    "summary": "Sub-Nyquist sampling of RF signals centered at f0 with bandwidth B: valid sampling rates 2*f_H/k <= fs <= 2*f_L/(k - 1) avoiding spectral overlap.",
    "orderIndex": 27,
    "lesson": {
      "intro": "Standard Nyquist sampling requires fs >= 2*f_max. But if a signal is a high-frequency bandpass signal occupying a narrow bandwidth B between f_L and f_H (e.g. an FM radio signal at 100 MHz with 200 kHz bandwidth), sampling at twice f_max would require an absurd 200 MHz ADC! The Bandpass Sampling Theorem (Under-sampling) proves that the signal can be sampled at a rate proportional to its BANDWIDTH B (e.g. fs ~ 500 kHz) rather than its carrier frequency, provided spectral replicas do not overlap.",
      "simple": "Think of a wagon wheel in an old movie: when filmed at 24 frames per second, the fast-spinning spokes appear to rotate slowly or freeze. Bandpass sampling deliberately uses this stroboscopic aliasing to downconvert a 1 GHz RF carrier directly into audio baseband in a single ADC step, with zero analog mixers!",
      "why": "Forms the architectural core of modern Software-Defined Radios (SDR), direct-RF digital receivers, and radar IF digitization.",
      "points": [
        "Bandpass Signal: Non-zero spectrum only in f_L <= |f| <= f_H, with bandwidth B = f_H - f_L.",
        "Bandpass Sampling Rule: Minimum theoretical sampling rate is fs >= 2*B.",
        "Integer Positioning Rule: To prevent spectral replicas from colliding, sampling frequency must satisfy: (2*f_H) / k <= fs <= (2*f_L) / (k - 1), where k is an integer: 1 <= k <= floor(f_H / B).",
        "If f_H is an integer multiple of B (f_H = n*B), the minimum rate is exactly fs = 2*B.",
        "Anti-Aliasing Filter Requirement: A sharp bandpass filter (NOT a lowpass filter!) MUST precede the ADC to remove all out-of-band noise and signals that would alias into the desired band.",
        "ADC Track-and-Hold Requirement: The ADC sampling rate can be low, but the input bandwidth of its track-and-hold circuit must exceed f_H."
      ],
      "formulas": [
        {
          "equation": "\\frac{2 f_H}{k} \\le f_s \\le \\frac{2 f_L}{k - 1}, \\quad 1 \\le k \\le \\left\\lfloor \\frac{f_H}{B} \\right\\rfloor",
          "meaning": "Permissible sampling rate intervals for bandpass sampling without spectral overlap.",
          "conditions": "f_H is upper cutoff, f_L is lower cutoff, B = f_H - f_L."
        },
        {
          "equation": "f_{s, min} = 2 B \\quad (\\text{when } f_H = n B)",
          "meaning": "Absolute minimum theoretical bandpass sampling rate.",
          "conditions": "Optimal integer band positioning."
        },
        {
          "equation": "f_{IF} = |f_c - m f_s|",
          "meaning": "Direct digital downconversion alias frequency.",
          "conditions": "m is the integer harmonic closest to carrier fc."
        }
      ],
      "example": {
        "question": "An RF bandpass signal occupies the frequency range from 20 MHz to 25 MHz (bandwidth B = 5 MHz). Find the valid range of sampling frequencies fs for integer k = 4.",
        "given": [
          "f_L = 20 MHz",
          "f_H = 25 MHz",
          "B = 5 MHz",
          "k = 4"
        ],
        "steps": [
          "Step 1: Check maximum integer k_max = floor(f_H / B) = floor(25 / 5) = 5. Since k = 4 <= 5, k = 4 is valid.",
          "Step 2: Lower bound for fs: fs >= 2*f_H / k = (2 * 25) / 4 = 50 / 4 = 12.5 MHz.",
          "Step 3: Upper bound for fs: fs <= 2*f_L / (k - 1) = (2 * 20) / (4 - 1) = 40 / 3 = 13.33 MHz.",
          "Step 4: Valid sampling frequency range: 12.5 MHz <= fs <= 13.33 MHz."
        ],
        "answer": "Valid sampling rate range: 12.5 MHz <= fs <= 13.33 MHz (vastly lower than standard Nyquist rate of 50 MHz!)."
      },
      "gate": [
        "Standard lowpass Nyquist rate for this signal would be 2 * 25 = 50 MHz. Bandpass sampling achieves it at 12.5 MHz (4x lower!).",
        "Anti-aliasing filter: You MUST use a bandpass filter before the ADC. Any noise outside 20-25 MHz will alias directly on top of the desired signal.",
        "Notice that allowable fs values form distinct DISCRETE ISLANDS of frequencies, not a continuous range."
      ],
      "mistakes": [
        "Using standard 2*f_max for narrow bandpass signals, wasting massive ADC power and data throughput.",
        "Picking an arbitrary fs >= 2*B without checking the integer boundary condition; an invalid rate causes spectral collision and destroys the signal.",
        "Assuming any ADC can be used; the ADC must have an analog input bandwidth >= f_H even if its clock rate is low."
      ],
      "diagram": "waveform",
      "diagramTitle": "Bandpass Under-Sampling and Spectral Replica Placement",
      "diagramCaption": "Sampling at fs translates RF band replicas down to baseband without overlap, performing downconversion and sampling together.",
      "studyGuide": [
        "1. Calculate bandwidth B = f_H - f_L.",
        "2. Compute k_max = floor(f_H / B).",
        "3. Evaluate valid sampling intervals: 2*f_H/k <= fs <= 2*f_L/(k-1).",
        "4. Plot spectral replicas on discrete frequency axis.",
        "5. Design RF anti-aliasing bandpass filters."
      ],
      "practiceQuestions": [
        {
          "question": "A bandpass signal has bandwidth B = 10 kHz centered at carrier fc = 100 MHz. What is the absolute theoretical minimum sampling frequency required?",
          "type": "NAT",
          "answer": "20",
          "explanation": "Theoretical minimum bandpass sampling rate is 2 * B = 2 * 10 kHz = 20 kHz (in kHz)."
        },
        {
          "question": "In bandpass sampling, what type of anti-aliasing filter must precede the analog-to-digital converter?",
          "type": "MCQ",
          "options": [
            "A bandpass filter passing only the desired RF band",
            "A standard low-pass filter with cutoff at fc",
            "A high-pass filter",
            "No filter is needed"
          ],
          "answer": "A bandpass filter passing only the desired RF band",
          "explanation": "A sharp bandpass filter is required to remove out-of-band noise and interference that would otherwise alias into the digitized spectrum."
        }
      ],
      "quickRevision": "Bandpass Sampling: Samples narrow band (B = f_H - f_L) at fs << 2*f_H. Valid rates: 2*f_H/k <= fs <= 2*f_L/(k-1) for k <= floor(f_H/B). Minimum rate = 2B. Requires RF bandpass anti-aliasing filter.",
      "relatedTopics": [
        "Sampling Theorem",
        "Communication Systems",
        "DTFT and Frequency Response"
      ]
    }
  }
];
