import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Flame, 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Crosshair, 
  FileCheck2, 
  Sparkles,
  Award,
  AlertCircle,
  Calendar,
  Target,
  X,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getTopicQuote } from '../utils/quotes';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'faculty') {
    return <Navigate to="/faculty" replace />;
  }
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#701a2b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const s = {
    ...stats,
    full_name: user?.full_name || stats?.full_name || "Student",
    greeting: stats?.greeting || "Good day",
    overall_progress: stats?.overall_progress ?? 0,
    questions_attempted: stats?.questions_attempted ?? 0,
    total_questions_pool: stats?.total_questions_pool ?? 0,
    accuracy: stats?.accuracy ?? 0,
    study_streak_days: stats?.study_streak_days ?? 0,
    today_goal_text: stats?.today_goal_text || "Solve 50 questions (Any subject)",
    today_goal_progress: stats?.today_goal_progress ?? 0,
    today_goal_target: stats?.today_goal_target ?? 50,
    subject_progress: stats?.subject_progress || [],
    weak_topics: stats?.weak_topics || [],
    recent_performance: stats?.recent_performance || [],
    continue_learning: stats?.continue_learning || null
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Personalized Welcome Banner matching Screenshot #2 */}
      <div className="relative bg-gradient-to-r from-[#fcf7f7] via-[#f7ebeb] to-[#f3dfdf] rounded-2xl p-6 md:p-8 border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden">
        <div className="space-y-2 z-10 max-w-lg">
          <p className="text-xs text-stone-500 font-medium">
            {s.greeting},
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#500713]">
            {s.full_name}
          </h1>
          <p className="text-sm text-stone-600">
            {getTopicQuote('dashboard_subtitle')}
          </p>
          <p className="font-serif italic text-sm text-[#701a2b] pt-2">
            {getTopicQuote('dashboard_hero')}
          </p>
        </div>

        {/* Banner Right Image + Goal Box */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
          <div className="hidden lg:block w-48 h-36 rounded-xl overflow-hidden shadow-md border-2 border-white shrink-0">
            <img 
              src="/images/gate-student-hero.png" 
              alt="Student" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Today's Goal Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-rose-100 w-full sm:w-72 shrink-0">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                📅 Today's Goal
              </span>
              <button
                type="button"
                onClick={() => setShowPlanModal(true)}
                className="text-[11px] text-[#701a2b] font-semibold cursor-pointer hover:underline flex items-center gap-0.5 bg-rose-50/80 px-2 py-0.5 rounded-md border border-rose-200 hover:bg-rose-100 transition"
              >
                <span>View Plan</span>
                <span className="text-xs">&rarr;</span>
              </button>
            </div>
            <p className="text-xs text-stone-700 font-medium">{s.today_goal_text}</p>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                <span className="italic font-serif text-[#701a2b]">{getTopicQuote('dashboard_goal')}</span>
                <span>{s.today_goal_progress} / {s.today_goal_target}</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div 
                  className="bg-[#701a2b] h-2 rounded-full transition-all"
                  style={{ width: `${(s.today_goal_progress / s.today_goal_target) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Overall Progress + Continue Learning + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Your Overall Progress */}
        <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm flex flex-col justify-between">
          <h3 className="font-serif font-bold text-stone-900 text-base mb-4 flex items-center gap-2">
            <span>Your Overall Progress</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 my-2">
            {/* Donut percentage */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-stone-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#701a2b]"
                  strokeDasharray={`${s.overall_progress}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-bold font-serif text-stone-900">{s.overall_progress}%</span>
                <span className="block text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Completed</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-500 text-[11px] block">Questions Attempted</span>
                <span className="font-bold text-stone-800 text-sm">{s.questions_attempted} / {s.total_questions_pool}</span>
              </div>
              <div>
                <span className="text-stone-500 text-[11px] block">Accuracy</span>
                <span className="font-bold text-stone-800 text-sm">{s.accuracy}%</span>
              </div>
              <div>
                <span className="text-stone-500 text-[11px] block">Study Streak</span>
                <span className="font-bold text-[#701a2b] text-sm flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {s.study_streak_days} days
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/performance"
            className="text-xs text-[#701a2b] font-semibold text-center hover:underline mt-4 pt-3 border-t border-rose-50"
          >
            View Detailed Progress &rarr;
          </Link>
        </div>

        {/* Continue Learning Card */}
        <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#701a2b]" />
              <span>Continue Learning</span>
            </h3>
            <Link to="/learn" className="text-xs text-[#701a2b] hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="bg-[#faf7f5] rounded-xl p-4 border border-rose-100/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                ⚡
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-xs text-stone-900 truncate">
                  {s.continue_learning?.subject || 'Engineering Mathematics'}
                </h4>
                <p className="text-[11px] text-stone-500 truncate">
                  {s.continue_learning?.topic || 'Core Foundations'}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                <span>Progress</span>
                <span>{s.continue_learning?.progress_text || `${s.continue_learning?.progress_pct || 0}%`}</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-1.5">
                <div 
                  className="bg-[#701a2b] h-1.5 rounded-full transition-all"
                  style={{ width: `${s.continue_learning?.progress_pct || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <Link
            to="/learn"
            className="mt-4 bg-[#701a2b] hover:bg-[#500713] text-white py-2.5 rounded-xl text-xs font-semibold text-center shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm flex flex-col justify-between">
          <h3 className="font-serif font-bold text-stone-900 text-base mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Quick Actions</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link
              to="/practice"
              className="p-3 rounded-xl border border-rose-100 hover:border-[#701a2b] hover:bg-rose-50/40 transition group"
            >
              <span className="font-semibold text-stone-800 group-hover:text-[#701a2b] block">
                50 Mixed Questions
              </span>
              <span className="text-[10px] text-stone-500 mt-1 block">All subjects</span>
            </Link>

            <Link
              to="/practice"
              className="p-3 rounded-xl border border-rose-100 hover:border-[#701a2b] hover:bg-rose-50/40 transition group"
            >
              <span className="font-semibold text-stone-800 group-hover:text-[#701a2b] block">
                Subject Practice
              </span>
              <span className="text-[10px] text-stone-500 mt-1 block">Choose a subject</span>
            </Link>

            <Link
              to="/tests"
              className="p-3 rounded-xl border border-rose-100 hover:border-[#701a2b] hover:bg-rose-50/40 transition group"
            >
              <span className="font-semibold text-stone-800 group-hover:text-[#701a2b] block">
                Take a Mock Test
              </span>
              <span className="text-[10px] text-stone-500 mt-1 block">Full simulation</span>
            </Link>

            <Link
              to="/learn"
              className="p-3 rounded-xl border border-rose-100 hover:border-[#701a2b] hover:bg-rose-50/40 transition group"
            >
              <span className="font-semibold text-stone-800 group-hover:text-[#701a2b] block">
                Learn Concepts
              </span>
              <span className="text-[10px] text-stone-500 mt-1 block">Notes & videos</span>
            </Link>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-50 flex items-center justify-between text-[11px] text-stone-500">
            <span>🔥 {s.study_streak_days} day study streak</span>
            <span className="text-[#701a2b] font-medium">{s.study_streak_days > 0 ? "Keep it going!" : "Start your streak today!"}</span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Subject-wise Progress + Weak Topics + Recent Performance matching Screenshot #2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subject-wise Progress */}
        <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Subject-wise Progress</h3>
            <Link to="/subjects" className="text-xs text-[#701a2b] hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {s.subject_progress.map((sp: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-stone-700">
                  <span>{sp.subject}</span>
                  <span className="font-semibold">{sp.progress}%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5">
                  <div 
                    className="bg-[#701a2b] h-1.5 rounded-full"
                    style={{ width: `${sp.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Weak Topics</span>
            </h3>
            <span className="text-[11px] text-stone-500">Focus on these</span>
          </div>

          {s.weak_topics.length === 0 ? (
            <div className="text-center py-8 text-xs text-stone-400">
              <span className="text-lg block mb-1">🎯</span>
              No weak topics detected yet! Practice more questions to get personalized recommendations.
            </div>
          ) : (
            <div className="space-y-3">
              {s.weak_topics.map((wt: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-stone-800">{wt.topic}</div>
                    <div className="text-[10px] text-stone-500">{wt.subject}</div>
                  </div>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {wt.accuracy}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Performance */}
        <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Recent Performance</h3>
            <Link to="/performance" className="text-xs text-[#701a2b] hover:underline">
              View All &rarr;
            </Link>
          </div>

          {s.recent_performance.length === 0 ? (
            <div className="text-center py-8 text-xs text-stone-400">
              <span className="text-lg block mb-1">📝</span>
              No mock tests taken yet. Head to Tests to evaluate your preparation!
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {s.recent_performance.map((rp: any, idx: number) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-stone-800">{rp.test}</div>
                    <div className="text-[10px] text-stone-400">{rp.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-stone-900">{rp.score}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{rp.accuracy}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Motivational Footer Strip matching Screenshot #2 */}
      <div className="bg-[#701a2b] text-white rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-serif italic text-amber-200">
            {getTopicQuote('dashboard_footer')}
          </p>
          <span className="text-[10px] text-rose-200">GATE ECE | GSSSIETW</span>
        </div>
        <Link
          to="/practice"
          className="bg-amber-300 hover:bg-amber-400 text-stone-900 text-xs font-semibold px-4 py-1.5 rounded-full transition cursor-pointer"
        >
          Keep Going &rarr;
        </Link>
      </div>

      {/* Interactive GATE ECE Study Plan & Daily Target Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-rose-100 space-y-5 animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-rose-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#701a2b] flex items-center justify-center font-bold">
                  <Target className="w-5 h-5 text-[#701a2b]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#500713]">
                    Your GATE ECE Preparation Plan
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    GSSSIETW Department of ECE &bull; Daily Targets &amp; Strategic Roadmap
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Today's Goal Progress Box */}
            <div className="bg-gradient-to-r from-rose-50/70 via-stone-50 to-amber-50/40 p-4 rounded-2xl border border-rose-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#701a2b]">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Today's Active Target
                </span>
                <span>{s.today_goal_progress} / {s.today_goal_target} Questions Solved</span>
              </div>
              <p className="text-xs text-stone-700 font-medium">{s.today_goal_text}</p>
              <div className="w-full bg-stone-200/80 rounded-full h-2">
                <div 
                  className="bg-[#701a2b] h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (s.today_goal_progress / s.today_goal_target) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
                <span>Streak: {s.study_streak_days} days uninterrupted</span>
                <span className="font-semibold text-emerald-700">
                  {s.today_goal_progress >= s.today_goal_target ? '✓ Target Achieved Today!' : `${s.today_goal_target - s.today_goal_progress} questions remaining`}
                </span>
              </div>
            </div>

            {/* Weekly Subject Allocation Matrix */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#701a2b]" />
                Recommended Weekly GATE ECE Roadmap
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                  <div className="flex items-center justify-between font-bold text-stone-800">
                    <span>Monday &amp; Tuesday</span>
                    <span className="text-[10px] bg-rose-100 text-[#701a2b] px-2 py-0.5 rounded font-semibold">Core Devices</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Electronic Devices (EDC) &amp; Analog Circuits. 50 practice questions + amplifier derivations.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                  <div className="flex items-center justify-between font-bold text-stone-800">
                    <span>Wednesday &amp; Thursday</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">Signals &amp; Systems</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Network Theory, Signals &amp; Systems, and Control Systems. Focus on Bode plots &amp; Laplace transforms.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                  <div className="flex items-center justify-between font-bold text-stone-800">
                    <span>Friday</span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-semibold">EMFT &amp; Comm</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Electromagnetics (Transmission Lines &amp; Smith Chart) + Digital Communication systems.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                  <div className="flex items-center justify-between font-bold text-stone-800">
                    <span>Saturday</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-semibold">28 Marks High-Yield</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Engineering Mathematics (13 Marks) + General Aptitude (15 Marks). High scoring &amp; rank determining.
                  </p>
                </div>
              </div>

              {/* Sunday Simulation Banner */}
              <div className="p-3.5 bg-[#500713] text-white rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold block text-amber-300">Sunday Full-Length Mock Simulation</span>
                  <span className="text-[11px] text-rose-100">Attempt 1 Full Mock Exam (65 Qs / 3 Hours) &amp; review your mistake log.</span>
                </div>
                <Link
                  to="/tests"
                  onClick={() => setShowPlanModal(false)}
                  className="bg-amber-300 hover:bg-amber-400 text-stone-900 font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 transition"
                >
                  Mock Tests &rarr;
                </Link>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="pt-3 border-t border-rose-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-stone-500">
                GSSSIETW Department of Electronics &amp; Communication Engineering
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-700 rounded-xl text-xs hover:bg-stone-50 transition cursor-pointer"
                >
                  Close
                </button>

                <Link
                  to="/practice"
                  onClick={() => setShowPlanModal(false)}
                  className="bg-[#701a2b] hover:bg-[#500713] text-white px-5 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer flex-1 sm:flex-none"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Start Practice Session Now &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
