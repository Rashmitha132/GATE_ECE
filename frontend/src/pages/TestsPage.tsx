import React, { useCallback, useEffect, useState } from 'react';
import {
  FileCheck2,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Eye,
  PlusCircle,
  Users,
  X,
  BookOpen,
  Bookmark,
  RotateCcw,
  Check,
  CheckCircle,
  XCircle,
  MinusCircle,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getTopicQuote } from '../utils/quotes';

type Question = {
  id: number;
  question_text: string;
  question_type?: 'MCQ' | 'MSQ' | 'NAT' | string;
  options?: string[] | string | null;
  marks?: number;
  difficulty?: string;
  negative_marks?: number;
  correct_answer?: string | string[] | number | null;
  explanation?: string;
  gate_year?: string;
};

type TestSession = {
  id: number;
  title: string;
  test_type: string;
  duration_minutes: number;
  total_marks: number;
  total_questions?: number;
  question_type_counts?: Record<string, number>;
  questions: Question[];
};

type AnswerValue = string | string[];

const REQUIRED_QUESTIONS = 50;
const TOPIC_TEST_QUESTION_COUNT = 50;
const SUBJECT_TEST_DURATION = 75;
const FULL_MOCK_DURATION = 90;

const getErrorMessage = (error: any): string => {
  const detail = error?.response?.data?.detail;

  if (typeof detail === 'string') return detail;

  if (Array.isArray(detail)) {
    return detail.map((item: any) => item?.msg || String(item)).join(', ');
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
};

const getOptions = (options: any): string[] => {
  if (Array.isArray(options)) return options.map(String);

  if (typeof options === 'string') {
    try {
      const parsed = JSON.parse(options);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }

  return [];
};

/**
 * Finds a list in common API response formats:
 * [], {items: []}, {subjects: []}, {data: []},
 * {data: {items: []}}, and similar nested responses.
 */
const getArray = (data: any, depth = 0): any[] => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object' || depth > 5) return [];

  const keys = [
    'items',
    'subjects',
    'topics',
    'questions',
    'tests',
    'results',
    'attempts',
    'submissions',
    'records',
    'results_data',
  ];

  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key];
  }

  for (const key of ['data', 'result', 'response', 'payload']) {
    if (data[key] && typeof data[key] === 'object') {
      const nested = getArray(data[key], depth + 1);
      if (nested.length > 0 || Array.isArray(data[key])) return nested;
    }
  }

  return [];
};

const normalizeAnswer = (answer: any): string[] => {
  if (answer === null || answer === undefined) return [];

  if (Array.isArray(answer)) {
    return answer.map(String).map(value => value.trim()).sort();
  }

  const value = String(answer).trim();

  if (value.startsWith('[')) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(String).map(item => item.trim()).sort();
      }
    } catch {
      // Treat it as a normal string if it is not valid JSON.
    }
  }

  if (value.includes(',')) {
    return value.split(',').map(item => item.trim()).filter(Boolean).sort();
  }

  return [value];
};

const normalizeQuestion = (question: any, index: number): Question => ({
  ...question,
  id: Number(question?.id ?? question?.question_id ?? index + 1),
  question_text: String(
    question?.question_text ?? question?.text ?? question?.question ?? ''
  ),
  question_type: String(
    question?.question_type ?? question?.type ?? 'MCQ'
  ).toUpperCase(),
  options: getOptions(question?.options),
  marks: Number(question?.marks ?? 1),
  negative_marks: Number(question?.negative_marks ?? 0),
  gate_year: question?.gate_year ? String(question.gate_year) : undefined,
});

const unwrapTestResponse = (data: any): any => {
  if (!data || typeof data !== 'object') return data;

  if (data.test && typeof data.test === 'object') {
    return {
      ...data,
      ...data.test,
      questions: data.questions ?? data.test.questions,
    };
  }

  if (
    data.data &&
    typeof data.data === 'object' &&
    !Array.isArray(data.data)
  ) {
    return {
      ...data,
      ...data.data,
      questions: data.questions ?? data.data.questions,
    };
  }

  return data;
};

const normalizeSession = (
  responseData: any,
  fallbackId: number,
  fallbackType: string
): TestSession => {
  const data = unwrapTestResponse(responseData);
  const rawQuestions = getArray(data?.questions);

  const normalizedType = String(data?.test_type ?? fallbackType);
  const isMock = /full[\s_-]*mock|mock[\s_-]*test/i.test(
    `${normalizedType} ${data?.title ?? ''}`
  );

  return {
    ...data,
    id: Number(data?.id ?? data?.test_id ?? fallbackId),
    title: String(data?.title ?? data?.test_title ?? fallbackType),
    test_type: normalizedType,
    duration_minutes:
      Number(data?.duration_minutes) ||
      (isMock ? FULL_MOCK_DURATION : SUBJECT_TEST_DURATION),
    total_marks: Number(data?.total_marks ?? data?.marks ?? 0),
    total_questions: Number(data?.total_questions ?? rawQuestions.length),
    questions: rawQuestions.map(normalizeQuestion),
  };
};

const isFullMock = (value: string) =>
  /full[\s_-]*mock|mock[\s_-]*test/i.test(value);

const isValidId = (value: string | number) =>
  String(value).trim() !== '' &&
  Number.isInteger(Number(value)) &&
  Number(value) > 0;

const getSubjectId = (subject: any) =>
  Number(subject?.id ?? subject?.subject_id ?? subject?.subjectId);

const getTopicId = (topic: any) =>
  Number(topic?.id ?? topic?.topic_id ?? topic?.topicId);

const normalizeSubject = (subject: any) => ({
  ...subject,
  id: getSubjectId(subject),
  name: String(
    subject?.name ??
      subject?.title ??
      subject?.subject_name ??
      subject?.subject ??
      `Subject ${getSubjectId(subject)}`
  ),
});

const normalizeTopic = (topic: any) => ({
  ...topic,
  id: getTopicId(topic),
  title: String(
    topic?.title ??
      topic?.name ??
      topic?.topic_name ??
      topic?.topic ??
      `Topic ${getTopicId(topic)}`
  ),
});

