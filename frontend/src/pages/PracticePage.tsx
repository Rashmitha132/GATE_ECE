import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Flame, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  BookOpen,
  PlusCircle,
  Filter,
  Check,
  FileText,
  Tag,
  Layers,
  X,
  RotateCcw,
  Bookmark
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getTopicQuote } from '../utils/quotes';

export const PracticePage: React.FC = () => {
  const { user } = useAuth();
  const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin';

  // Shared state
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Student mode state
  const [activeFilter, setActiveFilter] = useState<'All' | 'Mixed Practice' | 'Subject Practice' | 'Topic Practice' | 'Saved Questions'>('All');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<any>(null);
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [isPracticeLoading, setIsPracticeLoading] = useState<boolean>(false);
  const [practiceStats, setPracticeStats] = useState<any>(null);
  const [practiceSessionTitle, setPracticeSessionTitle] = useState<string>('Mixed Practice');
  const [practiceSessionSubtitle, setPracticeSessionSubtitle] = useState<string>('All Subjects • 20 Questions');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  // Saved / Bookmarked questions state
  const [savedQuestions, setSavedQuestions] = useState<any[]>([]);
  const [savedLoading, setSavedLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Subject & Topic selector modal state
  const [showMixedModal, setShowMixedModal] = useState<boolean>(false);
  const [showSubjectModal, setShowSubjectModal] = useState<boolean>(false);
  const [showTopicModal, setShowTopicModal] = useState<boolean>(false);
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  // Question count & difficulty state for Mixed Practice
  const [mixedCount, setMixedCount] = useState<number | null>(20);
  const [mixedCustom, setMixedCustom] = useState<string>('20');
  const [isMixedCustom, setIsMixedCustom] = useState<boolean>(false);
  const [totalMixedAvailCount, setTotalMixedAvailCount] = useState<number>(1000);
  const [mixedDifficulty, setMixedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [mixedDiffCounts, setMixedDiffCounts] = useState<{ All: number; Easy: number; Medium: number; Hard: number }>({ All: 0, Easy: 0, Medium: 0, Hard: 0 });

  // Question count & difficulty state for Subject Practice
  const [subjectCount, setSubjectCount] = useState<number | null>(20);
  const [subjectCustom, setSubjectCustom] = useState<string>('20');
  const [isSubjectCustom, setIsSubjectCustom] = useState<boolean>(false);
  const [subjectAvailCount, setSubjectAvailCount] = useState<number>(50);
  const [subjectDifficulty, setSubjectDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [subjectDiffCounts, setSubjectDiffCounts] = useState<{ All: number; Easy: number; Medium: number; Hard: number }>({ All: 0, Easy: 0, Medium: 0, Hard: 0 });

  // Question count & difficulty state for Topic Practice
  const [topicCount, setTopicCount] = useState<number | null>(20);
  const [topicCustom, setTopicCustom] = useState<string>('20');
  const [isTopicCustom, setIsTopicCustom] = useState<boolean>(false);
  const [topicAvailCount, setTopicAvailCount] = useState<number>(50);
  const [topicDifficulty, setTopicDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [topicDiffCounts, setTopicDiffCounts] = useState<{ All: number; Easy: number; Medium: number; Hard: number }>({ All: 0, Easy: 0, Medium: 0, Hard: 0 });

  // Faculty mode state
  const [facultySearch, setFacultySearch] = useState<string>('');
  const [facultySubject, setFacultySubject] = useState<string>('All');
  const [facultyDifficulty, setFacultyDifficulty] = useState<string>('All');
  const [facultyType, setFacultyType] = useState<string>('All');
  const [facultyPage, setFacultyPage] = useState<number>(1);
  const [facultyPageSize, setFacultyPageSize] = useState<number>(25);
  const [bankStats, setBankStats] = useState<{
    total_questions: number;
    subjects_covered: number;
    mcq_count: number;
    msq_count: number;
    nat_count: number;
    advanced_count: number;
    easy_count: number;
    medium_count: number;
    hard_count: number;
    pyq_count: number;
  } | null>(null);

  const fetchBankStats = async () => {
    try {
      const res = await api.get('/practice/bank-stats');
      setBankStats(res.data);
    } catch (err) {
      console.error('Failed to load bank stats', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/practice/stats');
      setPracticeStats(res.data);
    } catch (err) {
      console.error('Failed to load practice stats', err);
    }
  };

  const fetchSavedQuestions = async () => {
    try {
      setSavedLoading(true);
      const res = await api.get('/practice/saved');
      setSavedQuestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load saved questions', err);
    } finally {
      setSavedLoading(false);
    }
  };

  const toggleBookmark = async (questionId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.post(`/practice/saved/${questionId}`);
      if (res.data?.saved) {
        fetchSavedQuestions();
      } else {
        setSavedQuestions((prev) => prev.filter((q) => q.id !== questionId));
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  const isQuestionBookmarked = (qId: number) => savedQuestions.some((q) => q.id === qId);

  const filteredSavedQuestions = savedQuestions.filter((q) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase().trim();
    const qText = (q.question_text || '').toLowerCase();
    const subText = (q.subject_name || '').toLowerCase();
    const topText = (q.topic_title || '').toLowerCase();
    const diffText = (q.difficulty || '').toLowerCase();
    return qText.includes(term) || subText.includes(term) || topText.includes(term) || diffText.includes(term);
  });

  const startPracticeSavedQuestion = (q: any) => {
    setQuestions([q]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSubmittedResult(null);
    setIsCompleted(false);
    setSessionScore({ correct: 0, total: 0 });
    setPracticeSessionTitle('Saved Question Practice');
    setPracticeSessionSubtitle(`${q.subject_name || 'GATE ECE'}${q.topic_title ? ` • ${q.topic_title}` : ''}`);
    setIsPracticing(true);
  };

  const startPracticeAllSaved = () => {
    const listToPractice = filteredSavedQuestions.length > 0 ? filteredSavedQuestions : savedQuestions;
    if (listToPractice.length === 0) return;
    setQuestions(listToPractice);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSubmittedResult(null);
    setIsCompleted(false);
    setSessionScore({ correct: 0, total: 0 });
    setPracticeSessionTitle('Saved Questions Practice');
    setPracticeSessionSubtitle(`Saved Questions • ${listToPractice.length} Questions`);
    setIsPracticing(true);
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      const list = Array.isArray(res.data) ? res.data : [];
      setSubjectsList(list);
      const sumTotal = list.reduce((acc: number, s: any) => acc + (s.questions_count || 0), 0);
      if (sumTotal > 0) {
        setTotalMixedAvailCount(sumTotal);
      }
      if (list.length > 0) {
        setSelectedSubjectId((prev) => prev ?? list[0].id);
        if (list[0].topics && list[0].topics.length > 0) {
          setSelectedTopicId((prev) => prev ?? list[0].topics[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load subjects for practice', err);
    }

    try {
      const countRes = await api.get('/practice/count');
      if (typeof countRes.data?.count === 'number' && countRes.data.count > 0) {
        setTotalMixedAvailCount(countRes.data.count);
      }
    } catch (err) {
      // fallback to sum
    }
  };

  const fetchQuestions = async (subjectId?: number, topicId?: number, limitCount: number = 50, difficulty?: string) => {
    try {
      setLoading(true);
      setIsPracticeLoading(true);
      let url = `/practice/questions?limit=${limitCount}`;
      if (subjectId) url += `&subject_id=${subjectId}`;
      if (topicId) url += `&topic_id=${topicId}`;
      if (difficulty && difficulty !== 'All') url += `&difficulty=${encodeURIComponent(difficulty)}`;
      const res = await api.get(url);
      setQuestions(res.data);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setSubmittedResult(null);
      setIsCompleted(false);
      setSessionScore({ correct: 0, total: 0 });
    } catch (err) {
      console.error('Failed to load practice questions', err);
    } finally {
      setLoading(false);
      setIsPracticeLoading(false);
    }
  };

  useEffect(() => {
    if (isFacultyOrAdmin) {
      fetchBankStats();
      fetchQuestions(undefined, undefined, 2500);
      fetchSubjects();
    } else {
      fetchQuestions();
      fetchSubjects();
      fetchStats();
      fetchSavedQuestions();
    }
  }, [isFacultyOrAdmin]);

  useEffect(() => {
    setFacultyPage(1);
  }, [facultySearch, facultySubject, facultyDifficulty, facultyType, facultyPageSize]);

  useEffect(() => {
    if (activeFilter === 'Saved Questions' && !isFacultyOrAdmin) {
      fetchSavedQuestions();
    }
  }, [activeFilter, isFacultyOrAdmin]);

  const renderQuestionCountPicker = (
    selectedCount: number | null,
    setSelectedCount: (n: number | null) => void,
    _customVal: string,
    _setCustomVal: (s: string) => void,
    _isCustom: boolean,
    _setIsCustom: (b: boolean) => void,
    maxAvailable: number
  ) => {
    const safeMax = Math.max(0, maxAvailable);
    const currentValue = selectedCount && selectedCount >= 1 && selectedCount <= safeMax
      ? selectedCount
      : (safeMax > 0 ? Math.min(20, safeMax) : '');

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-stone-700">
            How many questions would you like to practice?
          </label>
          <span className="text-[11px] font-semibold text-[#8e2137] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
            {safeMax} questions available
          </span>
        </div>

        <div className="relative">
          <select
            value={currentValue}
            disabled={safeMax <= 0}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val >= 1 && val <= safeMax) {
                setSelectedCount(val);
              } else {
                setSelectedCount(null);
              }
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#701a2b] bg-white text-xs text-stone-900 font-semibold cursor-pointer disabled:bg-stone-50 disabled:text-stone-400 shadow-xs"
          >
            {safeMax <= 0 ? (
              <option value="">No questions available</option>
            ) : (
              Array.from({ length: safeMax }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Question' : 'Questions'}{num === safeMax ? ` — All Questions (${safeMax})` : ''}
                </option>
              ))
            )}
          </select>
        </div>

        {safeMax > 0 && (
          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
            <span>Select any question count from 1 to {safeMax}.</span>
            {selectedCount && (
              <span className="font-semibold text-[#701a2b]">
                {selectedCount} {selectedCount === 1 ? 'question' : 'questions'} selected
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const totalPublishedQuestions = totalMixedAvailCount || subjectsList.reduce((acc: number, s: any) => acc + (s.questions_count || 0), 0) || 1000;

  const currentSubjectTopics = subjectsList.find(
    (s: any) => Number(s.id) === Number(selectedSubjectId)
  )?.topics || [];

  // Live count synchronization for Subject Practice (respecting chosen difficulty level)
  useEffect(() => {
    if (!selectedSubjectId) return;
    const url = `/practice/count?subject_id=${selectedSubjectId}${subjectDifficulty !== 'All' ? `&difficulty=${encodeURIComponent(subjectDifficulty)}` : ''}`;
    api.get(url).then((res) => {
      if (typeof res.data?.count === 'number') {
        const liveCount = res.data.count;
        setSubjectAvailCount(liveCount);
        if (res.data?.difficulty_counts) {
          setSubjectDiffCounts(res.data.difficulty_counts);
        }
        setSubjectCount((prev) => {
          if (!prev || prev > liveCount || prev < 1) return liveCount > 0 ? Math.min(liveCount, 20) : null;
          return prev;
        });
      }
    }).catch(() => {});
  }, [selectedSubjectId, subjectDifficulty]);

  // Live count synchronization for Topic Practice (respecting chosen difficulty level)
  useEffect(() => {
    if (!selectedTopicId) return;
    const url = `/practice/count?topic_id=${selectedTopicId}${topicDifficulty !== 'All' ? `&difficulty=${encodeURIComponent(topicDifficulty)}` : ''}`;
    api.get(url).then((res) => {
      if (typeof res.data?.count === 'number') {
        const liveCount = res.data.count;
        setTopicAvailCount(liveCount);
        if (res.data?.difficulty_counts) {
          setTopicDiffCounts(res.data.difficulty_counts);
        }
        setTopicCount((prev) => {
          if (!prev || prev > liveCount || prev < 1) return liveCount > 0 ? Math.min(liveCount, 20) : null;
          return prev;
        });
      }
    }).catch(() => {
      setTopicAvailCount(50);
    });
  }, [selectedTopicId, topicDifficulty]);

  // Live count synchronization for Mixed Practice (respecting chosen difficulty level)
  useEffect(() => {
    const url = `/practice/count${mixedDifficulty !== 'All' ? `?difficulty=${encodeURIComponent(mixedDifficulty)}` : ''}`;
    api.get(url).then((res) => {
      if (typeof res.data?.count === 'number') {
        const liveCount = res.data.count;
        setTotalMixedAvailCount(liveCount);
        if (res.data?.difficulty_counts) {
          setMixedDiffCounts(res.data.difficulty_counts);
        }
        setMixedCount((prev) => {
          if (!prev || prev > liveCount || prev < 1) return liveCount > 0 ? Math.min(liveCount, 20) : null;
          return prev;
        });
      }
    }).catch(() => {});
  }, [mixedDifficulty]);

  const startMixedPractice = (count?: number | null, difficulty: string = 'All') => {
    const qCount = count && count > 0 ? count : 20;
    const diffLabel = difficulty && difficulty !== 'All' ? ` • ${difficulty} Level` : '';
    setPracticeSessionTitle('Mixed Practice');
    setPracticeSessionSubtitle(`All Subjects${diffLabel} • ${qCount} Questions`);
    setShowMixedModal(false);
    setIsPracticing(true);
    fetchQuestions(undefined, undefined, qCount, difficulty);
  };

  const startSubjectPractice = (subjectId: number, subjectName?: string, count?: number | null, difficulty: string = 'All') => {
    const qCount = count && count > 0 ? count : 20;
    const sName = subjectName || subjectsList.find((s: any) => Number(s.id) === Number(subjectId))?.name || 'Selected Subject';
    const diffLabel = difficulty && difficulty !== 'All' ? ` • ${difficulty} Level` : '';
    setPracticeSessionTitle('Subject Practice');
    setPracticeSessionSubtitle(`${sName}${diffLabel} • ${qCount} Questions`);
    setShowSubjectModal(false);
    setIsPracticing(true);
    fetchQuestions(subjectId, undefined, qCount, difficulty);
  };

  const startTopicPractice = (subjectId: number, topicId: number, subjectName?: string, topicTitle?: string, count?: number | null, difficulty: string = 'All') => {
    const qCount = count && count > 0 ? count : 20;
    const sName = subjectName || subjectsList.find((s: any) => Number(s.id) === Number(subjectId))?.name || 'Selected Subject';
    const subObj = subjectsList.find((s: any) => Number(s.id) === Number(subjectId));
    const tTitle = topicTitle || subObj?.topics?.find((t: any) => Number(t.id) === Number(topicId))?.title || 'Selected Topic';
    const diffLabel = difficulty && difficulty !== 'All' ? ` • ${difficulty} Level` : '';
    setPracticeSessionTitle('Topic Practice');
    setPracticeSessionSubtitle(`${sName} • ${tTitle}${diffLabel} • ${qCount} Questions`);
    setShowTopicModal(false);
    setIsPracticing(true);
    fetchQuestions(subjectId, topicId, qCount, difficulty);
  };

  const startContinuePractice = () => {
    if (practiceStats?.continue_left_off) {
      const cont = practiceStats.continue_left_off;
      const matchedSub = subjectsList.find((s: any) => s.name?.toLowerCase() === cont.subject?.toLowerCase());
      if (matchedSub) {
        const matchedTop = matchedSub.topics?.find((t: any) => t.title?.toLowerCase() === cont.topic?.toLowerCase());
        if (matchedTop) {
          setSelectedSubjectId(matchedSub.id);
          setSelectedTopicId(matchedTop.id);
          setShowTopicModal(true);
          return;
        }
        setSelectedSubjectId(matchedSub.id);
        setShowSubjectModal(true);
        return;
      }
    }
    setShowMixedModal(true);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption || !questions[currentQuestionIndex]) return;
    try {
      const res = await api.post('/practice/submit', {
        question_id: questions[currentQuestionIndex].id,
        selected_answer: selectedOption,
        time_taken_seconds: 35
      });
      setSubmittedResult(res.data);
      if (res.data.is_correct) {
        setSessionScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
      } else {
        setSessionScore(prev => ({ ...prev, total: prev.total + 1 }));
      }
      fetchStats(); // live update practice stats immediately
    } catch (err) {
      console.error('Submission failed', err);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setSubmittedResult(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Faculty filtering logic
  const filteredFacultyQuestions = questions.filter((q) => {
    const matchesSearch = 
      facultySearch === '' ||
      q.question_text?.toLowerCase().includes(facultySearch.toLowerCase()) ||
      q.subject_name?.toLowerCase().includes(facultySearch.toLowerCase()) ||
      q.explanation?.toLowerCase().includes(facultySearch.toLowerCase()) ||
      (q.gate_year && q.gate_year.toLowerCase().includes(facultySearch.toLowerCase()));
    
    const matchesSubject = facultySubject === 'All' || q.subject_name === facultySubject;
    const matchesDifficulty = facultyDifficulty === 'All' || q.difficulty === facultyDifficulty;
    const matchesType = facultyType === 'All' || q.question_type === facultyType;

    return matchesSearch && matchesSubject && matchesDifficulty && matchesType;
  });

  const uniqueSubjects = subjectsList.length > 0 
    ? subjectsList.map((s) => s.name).filter(Boolean)
    : Array.from(new Set(questions.map((q) => q.subject_name).filter(Boolean)));

  const totalFacultyFiltered = filteredFacultyQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalFacultyFiltered / facultyPageSize));
  const paginatedFacultyQuestions = filteredFacultyQuestions.slice(
    (facultyPage - 1) * facultyPageSize,
    facultyPage * facultyPageSize
  );

  // ==========================================
  // FACULTY & ADMIN QUESTION BANK REPOSITORY VIEW
  // ==========================================
  if (isFacultyOrAdmin) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-[#fbf5f5] via-[#f7ebeb] to-[#f4dfdf] rounded-2xl p-6 md:p-8 border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden">
          <div className="space-y-2 z-10 max-w-xl">
            <span className="text-xs uppercase font-semibold text-[#8e2137] tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> FACULTY QUESTION REPOSITORY
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#500713]">
              GATE ECE Question Bank & Review
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Supervise the department question pool, verify correct solution keys, inspect step-by-step derivations, and author new GATE test items.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-700">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Answer Keys Visible to Faculty Only
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-[#701a2b]" /> Verified Explanations
              </span>
              <span className="flex items-center gap-1.5 font-medium text-[#701a2b]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Live Database Sync Active
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 z-10">
            <Link
              to="/faculty"
              className="bg-[#701a2b] hover:bg-[#500713] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Author New Question</span>
            </Link>
          </div>
        </div>

        {/* Metric Overview Cards - All Dynamically Synced with Database */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-xs">
            <span className="text-stone-400 text-[11px] block font-medium">Total Questions in Bank</span>
            <strong className="text-2xl font-serif text-stone-900 mt-1 block">
              {bankStats?.total_questions ?? questions.length}
            </strong>
            <span className="text-[10px] text-stone-500 mt-0.5 block">Live in database</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-xs">
            <span className="text-stone-400 text-[11px] block font-medium">ECE Subjects Covered</span>
            <strong className="text-2xl font-serif text-[#701a2b] mt-1 block">
              {bankStats?.subjects_covered ?? uniqueSubjects.length}
            </strong>
            <span className="text-[10px] text-stone-500 mt-0.5 block">Curriculum aligned</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-xs">
            <span className="text-stone-400 text-[11px] block font-medium">Multiple Choice (MCQ)</span>
            <strong className="text-2xl font-serif text-emerald-700 mt-1 block">
              {bankStats?.mcq_count ?? questions.filter(q => q.question_type === 'MCQ').length}
            </strong>
            <span className="text-[10px] text-stone-500 mt-0.5 block">Standard 4-option</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-xs">
            <span className="text-stone-400 text-[11px] block font-medium">Numerical / MSQ</span>
            <strong className="text-2xl font-serif text-amber-700 mt-1 block">
              {bankStats?.advanced_count ?? questions.filter(q => q.question_type !== 'MCQ').length}
            </strong>
            <span className="text-[10px] text-stone-500 mt-0.5 block">
              {bankStats ? `${bankStats.nat_count} NAT • ${bankStats.msq_count} MSQ` : 'Advanced GATE pattern'}
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={facultySearch}
              onChange={(e) => setFacultySearch(e.target.value)}
              placeholder="Search question text or concepts..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#701a2b]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Subject Filter */}
            <select
              value={facultySubject}
              onChange={(e) => setFacultySubject(e.target.value)}
              className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#701a2b]"
            >
              <option value="All">All Subjects ({uniqueSubjects.length})</option>
              {uniqueSubjects.map((sub: any) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={facultyDifficulty}
              onChange={(e) => setFacultyDifficulty(e.target.value)}
              className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#701a2b]"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Question Type Filter */}
            <select
              value={facultyType}
              onChange={(e) => setFacultyType(e.target.value)}
              className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#701a2b]"
            >
              <option value="All">All Types</option>
              <option value="MCQ">MCQ (Multiple Choice)</option>
              <option value="MSQ">MSQ (Multiple Select)</option>
              <option value="NAT">NAT (Numerical Answer)</option>
            </select>

            {/* Page Size Filter */}
            <select
              value={facultyPageSize}
              onChange={(e) => setFacultyPageSize(Number(e.target.value))}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#701a2b]"
            >
              <option value={25}>Show 25 / page</option>
              <option value={50}>Show 50 / page</option>
              <option value={100}>Show 100 / page</option>
              <option value={500}>Show 500 / page</option>
            </select>

            <span className="text-xs text-stone-500 font-medium ml-auto md:ml-2">
              Showing {totalFacultyFiltered === 0 ? 0 : (facultyPage - 1) * facultyPageSize + 1}–{Math.min(facultyPage * facultyPageSize, totalFacultyFiltered)} of {totalFacultyFiltered}
            </span>
          </div>
        </div>

        {/* Question Cards Repository */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="w-8 h-8 border-3 border-[#701a2b] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-stone-500 font-medium">Loading full question bank from database...</p>
          </div>
        ) : paginatedFacultyQuestions.length > 0 ? (
          <div className="space-y-4">
            {paginatedFacultyQuestions.map((q, idx) => {
              const globalIdx = (facultyPage - 1) * facultyPageSize + idx + 1;
              return (
                <div
                  key={q.id || idx}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-xs hover:border-rose-200 transition space-y-4"
                >
                  {/* Meta Badge Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-50 pb-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-[#701a2b] bg-rose-50 px-2.5 py-1 rounded-md text-[11px]">
                        Q{globalIdx} &bull; ID #{q.id}
                      </span>
                      <span className="bg-stone-100 text-stone-700 font-medium px-2.5 py-1 rounded-md text-[11px]">
                        {q.subject_name || 'Core ECE'}
                      </span>
                      {q.topic_title && (
                        <span className="bg-stone-50 border border-stone-200 text-stone-600 px-2 py-0.5 rounded text-[10px]">
                          {q.topic_title}
                        </span>
                      )}
                      <span className="bg-stone-50 border border-stone-200 text-stone-600 px-2 py-0.5 rounded text-[10px] font-medium">
                        {q.question_type || 'MCQ'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' :
                        q.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="text-stone-400 text-[11px]">
                        {q.marks || 1} {q.marks === 1 ? 'Mark' : 'Marks'}
                      </span>
                      {q.gate_year && (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-medium">
                          📜 {q.gate_year}
                        </span>
                      )}
                    </div>

                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Live in Student Bank
                    </span>
                  </div>

                  {/* Question Statement */}
                  <p className="text-sm text-stone-900 font-medium leading-relaxed">
                    {q.question_text}
                  </p>

                  {/* Options List with Highlighted Correct Key (MCQ / MSQ) */}
                  {q.options && q.options.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt: string, optIdx: number) => {
                        const isCorrect = q.correct_answer && opt.trim() === q.correct_answer.trim();
                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between transition ${
                              isCorrect
                                ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold shadow-xs'
                                : 'border-stone-200 bg-stone-50/50 text-stone-700'
                            }`}
                          >
                            <span className="leading-snug">{opt}</span>
                            {isCorrect && (
                              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                                ✓ Correct Key
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Numerical / NAT Answer Display */
                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs flex items-center justify-between">
                      <span className="text-amber-900 font-medium">Numerical Answer Type (NAT) Key:</span>
                      <span className="bg-emerald-600 text-white font-mono font-bold px-3 py-1 rounded-lg">
                        Exact Value: {q.correct_answer}
                      </span>
                    </div>
                  )}

                  {/* Step-by-Step Explanation Block */}
                  {q.explanation && (
                    <div className="p-3.5 bg-gradient-to-r from-stone-50 to-rose-50/30 rounded-xl border border-stone-200/80 text-xs space-y-1 mt-2">
                      <span className="font-semibold text-stone-900 flex items-center gap-1.5 text-[11px]">
                        <BookOpen className="w-3.5 h-3.5 text-[#701a2b]" />
                        Step-by-Step Derivation & Solution:
                      </span>
                      <p className="text-stone-600 leading-relaxed font-sans whitespace-pre-line pl-5">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-stone-500">
                  Page <strong>{facultyPage}</strong> of <strong>{totalPages}</strong> ({totalFacultyFiltered} filtered items)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFacultyPage((prev) => Math.max(1, prev - 1))}
                    disabled={facultyPage === 1}
                    className="px-3.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition cursor-pointer"
                  >
                    &larr; Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 5 && facultyPage > 3) {
                        pageNum = Math.min(totalPages - 4 + i, Math.max(1, facultyPage - 2 + i));
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setFacultyPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            facultyPage === pageNum
                              ? 'bg-[#701a2b] text-white shadow-2xs'
                              : 'bg-stone-50 text-stone-700 hover:bg-rose-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setFacultyPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={facultyPage === totalPages}
                    className="px-3.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition cursor-pointer"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-rose-100 shadow-xs space-y-3">
            <span className="text-3xl block">🔍</span>
            <h3 className="font-serif font-bold text-stone-800 text-base">No questions match your filter</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Try adjusting your search query, or clear the subject/difficulty filter to view all questions.
            </p>
            <button
              onClick={() => {
                setFacultySearch('');
                setFacultySubject('All');
                setFacultyDifficulty('All');
                setFacultyType('All');
              }}
              className="text-xs font-semibold text-[#701a2b] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // STUDENT PRACTICE VIEW
  // ==========================================
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Sharpen Your Concepts Banner matching Screenshot #5 */}
      <div className="relative bg-gradient-to-r from-[#fbf5f5] via-[#f7ebeb] to-[#f4dfdf] rounded-2xl p-6 md:p-8 border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden">
        <div className="space-y-2 z-10 max-w-lg">
          <span className="text-xs uppercase font-semibold text-[#8e2137] tracking-wider">
            PRACTICE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#500713]">
            Sharpen Your Concepts
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Choose how you want to practice — mixed practice, subject-wise practice or topic-wise practice.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-stone-700">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#701a2b]" /> Build Accuracy
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#701a2b]" /> Improve Speed
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#701a2b]" /> Identify Weak Topics
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="w-48 h-32 rounded-xl overflow-hidden shadow-sm border border-rose-200">
            <img 
              src="/images/gate-student-hero.png" 
              alt="Practice Banner" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="font-serif italic text-sm text-[#701a2b]">
            {getTopicQuote('practice')}
          </div>
        </div>
      </div>

      {/* 2. Practice Modes Bar & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Mixed Practice', 'Subject Practice', 'Topic Practice', 'Saved Questions'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setActiveFilter(mode);
                if (mode === 'Subject Practice') {
                  fetchSubjects();
                  setShowSubjectModal(true);
                } else if (mode === 'Topic Practice') {
                  fetchSubjects();
                  setShowTopicModal(true);
                } else if (mode === 'Mixed Practice') {
                  fetchSubjects();
                  setShowMixedModal(true);
                }
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === mode
                  ? 'bg-[#701a2b] text-white shadow-xs'
                  : 'bg-white border border-rose-100 text-stone-600 hover:bg-rose-50'
              }`}
            >
              {mode === 'Saved Questions' && (
                <Bookmark className={`w-3 h-3 ${activeFilter === mode ? 'fill-white text-white' : 'text-stone-500'}`} />
              )}
              <span>{mode}</span>
              {mode === 'Saved Questions' && savedQuestions.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeFilter === mode ? 'bg-white/20 text-white' : 'bg-rose-100 text-[#701a2b]'
                }`}>
                  {savedQuestions.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeFilter === 'Saved Questions' ? "Search saved questions..." : "Search practice sets..."}
            className="w-full pl-9 pr-8 py-2 bg-white border border-rose-100 rounded-full text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#701a2b]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Interactive Practice Session Modal / Active View if Student is Practicing */}
      {isPracticing ? (
        isPracticeLoading ? (
          <div className="bg-white rounded-2xl p-12 border border-rose-100 shadow-sm text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#701a2b] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-medium text-stone-700">Loading syllabus practice questions...</p>
            <p className="text-xs text-stone-400">{practiceSessionTitle} &bull; {practiceSessionSubtitle}</p>
          </div>
        ) : isCompleted ? (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-rose-200 shadow-lg text-center space-y-6 animate-in fade-in duration-200">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-xs">
              🎉
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8e2137]">
                Practice Session Completed
              </span>
              <h2 className="font-serif font-bold text-2xl text-stone-900 mt-1">
                Great Job Practicing!
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {practiceSessionTitle} &bull; {practiceSessionSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 max-w-xl mx-auto">
              <div className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-center">
                <span className="text-[10px] text-stone-500 block uppercase font-semibold">Total Questions</span>
                <span className="text-lg font-bold text-stone-800">{questions.length}</span>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-center">
                <span className="text-[10px] text-[#8e2137] block uppercase font-semibold">Attempted</span>
                <span className="text-lg font-bold text-[#701a2b]">{sessionScore.total}</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-center">
                <span className="text-[10px] text-emerald-700 block uppercase font-semibold">Correct</span>
                <span className="text-lg font-bold text-emerald-700">{sessionScore.correct}</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-center">
                <span className="text-[10px] text-amber-700 block uppercase font-semibold">Accuracy</span>
                <span className="text-lg font-bold text-amber-800">
                  {sessionScore.total > 0 ? Math.round((sessionScore.correct / sessionScore.total) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-xs text-stone-600 pt-1">
              <span>Incorrect: <strong className="text-rose-600">{sessionScore.total - sessionScore.correct}</strong></span>
              <span>&bull;</span>
              <span>Unanswered: <strong className="text-stone-700">{Math.max(0, questions.length - sessionScore.total)}</strong></span>
              <span>&bull;</span>
              <span>Final Score: <strong className="text-[#701a2b]">{sessionScore.correct} / {questions.length}</strong></span>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setIsPracticing(false);
                  setIsCompleted(false);
                  fetchStats();
                }}
                className="bg-[#701a2b] hover:bg-[#500713] text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Return to Practice Hub &rarr;
              </button>
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-rose-100 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-[#701a2b] rounded-full flex items-center justify-center mx-auto text-xl font-bold">!</div>
            <h3 className="font-serif font-bold text-lg text-stone-900">No Questions Found</h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              No questions found for {practiceSessionSubtitle}. Try choosing another topic or subject.
            </p>
            <button
              onClick={() => setIsPracticing(false)}
              className="bg-[#701a2b] hover:bg-[#500713] text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              Back to Practice Hub
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-200 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-rose-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-semibold text-[#8e2137]">
                    {practiceSessionTitle}
                  </span>
                  {practiceSessionSubtitle && (
                    <span className="text-xs text-stone-500 font-medium">
                      &bull; {practiceSessionSubtitle}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Question {currentQuestionIndex + 1} of {questions.length} &bull; {questions[currentQuestionIndex].difficulty} &bull; {questions[currentQuestionIndex].marks} Marks
                  </h3>
                  {questions[currentQuestionIndex]?.gate_year && (
                    <span className="rounded-md bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-xs font-semibold text-amber-800">
                      📜 {questions[currentQuestionIndex].gate_year}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {questions[currentQuestionIndex]?.id && (
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(questions[currentQuestionIndex].id, e)}
                    title={isQuestionBookmarked(questions[currentQuestionIndex].id) ? "Remove Bookmark" : "Save Question"}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                      isQuestionBookmarked(questions[currentQuestionIndex].id)
                        ? 'border-[#701a2b] bg-rose-50 text-[#701a2b]'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-rose-300'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isQuestionBookmarked(questions[currentQuestionIndex].id) ? 'fill-[#701a2b] text-[#701a2b]' : 'text-stone-500'}`} />
                    <span>{isQuestionBookmarked(questions[currentQuestionIndex].id) ? 'Saved' : 'Save'}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsPracticing(false)}
                  className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  Exit Practice
                </button>
              </div>
            </div>

            {/* Session Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-medium text-stone-500">
                <span>Progress: Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="font-semibold text-[#701a2b]">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Completed
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#8e2137] to-[#701a2b] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%` }}
                />
              </div>
            </div>

            <p className="text-sm text-stone-800 leading-relaxed font-medium">
              {questions[currentQuestionIndex].question_text}
            </p>

            {(!questions[currentQuestionIndex].options || questions[currentQuestionIndex].options.length === 0) ? (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700">Enter your numerical answer:</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    disabled={!!submittedResult}
                    value={selectedOption || ''}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    placeholder="e.g. 2.5"
                    className="w-full sm:w-64 px-4 py-2.5 rounded-xl border-2 border-stone-200 focus:border-[#701a2b] focus:outline-none text-xs text-stone-900 font-mono"
                  />
                  {submittedResult && (
                    <span className={`text-xs font-bold ${submittedResult.is_correct ? 'text-emerald-600' : 'text-red-600'}`}>
                      {submittedResult.is_correct ? '✓ Correct Answer' : `Correct: ${submittedResult.correct_answer}`}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {questions[currentQuestionIndex].options?.map((opt: string, idx: number) => {
                  const isSelected = selectedOption === opt;
                  let optionStyle = "border-stone-200 hover:border-rose-300";
                  if (submittedResult) {
                    if (opt === submittedResult.correct_answer) {
                      optionStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-900 font-semibold";
                    } else if (isSelected && !submittedResult.is_correct) {
                      optionStyle = "border-red-500 bg-red-50/50 text-red-900";
                    }
                  } else if (isSelected) {
                    optionStyle = "border-[#701a2b] bg-rose-50 text-[#701a2b] font-medium";
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => !submittedResult && setSelectedOption(opt)}
                      className={`p-3.5 rounded-xl border-2 text-xs flex items-center justify-between transition cursor-pointer ${optionStyle}`}
                    >
                      <span>{opt}</span>
                      {submittedResult && opt === submittedResult.correct_answer && (
                        <span className="text-emerald-600 font-bold">✓ Correct</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {submittedResult && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <strong className="text-stone-900 block">Explanation:</strong>
                <p className="text-stone-600">{submittedResult.explanation}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-rose-50">
              {!submittedResult ? (
                <button
                  disabled={!selectedOption}
                  onClick={handleSubmitAnswer}
                  className="bg-[#701a2b] hover:bg-[#500713] text-white px-6 py-2.5 rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish Practice →'}
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        /* Regular Student Practice Page Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Cards Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {activeFilter === 'Saved Questions' ? (
              /* DEDICATED SAVED QUESTIONS VIEW */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-5 border border-rose-100 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-[#701a2b] fill-[#701a2b]" />
                      <h2 className="font-serif font-bold text-lg sm:text-xl text-[#500713]">
                        Saved Questions
                      </h2>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-[#701a2b] border border-rose-100">
                        {savedQuestions.length} saved
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Your personally bookmarked GATE ECE practice questions for targeted revision.
                    </p>
                  </div>
                  {savedQuestions.length > 0 && (
                    <button
                      type="button"
                      onClick={startPracticeAllSaved}
                      className="bg-[#701a2b] hover:bg-[#500713] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition shrink-0 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Practice All ({filteredSavedQuestions.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {savedLoading ? (
                  <div className="bg-white rounded-2xl p-12 border border-rose-100 shadow-sm text-center">
                    <div className="w-8 h-8 border-3 border-[#701a2b] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs text-stone-500">Loading your saved questions...</p>
                  </div>
                ) : savedQuestions.length === 0 ? (
                  /* Friendly Empty State */
                  <div className="bg-white rounded-2xl p-10 sm:p-12 border border-rose-100 shadow-sm text-center space-y-4">
                    <div className="w-16 h-16 bg-rose-50 text-[#701a2b] rounded-full flex items-center justify-center mx-auto shadow-xs">
                      <Bookmark className="w-8 h-8 text-[#701a2b]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-lg text-stone-900">
                        No saved questions yet
                      </h3>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                        Bookmark questions while practicing to find them here.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveFilter('All')}
                        className="bg-[#701a2b] hover:bg-[#500713] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                      >
                        Browse Practice Questions &rarr;
                      </button>
                    </div>
                  </div>
                ) : filteredSavedQuestions.length === 0 ? (
                  /* Search Filter Empty State */
                  <div className="bg-white rounded-2xl p-8 border border-rose-100 shadow-sm text-center space-y-3">
                    <p className="text-sm font-semibold text-stone-800">
                      No saved questions matched "{searchQuery}"
                    </p>
                    <p className="text-xs text-stone-500">
                      Try searching for a different keyword or clear your search query.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-[#701a2b] font-semibold hover:underline cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  /* Saved Questions Card List */
                  <div className="space-y-4">
                    {filteredSavedQuestions.map((q, idx) => (
                      <div
                        key={q.id || idx}
                        className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-xs hover:border-rose-200 transition space-y-3"
                      >
                        {/* Meta badge row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-50 pb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-xs bg-rose-50 text-[#701a2b] px-2.5 py-1 rounded-md">
                              {q.subject_name || 'Core ECE'}
                            </span>
                            {q.topic_title && (
                              <span className="text-stone-600 bg-stone-100 font-medium px-2.5 py-1 rounded-md text-[11px]">
                                {q.topic_title}
                              </span>
                            )}
                            {q.difficulty && (
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                                  q.difficulty === 'Easy'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : q.difficulty === 'Hard'
                                    ? 'bg-rose-50 text-rose-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {q.difficulty}
                              </span>
                            )}
                            {q.marks && (
                              <span className="text-stone-400 text-[11px]">
                                &bull; {q.marks} Mark{q.marks > 1 ? 's' : ''}
                              </span>
                            )}
                            {q.gate_year && (
                              <span className="rounded-md bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                                📜 {q.gate_year}
                              </span>
                            )}
                          </div>

                          {/* Bookmark control to unsave */}
                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(q.id, e)}
                            title="Remove from saved questions"
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#701a2b] hover:bg-rose-50 transition cursor-pointer border border-rose-200"
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-[#701a2b] text-[#701a2b]" />
                            <span className="text-[11px]">Saved</span>
                          </button>
                        </div>

                        {/* Question text */}
                        <p className="text-sm text-stone-800 font-medium leading-relaxed">
                          {q.question_text}
                        </p>

                        {/* Options preview (if MCQ) */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt: string, oIdx: number) => (
                              <div
                                key={oIdx}
                                className="px-3 py-2 rounded-lg bg-stone-50 border border-stone-100 text-xs text-stone-700"
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action row */}
                        <div className="flex items-center justify-between pt-2 border-t border-rose-50">
                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(q.id, e)}
                            className="text-stone-400 hover:text-rose-700 text-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Remove from saved</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => startPracticeSavedQuestion(q)}
                            className="bg-[#701a2b] hover:bg-[#500713] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Practice Question</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* STANDARD PRACTICE CARDS */
              <>
                {/* Top 3 Practice Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Recommended Mixed Practice */}
                  <div className="bg-gradient-to-br from-[#701a2b] to-[#500713] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="bg-white/20 text-amber-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full inline-block mb-3">
                        ✦ Recommended for you
                      </span>
                      <h3 className="font-serif font-bold text-base">Mixed Practice</h3>
                      <p className="text-xs text-rose-200 mt-1">All subjects &bull; 1 to {totalPublishedQuestions} questions</p>
                      <p className="text-[11px] text-rose-300 mt-2">⏱ Flexible time | 🎯 Medium</p>
                    </div>
                    <button
                      onClick={() => {
                        fetchSubjects();
                        setShowMixedModal(true);
                      }}
                      className="mt-6 bg-white hover:bg-rose-50 text-[#701a2b] font-semibold py-2 rounded-xl text-xs transition text-center cursor-pointer"
                    >
                      Start Practice &rarr;
                    </button>
                  </div>

                  {/* Subject Practice */}
                  <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#701a2b] flex items-center justify-center font-bold text-sm mb-3">
                        📚
                      </div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Subject Practice</h3>
                      <p className="text-xs text-stone-500 mt-1">Choose a subject and practice subject-wise questions.</p>
                    </div>
                    <button
                      onClick={() => {
                        fetchSubjects();
                        setShowSubjectModal(true);
                      }}
                      className="mt-6 bg-[#701a2b] hover:bg-[#500713] text-white font-semibold py-2 rounded-xl text-xs transition text-center cursor-pointer"
                    >
                      Start Subject &rarr;
                    </button>
                  </div>

                  {/* Topic Practice */}
                  <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#701a2b] flex items-center justify-center font-bold text-sm mb-3">
                        🎯
                      </div>
                      <h3 className="font-serif font-bold text-base text-stone-900">Topic Practice</h3>
                      <p className="text-xs text-stone-500 mt-1">Focus on specific topics and strengthen your concepts.</p>
                    </div>
                    <button
                      onClick={() => {
                        fetchSubjects();
                        setShowTopicModal(true);
                      }}
                      className="mt-6 bg-[#701a2b] hover:bg-[#500713] text-white font-semibold py-2 rounded-xl text-xs transition text-center cursor-pointer"
                    >
                      Choose Topic &rarr;
                    </button>
                  </div>
                </div>

                {/* Continue Where You Left Off */}
                <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-50 text-[#701a2b] flex items-center justify-center font-bold">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-stone-400">
                        Continue Where You Left Off
                      </span>
                      <h4 className="font-serif font-bold text-stone-900 text-sm">
                        {practiceStats?.continue_left_off?.subject || 'Core Subjects'} &bull; Ready to practice
                      </h4>
                      <p className="text-xs text-stone-500">
                        Topic: {practiceStats?.continue_left_off?.topic || 'General Practice Sets'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={startContinuePractice}
                    className="bg-[#701a2b] hover:bg-[#500713] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition shrink-0 cursor-pointer"
                  >
                    Continue Practice &rarr;
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Statistics & Recent Activity Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Your Practice Stats */}
            <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm">
              <h3 className="font-serif font-bold text-stone-900 text-xs mb-3">
                📊 Your Practice Stats
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 text-[10px] block">Total Questions</span>
                  <strong className="text-stone-900 text-base">{practiceStats?.total_questions ?? 0}</strong>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900">
                  <span className="text-emerald-600 text-[10px] block">Correct Answers</span>
                  <strong className="text-base">{practiceStats?.correct_answers ?? 0}</strong>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl text-[#701a2b]">
                  <span className="text-rose-600 text-[10px] block">Accuracy</span>
                  <strong className="text-base">{practiceStats?.accuracy ?? 0}%</strong>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 text-[10px] block">Time Spent</span>
                  <strong className="text-stone-900 text-base">{practiceStats?.time_spent || '0 mins'}</strong>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-bold text-stone-900 text-xs">Recent Activity</h3>
              </div>
              {practiceStats?.recent_activity?.length > 0 ? (
                <div className="divide-y divide-stone-100 text-xs">
                  {practiceStats.recent_activity.map((ra: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-stone-800">{ra.title}</div>
                        <div className="text-[10px] text-stone-400">{ra.date}</div>
                      </div>
                      <span className={`font-bold text-[11px] ${ra.is_correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {ra.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-stone-400">
                  No practice attempts yet today. Click on any practice mode to start!
                </div>
              )}
            </div>

            {/* Motivational Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 text-center">
              <p className="font-serif italic text-xs text-[#701a2b]">
                {getTopicQuote('practice', 1)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MIXED PRACTICE COUNT SELECTION MODAL       */}
      {/* ========================================== */}
      {showMixedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-rose-100 animate-in fade-in duration-150 space-y-5">
            <div className="flex items-start justify-between border-b border-rose-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e2137] flex items-center gap-1.5">
                  ✦ MIXED PRACTICE
                </span>
                <h2 className="text-xl font-serif font-bold text-[#500713] mt-0.5">
                  How many questions would you like to practice?
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Practice mixed syllabus questions across all GATE ECE subjects.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMixedModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Question Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map((lvl) => {
                    const count = mixedDiffCounts[lvl] ?? (lvl === 'All' ? totalMixedAvailCount : 0);
                    const isSelected = mixedDifficulty === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setMixedDifficulty(lvl)}
                        className={`py-2 px-1.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'border-[#701a2b] bg-rose-50 text-[#701a2b] font-bold ring-2 ring-[#701a2b]/20 shadow-xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-rose-300 hover:bg-rose-50/30'
                        }`}
                      >
                        <span className="text-xs font-semibold">{lvl === 'All' ? 'All Levels' : lvl}</span>
                        <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#8e2137]' : 'text-stone-400'}`}>
                          {count} Qs
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {renderQuestionCountPicker(
                mixedCount,
                setMixedCount,
                mixedCustom,
                setMixedCustom,
                isMixedCustom,
                setIsMixedCustom,
                totalPublishedQuestions
              )}

              <div className="bg-rose-50/60 rounded-xl p-3.5 border border-rose-100/70 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#701a2b]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Comprehensive Cross-Subject Coverage
                </div>
                <p className="text-[11px] text-stone-500">
                  Questions are randomly sampled across all official GATE ECE subjects with instant grading and step-by-step derivations.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-50">
              <button
                type="button"
                onClick={() => setShowMixedModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl border border-stone-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!mixedCount || mixedCount <= 0 || isPracticeLoading}
                onClick={() => startMixedPractice(mixedCount, mixedDifficulty)}
                className="bg-[#701a2b] hover:bg-[#500713] text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                {isPracticeLoading ? 'Loading Questions...' : `Start Practice (${mixedCount || 0} Questions) →`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUBJECT PRACTICE MODAL                     */}
      {/* ========================================== */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-rose-100 animate-in fade-in duration-150 space-y-5">
            <div className="flex items-start justify-between border-b border-rose-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e2137] flex items-center gap-1.5">
                  📚 SUBJECT PRACTICE
                </span>
                <h2 className="text-xl font-serif font-bold text-[#500713] mt-0.5">
                  Select Subject to Practice
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Choose a subject and select how many questions to attempt.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSubjectModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Target Subject
                </label>
                <select
                  value={selectedSubjectId || ''}
                  onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#701a2b] bg-white text-xs text-stone-900 font-medium"
                >
                  {subjectsList.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({typeof sub.questions_count === 'number' ? sub.questions_count : 0} questions available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Question Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map((lvl) => {
                    const count = subjectDiffCounts[lvl] ?? (lvl === 'All' ? subjectAvailCount : 0);
                    const isSelected = subjectDifficulty === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSubjectDifficulty(lvl)}
                        className={`py-2 px-1.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'border-[#701a2b] bg-rose-50 text-[#701a2b] font-bold ring-2 ring-[#701a2b]/20 shadow-xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-rose-300 hover:bg-rose-50/30'
                        }`}
                      >
                        <span className="text-xs font-semibold">{lvl === 'All' ? 'All Levels' : lvl}</span>
                        <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#8e2137]' : 'text-stone-400'}`}>
                          {count} Qs
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {renderQuestionCountPicker(
                subjectCount,
                setSubjectCount,
                subjectCustom,
                setSubjectCustom,
                isSubjectCustom,
                setIsSubjectCustom,
                subjectAvailCount
              )}

              <div className="bg-rose-50/60 rounded-xl p-3.5 border border-rose-100/70 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#701a2b]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Strictly Syllabus-Aligned Questions
                </div>
                <p className="text-[11px] text-stone-500">
                  Questions are curated directly from the chosen GATE ECE subject curriculum with instant grading and explanations.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-50">
              <button
                type="button"
                onClick={() => setShowSubjectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl border border-stone-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedSubjectId || !subjectCount || subjectCount <= 0 || subjectCount > subjectAvailCount || isPracticeLoading}
                onClick={() => {
                  const sub = subjectsList.find((s: any) => Number(s.id) === Number(selectedSubjectId));
                  startSubjectPractice(Number(selectedSubjectId), sub?.name || 'Selected Subject', subjectCount, subjectDifficulty);
                }}
                className="bg-[#701a2b] hover:bg-[#500713] text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                {isPracticeLoading ? 'Loading Questions...' : `Start Practice (${subjectCount || 0} Questions) →`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TOPIC PRACTICE MODAL                       */}
      {/* ========================================== */}
      {showTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-rose-100 animate-in fade-in duration-150 space-y-5">
            <div className="flex items-start justify-between border-b border-rose-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e2137] flex items-center gap-1.5">
                  🎯 TOPIC PRACTICE
                </span>
                <h2 className="text-xl font-serif font-bold text-[#500713] mt-0.5">
                  Select Topic to Practice
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Focus on specific topics and choose how many questions to attempt.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTopicModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  1. Choose Subject
                </label>
                <select
                  value={selectedSubjectId || ''}
                  onChange={(e) => {
                    const subId = Number(e.target.value);
                    setSelectedSubjectId(subId);
                    const sub = subjectsList.find((s: any) => Number(s.id) === subId);
                    if (sub && sub.topics && sub.topics.length > 0) {
                      setSelectedTopicId(sub.topics[0].id);
                    } else {
                      setSelectedTopicId(null);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#701a2b] bg-white text-xs text-stone-900 font-medium"
                >
                  {subjectsList.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  2. Choose Topic
                </label>
                <select
                  value={selectedTopicId || ''}
                  onChange={(e) => setSelectedTopicId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#701a2b] bg-white text-xs text-stone-900 font-medium"
                >
                  {currentSubjectTopics.map((top: any) => (
                    <option key={top.id} value={top.id}>
                      {top.title} {typeof top.questions_count === 'number' ? `(${top.questions_count} Qs)` : ''}
                    </option>
                  ))}
                </select>
                {currentSubjectTopics.length === 0 && (
                  <p className="text-[11px] text-amber-700 mt-1">Loading topics for this subject...</p>
                )}
              </div>

              {currentSubjectTopics.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Question Level
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map((lvl) => {
                      const count = topicDiffCounts[lvl] ?? (lvl === 'All' ? topicAvailCount : 0);
                      const isSelected = topicDifficulty === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setTopicDifficulty(lvl)}
                          className={`py-2 px-1.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? 'border-[#701a2b] bg-rose-50 text-[#701a2b] font-bold ring-2 ring-[#701a2b]/20 shadow-xs'
                              : 'border-stone-200 bg-white text-stone-700 hover:border-rose-300 hover:bg-rose-50/30'
                          }`}
                        >
                          <span className="text-xs font-semibold">{lvl === 'All' ? 'All Levels' : lvl}</span>
                          <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#8e2137]' : 'text-stone-400'}`}>
                            {count} Qs
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {topicAvailCount > 0 ? (
                renderQuestionCountPicker(
                  topicCount,
                  setTopicCount,
                  topicCustom,
                  setTopicCustom,
                  isTopicCustom,
                  setIsTopicCustom,
                  topicAvailCount
                )
              ) : (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
                  <span className="font-semibold block">⚠️ No questions currently published for this topic.</span>
                  <p className="text-[11px] text-amber-700">Please choose another topic or practice the full subject.</p>
                </div>
              )}

              <div className="bg-rose-50/60 rounded-xl p-3.5 border border-rose-100/70 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#701a2b]">
                  <Sparkles className="w-3.5 h-3.5" /> Conceptual Drill-down
                </div>
                <p className="text-[11px] text-stone-500">
                  Practice focused questions on this exact topic to master fundamental formulas and GATE problem patterns.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-50">
              <button
                type="button"
                onClick={() => setShowTopicModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl border border-stone-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedTopicId || topicAvailCount === 0 || !topicCount || topicCount <= 0 || topicCount > topicAvailCount || isPracticeLoading}
                onClick={() => {
                  const sub = subjectsList.find((s: any) => Number(s.id) === Number(selectedSubjectId));
                  const top = currentSubjectTopics.find((t: any) => Number(t.id) === Number(selectedTopicId));
                  startTopicPractice(
                    Number(selectedSubjectId),
                    Number(selectedTopicId),
                    sub?.name || 'Selected Subject',
                    top?.title || 'Selected Topic',
                    topicCount,
                    topicDifficulty
                  );
                }}
                className="bg-[#701a2b] hover:bg-[#500713] text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                {isPracticeLoading ? 'Loading Questions...' : `Start Practice (${topicCount || 0} Questions) →`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
