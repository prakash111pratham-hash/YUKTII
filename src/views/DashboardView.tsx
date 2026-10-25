import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScoreGauge } from '../components/ScoreGauge';
import { RadarChart } from '../components/RadarChart';
import { calculatePlacementReadiness, matchInternship } from '../utils/scoring';
import { INTERNSHIPS_DATA } from '../data/internshipsData';
import { SkillProgressionChart } from '../components/SkillProgressionChart';
import { Badges } from '../components/Badges';
import { ThreeCareerScene } from '../components/ThreeCareerScene';
import { FourYearRoadmap } from '../components/FourYearRoadmap';
import { SkillHeatmap } from '../components/SkillHeatmap';
import { DailyStudyGoal } from '../components/DailyStudyGoal';
import { LevelProgression } from '../components/LevelProgression';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  Briefcase,
  Award,
  BookOpen,
  Mic,
  Cpu,
  Compass,
  AlertCircle,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    isAuthenticated,
    user,
    scores,
    resumeData,
    setActiveTab,
    setSelectedBranchForModal,
    setShowUniqueFeaturesModal,
    setIsAuthModalOpen,
    language,
  } = useApp();

  const readiness = calculatePlacementReadiness(user);

  const radarData = [
    { label: 'Logical', value: scores.logical },
    { label: 'Quant', value: scores.quantitative },
    { label: 'Verbal', value: scores.verbal },
    { label: 'Coding', value: scores.problemSolving },
    { label: 'Spatial', value: scores.spatialMechanical },
  ];

  // Derive user skills from resume and branch
  const knownSkills = ['React', 'Node.js', 'PostgreSQL', 'C++', 'Python', 'SQL', 'Git'];
  const topInternships = INTERNSHIPS_DATA.slice(0, 3).map((internship) => ({
    internship,
    match: matchInternship(internship, knownSkills),
  }));

  const [aiTipLoading, setAiTipLoading] = useState(false);
  const [customAiAdvice, setCustomAiAdvice] = useState<string | null>(null);

  const fetchDynamicAiAdvice = async () => {
    setAiTipLoading(true);
    try {
      const res = await fetch('/api/ai/branch-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores,
          interests: user.interests,
          jeeRank: user.jeeRank,
          academicYear: user.currentYear,
          careerGoals: user.careerGoal,
        }),
      });
      const data = await res.json();
      if (data.data?.learningPathAdvice) {
        setCustomAiAdvice(data.data.learningPathAdvice);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setAiTipLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-orange-950 to-stone-900 text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-orange-900/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{user.currentYear} • {user.college || 'Engineering College'}</span>
              </div>
              {user.name === 'Pratham' ? (
                <>
                  <a
                    href="https://github.com/prakash111pratham-hash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-colors"
                  >
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/pratham-prakash-3a8033362/?"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-colors"
                  >
                    <span>LinkedIn</span>
                  </a>
                </>
              ) : resumeData?.github || resumeData?.linkedin ? (
                <>
                  {resumeData.github && (
                    <a
                      href={resumeData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-colors"
                    >
                      <span>GitHub</span>
                    </a>
                  )}
                  {resumeData.linkedin && (
                    <a
                      href={resumeData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-colors"
                    >
                      <span>LinkedIn</span>
                    </a>
                  )}
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-orange-200 text-xs font-medium border border-white/15">
                  {user.selectedBranch || 'CSE'} Engineering
                </span>
              )}
            </div>

            {isAuthenticated ? (
              <>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Welcome back, <span className="text-orange-400">{user.name}</span>!
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                  Targeting: <strong className="text-white font-semibold">{user.careerGoal}</strong>. You are currently on track with a{' '}
                  <span className="text-emerald-400 font-bold">{readiness.overallScore}%</span> Placement Readiness Index.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Welcome to <span className="text-orange-400">YUKTI</span>!
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                  Sign in or create a fresh student account to start your personalized 4-year journey from fresh zero with custom roadmaps, study goals, and ATS resumes.
                </p>
              </>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-5">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('practice')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-600/30 transition-all cursor-pointer"
                >
                  <span>Continue Today’s Practice</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-600/30 transition-all cursor-pointer"
                >
                  <span>Sign In or Register (Start Fresh)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowUniqueFeaturesModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>National Career Framework</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex items-center justify-around lg:justify-between gap-6 shrink-0">
            <div className="text-center">
              <ScoreGauge
                score={readiness.overallScore}
                size={110}
                label="Placement"
                colorScheme={readiness.overallScore >= 80 ? 'emerald' : 'orange'}
              />
              <span className="mt-1 block text-xs font-semibold text-orange-200">
                {readiness.readinessBand}
              </span>
            </div>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-xs text-slate-300 font-medium">Daily Streak</div>
                  <div className="text-sm font-bold text-white">{user.streakDays} Days Active</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="text-xs text-slate-300 font-medium">Earned XP</div>
                  <div className="text-sm font-bold text-white">{user.xp} Points</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs text-slate-300 font-medium">Target Package</div>
                  <div className="text-sm font-bold text-white">INR {user.targetLPA || 18} LPA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progression & Milestone XP System */}
      <LevelProgression />

      {/* Interactive 4-Year Journey Roadmap (Milestones: Assessment Passed, Internship Secured, etc.) */}
      <FourYearRoadmap />

      {/* Daily Study Goal Tracker Component */}
      <DailyStudyGoal />

      {/* Multi-Domain Skill Progression Heatmap */}
      <SkillHeatmap />

      {/* AI Next Best Steps & Radar Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: AI Priority Next Steps */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100/70 text-orange-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">AI Prioritised Action Plan</h2>
                <p className="text-xs text-slate-500">Curated specifically to boost your Day-1 campus shortlisting</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchDynamicAiAdvice}
              disabled={aiTipLoading}
              className="text-xs font-semibold text-orange-700 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              {aiTipLoading ? 'Analyzing...' : 'Refresh AI Tips'}
            </button>
          </div>

          {customAiAdvice && (
            <div className="p-3.5 rounded-xl bg-orange-50/80 border border-orange-200 text-xs text-orange-950 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Live AI Advisor:</strong> {customAiAdvice}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {readiness.prioritizedActionPlan.map((action, i) => (
              <div
                key={i}
                className="flex items-start justify-between p-3.5 rounded-xl border border-orange-100 hover:border-orange-300 hover:bg-orange-50/40 transition-all gap-4 group"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 uppercase ${
                      action.priority === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {action.priority}
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800">{action.action}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Impact: <span className="text-emerald-700 font-semibold">{action.impact}</span></p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab(action.targetModule)}
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:text-orange-700 hover:underline cursor-pointer"
                >
                  <span>Solve</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cognitive Strength Radar Profile */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Strength Profile</h2>
              <p className="text-xs text-slate-500">Based on Stage 1 Cognitive Assessment</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('discover')}
              className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              Re-test
            </button>
          </div>

          <div className="py-2">
            <RadarChart data={radarData} size={250} color="#4f46e5" />
          </div>

          <div className="w-full pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-medium">
              <span className="block text-[10px] text-emerald-600 uppercase font-bold">Top Strength</span>
              Problem Solving ({scores.problemSolving}%)
            </div>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-800 font-medium">
              <span className="block text-[10px] text-amber-600 uppercase font-bold">Target Area</span>
              Spatial Aptitude ({scores.spatialMechanical}%)
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Skill Growth Trajectory (Recharts Area Visualization) */}
      <SkillProgressionChart />

      {/* Interactive Achievement Badges Component */}
      <Badges />

      {/* 3D Procedural Engineering Branch Galaxy & Orbital System */}
      <ThreeCareerScene />

      {/* 4-Stage Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">4-Year Engineering Stages</h2>
          <span className="text-xs text-slate-500">Tap to dive into any module</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab('discover')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Stage 1</span>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Strength & Branch Fit
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              RIASEC vocational inventory, timed aptitude tests, and "What-If" branch comparison.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('branches')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Stage 2</span>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Branches & 20+ Careers
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              4-year year-by-year syllabus, salary trends in LPA, GATE/MS paths, and free roadmaps.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('practice')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Stage 3</span>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Skill Builder & Mocks
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              TCS NQT, Infosys mocks, 30+ coding problems, and Web Speech fluency analyzer.
            </p>
          </div>

          <div
            onClick={() => setActiveTab('interview')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Stage 4</span>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Placement Readiness
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              AI technical/HR mock interviews, ATS resume builder, and shareable web portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Internships Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recommended Internships & Campus Drives</h2>
            <p className="text-xs text-slate-500">Matched to your current skills with automatic 7-day bridge roadmap</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('internships')}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            <span>View All (25+)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topInternships.map(({ internship, match }) => (
            <div
              key={internship.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">{internship.company}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {match.matchPercent}% Match
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{internship.title}</h3>
                <p className="text-xs font-semibold text-slate-600 mt-1">{internship.stipend} • {internship.location}</p>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {internship.requiredSkills.slice(0, 3).map((s, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('internships')}
                className="mt-4 w-full py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Inspect Skill Gap & Roadmap
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
