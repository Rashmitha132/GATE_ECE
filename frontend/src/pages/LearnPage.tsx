import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  FileText,
  Video,
  Download,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  Zap,
  GraduationCap,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  expandedTopicsBySubject,
  expandedLessons,
  PracticeQuestion,
  FormulaItem,
} from '../data/learningContent';
import { getTopicQuote } from '../utils/quotes';

type LessonTab =
  | 'Concept'
  | 'Formulae'
  | 'Examples'
  | 'GATE Points'
  | 'Common Mistakes';

type DiagramKind =
  | 'diode'
  | 'pn-junction'
  | 'iv-curve'
  | 'bjt'
  | 'mosfet'
  | 'opamp'
  | 'logic'
  | 'circuit'
  | 'waveform'
  | 'control'
  | 'communication'
  | 'emft'
  | 'math'
  | 'generic';

type Lesson = {
  intro: string;
  simple: string;
  why: string;
  points: string[];
  formulas: FormulaItem[];
  example: {
    question: string;
    given: string[];
    steps: string[];
    answer: string;
  };
  gate: string[];
  mistakes: string[];
  diagram: DiagramKind;
  diagramTitle: string;
  diagramCaption: string;
  studyGuide?: string[];
  practiceQuestions?: PracticeQuestion[];
  quickRevision?: string;
  relatedTopics?: string[];
};

const baseTopicsBySubject: Record<string, string[]> = {
  'Analog Electronics': [
    'Diodes and Diode Circuits',
    'BJT Operation and Biasing',
    'MOSFET Operation and Biasing',
    'Small-Signal Amplifiers',
    'Multistage Amplifiers',
    'Feedback Amplifiers',
    'Sinusoidal Oscillators',
    'Operational Amplifiers',
    'Rectifiers and Regulators',
    'Frequency Response',
    'Active Filters',
    'Differential Amplifiers',
    'Current Mirrors',
  ],
  'Digital Electronics': [
    'Number Systems and Codes',
    'Boolean Algebra and Logic Gates',
    'Boolean Function Minimization (K-Maps)',
    'Combinational Logic',
    'Adders and Subtractors',
    'Multiplexers and Decoders',
    'Latches and Flip-Flops',
    'Sequential Circuits',
    'Counters and Registers',
    'Finite State Machines',
    'ADC and DAC',
    'Semiconductor Memories',
    'Logic Families',
  ],
  'Network Theory': [
    'Circuit Elements and Sources',
    'KCL, KVL and Circuit Laws',
    'Nodal and Mesh Analysis',
    'Thevenin and Norton Theorems',
    'Superposition and Maximum Power Transfer',
    'First-Order Transient Analysis',
    'Second-Order RLC Circuits',
    'Sinusoidal Steady-State Analysis',
    'Resonance and Quality Factor',
    'Coupled Circuits',
    'Two-Port Networks',
    'Network Functions and Poles-Zeros',
    'Passive Filters',
  ],
  'Signals & Systems': [
    'Continuous-Time and Discrete-Time Signals',
    'System Properties and LTI Systems',
    'Impulse Response and Convolution',
    'Fourier Series',
    'Fourier Transform',
    'Laplace Transform',
    'Z-Transform',
    'Sampling Theorem',
    'DTFT and Frequency Response',
    'FIR Filter Design',
    'IIR Filter Design',
    'Correlation and Random Signals',
  ],
  'Electronic Devices': [
    'Semiconductor Materials and Carrier Transport',
    'Drift and Diffusion Currents',
    'PN Junction and Depletion Region',
    'Diode I–V Characteristics',
    'BJT Structure and Operation',
    'BJT Current Gain and Configurations',
    'MOS Capacitor',
    'MOSFET Characteristics',
    'MOSFET Scaling and Short-Channel Effects',
    'Breakdown Mechanisms',
    'LEDs and Photodetectors',
    'Device Capacitances',
  ],
  'Control Systems': [
    'Mathematical Modelling and Transfer Functions',
    'Block Diagrams',
    'Signal Flow Graphs and Mason’s Gain Formula',
    'Time-Domain Response',
    'Steady-State Error',
    'Stability and Routh-Hurwitz Criterion',
    'Root Locus',
    'Bode Plots',
    'Nyquist Criterion',
    'State-Space Analysis',
    'PID Controllers',
    'Gain and Phase Margins',
  ],
  'Communication Systems': [
    'Amplitude Modulation (AM)',
    'Angle Modulation: FM and PM',
    'Modulation Spectra and Bandwidth',
    'Random Variables and Random Processes',
    'Noise and Signal-to-Noise Ratio',
    'Sampling and Quantization',
    'PCM and Delta Modulation',
    'Digital Modulation Schemes',
    'Detection and Error Probability',
    'Information Theory',
    'Source Coding',
    'Channel Coding Basics',
  ],
  EMFT: [
    'Vector Calculus',
    'Electrostatic Fields and Potential',
    'Gauss Law and Boundary Conditions',
    'Capacitance and Dielectrics',
    'Magnetostatic Fields',
    'Faraday’s Law and Induction',
    'Maxwell’s Equations',
    'Uniform Plane Waves',
    'Polarization and Power Flow',
    'Reflection and Refraction',
    'Transmission Lines and Smith Chart',
    'Waveguides',
    'Antennas and Radiation',
  ],
  'Electronics Lab': [
    'Diode I–V Characteristics Experiment',
    'Rectifier and Filter Experiment',
    'BJT Characteristics Experiment',
    'MOSFET Characteristics Experiment',
    'Op-Amp Applications Experiment',
    'Logic Gates Experiment',
    'Combinational Circuit Experiment',
    'Oscillator Experiment',
  ],
  Mathematics: [
    'Linear Algebra: Matrices and Eigenvalues',
    'Calculus: Limits and Derivatives',
    'Integration and Applications',
    'Differential Equations',
    'Vector Calculus',
    'Complex Variables',
    'Probability and Statistics',
    'Random Variables and Distributions',
    'Numerical Methods',
    'Sequences and Series',
  ],
};

export const topicsBySubject: Record<string, string[]> = Object.entries(
  baseTopicsBySubject,
).reduce(
  (acc, [subject, baseTopics]) => {
    const extra = expandedTopicsBySubject[subject] || [];
    acc[subject] = [
      ...baseTopics,
      ...extra.filter((t) => !baseTopics.includes(t)),
    ];
    return acc;
  },
  {} as Record<string, string[]>,
);

export const subjectIdToName: Record<string, string> = {
  '1': 'Mathematics',
  '2': 'Network Theory',
  '3': 'Signals & Systems',
  '4': 'Electronic Devices',
  '5': 'Analog Electronics',
  '6': 'Digital Electronics',
  '7': 'Control Systems',
  '8': 'Communication Systems',
  '9': 'EMFT',
  '10': 'Electronics Lab',
};

const makeLesson = (
  intro: string,
  simple: string,
  why: string,
  points: string[],
  formulas: { equation: string; meaning: string }[],
  question: string,
  given: string[],
  steps: string[],
  answer: string,
  gate: string[],
  mistakes: string[],
  diagram: DiagramKind,
  diagramTitle: string,
  diagramCaption: string,
): Lesson => ({
  intro,
  simple,
  why,
  points,
  formulas,
  example: { question, given, steps, answer },
  gate,
  mistakes,
  diagram,
  diagramTitle,
  diagramCaption,
});

/*
 * These are detailed, topic-specific lessons.
 * The remaining topics use the topic-aware lesson generator below.
 */
