import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RadarChart } from '../components/RadarChart';
import { COMPREHENSIVE_QUESTIONS } from '../data/questionsData';
import { BRANCHES_DATA } from '../data/branchesData';
import { calculateAptitudeScores, calculateBranchFit } from '../utils/scoring';
import { BranchCode, UserYear } from '../types';
import confetti from 'canvas-confetti';
import {
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  BarChart2,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';

export const StrengthDiscoveryView: React.FC = () => {
  const { user, updateUser, scores, setScores, incrementXp, setActiveTab } = useApp();

  // Mode: 'overview' | 'questionnaire' | 'assessment' | 'results' | 'whatif'
  const [viewMode, setViewMode] = useState<'overview' | 'questionnaire' | 'assessment' | 'results' | 'whatif'>('overview');

  // Questionnaire form state
  const [academicYear, setAcademicYear] = useState<UserYear>(user.currentYear);
  const [collegeName, setCollegeName] = useState(user.college || '');
  const [jeeRank, setJeeRank] = useState(user.jeeRank ? String(user.jeeRank) : '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests || ['Coding', 'Algorithms']);
  const [careerGoals, setCareerGoals] = useState(user.careerGoal || '');

  // Assessment state
  const assessmentQuestions = COMPREHENSIVE_QUESTIONS.slice(0, 15);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selectedIndex: number }[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [timerActive, setTimerActive] = useState(false);

  // What-If comparison state
  const [branchA, setBranchA] = useState<BranchCode>('CSE');
  const [branchB, setBranchB] = useState<BranchCode>('ECE');

  const interestOptions = [
    'Coding', 'Algorithms', 'AI/ML', 'Robotics', 'Hardware & Chips',
    'Automotive & Cars', 'Civil Structures', 'Green Energy', 'Mathematics',
    'Product Design', 'Physics & Gadgets', 'Business & Startups'
  ];

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSaveQuestionnaire = () => {
    updateUser({
      currentYear: academicYear,
      college: collegeName,
      jeeRank: jeeRank ? Number(jeeRank) : undefined,
      interests: selectedInterests,
      careerGoal: careerGoals,
    });
    incrementXp(50, 'Updated profile questionnaire');
    setViewMode('assessment');
    setTimerActive(true);
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOpt(idx);
  };

  const handleNextQuestion = () => {
    if (selectedOpt === null) return;
    const currentQ = assessmentQuestions[currentQIndex];
    const newAnswers = [...answers.filter((a) => a.questionId !== currentQ.id), { questionId: currentQ.id, selectedIndex: selectedOpt }];
    setAnswers(newAnswers);
    setSelectedOpt(null);

    if (currentQIndex < assessmentQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Finished assessment
      finishAssessment(newAnswers);
    }
  };

  const finishAssessment = (finalAnswers = answers) => {
    setTimerActive(false);
    const calculatedScores = calculateAptitudeScores(finalAnswers, COMPREHENSIVE_QUESTIONS);
    setScores(calculatedScores);
    updateUser({ completedAssessment: true });
    incrementXp(200, 'Completed Stage 1 Cognitive Assessment');
    setViewMode('results');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const recommendations = calculateBranchFit(scores, user.interests, user.jeeRank);

  const radarData = [
    { label: 'Logical', value: scores.logical },
    { label: 'Quantitative', value: scores.quantitative },
    { label: 'Verbal', value: scores.verbal },
    { label: 'Problem Solving', value: scores.problemSolving },
    { label: 'Spatial & Mech', value: scores.spatialMechanical },
  ];

  const branchDetailA = BRANCHES_DATA.find((b) => b.code === branchA) || BRANCHES_DATA[0];
  const branchDetailB = BRANCHES_DATA.find((b) => b.code === branchB) || BRANCHES_DATA[2];

  return (
    <div className="space-y-6 pb-16">
      {/* Stage Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5" /> Stage 1: Strength Discovery & Branch Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cognitive Assessment & AI Branch Recommender
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Designed for Class 12 / JEE aspirants and 1st year engineers. Scientifically evaluate your cognitive reasoning, interest inventory (RIASEC), and calculate your highest-yield branch fit.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'overview' || viewMode === 'results' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            My Recommendations
          </button>
          <button
            type="button"
            onClick={() => setViewMode('whatif')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'whatif' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            "What-If" Branch Matrix
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('questionnaire');
              setCurrentQIndex(0);
              setAnswers([]);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            Retake Assessment
          </button>
        </div>
      </div>

      {/* QUESTIONNAIRE MODE */}
      {viewMode === 'questionnaire' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Step 1: Student Background & Aspirations</h2>
            <p className="text-xs text-slate-500 mt-1">Tell us where you are in your journey so our AI models calibrate the right benchmarks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Academic Stage</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value as UserYear)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Class 12 / JEE">Class 12 / JEE Aspirant</option>
                <option value="1st Year">1st Year Engineering</option>
                <option value="2nd Year">2nd Year Engineering</option>
                <option value="3rd Year">3rd Year Engineering</option>
                <option value="4th Year / Final">4th Year / Final Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Target College / Current Institution</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. NIT Surathkal / IIT Delhi / DTU / State CET"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">JEE Rank / State CET Percentile (Optional)</label>
              <input
                type="number"
                value={jeeRank}
                onChange={(e) => setJeeRank(e.target.value)}
                placeholder="e.g. 4820 (AIR) or 98.4 %tile"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Ultimate Career Aspiration</label>
              <input
                type="text"
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                placeholder="e.g. Product SDE / Core EV Lead / Masters Abroad"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Interests & Hobbies (Select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((opt) => {
                const isSelected = selectedInterests.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleInterestToggle(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveQuestionnaire}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Begin Timed Assessment (15 Qs)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ASSESSMENT MODE */}
      {viewMode === 'assessment' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Question {currentQIndex + 1} of {assessmentQuestions.length}
              </span>
              <h2 className="text-sm font-semibold text-slate-500">
                Category: <strong className="text-slate-800 capitalize">{assessmentQuestions[currentQIndex].category}</strong>
              </h2>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>12:45 min left</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / assessmentQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
              {assessmentQuestions[currentQIndex].question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {assessmentQuestions[currentQIndex].options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  selectedOpt === idx
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <span>{opt}</span>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                    selectedOpt === idx ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 text-slate-400'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => finishAssessment()}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Skip & View Preliminary Result
            </button>
            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={selectedOpt === null}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>{currentQIndex === assessmentQuestions.length - 1 ? 'Submit Assessment' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* RESULTS & OVERVIEW MODE */}
      {(viewMode === 'overview' || viewMode === 'results') && (
        <div className="space-y-8">
          {/* Top Cognitive Profile Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radar chart card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-between">
              <div className="w-full pb-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Aptitude Profile</h2>
                  <p className="text-xs text-slate-500">Multidimensional Cognitive Indices</p>
                </div>
                <Award className="w-5 h-5 text-indigo-600" />
              </div>

              <div className="py-4">
                <RadarChart data={radarData} size={260} color="#4f46e5" />
              </div>

              <div className="w-full text-center text-xs text-slate-600 font-medium">
                Calculated from verified test responses.
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Cognitive Strengths & Learning Style</h2>
                  <p className="text-xs text-slate-500">Personalized profile for {user.name}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {user.learningStyle || 'Project-Driven'} Learner
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Top 3 Strengths
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                    <li><strong className="text-slate-900">Algorithmic Logic ({scores.problemSolving}%):</strong> High speed in breaking complex problems into recursive steps.</li>
                    <li><strong className="text-slate-900">Analytical Reasoning ({scores.logical}%):</strong> Identifies patterns and sequences with minimal hints.</li>
                    <li><strong className="text-slate-900">Quantitative Fluency ({scores.quantitative}%):</strong> Comfortable with probability, percentages, and algebraic modeling.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-600" /> Focus Growth Areas
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                    <li><strong className="text-slate-900">Spatial Visualization ({scores.spatialMechanical}%):</strong> Gear rotations and 3D cross-sections benefit from interactive CAD practice.</li>
                    <li><strong className="text-slate-900">Verbal Articulation ({scores.verbal}%):</strong> Ready for Stage 3 speech drills to avoid Indian English filler words.</li>
                  </ul>
                </div>
              </div>

              {/* RIASEC Profile Pill bar */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-2">RIASEC Career Archetype Profile:</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Investigative</div>
                    <div className="font-extrabold text-indigo-600">{scores.riasec.investigative}%</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Conventional</div>
                    <div className="font-extrabold text-indigo-600">{scores.riasec.conventional}%</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Enterprising</div>
                    <div className="font-extrabold text-indigo-600">{scores.riasec.enterprising}%</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Social</div>
                    <div className="font-extrabold text-indigo-600">{scores.riasec.social}%</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Realistic</div>
                    <div className="font-extrabold text-indigo-600">{scores.riasec.realistic}%</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Artistic</div>
                    <div className="font-extrabold text-indigo-600">{scores.riasec.artistic}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Branch Recommendations List */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Ranked Engineering Branch Recommendations
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scientific alignment computed against 8 Indian engineering branches
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('whatif')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
              >
                <span>Compare Two Branches Side-by-Side</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recommendations.slice(0, 4).map((rec, idx) => (
                <div
                  key={rec.branchCode}
                  className="rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider">
                        #{idx + 1} Best Fit
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-extrabold text-indigo-700">{rec.matchScore}%</span>
                        <span className="text-[11px] text-slate-400">Match</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{rec.name}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{rec.badge}</p>

                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                      <div className="font-semibold text-slate-900">Why this fits you:</div>
                      <p>{rec.whyFits}</p>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold">Starting Salaries:</span>
                        <span className="font-bold text-slate-900">{rec.averageStartingLPA.tier1} (Tier 1)</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold">Top Recruiters:</span>
                        <span className="text-slate-800">{rec.topRecruiters.slice(0, 3).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-amber-700 font-medium">
                      Challenge: {rec.challenges[0]?.slice(0, 42)}...
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('branches')}
                      className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      View 4-Yr Syllabus →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* "WHAT-IF" SIDE-BY-SIDE MATRIX MODE */}
      {viewMode === 'whatif' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900">"What-If" Head-to-Head Comparison Matrix</h2>
            <p className="text-xs text-slate-500 mt-1">
              Unsure between two branches? Compare 4-year curriculum, salary bands, recruitment pipelines, and higher-study avenues side-by-side.
            </p>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
              <label className="block text-xs font-bold text-indigo-900 mb-2">Branch A</label>
              <select
                value={branchA}
                onChange={(e) => setBranchA(e.target.value as BranchCode)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {BRANCHES_DATA.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.code} - {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
              <label className="block text-xs font-bold text-purple-900 mb-2">Branch B</label>
              <select
                value={branchB}
                onChange={(e) => setBranchB(e.target.value as BranchCode)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-purple-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {BRANCHES_DATA.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.code} - {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-3 px-4 font-bold text-slate-700 w-1/4">Evaluation Metric</th>
                  <th className="py-3 px-4 font-bold text-indigo-900 w-3/8">{branchDetailA.name} ({branchDetailA.code})</th>
                  <th className="py-3 px-4 font-bold text-purple-900 w-3/8">{branchDetailB.name} ({branchDetailB.code})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Starting Salary (Tier 1)</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600">{branchDetailA.averageStartingLPA.tier1}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600">{branchDetailB.averageStartingLPA.tier1}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Starting Salary (Tier 2/3)</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{branchDetailA.averageStartingLPA.tier2}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{branchDetailB.averageStartingLPA.tier2}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Primary Core Recruiters</td>
                  <td className="py-3.5 px-4 text-slate-700">{branchDetailA.topRecruiters.join(', ')}</td>
                  <td className="py-3.5 px-4 text-slate-700">{branchDetailB.topRecruiters.join(', ')}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Year 2 Milestone Focus</td>
                  <td className="py-3.5 px-4 text-slate-700">{branchDetailA.fourYearCurriculum[1]?.milestone}</td>
                  <td className="py-3.5 px-4 text-slate-700">{branchDetailB.fourYearCurriculum[1]?.milestone}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Higher Studies (GATE & PSUs)</td>
                  <td className="py-3.5 px-4 text-slate-700">{branchDetailA.higherStudies.gateScope}</td>
                  <td className="py-3.5 px-4 text-slate-700">{branchDetailB.higherStudies.gateScope}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Emerging 2026+ Frontier</td>
                  <td className="py-3.5 px-4 text-slate-700">{branchDetailA.emergingTrends.slice(0, 3).join(', ')}</td>
                  <td className="py-3.5 px-4 text-slate-700">{branchDetailB.emergingTrends.slice(0, 3).join(', ')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
