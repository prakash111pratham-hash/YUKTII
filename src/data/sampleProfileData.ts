import { ApplicationRecord, ResumeData, UserProfile, DailyStudyGoal, CareerBadge } from '../types';

export const SAMPLE_STUDENT_PROFILE: UserProfile = {
  id: 'usr-sreya',
  name: 'Sreya Sengupta',
  email: 'sreya0913@gmail.com',
  avatar: undefined,
  currentYear: '1st Year',
  college: 'National Institute of Technology (NIT)',
  city: 'Bengaluru / Kolkata',
  targetLPA: 18,
  selectedBranch: 'CSE',
  cgpa: 8.5,
  xp: 0, // Starts fresh from zero
  streakDays: 0, // Starts fresh from zero
  badges: [],
  interests: ['Coding', 'Algorithms', 'Web Systems', 'AI/ML'],
  careerGoal: 'Secure Tier-1 Product Engineering Offer (18+ LPA) in Campus Drives',
  completedAssessment: false,
  learningStyle: 'Project-Driven',
  isPhoneVerified: false,
  isEmailVerified: true,
};

export const SAMPLE_RESUME_DATA: ResumeData = {
  fullName: 'Sreya Sengupta',
  email: 'sreya0913@gmail.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  linkedin: '',
  github: '',
  portfolioUrl: '',
  summary:
    'Aspiring B.Tech Computer Science student with strong foundations in Data Structures, Problem Solving, and Web Systems. Passionate about software architecture and campus placements.',
  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'National Institute of Technology (NIT)',
      year: '2024 - 2028',
      score: '8.5 CGPA',
    },
    {
      degree: 'Class 12th Senior Secondary (CBSE - PCM)',
      institution: 'Delhi Public School',
      year: '2024',
      score: '95.4%',
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['C++', 'Python', 'JavaScript', 'TypeScript', 'SQL'],
    },
    {
      category: 'Frameworks & Libraries',
      items: ['React', 'Node.js', 'Express', 'Tailwind CSS'],
    },
    {
      category: 'Developer Tools & DBs',
      items: ['PostgreSQL', 'Git', 'Linux Bash', 'Docker'],
    },
  ],
  projects: [
    {
      title: 'Real-Time Campus Placement & Career Preparation Platform',
      techStack: 'React, Node.js, Cloud SQL PostgreSQL, Tailwind',
      bullets: [
        'Built full-stack student platform with diagnostic assessments, coding challenges, and real mobile OTP verification.',
        'Integrated PostgreSQL relational database for secure user session tracking and daily study logging.',
      ],
    },
  ],
  achievements: [
    'Admitted to Computer Science & Engineering Department with top entrance percentile.',
    'Active participant in collegiate algorithm sprints and hackathons.',
  ],
  certifications: [
    'Foundations of Data Structures & Algorithms (Coursera)',
  ],
};

export const SAMPLE_APPLICATIONS: ApplicationRecord[] = [];

export const SAMPLE_STUDY_GOAL: DailyStudyGoal = {
  targetHours: 3.0,
  studiedHoursToday: 0.0,
  streakDays: 0,
  lastUpdated: new Date().toISOString(),
};

export const LEVEL_TIERS = [
  {
    level: 1,
    title: 'Engineering Aspirant',
    badgeName: 'First Spark',
    minXp: 0,
    maxXp: 500,
    perks: ['Unlock Stage 1 Diagnostic Tests', 'Basic Resume Template'],
  },
  {
    level: 2,
    title: 'Code Craftsman',
    badgeName: 'Algorithm Explorer',
    minXp: 500,
    maxXp: 1200,
    perks: ['Unlock 30+ Coding Challenges', 'Speech Cadence Analyzer'],
  },
  {
    level: 3,
    title: 'System Builder',
    badgeName: 'Full-Stack Vanguard',
    minXp: 1200,
    maxXp: 2200,
    perks: ['TCS/Infosys Advanced Coding Mocks', 'ATS Resume Optimizer'],
  },
  {
    level: 4,
    title: 'Campus Ready Pro',
    badgeName: 'Day-1 Contender',
    minXp: 2200,
    maxXp: 3500,
    perks: ['AI Mock Technical & HR Rounds', 'Direct Referral Pool'],
  },
  {
    level: 5,
    title: 'Day-1 Achiever',
    badgeName: 'Elite Placement Master',
    minXp: 3500,
    maxXp: 5000,
    perks: ['Product SDE Tier-1 Direct Tracking', 'Alumni Mentorship Access'],
  },
];

