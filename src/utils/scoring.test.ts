import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAptitudeScores,
  calculateBranchFit,
  analyzeSpeechText,
  calculateResumeAtsScore,
  calculatePlacementReadiness,
  matchInternship,
} from './scoring';
import { AssessmentQuestion, ResumeData, Internship } from '../types';

test('calculateAptitudeScores computes correct percentages and RIASEC', () => {
  const mockQuestions: AssessmentQuestion[] = [
    {
      id: 'q1',
      category: 'logical',
      question: 'Next in sequence: 2, 4, 8, 16?',
      options: ['24', '32', '30', '64'],
      correctIndex: 1,
      explanation: 'Powers of 2',
      difficulty: 'Easy',
    },
    {
      id: 'q2',
      category: 'quantitative',
      question: 'Square of 15?',
      options: ['225', '215', '205', '195'],
      correctIndex: 0,
      explanation: '15*15 = 225',
      difficulty: 'Easy',
    },
    {
      id: 'q3',
      category: 'riasec',
      riasecType: 'investigative',
      question: 'Do you like solving math puzzles?',
      options: ['Rarely', 'Sometimes', 'Often', 'Passionately'],
      correctIndex: 0,
      explanation: '',
      difficulty: 'Easy',
    },
  ];

  const answers = [
    { questionId: 'q1', selectedIndex: 1 }, // correct
    { questionId: 'q2', selectedIndex: 0 }, // correct
    { questionId: 'q3', selectedIndex: 3 }, // RIASEC index 3 => +80 points
  ];

  const scores = calculateAptitudeScores(answers, mockQuestions);
  assert.equal(scores.logical, 100);
  assert.equal(scores.quantitative, 100);
  assert.ok(scores.riasec.investigative > 50);
});

test('calculateBranchFit returns sorted branch recommendations with match scores', () => {
  const mockScores = {
    logical: 90,
    quantitative: 85,
    verbal: 80,
    problemSolving: 92,
    spatialMechanical: 60,
    riasec: {
      realistic: 20,
      investigative: 80,
      artistic: 20,
      social: 20,
      enterprising: 40,
      conventional: 40,
    },
  };

  const recommendations = calculateBranchFit(mockScores, ['coding', 'apps', 'ai']);
  assert.ok(recommendations.length >= 8);
  // High problem solving, logical, and coding interest should place CSE or AIML at top
  const topCodes = recommendations.slice(0, 3).map((r) => r.branchCode);
  assert.ok(topCodes.includes('CSE') || topCodes.includes('AIML'));
  assert.ok(recommendations[0].matchScore >= recommendations[1].matchScore);
});

test('analyzeSpeechText accurately calculates WPM and detects Indian filler words', () => {
  const sampleTranscript =
    'Basically in my project I actually used React and Node.js. Like you know, we had to handle high traffic and honestly it was quite challenging right.';
  // 25 words in 12 seconds => ~125 WPM
  const feedback = analyzeSpeechText(sampleTranscript, 12);

  assert.equal(feedback.wpmRating, 'Optimal Pace');
  assert.ok(feedback.wordsPerMinute >= 120 && feedback.wordsPerMinute <= 170);
  assert.ok(feedback.fillerWordsFound.length >= 3);
  const foundWords = feedback.fillerWordsFound.map((f) => f.word);
  assert.ok(foundWords.includes('basically'));
  assert.ok(foundWords.includes('actually'));
  assert.ok(foundWords.includes('you know'));
});

test('calculateResumeAtsScore rates completeness and detects keywords', () => {
  const mockResume: ResumeData = {
    fullName: 'Arjun Sharma',
    email: 'arjun@example.com',
    phone: '+91 9876543210',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/arjun-sharma',
    github: 'github.com/arjun-dev',
    summary: 'B.Tech Computer Science student passionate about full stack systems.',
    education: [
      {
        degree: 'B.Tech Computer Science & Engineering',
        institution: 'NIT Surathkal',
        year: '2022 - 2026',
        score: '8.8 CGPA',
      },
    ],
    skills: [
      {
        category: 'Core',
        items: ['Data Structures', 'Algorithms', 'SQL', 'Git', 'REST API', 'JavaScript', 'Python'],
      },
    ],
    projects: [
      {
        title: 'Campus Placement Portal',
        techStack: 'React, Node.js, PostgreSQL',
        bullets: [
          'Architected full-stack portal serving 1200+ students with 40% reduced query latency.',
          'Engineered automated resume parser handling 500+ PDFs seamlessly.',
        ],
      },
    ],
    achievements: ['Ranked Top 5% in TCS CodeVita', 'JEE Advanced AIR 4200'],
    certifications: ['AWS Cloud Practitioner'],
  };

  const report = calculateResumeAtsScore(mockResume);
  assert.ok(report.score >= 70, `Expected score >= 70, got ${report.score}`);
  assert.ok(report.detectedKeywords.includes('Data Structures'));
  assert.ok(report.detectedKeywords.includes('Algorithms'));
});

test('calculatePlacementReadiness provides composite score and action plan', () => {
  const readiness = calculatePlacementReadiness({}, {
    aptitude: 60,
    coding: 55,
    communication: 80,
    technical: 65,
    resume: 70,
  });

  assert.ok(readiness.overallScore > 0 && readiness.overallScore < 100);
  assert.ok(readiness.prioritizedActionPlan.length >= 2);
  const targetModules = readiness.prioritizedActionPlan.map((p) => p.targetModule);
  assert.ok(targetModules.includes('practice/coding'));
});

test('matchInternship calculates skill match and provides 7-day bridge roadmap', () => {
  const mockInternship: Internship = {
    id: 'int-1',
    title: 'Software Development Engineer Intern',
    company: 'Zoho Corporation',
    branchEligibility: ['CSE', 'IT', 'ECE'],
    location: 'Chennai / Hybrid',
    workMode: 'Hybrid',
    stipend: '₹35,000 / month',
    duration: '6 Months',
    requiredSkills: ['Java', 'SQL', 'Data Structures', 'Docker'],
    openings: 15,
    deadline: '2026-11-30',
    description: 'Work on enterprise SaaS applications.',
    perks: ['PPO Opportunity', 'Free Meals', 'Mentorship'],
  };

  const userSkills = ['Java', 'SQL'];
  const matchResult = matchInternship(mockInternship, userSkills);

  assert.equal(matchResult.matchedSkills.length, 2);
  assert.equal(matchResult.missingSkills.length, 2);
  assert.ok(matchResult.missingSkills.includes('Docker'));
  assert.equal(matchResult.sevenDayRoadmap.length, 7);
  assert.equal(matchResult.sevenDayRoadmap[0].day, 1);
});
