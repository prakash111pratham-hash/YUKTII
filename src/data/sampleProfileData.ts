import { ApplicationRecord, ResumeData, UserProfile, DailyStudyGoal, CareerBadge } from '../types';

export const SAMPLE_STUDENT_PROFILE: UserProfile = {
  id: 'usr-101',
  name: 'Pratham',
  email: 'prakash111pratham@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  currentYear: '3rd Year',
  college: 'National Institute of Technology (NIT) Surathkal',
  city: 'Mangaluru / Bengaluru',
  targetLPA: 18,
  selectedBranch: 'CSE',
  jeeRank: 4820,
  cgpa: 8.75,
  xp: 1450,
  streakDays: 14,
  badges: ['CodeWarrior 14-Day Streak', 'Aptitude Ace (Top 5%)', 'Campus GD Speaker', 'Resume ATS Certified'],
  interests: ['Coding', 'Algorithms', 'Web Systems', 'AI/ML', 'Robotics'],
  careerGoal: 'Secure Tier-1 Product SDE Offer (18+ LPA) in Day-1 Campus Drives',
  completedAssessment: true,
  learningStyle: 'Project-Driven',
};

export const SAMPLE_RESUME_DATA: ResumeData = {
  fullName: 'Pratham',
  email: 'prakash111pratham@gmail.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  linkedin: 'https://www.linkedin.com/in/pratham-prakash-3a8033362/?',
  github: 'https://github.com/prakash111pratham-hash',
  portfolioUrl: 'https://github.com/prakash111pratham-hash',
  summary:
    'Dedicated 3rd Year B.Tech Computer Science student with strong foundations in Data Structures, Relational Database Internals, and Full-Stack Engineering. Proven record building low-latency web platforms and leading college tech teams.',
  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'NIT Surathkal',
      year: '2023 - 2027',
      score: '8.75 CGPA',
    },
    {
      degree: 'Class 12th Senior Secondary (CBSE - PCM)',
      institution: 'Delhi Public School (DPS), R.K. Puram',
      year: '2023',
      score: '96.2%',
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['C++', 'Python', 'TypeScript', 'JavaScript', 'SQL'],
    },
    {
      category: 'Frameworks & Libraries',
      items: ['React 19', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS'],
    },
    {
      category: 'Developer Tools & DBs',
      items: ['PostgreSQL', 'Redis', 'Docker', 'Git', 'Linux Bash', 'Postman'],
    },
  ],
  projects: [
    {
      title: 'Real-Time Campus Placement & Mock Drive Portal',
      techStack: 'React, Node.js, PostgreSQL, Redis, Tailwind',
      liveLink: 'https://campus-placement.demo.app',
      githubLink: 'https://github.com/prakash111pratham-hash/campus-portal',
      bullets: [
        'Architected high-throughput web application managing 1,200+ active student placement applicants and 45 recruiters.',
        'Engineered Redis caching layer, decreasing average database query latency by 42% during peak rush drives.',
        'Implemented automated ATS resume parsing engine with 89% extraction accuracy for campus recruitment teams.',
      ],
    },
    {
      title: 'Distributed File Chunking & Sync Engine',
      techStack: 'C++, Sockets, Multithreading, SQLite',
      githubLink: 'https://github.com/prakash111pratham-hash/p2p-sync',
      bullets: [
        'Built peer-to-peer file transfer system in C++ supporting simultaneous resume resume chunking and parallel hashing.',
        'Achieved 120 MB/s local network transfer rate with zero packet corruption using checksum verification.',
      ],
    },
  ],
  achievements: [
    'Ranked in the top 3% out of 180,000 students in TCS CodeVita Season 12.',
    'JEE Advanced All India Rank: 4,820 (among top 2% nationwide).',
    'Finalist at Smart India Hackathon (SIH) 2025 in the Smart Education theme.',
  ],
  certifications: [
    'AWS Certified Cloud Practitioner (Amazon Web Services)',
    'Meta Front-End Developer Professional Certificate (Coursera)',
  ],
};