const detailedLessons: Record<string, Lesson> = {
  'Diodes and Diode Circuits': makeLesson(
    'A semiconductor diode is a two-terminal device made by joining P-type and N-type semiconductor materials. It allows current to flow easily in one direction under forward bias and strongly opposes current in the opposite direction under reverse bias, until breakdown.',
    'Think of a diode as a one-way gate for electric current. When connected in the correct direction, it opens for current. When reversed, it mostly blocks current.',
    'Diodes are used in rectifiers, clipping circuits, clamping circuits, voltage regulators, protection circuits, and signal-processing circuits.',
    [
      'The anode is the P-side; the cathode is the N-side.',
      'Forward bias means the P-side is at a higher potential than the N-side.',
      'Reverse bias means the P-side is at a lower potential than the N-side.',
      'A silicon diode is often approximated as having a 0.7 V forward drop in the constant-voltage model.',
      'The ideal model treats a forward-biased diode as a short circuit and a reverse-biased diode as an open circuit.',
      'A real diode has a nonlinear current-voltage relationship.',
      'Reverse breakdown is a different operating region and must be handled according to the circuit and device rating.',
    ],
    [
      {
        equation: 'I_D = I_S [e^(V_D/(nV_T)) − 1]',
        meaning:
          'Shockley diode equation: I_D is diode current, I_S is reverse saturation current, V_D is diode voltage, n is the ideality factor, and V_T is thermal voltage.',
      },
      {
        equation: 'V_T = kT/q ≈ 25.9 mV at 300 K',
        meaning:
          'Thermal voltage depends on absolute temperature. The 25.9 mV value is an approximation at room temperature.',
      },
      {
        equation: 'r_d ≈ nV_T/I_D',
        meaning:
          'Approximate small-signal resistance of a forward-biased diode at a chosen DC operating current.',
      },
      {
        equation: 'Half-wave rectifier: V_DC = V_m/π',
        meaning:
          'Ideal average output for a half-wave rectifier with a sinusoidal input and no filter.',
      },
    ],
    'A silicon diode is forward biased with a constant-voltage drop of 0.7 V. A 5 V supply is connected in series with a 1 kΩ resistor and the diode. Estimate the current.',
    ['Supply voltage = 5 V', 'Diode drop = 0.7 V', 'Series resistance = 1 kΩ'],
    [
      'Step 1: Assume the diode is ON because it is forward biased.',
      'Step 2: Voltage across the resistor = 5 − 0.7 = 4.3 V.',
      'Step 3: Apply Ohm’s law: I = V/R.',
      'Step 4: I = 4.3/1000 A.',
    ],
    'Diode current ≈ 4.3 mA. This answer uses the constant-voltage model.',
    [
      'First identify the diode model: ideal, constant-voltage, or exponential.',
      'Check the diode orientation before applying KCL or KVL.',
      'For piecewise-linear circuits, assume an ON/OFF state and verify it afterward.',
      'For rectifiers, identify which diode or diodes conduct during each half-cycle.',
      'Distinguish average, RMS, peak and peak-to-peak values.',
    ],
    [
      'Do not automatically use 0.7 V when the question specifies an ideal diode.',
      'Do not assume a reverse-biased diode carries normal forward current.',
      'Do not confuse peak voltage with average rectified voltage.',
      'Do not ignore the resistor that limits diode current.',
    ],
    'diode',
    'Diode symbol and current direction',
    'The bar represents the cathode. Conventional forward current flows from anode to cathode when the diode is forward biased.',
  ),

  'PN Junction and Depletion Region': makeLesson(
    'A PN junction is formed by joining P-type and N-type semiconductor material. Electrons and holes initially diffuse across the junction and recombine. This leaves fixed charged ions near the junction, creating a depletion region and an internal electric field.',
    'Imagine two groups meeting: electrons move from the N-side towards the P-side, while holes move from the P-side towards the N-side. The region near the boundary loses most of its mobile carriers.',
    'Understanding the depletion region explains diode conduction, the built-in potential, junction capacitance, and why forward and reverse bias behave differently.',
    [
      'P-type material has holes as majority carriers.',
      'N-type material has electrons as majority carriers.',
      'Diffusion is caused by a concentration gradient.',
      'The electric field in the depletion region creates drift current.',
      'At equilibrium, drift and diffusion currents balance.',
      'Forward bias generally narrows the depletion region.',
      'Reverse bias generally widens the depletion region.',
    ],
    [
      {
        equation: 'I_D = I_S (e^(V_D/(nV_T)) − 1)',
        meaning:
          'The ideal diode equation relates junction voltage to current under the model assumptions.',
      },
      {
        equation: 'V_T = kT/q',
        meaning:
          'Thermal voltage, where k is Boltzmann’s constant, T is absolute temperature, and q is electron charge.',
      },
    ],
    'Explain what happens to the depletion region when a PN junction is forward biased.',
    ['The external voltage is applied with P connected towards positive and N towards negative.'],
    [
      'The applied voltage opposes the built-in junction field.',
      'The potential barrier is reduced.',
      'The depletion region becomes narrower.',
      'Majority carriers can cross the junction more easily, increasing current.',
    ],
    'Forward bias reduces the barrier and narrows the depletion region, allowing a much larger current to flow.',
    [
      'Distinguish majority carriers from minority carriers.',
      'Know the qualitative effect of forward and reverse bias.',
      'At equilibrium, the net current is zero.',
    ],
    [
      'Do not say that the depletion region contains no charge at all; it contains fixed ions.',
      'Do not confuse diffusion current with drift current.',
    ],
    'pn-junction',
    'Inside a PN junction',
    'The depleted region contains fixed ionized dopants and an electric field; it is not simply an empty physical gap.',
  ),

  'Diode I–V Characteristics': makeLesson(
    'The I–V characteristic shows how diode current changes with the voltage across the diode. It is nonlinear: forward current rises rapidly after the junction becomes strongly conducting, while reverse current remains small until breakdown in a typical diode.',
    'The graph tells us how much current a diode carries for a given voltage. The curve is not a straight line like the ideal resistor graph.',
    'GATE questions use the I–V curve to find operating points, compare diode models, estimate resistance and identify breakdown.',
    [
      'Forward operation lies in the positive-voltage region for the usual reference convention.',
      'Reverse current is small before breakdown in a typical junction diode.',
      'The constant-voltage model simplifies analysis near normal forward operation.',
      'The slope at a bias point is related to differential conductance.',
      'Breakdown current must be limited externally.',
    ],
    [
      {
        equation: 'I_D = I_S (e^(V_D/(nV_T)) − 1)',
        meaning: 'Exponential diode current model.',
      },
      {
        equation: 'r_d ≈ nV_T/I_D',
        meaning: 'Small-signal resistance at a forward operating point.',
      },
    ],
    'At room temperature, estimate the small-signal resistance of an ideality-factor-1 diode carrying 1 mA.',
    ['n = 1', 'V_T ≈ 25.9 mV', 'I_D = 1 mA'],
    [
      'Use r_d ≈ nV_T/I_D.',
      'Convert 25.9 mV to 0.0259 V.',
      'Divide 0.0259 V by 0.001 A.',
    ],
    'r_d ≈ 25.9 Ω.',
    [
      'Read the axes and voltage/current reference directions.',
      'Distinguish static resistance V/I from differential resistance dV/dI.',
      'Check whether breakdown is included in the graph.',
    ],
    [
      'Do not treat the entire diode curve as linear.',
      'Do not confuse reverse breakdown voltage with forward voltage drop.',
    ],
    'iv-curve',
    'Typical diode I–V curve',
    'The curve is schematic and not to scale. Actual values depend on the diode, temperature and operating conditions.',
  ),

  'BJT Operation and Biasing': makeLesson(
    'A bipolar junction transistor has emitter, base and collector terminals. In forward-active operation, the base-emitter junction is forward biased and the base-collector junction is reverse biased. A small base current controls a larger collector current in the common-emitter model.',
    'A BJT can act like a controlled valve: a small input at the base controls a larger current between collector and emitter.',
    'Biasing establishes a DC operating point, also called the Q-point. A suitable Q-point allows an input signal to vary without immediately causing cutoff or saturation.',
    [
      'An NPN transistor in active mode commonly has V_BE around 0.7 V in a simple silicon model.',
      'Cutoff: the transistor is effectively OFF in the simplified model.',
      'Forward-active: useful for linear amplification.',
      'Saturation: both junctions are forward biased in the usual NPN convention.',
      'Emitter resistance can improve bias stability.',
      'Always check the calculated collector-emitter voltage against the assumed operating region.',
    ],
    [
      {
        equation: 'I_E = I_C + I_B',
        meaning: 'Kirchhoff’s current law at the transistor terminals.',
      },
      {
        equation: 'β = I_C/I_B',
        meaning: 'Common-emitter DC current gain in forward-active operation.',
      },
      {
        equation: 'α = I_C/I_E = β/(β + 1)',
        meaning: 'Relationship between common-base and common-emitter current gain in the usual model.',
      },
    ],
    'An NPN transistor has β = 100 and base current 20 μA. Estimate collector current in forward-active operation.',
    ['β = 100', 'I_B = 20 μA'],
    [
      'Use I_C ≈ βI_B.',
      'Substitute I_C = 100 × 20 μA.',
      'Calculate the result and verify the active-region assumption using the collector circuit.',
    ],
    'I_C ≈ 2 mA, provided the collector circuit allows forward-active operation.',
    [
      'Identify the transistor region before using the current-gain equations.',
      'Use a consistent reference for V_BE and V_CE.',
      'For voltage-divider bias, a Thevenin equivalent can simplify the base circuit.',
    ],
    [
      'Do not assume forward-active operation without checking V_CE.',
      'Do not confuse α with β.',
    ],
    'bjt',
    'BJT terminals and current directions',
    'The drawing is a simplified NPN transistor representation; always use the actual circuit connections in a problem.',
  ),

  'MOSFET Operation and Biasing': makeLesson(
    'A MOSFET is a voltage-controlled semiconductor device. In an enhancement NMOS transistor, a conductive channel forms when the gate-source voltage exceeds the threshold voltage. The drain current depends on the operating region and device parameters.',
    'The gate voltage controls whether a channel forms. The drain-source voltage then drives current through that channel.',
    'MOSFETs are fundamental to integrated circuits, digital logic, and analog amplifiers. GATE questions often test region conditions and current equations.',
    [
      'Cutoff in the simple enhancement model: V_GS ≤ V_T.',
      'Triode region: V_GS > V_T and V_DS < V_GS − V_T.',
      'Saturation region: V_GS > V_T and V_DS ≥ V_GS − V_T.',
      'Overdrive voltage is V_OV = V_GS − V_T.',
      'These equations use a simplified long-channel model.',
    ],
    [
      {
        equation: 'V_OV = V_GS − V_T',
        meaning: 'Gate overdrive voltage.',
      },
      {
        equation: 'I_D ≈ (1/2) μ_n C_ox (W/L) V_OV²',
        meaning: 'Ideal long-channel NMOS saturation current, ignoring channel-length modulation.',
      },
      {
        equation: 'g_m ≈ 2I_D/V_OV',
        meaning: 'Small-signal transconductance in the ideal saturation model.',
      },
    ],
    'An ideal long-channel NMOS carries 1 mA in saturation with overdrive voltage 0.4 V. Find g_m.',
    ['I_D = 1 mA', 'V_OV = 0.4 V'],
    [
      'Use g_m ≈ 2I_D/V_OV.',
      'Substitute g_m = 2 × 1 mA / 0.4 V.',
      'Evaluate in siemens.',
    ],
    'g_m ≈ 5 mS.',
    [
      'Check the region inequalities before choosing an equation.',
      'Keep the threshold-voltage sign convention consistent.',
      'Look for channel-length modulation or body effect if the question specifies them.',
    ],
    [
      'Do not use the saturation equation when the region condition is not satisfied.',
      'Do not confuse V_GS with V_DS.',
    ],
    'mosfet',
    'MOSFET terminals and channel',
    'This is a conceptual NMOS sketch. Device symbols differ, so follow the symbol and terminal labels in the question.',
  ),

  'Operational Amplifiers': makeLesson(
    'An operational amplifier is a high-gain differential amplifier. With negative feedback and linear operation, an ideal op-amp model often allows us to assume that input currents are approximately zero and the input voltages are approximately equal.',
    'The op-amp compares its two input voltages. Negative feedback helps the surrounding resistors determine the circuit gain.',
    'Op-amps are used for amplification, summing, subtraction, filtering, integration, differentiation and signal conditioning.',
    [
      'Ideal input resistance is infinite.',
      'Ideal output resistance is zero.',
      'Ideal open-loop gain is infinite.',
      'The virtual-short approximation is valid only when the circuit has suitable negative feedback and is operating linearly.',
      'Real op-amps have limited output swing and bandwidth.',
    ],
    [
      {
        equation: 'Inverting gain: A_v = −R_f/R_in',
        meaning: 'The output is inverted relative to the input.',
      },
      {
        equation: 'Non-inverting gain: A_v = 1 + R_f/R_g',
        meaning: 'The output has the same polarity as the input.',
      },
      {
        equation: 'Ideal integrator: v_o(t) = −(1/RC) ∫v_i(t)dt',
        meaning: 'Ideal inverting integrator relationship, ignoring initial-condition details.',
      },
    ],
    'An inverting op-amp has R_in = 10 kΩ, R_f = 100 kΩ and input voltage 0.2 V. Find the ideal output voltage.',
    ['R_in = 10 kΩ', 'R_f = 100 kΩ', 'v_i = 0.2 V'],
    [
      'Calculate gain: A_v = −100/10 = −10.',
      'Multiply output gain by the input: v_o = −10 × 0.2 V.',
      'Check that the output is within the available supply limits.',
    ],
    'Ideal output = −2 V, provided the op-amp does not saturate.',
    [
      'Use virtual ground carefully in inverting circuits.',
      'Check output saturation before accepting the calculated voltage.',
      'Pay attention to the resistor connected to each input.',
    ],
    [
      'A virtual short is not a physical short circuit.',
      'Do not apply ideal linear equations when the output is saturated.',
    ],
    'opamp',
    'Op-amp negative feedback',
    'The feedback resistor connects the output to the inverting input; the non-inverting input is grounded in this example.',
  ),

  'Boolean Algebra and Logic Gates': makeLesson(
    'Boolean algebra describes logic variables that take the values 0 and 1. AND, OR and NOT are basic operations. NAND and NOR are universal gates because combinations of either type can implement any Boolean function.',
    'A logic gate is like a small decision rule. It receives binary inputs and produces a binary output according to its truth table.',
    'Digital circuits use Boolean expressions to build adders, multiplexers, controllers, registers and processors.',
    [
      'AND outputs 1 only when all inputs are 1.',
      'OR outputs 1 when at least one input is 1.',
      'NOT reverses the input.',
      'NAND is the complement of AND; NOR is the complement of OR.',
      'Truth tables help verify logic expressions.',
      'K-maps help minimise Boolean expressions.',
    ],
    [
      {
        equation: 'A + 0 = A; A · 1 = A',
        meaning: 'Identity laws.',
      },
      {
        equation: 'A + A̅ = 1; A · A̅ = 0',
        meaning: 'Complement laws.',
      },
      {
        equation: '(AB)̅ = A̅ + B̅',
        meaning: 'De Morgan’s law for the complement of an AND operation.',
      },
      {
        equation: '(A + B)̅ = A̅B̅',
        meaning: 'De Morgan’s law for the complement of an OR operation.',
      },
    ],
    'Simplify the expression Y = A·1 + A·0.',
    ['A is a binary variable.', 'Use the Boolean identity laws.'],
    [
      'A·1 = A.',
      'A·0 = 0.',
      'Therefore Y = A + 0.',
      'Apply A + 0 = A.',
    ],
    'Y = A.',
    [
      'Use Boolean identities before drawing the circuit.',
      'For n binary inputs, a complete truth table has 2ⁿ rows.',
      'Check inversion bubbles when converting expressions into NAND/NOR gates.',
    ],
    [
      'Do not treat Boolean addition as ordinary arithmetic addition.',
      'Do not lose the complement bar when applying De Morgan’s laws.',
    ],
    'logic',
    'Basic digital logic',
    'The truth-table cards show the behaviour of AND, OR and NOT.',
  ),

  'Thevenin and Norton Theorems': makeLesson(
    'Thevenin’s theorem replaces a linear two-terminal network with an equivalent voltage source in series with a resistance. Norton’s theorem represents the same terminal behaviour with a current source in parallel with a resistance.',
    'Instead of solving a complicated network again for every load resistor, replace the network with a simpler equivalent circuit.',
    'These theorems make load-current, load-voltage and maximum-power questions easier.',
    [
      'Thevenin voltage is the open-circuit terminal voltage.',
      'Norton current is the short-circuit terminal current.',
      'For a linear network, the Thevenin and Norton resistances are equal.',
      'When finding resistance, deactivate independent sources but retain dependent sources.',
      'Remove the load before finding the open-circuit voltage.',
    ],
    [
      {
        equation: 'V_th = V_oc',
        meaning: 'Thevenin voltage equals open-circuit voltage.',
      },
      {
        equation: 'I_N = I_sc',
        meaning: 'Norton current equals short-circuit current.',
      },
      {
        equation: 'R_th = R_N = V_th/I_N',
        meaning: 'Equivalent resistance for a linear network when the ratio is applicable.',
      },
      {
        equation: 'For resistive DC maximum power: R_L = R_th',
        meaning: 'Condition for maximum power transfer to a purely resistive load.',
      },
    ],
    'A Thevenin equivalent has V_th = 12 V and R_th = 4 Ω. A 4 Ω load is connected. Find load current.',
    ['V_th = 12 V', 'R_th = 4 Ω', 'R_L = 4 Ω'],
    [
      'The Thevenin resistance and load resistance are in series.',
      'Total resistance = 4 + 4 = 8 Ω.',
      'Apply Ohm’s law: I_L = 12/8.',
    ],
    'Load current = 1.5 A.',
    [
      'Remove the load before calculating V_th.',
      'Keep dependent sources active when calculating equivalent resistance.',
      'Redraw the simplified equivalent circuit clearly.',
    ],
    [
      'Do not calculate open-circuit voltage with the load still connected.',
      'Do not turn off dependent sources.',
    ],
    'circuit',
    'Thevenin equivalent',
    'A complex linear network can be replaced by V_th in series with R_th as viewed from the load terminals.',
  ),

  'Fourier Transform': makeLesson(
    'The Fourier transform represents an aperiodic continuous-time signal in terms of its frequency components. It helps explain how a signal’s spectrum is changed by an LTI system.',
    'A signal can be viewed in two ways: how it changes with time, and which frequencies it contains.',
    'Fourier analysis is important for filters, bandwidth, communication systems and frequency response.',
    [
      'The Fourier transform is commonly used for aperiodic continuous-time signals.',
      'Fourier series is commonly used to represent periodic signals.',
      'Time shifting changes phase in the frequency domain.',
      'Time-domain convolution corresponds to frequency-domain multiplication.',
      'The transform convention determines where factors such as 1/(2π) appear.',
    ],
    [
      {
        equation: 'X(jω) = ∫ x(t)e^(−jωt) dt',
        meaning: 'Continuous-time Fourier transform under this convention.',
      },
      {
        equation: 'x(t) * h(t) ↔ X(jω)H(jω)',
        meaning: 'Convolution in time corresponds to multiplication in frequency.',
      },
      {
        equation: 'Y(jω) = H(jω)X(jω)',
        meaning: 'Frequency-domain input-output relationship for an LTI system.',
      },
    ],
    'An LTI system has frequency response H(jω) = 2 at a particular frequency. The input spectrum at that frequency is X(jω) = 3. Find the output spectrum there.',
    ['H(jω) = 2', 'X(jω) = 3'],
    [
      'Use Y(jω) = H(jω)X(jω).',
      'Substitute the values.',
      'Multiply 2 by 3.',
    ],
    'Y(jω) = 6 at that frequency.',
    [
      'Check whether the question uses ω in rad/s or f in Hz.',
      'Know standard transform pairs and symmetry properties.',
      'Use the transform convention specified in the question.',
    ],
    [
      'Do not confuse Fourier series with the Fourier transform.',
      'Do not omit constants from the chosen transform convention.',
    ],
    'waveform',
    'Signal and frequency view',
    'The time waveform and spectrum are two views of a signal; the sketch is illustrative.',
  ),

  'Sampling Theorem': makeLesson(
    'The sampling theorem states that a band-limited signal can be reconstructed under ideal conditions when it is sampled at a rate greater than twice its highest frequency component.',
    'Sampling means taking measurements of a continuous signal at regular time intervals. Sampling too slowly can make different frequencies appear indistinguishable.',
    'Sampling is essential in digital audio, measurement systems, digital communication and analog-to-digital conversion.',
    [
      'Sampling frequency is the number of samples per second.',
      'The sampling interval is the reciprocal of sampling frequency.',
      'Aliasing occurs when spectral replicas overlap.',
      'An anti-aliasing low-pass filter is often used before sampling.',
      'The theorem assumes the signal is band-limited and ideal reconstruction conditions.',
    ],
    [
      {
        equation: 'f_s > 2f_max',
        meaning: 'Ideal sampling condition for a band-limited signal.',
      },
      {
        equation: 'T_s = 1/f_s',
        meaning: 'Sampling interval in seconds.',
      },
    ],
    'A signal is band-limited to 4 kHz. Find its theoretical Nyquist rate.',
    ['Highest frequency = 4 kHz'],
    [
      'The Nyquist rate is twice the highest frequency.',
      'Calculate 2 × 4 kHz.',
    ],
    'Nyquist rate = 8 kHz. Practical systems may sample above this minimum.',
    [
      'Use the highest frequency component, not an unrelated frequency.',
      'Convert kHz and Hz consistently.',
      'Distinguish aliasing from quantization error.',
    ],
    [
      'Do not assume the theoretical minimum is always a robust practical choice.',
      'Do not confuse sampling rate with bit rate.',
    ],
    'waveform',
    'Sampling a continuous signal',
    'The sample markers represent regularly spaced measurements of a continuous waveform.',
  ),

  'Bode Plots': makeLesson(
    'A Bode plot shows a system’s magnitude and phase response against logarithmic frequency. It is widely used to study filters, amplifiers and feedback-system stability.',
    'The magnitude plot tells us how much the signal is amplified or reduced at each frequency. The phase plot tells us how much its phase is shifted.',
    'Bode plots are useful for estimating bandwidth, corner frequencies, gain margin and phase margin.',
    [
      'Voltage-gain magnitude is usually expressed in decibels using 20 log10 of the magnitude.',
      'A first-order pole contributes a −20 dB/decade asymptotic slope after its corner frequency.',
      'A first-order zero contributes a +20 dB/decade asymptotic slope.',
      'Gain crossover occurs where the magnitude is 0 dB.',
      'Phase margin is measured at gain crossover.',
    ],
    [
      {
        equation: 'Magnitude (dB) = 20 log10 |G(jω)|',
        meaning: 'Voltage or amplitude gain in decibels.',
      },
      {
        equation: 'ω_c = 1/τ',
        meaning: 'Corner angular frequency for a first-order factor 1/(1 + jωτ).',
      },
      {
        equation: 'PM = 180° + ∠G(jω_gc)H(jω_gc)',
        meaning: 'Phase margin for the usual negative-feedback convention at gain crossover.',
      },
    ],
    'A system has a voltage-gain magnitude of 10. Find the magnitude in decibels.',
    ['|G| = 10'],
    [
      'Use 20 log10 |G|.',
      'Substitute 10.',
      'Since log10(10) = 1, the result is 20 dB.',
    ],
    'Magnitude = 20 dB.',
    [
      'Count poles and zeros to predict asymptotic slopes.',
      'Read gain and phase crossover frequencies carefully.',
      'Keep rad/s and Hz consistent.',
    ],
    [
      'Do not use 10 log10 for voltage gain; that form is for power ratios.',
      'Do not confuse gain margin with phase margin.',
    ],
    'control',
    'Frequency response',
    'The diagram illustrates a typical frequency-response shape, not a plot for a particular transfer function.',
  ),

  'Amplitude Modulation (AM)': makeLesson(
    'In conventional amplitude modulation, the carrier amplitude varies with the message signal while the carrier frequency remains fixed. A single-tone AM signal contains a carrier and two sidebands.',
    'A fast carrier wave gets a changing envelope. The envelope carries the information from the slower message signal.',
    'AM concepts are used to calculate bandwidth, modulation index, sideband power and transmitted power.',
    [
      'The modulation index describes the depth of modulation.',
      'For an undistorted conventional AM envelope, the usual single-tone condition is m ≤ 1.',
      'Sidebands occur at carrier frequency plus and minus the message frequency.',
      'The bandwidth of conventional AM is twice the highest message frequency.',
    ],
    [
      {
        equation: 's(t) = A_c[1 + m cos(ω_m t)]cos(ω_c t)',
        meaning: 'Conventional single-tone AM signal.',
      },
      {
        equation: 'B_AM = 2f_m(max)',
        meaning: 'AM bandwidth when the highest message frequency is f_m(max).',
      },
      {
        equation: 'η = m²/(2 + m²)',
        meaning: 'Efficiency for single-tone conventional AM under the usual power assumptions.',
      },
    ],
    'The highest message frequency is 4 kHz. Find the bandwidth of conventional AM.',
    ['f_m(max) = 4 kHz'],
    [
      'Use B_AM = 2f_m(max).',
      'Substitute 4 kHz.',
      'Multiply by 2.',
    ],
    'AM bandwidth = 8 kHz.',
    [
      'Separate carrier frequency from message bandwidth.',
      'Know where the upper and lower sidebands appear.',
      'Check whether the problem assumes conventional AM or another modulation scheme.',
    ],
    [
      'Do not use the FM bandwidth approximation for AM.',
      'Do not confuse modulation index with carrier frequency.',
    ],
    'communication',
    'AM signal and sidebands',
    'The envelope follows the message signal; the frequency-domain view shows the carrier and sidebands.',
  ),

  'Maxwell’s Equations': makeLesson(
    'Maxwell’s equations describe how electric and magnetic fields are related to charge, current, and changing fields. They unify electrostatics, magnetostatics, induction and electromagnetic-wave propagation.',
    'Electric and magnetic fields are connected. A changing magnetic field can induce an electric field, and a changing electric field contributes to the magnetic field.',
    'These equations form the basis for electromagnetic waves, transmission lines, waveguides and antennas.',
    [
      'Gauss’s law relates electric flux to charge density.',
      'The divergence of magnetic flux density is zero in classical electromagnetics.',
      'Faraday’s law describes electromagnetic induction.',
      'The Ampère–Maxwell law includes displacement current.',
      'Material relations such as D = εE and B = μH apply under the stated medium assumptions.',
    ],
    [
      {
        equation: '∇ · D = ρ_v',
        meaning: 'Electric Gauss law in differential form.',
      },
      {
        equation: '∇ · B = 0',
        meaning: 'Gauss law for magnetism.',
      },
      {
        equation: '∇ × E = −∂B/∂t',
        meaning: 'Faraday’s law in differential form.',
      },
      {
        equation: '∇ × H = J + ∂D/∂t',
        meaning: 'Ampère–Maxwell law in differential form.',
      },
    ],
    'In a region with zero volume charge density, what does electric Gauss law become?',
    ['ρ_v = 0'],
    [
      'Start with ∇ · D = ρ_v.',
      'Substitute ρ_v = 0.',
    ],
    '∇ · D = 0 in that charge-free region.',
    [
      'Know the physical meaning of each equation.',
      'Distinguish E from D and B from H.',
      'Check whether a question asks for integral or differential form.',
    ],
    [
      'Do not omit displacement current in time-varying fields.',
      'Do not confuse magnetic flux density B with magnetic field intensity H.',
    ],
    'emft',
    'Electromagnetic field relationship',
    'The arrows illustrate changing electric and magnetic fields; the exact field geometry depends on the wave and medium.',
  ),

  'Linear Algebra: Matrices and Eigenvalues': makeLesson(
    'Linear algebra studies vectors, matrices, linear equations, determinants, rank, eigenvalues and eigenvectors. These tools appear in engineering mathematics, control systems and signal processing.',
    'A matrix is a rectangular arrangement of numbers. Matrix operations help solve several related equations together.',
    'GATE questions often test matrix rank, determinant, inverse, linear-system solutions and eigenvalues.',
    [
      'A square matrix has the same number of rows and columns.',
      'A nonzero determinant indicates that a square matrix is invertible.',
      'Rank measures the number of linearly independent rows or columns.',
      'Eigenvalues satisfy the characteristic equation.',
      'A homogeneous system always has the trivial solution.',
    ],
    [
      {
        equation: 'Ax = b',
        meaning: 'Matrix form of a linear system.',
      },
      {
        equation: 'det(A − λI) = 0',
        meaning: 'Characteristic equation used to find eigenvalues.',
      },
      {
        equation: 'det([[a,b],[c,d]]) = ad − bc',
        meaning: 'Determinant of a 2 × 2 matrix.',
      },
    ],
    'Find the eigenvalues of the diagonal matrix A = [[2, 0], [0, 3]].',
    ['A is a 2 × 2 diagonal matrix.'],
    [
      'For a diagonal matrix, the eigenvalues are its diagonal entries.',
      'The diagonal entries are 2 and 3.',
    ],
    'Eigenvalues: λ₁ = 2 and λ₂ = 3.',
    [
      'Use det(A − λI) = 0 for a general matrix.',
      'Check matrix dimensions before multiplication.',
      'Do not confuse determinant with rank.',
    ],
    [
      'Do not assume every matrix is invertible.',
      'Do not confuse eigenvalues with the entries of an arbitrary matrix.',
    ],
    'math',
    'Matrix and eigenvalues',
    'A matrix maps an input vector to an output vector; eigenvectors keep their direction under the transformation.',
  ),
};