export const CAREER_BADGES_DATA: CareerBadge[] = [
  {
    id: 'b-first-diagnostic',
    title: 'Cognitive Spark',
    description: 'Completed the 5-Domain Engineering Aptitude Diagnostic',
    category: 'Milestone' as const,
    icon: 'Compass',
    unlocked: false,
    xpValue: 100,
  },
  {
    id: 'b-branch-fit',
    title: 'Branch Explorer',
    description: 'Analyzed top branch fits and curriculum alignments',
    category: 'Milestone' as const,
    icon: 'BookOpen',
    unlocked: false,
    xpValue: 100,
  },
  {
    id: 'b-streak-7',
    title: 'Consistency Champion',
    description: 'Maintained 7 consecutive days of engineering practice',
    category: 'Habit' as const,
    icon: 'Flame',
    unlocked: false,
    xpValue: 150,
  },
  {
    id: 'b-dsa-master',
    title: 'Algorithm Pioneer',
    description: 'Solved 10+ core Data Structure & Algorithm challenges',
    category: 'Skill' as const,
    icon: 'Terminal',
    unlocked: false,
    xpValue: 200,
  },
  {
    id: 'b-verbal-speech',
    title: 'GD Eloquence',
    description: 'Scored 85+ on AI Spoken Placement cadence & grammar evaluation',
    category: 'Skill' as const,
    icon: 'Mic',
    unlocked: false,
    xpValue: 150,
  },
  {
    id: 'b-resume-ats',
    title: 'ATS Certified',
    description: 'Generated 90+ score resume with XYZ quantifiable metrics',
    category: 'Skill' as const,
    icon: 'FileCheck',
    unlocked: false,
    xpValue: 150,
  },
  {
    id: 'b-mock-interview',
    title: 'Interview Ace',
    description: 'Aced AI Technical & HR placement rounds',
    category: 'Skill' as const,
    icon: 'Award',
    unlocked: false,
    xpValue: 200,
  },
  {
    id: 'b-day1-offer',
    title: 'Day-1 Dream Offer',
    description: 'Secured Tier-1 product engineering campus offer (₹18+ LPA)',
    category: 'Elite' as const,
    icon: 'Sparkles',
    unlocked: false,
    xpValue: 500,
  },
];

export function generateInitialPracticeSessions() {
  return []; // Fresh from zero
}

export function createFreshUserProfile(overrides?: Partial<UserProfile>): UserProfile {
  const name = overrides?.name || 'Sreya Sengupta';
  const email = overrides?.email || 'sreya0913@gmail.com';
  return {
    id: overrides?.id || `usr-${Date.now()}`,
    name,
    email,
    avatar: undefined,
    phoneNumber: overrides?.phoneNumber,
    isPhoneVerified: Boolean(overrides?.isPhoneVerified),
    isEmailVerified: true,
    authProvider: overrides?.authProvider || 'email',
    currentYear: overrides?.currentYear || '1st Year',
    college: overrides?.college || 'National Institute of Technology (NIT)',
    city: overrides?.city || 'India',
    targetLPA: overrides?.targetLPA || 18,
    selectedBranch: overrides?.selectedBranch || 'CSE',
    jeeRank: overrides?.jeeRank,
    cgpa: overrides?.cgpa || 8.5,
    xp: overrides?.xp ?? 0, // Starts at fresh zero
    streakDays: overrides?.streakDays ?? 0,
    badges: [],
    interests: ['Data Structures', 'Web Systems', 'Algorithms'],
    careerGoal: overrides?.careerGoal || 'Crack Tier-1 Product Engineering Campus Placement',
    completedAssessment: false,
    learningStyle: 'Project-Driven',
  };
}

export function createFreshResumeData(user: UserProfile): ResumeData {
  return {
    fullName: user.name,
    email: user.email,
    phone: user.phoneNumber || '+91 ',
    location: user.city || 'India',
    linkedin: '',
    github: '',
    portfolioUrl: '',
    summary: `Aspiring ${user.selectedBranch || 'Computer Science'} engineering student at ${user.college || 'Engineering College'} with focus on scalable software systems, algorithms, and practical development.`,
    education: [
      {
        degree: `B.Tech in ${user.selectedBranch || 'Computer Science & Engineering'}`,
        institution: user.college || 'Engineering College',
        year: '2024 - 2028',
        score: `${user.cgpa || 8.5} CGPA`,
      },
    ],
    skills: [
      {
        category: 'Programming Languages',
        items: ['C++', 'Python', 'Java', 'JavaScript', 'SQL'],
      },
      {
        category: 'Frameworks & Tools',
        items: ['React', 'Node.js', 'Express', 'Git', 'Linux'],
      },
    ],
    projects: [
      {
        title: 'Full-Stack Engineering Portal',
        techStack: 'React, Node.js, Express, Tailwind CSS',
        bullets: [
          'Engineered interactive student preparation dashboard with modular design and zero latency.',
          'Built responsive interfaces for daily study tracking and cognitive aptitude diagnostics.',
        ],
      },
    ],
    experience: [],
    achievements: [
      'Admitted to Department of Engineering with focus on Software Systems.',
    ],
    certifications: [],
  };
}

export function createFreshStudyGoal(): DailyStudyGoal {
  return {
    targetHours: 3.0,
    studiedHoursToday: 0.0,
    streakDays: 0,
    lastUpdated: new Date().toISOString(),
  };
}

export function createFreshBadges(): CareerBadge[] {
  return CAREER_BADGES_DATA.map((b) => ({
    ...b,
    unlocked: false,
    unlockedAt: undefined,
  }));
}
