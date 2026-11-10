import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Flame, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Users,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const PerformancePage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await api.get('/dashboard/performance');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load performance analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-[#701a2b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isBatchView = data?.is_batch_view || user?.role === 'faculty' || user?.role === 'admin';
  const trendData = data?.trend_data || [];
  const subjectPerformance = data?.subject_performance || [];
  const recentTests = data?.recent_tests || [];
  const overallAccuracy = data?.overall_accuracy ?? 0;
  const questionsAttempted = data?.questions_attempted ?? 0;
  const averageTestScore = data?.average_test_score ?? 0;
  const streakDays = data?.streak_days ?? 0;
  const totalStudents = data?.total_students ?? 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-[#fbf5f5] via-[#f7ebeb] to-[#f4dfdf] rounded-2xl p-6 md:p-8 border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden">
        <div className="space-y-2 z-10 max-w-lg">
          <span className="text-xs uppercase font-semibold text-[#8e2137] tracking-wider flex items-center gap-1.5">
            {isBatchView ? <Users className="w-4 h-4" /> : null}
            {isBatchView ? 'BATCH ANALYTICS' : 'PERFORMANCE'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#500713]">
            {isBatchView ? 'ECE Department Batch Analytics' : 'Your Progress, Your Potential'}
          </h1>
          <p className="text-sm text-stone-600">
            {isBatchView
              ? 'Supervise cohort-level accuracy, review curriculum domain mastery, and evaluate student submissions.'
              : 'Track your preparation, understand your strengths, and focus on what matters next.'}
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="w-48 h-32 rounded-xl overflow-hidden shadow-sm border border-rose-200">
            <img 
              src="/images/gate-student-hero.png" 
              alt="Performance Banner" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="font-serif italic text-sm text-[#701a2b]">
            “Small steps every day<br />lead to big results.” ♥
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards (4 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm">
          <div className="text-xs text-stone-500 font-medium">
            {isBatchView ? 'Batch Accuracy' : 'Overall Accuracy'}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-serif text-stone-900">{overallAccuracy}%</span>
            <span className="text-[11px] text-emerald-600 font-semibold">Live</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm">
          <div className="text-xs text-stone-500 font-medium">
            {isBatchView ? 'Questions Solved by Batch' : 'Questions Attempted'}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-serif text-stone-900">{questionsAttempted}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">Live</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm">
          <div className="text-xs text-stone-500 font-medium">
            {isBatchView ? 'Batch Mean Test Score' : 'Average Test Score'}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-serif text-stone-900">{averageTestScore} / 100</span>
            <span className="text-[11px] text-emerald-600 font-semibold">Live</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm">
          <div className="text-xs text-stone-500 font-medium">
            {isBatchView ? 'Enrolled Students' : 'Study Streak'}
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            {isBatchView ? (
              <>
                <span className="text-2xl font-bold font-serif text-[#701a2b] flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-[#701a2b]" />
                  {totalStudents}
                </span>
                <span className="text-[11px] text-stone-400">Aspirants</span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold font-serif text-[#701a2b] flex items-center gap-1">
                  <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                  {streakDays} days
                </span>
                <span className="text-[11px] text-stone-400">{streakDays > 0 ? 'Keep it up!' : 'Start today!'}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Overall Readiness/Cohort Mastery + Subject-wise Performance + Recommended Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cohort / Student Readiness (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-rose-100 shadow-sm flex flex-col justify-between">
          <h3 className="font-serif font-bold text-stone-900 text-sm mb-4">
            {isBatchView ? 'Department GATE Readiness' : 'Overall GATE Readiness'}
          </h3>

          <div className="flex items-center justify-center my-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
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
                  strokeDasharray={`${overallAccuracy}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-bold font-serif text-stone-900">{overallAccuracy}%</span>
                <span className="block text-[10px] uppercase tracking-wider text-stone-500">
                  {isBatchView ? 'Batch Mastery' : 'Preparation Progress'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-rose-50 text-xs">
            <div>
              <span className="font-semibold text-emerald-700 flex items-center gap-1.5 mb-1">
                ✓ Strong Subjects
              </span>
              <p className="text-[11px] text-stone-600 pl-4">
                {subjectPerformance.filter((s: any) => parseInt(s.accuracy) >= 60).map((s: any) => s.subject).slice(0, 3).join(', ') || 'Practice more to establish strong subjects'}
              </p>
            </div>
            <div>
              <span className="font-semibold text-rose-700 flex items-center gap-1.5 mb-1">
                ⚠ Focus Areas
              </span>
              <p className="text-[11px] text-stone-600 pl-4">
                {subjectPerformance.filter((s: any) => parseInt(s.accuracy) < 60 && s.progress > 0).map((s: any) => s.subject).slice(0, 3).join(', ') || 'No critical weak areas detected'}
              </p>
            </div>
          </div>
        </div>

        {/* Subject-wise Performance (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
          <h3 className="font-serif font-bold text-stone-900 text-sm mb-4">
            Subject-wise Performance
          </h3>
          <div className="space-y-3 text-xs">
            {subjectPerformance.map((sp: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-stone-700">
                  <span className="font-medium">{sp.subject}</span>
                  <div className="space-x-3">
                    <span className="text-emerald-700 font-semibold">{sp.accuracy} acc</span>
                    <span className="text-stone-500">{sp.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5">
                  <div 
                    className="bg-[#701a2b] h-1.5 rounded-full transition-all"
                    style={{ width: `${sp.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Callout (3 cols) */}
        <div className="lg:col-span-3 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8e2137]">
              {isBatchView ? 'Faculty Action Hub' : 'Recommended Next Step'}
            </span>
            <h4 className="font-serif font-bold text-stone-900 text-sm mt-2">
              {isBatchView ? 'Review Test Submissions' : 'Daily Practice Routine'}
            </h4>
            <p className="text-xs text-stone-600 mt-2">
              {isBatchView
                ? 'Check student attempt logs and score distributions to identify topics requiring faculty remedial sessions.'
                : 'Strengthen core concepts with targeted 50-question sets and take mock tests to build speed and accuracy.'}
            </p>
          </div>

          <Link
            to={isBatchView ? "/tests" : "/practice"}
            className="mt-6 bg-[#701a2b] hover:bg-[#500713] text-white py-2.5 rounded-xl text-xs font-semibold text-center shadow-xs transition"
          >
            {isBatchView ? 'Inspect Mock Tests & Submissions →' : 'Start Practice Session →'}
          </Link>
        </div>
      </div>

      {/* 4. Bottom Charts & Recent Test Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Trend Chart using Recharts (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">
              📈 {isBatchView ? 'Batch Performance Curve' : 'Performance Trend'}
            </h3>
          </div>

          <div className="h-64 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="test" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    name="Accuracy %" 
                    stroke="#701a2b" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#701a2b', r: 3 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="Score %" 
                    stroke="#f43f5e" 
                    strokeWidth={2} 
                    strokeDasharray="4 4" 
                    dot={{ fill: '#f43f5e', r: 3 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-xs text-stone-400">
                <span className="text-2xl mb-1">📈</span>
                <p>No tests taken yet.</p>
                <p className="text-[11px] mt-1 text-stone-500">Student submissions will appear here once tests are attempted.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Test Performance Table (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">
              {isBatchView ? 'Recent Student Test Submissions' : 'Recent Test Performance'}
            </h3>
            <Link to="/tests" className="text-xs text-[#701a2b] hover:underline">
              {isBatchView ? 'View All Tests & Submissions →' : 'Take Test →'}
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentTests.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf7f5] text-stone-500 font-semibold border-b border-rose-100">
                  <tr>
                    <th className="py-2.5 px-3">{isBatchView ? 'Student & Test' : 'Test Name'}</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentTests.map((rt: any, idx: number) => (
                    <tr key={idx} className="hover:bg-rose-50/20">
                      <td className="py-2.5 px-3 font-medium text-stone-800">{rt.name}</td>
                      <td className="py-2.5 px-3 text-stone-700">{rt.score}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-600">{rt.accuracy}</td>
                      <td className="py-2.5 px-3 text-stone-400">{rt.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-xs text-stone-400">
                <span className="text-xl block mb-2">📑</span>
                No test records found yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
