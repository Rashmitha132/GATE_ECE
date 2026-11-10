export type DiagramKind =
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

export type PracticeQuestion = {
  question: string;
  type: 'MCQ' | 'NAT';
  options?: string[];
  answer: string;
  explanation: string;
};

export type FormulaItem = {
  equation: string;
  meaning: string;
  conditions?: string;
};

export type Lesson = {
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

export type TopicItem = {
  title: string;
  summary: string;
  orderIndex: number;
  lesson: Lesson;
};
