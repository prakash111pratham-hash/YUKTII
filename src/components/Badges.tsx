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
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface BadgeItem {
  id: string;
  title: string;
  tagline: string;
  category: 'Aptitude' | 'Coding' | 'Interview' | 'Resume' | 'Milestone';
  icon: React.ElementType;
  colorScheme: 'indigo' | 'emerald' | 'amber' | 'purple' | 'rose' | 'sky' | 'orange';
  criteria: string;
  xpReward: number;
  unlocked: boolean;
  progressPercent: number;
}

export const Badges: React.FC = () => {
  const { user, scores, resumeData, applications, incrementXp } = useApp();
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const badgesList: BadgeItem[] = [
    {
      id: 'early-starter',
      title: 'Early Starter',
      tagline: 'Initiated the Engineering Journey',
      category: 'Milestone',
      icon: Compass,
      colorScheme: 'orange',
      criteria: 'Complete the Stage 1 questionnaire and cognitive self-assessment.',
      xpReward: 100,
      unlocked: user.completedAssessment,
      progressPercent: user.completedAssessment ? 100 : 50,
    },
    {
      id: 'aptitude-ace',
      title: 'Aptitude Ace',
      tagline: 'Top 5% Cognitive Aptitude',
      category: 'Aptitude',
      icon: Zap,
      colorScheme: 'amber',
      criteria: 'Attain an 80%+ score in Logical Reasoning or Quantitative Aptitude.',
      xpReward: 200,
      unlocked: scores.logical >= 80 || scores.quantitative >= 80,
      progressPercent: Math.min(100, Math.round((Math.max(scores.logical, scores.quantitative) / 80) * 100)),
    },
    {
      id: 'interview-ready',
      title: 'Interview Ready',
      tagline: 'Mastered Campus Mock Interviews',
      category: 'Interview',
      icon: Award,
      colorScheme: 'emerald',
      criteria: 'Achieve a score of 75%+ in the Technical or HR AI Mock Interview Studio.',
      xpReward: 250,
      unlocked: true,
      progressPercent: 100,
    },
    {
      id: 'code-warrior',
      title: 'Code Warrior',
      tagline: 'Algorithm Problem Solver',
      category: 'Coding',
      icon: Code2,
      colorScheme: 'purple',
      criteria: 'Solve core algorithmic challenges in the In-Browser Coding Arena.',
      xpReward: 200,
      unlocked: user.xp >= 1000,
      progressPercent: Math.min(100, Math.round((user.xp / 1000) * 100)),
    },
    {
      id: 'speech-virtuoso',
      title: 'Speech Virtuoso',
      tagline: 'Flawless GD & HR Delivery',
      category: 'Interview',
      icon: Mic,
      colorScheme: 'sky',
      criteria: 'Deliver an interview answer with optimal pace (110-160 WPM) and zero crutch filler words.',
      xpReward: 150,
      unlocked: true,
      progressPercent: 100,
    },
    {
      id: 'ats-architect',
      title: 'ATS Optimizer',
      tagline: 'Campus Recruiter Certified Resume',
      category: 'Resume',
      icon: FileText,
      colorScheme: 'rose',
      criteria: 'Reach an ATS recruiter score above 80% with quantified Google XYZ project bullets.',
      xpReward: 150,
      unlocked: resumeData.projects.length >= 2,
      progressPercent: 100,
    },
    {
      id: 'placement-pioneer',
      title: 'Application Pioneer',
      tagline: 'Active Campus Candidate',
      category: 'Milestone',
      icon: Briefcase,
      colorScheme: 'indigo',
      criteria: 'Submit applications to at least 2 top-tier campus internships.',
      xpReward: 100,
      unlocked: applications.length >= 2,
      progressPercent: Math.min(100, Math.round((applications.length / 2) * 100)),
    },
  ];

  const unlockedCount = badgesList.filter((b) => b.unlocked).length;

  const colorStyles = {
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      badgeBg: 'bg-orange-600',
      ring: 'ring-orange-500/30',
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
      badgeBg: 'bg-indigo-600',
      ring: 'ring-indigo-500/30',
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      badgeBg: 'bg-emerald-600',
      ring: 'ring-emerald-500/30',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      badgeBg: 'bg-amber-600',
      ring: 'ring-amber-500/30',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      badgeBg: 'bg-purple-600',
      ring: 'ring-purple-500/30',
    },
    rose: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      badgeBg: 'bg-rose-600',
      ring: 'ring-rose-500/30',
    },
    sky: {
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-700',
      badgeBg: 'bg-sky-600',
      ring: 'ring-sky-500/30',
    },
  };

  const handleBadgeClick = (b: BadgeItem) => {
    setSelectedBadge(b);
    if (b.unlocked) {
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Achievement Tokens & Badges</h2>
              <p className="text-xs text-slate-500">
                Unlock career milestone tokens through verified campus tasks
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">
            Unlocked: <strong className="text-indigo-600">{unlockedCount}</strong> of {badgesList.length}
          </span>
          <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-500"
              style={{ width: `${(unlockedCount / badgesList.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Token Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {badgesList.map((badge) => {
          const Icon = badge.icon;
          const style = colorStyles[badge.colorScheme];

          return (
            <button
              key={badge.id}
              type="button"
              onClick={() => handleBadgeClick(badge)}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center text-center justify-between gap-2.5 cursor-pointer relative group ${
                badge.unlocked
                  ? `${style.bg} ${style.border} hover:shadow-md hover:scale-105`
                  : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100'
              }`}
            >
              {/* Token Medallion */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:rotate-6 ${
                  badge.unlocked ? `${style.badgeBg} text-white ring-4 ${style.ring}` : 'bg-slate-200 text-slate-500'
                }`}
              >
                {badge.unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">{badge.title}</h3>
                <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{badge.tagline}</span>
              </div>

              <div className="w-full pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                <span className="font-bold text-indigo-600">+{badge.xpReward} XP</span>
                {badge.unlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className="text-slate-400 font-medium">{badge.progressPercent}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Badge Details Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-md ${
                selectedBadge.unlocked
                  ? `${colorStyles[selectedBadge.colorScheme].badgeBg} text-white`
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <selectedBadge.icon className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                {selectedBadge.category} Token
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">{selectedBadge.title}</h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{selectedBadge.tagline}</p>
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              {selectedBadge.criteria}
            </p>

            <div className="flex items-center justify-between text-xs px-2">
              <span className="text-slate-500">Reward:</span>
              <span className="font-extrabold text-indigo-700">+{selectedBadge.xpReward} XP Points</span>
            </div>

            <div className="flex items-center justify-between text-xs px-2">
              <span className="text-slate-500">Status:</span>
              <span
                className={`font-bold ${
                  selectedBadge.unlocked ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {selectedBadge.unlocked ? 'Unlocked & Verified ✓' : `${selectedBadge.progressPercent}% In Progress`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
