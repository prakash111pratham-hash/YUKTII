export type UserYear = 'Class 12 / JEE' | '1st Year' | '2nd Year' | '3rd Year' | '4th Year / Final';

export type BranchCode = 'CSE' | 'IT' | 'AIML' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'CHEM';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  authProvider?: 'google' | 'email' | 'phone';
  currentYear: UserYear;
  college?: string;
  city?: string;
  targetLPA?: number;
  selectedBranch?: BranchCode;
  jeeRank?: number;
  cgpa?: number;
  xp: number;
  streakDays: number;
  badges: string[];
  interests: string[];
  careerGoal?: string;
  completedAssessment: boolean;
  learningStyle?: 'Visual / Practical' | 'Analytical / Theoretical' | 'Project-Driven' | 'Collaborative';
}

export type EngineeringDomain = 'dsa' | 'system_design' | 'core_cs' | 'aptitude' | 'gd_verbal';

export interface PracticeSessionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  domain: EngineeringDomain;
  domainLabel: string;
  durationMinutes: number;
  intensity: 1 | 2 | 3 | 4;
  questionsSolved: number;
  notes?: string;
}

export interface DailyStudyGoal {
  targetHours: number;
  studiedHoursToday: number;
  streakDays: number;
  lastUpdated: string;
}

export interface CareerBadge {
  id: string;
  title: string;
  description: string;
  category: 'Milestone' | 'Skill' | 'Habit' | 'Elite';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpValue: number;
}

export interface LevelTier {
  level: number;
  title: string;
  badgeName: string;
  minXp: number;
  maxXp: number;
  perks: string[];
}

export interface RIASECScores {
  realistic: number; // Hands-on, mechanical
  investigative: number; // Analytical, research
  artistic: number; // Creative, design
  social: number; // People, teaching
  enterprising: number; // Leadership, business
  conventional: number; // Structured, data
}

export interface AptitudeScores {
  logical: number;
  quantitative: number;
  verbal: number;
  problemSolving: number;
  spatialMechanical: number;
  riasec: RIASECScores;
}

export interface BranchRecommendation {
  branchCode: BranchCode;
  name: string;
  matchScore: number; // 0-100
  badge: string;
  pros: string[];
  challenges: string[];
  curriculumFit: string;
  averageStartingLPA: {
    tier1: string;
    tier2: string;
    tier3: string;
  };
  topRecruiters: string[];
  whyFits: string;
}

export interface YearCurriculum {
  year: number;
  title: string;
  keySubjects: string[];
  handsOnLab: string;
  milestone: string;
}

export interface BranchDetail {
  code: BranchCode;
  name: string;
  tagline: string;
  iconName: string;
  overview: string;
  fourYearCurriculum: YearCurriculum[];
  keySkills: string[];
  roles: string[];
  industries: string[];
  averageStartingLPA: {
    tier1: string;
    tier2: string;
    tier3: string;
  };
  topRecruiters: string[];
  higherStudies: {
    gateScope: string;
    msOptions: string;
    mbaScope: string;
  };
  futureScope: string;
  emergingTrends: string[];
  crossBranchPaths: {
    targetRole: string;
    howToBridge: string;
    bridgeSkills: string[];
  }[];
}

export interface CareerPath {
  id: string;
  title: string;
  branchAffinity: BranchCode[];
  avgSalaryLPA: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  roadmapStages: {
    step: number;
    title: string;
    duration: string;
    topics: string[];
    freeResources: { name: string; url: string; platform: string }[];
    miniProject: string;
    quizTopic: string;
  }[];
}

export interface AssessmentQuestion {
  id: string;
  category: 'logical' | 'quantitative' | 'verbal' | 'problemSolving' | 'spatialMechanical' | 'riasec';
  riasecType?: keyof RIASECScores;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CompanyMockPattern {
  id: string;
  companyName: string;
  tier: 'Mass Recruiter' | 'Product Tech' | 'Core Engineering';
  packageRange: string;
  durationMinutes: number;
  totalQuestions: number;
  negativeMarking: string;
  sections: {
    name: string;
    questionCount: number;
    timeMinutes: number;
    cutoffPercent: number;
  }[];
  description: string;
  questions: AssessmentQuestion[];
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Arrays' | 'Strings' | 'Two Pointers' | 'Linked Lists' | 'Searching & Sorting' | 'Stack/Queue' | 'Trees/Graphs' | 'DP';
  companyTags: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
  testCases: {
    input: string;
    expectedOutput: string;
    hidden?: boolean;
  }[];
  timeComplexity: string;
  spaceComplexity: string;
  hints: string[];
  solutionExplanation: string;
}

export interface SpeakingFeedback {
  score: number; // 0-100
  wordsPerMinute: number;
  wpmRating: 'Too Slow' | 'Optimal Pace' | 'A Bit Fast' | 'Rushed';
  wordCount: number;
  durationSeconds: number;
  fillerWordsFound: { word: string; count: number }[];
  grammarNotes: string[];
  vocabularyHighlights: string[];
  strengths: string[];
  areasOfImprovement: string[];
  overallSummary: string;
}

export interface MockInterviewQuestion {
  id: string;
  round: 'Technical' | 'HR' | 'Behavioral';
  question: string;
  sampleAnswerHints: string[];
  category: string;
}

export interface MockInterviewResult {
  overallScore: number;
  technicalDepth: number;
  communicationClarity: number;
  confidenceScore: number;
  roundWise: {
    round: string;
    feedback: string;
    score: number;
  }[];
  recruiterVerdict: 'Strong Hire' | 'Hire' | 'Borderline / Needs Practice' | 'Re-attempt after preparation';
  detailedSuggestions: string[];
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolioUrl?: string;
  summary: string;
  education: {
    degree: string;
    institution: string;
    year: string;
    score: string; // e.g. "8.8 CGPA" or "94%"
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  projects: {
    title: string;
    techStack: string;
    liveLink?: string;
    githubLink?: string;
    bullets: string[];
  }[];
  experience?: {
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }[];
  achievements: string[];
  certifications: string[];
}

export interface ResumeAtsReport {
  score: number;
  bulletScore: number;
  keywordScore: number;
  formattingScore: number;
  detectedKeywords: string[];
  missingCrucialKeywords: string[];
  recommendations: string[];
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  logoUrl?: string;
  branchEligibility: BranchCode[];
  location: string;
  workMode: 'Remote' | 'Onsite' | 'Hybrid';
  stipend: string;
  duration: string;
  requiredSkills: string[];
  openings: number;
  deadline: string;
  description: string;
  perks: string[];
}

export interface ApplicationRecord {
  id: string;
  internshipId: string;
  company: string;
  title: string;
  appliedDate: string;
  status: 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  notes: string;
  deadline?: string;
}

export interface PlacementReadinessMeter {
  overallScore: number; // 0-100
  readinessBand: 'Day-1 Ready' | 'Near Ready' | 'Needs Targeted Prep' | 'Beginner Phase';
  breakdown: {
    aptitude: number;
    coding: number;
    communication: number;
    technical: number;
    resume: number;
  };
  prioritizedActionPlan: {
    priority: 'High' | 'Medium' | 'Low';
    action: string;
    impact: string;
    estimatedDays: number;
    targetModule: string;
  }[];
}
