import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  PlusCircle, 
  Upload, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Layers, 
  HelpCircle,
  ExternalLink,
  Download,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

interface SubjectItem {
  id: number;
  name: string;
  category?: string;
}

interface TopicItem {
  id: number;
  subject_id: number;
  title: string;
  summary?: string;
}

interface AuthoredQuestion {
  id: number;
  subject_name?: string;
  question_text: string;
  difficulty: string;
  marks?: number;
  correct_answer?: string;
}

interface PublishedResource {
  id: number;
  title: string;
  resource_type: string;
  subject_name?: string;
  author_name: string;
  file_url?: string;
  file_size_mb?: number;
  created_at?: string;
}

export const FacultyPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create_question' | 'upload_resource'>('create_question');

  // Subjects & Topics state (synced from database)
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(true);

  // Question Form state
  const [subjectId, setSubjectId] = useState<number>(1);
  const [topicId, setTopicId] = useState<string>('');
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [questionType, setQuestionType] = useState<string>('MCQ');
  const [marks, setMarks] = useState<number>(1);
  const [questionText, setQuestionText] = useState<string>('');
  const [optA, setOptA] = useState<string>('');
  const [optB, setOptB] = useState<string>('');
  const [optC, setOptC] = useState<string>('');
  const [optD, setOptD] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isSubmittingQ, setIsSubmittingQ] = useState<boolean>(false);

  // Resource Upload state
  const [resTitle, setResTitle] = useState<string>('');
  const [resType, setResType] = useState<string>('Study Notes');
  const [resSubjectId, setResSubjectId] = useState<number>(1);
  const [resTopicId, setResTopicId] = useState<string>('');
  const [resTopics, setResTopics] = useState<TopicItem[]>([]);
  const [loadingResTopics, setLoadingResTopics] = useState<boolean>(false);
  const [resFile, setResFile] = useState<File | null>(null);
  const [isSubmittingRes, setIsSubmittingRes] = useState<boolean>(false);

  // Live collections state
  const [recentQuestions, setRecentQuestions] = useState<AuthoredQuestion[]>([]);
  const [recentResources, setRecentResources] = useState<PublishedResource[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 1. Fetch all subjects on mount (matching student dashboard)
  useEffect(() => {
    const fetchAllSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const res = await api.get('/subjects');
        setSubjects(res.data);
        if (res.data.length > 0) {
          setSubjectId(res.data[0].id);
          setResSubjectId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load subjects', err);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchAllSubjects();
  }, []);

  // 2. Fetch topics when question subject changes
  useEffect(() => {
    if (!subjectId) return;
    const fetchTopicsForSubject = async () => {
      try {
        setLoadingTopics(true);
        const res = await api.get(`/subjects/${subjectId}/topics`);
        setTopics(res.data);
        setTopicId('');
      } catch (err) {
        console.error('Failed to load topics for subject', err);
        setTopics([]);
      } finally {
        setLoadingTopics(false);
      }
    };
    fetchTopicsForSubject();
    fetchRecentQuestions(subjectId);
  }, [subjectId]);

  // 3. Fetch topics when resource subject changes
  useEffect(() => {
    if (!resSubjectId) return;
    const fetchTopicsForResSubject = async () => {
      try {
        setLoadingResTopics(true);
        const res = await api.get(`/subjects/${resSubjectId}/topics`);
        setResTopics(res.data);
        setResTopicId('');
      } catch (err) {
        console.error('Failed to load resource topics', err);
        setResTopics([]);
      } finally {
        setLoadingResTopics(false);
      }
    };
    fetchTopicsForResSubject();
    fetchRecentResources(resSubjectId);
  }, [resSubjectId]);

  // Fetch recent questions for live feedback
  const fetchRecentQuestions = async (subId: number) => {
    try {
      const res = await api.get(`/practice/questions?subject_id=${subId}&limit=6`);
      setRecentQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch recent resources for live feedback
  const fetchRecentResources = async (subId: number) => {
    try {
      const res = await api.get(`/resources?subject_id=${subId}`);
      setRecentResources(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQ(true);
    setFeedback(null);
    try {
      const selectedTopicObj = topics.find((t) => t.id === Number(topicId));
      const topicName = selectedTopicObj ? selectedTopicObj.title : '';

      const payload = {
        subject_id: subjectId,
        topic_id: topicId ? Number(topicId) : null,
        question_text: questionText.trim(),
        question_type: questionType,
        difficulty: difficulty,
        marks: marks,
        options: questionType === 'NAT' ? [] : [optA, optB, optC, optD].filter(Boolean),
        correct_answer: correctAnswer.trim(),
        explanation: explanation.trim(),
        gate_year: 'Faculty Contribution'
      };

      await api.post('/practice/questions', payload);
      setFeedback({
        type: 'success',
        message: `Question successfully saved and published! Students can now practice this question under ${subjects.find(s => s.id === subjectId)?.name}${topicName ? ` → ${topicName}` : ''}.`
      });

      // Reset fields
      setQuestionText('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setCorrectAnswer('');
      setExplanation('');
      fetchRecentQuestions(subjectId);
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to save question. Please check all fields.'
      });
    } finally {
      setIsSubmittingQ(false);
    }
  };

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRes(true);
    setFeedback(null);
    try {
      const selectedResTopic = resTopics.find((t) => t.id === Number(resTopicId));
      const fullTitle = selectedResTopic ? `${resTitle.trim()} [${selectedResTopic.title}]` : resTitle.trim();

      const formData = new FormData();
      formData.append('title', fullTitle);
      formData.append('resource_type', resType);
      formData.append('subject_id', resSubjectId.toString());
      if (resFile) {
        formData.append('file', resFile);
      }

      await api.post('/resources/upload', formData);
      setFeedback({
        type: 'success',
        message: `Resource "${fullTitle}" has been published to the Student Study Library under ${subjects.find(s => s.id === resSubjectId)?.name}!`
      });

      setResTitle('');
      setResFile(null);
      fetchRecentResources(resSubjectId);
    } catch (err: any) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to upload resource.'
      });
    } finally {
      setIsSubmittingRes(false);
    }
  };

  if (user?.role !== 'faculty' && user?.role !== 'admin') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-red-200 text-center space-y-3">
        <ShieldAlert className="w-10 h-10 text-red-600 mx-auto" />
        <h3 className="text-lg font-serif font-bold text-stone-900">Faculty Access Restricted</h3>
        <p className="text-xs text-stone-500">
          This portal is reserved for GSSSIETW Department of ECE Faculty Members.
        </p>
      </div>
    );
  }

  const selectedSubjectName = subjects.find(s => s.id === subjectId)?.name || 'ECE Core';
  const selectedResSubjectName = subjects.find(s => s.id === resSubjectId)?.name || 'ECE Core';

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#500713] via-[#701a2b] to-[#8e2137] text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            GSSSIETW ECE DEPARTMENT &bull; FACULTY PORTAL
          </span>
          <h1 className="text-2xl font-serif font-bold mt-1">Curriculum & Question Bank Management</h1>
          <p className="text-xs text-rose-200 mt-1">
            Author GATE questions, assign syllabus topics, and publish study materials instantly to student portals.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/20 text-xs">
          <span className="text-stone-200 block text-[10px]">Logged in as:</span>
          <span className="font-semibold text-white">{user?.full_name || 'Faculty Member'}</span>
        </div>
      </div>

      {/* 2. Feedback Notification */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border shadow-xs animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-3 text-xs font-medium">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('create_question')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'create_question'
                ? 'bg-[#701a2b] text-white font-semibold shadow-xs'
                : 'bg-white text-stone-600 hover:bg-rose-50 border border-stone-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Author Question (Syllabus Mapped)</span>
          </button>

          <button
            onClick={() => setActiveTab('upload_resource')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'upload_resource'
                ? 'bg-[#701a2b] text-white font-semibold shadow-xs'
                : 'bg-white text-stone-600 hover:bg-rose-50 border border-stone-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Publish Study Material (PDF/Notes)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/practice"
            className="px-3.5 py-2 rounded-xl bg-white text-[#701a2b] border border-rose-200 hover:bg-rose-50 font-semibold transition flex items-center gap-1.5 shadow-2xs"
            title="Browse all questions in the department question bank"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Question Bank</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/resources"
            className="px-3.5 py-2 rounded-xl bg-white text-[#701a2b] border border-rose-200 hover:bg-rose-50 font-semibold transition flex items-center gap-1.5 shadow-2xs"
            title="Browse all published materials in the study resources library"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study Resources</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Tab 1: Create Question Form */}
      {activeTab === 'create_question' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleCreateQuestion}
            className="lg:col-span-8 bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-rose-50 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">New GATE Question Entry</h3>
                <p className="text-[11px] text-stone-500">
                  Questions saved here are instantly published to the Student Portal for Practice & Mock Tests.
                </p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Auto-Publish Active
              </span>
            </div>

            {/* Subject & Topic Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50/70 p-4 rounded-xl border border-stone-200">
              <div>
                <label className="block text-stone-800 font-semibold mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#701a2b]" />
                  <span>Subject ({subjects.length} Available)</span>
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(Number(e.target.value))}
                  disabled={loadingSubjects}
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 font-medium focus:ring-1 focus:ring-[#701a2b]"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} {sub.category ? `(${sub.category})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-800 font-semibold mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#701a2b]" />
                  <span>Topic ({loadingTopics ? 'Loading...' : `${topics.length} in syllabus`})</span>
                </label>
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  disabled={loadingTopics}
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 focus:ring-1 focus:ring-[#701a2b]"
                >
                  <option value="">General Subject Question (No sub-topic)</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question Type, Difficulty & Marks */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Question Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  <option value="MCQ">MCQ (Multiple Choice)</option>
                  <option value="NAT">NAT (Numerical Answer)</option>
                  <option value="MSQ">MSQ (Multiple Select)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  <option value="Easy">Easy (Conceptual)</option>
                  <option value="Medium">Medium (GATE Standard)</option>
                  <option value="Hard">Hard (Multi-step)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Marks</label>
                <select
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  <option value={1}>1 Mark (+1 / -0.33)</option>
                  <option value={2}>2 Marks (+2 / -0.66)</option>
                </select>
              </div>
            </div>

            {/* Question Statement */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Question Statement (Technical Text, Formulas, Values)
              </label>
              <textarea
                required
                rows={4}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="e.g. In a common-emitter BJT amplifier with beta = 100, Vcc = 12V and collector resistance Rc = 2kΩ..."
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#701a2b] font-mono text-xs"
              ></textarea>
            </div>

            {/* Options (Only for MCQ / MSQ) */}
            {questionType !== 'NAT' && (
              <div className="space-y-2">
                <label className="block text-stone-700 font-semibold">Options</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-500 text-[11px] mb-0.5">Option A</label>
                    <input
                      required={questionType !== 'NAT'}
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      placeholder="e.g. 10 Ω"
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 text-[11px] mb-0.5">Option B</label>
                    <input
                      required={questionType !== 'NAT'}
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      placeholder="e.g. 20 Ω"
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 text-[11px] mb-0.5">Option C</label>
                    <input
                      required={questionType !== 'NAT'}
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      placeholder="e.g. 50 Ω"
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 text-[11px] mb-0.5">Option D</label>
                    <input
                      required={questionType !== 'NAT'}
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      placeholder="e.g. 100 Ω"
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Correct Answer */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Exact Correct Answer {questionType !== 'NAT' ? '(Must match one of the options or option text)' : '(Numerical value)'}
              </label>
              <input
                required
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder={questionType === 'NAT' ? 'e.g. 4.25' : 'e.g. 10 Ω or Option A'}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg font-medium"
              />
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Step-by-Step Derivation & Explanation (Shown to students after submission)
              </label>
              <textarea
                required
                rows={3}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="State relevant formulas, intermediate steps, and key principles (e.g. Using KVL around the loop...)"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmittingQ}
              className="bg-[#701a2b] hover:bg-[#500713] text-white px-6 py-3 rounded-xl font-semibold shadow-xs cursor-pointer flex items-center gap-2 transition disabled:opacity-50"
            >
              {isSubmittingQ ? (
                <span>Publishing to Student Bank...</span>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Save to Question Bank & Publish to Students</span>
                </>
              )}
            </button>
          </form>

          {/* Right Column: Information & Preview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#fff9f9] border border-rose-200 rounded-2xl p-5 text-xs space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#701a2b] tracking-wider block">
                🏛️ Institutional Alignment
              </span>
              <h4 className="font-serif font-bold text-stone-900 text-sm">
                Curriculum Integration
              </h4>
              <p className="text-stone-600 leading-relaxed">
                When you save a question, the platform automatically:
              </p>
              <ul className="space-y-2 text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Updates the student practice pool for <strong>{selectedSubjectName}</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Maps to topic-level practice and mock test generation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Evaluates negative marks: <strong>+{marks} / -{marks === 2 ? '0.66' : '0.33'}</strong>.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-5 text-xs shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-stone-900 text-xs">
                  Recently Live in {selectedSubjectName}
                </h4>
                <Link
                  to="/practice"
                  className="text-[10px] text-[#701a2b] font-semibold hover:underline"
                >
                  View in Question Bank &rarr;
                </Link>
              </div>

              {recentQuestions.length === 0 ? (
                <p className="text-stone-400 italic text-[11px]">No questions loaded yet for this subject.</p>
              ) : (
                <div className="space-y-2">
                  {recentQuestions.slice(0, 3).map((q) => (
                    <div key={q.id} className="p-2.5 rounded-lg border border-stone-100 bg-stone-50/50">
                      <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                        <span className="font-semibold text-[#701a2b]">Q#{q.id}</span>
                        <span className="bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-medium">
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-stone-700 line-clamp-2 text-[11px]">{q.question_text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Upload Resource Form */}
      {activeTab === 'upload_resource' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleUploadResource}
            className="lg:col-span-8 bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-rose-50 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">Upload Department Study Material</h3>
                <p className="text-[11px] text-stone-500">
                  Published notes, formula sheets, and lab guides become instantly downloadable in the student library.
                </p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Live Student Library Sync
              </span>
            </div>

            {/* Title */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Resource Title</label>
              <input
                required
                value={resTitle}
                onChange={(e) => setResTitle(e.target.value)}
                placeholder="e.g. Nyquist Stability Criterion & Bode Plots Comprehensive Formula Sheet"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-[#701a2b]"
              />
            </div>

            {/* Subject & Topic for Resource */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50/70 p-4 rounded-xl border border-stone-200">
              <div>
                <label className="block text-stone-800 font-semibold mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#701a2b]" />
                  <span>Target Subject ({subjects.length} Available)</span>
                </label>
                <select
                  value={resSubjectId}
                  onChange={(e) => setResSubjectId(Number(e.target.value))}
                  disabled={loadingSubjects}
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#701a2b]"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-800 font-semibold mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#701a2b]" />
                  <span>Associated Topic ({loadingResTopics ? 'Loading...' : `${resTopics.length} in syllabus`})</span>
                </label>
                <select
                  value={resTopicId}
                  onChange={(e) => setResTopicId(e.target.value)}
                  disabled={loadingResTopics}
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-[#701a2b]"
                >
                  <option value="">Full Subject Overview / General</option>
                  {resTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category / Type */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Resource Category</label>
              <select
                value={resType}
                onChange={(e) => setResType(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
              >
                <option value="Study Notes">Study Notes (Lecture summary, chapter breakdown)</option>
                <option value="Formula Sheets">Formula Sheets (Quick revision, cheat sheets)</option>
                <option value="Previous Year Questions">Previous Year Questions (PYQs solved)</option>
                <option value="Reference Material">Reference Material (Textbook references & standards)</option>
                <option value="Video Lectures">Video Lectures (Lecture notes & links)</option>
              </select>
            </div>

            {/* Attach File */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Attach Document / PDF File</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => setResFile(e.target.files ? e.target.files[0] : null)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#701a2b] file:text-white hover:file:bg-[#500713] cursor-pointer"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Supported formats: PDF, DOCX, PPTX (Max 25 MB). Files are uploaded to the platform's public static assets directory.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmittingRes}
              className="bg-[#701a2b] hover:bg-[#500713] text-white px-6 py-3 rounded-xl font-semibold shadow-xs cursor-pointer flex items-center gap-2 transition disabled:opacity-50"
            >
              {isSubmittingRes ? (
                <span>Publishing to Library...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publish Resource to Student Study Library</span>
                </>
              )}
            </button>
          </form>

          {/* Right Column: Preview of Published Material */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#fff9f9] border border-rose-200 rounded-2xl p-5 text-xs space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#701a2b] tracking-wider block">
                📚 Student Portal Visibility
              </span>
              <h4 className="font-serif font-bold text-stone-900 text-sm">
                Instant Library Publication
              </h4>
              <p className="text-stone-600 leading-relaxed">
                When you publish study material:
              </p>
              <ul className="space-y-2 text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Immediately shows up on the <strong>Student Resources</strong> page.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Filtered under <strong>{selectedResSubjectName}</strong> and <strong>{resType}</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Includes your faculty attribution: <strong>{user?.full_name || 'ECE Faculty'}</strong>.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-5 text-xs shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-stone-900 text-xs">
                  Materials in {selectedResSubjectName}
                </h4>
                <Link
                  to="/resources"
                  className="text-[10px] text-[#701a2b] font-semibold hover:underline"
                >
                  View in Study Resources &rarr;
                </Link>
              </div>

              {recentResources.length === 0 ? (
                <p className="text-stone-400 italic text-[11px]">No resources published yet under this subject.</p>
              ) : (
                <div className="space-y-2">
                  {recentResources.slice(0, 3).map((r) => (
                    <div key={r.id} className="p-2.5 rounded-lg border border-stone-100 bg-stone-50/50 flex items-center justify-between">
                      <div className="truncate max-w-[200px]">
                        <span className="font-medium text-stone-800 text-[11px] block truncate">{r.title}</span>
                        <span className="text-[10px] text-stone-400">{r.resource_type} &bull; {r.file_size_mb || 2.4} MB</span>
                      </div>
                      <a
                        href={r.file_url || '#'}
                        download
                        className="p-1 text-[#701a2b] hover:bg-rose-50 rounded"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