/*
 * A topic-aware lesson generator gives the remaining subjects a relevant
 * explanation, formula, example, and diagram rather than empty tabs.
 */
const subjectIntro: Record<string, string> = {
  'Analog Electronics':
    'Analog electronics studies circuits that process continuously varying signals using diodes, transistors, amplifiers and feedback.',
  'Digital Electronics':
    'Digital electronics represents information using binary values and implements logic using gates, combinational circuits and sequential circuits.',
  'Network Theory':
    'Network theory uses circuit laws, element relationships and network theorems to determine voltages and currents.',
  'Signals & Systems':
    'Signals and systems studies how systems transform signals in the time domain and frequency domain.',
  'Electronic Devices':
    'Electronic devices explains carrier transport and the physical behaviour of semiconductor junctions and transistors.',
  'Control Systems':
    'Control systems studies dynamic systems, feedback, time response, stability and frequency response.',
  'Communication Systems':
    'Communication systems transfers information using modulation, sampling, coding and detection in the presence of noise.',
  EMFT:
    'Electromagnetic fields and waves studies electric fields, magnetic fields, wave propagation and electromagnetic devices.',
  'Electronics Lab':
    'Electronics Lab connects theory to practical measurements. Record circuit connections, instrument settings, observations and conclusions.',
  Mathematics:
    'Engineering mathematics provides the mathematical tools used throughout electronics and communication engineering.',
};

function getDiagramKind(subject: string, topic: string): DiagramKind {
  const t = topic.toLowerCase();

  if (t.includes('diode') || t.includes('rectifier')) {
    return t.includes('characteristic') ? 'iv-curve' : 'diode';
  }
  if (t.includes('pn junction') || t.includes('depletion')) return 'pn-junction';
  if (t.includes('bjt') || t.includes('transistor') || t.includes('current gain')) {
    return 'bjt';
  }
  if (t.includes('mosfet') || t.includes('mos capacitor')) return 'mosfet';
  if (t.includes('op-amp') || t.includes('operational amplifier')) return 'opamp';
  if (
    t.includes('logic') ||
    t.includes('boolean') ||
    t.includes('adder') ||
    t.includes('flip-flop') ||
    t.includes('counter') ||
    t.includes('multiplexer') ||
    t.includes('decoder') ||
    t.includes('memory')
  ) {
    return 'logic';
  }
  if (
    subject === 'Network Theory' ||
    t.includes('circuit') ||
    t.includes('thevenin') ||
    t.includes('mesh') ||
    t.includes('nodal') ||
    t.includes('resonance')
  ) {
    return 'circuit';
  }
  if (
    subject === 'Signals & Systems' ||
    t.includes('fourier') ||
    t.includes('sampling') ||
    t.includes('signal') ||
    t.includes('transform')
  ) {
    return 'waveform';
  }
  if (subject === 'Control Systems' || t.includes('stability') || t.includes('bode')) {
    return 'control';
  }
  if (subject === 'Communication Systems' || t.includes('modulation')) {
    return 'communication';
  }
  if (subject === 'EMFT' || t.includes('wave') || t.includes('antenna')) {
    return 'emft';
  }
  if (subject === 'Mathematics' || t.includes('matrix') || t.includes('calculus')) {
    return 'math';
  }
  return 'generic';
}

function buildLesson(subject: string, topic: string): Lesson {
  if (expandedLessons[topic]) return expandedLessons[topic];
  if (detailedLessons[topic]) return detailedLessons[topic];

  const diagram = getDiagramKind(subject, topic);

  const topicSpecific: Record<string, {
    simple: string;
    formula: string;
    meaning: string;
    question: string;
    given: string[];
    steps: string[];
    answer: string;
  }> = {
    'KCL, KVL and Circuit Laws': {
      simple: 'KCL says current entering a node equals current leaving it. KVL says the signed voltage changes around a closed loop add to zero.',
      formula: 'ΣI = 0; ΣV = 0',
      meaning: 'Kirchhoff’s current law follows charge conservation; Kirchhoff’s voltage law follows energy conservation around a loop.',
      question: 'A node has 5 A entering and two currents leaving. One leaving current is 2 A. Find the other leaving current.',
      given: ['Entering current = 5 A', 'Known leaving current = 2 A'],
      steps: ['Use current entering = current leaving.', 'Write 5 = 2 + I.', 'Rearrange to find I.'],
      answer: 'The other leaving current is 3 A.',
    },
    'Nodal and Mesh Analysis': {
      simple: 'Nodal analysis finds unknown node voltages. Mesh analysis finds currents circulating around independent loops.',
      formula: 'Ohm’s law: I = (V₁ − V₂)/R',
      meaning: 'The current through a resistor is the voltage difference divided by its resistance.',
      question: 'A 2 kΩ resistor connects a 10 V node to ground. Find the current to ground.',
      given: ['Node voltage = 10 V', 'Resistance = 2 kΩ'],
      steps: ['The voltage across the resistor is 10 V.', 'Apply I = V/R.', 'Convert 2 kΩ to 2000 Ω.'],
      answer: 'Current = 10/2000 = 5 mA.',
    },
    'First-Order Transient Analysis': {
      simple: 'A first-order circuit usually contains one independent energy-storage element. After a switching event, its voltage or current moves exponentially towards a final value.',
      formula: 'x(t) = x(∞) + [x(0⁺) − x(∞)]e^(−t/τ)',
      meaning: 'x(0⁺) is the value immediately after switching, x(∞) is the final value and τ is the time constant.',
      question: 'An RC circuit has R = 2 kΩ and C = 10 μF. Find its time constant.',
      given: ['R = 2000 Ω', 'C = 10 × 10⁻⁶ F'],
      steps: ['Use τ = RC.', 'Multiply 2000 by 10 × 10⁻⁶.', 'Express the result in seconds.'],
      answer: 'τ = 0.02 s = 20 ms.',
    },
    'Fourier Series': {
      simple: 'A periodic signal can be represented as a sum of a DC term and sinusoidal harmonics at integer multiples of its fundamental frequency.',
      formula: 'x(t) = a₀/2 + Σ[aₙ cos(nω₀t) + bₙ sin(nω₀t)]',
      meaning: 'The coefficients describe the DC component and the strength of each cosine and sine harmonic.',
      question: 'A periodic signal has fundamental frequency 100 Hz. What is its third harmonic frequency?',
      given: ['Fundamental frequency = 100 Hz', 'Harmonic number = 3'],
      steps: ['Harmonic frequency = n × fundamental frequency.', 'Multiply 3 by 100 Hz.'],
      answer: 'Third harmonic = 300 Hz.',
    },
    'Laplace Transform': {
      simple: 'The Laplace transform converts a time-domain function into a function of complex variable s. It can simplify differential equations and circuit transient analysis.',
      formula: 'F(s) = ∫₀∞ f(t)e^(−st)dt',
      meaning: 'This is the one-sided Laplace transform for the usual causal-signal convention.',
      question: 'Find the Laplace transform of the unit step u(t).',
      given: ['f(t) = 1 for t ≥ 0'],
      steps: ['Use the definition F(s) = ∫₀∞ e^(−st)dt.', 'Integrate for the region where the integral converges.'],
      answer: 'F(s) = 1/s for Re(s) > 0.',
    },
    'Z-Transform': {
      simple: 'The Z-transform is a tool for discrete-time signals. It represents a sequence as a function of the complex variable z.',
      formula: 'X(z) = Σ x[n]z^(−n)',
      meaning: 'The sum is taken over the sequence’s index range; the region of convergence matters.',
      question: 'What is the Z-transform of δ[n], the unit impulse at n = 0?',
      given: ['δ[0] = 1', 'δ[n] = 0 for n ≠ 0'],
      steps: ['Substitute the impulse into the summation.', 'Only the n = 0 term remains.'],
      answer: 'X(z) = 1.',
    },
    'Stability and Routh-Hurwitz Criterion': {
      simple: 'A continuous-time linear system is stable when its natural response decays. The Routh-Hurwitz criterion examines the characteristic polynomial without explicitly calculating every root.',
      formula: 'Characteristic equation: aₙsⁿ + … + a₁s + a₀ = 0',
      meaning: 'The coefficients and Routh array help determine the number of roots in the right half-plane under the criterion’s conditions.',
      question: 'For a first-order system with characteristic equation s + 4 = 0, find the pole.',
      given: ['Characteristic equation: s + 4 = 0'],
      steps: ['Set the characteristic equation equal to zero.', 'Solve for s.'],
      answer: 'Pole s = −4, which lies in the left half-plane.',
    },
    'Sampling Theorem': {
      simple: 'Sampling records the value of a continuous signal at regular time intervals. The sampling frequency must be high enough to avoid aliasing under the ideal theorem.',
      formula: 'fₛ > 2f_max; Tₛ = 1/fₛ',
      meaning: 'fₛ is sampling frequency, f_max is the highest signal frequency and Tₛ is the sampling interval.',
      question: 'A signal is band-limited to 3 kHz. What is its theoretical Nyquist rate?',
      given: ['f_max = 3 kHz'],
      steps: ['Calculate twice the highest frequency.', '2 × 3 kHz = 6 kHz.'],
      answer: 'Theoretical Nyquist rate = 6 kHz.',
    },
    'Mathematical Modelling and Transfer Functions': {
      simple: 'A transfer function describes the relationship between the output and input of a linear time-invariant system under zero initial conditions.',
      formula: 'G(s) = Y(s)/X(s)',
      meaning: 'Y(s) and X(s) are the output and input transforms under the transfer-function assumptions.',
      question: 'A system has Y(s) = 6X(s). Find its transfer function.',
      given: ['Y(s) = 6X(s)'],
      steps: ['Use G(s) = Y(s)/X(s).', 'Substitute Y(s) = 6X(s).', 'Cancel X(s), where the ratio is defined.'],
      answer: 'G(s) = 6.',
    },
    'PID Controllers': {
      simple: 'A PID controller combines proportional, integral and derivative actions. These respond to present error, accumulated error and rate of change of error.',
      formula: 'u(t) = Kp e(t) + Ki∫e(t)dt + Kd de(t)/dt',
      meaning: 'Kp, Ki and Kd are controller gains; e(t) is the control error.',
      question: 'Which PID action responds to the accumulated past error?',
      given: ['P = proportional', 'I = integral', 'D = derivative'],
      steps: ['Proportional action uses the present error.', 'Integral action accumulates error over time.', 'Derivative action responds to error change.'],
      answer: 'Integral action.',
    },
    'Transmission Lines and Smith Chart': {
      simple: 'Transmission-line theory becomes important when the line length is significant compared with the wavelength. Impedance mismatch causes reflected waves.',
      formula: 'Γ = (ZL − Z₀)/(ZL + Z₀)',
      meaning: 'Γ is the voltage reflection coefficient, ZL is load impedance and Z₀ is characteristic impedance.',
      question: 'A 50 Ω line is terminated with a 50 Ω load. Find the reflection coefficient.',
      given: ['ZL = 50 Ω', 'Z₀ = 50 Ω'],
      steps: ['Substitute into the reflection coefficient formula.', 'The numerator is 50 − 50 = 0.'],
      answer: 'Γ = 0: the line is matched.',
    },
    'Maxwell’s Equations': {
      simple: 'Maxwell’s equations describe the relationship between electric and magnetic fields, charges, currents and time-varying fields.',
      formula: '∇ × H = J + ∂D/∂t',
      meaning: 'The Ampère–Maxwell law includes conduction current density J and displacement-current density ∂D/∂t.',
      question: 'What term was added to Ampère’s law to account for time-varying electric fields?',
      given: ['A time-varying electric displacement field D'],
      steps: ['Identify the Ampère–Maxwell law.', 'Look for the time derivative of D.'],
      answer: 'The displacement-current density term ∂D/∂t.',
    },
  };

  const special = topicSpecific[topic];

  const formulasBySubject: Record<string, string[]> = {
    'Analog Electronics': [
      'Voltage gain: A_v = v_o/v_i',
      'Power gain in dB = 10 log₁₀(P_out/P_in)',
    ],
    'Digital Electronics': [
      'n binary inputs give 2ⁿ possible input combinations.',
      'A complete truth table contains one row per input combination.',
    ],
    'Network Theory': [
      'KCL: algebraic sum of currents at a node = 0.',
      'KVL: algebraic sum of voltages around a loop = 0.',
      'Ohm’s law: V = IR.',
    ],
    'Signals & Systems': [
      'LTI output: y(t) = x(t) * h(t).',
      'Frequency response: Y(jω) = H(jω)X(jω).',
    ],
    'Electronic Devices': [
      'Drift current density: Jₙ = q n μₙ E under the usual low-field model.',
      'Diffusion current depends on the carrier concentration gradient.',
    ],
    'Control Systems': [
      'Negative-feedback transfer function: T(s) = G(s)/(1 + G(s)H(s)).',
      'Characteristic equation: 1 + G(s)H(s) = 0.',
    ],
    'Communication Systems': [
      'SNR = signal power / noise power.',
      'Conventional AM bandwidth = 2 × highest message frequency.',
    ],
    EMFT: [
      'D = εE for a linear isotropic medium.',
      'B = μH for a linear isotropic medium.',
    ],
    'Electronics Lab': [
      'Percentage error = |measured − theoretical| / |theoretical| × 100%.',
      'Record units and instrument settings with every measurement.',
    ],
    Mathematics: [
      'For a square matrix, det(A) ≠ 0 implies A is invertible.',
      'Eigenvalues satisfy det(A − λI) = 0.',
    ],
  };

  const example = special
    ? {
        question: special.question,
        given: special.given,
        steps: special.steps,
        answer: special.answer,
      }
    : {
        question: `How would you begin a GATE EC problem involving ${topic}?`,
        given: [
          `Topic: ${topic}`,
          'The numerical values and conditions are provided in the question.',
        ],
        steps: [
          `Step 1: Identify the model and assumptions relevant to ${topic.toLowerCase()}.`,
          'Step 2: Draw the circuit, signal, block diagram or physical model.',
          'Step 3: Write the governing equation before substituting values.',
          'Step 4: Check units, signs and the conditions under which the equation applies.',
        ],
        answer:
          'The numerical answer depends on the values and conditions in the actual question. Use this as a solving method, not as a fabricated numerical result.',
      };

  return {
    intro: `${topic} is part of ${subject}. ${subjectIntro[subject] ?? 'Study the physical or mathematical model, then apply the appropriate governing equations.'}`,
    simple:
      special?.simple ??
      `Start with the meaning of ${topic.toLowerCase()}. Identify the inputs, outputs, assumptions and governing relationships. Draw the model first, then work through one example step by step.`,
    why: `This topic helps you understand ${topic.toLowerCase()} in practical electronics and solve conceptual and numerical GATE EC questions.`,
    points: [
      `Understand the definition and physical meaning of ${topic.toLowerCase()}.`,
      'Draw the relevant circuit, waveform, logic diagram, block diagram or field representation.',
      'Identify the assumptions and operating conditions before choosing an equation.',
      'Keep units, signs, reference directions and initial conditions consistent.',
      'Check the final result against the physical meaning of the problem.',
    ],
    formulas: [
      {
        equation: special?.formula ?? (formulasBySubject[subject] ?? ['Write the governing equation before substituting values.'])[0],
        meaning:
          special?.meaning ??
          `Use this relationship only when its assumptions match the ${topic.toLowerCase()} problem.`,
      },
      ...(
        special
          ? []
          : (formulasBySubject[subject] ?? ['Check units and assumptions at every step.'])
              .slice(1)
              .map((equation) => ({
                equation,
                meaning: 'Review the definition and conditions before applying this relationship.',
              }))
      ),
    ],
    example,
    gate: [
      `Know the standard definitions and assumptions for ${topic.toLowerCase()}.`,
      'Practise both conceptual multiple-choice questions and numerical-answer questions.',
      'Draw a labelled diagram before doing lengthy calculations.',
      'Use dimensional analysis and limiting cases to check your answer.',
    ],
    mistakes: [
      'Applying a formula without checking its assumptions.',
      'Mixing units, signs, reference directions or transform conventions.',
      'Skipping the diagram or equivalent model when it would simplify the problem.',
      'Treating an illustrative diagram as a scale drawing.',
    ],
    diagram,
    diagramTitle: `${topic}: visual guide`,
    diagramCaption:
      'This is a learning sketch to help explain the idea. Use the exact circuit, values and conditions given in a GATE question.',
  };
}

