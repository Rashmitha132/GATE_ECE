import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BookOpen, 
  Crosshair, 
  FileCheck2, 
  BarChart3, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';
import { InstitutionalHeader } from '../components/InstitutionalHeader';
import { InstitutionalFooter } from '../components/InstitutionalFooter';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user, logout } = useAuth();

  React.useEffect(() => {
    document.title = 'GSSSIETW • GATE ECE Learning & Assessment Platform';
  }, []);

  const subjects = [
    { name: "Engineering Mathematics", topics: "Calculus, Linear Algebra, Probability & Statistics", icon: "∑" },
    { name: "Network Theory", topics: "Network Analysis, Graph Theory", icon: "☊" },
    { name: "Signals & Systems", topics: "Signals, LTI Systems, Fourier Analysis", icon: "∿" },
    { name: "Electronic Devices", topics: "Semiconductors, Diodes, Transistors", icon: "▣" },
    { name: "Analog Circuits", topics: "Amplifiers, Oscillators, Feedback", icon: "▷" },
    { name: "Digital Circuits", topics: "Logic Gates, Flip-Flops, Number Systems", icon: "⊳" },
    { name: "Control Systems", topics: "Transfer Functions, Stability, Control", icon: "⚙" },
    { name: "Communications", topics: "AM/FM, Modulation, Wave Propagation", icon: "📡" },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f5] flex flex-col font-sans">
      <InstitutionalHeader />

      {/* Main Navigation Bar - Slim, Refined Academic Bar */}
      <nav className="bg-[#701a2b] text-white px-4 sm:px-8 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-base tracking-wider text-amber-200">GATE ECE</span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={user.role === 'faculty' ? '/faculty' : user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="bg-amber-300 hover:bg-amber-400 text-stone-900 font-semibold px-4 py-1.5 rounded-full text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Go to {user.role === 'faculty' ? 'Faculty Portal' : user.role === 'admin' ? 'Admin Portal' : 'Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={logout}
                  className="text-amber-200/90 hover:text-white text-xs underline cursor-pointer ml-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-amber-300 hover:bg-amber-400 text-stone-900 font-semibold px-4 py-1.5 rounded-full text-xs shadow-xs transition cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner Section matching Screenshot #1 with Balanced Proportions */}
      <section className="relative bg-gradient-to-r from-[#fcf7f7] via-[#f7ebeb] to-[#f4dfdf] overflow-hidden border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 items-center gap-8">
          {/* Left Text (7 cols) */}
          <div className="md:col-span-7 space-y-3 z-10 pr-0 md:pr-4">
            <span className="text-[11px] uppercase font-semibold text-[#8e2137] tracking-wider block">
              GATE ECE PREPARATION
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#500713] leading-tight">
              GATE ECE
            </h1>
            <p className="text-lg sm:text-xl font-serif italic text-stone-800 leading-snug">
              Prepare with Purpose.<br />Achieve with Confidence.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg leading-relaxed pt-1">
              Concepts. Practice. Tests. Progress.<br />
              Your structured journey to GATE success starts here at GSSSIETW.
            </p>
            <div className="pt-3">
              <Link
                to={user ? (user.role === 'faculty' ? '/faculty' : user.role === 'admin' ? '/admin' : '/dashboard') : '/login'}
                className="inline-flex items-center gap-2 bg-[#701a2b] hover:bg-[#500713] text-white font-medium px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <span>{user ? 'Continue Preparation' : 'Start Preparing'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Hero Image (5 cols) - Crisp, proportionate & elegant */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-3 border-white max-w-md w-full bg-white aspect-[16/10]">
              <img
                src="/images/gate-student-hero.png"
                alt="GATE ECE Student Studying"
                className="w-full h-full object-cover object-center block"
              />
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-serif italic text-[#701a2b] shadow-xs">
                Small Steps Lead to Big Dreams 🎓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Subjects Section matching Screenshot #1 */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-rose-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8e2137]">
              MASTER GATE ECE
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Core Subjects. Strong Foundation.
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Explore all important GATE ECE subjects and build your concepts step by step.
            </p>
          </div>
          <Link
            to="/subjects"
            className="text-xs font-semibold text-[#701a2b] hover:text-[#500713] flex items-center gap-1 mt-3 sm:mt-0"
          >
            <span>View Curriculum & Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((sub, idx) => (
            <Link
              to="/subjects"
              key={idx}
              className="bg-white rounded-xl p-5 border border-rose-100 shadow-sm hover:shadow-md hover:border-rose-300 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#701a2b] flex items-center justify-center font-bold text-base group-hover:bg-[#701a2b] group-hover:text-white transition">
                    {sub.icon}
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#701a2b] transition" />
                </div>
                <h3 className="font-semibold text-stone-900 text-sm group-hover:text-[#701a2b] transition">
                  {sub.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">
                  {sub.topics}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* One Platform Banner matching Screenshot #1 */}
      <section className="max-w-7xl mx-auto px-6 py-6 w-full">
        <div className="bg-[#fbf4f2] rounded-2xl p-8 border border-rose-100 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8e2137]">
              YOUR PREPARATION
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#500713] mt-1">
              One Platform.
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Everything you need to crack GATE ECE — organized, simple and effective.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl shadow-xs">
                <BookOpen className="w-6 h-6 text-[#701a2b] mb-1.5" />
                <span className="text-xs font-medium text-stone-800">Concept Learning</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl shadow-xs">
                <Crosshair className="w-6 h-6 text-[#701a2b] mb-1.5" />
                <span className="text-xs font-medium text-stone-800">Practice Questions</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl shadow-xs">
                <FileCheck2 className="w-6 h-6 text-[#701a2b] mb-1.5" />
                <span className="text-xs font-medium text-stone-800">Mock Tests</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl shadow-xs">
                <BarChart3 className="w-6 h-6 text-[#701a2b] mb-1.5" />
                <span className="text-xs font-medium text-stone-800">Performance Analytics</span>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-right">
            <span className="font-serif italic text-2xl text-[#701a2b] block">
              Learn.<br />Practice.<br />Improve.<br />Succeed.
            </span>
          </div>
        </div>
      </section>

      {/* Motivational Call-To-Action Banner matching Screenshot #1 */}
      <section className="max-w-7xl mx-auto px-6 py-8 w-full mt-auto">
        <div className="bg-gradient-to-r from-[#500713] via-[#701a2b] to-[#8e2137] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs uppercase text-amber-300 font-semibold tracking-wider">
              YOUR GATE JOURNEY
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
              Dreams Don't Work Unless You Do.
            </h3>
            <p className="text-xs text-rose-200 mt-1">
              Let's build your future, together at GSSSIETW.
            </p>
          </div>

          <Link
            to="/login"
            className="bg-amber-300 hover:bg-amber-400 text-stone-900 font-semibold px-6 py-2.5 rounded-full text-xs shadow-lg transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Start Preparing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <InstitutionalFooter className="mt-8" />
    </div>
  );
};