export const SAMPLE_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-1',
    internshipId: 'int-1',
    company: 'Zoho Corporation',
    title: 'Software Development Engineer Intern',
    appliedDate: '2026-10-18',
    status: 'Interview',
    notes: 'Technical Round 1 scheduled for next Tuesday at 3:00 PM. Focus on Java OOP and DBMS indexing.',
    deadline: '2026-11-20',
  },
  {
    id: 'app-2',
    internshipId: 'int-2',
    company: 'Swiggy',
    title: 'Full-Stack Web Development Intern',
    appliedDate: '2026-10-15',
    status: 'Applied',
    notes: 'Submitted resume via referral. HackerEarth coding challenge link expected in 48 hours.',
    deadline: '2026-11-25',
  },
  {
    id: 'app-3',
    internshipId: 'int-5',
    company: 'Qualcomm India',
    title: 'VLSI Silicon Physical Design Intern',
    appliedDate: '2026-10-10',
    status: 'Saved',
    notes: 'Need to review Static Timing Analysis (STA) notes before applying.',
    deadline: '2026-12-10',
  },
];

export const SAMPLE_STUDY_GOAL = {
  targetHours: 3.5,
  studiedHoursToday: 2.5,
  streakDays: 14,
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
    title: 'Algorithmic Contender',
    badgeName: 'Assessment Ace',
    minXp: 1200,
    maxXp: 2200,
    perks: ['TCS / Infosys Mock Series', 'AI Resume Bullet Optimizer'],
  },
  {
    level: 4,
    title: 'System Architect',
    badgeName: 'Full-Stack Pioneer',
    minXp: 2200,
    maxXp: 3500,
    perks: ['System Design High-Yield Notes', 'Direct Referral Badge'],
  },
  {
    level: 5,
    title: 'Placement Contender',
    badgeName: 'Internship Conqueror',
    minXp: 3500,
    maxXp: 5000,
    perks: ['AI Mock Technical Interviewer', 'Priority TPO Shortlisting'],
  },
  {
    level: 6,
    title: 'Day-1 Dream Offer Elite',
    badgeName: 'Day-1 Placement Star',
    minXp: 5000,
    maxXp: 10000,
    perks: ['Executive Mock Rounds', 'Top Tier Product Recruiter Pass'],
  },
];

