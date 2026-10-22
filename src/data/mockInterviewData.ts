import { MockInterviewQuestion } from '../types';

export const MOCK_INTERVIEW_QUESTIONS: MockInterviewQuestion[] = [
  // TECHNICAL
  {
    id: 'ti-1',
    round: 'Technical',
    category: 'Data Structures & Algorithms',
    question: 'How does a Hash Map handle collisions under the hood, and what happens when the load factor exceeds 0.75 in Java or Python?',
    sampleAnswerHints: [
      'Explain Separate Chaining (linked lists/red-black trees) vs Open Addressing (linear/quadratic probing).',
      'Explain that exceeding load factor triggers re-hashing with double capacity to maintain average O(1) amortized lookup.',
    ],
  },
  {
    id: 'ti-2',
    round: 'Technical',
    category: 'Database Management Systems',
    question: 'Can you explain the difference between Clustered and Non-Clustered Indexes in SQL, and when would you avoid indexing a column?',
    sampleAnswerHints: [
      'Clustered index defines the physical order of data rows (only 1 per table, usually Primary Key).',
      'Non-clustered index creates a separate B+ tree pointing to row addresses.',
      'Avoid indexing low-cardinality columns (e.g. Gender) or frequently updated tables where write overhead hurts throughput.',
    ],
  },
  {
    id: 'ti-3',
    round: 'Technical',
    category: 'Computer Networks & Web Systems',
    question: 'What happens step-by-step when you type https://google.com into your browser and press Enter?',
    sampleAnswerHints: [
      'DNS resolution (Browser cache -> OS -> Recursive Resolver -> Root/TLD/Authoritative).',
      'TCP 3-Way Handshake (SYN, SYN-ACK, ACK) + TLS 1.3 handshake.',
      'HTTP GET request dispatched, Reverse Proxy / Load Balancer routing, DOM rendering tree construction.',
    ],
  },
  {
    id: 'ti-4',
    round: 'Technical',
    category: 'Core Engineering & Circuits',
    question: 'For ECE/EEE: Why is Nyquist sampling theorem (fs >= 2*fm) vital in digital communication, and what is the role of an anti-aliasing filter?',
    sampleAnswerHints: [
      'Sampling below Nyquist rate causes spectral overlap (aliasing), irreparably distorting high-frequency components.',
      'Anti-aliasing low-pass filter eliminates signals above fm before sampling occurs.',
    ],
  },

  // HR ROUND
  {
    id: 'hr-1',
    round: 'HR',
    category: 'Self Introduction & Campus Fit',
    question: 'Walk me through your resume: highlighting one key project, your greatest engineering learning curve, and why you wish to join our company.',
    sampleAnswerHints: [
      'Structure using Present -> Past -> Future.',
      'Highlight concrete quantifiable project contribution (e.g. "built an automated portal used by 500 students").',
      'Express genuine knowledge of company business models and long-term learning goals.',
    ],
  },
  {
    id: 'hr-2',
    round: 'HR',
    category: 'Mobility & Career Vision',
    question: 'Are you comfortable relocating to our development center in Bengaluru, Pune, or Hyderabad, and where do you see yourself in 3 years?',
    sampleAnswerHints: [
      'Affirm cultural and geographical enthusiasm for major Indian tech hubs.',
      'Emphasize growing into an independent module owner with solid architectural depth and mentorship capability.',
    ],
  },
  {
    id: 'hr-3',
    round: 'HR',
    category: 'Handling Pressure & Work Ethics',
    question: 'Tell me about a time when your college project team had conflicting technical opinions or missed a critical deadline. How did you resolve it?',
    sampleAnswerHints: [
      'Use the STAR method (Situation, Task, Action, Result).',
      'Focus on objective data-driven decision making, active listening, and taking ownership rather than assigning blame.',
    ],
  },

  // BEHAVIORAL
  {
    id: 'bh-1',
    round: 'Behavioral',
    category: 'Ownership & Initiative',
    question: 'Describe an instance where you went beyond your syllabus or assignment requirements to solve an engineering problem.',
    sampleAnswerHints: [
      'Mention learning a framework outside coursework (e.g. Docker, Redis, or PyTorch).',
      'Describe open-source contributions, hackathon sprints, or building a practical tool for your college community.',
    ],
  },
];
