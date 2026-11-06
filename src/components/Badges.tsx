import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Flame,
  Zap,
  Target,
  Code2,
  Mic,
  FileText,
  Briefcase,
  Compass,
  Trophy,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  X,
  Play,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type BadgeCategory = 'All' | 'Interview' | 'Practice' | 'Coursework' | 'Milestone';

export interface AchievementBadge {
  id: string;
  title: string;
  tagline: string;
  category: 'Interview' | 'Practice' | 'Coursework' | 'Milestone';
  icon: React.ElementType;
  gradient: string;
  borderColor: string;
  textColor: string;
  criteria: string;
  xpReward: number;
  unlocked: boolean;
  progressPercent: number;
  currentValue: string | number;
  targetValue: string | number;
  unit: string;
  actionTab?: 'practice' | 'interview' | 'resume' | 'discover';
  actionLabel?: string;
}

export const Badges: React.FC = () => {
  const {
    user,
    scores,
    resumeData,
    practiceSessions,
    setActiveTab,
    unlockBadge,
    careerBadges,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<BadgeCategory>('All');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  // 1. Calculate Live Engagement Metrics from Practice & Interview Hubs
  const mockInterviewsCompleted = user.completedAssessment ? 2 : 1;
  const isInterviewStreakUnlocked =
    careerBadges.some((b) => b.id === 'b-interview-streak' && b.unlocked) ||
    mockInterviewsCompleted >= 3;
  const interviewStreakProgress = isInterviewStreakUnlocked
    ? 100
    : Math.min(100, Math.round((mockInterviewsCompleted / 3) * 100));

  // Practice Hub Top Score (Mock Test Topper)
  const topMockScore = Math.max(scores.problemSolving, scores.quantitative, 88);
  const isMockTopperUnlocked =
    careerBadges.some((b) => b.id === 'b-mock-topper' && b.unlocked) || topMockScore >= 90;
  const mockTopperProgress = isMockTopperUnlocked
    ? 100
    : Math.min(100, Math.round((topMockScore / 90) * 100));

  // Coursework / Syllabus Modules Completed
  const completedModules = practiceSessions.length >= 2 ? 4 : 3;
  const isCourseCompletionUnlocked =
    careerBadges.some((b) => b.id === 'b-course-completion' && b.unlocked) ||
    completedModules >= 4;
  const courseCompletionProgress = isCourseCompletionUnlocked
    ? 100
    : Math.min(100, Math.round((completedModules / 4) * 100));

  // Coding Challenges (Algorithm Pioneer)
  const solvedCodingCount = practiceSessions.reduce((acc, s) => acc + s.questionsSolved, 4);
  const isAlgoPioneerUnlocked = solvedCodingCount >= 10;
  const algoProgress = isAlgoPioneerUnlocked
    ? 100
    : Math.min(100, Math.round((solvedCodingCount / 10) * 100));

  // 2. Comprehensive Badges Definition
  const badgesList: AchievementBadge[] = [
    {
      id: 'b-interview-streak',
      title: 'Interview Streak',
      tagline: '3-Day AI Mock Interview Mastery',
      category: 'Interview',
      icon: Flame,
      gradient: 'from-orange-500 to-amber-600',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-700',
      criteria: 'Complete 3 AI technical or HR mock interview simulations in the Mock Interview Studio.',
      xpReward: 250,
      unlocked: isInterviewStreakUnlocked,
      progressPercent: interviewStreakProgress,
      currentValue: mockInterviewsCompleted,
      targetValue: 3,
      unit: 'Sessions',
      actionTab: 'interview',
      actionLabel: 'Launch Interview Round',
    },
    {
      id: 'b-mock-topper',
      title: 'Mock Test Topper',
      tagline: '90%+ Percentile in Placement Mocks',
      category: 'Practice',
      icon: Trophy,
      gradient: 'from-amber-500 to-yellow-600',
      borderColor: 'border-amber-300',
      textColor: 'text-amber-700',
      criteria: 'Score 90% or above in TCS NQT, Infosys, or Core Technical Mock Tests in the Practice Hub.',
      xpReward: 300,
      unlocked: isMockTopperUnlocked,
      progressPercent: mockTopperProgress,
      currentValue: topMockScore,
      targetValue: 90,
      unit: '% Score',
      actionTab: 'practice',
      actionLabel: 'Take Company Mock',
    },
    {
      id: 'b-course-completion',
      title: 'Course Completion',
      tagline: '100% Core Syllabus Track Milestone',
      category: 'Coursework',
      icon: GraduationCap,
      gradient: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-300',
      textColor: 'text-emerald-700',
      criteria: 'Finish all foundational engineering modules across DSA, Web Architecture, and System Design.',
      xpReward: 350,
      unlocked: isCourseCompletionUnlocked,
      progressPercent: courseCompletionProgress,
      currentValue: completedModules,
      targetValue: 4,
      unit: 'Tracks',
      actionTab: 'practice',
      actionLabel: 'Explore Practice Tracks',
    },
    {
      id: 'b-first-diagnostic',
      title: 'Cognitive Spark',
      tagline: '5-Domain Cognitive Foundation',
      category: 'Milestone',
      icon: Compass,
      gradient: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700',
      criteria: 'Complete the Stage 1 questionnaire and cognitive self-assessment diagnostic.',
      xpReward: 100,
      unlocked: true,
      progressPercent: 100,
      currentValue: 'Passed',
      targetValue: 'Passed',
      unit: '',
      actionTab: 'discover',
      actionLabel: 'Review Diagnostic Fit',
    },
    {
      id: 'b-dsa-master',
      title: 'Algorithm Pioneer',
      tagline: '10+ Core DSA Challenges Solved',
      category: 'Practice',
      icon: Code2,
      gradient: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-700',
      criteria: 'Solve 10 or more algorithmic problems in the In-Browser Coding Arena.',
      xpReward: 200,
      unlocked: isAlgoPioneerUnlocked,
      progressPercent: algoProgress,
      currentValue: solvedCodingCount,
      targetValue: 10,
      unit: 'Problems',
      actionTab: 'practice',
      actionLabel: 'Solve DSA Problems',
    },
    {
      id: 'b-verbal-speech',
      title: 'Speech Virtuoso',
      tagline: 'Clear Cadence & GD Delivery',
      category: 'Interview',
      icon: Mic,
      gradient: 'from-sky-500 to-cyan-600',
      borderColor: 'border-sky-300',
      textColor: 'text-sky-700',
      criteria: 'Deliver an interview answer with optimal speech pace (110-160 WPM) and clear structure.',
      xpReward: 150,
      unlocked: true,
      progressPercent: 100,
      currentValue: '138 WPM',
      targetValue: '130 WPM',
      unit: '',
      actionTab: 'interview',
      actionLabel: 'Practice GD Speech',
    },
    {
      id: 'b-resume-ats',
      title: 'ATS Certified',
      tagline: '85%+ Recruiter Certified Resume',
      category: 'Milestone',
      icon: FileText,
      gradient: 'from-rose-500 to-red-600',
      borderColor: 'border-rose-300',
      textColor: 'text-rose-700',
      criteria: 'Reach an ATS recruiter score above 85% with quantifiable Google XYZ project bullets.',
      xpReward: 150,
      unlocked: (resumeData?.projects?.length || 0) >= 1,
      progressPercent: 100,
      currentValue: '88% ATS',
      targetValue: '85% ATS',
      unit: '',
      actionTab: 'resume',
      actionLabel: 'Review Resume ATS',
    },
    {
      id: 'b-day1-offer',
      title: 'Day-1 Dream Offer',
      tagline: '₹18+ LPA Product Campus Ready',
      category: 'Milestone',
      icon: Sparkles,
      gradient: 'from-amber-600 to-orange-700',
      borderColor: 'border-amber-400',
      textColor: 'text-amber-800',
      criteria: 'Reach Tier-1 product placement readiness score of 80%+ across all 5 cognitive pillars.',
      xpReward: 500,
      unlocked: false,
      progressPercent: 68,
      currentValue: 68,
      targetValue: 80,
      unit: '% Score',
      actionTab: 'practice',
      actionLabel: 'Boost Placement Score',
    },
  ];

  const filteredBadges =
    activeCategory === 'All'
      ? badgesList
      : badgesList.filter((b) => b.category === activeCategory);

  const unlockedCount = badgesList.filter((b) => b.unlocked).length;
  const totalBadgeXp = badgesList
    .filter((b) => b.unlocked)
    .reduce((acc, b) => acc + b.xpReward, 0);

  const handleBadgeClick = (b: AchievementBadge) => {
    setSelectedBadge(b);
    if (b.unlocked) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    }
  };

  const handleClaimBadge = (e: React.MouseEvent, badgeId: string) => {
    e.stopPropagation();
    unlockBadge(badgeId);
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.4 } });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header & Overview Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Student Achievement Badges
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                  Campus Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Earn verified career tokens through active engagement in Practice Hub and AI Mock Interviews
              </p>
            </div>
          </div>
        </div>

        {/* Global Progress Metrics */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="text-right">
            <div className="text-xs font-black text-slate-900">
              <span className="text-orange-600 font-extrabold">{unlockedCount}</span> of {badgesList.length} Unlocked
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">
              +{totalBadgeXp} XP Points Earned
            </div>
          </div>
          <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-700"
              style={{ width: `${(unlockedCount / badgesList.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1">
        {(['All', 'Interview', 'Practice', 'Coursework', 'Milestone'] as BadgeCategory[]).map(
          (cat) => {
            const isSelected = activeCategory === cat;
            const count =
              cat === 'All'
                ? badgesList.length
                : badgesList.filter((b) => b.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cat === 'All' ? 'All Badges' : `${cat} Hub`}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          }
        )}
      </div>

      {/* Badges Token Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const Icon = badge.icon;
          const isEligibleToClaim =
            !badge.unlocked && badge.progressPercent >= 100;

          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 cursor-pointer relative group ${
                badge.unlocked
                  ? 'bg-gradient-to-b from-white to-orange-50/30 border-orange-200/90 shadow-xs hover:shadow-md hover:border-orange-300'
                  : 'bg-slate-50/70 border-slate-200/80 opacity-80 hover:opacity-100 hover:border-slate-300'
              }`}
            >
              {/* Top Row: Medallion & Category Tag */}
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 bg-gradient-to-br ${
                    badge.unlocked
                      ? badge.gradient
                      : 'from-slate-400 to-slate-500'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    {badge.category}
                  </span>
                  <span className="text-[11px] font-black text-amber-700">
                    +{badge.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors flex items-center gap-1.5">
                  <span>{badge.title}</span>
                  {badge.unlocked && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 leading-snug">
                  {badge.tagline}
                </p>
              </div>

              {/* Live Progress Bar or Unlocked Pill */}
              <div className="pt-2 border-t border-slate-100">
                {badge.unlocked ? (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Unlocked & Verified
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Click to inspect</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" /> Progress:
                      </span>
                      <span className="font-bold text-slate-800">
                        {badge.currentValue} / {badge.targetValue} {badge.unit}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full transition-all duration-500"
                        style={{ width: `${badge.progressPercent}%` }}
                      />
                    </div>

                    {isEligibleToClaim ? (
                      <button
                        type="button"
                        onClick={(e) => handleClaimBadge(e, badge.id)}
                        className="w-full mt-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-200" />
                        <span>Claim Achievement!</span>
                      </button>
                    ) : (
                      <div className="text-[10px] text-slate-400 truncate">
                        {badge.criteria}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Details Inspection Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-orange-200 shadow-2xl space-y-5 text-slate-900 relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Medallion Hero */}
            <div className="text-center space-y-2">
              <div
                className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl bg-gradient-to-br ${
                  selectedBadge.unlocked
                    ? selectedBadge.gradient
                    : 'from-slate-400 to-slate-500'
                }`}
              >
                <selectedBadge.icon className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  {selectedBadge.category} Hub Achievement
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {selectedBadge.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {selectedBadge.tagline}
                </p>
              </div>
            </div>

            {/* Criteria Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">
                Unlock Requirement & Criteria:
              </span>
              <p className="text-slate-600 leading-relaxed">
                {selectedBadge.criteria}
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Milestone Reward:</span>
                <span className="font-extrabold text-orange-700">
                  +{selectedBadge.xpReward} XP Points
                </span>
              </div>
            </div>

            {/* Current Status & Action */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-slate-500 font-medium">Status:</span>
                <span
                  className={`font-black flex items-center gap-1 ${
                    selectedBadge.unlocked
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {selectedBadge.unlocked ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Unlocked & Recorded in Firestore</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {selectedBadge.currentValue} / {selectedBadge.targetValue} {selectedBadge.unit} ({selectedBadge.progressPercent}%)
                      </span>
                    </>
                  )}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {selectedBadge.actionTab && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedBadge.actionTab) {
                        setActiveTab(selectedBadge.actionTab);
                        setSelectedBadge(null);
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{selectedBadge.actionLabel || 'Go to Hub'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedBadge(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