export const CAREER_BADGES_DATA = [
  {
    id: 'b-assess-ace',
    title: 'Assessment Ace',
    description: 'Scored 85%+ in Stage 1 Cognitive & Technical Diagnostic',
    category: 'Milestone' as const,
    icon: 'Target',
    unlocked: true,
    unlockedAt: 'Aug 2025',
    xpValue: 150,
  },
  {
    id: 'b-dsa-warrior',
    title: 'DSA 100 Solved',
    description: 'Completed 100+ Data Structures & Algorithms challenges',
    category: 'Skill' as const,
    icon: 'Cpu',
    unlocked: true,
    unlockedAt: 'Oct 2025',
    xpValue: 250,
  },
  {
    id: 'b-streak-14',
    title: '14-Day Study Streak',
    description: 'Maintained active engineering preparation for 14 continuous days',
    category: 'Habit' as const,
    icon: 'Flame',
    unlocked: true,
    unlockedAt: 'Oct 2026',
    xpValue: 200,
  },
  {
    id: 'b-ats-ready',
    title: 'ATS Resume Certified',
    description: 'Achieved 88%+ recruiter match score with Google XYZ bullet points',
    category: 'Milestone' as const,
    icon: 'FileCheck',
    unlocked: true,
    unlockedAt: 'Oct 2026',
    xpValue: 200,
  },
  {
    id: 'b-intern-secured',
    title: 'Internship Secured',
    description: 'Cleared technical interviews and landed summer industrial internship',
    category: 'Elite' as const,
    icon: 'Briefcase',
    unlocked: true,
    unlockedAt: 'Sep 2026',
    xpValue: 350,
  },
  {
    id: 'b-sys-design',
    title: 'Distributed Thinker',
    description: 'Completed System Design simulations including microservices and caching',
    category: 'Skill' as const,
    icon: 'Zap',
    unlocked: false,
    xpValue: 300,
  },
  {
    id: 'b-gd-fluent',
    title: 'Campus GD Orator',
    description: 'Achieved 85%+ fluency and 140 WPM speech delivery without filler words',
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

// Helper to generate realistic historical practice sessions for past 12 weeks
export function generateInitialPracticeSessions() {
  const sessions = [];
  const domains = [
    { domain: 'dsa' as const, label: 'Data Structures & Algorithms', avgMinutes: 60, questions: 3 },
    { domain: 'system_design' as const, label: 'System Design & Architecture', avgMinutes: 45, questions: 1 },
    { domain: 'core_cs' as const, label: 'Core CS (OS/DBMS/CN)', avgMinutes: 40, questions: 4 },
    { domain: 'aptitude' as const, label: 'Quant & Logical Aptitude', avgMinutes: 35, questions: 15 },
    { domain: 'gd_verbal' as const, label: 'Verbal & Mock GD Speech', avgMinutes: 30, questions: 2 },
  ];

  const now = new Date();
  // 84 days (12 weeks)
  for (let i = 84; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayOfWeek = d.getDay(); // 0 is Sun

    // Higher frequency on weekdays, occasional rest day on Sun
    const shouldHaveSession = (i % 7 !== 0) || (i % 3 === 0);
    if (!shouldHaveSession) continue;

    // Pick 1 or 2 domains practiced that day
    const sessionCount = (i % 4 === 0) ? 2 : 1;
    for (let s = 0; s < sessionCount; s++) {
      const domainIndex = (i * 3 + s * 2 + dayOfWeek) % domains.length;
      const dom = domains[domainIndex];
      const intensity = ((i + s) % 4 + 1) as 1 | 2 | 3 | 4;
      const minutes = intensity * 25 + (i % 15);

      sessions.push({
        id: `sess-${dateStr}-${dom.domain}-${s}`,
        date: dateStr,
        domain: dom.domain,
        domainLabel: dom.label,
        durationMinutes: minutes,
        intensity,
        questionsSolved: Math.max(1, Math.round(dom.questions * (intensity / 2))),
        notes: `Focus practice on ${dom.label} fundamentals`,
      });
    }
  }

  // Ensure today has recent sessions
  const todayStr = now.toISOString().slice(0, 10);
  sessions.push({
    id: `sess-${todayStr}-dsa-today`,
    date: todayStr,
    domain: 'dsa' as const,
    domainLabel: 'Data Structures & Algorithms',
    durationMinutes: 90,
    intensity: 4 as const,
    questionsSolved: 5,
    notes: 'Binary Trees & Lowest Common Ancestor LeetCode Hard',
  });
  sessions.push({
    id: `sess-${todayStr}-system-design-today`,
    date: todayStr,
    domain: 'system_design' as const,
    domainLabel: 'System Design & Architecture',
    durationMinutes: 60,
    intensity: 3 as const,
    questionsSolved: 2,
    notes: 'Distributed Caching & Redis LRU Eviction Strategies',
  });

  return sessions;
}

export function createFreshUserProfile(overrides?: Partial<UserProfile>): UserProfile {
  const name = overrides?.name || 'New Student';
  const email = overrides?.email || 'student@engineering.edu';
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
    college: overrides?.college || 'Engineering College',
    city: overrides?.city || 'India',
    targetLPA: overrides?.targetLPA || 14,
    selectedBranch: overrides?.selectedBranch || 'CSE',
    jeeRank: overrides?.jeeRank,
    cgpa: overrides?.cgpa || 8.0,
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
        score: `${user.cgpa || 8.0} CGPA`,
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


