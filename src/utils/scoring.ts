import {
  AptitudeScores,
  AssessmentQuestion,
  BranchCode,
  BranchRecommendation,
  Internship,
  PlacementReadinessMeter,
  ResumeAtsReport,
  ResumeData,
  SpeakingFeedback,
  UserProfile,
} from '../types';

export const INDIAN_FILLER_WORDS = [
  'basically',
  'actually',
  'you know',
  'like',
  'sort of',
  'kind of',
  'i mean',
  'honestly',
  'literally',
  'right',
  'so yeah',
  'obviously',
];

/**
 * Calculates domain scores and RIASEC profile from answered assessment questions
 */
export function calculateAptitudeScores(
  answers: { questionId: string; selectedIndex: number }[],
  questions: AssessmentQuestion[]
): AptitudeScores {
  const totals = {
    logical: 0,
    quantitative: 0,
    verbal: 0,
    problemSolving: 0,
    spatialMechanical: 0,
  };

  const correctCounts = {
    logical: 0,
    quantitative: 0,
    verbal: 0,
    problemSolving: 0,
    spatialMechanical: 0,
  };

  const riasec = {
    realistic: 10,
    investigative: 10,
    artistic: 10,
    social: 10,
    enterprising: 10,
    conventional: 10,
  };

  const questionMap = new Map(questions.map((q) => [q.id, q]));

  for (const item of answers) {
    const q = questionMap.get(item.questionId);
    if (!q) continue;

    if (q.category === 'riasec' && q.riasecType) {
      // For RIASEC, option index 0-3 adds 15 to 30 points
      const points = (item.selectedIndex + 1) * 20;
      riasec[q.riasecType] += points;
      continue;
    }

    if (q.category in totals) {
      totals[q.category as keyof typeof totals]++;
      if (item.selectedIndex === q.correctIndex) {
        correctCounts[q.category as keyof typeof correctCounts]++;
      }
    }
  }

  const computePercent = (correct: number, total: number, fallback = 70) => {
    if (total === 0) return fallback;
    return Math.round((correct / total) * 100);
  };

  return {
    logical: computePercent(correctCounts.logical, totals.logical, 75),
    quantitative: computePercent(correctCounts.quantitative, totals.quantitative, 70),
    verbal: computePercent(correctCounts.verbal, totals.verbal, 80),
    problemSolving: computePercent(correctCounts.problemSolving, totals.problemSolving, 78),
    spatialMechanical: computePercent(correctCounts.spatialMechanical, totals.spatialMechanical, 65),
    riasec,
  };
}

/**
 * Predicts and ranks engineering branches based on RIASEC traits, aptitude scores, and student interests
 */