export const TestsPage: React.FC = () => {
  const { user } = useAuth();

  const role = String(user?.role || '').toLowerCase();
  const isFacultyOrAdmin = ['faculty', 'admin', 'teacher'].includes(role);

  const [tests, setTests] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);

  const [myAttempts, setMyAttempts] = useState<any[]>([]);
  const [statsOverview, setStatsOverview] = useState<any>(null);
  const [batchSubmissions, setBatchSubmissions] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [activeTestType, setActiveTestType] = useState('Full Mock Test');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const [activeTestSession, setActiveTestSession] =
    useState<TestSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] =
    useState<Record<string, AnswerValue>>({});
  const [markedForReview, setMarkedForReview] =
    useState<Record<number, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [reviewFilter, setReviewFilter] =
    useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');

  const [testResult, setTestResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(FULL_MOCK_DURATION * 60);
  const [submitting, setSubmitting] = useState(false);

  const [facultyTab, setFacultyTab] =
    useState<'papers' | 'submissions'>('papers');
  const [inspectingTest, setInspectingTest] = useState<any>(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  const loadStudentData = useCallback(async () => {
    try {
      const [attemptsResponse, statsResponse] = await Promise.all([
        api.get('/tests/my-attempts').catch(() => ({ data: [] })),
        api.get('/tests/stats/overview').catch(() => ({ data: null })),
      ]);

      setMyAttempts(getArray(attemptsResponse.data));

      const statsData = statsResponse.data?.data ?? statsResponse.data;
      setStatsOverview(
        statsData && typeof statsData === 'object' ? statsData : null
      );
    } catch (err) {
      console.error('Unable to load student history and statistics', err);
    }
  }, []);

  const viewAttemptResult = async (attemptId: number) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/tests/attempts/${attemptId}`);
      if (response.data) {
        setTestResult(response.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const calculatedStats = React.useMemo(() => {
    const total = statsOverview?.total_attempts ?? (myAttempts ? myAttempts.length : 0);
    let avg = statsOverview?.average_percentage;
    let best = statsOverview?.best_percentage;

    if (avg === undefined || avg === null || (total > 0 && avg < 0)) {
      if (myAttempts.length > 0) {
        const pcts = myAttempts
          .map(a => Number(a.percentage ?? ((a.score / (a.total_marks || 100)) * 100)))
          .filter(p => !isNaN(p) && p >= 0);
        avg = pcts.length > 0 ? Math.round((pcts.reduce((s, v) => s + v, 0) / pcts.length) * 10) / 10 : 0;
        best = pcts.length > 0 ? Math.round(Math.max(...pcts) * 10) / 10 : 0;
      } else {
        avg = 0;
        best = 0;
      }
    }

    return {
      totalAttempts: total,
      averagePercentage: Math.max(0, Number(avg ?? 0)),
      bestPercentage: Math.max(0, Number(best ?? 0)),
    };
  }, [statsOverview, myAttempts]);

  const loadBatchSubmissions = useCallback(async () => {
    try {
      const response = await api.get('/tests/batch-submissions');
      setBatchSubmissions(getArray(response.data));
      setError('');
    } catch (err) {
      console.error('Unable to load submissions', err);
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPage = async () => {
      setLoading(true);
      setError('');

      try {
        const testsResponse = await api.get('/tests');
        if (cancelled) return;

        setTests(getArray(testsResponse.data));

        if (isFacultyOrAdmin) {
          const submissionsResponse = await api
            .get('/tests/batch-submissions')
            .catch(() => ({ data: [] }));

          if (!cancelled) {
            setBatchSubmissions(getArray(submissionsResponse.data));
          }
        } else {
          const [attemptsResponse, statsResponse, subjectsResponse] =
            await Promise.all([
              api.get('/tests/my-attempts').catch(() => ({ data: [] })),
              api.get('/tests/stats/overview').catch(() => ({ data: null })),
              api.get('/subjects'),
            ]);

          if (cancelled) return;

          setMyAttempts(getArray(attemptsResponse.data));

          const statsData = statsResponse.data?.data ?? statsResponse.data;
          setStatsOverview(
            statsData && typeof statsData === 'object' ? statsData : null
          );

          const subjectList = getArray(subjectsResponse.data)
            .map(normalizeSubject)
            .filter(subject => isValidId(subject.id));

          const uniqueSubjects = Array.from(
            new Map(subjectList.map(subject => [subject.id, subject])).values()
          );

          setSubjects(uniqueSubjects);

          if (uniqueSubjects.length === 0) {
            setError(
              'The /subjects endpoint returned no usable subjects. Verify its response and the subjects stored in your database.'
            );
          }
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, [isFacultyOrAdmin]);

  useEffect(() => {
    let cancelled = false;

    setTopics([]);
    setSelectedTopic('');

    if (
      isFacultyOrAdmin ||
      activeTestType !== 'Topic Test' ||
      !isValidId(selectedSubject)
    ) {
      setTopicsLoading(false);
      return;
    }

    const loadTopics = async () => {
      setTopicsLoading(true);
      setError('');

      try {
        const subjectId = Number(selectedSubject);
        const response = await api.get(`/subjects/${subjectId}/topics`);

        if (cancelled) return;

        const topicList = getArray(response.data)
          .map(normalizeTopic)
          .filter(topic => isValidId(topic.id));

        const uniqueTopics = Array.from(
          new Map(topicList.map(topic => [topic.id, topic])).values()
        );

        setTopics(uniqueTopics);

        if (uniqueTopics.length === 0) {
          setError(
            'No topics were returned for this subject. Verify that /subjects/{subject_id}/topics returns the topics linked to the selected subject.'
          );
        }
      } catch (err) {
        if (!cancelled) {
          setTopics([]);
          setError(`Could not load topics: ${getErrorMessage(err)}`);
        }
      } finally {
        if (!cancelled) setTopicsLoading(false);
      }
    };

    void loadTopics();

    return () => {
      cancelled = true;
    };
  }, [selectedSubject, activeTestType, isFacultyOrAdmin]);

  useEffect(() => {
    if (
      isFacultyOrAdmin ||
      !activeTestSession ||
      testResult ||
      submitting
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft(previous => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeTestSession, testResult, isFacultyOrAdmin, submitting]);

  useEffect(() => {
    if (
      !activeTestSession ||
      testResult ||
      submitting ||
      timeLeft > 0
    ) {
      return;
    }

    void submitTest(true);
    // submitTest reads the current session and answers from state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, activeTestSession, testResult, submitting]);

  const chooseCategory = (category: string) => {
    setActiveTestType(category);
    setError('');
    setNotice('');
    setSelectedSubject('');
    setSelectedTopic('');
    setTopics([]);
    setTopicsLoading(false);
    setShowInstructions(false);
  };

  const startGeneratedTest = async () => {
    if (starting) return;

    setError('');
    setNotice('');

    if (
      (activeTestType === 'Subject Test' ||
        activeTestType === 'Topic Test') &&
      !isValidId(selectedSubject)
    ) {
      setError('Please select a valid subject first.');
      return;
    }

    if (activeTestType === 'Topic Test') {
      if (topicsLoading) {
        setError('Please wait until the topics finish loading.');
        return;
      }

      if (!isValidId(selectedTopic)) {
        setError('Please select a valid topic.');
        return;
      }

      if (!topics.some(topic => Number(topic.id) === Number(selectedTopic))) {
        setError('The selected topic is no longer available. Select it again.');
        return;
      }
    }

    setStarting(true);

    try {
      const payload: Record<string, string | number> = {
        test_type: activeTestType,
      };

      if (
        activeTestType === 'Subject Test' ||
        activeTestType === 'Topic Test'
      ) {
        payload.subject_id = Number(selectedSubject);
      }

      if (activeTestType === 'Topic Test') {
        payload.topic_id = Number(selectedTopic);
      }

      const generatedResponse = await api.post('/tests/generate', payload);
      const generated = unwrapTestResponse(generatedResponse.data);
      const testId = Number(generated?.test_id ?? generated?.id);

      if (!Number.isInteger(testId) || testId <= 0) {
        console.error(
          'Unexpected /tests/generate response:',
          generatedResponse.data
        );
        throw new Error(
          'The backend did not return a valid test ID. Check the /tests/generate response.'
        );
      }

      let sessionData = generated;

      if (!Array.isArray(sessionData?.questions) ||
          sessionData.questions.length === 0) {
        const detailsResponse = await api.get(`/tests/${testId}`);
        sessionData = unwrapTestResponse(detailsResponse.data);
      }

      const session = normalizeSession(sessionData, testId, activeTestType);

      if (session.questions.length === 0) {
        throw new Error(
          'No questions were returned. Check that enough published questions exist for this selection.'
        );
      }

      if (
        session.questions.some(question => !question.question_text.trim())
      ) {
        throw new Error(
          'Some questions have empty question text. Check the question bank.'
        );
      }

      if (
        new Set(session.questions.map(question => question.id)).size !==
        session.questions.length
      ) {
        throw new Error(
          'The generated test contains duplicate question IDs. Check the backend question selection.'
        );
      }

      if (isFullMock(activeTestType)) {
        if (session.questions.length !== REQUIRED_QUESTIONS) {
          throw new Error(
            `A Full Mock Test requires ${REQUIRED_QUESTIONS} questions, but the backend returned ${session.questions.length}. Check the published question bank.`
          );
        }

        const counts = session.question_type_counts;

        if (counts) {
          const mcq = Number(counts.MCQ ?? counts.mcq ?? 0);
          const msq = Number(counts.MSQ ?? counts.msq ?? 0);
          const nat = Number(counts.NAT ?? counts.nat ?? 0);

          if (mcq !== 30 || msq !== 10 || nat !== 10) {
            throw new Error(
              'The Full Mock Test must contain 30 MCQs, 10 MSQs and 10 NAT questions.'
            );
          }
        } else {
          const questionTypes = session.questions.reduce(
            (result: Record<string, number>, question) => {
              const type = String(question.question_type || 'MCQ').toUpperCase();
              result[type] = (result[type] || 0) + 1;
              return result;
            },
            {}
          );

          if (
            questionTypes.MCQ !== 30 ||
            questionTypes.MSQ !== 10 ||
            questionTypes.NAT !== 10
          ) {
            throw new Error(
              'The Full Mock Test must contain 30 MCQs, 10 MSQs and 10 NAT questions. Check the backend question selection.'
            );
          }
        }
      }

      if (
        activeTestType === 'Subject Test' &&
        session.questions.length !== REQUIRED_QUESTIONS
      ) {
        throw new Error(
          `A Subject Test requires ${REQUIRED_QUESTIONS} questions, but the backend returned ${session.questions.length}.`
        );
      }

      if (
        activeTestType === 'Topic Test' &&
        session.questions.length !== TOPIC_TEST_QUESTION_COUNT
      ) {
        throw new Error(
          `A Topic Test requires ${TOPIC_TEST_QUESTION_COUNT} questions, but the backend returned ${session.questions.length}.`
        );
      }

      const expectedDuration = isFullMock(activeTestType)
        ? FULL_MOCK_DURATION
        : SUBJECT_TEST_DURATION;

      const readySession: TestSession = {
        ...session,
        duration_minutes:
          Number(session.duration_minutes) > 0
            ? Number(session.duration_minutes)
            : expectedDuration,
      };

      setActiveTestSession(readySession);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setMarkedForReview({});
      setShowSubmitModal(false);
      setReviewFilter('all');
      setTestResult(null);
      setTimeLeft(readySession.duration_minutes * 60);
      setShowInstructions(false);
      setNotice('');
      setError('');
    } catch (err) {
      console.error('Unable to start generated test:', err);
      setError(getErrorMessage(err));
    } finally {
      setStarting(false);
    }
  };

  const startPublishedPaper = async (testId: number) => {
    setError('');
    setNotice('');
    setStarting(true);

    try {
      const response = await api.get(`/tests/${testId}`);
      const session = normalizeSession(
        response.data,
        testId,
        'Previous Year Paper'
      );

      if (session.questions.length === 0) {
        throw new Error('This published paper has no available questions.');
      }

      setActiveTestSession(session);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setMarkedForReview({});
      setShowSubmitModal(false);
      setReviewFilter('all');
      setTestResult(null);
      setTimeLeft(session.duration_minutes * 60);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setStarting(false);
    }
  };

  async function submitTest(automatic = false) {
    if (!activeTestSession || testResult || submitting) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await api.post('/tests/submit', {
        test_id: activeTestSession.id,
        time_taken_seconds: Math.max(
          0,
          activeTestSession.duration_minutes * 60 - timeLeft
        ),
        answers: selectedAnswers,
      });

      setTestResult(response.data);

      if (automatic) {
        setNotice('Time is up. Your answers were submitted automatically.');
      }

      await loadStudentData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const inspectPaper = async (testId: number) => {
    setInspectLoading(true);
    setError('');

    try {
      const response = await api.get(`/tests/${testId}`);
      setInspectingTest(unwrapTestResponse(response.data));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setInspectLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, seconds);
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion =
    activeTestSession?.questions[currentQuestionIndex];

  const setSingleAnswer = (questionId: number, answer: string) => {
    setSelectedAnswers(previous => ({
      ...previous,
      [String(questionId)]: answer,
    }));
  };

  const toggleMultipleAnswer = (
    questionId: number,
    answer: string
  ) => {
    const key = String(questionId);

    setSelectedAnswers(previous => {
      const current = previous[key];
      const selected = Array.isArray(current) ? current : [];

      return {
        ...previous,
        [key]: selected.includes(answer)
          ? selected.filter(item => item !== answer)
          : [...selected, answer],
      };
    });
  };

  const isAnswered = (question: Question) => {
    const answer = selectedAnswers[String(question.id)];

    if (Array.isArray(answer)) return answer.length > 0;

    return answer !== undefined && answer.trim() !== '';
  };

  const toggleMarkForReview = (questionId: number) => {
    setMarkedForReview(previous => ({
      ...previous,
      [questionId]: !previous[questionId],
    }));
  };

  const clearResponse = (questionId: number) => {
    setSelectedAnswers(previous => {
      const copy = { ...previous };
      delete copy[String(questionId)];
      return copy;
    });
  };

  const resetToDashboard = () => {
    setActiveTestSession(null);
    setTestResult(null);
    setSelectedAnswers({});
    setMarkedForReview({});
    setShowSubmitModal(false);
    setReviewFilter('all');
    setCurrentQuestionIndex(0);
    setShowInstructions(false);
    setError('');
    setNotice('');
    loadStudentData();
  };

  const categories = [
    {
      title: 'Full Mock Test',
      subtitle: '50 mixed questions · 90 minutes',
      icon: '📝',
    },
    {
      title: 'Subject Test',
      subtitle: '50 questions · 75 minutes',
      icon: '📖',
    },
    {
      title: 'Topic Test',
      subtitle: '50 questions · 75 minutes',
      icon: '🎯',
    },
    {
      title: 'Previous Year Papers',
      subtitle: 'Published papers from the question bank',
      icon: '📑',
    },
  ];

  const isPreviousPaper = (test: any) =>
    /previous|year|pyq|gate\s?20/i.test(
      `${test.test_type || ''} ${test.title || ''}`
    );

  const availablePapers = tests
    .filter(
      test =>
        (test.status === undefined ||
          String(test.status || '').toLowerCase() === 'published') &&
        isPreviousPaper(test)
    )
    .sort((a, b) => {
      const yearA = Number(
        a.year || String(a.title || '').match(/\b(20\d\d)\b/)?.[1] || 0
      );
      const yearB = Number(
        b.year || String(b.title || '').match(/\b(20\d\d)\b/)?.[1] || 0
      );
      return yearB - yearA;
    });

  if (loading) {
    return (
      <div className="p-10 text-center text-[#701a2b]">
        Loading test series...
      </div>
    );
  }

  if (isFacultyOrAdmin) {
    const average = batchSubmissions.length
      ? batchSubmissions.reduce(
          (sum, item) => sum + Number(item.score || 0),
          0
        ) / batchSubmissions.length
      : 0;

    const highest = batchSubmissions.length
      ? Math.max(...batchSubmissions.map(item => Number(item.score || 0)))
      : 0;

    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-100 bg-gradient-to-r from-[#fbf5f5] to-[#f4dfdf] p-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#8e2137]">
              FACULTY TEST SERIES HUB
            </p>
            <h1 className="mt-2 font-serif text-2xl font-bold text-[#500713]">
              GATE ECE Mock Exam &amp; Assessment Hub
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Inspect published papers, answer keys, solutions and student attempts.
            </p>
          </div>

          <Link
            to="/faculty"
            className="rounded-xl bg-[#701a2b] px-5 py-3 text-sm font-semibold text-white"
          >
            <PlusCircle className="mr-2 inline h-4 w-4" />
            Manage Tests
          </Link>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ['Published Papers', tests.length],
            ['Submissions', batchSubmissions.length],
            ['Average Score', average.toFixed(1)],
            ['Highest Score', highest.toFixed(1)],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-rose-100 bg-white p-4"
            >
              <p className="text-xs text-stone-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-[#701a2b]">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-5 border-b border-rose-100">
          <button
            onClick={() => setFacultyTab('papers')}
            className={`pb-3 text-sm font-semibold ${
              facultyTab === 'papers'
                ? 'border-b-2 border-[#701a2b] text-[#701a2b]'
                : 'text-stone-500'
            }`}
          >
            <FileCheck2 className="mr-1 inline h-4 w-4" />
            Published Papers
          </button>

          <button
            onClick={() => setFacultyTab('submissions')}
            className={`pb-3 text-sm font-semibold ${
              facultyTab === 'submissions'
                ? 'border-b-2 border-[#701a2b] text-[#701a2b]'
                : 'text-stone-500'
            }`}
          >
            <Users className="mr-1 inline h-4 w-4" />
            Student Submissions
          </button>
        </div>

        {facultyTab === 'papers' ? (
          <div className="overflow-x-auto rounded-2xl border border-rose-100 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#faf7f5] text-stone-600">
                <tr>
                  <th className="p-4">Paper</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Marks</th>
                  <th className="p-4">Questions</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {tests.map((test, index) => (
                  <tr key={test.id ?? index}>
                    <td className="p-4 font-semibold">{test.title}</td>
                    <td className="p-4">{test.test_type}</td>
                    <td className="p-4">{test.duration_minutes} min</td>
                    <td className="p-4">{test.total_marks}</td>
                    <td className="p-4">{test.total_questions}</td>
                    <td className="p-4">
                      <button
                        onClick={() => void inspectPaper(Number(test.id))}
                        className="rounded-lg bg-[#701a2b] px-3 py-2 text-xs text-white"
                      >
                        <Eye className="mr-1 inline h-3 w-3" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {tests.length === 0 && (
              <p className="p-8 text-center text-sm text-stone-500">
                No published papers found.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-rose-100 bg-white">
            <div className="flex justify-end p-3">
              <button
                onClick={() => void loadBatchSubmissions()}
                className="text-sm font-semibold text-[#701a2b]"
              >
                Refresh submissions
              </button>
            </div>

            <table className="w-full text-left text-sm">
              <thead className="bg-[#faf7f5]">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Paper</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Time Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {batchSubmissions.map((item, index) => (
                  <tr key={item.id ?? index}>
                    <td className="p-3">{item.student_name || '—'}</td>
                    <td className="p-3">{item.student_id ?? '—'}</td>
                    <td className="p-3">{item.test_title || '—'}</td>
                    <td className="p-3">
                      {item.score ?? 0} / {item.total_marks ?? 0}
                    </td>
                    <td className="p-3">{item.time_taken_seconds ?? 0}s</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!batchSubmissions.length && (
              <p className="p-8 text-center text-sm text-stone-500">
                No student submissions recorded yet.
              </p>
            )}
          </div>
        )}

        {inspectLoading && (
          <p className="text-sm text-stone-500">Loading paper...</p>
        )}

        {inspectingTest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#500713]">
                    {inspectingTest.title}
                  </h2>
                  <p className="text-sm text-stone-500">
                    {getArray(inspectingTest.questions).length} questions
                  </p>
                </div>
                <button
                  aria-label="Close paper inspection"
                  onClick={() => setInspectingTest(null)}
                >
                  <X />
                </button>
              </div>

              {getArray(inspectingTest.questions).map(
                (rawQuestion: any, index: number) => {
                  const question = normalizeQuestion(rawQuestion, index);
                  const options = getOptions(question.options);
                  const correctAnswers = normalizeAnswer(question.correct_answer);

                  return (
                    <div
                      key={question.id || index}
                      className="space-y-3 border-t border-rose-100 py-5"
                    >
                      <p className="font-semibold">
                        Q{index + 1}. {question.question_text}
                      </p>

                      {options.map((option, optionIndex) => {
                        const letter = String.fromCharCode(65 + optionIndex);
                        const correct =
                          correctAnswers.includes(option) ||
                          correctAnswers.includes(letter);

                        return (
                          <div
                            key={optionIndex}
                            className={`rounded-lg border p-3 text-sm ${
                              correct
                                ? 'border-emerald-400 bg-emerald-50'
                                : 'border-stone-200'
                            }`}
                          >
                            {letter}. {option} {correct && '✓ Correct answer'}
                          </div>
                        );
                      })}

                      {String(question.question_type).toUpperCase() === 'NAT' && (
                        <p className="text-sm text-emerald-700">
                          Answer: {String(question.correct_answer ?? '')}
                        </p>
                      )}

                      {question.explanation && (
                        <p className="rounded-lg bg-stone-50 p-3 text-sm text-stone-600">
                          <BookOpen className="mr-1 inline h-4 w-4" />
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  );
                }
              )}

              <button
                onClick={() => setInspectingTest(null)}
                className="mt-4 rounded-lg bg-[#701a2b] px-5 py-2 text-sm text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button
            className="ml-auto"
            onClick={() => setError('')}
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {notice}
        </div>
      )}

      {activeTestSession ? (
        <div className="space-y-6 rounded-2xl border border-rose-200 bg-white p-5 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-[#8e2137]">
                {activeTestSession.test_type}
              </p>
              <h2 className="text-xl font-bold text-stone-900">
                {activeTestSession.title}
              </h2>
              <p className="text-xs text-stone-500">
                Question {currentQuestionIndex + 1} of{' '}
                {activeTestSession.questions.length}
              </p>
            </div>

            {!testResult && (
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 font-mono font-bold text-[#701a2b]">
                  <Clock className="mr-1 inline h-4 w-4" />
                  {formatTime(timeLeft)}
                </span>
                <button
                  disabled={submitting}
                  onClick={() => setShowSubmitModal(true)}
                  className="rounded-xl bg-[#701a2b] px-4 py-2 text-sm text-white disabled:opacity-50 hover:bg-[#500713] transition"
                >
                  {submitting ? 'Submitting...' : 'Submit Test'}
                </button>
              </div>
            )}
          </div>

          {testResult ? (
            <div className="space-y-8">
              {/* Score Overview Banner */}
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        Assessment Completed
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-stone-900">
                        {testResult.test_title || activeTestSession?.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={resetToDashboard}
                    className="rounded-xl bg-[#701a2b] px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#500713] transition"
                  >
                    Back to Test Series
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium text-stone-500">Total Score</p>
                    <p className="mt-1 text-2xl font-bold text-[#701a2b]">
                      {testResult.score ?? 0}{' '}
                      <span className="text-xs font-normal text-stone-400">
                        / {testResult.total_marks ?? activeTestSession?.total_marks ?? 100}
                      </span>
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium text-stone-500">Percentage</p>
                    <p className="mt-1 text-2xl font-bold text-stone-900">
                      {testResult.percentage ?? 0}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium text-stone-500">Accuracy</p>
                    <p className="mt-1 text-2xl font-bold text-stone-900">
                      {testResult.accuracy ?? 0}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium text-emerald-700">Correct</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-700">
                      {testResult.correct_count ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium text-rose-700">Incorrect</p>
                    <p className="mt-1 text-2xl font-bold text-rose-700">
                      {testResult.incorrect_count ?? testResult.wrong_count ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium text-stone-500">Time Taken</p>
                    <p className="mt-1 text-xl font-bold text-stone-900">
                      {formatTime(testResult.time_taken_seconds ?? 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject-wise Performance Card */}
              {Array.isArray(testResult.subject_breakdown) && testResult.subject_breakdown.length > 0 && (
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    Subject-wise Performance Breakdown
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Subject</th>
                          <th className="p-3 text-center">Total</th>
                          <th className="p-3 text-center text-emerald-700">Correct</th>
                          <th className="p-3 text-center text-rose-700">Incorrect</th>
                          <th className="p-3 text-center text-stone-500">Unanswered</th>
                          <th className="p-3 text-right">Marks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {testResult.subject_breakdown.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-stone-50/60 transition">
                            <td className="p-3 font-semibold text-stone-800">{item.subject}</td>
                            <td className="p-3 text-center text-stone-600">{item.total}</td>
                            <td className="p-3 text-center font-bold text-emerald-700">{item.correct}</td>
                            <td className="p-3 text-center font-bold text-rose-700">{item.incorrect}</td>
                            <td className="p-3 text-center text-stone-500">{item.unanswered}</td>
                            <td className="p-3 text-right font-bold text-[#701a2b]">{item.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Detailed Question Review */}
              {Array.isArray(testResult.question_reviews) && testResult.question_reviews.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      Question-by-Question Solution &amp; Review
                    </h4>
                    {/* Review Filter Tabs */}
                    <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 p-1 text-xs">
                      {(
                        [
                          ['all', `All (${testResult.question_reviews.length})`],
                          ['correct', `Correct (${testResult.correct_count ?? 0})`],
                          ['incorrect', `Incorrect (${testResult.incorrect_count ?? 0})`],
                          ['unanswered', `Unanswered (${testResult.unanswered_count ?? 0})`],
                        ] as const
                      ).map(([fKey, fLabel]) => (
                        <button
                          key={fKey}
                          onClick={() => setReviewFilter(fKey)}
                          className={`rounded-lg px-3 py-1.5 font-medium transition ${
                            reviewFilter === fKey
                              ? 'bg-[#701a2b] text-white shadow-sm'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          {fLabel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {testResult.question_reviews
                      .filter((review: any) => {
                        if (reviewFilter === 'correct') return review.is_correct;
                        if (reviewFilter === 'incorrect') return !review.is_correct && !review.is_unanswered;
                        if (reviewFilter === 'unanswered') return review.is_unanswered;
                        return true;
                      })
                      .map((review: any, qIdx: number) => {
                        const isMSQ = String(review.question_type).toUpperCase() === 'MSQ';
                        const isNAT = String(review.question_type).toUpperCase() === 'NAT';
                        const rawOpts = getOptions(review.options);

                        const corrSet = normalizeAnswer(review.correct_answer);
                        const userSet = normalizeAnswer(review.user_answer);

                        return (
                          <div
                            key={review.id || qIdx}
                            className={`rounded-2xl border p-5 shadow-sm space-y-4 transition ${
                              review.is_correct
                                ? 'border-emerald-200 bg-emerald-50/20'
                                : review.is_unanswered
                                  ? 'border-stone-200 bg-white'
                                  : 'border-rose-200 bg-rose-50/20'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900">
                                  Q{qIdx + 1}.
                                </span>
                                <span className="rounded-md bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-700">
                                  {review.subject_name || 'GATE ECE'}
                                </span>
                                <span className="rounded-md bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-[#701a2b]">
                                  {review.question_type}
                                </span>
                                {review.gate_year && (
                                  <span className="rounded-md bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-xs font-semibold text-amber-800">
                                    📜 {review.gate_year}
                                  </span>
                                )}
                                <span className="text-xs text-stone-500">
                                  Marks: {review.marks ?? 1}
                                  {Number(review.negative_marks) > 0 &&
                                    ` · Neg: ${review.negative_marks}`}
                                </span>
                              </div>

                              <div>
                                {review.is_correct ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                                    <CheckCircle className="h-3.5 w-3.5" /> Correct (+{review.marks ?? 1})
                                  </span>
                                ) : review.is_unanswered ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                                    <MinusCircle className="h-3.5 w-3.5" /> Not Attempted (0)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
                                    <XCircle className="h-3.5 w-3.5" /> Incorrect (-{review.negative_marks ?? 0})
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-stone-800">
                              {review.question_text}
                            </p>

                            {/* Options display for MCQ / MSQ */}
                            {!isNAT && rawOpts.length > 0 && (
                              <div className="space-y-2 pt-1">
                                {rawOpts.map((opt: string, optIdx: number) => {
                                  const optLetter = String.fromCharCode(65 + optIdx);
                                  const isOptionCorrect = corrSet.some(
                                    c => c.toLowerCase() === optLetter.toLowerCase() || c.toLowerCase() === opt.toLowerCase()
                                  );
                                  const isUserSelected = userSet.some(
                                    u => u.toLowerCase() === optLetter.toLowerCase() || u.toLowerCase() === opt.toLowerCase()
                                  );

                                  let optClass = 'border-stone-200 bg-white text-stone-700';
                                  if (isOptionCorrect) {
                                    optClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-400';
                                  } else if (isUserSelected && !isOptionCorrect) {
                                    optClass = 'border-rose-400 bg-rose-50 text-rose-950';
                                  }

                                  return (
                                    <div
                                      key={optIdx}
                                      className={`flex items-center justify-between rounded-xl border p-3 text-xs md:text-sm ${optClass}`}
                                    >
                                      <span>
                                        <strong className="mr-2">{optLetter}.</strong>
                                        {opt}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {isUserSelected && (
                                          <span className="rounded bg-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-800">
                                            Your choice
                                          </span>
                                        )}
                                        {isOptionCorrect && (
                                          <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                                            Correct Answer
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* NAT Answer details */}
                            {isNAT && (
                              <div className="grid grid-cols-1 gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:grid-cols-2 text-xs">
                                <div>
                                  <span className="text-stone-500">Your Answer:</span>{' '}
                                  <strong className={review.is_correct ? 'text-emerald-700' : 'text-rose-700'}>
                                    {review.user_answer !== undefined && review.user_answer !== '' && review.user_answer !== null
                                      ? String(review.user_answer)
                                      : 'Not Attempted'}
                                  </strong>
                                </div>
                                <div>
                                  <span className="text-stone-500">Correct Value / Range:</span>{' '}
                                  <strong className="text-emerald-700">{String(review.correct_answer)}</strong>
                                </div>
                              </div>
                            )}

                            {/* Step-by-Step Explanation Box */}
                            {review.explanation && (
                              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                                  <BookOpen className="h-4 w-4 text-amber-700" />
                                  <span>Step-by-Step Solution &amp; Concept Explanation</span>
                                </div>
                                <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-stone-700">
                                  {review.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-4">
                <button
                  onClick={resetToDashboard}
                  className="rounded-xl bg-[#701a2b] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#500713] transition"
                >
                  Return to Test Series Dashboard
                </button>
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="space-y-5 md:col-span-8">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-rose-50 px-2 py-0.5 font-bold text-[#701a2b]">
                      {currentQuestion.question_type || 'MCQ'}
                    </span>
                    {currentQuestion.gate_year && (
                      <span className="rounded bg-amber-50 border border-amber-200/80 px-2 py-0.5 font-semibold text-amber-800 flex items-center gap-1">
                        📜 {currentQuestion.gate_year}
                      </span>
                    )}
                    {markedForReview[currentQuestion.id] && (
                      <span className="rounded bg-purple-100 px-2 py-0.5 font-semibold text-purple-800">
                        Marked for Review
                      </span>
                    )}
                  </div>
                  <span>
                    Marks: {currentQuestion.marks ?? 1}
                    {Number(currentQuestion.negative_marks) > 0 &&
                      ` · Negative: ${currentQuestion.negative_marks}`}
                  </span>
                </div>

                <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-stone-800">
                  {currentQuestion.question_text}
                </p>

                {String(currentQuestion.question_type || 'MCQ').toUpperCase() ===
                'NAT' ? (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-700">
                      Enter your numerical answer
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={String(
                        selectedAnswers[String(currentQuestion.id)] ?? ''
                      )}
                      onChange={event =>
                        setSingleAnswer(currentQuestion.id, event.target.value)
                      }
                      placeholder="e.g. 5 or 2.35"
                      className="w-full rounded-xl border border-stone-300 p-3 text-sm outline-none focus:border-[#701a2b] focus:ring-1 focus:ring-[#701a2b]"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getOptions(currentQuestion.options).map((option, index) => {
                      const qKey = String(currentQuestion.id);
                      const answer = selectedAnswers[qKey];
                      const isMSQ =
                        String(currentQuestion.question_type || 'MCQ').toUpperCase() ===
                        'MSQ';

                      const checked = Array.isArray(answer)
                        ? answer.includes(option)
                        : answer === option;

                      return (
                        <button
                          key={`${currentQuestion.id}-${index}`}
                          type="button"
                          onClick={() => {
                            if (isMSQ) {
                              toggleMultipleAnswer(currentQuestion.id, option);
                            } else {
                              setSingleAnswer(currentQuestion.id, option);
                            }
                          }}
                          className={`flex w-full items-center justify-between rounded-xl border-2 p-3 text-left text-sm transition ${
                            checked
                              ? 'border-[#701a2b] bg-rose-50 text-[#701a2b] font-medium'
                              : 'border-stone-200 hover:border-rose-300 bg-white'
                          }`}
                        >
                          <span>
                            {String.fromCharCode(65 + index)}. {option}
                          </span>
                          <span>{checked ? '✓' : isMSQ ? '□' : '○'}</span>
                        </button>
                      );
                    })}

                    {String(currentQuestion.question_type).toUpperCase() === 'MSQ' && (
                      <p className="text-xs text-stone-500">
                        Multiple Choice Question (MSQ): Select all options you think are correct.
                      </p>
                    )}
                  </div>
                )}

                {/* Question Navigation and Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rose-100 pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(index => index - 1)}
                      className="rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 disabled:opacity-40 transition"
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleMarkForReview(currentQuestion.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
                        markedForReview[currentQuestion.id]
                          ? 'border border-purple-400 bg-purple-100 text-purple-900 font-semibold'
                          : 'bg-stone-100 text-stone-700 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                    >
                      <Bookmark className="h-4 w-4" />
                      {markedForReview[currentQuestion.id]
                        ? 'Marked for Review'
                        : 'Mark for Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => clearResponse(currentQuestion.id)}
                      disabled={!isAnswered(currentQuestion)}
                      className="flex items-center gap-1.5 rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40 transition"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Clear Response
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentQuestionIndex < activeTestSession.questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQuestionIndex(index => index + 1)}
                        className="rounded-lg bg-[#701a2b] px-5 py-2 text-sm font-semibold text-white hover:bg-[#500713] transition"
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => setShowSubmitModal(true)}
                        className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition"
                      >
                        {submitting ? 'Submitting...' : 'Review & Submit Test'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Palette Sidebar */}
              <aside className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 p-4 md:col-span-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-800">Question Palette</h3>
                  <span className="text-xs text-stone-500">
                    {activeTestSession.questions.length} Questions
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
                  {activeTestSession.questions.map((question, index) => {
                    const ans = isAnswered(question);
                    const marked = !!markedForReview[question.id];
                    const isActive = index === currentQuestionIndex;

                    let btnClass = 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-100';
                    if (ans && marked) {
                      btnClass = 'bg-purple-700 text-white';
                    } else if (marked) {
                      btnClass = 'bg-purple-500 text-white';
                    } else if (ans) {
                      btnClass = 'bg-emerald-600 text-white';
                    }

                    if (isActive) {
                      btnClass += ' ring-2 ring-offset-1 ring-[#701a2b] font-extrabold';
                    }

                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`relative flex h-9 items-center justify-center rounded-lg text-xs font-bold transition ${btnClass}`}
                        title={`Question ${index + 1}${ans ? ' (Answered)' : ''}${marked ? ' (Marked for Review)' : ''}`}
                      >
                        {index + 1}
                        {ans && marked && (
                          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-white" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Palette Legend */}
                <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded bg-emerald-600 inline-block" />
                      Answered
                    </span>
                    <span className="font-bold">
                      {activeTestSession.questions.filter(isAnswered).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded bg-purple-500 inline-block" />
                      Marked for Review
                    </span>
                    <span className="font-bold">
                      {
                        activeTestSession.questions.filter(
                          q => markedForReview[q.id] && !isAnswered(q)
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="relative inline-block h-3 w-3 rounded bg-purple-700">
                        <span className="absolute top-0.5 right-0.5 h-1 w-1 rounded-full bg-emerald-400" />
                      </span>
                      Answered &amp; Marked
                    </span>
                    <span className="font-bold">
                      {
                        activeTestSession.questions.filter(
                          q => markedForReview[q.id] && isAnswered(q)
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-3 w-3 rounded border border-stone-300 bg-white" />
                      Unanswered
                    </span>
                    <span className="font-bold">
                      {
                        activeTestSession.questions.filter(
                          q => !isAnswered(q) && !markedForReview[q.id]
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-3 w-3 rounded border-2 border-[#701a2b] bg-white" />
                      Current Question
                    </span>
                    <span className="font-medium text-stone-500">
                      #{currentQuestionIndex + 1}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="w-full rounded-xl bg-[#701a2b] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#500713] transition"
                  >
                    Submit Test
                  </button>
                </div>
              </aside>
            </div>
          ) : (
            <p className="text-sm text-stone-500">No questions are available.</p>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-rose-100 bg-gradient-to-r from-[#fbf5f5] via-[#f7ebeb] to-[#f4dfdf] p-6 md:p-8">
            <p className="text-xs font-semibold tracking-wider text-[#8e2137]">
              GATE ECE · PRACTICE TESTS
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-[#500713]">
              Test Your Readiness
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Practise with timed tests, subject-wise questions, topic tests and published papers.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-stone-700">
              <span>
                <CheckCircle2 className="mr-1 inline h-4 w-4 text-[#701a2b]" />
                GATE-style practice
              </span>
              <span>
                <Clock className="mr-1 inline h-4 w-4 text-[#701a2b]" />
                Timed tests
              </span>
              <span>
                <Award className="mr-1 inline h-4 w-4 text-[#701a2b]" />
                Score analysis
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map(category => (
              <button
                key={category.title}
                onClick={() => chooseCategory(category.title)}
                className={`rounded-xl border p-4 text-left transition ${
                  activeTestType === category.title
                    ? 'border-[#701a2b] bg-[#701a2b] text-white'
                    : 'border-rose-100 bg-white text-stone-800 hover:border-rose-300'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <h3 className="mt-2 text-sm font-bold">{category.title}</h3>
                <p
                  className={`mt-1 text-xs ${
                    activeTestType === category.title
                      ? 'text-rose-100'
                      : 'text-stone-500'
                  }`}
                >
                  {category.subtitle}
                </p>
              </button>
            ))}
          </div>

          {(activeTestType === 'Subject Test' ||
            activeTestType === 'Topic Test') && (
            <div className="space-y-4 rounded-2xl border border-rose-100 bg-white p-5">
              <h3 className="font-bold text-stone-900">Choose your practice area</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-stone-600">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={event => {
                      setSelectedSubject(event.target.value);
                      setSelectedTopic('');
                      setTopics([]);
                      setError('');
                    }}
                    className="w-full rounded-xl border border-stone-300 p-3 text-sm"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  {subjects.length === 0 && (
                    <p className="mt-2 text-xs text-stone-500">
                      No subjects loaded. Check the /subjects endpoint and database.
                    </p>
                  )}
                </div>

                {activeTestType === 'Topic Test' && (
                  <div>
                    <label className="mb-2 block text-sm text-stone-600">
                      Topic
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={event => {
                        setSelectedTopic(event.target.value);
                        setError('');
                      }}
                      disabled={
                        !selectedSubject || topicsLoading || topics.length === 0
                      }
                      className="w-full rounded-xl border border-stone-300 p-3 text-sm disabled:bg-stone-100"
                    >
                      <option value="">
                        {!selectedSubject
                          ? 'Select a subject first'
                          : topicsLoading
                            ? 'Loading topics...'
                            : topics.length === 0
                              ? 'No topics available'
                              : 'Select a topic'}
                      </option>
                      {topics.map(topic => (
                        <option key={topic.id} value={topic.id}>
                          {topic.title}
                        </option>
                      ))}
                    </select>

                    {selectedSubject && !topicsLoading && topics.length === 0 && (
                      <p className="mt-2 text-xs text-stone-500">
                        No topics are registered for this subject. Verify the endpoint and database.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTestType === 'Previous Year Papers' ? (
            <div className="space-y-4 rounded-2xl border border-rose-100 bg-white p-5 md:p-6 shadow-sm">
              <div className="border-b border-rose-100 pb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8e2137]">
                  OFFICIAL PAPERS &amp; ARCHIVES
                </p>
                <h3 className="mt-1 font-serif text-xl font-bold text-stone-900">
                  Published Previous Year Question Papers
                </h3>
                <p className="mt-1 text-xs text-stone-500">
                  Verified GATE Electronics &amp; Communication Engineering official question papers, master answer keys, and timed interactive mock exams directly linked to organizing IITs and IISc.
                </p>
              </div>

              {availablePapers.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {availablePapers.map((paper, index) => {
                    const paperYear =
                      paper.year ||
                      String(paper.title || '').match(/\b(20\d\d)\b/)?.[1] ||
                      'GATE';
                    const hasQuestions =
                      Number(paper.total_questions) > 0;
                    const officialPortal =
                      paper.source_url || paper.paper_url;

                    return (
                      <div
                        key={paper.id ?? index}
                        className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-[#701a2b]">
                              GATE {paperYear}
                            </span>
                            <h4 className="font-semibold text-stone-900">
                              {paper.title}
                            </h4>
                            {paper.source_name && (
                              <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                                {paper.source_name}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-stone-500">
                            {paper.duration_minutes} minutes · {paper.total_questions} questions · {paper.total_marks} marks
                          </p>

                          {/* Official Verified Links */}
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                            {paper.paper_url && (
                              <a
                                href={paper.paper_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-[#701a2b] hover:text-[#500713] hover:underline"
                                title="Open verified question paper on official portal"
                              >
                                <FileCheck2 className="h-3.5 w-3.5" />
                                Official Question Paper
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {paper.answer_key_url && (
                              <a
                                href={paper.answer_key_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-900 hover:underline"
                                title="Open verified answer key on official portal"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                Master Answer Key
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {officialPortal && (
                              <a
                                href={officialPortal}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-800 hover:underline"
                                title="Visit official organizing institute portal"
                              >
                                Official Portal
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {officialPortal && (
                            <a
                              href={paper.paper_url || officialPortal}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition inline-flex items-center gap-1"
                            >
                              Official Source
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          <button
                            disabled={starting || !hasQuestions}
                            onClick={() => void startPublishedPaper(Number(paper.id))}
                            className="rounded-xl bg-[#701a2b] px-4 py-2 text-xs font-semibold text-white hover:bg-[#500713] disabled:opacity-50 transition"
                            title={
                              hasQuestions
                                ? 'Start online interactive timed exam'
                                : 'Questions are being prepared by faculty'
                            }
                          >
                            {starting ? 'Opening...' : 'Take Online Exam →'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl bg-stone-50 p-6 text-center text-sm text-stone-500 space-y-2">
                  <p className="font-semibold text-stone-700">
                    No published previous-year papers were found.
                  </p>
                  <p className="text-xs">
                    Please ask faculty to add verified papers or refresh the test series.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-rose-200 bg-[#fff9f9] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#701a2b]">SELECTED TEST</p>
                  <h3 className="mt-1 font-serif text-lg font-bold text-stone-900">
                    {activeTestType}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500">
                    {activeTestType === 'Full Mock Test'
                      ? '50 questions · 90 minutes'
                      : '50 questions · 75 minutes'}
                  </p>
                  <p className="mt-2 text-xs text-stone-500">
                    {activeTestType === 'Full Mock Test'
                      ? 'Required distribution: 30 MCQ, 10 MSQ and 10 NAT.'
                      : activeTestType === 'Topic Test'
                        ? 'Questions are selected from the chosen topic.'
                        : 'Questions are selected from the chosen subject.'}
                  </p>
                </div>

                <button
                  disabled={
                    starting ||
                    ((activeTestType === 'Subject Test' ||
                      activeTestType === 'Topic Test') &&
                      !isValidId(selectedSubject)) ||
                    (activeTestType === 'Topic Test' &&
                      (!isValidId(selectedTopic) ||
                        topicsLoading ||
                        !topics.some(
                          topic => Number(topic.id) === Number(selectedTopic)
                        )))
                  }
                  onClick={() => {
                    setError('');
                    setShowInstructions(true);
                  }}
                  className="rounded-xl bg-[#701a2b] hover:bg-[#500713] px-6 py-3 text-sm font-semibold text-white shadow-xs hover:shadow-md transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {starting ? 'Preparing Test...' : 'Begin Test →'}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-8">
              <div className="rounded-2xl border border-rose-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-stone-900">My Test Attempts</h3>
                  {myAttempts.length > 0 && (
                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-[#701a2b]">
                      {myAttempts.length} {myAttempts.length === 1 ? 'Attempt' : 'Attempts'}
                    </span>
                  )}
                </div>

                {myAttempts.length > 0 ? (
                  <div className="divide-y divide-stone-100">
                    {myAttempts.map((attempt, index) => {
                      const attemptDate = formatDate(attempt.created_at);
                      const isCompleted = attempt.is_completed ?? true;
                      const rawScore = Number(attempt.score ?? 0);
                      const totalM = Number(attempt.total_marks ?? 100);
                      const pct = attempt.percentage !== undefined && attempt.percentage !== null
                        ? Math.max(0, Number(attempt.percentage))
                        : (totalM > 0 ? Math.round(Math.max(0, (rawScore / totalM) * 100) * 10) / 10 : 0);

                      return (
                        <div
                          key={attempt.id ?? index}
                          onClick={() => attempt.id && viewAttemptResult(attempt.id)}
                          className="group flex flex-wrap items-center justify-between gap-3 py-3.5 px-3 rounded-xl transition hover:bg-rose-50/40 cursor-pointer"
                          title="Click to view detailed test result and question review"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-stone-900 group-hover:text-[#701a2b] transition">
                                {attempt.test_title || 'Practice Test'}
                              </p>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  isCompleted
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {attempt.status || (isCompleted ? 'Completed' : 'In Progress')}
                              </span>
                            </div>
                            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                              {attemptDate && <span>{attemptDate}</span>}
                              {attemptDate && <span>·</span>}
                              <span>{attempt.correct_count ?? '—'} correct</span>
                              <span>·</span>
                              <span>{formatTime(attempt.time_taken_seconds ?? 0)}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold text-[#701a2b] text-base">
                                {Math.max(0, rawScore)}{' '}
                                <span className="text-xs font-normal text-stone-400">
                                  / {attempt.total_marks ?? '—'}
                                </span>
                              </p>
                              <span className="inline-block mt-0.5 rounded bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-700">
                                {pct}%
                              </span>
                            </div>

                            <div className="flex items-center text-xs font-semibold text-[#701a2b] opacity-80 group-hover:opacity-100 transition">
                              <Eye className="mr-1 h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Review</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="rounded-xl bg-stone-50 p-5 text-sm text-stone-500">
                    You have not attempted any tests yet. Your completed tests will appear here.
                  </p>
                )}
              </div>
            </div>

            <aside className="space-y-5 lg:col-span-4">
              <div className="rounded-2xl border border-rose-100 bg-white p-5">
                <h3 className="mb-4 font-bold text-stone-900">📊 Your Statistics</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Tests Attempted', calculatedStats.totalAttempts],
                    ['Average Percentage', `${calculatedStats.averagePercentage}%`],
                    ['Best Percentage', `${calculatedStats.bestPercentage}%`],
                    ['Questions Available', REQUIRED_QUESTIONS],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-xl bg-stone-50 p-3">
                      <p className="text-xs text-stone-500">{label}</p>
                      <p className="mt-1 text-lg font-bold text-[#701a2b]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-rose-100 bg-white p-5 text-sm">
                <h3 className="font-bold text-stone-900">💡 Test Tips</h3>
                <p className="text-stone-600">Read each question carefully before choosing an answer.</p>
                <p className="text-stone-600">For MSQ, select every option you believe is correct.</p>
                <p className="text-stone-600">For NAT, enter a numerical value.</p>
                <p className="text-stone-600">Check negative-marking rules before attempting uncertain answers.</p>
              </div>

              <div className="rounded-2xl border border-rose-100 bg-[#faf7f5] p-4 text-center text-xs italic text-[#701a2b]">
                {getTopicQuote('tests')}
              </div>
            </aside>
          </div>

          {showInstructions && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="test-instructions-title"
            >
              <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-[#8e2137]">
                      BEFORE YOU BEGIN
                    </p>
                    <h2
                      id="test-instructions-title"
                      className="mt-2 text-2xl font-serif font-bold text-[#500713]"
                    >
                      Test Instructions
                    </h2>
                  </div>
                  <button
                    aria-label="Close instructions"
                    onClick={() => setShowInstructions(false)}
                    className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
                  >
                    <X />
                  </button>
                </div>

                <div className="mt-5 space-y-4 text-sm text-stone-700">
                  <div className="rounded-xl bg-rose-50 p-4">
                    <p className="font-semibold text-[#701a2b]">{activeTestType}</p>

                    {activeTestType !== 'Full Mock Test' && (
                      <p className="mt-1">
                        Subject:{' '}
                        {subjects.find(
                          subject => Number(subject.id) === Number(selectedSubject)
                        )?.name || 'Selected subject'}
                      </p>
                    )}

                    {activeTestType === 'Topic Test' && (
                      <p>
                        Topic:{' '}
                        {topics.find(
                          topic => Number(topic.id) === Number(selectedTopic)
                        )?.title || 'Selected topic'}
                      </p>
                    )}

                    <p>
                      Questions:{' '}
                      {activeTestType === 'Full Mock Test'
                        ? REQUIRED_QUESTIONS
                        : activeTestType === 'Topic Test'
                          ? TOPIC_TEST_QUESTION_COUNT
                          : REQUIRED_QUESTIONS}
                    </p>

                    <p>
                      Duration:{' '}
                      {activeTestType === 'Full Mock Test'
                        ? FULL_MOCK_DURATION
                        : SUBJECT_TEST_DURATION}{' '}
                      minutes
                    </p>

                    {activeTestType === 'Full Mock Test' && (
                      <p>Required distribution: 30 MCQs, 10 MSQs and 10 NAT questions.</p>
                    )}
                  </div>

                  <ul className="list-disc space-y-2 pl-5">
                    <li>The timer starts when the test opens.</li>
                    <li>Use Previous, Next or the question palette to navigate.</li>
                    <li>MCQ: choose one option.</li>
                    <li>MSQ: choose all options you believe are correct.</li>
                    <li>NAT: enter your numerical answer.</li>
                    <li>Review unanswered questions before submitting.</li>
                    <li>The test attempts automatic submission when time expires.</li>
                    <li>Your score depends on the backend answer key and marking rules.</li>
                  </ul>

                  <p className="text-xs text-stone-500">
                    Full Mock, Subject and Topic tests each contain 50 questions strictly based on the official GATE ECE syllabus.
                  </p>
                </div>

                {error && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button
                      className="ml-auto"
                      onClick={() => setError('')}
                      aria-label="Dismiss error"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button
                    onClick={() => {
                      setError('');
                      setShowInstructions(false);
                    }}
                    className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={starting}
                    onClick={() => void startGeneratedTest()}
                    className="rounded-xl bg-[#701a2b] hover:bg-[#500713] px-6 py-3 text-sm font-semibold text-white shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {starting ? 'Preparing test...' : 'Start Test Now →'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && activeTestSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#500713]">
                Confirm Test Submission
              </h3>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to finish and submit your exam? You cannot modify your answers once submitted.
            </p>

            <div className="grid grid-cols-2 gap-3 rounded-xl bg-stone-50 p-4 text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2 col-span-2">
                <span className="text-stone-500 font-medium">Test:</span>
                <span className="font-semibold text-stone-800">{activeTestSession.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Total Questions:</span>
                <span className="font-bold text-stone-800">{activeTestSession.questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-700 font-medium">Answered:</span>
                <span className="font-bold text-emerald-700">
                  {activeTestSession.questions.filter(isAnswered).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-700 font-medium">Marked for Review:</span>
                <span className="font-bold text-purple-700">
                  {Object.values(markedForReview).filter(Boolean).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-rose-700 font-medium">Unanswered:</span>
                <span className="font-bold text-rose-700">
                  {activeTestSession.questions.filter(q => !isAnswered(q)).length}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
              >
                Resume Test
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setShowSubmitModal(false);
                  void submitTest();
                }}
                className="rounded-xl bg-[#701a2b] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#500713] disabled:opacity-50 transition"
              >
                {submitting ? 'Submitting...' : 'Yes, Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestsPage;