import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ChevronRight, 
  BookOpen, 
  Download, 
  HelpCircle, 
  FileText,
  Sparkles,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  X,
  ExternalLink,
  Layers
} from 'lucide-react';
import api from '../services/api';

const SYLLABUS_MAP: Record<string, { file: string; weightage: string; topicsSummary: string[] }> = {
  'Engineering Mathematics': {
    file: '/resources/syllabus/engineering_mathematics_gate_syllabus.pdf',
    weightage: '13 Marks (13% weightage)',
    topicsSummary: [
      'Linear Algebra: Vector spaces, Eigenvalues, Rank, Linear systems',
      'Calculus: Mean value theorems, Multiple integrals, Taylor series',
      'Differential Equations: First & higher order, Variable separable',
      'Vector Analysis: Gradient, Divergence, Curl, Gauss/Stokes theorems',
      'Complex Variables: Cauchy-Riemann, Residue theorem, Contour integrals',
      'Probability & Statistics: Distributions, Conditional probability, Regression'
    ]
  },
  'Network Theory': {
    file: '/resources/syllabus/network_theory_gate_syllabus.pdf',
    weightage: '8 - 11 Marks',
    topicsSummary: [
      'Nodal & Mesh Analysis for AC & DC circuits',
      'Theorems: Superposition, Thevenin, Norton, Max Power Transfer',
      'Sinusoidal Steady State: Phasors, Resonance, Quality factor (Q)',
      'Time Domain Analysis: Transient response of RL, RC & RLC circuits',
      'Laplace Transform network solution & transfer functions',
      'Two-Port Parameters (Z, Y, ABCD, h) & State Equations'
    ]
  },
  'Signals & Systems': {
    file: '/resources/syllabus/signals_and_systems_gate_syllabus.pdf',
    weightage: '7 - 9 Marks',
    topicsSummary: [
      'Continuous & Discrete-time signals: Periodic, Energy, Power',
      'LTI Systems: Linearity, Causality, BIBO Stability, Convolution',
      'Fourier Representations: Fourier Series & Continuous Fourier (CTFT)',
      'Sampling Theorem, Nyquist rate & Signal Reconstruction',
      'Laplace & Z-Transform: Region of Convergence (ROC) & Inversion',
      'DTFT, DFT, FFT and Digital Filter Design fundamentals'
    ]
  },
  'Electronic Devices': {
    file: '/resources/syllabus/electronic_devices_gate_syllabus.pdf',
    weightage: '9 - 11 Marks',
    topicsSummary: [
      'Semiconductor Physics: Energy bands, Fermi level, Carrier transport',
      'Carrier mechanisms: Drift, Diffusion, Recombination & Continuity equation',
      'P-N Junction Diode: Depletion region, I-V characteristics, Capacitance',
      'Zener, Tunnel, Avalanche breakdown, LED & Photodiodes',
      'BJT, JFET, MOS Capacitor & MOSFET operating regimes',
      'IC Fabrication: Oxidation, Diffusion, Ion implantation, CMOS'
    ]
  },
  'Analog Circuits': {
    file: '/resources/syllabus/analog_circuits_gate_syllabus.pdf',
    weightage: '8 - 11 Marks',
    topicsSummary: [
      'Diode circuits: Clipping, Clamping, Rectifiers & Voltage regulation',
      'BJT & MOSFET Amplifiers: Biasing, Small signal models, Gain, Bandwidth',
      'Differential Amplifiers, CMRR & Multi-stage configurations',
      'Feedback Amplifiers: Gain stabilization, Bandwidth extension',
      'Operational Amplifiers: Linear & Non-linear circuits, Active filters',
      'Oscillators (Barkhausen criterion), 555 Timers & Function generators'
    ]
  },
  'Digital Circuits': {
    file: '/resources/syllabus/digital_circuits_gate_syllabus.pdf',
    weightage: '8 - 10 Marks',
    topicsSummary: [
      'Number Systems, Boolean Algebra & K-Map minimization',
      'Combinational Circuits: Adders, MUX, Demux, Encoders, Decoders',
      'Sequential Logic: Latches, Flip-Flops, Counters, Shift Registers',
      'Finite State Machines (FSM): Mealy & Moore architectures',
      'Data Converters: ADC (SAR, Flash, Dual slope) & DAC (R-2R)',
      'Semiconductor Memories (ROM, SRAM, DRAM) & 8085 Microprocessor'
    ]
  },
  'Control Systems': {
    file: '/resources/syllabus/control_systems_gate_syllabus.pdf',
    weightage: '8 - 10 Marks',
    topicsSummary: [
      'System Modeling: Block diagrams & Signal Flow Graphs (Mason gain)',
      'Time Response: Transient specs, Steady-state errors, Static error constants',
      'Stability: Routh-Hurwitz criterion & special cases',
      'Root Locus Technique: Rules, Breakaway points, Stability bounds',
      'Frequency Response: Bode Plots, Nyquist Stability Criterion, Polar plots',
      'Compensators (Lead, Lag) & State Space Analysis (STM, Controllability)'
    ]
  },
  'Communication Systems': {
    file: '/resources/syllabus/communication_systems_gate_syllabus.pdf',
    weightage: '9 - 12 Marks',
    topicsSummary: [
      'Random Processes: PSD, Autocorrelation, White Gaussian Noise',
      'Analog Modulation: AM, DSB-SC, SSB, FM, PM, Superheterodyne receivers',
      'Information Theory: Entropy, Mutual Information, Shannon capacity',
      'Pulse Shaping & Digital Transmission: PCM, DPCM, Eye diagram, Nyquist ISI',
      'Digital Modulation Schemes: ASK, PSK, FSK, QPSK, QAM, Matched filters',
      'Error Control Coding: Hamming codes, Linear block codes, Trellis'
    ]
  },
  'Electromagnetics (EMFT)': {
    file: '/resources/syllabus/electromagnetics_gate_syllabus.pdf',
    weightage: '8 - 10 Marks',
    topicsSummary: [
      'Electrostatics & Magnetostatics: Gauss Law, Biot-Savart, Boundary conditions',
      "Maxwell's Equations in differential and integral forms, Poynting vector",
      'Plane Electromagnetic Waves: Polarization, Reflection, Snell Law, Skin depth',
      'Transmission Lines: Equations, Characteristic impedance, Reflection coeff, VSWR',
      'Smith Chart & Impedance matching techniques (Single/Double stub)',
      'Waveguides: TE/TM modes, Cut-off frequency & Antenna radiation fundamentals'
    ]
  },
  'General Aptitude': {
    file: '/resources/syllabus/general_aptitude_gate_syllabus.pdf',
    weightage: '15 Marks (Mandatory for all aspirants)',
    topicsSummary: [
      'Verbal Ability: Grammar, Vocabulary, Reading Comprehension, Sentence sequencing',
      'Quantitative Aptitude: Data interpretation, Graphs, Plots, Ratios, Percentages',
      'Numerical Computation: Powers, Exponents, Series, Permutations & Combinations',
      'Analytical Aptitude: Logic, Deduction, Induction, Complex puzzle solving',
      'Spatial Aptitude: 2D/3D shape transformations, Mirroring, Paper folding/cutting'
    ]
  }
};

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Subjects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<any | null>(null);

  const categories = [
    'All Subjects',
    'Core Subjects',
    'Electronics',
    'Communication',
    'Control & Systems',
    'Mathematics'
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/subjects');
        // Filter out lab subject since GATE ECE is purely theoretical & analytical
        const valid = (res.data || []).filter((s: any) => !s.name.toLowerCase().includes('lab'));
        setSubjects(valid);
      } catch (err) {
        console.error('Failed to load subjects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter((s) => {
    const matchesCategory = selectedCategory === 'All Subjects' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getSyllabusInfo = (subjectName: string) => {
    return SYLLABUS_MAP[subjectName] || {
      file: '/resources/syllabus/gate_ece_complete_official_syllabus.pdf',
      weightage: 'Core GATE Subject',
      topicsSummary: ['Official GATE ECE syllabus topics']
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-[#fbf5f5] via-[#f7ebeb] to-[#f4dfdf] rounded-2xl p-6 md:p-8 border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-[#8e2137] tracking-wider bg-rose-100/80 px-2.5 py-0.5 rounded-full border border-rose-200">
              OFFICIAL GATE ECE CURRICULUM
            </span>
            <span className="text-xs text-stone-500 font-medium">
              &bull; GSSSIETW Mysore
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#500713]">
            GATE ECE Subjects & Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Download the official GATE syllabus for each subject separately below. Review module-wise weightage and high-yield topics.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="/resources/syllabus/gate_ece_complete_official_syllabus.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#701a2b] hover:bg-[#500713] text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Master GATE ECE Syllabus (All Subjects PDF)</span>
            </a>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="w-44 h-28 rounded-xl overflow-hidden shadow-sm border border-rose-200">
            <img 
              src="/images/gate-student-hero.png" 
              alt="Subjects Banner" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="font-serif italic text-xs text-[#701a2b] max-w-[130px] leading-tight">
            “Small steps in the right direction lead to big results.”
          </div>
        </div>
      </div>

      {/* 2. Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#701a2b] text-white shadow-xs'
                  : 'bg-white border border-rose-100 text-stone-600 hover:bg-rose-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects or syllabus..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-rose-100 rounded-full text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#701a2b]"
          />
        </div>
      </div>

      {/* 3. Main Two-Column Layout (Cards + Right-hand Details & Master Download) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Subjects Grid (3 cols) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-sm text-stone-500">
              Loading syllabus and subjects...
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="col-span-3 bg-white p-8 rounded-xl text-center text-sm text-stone-500">
              No subjects found matching your search.
            </div>
          ) : (
            filteredSubjects.map((sub) => {
              const syllabus = getSyllabusInfo(sub.name);

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs hover:border-rose-300 hover:shadow-sm transition flex flex-col justify-between group"
                >
                  <div>
                    {/* Top row: Subject Code + Weightage */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-lg bg-rose-50 text-[#701a2b] flex items-center justify-center font-bold text-xs group-hover:bg-[#701a2b] group-hover:text-white transition">
                        {sub.code || 'EC'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-50 text-stone-600 border border-stone-200">
                        {syllabus.weightage}
                      </span>
                    </div>

                    {/* Subject Title */}
                    <h3 className="font-serif font-bold text-stone-900 text-sm group-hover:text-[#701a2b] transition">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {sub.description}
                    </p>

                    {/* Quick Topics Preview */}
                    <div className="mt-3 py-2 px-2.5 bg-stone-50/70 rounded-xl border border-stone-100">
                      <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#701a2b]" />
                        Official Syllabus Key Modules:
                      </div>
                      <ul className="text-[11px] text-stone-600 space-y-0.5 line-clamp-3">
                        {syllabus.topicsSummary.slice(0, 3).map((top, tidx) => (
                          <li key={tidx} className="truncate">
                            &bull; {top}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions Row: Download Syllabus PDF + View Details / Learn */}
                  <div className="mt-4 pt-3.5 border-t border-rose-50 space-y-2">
                    {/* Direct Syllabus Download Button */}
                    <a
                      href={syllabus.file}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-rose-50 hover:bg-[#701a2b] text-[#701a2b] hover:text-white border border-rose-200 hover:border-[#701a2b] py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      title={`Download Official GATE Syllabus for ${sub.name} (PDF)`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download {sub.name} Syllabus (PDF)</span>
                    </a>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <button
                        onClick={() => setSelectedSubjectModal(sub)}
                        className="text-stone-500 hover:text-[#701a2b] font-medium underline cursor-pointer"
                      >
                        View Syllabus Details
                      </button>

                      <Link
                        to={`/practice?subjectId=${sub.id}`}
                        className="text-[#701a2b] font-semibold hover:underline flex items-center gap-0.5"
                      >
                        <span>Practice PYQs</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Master Syllabus & Exam Scheme */}
        <div className="space-y-5">
          {/* Master Syllabus Card */}
          <div className="bg-gradient-to-br from-[#701a2b] to-[#500713] text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-300" />
              <h3 className="font-serif font-bold text-white text-sm">
                Official GATE ECE Syllabus
              </h3>
            </div>
            <p className="text-xs text-rose-100 leading-relaxed">
              Complete syllabus document issued by IIT organizing institute covering all 10 GATE ECE subjects with examination scheme and marking patterns.
            </p>
            <a
              href="/resources/syllabus/gate_ece_complete_official_syllabus.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold py-2.5 px-3 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Master Syllabus (PDF)</span>
            </a>
          </div>

          {/* GATE ECE Exam Pattern Summary */}
          <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-stone-900 text-xs uppercase tracking-wider text-[#8e2137]">
              GATE ECE Mark Distribution
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl border border-rose-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-800">General Aptitude (GA)</div>
                  <div className="text-[10px] text-stone-400">Verbal, Quant, Logic, Spatial</div>
                </div>
                <span className="font-bold text-[#701a2b]">15 Marks</span>
              </div>

              <div className="p-2.5 rounded-xl border border-rose-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-800">Engineering Mathematics</div>
                  <div className="text-[10px] text-stone-400">Calculus, Linear Algebra, Diff Eq</div>
                </div>
                <span className="font-bold text-[#701a2b]">13 Marks</span>
              </div>

              <div className="p-2.5 rounded-xl border border-rose-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-800">Core ECE Technical Subjects</div>
                  <div className="text-[10px] text-stone-400">8 Core Engineering Subjects</div>
                </div>
                <span className="font-bold text-[#701a2b]">72 Marks</span>
              </div>

              <div className="pt-2 border-t border-rose-50 flex items-center justify-between font-bold text-stone-900 text-xs">
                <span>Total GATE Score</span>
                <span>100 Marks (65 Qs)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm space-y-2.5 text-xs">
            <h3 className="font-serif font-bold text-stone-900 text-xs mb-1">
              Study Library Quick Links
            </h3>

            <Link
              to="/resources"
              className="p-2.5 rounded-xl border border-rose-50 hover:bg-rose-50/50 flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#701a2b]" />
                <span className="font-medium text-stone-800">Study Notes by Subject</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>

            <Link
              to="/resources"
              className="p-2.5 rounded-xl border border-rose-50 hover:bg-rose-50/50 flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#701a2b]" />
                <span className="font-medium text-stone-800">Formula Sheets & PYQs</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Interactive Syllabus Details Modal */}
      {selectedSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-xl border border-rose-100 space-y-5 animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-rose-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-rose-50 text-[#701a2b] flex items-center justify-center font-bold text-xs">
                    {selectedSubjectModal.code}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#500713]">
                    {selectedSubjectModal.name} — Official GATE Syllabus
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Weightage: {getSyllabusInfo(selectedSubjectModal.name).weightage}
                </p>
              </div>

              <button
                onClick={() => setSelectedSubjectModal(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Prescribed GATE Syllabus Modules:
              </h4>

              <div className="space-y-2.5">
                {getSyllabusInfo(selectedSubjectModal.name).topicsSummary.map((top, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#701a2b] shrink-0 mt-0.5" />
                    <span>{top}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-rose-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-stone-500">
                Format: Official PDF Document &bull; GSSSIETW Mysore
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedSubjectModal(null)}
                  className="px-4 py-2 border border-stone-200 text-stone-700 rounded-xl text-xs hover:bg-stone-50 transition cursor-pointer"
                >
                  Close
                </button>

                <a
                  href={getSyllabusInfo(selectedSubjectModal.name).file}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#701a2b] hover:bg-[#500713] text-white px-5 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer flex-1 sm:flex-none"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Subject Syllabus (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