export function calculateBranchFit(
  scores: AptitudeScores,
  interests: string[] = [],
  jeeRank?: number
): BranchRecommendation[] {
  const interestSet = new Set(interests.map((i) => i.toLowerCase()));

  const branchDefinitions: {
    code: BranchCode;
    name: string;
    badge: string;
    evaluator: (s: AptitudeScores) => number;
    pros: string[];
    challenges: string[];
    curriculumFit: string;
    tier1: string;
    tier2: string;
    tier3: string;
    topRecruiters: string[];
    whyFits: string;
  }[] = [
    {
      code: 'CSE',
      name: 'Computer Science & Engineering',
      badge: 'Highest Placement Volume',
      evaluator: (s) =>
        s.problemSolving * 0.35 +
        s.logical * 0.3 +
        s.quantitative * 0.2 +
        (s.riasec.investigative > 40 ? 10 : 5) +
        (s.riasec.conventional > 30 ? 5 : 0),
      pros: ['Abundant software campus drives', 'Highest median LPA in Tier-1 & Tier-2', 'Vast remote freelance & global mobility'],
      challenges: ['Intense peer competition', 'Rapidly evolving tech stacks requiring continuous self-learning'],
      curriculumFit: 'Ideal for minds intrigued by algorithms, discrete math, and digital system design.',
      tier1: '16-45 LPA',
      tier2: '7-18 LPA',
      tier3: '4-8 LPA',
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'TCS Digital', 'Infosys DSE', 'Flipkart'],
      whyFits: 'Strong logical reasoning and algorithmic problem-solving capacity match CS requirements.',
    },
    {
      code: 'AIML',
      name: 'Artificial Intelligence & Machine Learning',
      badge: 'Exponential High-Growth Field',
      evaluator: (s) =>
        s.quantitative * 0.35 +
        s.problemSolving * 0.3 +
        s.logical * 0.2 +
        (s.riasec.investigative > 45 ? 12 : 5),
      pros: ['Generative AI wave creating specialist roles', 'Cutting-edge R&D and high starting packages', 'Deep cross-domain impact'],
      challenges: ['Heavy mathematics (linear algebra, probability, calculus)', 'M.Tech / MS often required for pure research roles'],
      curriculumFit: 'Great match for students who enjoy mathematical models, data statistics, and automation.',
      tier1: '18-50 LPA',
      tier2: '8-20 LPA',
      tier3: '4.5-9 LPA',
      topRecruiters: ['NVIDIA', 'OpenAI ecosystem', 'Amazon AWS', 'Adobe', 'Fractal Analytics', 'Mu Sigma'],
      whyFits: 'High quantitative aptitude and investigative curiosity are the bedrock of modern data science.',
    },
    {
      code: 'ECE',
      name: 'Electronics & Communication Engineering',
      badge: 'Semiconductor & VLSI Boom',
      evaluator: (s) =>
        s.spatialMechanical * 0.25 +
        s.quantitative * 0.3 +
        s.problemSolving * 0.25 +
        (s.riasec.realistic > 35 ? 10 : 5) +
        (s.riasec.investigative > 35 ? 10 : 5),
      pros: ['India Semiconductor Mission (ISM) driving massive VLSI jobs', 'Dual eligibility for Core Hardware and IT placements', 'Embedded IoT & 5G growth'],
      challenges: ['Rigorous signal processing and electromagnetic theory', 'Core VLSI jobs often prioritize top CGPA and GATE/M.Tech'],
      curriculumFit: 'Suits students fascinated by chip architecture, robotics, wireless networks, and embedded firmware.',
      tier1: '14-35 LPA',
      tier2: '6-14 LPA',
      tier3: '3.8-7 LPA',
      topRecruiters: ['Qualcomm', 'Texas Instruments', 'Intel', 'Samsung R&D', 'ISRO', 'BEL'],
      whyFits: 'Balanced analytical and spatial reasoning fits circuit theory and microelectronic design.',
    },
    {
      code: 'IT',
      name: 'Information Technology',
      badge: 'Industry Systems & Cloud Leader',
      evaluator: (s) =>
        s.logical * 0.35 +
        s.problemSolving * 0.3 +
        s.verbal * 0.15 +
        (s.riasec.conventional > 35 ? 10 : 5) +
        (s.riasec.enterprising > 30 ? 10 : 5),
      pros: ['Close curriculum overlap with CSE', 'Equal placement opportunity in 95% of campus drives', 'Focus on practical cloud & web services'],
      challenges: ['Perceived brand overlap with pure CSE in some PSU recruitments'],
      curriculumFit: 'Targeted for enterprise computing, networking, database architecture, and cybersecurity.',
      tier1: '14-38 LPA',
      tier2: '6.5-16 LPA',
      tier3: '3.8-7.5 LPA',
      topRecruiters: ['Oracle', 'Cognizant', 'Accenture', 'TCS', 'Capgemini', 'Zoho'],
      whyFits: 'Strong logical framework combined with practical software architecture aptitude.',
    },
    {
      code: 'MECH',
      name: 'Mechanical Engineering',
      badge: 'EV & Robotics Core Pioneer',
      evaluator: (s) =>
        s.spatialMechanical * 0.45 +
        s.quantitative * 0.25 +
        (s.riasec.realistic > 40 ? 15 : 5) +
        (s.riasec.investigative > 30 ? 10 : 5),
      pros: ['Electric Vehicles (EV), Drone tech, and Automation renaissance', 'High GATE PSU opportunities (BHEL, IOCL, ONGC)', 'Tangible physical design'],
      challenges: ['Pure core manufacturing starting salaries in Tier-2/3 are lower than IT', 'CAD/FEA mastery takes hands-on dedication'],
      curriculumFit: 'Engineered for students who love CAD modeling, thermodynamics, robotics, and machine mechanics.',
      tier1: '10-22 LPA',
      tier2: '5-9 LPA',
      tier3: '3.2-5.5 LPA',
      topRecruiters: ['Tata Motors', 'Mahindra & Mahindra', 'L&T', 'Maruti Suzuki', 'ISRO', 'Thermax'],
      whyFits: 'High spatial-mechanical aptitude and affinity for hands-on systems make Mechanical an intuitive fit.',
    },
    {
      code: 'EEE',
      name: 'Electrical & Electronics Engineering',
      badge: 'Power Grids & Renewable Green Tech',
      evaluator: (s) =>
        s.quantitative * 0.35 +
        s.spatialMechanical * 0.25 +
        s.problemSolving * 0.25 +
        (s.riasec.investigative > 35 ? 10 : 5),
      pros: ['Crucial for Renewable energy transition and EV battery management', 'Excellent government and PSU opportunities through GATE', 'Dual hardware-software exposure'],
      challenges: ['Complex circuit mathematics and high-voltage safety rigor'],
      curriculumFit: 'Covers power grids, control systems, electric motors, and smart grid automation.',
      tier1: '11-26 LPA',
      tier2: '5.5-11 LPA',
      tier3: '3.5-6 LPA',
      topRecruiters: ['Schneider Electric', 'Siemens', 'ABB', 'Tata Power', 'PowerGrid (PGCIL)', 'NTPC'],
      whyFits: 'High quantitative precision and physics problem-solving suit electrical machine dynamics.',
    },
    {
      code: 'CIVIL',
      name: 'Civil & Infrastructure Engineering',
      badge: 'Nation-Building & Smart Cities',
      evaluator: (s) =>
        s.spatialMechanical * 0.4 +
        s.quantitative * 0.25 +
        (s.riasec.realistic > 35 ? 15 : 5) +
        (s.riasec.enterprising > 30 ? 10 : 5),
      pros: ['Massive Indian infrastructure boom (highways, metros, smart cities)', 'High UPSC IES and state PWD recruitment quotas', 'Strong entrepreneurial construction scope'],
      challenges: ['Extensive site work in early career years', 'Lower campus placement volumes in software-heavy colleges'],
      curriculumFit: 'Covers structural engineering, geotechnical analysis, BIM 3D modeling, and environmental systems.',
      tier1: '9-20 LPA',
      tier2: '4.5-8 LPA',
      tier3: '3-5 LPA',
      topRecruiters: ['Larsen & Toubro (L&T)', 'Tata Projects', 'Afcons Infrastructure', 'Shapoorji Pallonji', 'NHAI'],
      whyFits: 'Spatial judgment and structural thinking align with infrastructure modeling and geotechnical project design.',
    },
    {
      code: 'CHEM',
      name: 'Chemical & Process Engineering',
      badge: 'Pharma & Green Hydrogen Frontier',
      evaluator: (s) =>
        s.quantitative * 0.35 +
        s.problemSolving * 0.3 +
        (s.riasec.investigative > 40 ? 15 : 5) +
        (s.riasec.realistic > 30 ? 10 : 5),
      pros: ['High margins in Indian Pharmaceuticals, Petrochemicals & Speciality chemicals', 'Clean Energy & Carbon Capture emerging sectors', 'Global process engineering demand'],
      challenges: ['Hazardous chemical environments in plant roles', 'Fewer campus opportunities in non-specialized colleges'],
      curriculumFit: 'Focuses on reaction kinetics, thermodynamics, fluid flow, and bio-process engineering.',
      tier1: '10-24 LPA',
      tier2: '5-9 LPA',
      tier3: '3.2-5.5 LPA',
      topRecruiters: ['Reliance Industries', 'IOCL', 'Dr. Reddy’s', 'Asian Paints', 'Shell India', 'UPL'],
      whyFits: 'Analytical mindset and experimental curiosity suit continuous process and materials innovation.',
    },
  ];

  return branchDefinitions
    .map((b) => {
      let rawScore = Math.min(98, Math.max(45, Math.round(b.evaluator(scores))));

      // Boost if interest tags match
      if (b.code === 'CSE' && (interestSet.has('coding') || interestSet.has('apps') || interestSet.has('gaming'))) {
        rawScore = Math.min(99, rawScore + 6);
      }
      if (b.code === 'AIML' && (interestSet.has('ai') || interestSet.has('data') || interestSet.has('math'))) {
        rawScore = Math.min(99, rawScore + 7);
      }
      if (b.code === 'ECE' && (interestSet.has('hardware') || interestSet.has('chips') || interestSet.has('robotics'))) {
        rawScore = Math.min(99, rawScore + 6);
      }
      if (b.code === 'MECH' && (interestSet.has('cars') || interestSet.has('machines') || interestSet.has('robotics'))) {
        rawScore = Math.min(99, rawScore + 7);
      }

      return {
        branchCode: b.code,
        name: b.name,
        matchScore: rawScore,
        badge: b.badge,
        pros: b.pros,
        challenges: b.challenges,
        curriculumFit: b.curriculumFit,
        averageStartingLPA: {
          tier1: b.tier1,
          tier2: b.tier2,
          tier3: b.tier3,
        },
        topRecruiters: b.topRecruiters,
        whyFits: b.whyFits,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Analyzes spoken/transcribed text for Indian campus interview readiness:
 * WPM, Indian English filler words, vocabulary, and grammar hints.
 */
export function analyzeSpeechText(transcript: string, durationSeconds: number): SpeakingFeedback {
  const clean = transcript.trim();
  if (!clean) {
    return {
      score: 0,
      wordsPerMinute: 0,
      wpmRating: 'Too Slow',
      wordCount: 0,
      durationSeconds,
      fillerWordsFound: [],
      grammarNotes: ['No speech detected yet. Speak clearly into the microphone or use the practice prompt.'],
      vocabularyHighlights: [],
      strengths: [],
      areasOfImprovement: ['Press start and speak at a steady pace.'],
      overallSummary: 'Awaiting your speech recording.',
    };
  }

  const words = clean.split(/\s+/);
  const wordCount = words.length;
  const safeDuration = Math.max(5, durationSeconds);
  const wordsPerMinute = Math.round((wordCount / safeDuration) * 60);

  // Analyze WPM
  let wpmRating: SpeakingFeedback['wpmRating'] = 'Optimal Pace';
  if (wordsPerMinute < 95) wpmRating = 'Too Slow';
  else if (wordsPerMinute <= 160) wpmRating = 'Optimal Pace';
  else if (wordsPerMinute <= 190) wpmRating = 'A Bit Fast';
  else wpmRating = 'Rushed';

  // Detect fillers
  const lowerText = clean.toLowerCase();
  const fillerCounts: { word: string; count: number }[] = [];
  let totalFillers = 0;

  for (const filler of INDIAN_FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      fillerCounts.push({ word: filler, count: matches.length });
      totalFillers += matches.length;
    }
  }

  // Vocabulary highlights (technical / professional words)
  const techBuzzwords = [
    'architecture', 'scalable', 'algorithm', 'optimization', 'framework',
    'efficient', 'database', 'asynchronous', 'integration', 'throughput',
    'latency', 'solution', 'implementation', 'methodology', 'analytical',
    'collaborate', 'milestone', 'validation', 'modular', 'pipeline'
  ];
  const foundVocab = techBuzzwords.filter((w) => lowerText.includes(w));

  // Compute base score (0-100)
  let score = 75;
  if (wpmRating === 'Optimal Pace') score += 10;
  else if (wpmRating === 'A Bit Fast') score += 3;
  else score -= 8;

  // Penalize excessive fillers
  const fillerPenalty = Math.min(25, totalFillers * 4);
  score -= fillerPenalty;

  // Reward vocabulary
  score += Math.min(15, foundVocab.length * 3);

  // Cap score
  score = Math.max(25, Math.min(98, score));

  const strengths: string[] = [];
  const areasOfImprovement: string[] = [];

  if (wpmRating === 'Optimal Pace') {
    strengths.push(`Excellent pacing at ~${wordsPerMinute} WPM, ideal for Indian campus interviewers.`);
  } else {
    areasOfImprovement.push(`Your pace was ${wordsPerMinute} WPM (${wpmRating}). Aim for 120-145 WPM for maximum clarity.`);
  }

  if (totalFillers === 0) {
    strengths.push('Remarkably clean speech with zero crutch filler words.');
  } else if (totalFillers <= 2) {
    strengths.push('Minimal filler words detected.');
  } else {
    areasOfImprovement.push(`Detected ${totalFillers} filler words (${fillerCounts.map((f) => `"${f.word}" (${f.count})`).join(', ')}). Replace pauses with deliberate silence.`);
  }

  if (foundVocab.length >= 2) {
    strengths.push(`Demonstrated strong professional vocabulary: ${foundVocab.slice(0, 3).join(', ')}.`);
  } else {
    areasOfImprovement.push('Incorporate more action-oriented engineering terms (e.g., modular, scalable, validation).');
  }

  const grammarNotes: string[] = [];
  if (lowerText.includes('i am having') || lowerText.includes('myself')) {
    grammarNotes.push('Watch out for Indian English colloquials: Avoid "Myself [Name]" or "I am having experience"; use "I have experience" or "My name is...".');
  }
  if (clean.endsWith('?')) {
    grammarNotes.push('Keep answer statements confident and declarative rather than ending in an uncertain rising pitch.');
  }

  return {
    score,
    wordsPerMinute,
    wpmRating,
    wordCount,
    durationSeconds: safeDuration,
    fillerWordsFound: fillerCounts,
    grammarNotes,
    vocabularyHighlights: foundVocab,
    strengths,
    areasOfImprovement,
    overallSummary: `Speech delivered with ${score}% communicative confidence. ${wpmRating === 'Optimal Pace' ? 'Clear cadence.' : 'Keep pacing controlled.'}`,
  };
}

/**
 * Calculates ATS score for an Indian engineering resume
 */
export function calculateResumeAtsScore(resume: ResumeData): ResumeAtsReport {
  let score = 30; // base for filling out
  let bulletScore = 20;
  let keywordScore = 25;
  let formattingScore = 25;

  const detectedKeywords: string[] = [];
  const missingCrucialKeywords: string[] = [];
  const recommendations: string[] = [];

  // Check contact details
  if (resume.email && resume.phone && resume.linkedin) formattingScore += 10;
  if (resume.github) formattingScore += 10;

  // Check education with CGPA
  const hasCgpa = resume.education.some((e) => /cgpa|%|\d\.\d/i.test(e.score));
  if (hasCgpa) {
    formattingScore += 10;
  } else {
    recommendations.push('Explicitly mention your B.Tech CGPA and 12th/10th percentages (key filter in TCS, Infosys, and product drives).');
  }

  // Keywords to test
  const crucialKeywords = [
    'Data Structures', 'Algorithms', 'SQL', 'Git', 'REST API', 'JavaScript', 'Python',
    'Object-Oriented', 'Agile', 'Testing', 'System Design'
  ];

  const fullText = JSON.stringify(resume).toLowerCase();
  for (const kw of crucialKeywords) {
    if (fullText.includes(kw.toLowerCase())) {
      detectedKeywords.push(kw);
    } else {
      missingCrucialKeywords.push(kw);
    }
  }

  keywordScore = Math.min(30, Math.round((detectedKeywords.length / crucialKeywords.length) * 30));

  // Bullet point quality
  let strongBullets = 0;
  let totalBullets = 0;
  const actionVerbs = /^(architected|built|engineered|developed|implemented|optimized|designed|created|reduced|increased|spearheaded|deployed)/i;
  const metricCheck = /\d+%|\d+x|\d+ms|\d+k|reduced|improved|users/i;

  for (const proj of resume.projects) {
    for (const b of proj.bullets) {
      totalBullets++;
      if (actionVerbs.test(b.trim())) strongBullets++;
      if (metricCheck.test(b)) strongBullets++;
    }
  }

  if (totalBullets > 0) {
    bulletScore = Math.min(30, Math.round((strongBullets / (totalBullets * 1.5)) * 30));
  } else {
    recommendations.push('Add at least 2 distinct technical projects with bullet points stating your contribution.');
  }

  if (missingCrucialKeywords.length > 3) {
    recommendations.push(`Add essential industry keywords: ${missingCrucialKeywords.slice(0, 4).join(', ')}.`);
  }

  const finalScore = Math.min(98, Math.max(35, bulletScore + keywordScore + Math.min(35, formattingScore)));

  return {
    score: finalScore,
    bulletScore,
    keywordScore,
    formattingScore: Math.min(35, formattingScore),
    detectedKeywords,
    missingCrucialKeywords: missingCrucialKeywords.slice(0, 5),
    recommendations,
  };
}

/**
 * Calculates Composite Placement Readiness Meter across Aptitude, Coding, Technical, Communication, and Resume
 */
export function calculatePlacementReadiness(profile: Partial<UserProfile>, customScores?: {
  aptitude?: number;
  coding?: number;
  communication?: number;
  technical?: number;
  resume?: number;
}): PlacementReadinessMeter {
  const aptitude = customScores?.aptitude ?? 72;
  const coding = customScores?.coding ?? 65;
  const communication = customScores?.communication ?? 70;
  const technical = customScores?.technical ?? 68;
  const resume = customScores?.resume ?? 75;

  const weightedScore = Math.round(
    aptitude * 0.2 +
    coding * 0.25 +
    communication * 0.2 +
    technical * 0.2 +
    resume * 0.15
  );

  let readinessBand: PlacementReadinessMeter['readinessBand'] = 'Beginner Phase';
  if (weightedScore >= 82) readinessBand = 'Day-1 Ready';
  else if (weightedScore >= 70) readinessBand = 'Near Ready';
  else if (weightedScore >= 55) readinessBand = 'Needs Targeted Prep';
  else readinessBand = 'Beginner Phase';

  const prioritizedActionPlan: PlacementReadinessMeter['prioritizedActionPlan'] = [];

  if (coding < 75) {
    prioritizedActionPlan.push({
      priority: 'High',
      action: 'Solve 15 essential placement DSA problems (Two Pointers, Binary Search, Sliding Window)',
      impact: '+12% on Product & TCS Digital clearing rate',
      estimatedDays: 7,
      targetModule: 'practice/coding',
    });
  }

  if (communication < 75) {
    prioritizedActionPlan.push({
      priority: 'High',
      action: 'Complete 3 AI English Speaking GD sessions with pace & filler feedback',
      impact: 'Crucial for passing HR Round & Group Discussion (GD)',
      estimatedDays: 3,
      targetModule: 'practice/english',
    });
  }

  if (aptitude < 75) {
    prioritizedActionPlan.push({
      priority: 'Medium',
      action: 'Attempt Company Pattern Mocks (TCS NQT / Infosys SpringBoard timed tests)',
      impact: 'Avoid elimination at Round 1 Aptitude screening',
      estimatedDays: 4,
      targetModule: 'practice/aptitude',
    });
  }

  if (resume < 75) {
    prioritizedActionPlan.push({
      priority: 'Medium',
      action: 'Optimize ATS Resume with quantified impact metrics and GitHub links',
      impact: 'Increases shortlisting rate through automated ATS parsers',
      estimatedDays: 2,
      targetModule: 'resume',
    });
  }

  return {
    overallScore: weightedScore,
    readinessBand,
    breakdown: {
      aptitude,
      coding,
      communication,
      technical,
      resume,
    },
    prioritizedActionPlan,
  };
}

/**
 * Matches an internship against a user's known skills and provides a 7-day bridge roadmap for missing skills
 */
export function matchInternship(
  internship: Internship,
  userSkills: string[]
): {
  matchPercent: number;
  matchedSkills: string[];
  missingSkills: string[];
  sevenDayRoadmap: { day: number; title: string; objective: string }[];
} {
  const userSkillSet = new Set(userSkills.map((s) => s.toLowerCase().trim()));
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of internship.requiredSkills) {
    const cleanSkill = skill.toLowerCase().trim();
    let found = false;
    for (const u of userSkillSet) {
      if (cleanSkill.includes(u) || u.includes(cleanSkill)) {
        found = true;
        break;
      }
    }
    if (found) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const matchPercent = Math.max(
    25,
    Math.round((matchedSkills.length / Math.max(1, internship.requiredSkills.length)) * 100)
  );

  // Generate 7-day bridge roadmap for the missing skills
  const primaryGap = missingSkills[0] || 'Domain Best Practices';
  const secondaryGap = missingSkills[1] || 'System Integration';

  const sevenDayRoadmap = [
    { day: 1, title: `Foundations of ${primaryGap}`, objective: `Complete core syntax, setup, and key concepts of ${primaryGap}.` },
    { day: 2, title: `Hands-on Exercises with ${primaryGap}`, objective: `Build 3 small scripts/components demonstrating practical proficiency.` },
    { day: 3, title: `Deep Dive into ${secondaryGap}`, objective: `Study documentation and architecture patterns for ${secondaryGap}.` },
    { day: 4, title: 'Integrated Mini-Project (Day 1)', objective: `Start building a project combining ${matchedSkills[0] || 'Core Tech'} with ${primaryGap}.` },
    { day: 5, title: 'Integrated Mini-Project (Day 2)', objective: 'Add database/API layers, error handling, and clean code documentation.' },
    { day: 6, title: 'Deployment & README Polish', objective: 'Deploy live on Vercel/Render, add demo GIF & architectural diagram to GitHub.' },
    { day: 7, title: 'Mock Interview & Application Submission', objective: `Prepare answers on ${primaryGap} and submit application to ${internship.company}.` },
  ];

  return {
    matchPercent,
    matchedSkills,
    missingSkills,
    sevenDayRoadmap,
  };
}
