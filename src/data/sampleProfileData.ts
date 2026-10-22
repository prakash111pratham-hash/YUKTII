import { ApplicationRecord, ResumeData, UserProfile } from '../types';

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
