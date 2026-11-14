export type QuoteTopic = 
  | 'dashboard_hero'
  | 'dashboard_subtitle'
  | 'dashboard_goal'
  | 'dashboard_footer'
  | 'sidebar'
  | 'practice'
  | 'subjects'
  | 'learn'
  | 'tests'
  | 'performance'
  | 'resources';

const TOPIC_QUOTES: Record<QuoteTopic, string[]> = {
  dashboard_hero: [
    '“Discipline today, freedom tomorrow.”',
    '“The secret of getting ahead is getting started.”',
    '“Your future is created by what you do today, not tomorrow.”',
    '“Excellence is not an act, but a daily habit.”',
    '“Push yourself, because no one else is going to do it for you.”',
    '“Dream big, start small, begin now.”',
    '“Success is the sum of small efforts repeated daily.”',
    '“Believe you can and you’re halfway there.”'
  ],
  dashboard_subtitle: [
    'Small steps every day lead to big results.',
    'Consistency is the bridge between goals and achievement.',
    'Focus on your progress, trust your preparation.',
    'Every problem you solve today strengthens tomorrow’s rank.',
    'Commitment turns potential into peak performance.',
    'Dedication in the quiet hours brings glory in the exam hall.'
  ],
  dashboard_goal: [
    'Progress, not perfection ♥',
    'One focused question at a time ♥',
    'Daily consistency beats occasional intensity ♥',
    'Win the day with daily targets ♥',
    'Every checkmark counts towards your dream rank ♥',
    'Small daily milestones build mastery ♥'
  ],
  dashboard_footer: [
    'Not just a preparation, but a step towards your future.',
    'Your ambition will open doors; your preparation will keep them open.',
    'Engineering your path to premier IITs, IISc, and PSUs.',
    'Every derivation mastered is a mark earned in GATE.',
    'Hard work beats talent when talent doesn’t work hard.',
    'Turn your GATE aspirations into inspiring achievements.'
  ],
  sidebar: [
    '“Your GATE Journey Matters”',
    '“Aim for Top 100 AIR”',
    '“Master Every Concept”',
    '“Consistency Creates Toppers”',
    '“From Classroom to IISc / IIT”',
    '“Small Steps, Giant Leaps”'
  ],
  practice: [
    '“Every solved problem is a step closer to conceptual clarity.”',
    '“Practice does not make perfect; perfect practice makes mastery.”',
    '“Analyze your mistakes today so the exam hall holds no surprises.”',
    '“Speed comes with clarity, accuracy comes with rigorous practice.”',
    '“Derive with patience, calculate with precision.”',
    '“The more you sweat in practice, the less you struggle in the exam.”'
  ],
  subjects: [
    '“Every high score begins with a structured syllabus roadmap.”',
    '“Master each core topic step by step across all 11 modules.”',
    '“Clear boundaries and systematic coverage guarantee confidence.”',
    '“Syllabus mastery is half the battle won.”',
    '“Small steps in the right direction lead to big results.”'
  ],
  learn: [
    '“Concepts are the foundation; formulas are just tools.”',
    '“Deep understanding turns complex circuits into intuitive insights.”',
    '“When you master the physics, the mathematics falls into place.”',
    '“Learn to understand deeply, not just to memorize temporarily.”',
    '“Clarity of fundamentals is the ultimate competitive advantage.”'
  ],
  tests: [
    '“Mocks are where you make mistakes so the real exam is flawless.”',
    '“Stay calm, manage your clock, and trust your analytical preparation.”',
    '“A mock test evaluates your current preparation, not your final capability.”',
    '“Breathe, analyze the question, compute accurately, and conquer.”',
    '“Real exam temperament is forged through rigorous mock simulations.”'
  ],
  performance: [
    '“What gets measured gets improved.”',
    '“Track your accuracy, identify weak areas, and elevate your rank.”',
    '“Data-driven preparation transforms hard work into peak rank.”',
    '“Celebrate your progress; every single percent reflects your effort.”',
    '“Your percentile today is the springboard for tomorrow’s victory.”'
  ],
  resources: [
    '“Formulas at your fingertips, derivations sharp in your mind.”',
    '“Timely revision bridges short-term memory and permanent exam mastery.”',
    '“Structured notes today ensure instantaneous recall on exam day.”',
    '“Formula mastery turns 3-minute questions into 30-second answers.”',
    '“Review often, retain deeply, recall instantly.”'
  ]
};

const SIDEBAR_ROLE_QUOTES: Record<'student' | 'faculty' | 'admin', string[]> = {
  student: [
    '“Your GATE Journey Matters”',
    '“Aim for Top 100 AIR”',
    '“Master Every Concept”',
    '“Consistency Creates Toppers”',
    '“From Classroom to IISc / IIT”',
    '“Small Steps, Giant Leaps”'
  ],
  faculty: [
    '“Guiding Future Engineers”',
    '“Empowering ECE Aspirants”',
    '“Mentorship Inspires Excellence”',
    '“Shaping Tomorrow’s Innovators”',
    '“Excellence in ECE Pedagogy”'
  ],
  admin: [
    '“Institutional Excellence”',
    '“Quality Education & Governance”',
    '“Empowering GSSSIETW Scholars”',
    '“Leadership in Technical Education”'
  ]
};

/**
 * Gets the current login seed integer from storage, or initializes one.
 */
export function getQuoteSeed(): number {
  try {
    const stored = localStorage.getItem('gate_quote_seed');
    if (stored) {
      return parseInt(stored, 10) || 0;
    }
  } catch {}
  return 0;
}

/**
 * Rotates the quote seed on every successful login.
 */
export function rotateQuoteSeed(): void {
  try {
    const current = getQuoteSeed();
    localStorage.setItem('gate_quote_seed', (current + 1).toString());
  } catch {}
}

/**
 * Returns a topic-specific quote that rotates cleanly with every login.
 */
export function getTopicQuote(topic: QuoteTopic, offset = 0): string {
  const list = TOPIC_QUOTES[topic] || TOPIC_QUOTES.dashboard_hero;
  const seed = getQuoteSeed();
  const index = Math.abs(seed + offset) % list.length;
  return list[index];
}

/**
 * Returns a role-specific sidebar quote that rotates cleanly with every login.
 */
export function getSidebarRoleQuote(role?: 'student' | 'faculty' | 'admin'): string {
  const userRole = role || 'student';
  const list = SIDEBAR_ROLE_QUOTES[userRole] || SIDEBAR_ROLE_QUOTES.student;
  const seed = getQuoteSeed();
  const index = Math.abs(seed) % list.length;
  return list[index];
}