/* ------------------------- VISUAL DIAGRAMS ------------------------- */

const DiagramFrame: React.FC<{
  title: string;
  caption: string;
  children: React.ReactNode;
}> = ({ title, caption, children }) => (
  <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">
    <div className="flex items-center gap-2 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-rose-50 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
        <Zap className="h-4 w-4" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-[10px] text-slate-500">Visual concept map</p>
      </div>
    </div>
    <div className="bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/40 p-3 sm:p-5">
      {children}
    </div>
    <p className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
      {caption}
    </p>
  </section>
);

const ConceptDiagram: React.FC<{
  kind: DiagramKind;
  title: string;
  caption: string;
}> = ({ kind, title, caption }) => {
  if (kind === 'diode') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-800">
              FORWARD BIAS
            </span>
            <svg viewBox="0 0 300 110" className="mt-2 w-full" role="img" aria-label="Forward biased diode">
              <line x1="25" y1="55" x2="105" y2="55" stroke="#0f766e" strokeWidth="4" />
              <polygon points="105,32 105,78 150,55" fill="#34d399" stroke="#047857" strokeWidth="2" />
              <line x1="155" y1="29" x2="155" y2="81" stroke="#047857" strokeWidth="5" />
              <line x1="155" y1="55" x2="270" y2="55" stroke="#0f766e" strokeWidth="4" />
              <text x="50" y="35" fontSize="12" fill="#047857" fontWeight="bold">A (+)</text>
              <text x="180" y="35" fontSize="12" fill="#047857" fontWeight="bold">K (−)</text>
              <path d="M70 92 L225 92" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M215 85 L225 92 L215 99" fill="none" stroke="#059669" strokeWidth="2.5" />
              <text x="122" y="106" fontSize="11" textAnchor="middle" fill="#047857">Conventional current</text>
            </svg>
            <p className="text-xs leading-5 text-emerald-900">
              P-side/anode is more positive. The barrier is reduced and the diode conducts.
            </p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <span className="inline-flex rounded-full bg-rose-100 px-2 py-1 text-[10px] font-bold text-rose-800">
              REVERSE BIAS
            </span>
            <svg viewBox="0 0 300 110" className="mt-2 w-full" role="img" aria-label="Reverse biased diode">
              <line x1="25" y1="55" x2="105" y2="55" stroke="#be123c" strokeWidth="4" />
              <polygon points="105,32 105,78 150,55" fill="#fda4af" stroke="#be123c" strokeWidth="2" />
              <line x1="155" y1="29" x2="155" y2="81" stroke="#be123c" strokeWidth="5" />
              <line x1="155" y1="55" x2="270" y2="55" stroke="#be123c" strokeWidth="4" />
              <text x="45" y="35" fontSize="12" fill="#9f1239" fontWeight="bold">A (−)</text>
              <text x="180" y="35" fontSize="12" fill="#9f1239" fontWeight="bold">K (+)</text>
              <path d="M100 92 L200 92" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 5" />
              <text x="150" y="106" fontSize="11" textAnchor="middle" fill="#9f1239">Current strongly opposed</text>
            </svg>
            <p className="text-xs leading-5 text-rose-900">
              P-side/anode is more negative. The depletion region widens and current is very small before breakdown.
            </p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          <strong>Remember:</strong> A = anode, K = cathode. Always check polarity and the diode model stated in the question.
        </div>
      </DiagramFrame>
    );
  }

  if (kind === 'pn-junction') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <svg viewBox="0 0 340 170" className="w-full" role="img" aria-label="PN junction depletion region diagram">
          <rect x="12" y="22" width="122" height="95" rx="10" fill="#dbeafe" stroke="#60a5fa" />
          <rect x="134" y="22" width="72" height="95" fill="#fef3c7" stroke="#f59e0b" />
          <rect x="206" y="22" width="122" height="95" rx="10" fill="#fce7f3" stroke="#f472b6" />
          <text x="73" y="42" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1d4ed8">P-type</text>
          <text x="267" y="42" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#9d174d">N-type</text>
          <text x="170" y="14" textAnchor="middle" fontSize="10" fill="#92400e">Depletion region</text>
          {[
            [33, 62, '−'], [64, 88, '−'], [99, 64, '−'],
            [151, 64, '+'], [187, 87, '+'], [151, 94, '+'],
            [229, 65, '+'], [266, 88, '+'], [304, 65, '+'],
          ].map(([x, y, label], i) => (
            <text key={i} x={Number(x)} y={Number(y)} textAnchor="middle" fontSize="19" fontWeight="bold" fill={label === '+' ? '#be123c' : '#2563eb'}>{label}</text>
          ))}
          <path d="M115 135 L222 135" stroke="#7c3aed" strokeWidth="2.5" />
          <path d="M212 128 L222 135 L212 142" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
          <text x="170" y="157" textAnchor="middle" fontSize="11" fill="#6d28d9">Built-in electric field (schematic)</text>
        </svg>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900"><strong>P region</strong><br />Holes are majority carriers.</div>
          <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900"><strong>Depletion region</strong><br />Mobile carriers are depleted; fixed ions remain.</div>
          <div className="rounded-lg bg-pink-50 p-3 text-xs text-pink-900"><strong>N region</strong><br />Electrons are majority carriers.</div>
        </div>
      </DiagramFrame>
    );
  }

  if (kind === 'iv-curve') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <svg viewBox="0 0 340 220" className="w-full" role="img" aria-label="Schematic diode current voltage curve">
          <line x1="36" y1="110" x2="322" y2="110" stroke="#475569" strokeWidth="1.5" />
          <line x1="155" y1="198" x2="155" y2="16" stroke="#475569" strokeWidth="1.5" />
          <path d="M322 110 L313 105 M322 110 L313 115" stroke="#475569" strokeWidth="1.5" fill="none" />
          <path d="M155 16 L150 25 M155 16 L160 25" stroke="#475569" strokeWidth="1.5" fill="none" />
          <text x="320" y="130" fontSize="10" textAnchor="end" fill="#475569">V_D</text>
          <text x="166" y="20" fontSize="10" fill="#475569">I_D</text>
          <path d="M45 112 C100 111 130 111 153 111" fill="none" stroke="#2563eb" strokeWidth="3" />
          <path d="M155 111 C180 110 194 105 205 91 C218 72 220 45 225 25" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M155 110 C132 112 95 114 45 118" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="208" y1="110" x2="208" y2="91" stroke="#059669" strokeDasharray="3 3" />
          <text x="218" y="104" fontSize="10" fill="#047857">Forward</text>
          <text x="45" y="140" fontSize="10" fill="#be123c">Reverse region</text>
          <text x="190" y="190" fontSize="10" fill="#475569">Schematic, not to scale</text>
        </svg>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900"><strong>Near zero</strong><br />Small current in the simple model.</div>
          <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900"><strong>Forward bias</strong><br />Current increases rapidly.</div>
          <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-900"><strong>Reverse bias</strong><br />Small current before breakdown.</div>
        </div>
      </DiagramFrame>
    );
  }

  if (kind === 'bjt') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <svg viewBox="0 0 340 180" className="w-full" role="img" aria-label="Simplified NPN BJT terminals">
          <circle cx="170" cy="88" r="42" fill="#eff6ff" stroke="#60a5fa" strokeWidth="2" />
          <line x1="130" y1="88" x2="160" y2="88" stroke="#2563eb" strokeWidth="5" />
          <line x1="160" y1="58" x2="160" y2="118" stroke="#2563eb" strokeWidth="5" />
          <line x1="160" y1="70" x2="205" y2="42" stroke="#2563eb" strokeWidth="5" />
          <line x1="205" y1="42" x2="246" y2="20" stroke="#2563eb" strokeWidth="4" />
          <line x1="160" y1="106" x2="202" y2="135" stroke="#2563eb" strokeWidth="5" />
          <line x1="202" y1="135" x2="246" y2="160" stroke="#2563eb" strokeWidth="4" />
          <path d="M191 121 L202 135 L185 135" fill="none" stroke="#2563eb" strokeWidth="3" />
          <text x="105" y="81" fontSize="12" fontWeight="bold" fill="#1d4ed8">Base</text>
          <text x="246" y="18" fontSize="12" fontWeight="bold" fill="#1d4ed8">Collector</text>
          <text x="246" y="174" fontSize="12" fontWeight="bold" fill="#1d4ed8">Emitter</text>
          <text x="170" y="92" textAnchor="middle" fontSize="10" fill="#1e40af">NPN</text>
        </svg>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900"><strong>Cutoff</strong><br />Simplified OFF state.</div>
          <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900"><strong>Forward-active</strong><br />Common amplifier region.</div>
          <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900"><strong>Saturation</strong><br />Both junctions forward biased in the usual model.</div>
        </div>
      </DiagramFrame>
    );
  }

  if (kind === 'mosfet') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <svg viewBox="0 0 340 165" className="w-full" role="img" aria-label="Simplified NMOS channel">
          <rect x="105" y="42" width="130" height="95" rx="10" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
          <rect x="135" y="55" width="70" height="70" rx="4" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
          <rect x="140" y="16" width="60" height="22" rx="4" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2" />
          <text x="170" y="31" textAnchor="middle" fontSize="11" fill="#3730a3" fontWeight="bold">Gate</text>
          <line x1="170" y1="38" x2="170" y2="52" stroke="#6366f1" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="115" y1="85" x2="135" y2="85" stroke="#15803d" strokeWidth="4" />
          <line x1="205" y1="85" x2="225" y2="85" stroke="#15803d" strokeWidth="4" />
          <line x1="115" y1="85" x2="75" y2="85" stroke="#15803d" strokeWidth="3" />
          <line x1="225" y1="85" x2="265" y2="85" stroke="#15803d" strokeWidth="3" />
          <text x="55" y="80" fontSize="11" fill="#166534">Source</text>
          <text x="267" y="80" fontSize="11" fill="#166534">Drain</text>
          <text x="170" y="94" textAnchor="middle" fontSize="11" fill="#166534" fontWeight="bold">Channel</text>
          <text x="170" y="154" textAnchor="middle" fontSize="11" fill="#166534">Simplified enhancement NMOS</text>
        </svg>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-100 p-3 text-xs text-slate-800"><strong>Cutoff</strong><br />V_GS ≤ V_T in the simple model.</div>
          <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900"><strong>Triode</strong><br />Channel conducts with V_DS below overdrive.</div>
          <div className="rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900"><strong>Saturation</strong><br />V_DS is at least the overdrive voltage.</div>
        </div>
      </DiagramFrame>
    );
  }

  if (kind === 'opamp') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <svg viewBox="0 0 340 190" className="w-full" role="img" aria-label="Inverting op amp with negative feedback">
          <polygon points="125,45 125,145 240,95" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2.5" />
          <text x="139" y="79" fontSize="17" fill="#6d28d9">−</text>
          <text x="139" y="123" fontSize="17" fill="#6d28d9">+</text>
          <line x1="35" y1="75" x2="125" y2="75" stroke="#2563eb" strokeWidth="2.5" />
          <circle cx="35" cy="75" r="4" fill="#2563eb" />
          <text x="30" y="62" fontSize="11" fill="#1d4ed8">vᵢ</text>
          <line x1="125" y1="120" x2="80" y2="120" stroke="#64748b" strokeWidth="2.5" />
          <line x1="80" y1="120" x2="80" y2="165" stroke="#64748b" strokeWidth="2.5" />
          <line x1="65" y1="165" x2="95" y2="165" stroke="#64748b" strokeWidth="2" />
          <line x1="70" y1="171" x2="90" y2="171" stroke="#64748b" strokeWidth="2" />
          <line x1="76" y1="177" x2="84" y2="177" stroke="#64748b" strokeWidth="2" />
          <line x1="240" y1="95" x2="305" y2="95" stroke="#7c3aed" strokeWidth="3" />
          <text x="282" y="84" fontSize="11" fill="#6d28d9">vₒ</text>
          <path d="M280 95 L280 28 L80 28 L80 75" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
          <rect x="156" y="19" width="48" height="18" rx="4" fill="#fef3c7" stroke="#f59e0b" />
          <text x="180" y="31" textAnchor="middle" fontSize="10" fill="#92400e">R_f</text>
        </svg>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs leading-5 text-violet-900">
          <strong>Negative feedback:</strong> The output is fed back to the inverting input. Under linear operation, the circuit adjusts its output to satisfy the input relationship.
        </div>
      </DiagramFrame>
    );
  }

  if (kind === 'logic') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3">
            <h5 className="text-sm font-bold text-sky-900">AND</h5>
            <p className="mt-1 text-xs text-sky-800">Output is 1 only when both inputs are 1.</p>
            <table className="mt-3 w-full text-center text-xs">
              <thead><tr className="text-sky-900"><th>A</th><th>B</th><th>Y</th></tr></thead>
              <tbody>{[['0','0','0'],['0','1','0'],['1','0','0'],['1','1','1']].map((r,i)=><tr key={i} className="border-t border-sky-100"><td className="py-1">{r[0]}</td><td>{r[1]}</td><td className="font-bold">{r[2]}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <h5 className="text-sm font-bold text-emerald-900">OR</h5>
            <p className="mt-1 text-xs text-emerald-800">Output is 1 when at least one input is 1.</p>
            <table className="mt-3 w-full text-center text-xs">
              <thead><tr className="text-emerald-900"><th>A</th><th>B</th><th>Y</th></tr></thead>
              <tbody>{[['0','0','0'],['0','1','1'],['1','0','1'],['1','1','1']].map((r,i)=><tr key={i} className="border-t border-emerald-100"><td className="py-1">{r[0]}</td><td>{r[1]}</td><td className="font-bold">{r[2]}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <h5 className="text-sm font-bold text-rose-900">NOT</h5>
            <p className="mt-1 text-xs text-rose-800">Output is the complement of the input.</p>
            <table className="mt-3 w-full text-center text-xs">
              <thead><tr className="text-rose-900"><th>A</th><th>Y</th></tr></thead>
              <tbody>{[['0','1'],['1','0']].map((r,i)=><tr key={i} className="border-t border-rose-100"><td className="py-1">{r[0]}</td><td className="font-bold">{r[1]}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </DiagramFrame>
    );
  }

  if (kind === 'circuit') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <svg viewBox="0 0 340 170" className="w-full" role="img" aria-label="Simple resistor circuit">
          <path d="M55 45 H105 M145 45 H285 V130 H55 V45" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="105" y="35" width="40" height="20" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
          <text x="125" y="29" textAnchor="middle" fontSize="11" fill="#92400e">R</text>
          <circle cx="55" cy="45" r="5" fill="#2563eb" />
          <circle cx="55" cy="130" r="5" fill="#2563eb" />
          <text x="33" y="35" fontSize="11" fill="#1d4ed8">+</text>
          <text x="33" y="145" fontSize="11" fill="#1d4ed8">−</text>
          <text x="180" y="84" textAnchor="middle" fontSize="12" fill="#334155">Current I →</text>
          <text x="170" y="158" textAnchor="middle" fontSize="11" fill="#64748b">Simplified circuit path</text>
        </svg>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900"><strong>1. Model</strong><br />Label components and reference directions.</div>
          <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900"><strong>2. Equation</strong><br />Apply KCL, KVL and element laws.</div>
          <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900"><strong>3. Verify</strong><br />Check units and current directions.</div>
        </div>
      </DiagramFrame>
    );
  }

  if (kind === 'waveform') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <svg viewBox="0 0 340 190" className="w-full" role="img" aria-label="Continuous waveform and sampled points">
          <line x1="22" y1="88" x2="320" y2="88" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="35" y1="20" x2="35" y2="157" stroke="#94a3b8" strokeWidth="1.5" />
          <path d={Array.from({length:121},(_,i)=>{const x=35+i*2.3;const y=88-47*Math.sin(i/12);return `${i===0?'M':'L'}${x.toFixed(1)} ${y.toFixed(1)}`;}).join(' ')} stroke="#6366f1" strokeWidth="3" fill="none" strokeLinecap="round" />
          {[0,12,24,36,48,60,72,84,96,108,120].map((i)=>{const x=35+i*2.3;const y=88-47*Math.sin(i/12);return <circle key={i} cx={x} cy={y} r="4" fill="#f43f5e" stroke="white" strokeWidth="1.5" />;})}
          <text x="45" y="17" fontSize="11" fill="#4f46e5">Continuous signal</text>
          <text x="205" y="175" fontSize="11" fill="#be123c">Sample points</text>
        </svg>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900"><strong>Time domain</strong><br />How the signal changes over time.</div>
          <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-900"><strong>Sampling</strong><br />Measure at discrete time instants.</div>
          <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900"><strong>Frequency domain</strong><br />Study the signal’s frequency components.</div>
        </div>
      </DiagramFrame>
    );
  }

  if (kind === 'control') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <svg viewBox="0 0 340 160" className="w-full" role="img" aria-label="Closed loop control block diagram">
          <rect x="18" y="45" width="72" height="36" rx="8" fill="#dbeafe" stroke="#60a5fa" strokeWidth="2" />
          <text x="54" y="67" textAnchor="middle" fontSize="11" fill="#1d4ed8">Input</text>
          <circle cx="116" cy="63" r="14" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <text x="116" y="68" textAnchor="middle" fontSize="16" fill="#92400e">Σ</text>
          <rect x="151" y="45" width="78" height="36" rx="8" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
          <text x="190" y="67" textAnchor="middle" fontSize="11" fill="#6d28d9">Controller</text>
          <rect x="254" y="45" width="68" height="36" rx="8" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
          <text x="288" y="67" textAnchor="middle" fontSize="11" fill="#166534">Plant</text>
          <path d="M90 63 H101 M130 63 H151 M229 63 H254 M322 63 H331" stroke="#64748b" strokeWidth="2.5" fill="none" />
          <path d="M288 81 V125 H116 V78" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
          <path d="M110 88 L116 78 L122 88" stroke="#f59e0b" strokeWidth="2" fill="none" />
          <text x="205" y="145" textAnchor="middle" fontSize="11" fill="#92400e">Feedback path</text>
        </svg>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs leading-5 text-violet-900">
          The output is measured and fed back to the summing point. The controller responds to the difference between the reference and the feedback signal.
        </div>
      </DiagramFrame>
    );
  }

  if (kind === 'communication') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700"><BookOpen className="h-5 w-5" /></div>
            <h5 className="mt-2 text-sm font-bold text-sky-900">Message</h5>
            <p className="mt-1 text-xs text-sky-800">Information to be sent.</p>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700"><Zap className="h-5 w-5" /></div>
            <h5 className="mt-2 text-sm font-bold text-violet-900">Modulation</h5>
            <p className="mt-1 text-xs text-violet-800">Place information onto a carrier.</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-5 w-5" /></div>
            <h5 className="mt-2 text-sm font-bold text-emerald-900">Receiver</h5>
            <p className="mt-1 text-xs text-emerald-800">Recover the information.</p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          Real systems also account for the channel, noise, bandwidth limits and receiver design.
        </div>
      </DiagramFrame>
    );
  }

  if (kind === 'emft') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <svg viewBox="0 0 340 175" className="w-full" role="img" aria-label="Conceptual electromagnetic wave">
          <line x1="20" y1="88" x2="320" y2="88" stroke="#94a3b8" strokeWidth="1.5" />
          <path d={Array.from({length:101},(_,i)=>{const x=20+i*3;const y=88-34*Math.sin(i/8);return `${i===0?'M':'L'}${x} ${y}`;}).join(' ')} fill="none" stroke="#2563eb" strokeWidth="2.5" />
          <path d={Array.from({length:101},(_,i)=>{const x=20+i*3;const y=88-25*Math.cos(i/8);return `${i===0?'M':'L'}${x} ${y}`;}).join(' ')} fill="none" stroke="#f97316" strokeWidth="2.5" />
          <text x="27" y="25" fontSize="11" fontWeight="bold" fill="#1d4ed8">Electric field E</text>
          <text x="27" y="155" fontSize="11" fontWeight="bold" fill="#c2410c">Magnetic field H</text>
          <text x="170" y="171" textAnchor="middle" fontSize="10" fill="#64748b">Illustrative field variation</text>
        </svg>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900"><strong>Electric field</strong><br />Describes electric force per unit charge.</div>
          <div className="rounded-lg bg-orange-50 p-3 text-xs text-orange-900"><strong>Magnetic field</strong><br />Related to currents and changing fields.</div>
          <div className="rounded-lg bg-violet-50 p-3 text-xs text-violet-900"><strong>Propagation</strong><br />Fields form a travelling wave in suitable conditions.</div>
        </div>
      </DiagramFrame>
    );
  }

  if (kind === 'math') {
    return (
      <DiagramFrame title={title} caption={caption}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <h5 className="text-sm font-bold text-indigo-900">Matrix</h5>
            <div className="mt-3 flex items-center justify-center gap-2 text-lg font-mono text-indigo-900">
              <span>⎡</span><span>2&nbsp; 0<br />0&nbsp; 3</span><span>⎤</span>
            </div>
            <p className="mt-3 text-xs text-indigo-800">A square matrix can represent a linear transformation.</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <h5 className="text-sm font-bold text-emerald-900">Eigenvalues</h5>
            <p className="mt-3 text-center text-lg font-mono text-emerald-900">det(A − λI) = 0</p>
            <p className="mt-3 text-xs text-emerald-800">Solve the characteristic equation to find the eigenvalues.</p>
          </div>
        </div>
      </DiagramFrame>
    );
  }

  return (
    <DiagramFrame title={title} caption={caption}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700"><BookOpen className="h-5 w-5" /></div>
          <h5 className="mt-3 text-sm font-bold text-blue-900">Understand</h5>
          <p className="mt-1 text-xs leading-5 text-blue-800">Define the concept in your own words.</p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700"><Lightbulb className="h-5 w-5" /></div>
          <h5 className="mt-3 text-sm font-bold text-violet-900">Model</h5>
          <p className="mt-1 text-xs leading-5 text-violet-800">Draw the relevant circuit, graph or model.</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-5 w-5" /></div>
          <h5 className="mt-3 text-sm font-bold text-emerald-900">Apply</h5>
          <p className="mt-1 text-xs leading-5 text-emerald-800">Use the model to solve a question.</p>
        </div>
      </div>
    </DiagramFrame>
  );
};

/* --------------------------- MAIN PAGE --------------------------- */

export const LearnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<LessonTab>('Concept');
  const [selectedSubject, setSelectedSubject] = useState('Analog Electronics');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [showSimpler, setShowSimpler] = useState(false);
  const [showDiagram, setShowDiagram] = useState(true);

  const eceSubjects = Object.keys(topicsBySubject);

  // Sync with URL query parameters (/learn?subjectId=... or ?subject=... or ?topic=...)
  useEffect(() => {
    const paramSubjectId = searchParams.get('subjectId');
    const paramSubject = searchParams.get('subject');
    const paramTopic = searchParams.get('topic');

    let resolvedSubject = selectedSubject;
    if (paramSubjectId && subjectIdToName[paramSubjectId]) {
      resolvedSubject = subjectIdToName[paramSubjectId];
      setSelectedSubject(resolvedSubject);
    } else if (paramSubject && topicsBySubject[paramSubject]) {
      resolvedSubject = paramSubject;
      setSelectedSubject(resolvedSubject);
    }

    if (paramTopic) {
      const available = topicsBySubject[resolvedSubject] || [];
      const match =
        available.find((t) => t.toLowerCase() === paramTopic.toLowerCase()) ||
        paramTopic;
      setSelectedTopic(match);
    }
  }, [searchParams]);

  const subjectTopics = topicsBySubject[selectedSubject] ?? [];

  const filteredTopics = useMemo(
    () =>
      subjectTopics.filter((topic) =>
        topic.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [subjectTopics, searchText],
  );

  const lesson = selectedTopic ? buildLesson(selectedSubject, selectedTopic) : null;
  const tabs: LessonTab[] = [
    'Concept',
    'Formulae',
    'Examples',
    'GATE Points',
    'Common Mistakes',
  ];

  const currentIndex = selectedTopic
    ? Math.max(0, subjectTopics.indexOf(selectedTopic))
    : -1;

  const chooseSubject = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedTopic(null);
    setSearchText('');
    setActiveTab('Concept');
    setShowSimpler(false);
  };

  const chooseTopic = (topic: string) => {
    setSelectedTopic(topic);
    setActiveTab('Concept');
    setShowSimpler(false);
  };

  const moveTopic = (direction: number) => {
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= subjectTopics.length) return;
    chooseTopic(subjectTopics[nextIndex]);
  };

  const bookmarkKey = selectedTopic
    ? `${selectedSubject}::${selectedTopic}`
    : '';

  const isBookmarked = bookmarked.includes(bookmarkKey);

  const toggleBookmark = () => {
    if (!bookmarkKey) return;
    setBookmarked((old) =>
      old.includes(bookmarkKey)
        ? old.filter((item) => item !== bookmarkKey)
        : [...old, bookmarkKey],
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      {/* Hero banner — existing theme retained */}
      <section className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-r from-[#fcf7f7] via-[#f7ebeb] to-[#f4dfdf] p-6 shadow-sm md:flex-row md:p-8">
        <div className="z-10 w-full space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8e2137]">
            LEARN
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#500713] sm:text-4xl">
            Concepts Made Simple
          </h1>
          <p className="text-sm text-stone-600">
            Detailed explanations, colourful diagrams, worked examples and GATE-focused learning.
          </p>

          <div className="max-w-xl pt-2">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                placeholder="Search topics in the selected subject..."
                className="w-full rounded-lg border border-rose-100 bg-white py-2 pl-9 pr-4 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#701a2b]/20"
              />
            </div>
          </div>

          <a
            className="inline-block text-[11px] text-[#701a2b] underline"
            href="https://gate2027.iitm.ac.in/exam_papers_and_syllabus"
            target="_blank"
            rel="noreferrer"
          >
            Official GATE 2027 syllabus (IIT Madras) ↗
          </a>
        </div>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <div className="flex h-28 w-40 items-center justify-center rounded-xl border border-rose-200 bg-white/80 p-4 shadow-sm">
            <div className="text-center">
              <GraduationCap className="mx-auto h-9 w-9 text-[#701a2b]" />
              <p className="mt-2 text-xs font-semibold text-[#701a2b]">Learn visually</p>
            </div>
          </div>
          <p className="font-serif text-xs italic text-[#701a2b] max-w-[150px] leading-tight">
            {getTopicQuote('learn')}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left subject sidebar */}
        <aside className="h-fit rounded-2xl border border-rose-100 bg-white p-4 shadow-sm lg:col-span-3">
          <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-stone-700">
            ECE Subjects
          </h3>

          <div className="space-y-1 text-xs">
            {eceSubjects.map((subject) => (
              <button
                key={subject}
                onClick={() => chooseSubject(subject)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                  selectedSubject === subject
                    ? 'border-l-4 border-[#701a2b] bg-rose-50 font-semibold text-[#701a2b]'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>{subject}</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-stone-400" />
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-rose-50 p-4 text-center text-xs">
            <HelpCircle className="mx-auto mb-2 h-6 w-6 text-indigo-700" />
            <p className="font-semibold text-stone-800">Need help understanding?</p>
            <p className="mt-1 leading-5 text-stone-500">
              Choose a topic and explore the explanation, diagram, formulas and examples.
            </p>
          </div>
        </aside>

        {/* Main learning area */}
        <main className="flex min-w-0 flex-col rounded-2xl border border-rose-100 bg-white p-4 shadow-sm sm:p-6 lg:col-span-6">
          {!selectedTopic ? (
            <>
              <div className="border-b border-rose-50 pb-4">
                <p className="text-xs text-stone-400">Learn › {selectedSubject}</p>
                <h2 className="mt-2 font-serif text-xl font-bold text-stone-900">
                  Explore Topics
                </h2>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Select a topic to open its learning notes, visual diagrams, formulas and examples.
                  {' '}
                  {filteredTopics.length} topics shown.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredTopics.map((topic, index) => (
                  <button
                    key={topic}
                    onClick={() => chooseTopic(topic)}
                    className="group rounded-xl border border-rose-100 bg-white p-4 text-left transition hover:border-rose-300 hover:bg-rose-50/50"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-stone-800">{topic}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-stone-400 group-hover:text-[#701a2b]" />
                    </span>
                    <span className="mt-2 block text-[10px] text-stone-500">
                      Topic {index + 1} · Concept, diagram and examples
                    </span>
                  </button>
                ))}
              </div>

              {filteredTopics.length === 0 && (
                <p className="mt-5 rounded-xl bg-amber-50 p-4 text-xs text-amber-900">
                  No topics match that search. Try another keyword or choose a different subject.
                </p>
              )}
            </>
          ) : lesson ? (
            <>
              {/* Lesson header */}
              <div className="flex items-start justify-between gap-3 border-b border-rose-50 pb-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1 text-xs text-stone-400">
                    <button
                      onClick={() => setSelectedTopic(null)}
                      className="hover:text-[#701a2b]"
                    >
                      Explore Topics
                    </button>
                    <span>›</span>
                    <span>{selectedSubject}</span>
                  </div>
                  <h2 className="mt-2 font-serif text-xl font-bold text-stone-900">
                    {selectedTopic}
                  </h2>
                  <p className="mt-1 text-xs text-stone-500">
                    {selectedSubject} · GATE EC learning notes
                  </p>
                </div>

                <button
                  onClick={toggleBookmark}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark this topic'}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${
                    isBookmarked
                      ? 'border-amber-300 bg-amber-50 text-amber-800'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {/* Progress */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-rose-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#701a2b] to-rose-400 transition-all"
                    style={{
                      width: `${((currentIndex + 1) / subjectTopics.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="whitespace-nowrap text-[10px] font-semibold text-stone-500">
                  Topic {currentIndex + 1} of {subjectTopics.length}
                </span>
              </div>

              {/* Tabs */}
              <div className="mt-5 flex items-center gap-1 overflow-x-auto border-b border-rose-100 pb-1 text-xs font-medium">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap rounded-t-lg border-b-2 px-3 py-2 transition ${
                      activeTab === tab
                        ? 'border-[#701a2b] bg-rose-50/60 font-semibold text-[#701a2b]'
                        : 'border-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-5 text-xs leading-6 text-stone-700">
                {/* CONCEPT TAB */}
                {activeTab === 'Concept' && (
                  <>
                    <section className="rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 to-indigo-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                          <BookOpen className="h-4 w-4" />
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">1. Understand the concept</h3>
                      </div>
                      <p className="leading-6 text-slate-700">{lesson.intro}</p>
                    </section>

                    <section className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <Lightbulb className="h-4 w-4" />
                        </span>
                        <h3 className="text-sm font-bold text-emerald-950">2. Simple explanation</h3>
                      </div>
                      <p className="leading-6 text-emerald-950">{lesson.simple}</p>
                      <button
                        onClick={() => setShowSimpler((old) => !old)}
                        className="mt-3 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/60"
                      >
                        {showSimpler ? 'Hide key idea' : 'Explain it in one line'}
                      </button>
                      {showSimpler && (
                        <div className="mt-3 rounded-lg border border-emerald-200 bg-white p-3 text-xs leading-5 text-emerald-950">
                          <strong>Remember:</strong> First understand what the device or system does. Then draw its model, choose the correct equation, and check the result.
                        </div>
                      )}
                    </section>

                    <section>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-stone-900">3. Diagram and visual explanation</h3>
                        <button
                          onClick={() => setShowDiagram((old) => !old)}
                          className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[10px] font-semibold text-indigo-800 hover:bg-indigo-100"
                        >
                          {showDiagram ? 'Hide diagram' : 'Show diagram'}
                        </button>
                      </div>

                      {showDiagram && (
                        <ConceptDiagram
                          kind={lesson.diagram}
                          title={lesson.diagramTitle}
                          caption={lesson.diagramCaption}
                        />
                      )}
                    </section>

                    <section className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
                      <h3 className="mb-3 text-sm font-bold text-violet-950">4. Key points to understand</h3>
                      <ul className="space-y-3">
                        {lesson.points.map((point, index) => (
                          <li key={point} className="flex items-start gap-2">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-800">
                              {index + 1}
                            </span>
                            <span className="text-violet-950">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-950">
                        <Info className="h-4 w-4" />
                        Why is this concept important?
                      </h3>
                      <p className="text-amber-950">{lesson.why}</p>
                    </section>

                    <section className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                      <h3 className="mb-2 text-sm font-bold text-stone-900">5. How to study this topic</h3>
                      <ol className="list-decimal space-y-1.5 pl-5 text-stone-700">
                        {lesson.studyGuide && lesson.studyGuide.length > 0 ? (
                          lesson.studyGuide.map((step, idx) => (
                            <li key={idx} className="leading-5">{step}</li>
                          ))
                        ) : (
                          <>
                            <li>Read the simple explanation.</li>
                            <li>Study the labelled diagram.</li>
                            <li>Write down the formula and the meaning of every symbol.</li>
                            <li>Try the worked example without looking at the answer.</li>
                            <li>Practise related GATE questions.</li>
                          </>
                        )}
                      </ol>
                    </section>
                  </>
                )}

                {/* FORMULAE TAB */}
                {activeTab === 'Formulae' && (
                  <>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">Important formulae and relationships</h3>
                      <p className="mt-1 text-stone-500">
                        Read the meaning and assumptions before substituting numbers.
                      </p>
                    </div>

                    {lesson.formulas.map((formula, index) => (
                      <div
                        key={`${formula.equation}-${index}`}
                        className={`overflow-hidden rounded-xl border ${
                          index % 3 === 0
                            ? 'border-blue-200 bg-blue-50/70'
                            : index % 3 === 1
                              ? 'border-violet-200 bg-violet-50/70'
                              : 'border-emerald-200 bg-emerald-50/70'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 border-b border-white/80 px-4 py-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                            Formula {index + 1}
                          </span>
                          <span className="text-[10px] font-semibold text-stone-500">GATE EC</span>
                        </div>
                        <div className="break-words px-4 py-4 font-mono text-sm font-bold leading-6 text-slate-900">
                          {formula.equation}
                        </div>
                        <p className="border-t border-white/80 px-4 py-3 text-xs leading-5 text-stone-700">
                          {formula.meaning}
                        </p>
                        {formula.conditions && (
                          <div className="border-t border-white/80 bg-white/50 px-4 py-2 text-[11px] leading-4 text-stone-600">
                            <strong className="text-stone-800">Conditions / Validity:</strong> {formula.conditions}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950">
                      <strong>Exam tip:</strong> Write the equation first. Then substitute values with consistent units. Never select a formula only because its symbols look familiar.
                    </div>
                  </>
                )}

                {/* EXAMPLES TAB */}
                {activeTab === 'Examples' && (
                  <>
                    <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                      <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                        Worked example
                      </span>
                      <h3 className="mt-3 text-sm font-bold text-indigo-950">Question</h3>
                      <p className="mt-2 leading-6 text-indigo-950">{lesson.example.question}</p>
                    </section>

                    <section className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                      <h3 className="mb-3 text-sm font-bold text-sky-950">Given information</h3>
                      <ul className="space-y-2">
                        {lesson.example.given.map((item, index) => (
                          <li key={item} className="flex items-start gap-2 text-sky-950">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                      <h3 className="mb-3 text-sm font-bold text-violet-950">Solution — step by step</h3>
                      <ol className="space-y-3">
                        {lesson.example.steps.map((step, index) => (
                          <li key={`${step}-${index}`} className="flex items-start gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-200 text-xs font-bold text-violet-900">
                              {index + 1}
                            </span>
                            <span className="pt-0.5 leading-6 text-violet-950">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </section>

                    <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-950">
                        <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                        Final answer
                      </h3>
                      <p className="font-semibold leading-6 text-emerald-950">{lesson.example.answer}</p>
                    </section>

                    <p className="text-xs leading-5 text-stone-500">
                      Try solving the question yourself before reading the steps. The assumptions stated in each example are important.
                    </p>
                  </>
                )}

                {/* GATE POINTS TAB */}
                {activeTab === 'GATE Points' && (
                  <>
                    <section className="rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-amber-50 p-4">
                      <h3 className="text-sm font-bold text-rose-950">What to remember for GATE EC</h3>
                      <p className="mt-1 text-xs leading-5 text-rose-900">
                        Focus on understanding the conditions, drawing the model and solving the question accurately.
                      </p>
                    </section>

                    <ul className="space-y-3">
                      {lesson.gate.map((item, index) => (
                        <li key={item} className="flex items-start gap-3 rounded-xl border border-rose-100 bg-white p-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-800">
                            <CheckCircle2 className="h-4 w-4" />
                          </span>
                          <span className="leading-6 text-stone-700">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                      <h3 className="text-sm font-bold text-indigo-950">Suggested revision method</h3>
                      <p className="mt-2 leading-6 text-indigo-950">
                        Revise the concept, practise a direct formula question, solve a conceptual question, and then attempt a previous-year question from the same topic.
                      </p>
                    </div>
                  </>
                )}

                {/* COMMON MISTAKES TAB */}
                {activeTab === 'Common Mistakes' && (
                  <>
                    <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <h3 className="text-sm font-bold text-amber-950">Avoid these mistakes</h3>
                      <p className="mt-1 text-xs leading-5 text-amber-900">
                        Many errors happen because the model or assumptions are chosen incorrectly, even when the formula is remembered.
                      </p>
                    </section>

                    <ul className="space-y-3">
                      {lesson.mistakes.map((mistake, index) => (
                        <li
                          key={mistake}
                          className={`flex items-start gap-3 rounded-xl border p-3 ${
                            index === 0
                              ? 'border-rose-200 bg-rose-50'
                              : 'border-stone-200 bg-stone-50'
                          }`}
                        >
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            index === 0 ? 'bg-rose-100 text-rose-800' : 'bg-stone-200 text-stone-700'
                          }`}>
                            <Info className="h-4 w-4" />
                          </span>
                          <span className="leading-6 text-stone-800">{mistake}</span>
                        </li>
                      ))}
                    </ul>

                    <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <h3 className="text-sm font-bold text-emerald-950">Before submitting an answer</h3>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-emerald-950">
                        <li>Check the formula and assumptions.</li>
                        <li>Check units and signs.</li>
                        <li>Check whether the answer is physically possible.</li>
                      </ul>
                    </section>
                  </>
                )}

              </div>

              {/* Lesson navigation */}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-rose-50 pt-5">
                <button
                  onClick={() => moveTopic(-1)}
                  disabled={currentIndex <= 0}
                  className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous Topic
                </button>

                <button
                  onClick={() => {
                    const index = tabs.indexOf(activeTab);
                    if (index < tabs.length - 1) {
                      setActiveTab(tabs[index + 1]);
                    } else {
                      moveTopic(1);
                    }
                  }}
                  className="flex items-center gap-1 rounded-lg bg-[#701a2b] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#500713]"
                >
                  {activeTab !== 'Common Mistakes'
                    ? `Next: ${tabs[tabs.indexOf(activeTab) + 1]}`
                    : 'Next Topic'}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : null}
        </main>

        {/* Right sidebar — retained and improved */}
        <aside className="space-y-5 lg:col-span-3">
          <section className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold text-stone-800">Quick Links</h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/resources?type=Formula+Sheets"
                className="flex items-center gap-2 rounded-lg p-2 text-stone-700 hover:bg-rose-50"
              >
                <FileText className="h-4 w-4 text-[#701a2b]" />
                <span>View Formula Sheet</span>
              </Link>
              <a
                href="https://nptel.ac.in"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg p-2 text-stone-700 hover:bg-rose-50"
              >
                <Video className="h-4 w-4 text-[#701a2b]" />
                <span>Watch Video Lectures</span>
              </a>
              <Link
                to="/resources"
                className="flex items-center gap-2 rounded-lg p-2 text-stone-700 hover:bg-rose-50"
              >
                <Download className="h-4 w-4 text-[#701a2b]" />
                <span>Download Notes (PDF)</span>
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
            <h3 className="mb-1 text-xs font-semibold text-stone-800">Practice This Concept</h3>
            <p className="mb-3 text-[11px] leading-5 text-stone-500">
              Test your understanding with questions related to the selected subject.
            </p>
            <Link
              to={`/practice?subject=${encodeURIComponent(selectedSubject)}${selectedTopic ? `&topic=${encodeURIComponent(selectedTopic)}` : ''}`}
              className="block w-full rounded-lg bg-[#701a2b] py-2 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-[#500713]"
            >
              Start Practice →
            </Link>
          </section>

          <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm">
            <h3 className="mb-1 text-xs font-semibold text-indigo-950">Learning tip</h3>
            <p className="text-[11px] leading-5 text-indigo-900">
              Do not memorise a diagram alone. Explain what each part represents and how the diagram changes when the input or operating condition changes.
            </p>
          </section>

          <section className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
            <h3 className="mb-1 text-xs font-semibold text-stone-800">Official Syllabus</h3>
            <p className="mb-3 text-[11px] leading-5 text-stone-500">
              Use the official syllabus as the final checklist for GATE preparation.
            </p>
            <a
              href="https://gate2027.iitm.ac.in/exam_papers_and_syllabus"
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-lg bg-stone-900 py-2 text-center text-xs font-semibold text-white transition hover:bg-stone-800"
            >
              Open Official Syllabus ↗
            </a>
          </section>

          <section className="rounded-2xl border border-rose-100 bg-white p-4 text-xs shadow-sm">
            <h3 className="mb-2 font-semibold text-stone-800">Related Topics</h3>
            {subjectTopics
              .filter((topic) => topic !== selectedTopic)
              .slice(0, 5)
              .map((topic) => (
                <button
                  key={topic}
                  onClick={() => chooseTopic(topic)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg p-2 text-left text-stone-600 transition hover:bg-rose-50 hover:text-[#701a2b]"
                >
                  <span>{topic}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                </button>
              ))}
          </section>

          {bookmarked.length > 0 && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold text-amber-950">
                <Bookmark className="h-4 w-4" />
                Saved in this session
              </h3>
              <p className="text-[11px] leading-5 text-amber-900">
                {bookmarked.length} topic{bookmarked.length === 1 ? '' : 's'} bookmarked. These are kept while this page remains open; persistent storage is not configured.
              </p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};


export default LearnPage;