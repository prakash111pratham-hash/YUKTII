import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LEVEL_TIERS } from '../data/sampleProfileData';
import {
  Trophy,
  Zap,
  Sparkles,
  Award,
  ShieldCheck,
  Flame,
  Cpu,
  FileCheck,
  Briefcase,
  ChevronRight,
  Star,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ICON_MAP: Record<string, any> = {
  Target: Award,
  Cpu: Cpu,
  Flame: Flame,
  FileCheck: FileCheck,
  Briefcase: Briefcase,
  Zap: Zap,
  Award: Trophy,
  Sparkles: Sparkles,
};

export const LevelProgression: React.FC = () => {
  const { user, careerBadges, unlockBadge, incrementXp } = useApp();

  // Find active level
  const currentTier = useMemo(() => {
    return (
      LEVEL_TIERS.find((t) => user.xp >= t.minXp && user.xp < t.maxXp) ||
      LEVEL_TIERS[LEVEL_TIERS.length - 1]
    );
  }, [user.xp]);

  const nextTier = useMemo(() => {
    const nextIdx = LEVEL_TIERS.findIndex((t) => t.level === currentTier.level) + 1;
    return nextIdx < LEVEL_TIERS.length ? LEVEL_TIERS[nextIdx] : null;
  }, [currentTier]);

  const levelProgress = useMemo(() => {
    if (!nextTier) return 100;
    const tierRange = currentTier.maxXp - currentTier.minXp;
    const progressInTier = user.xp - currentTier.minXp;
    return Math.min(100, Math.max(0, Math.round((progressInTier / tierRange) * 100)));
  }, [currentTier, nextTier, user.xp]);

  const xpNeeded = nextTier ? nextTier.minXp - user.xp : 0;

  const handleBadgeClick = (badge: (typeof careerBadges)[0]) => {
    if (!badge.unlocked) {
      unlockBadge(badge.id);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5 text-orange-600" />
            <span>Career Level & Milestone XP Progression</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Level {currentTier.level}: {currentTier.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Earn XP by completing roadmap milestones, practice sessions, and mock tests to unlock career privileges.
          </p>
        </div>

        {/* Level Badge Banner */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-5 py-3 rounded-2xl shadow-md shadow-orange-500/20 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-xl">
            {currentTier.level}
          </div>
          <div>
            <span className="text-[10px] font-bold text-orange-200 uppercase tracking-wider block">
              Current Rank
            </span>
            <span className="text-sm font-extrabold leading-tight">{currentTier.badgeName}</span>
          </div>
        </div>
      </div>

      {/* Level XP Progress Bar */}
      <div className="p-5 rounded-2xl bg-[#fffbf7] border border-orange-200/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-600 fill-orange-500" />
            <span className="font-extrabold text-slate-900">{user.xp} Total XP</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-semibold">Tier Progress: {levelProgress}%</span>
          </div>
          {nextTier ? (
            <span className="text-xs font-bold text-orange-800">
              {xpNeeded} XP needed for Level {nextTier.level} ({nextTier.title})
            </span>
          ) : (
            <span className="text-xs font-bold text-emerald-700">👑 Max Career Level Reached!</span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-orange-100/70 h-3.5 rounded-full overflow-hidden p-0.5 border border-orange-200">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${levelProgress}%` }}
          />
        </div>

        {/* Level Perks */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-600">
          <span className="font-bold text-slate-800">Unlocked Privileges:</span>
          {currentTier.perks.map((p, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white border border-orange-200 text-orange-950 font-semibold"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Career Badges Shelf */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-slate-900">Career Milestone Badges</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {careerBadges.filter((b) => b.unlocked).length} of {careerBadges.length} Badges Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {careerBadges.map((badge) => {
            const IconComponent = ICON_MAP[badge.icon] || Trophy;
            return (
              <div
                key={badge.id}
                onClick={() => handleBadgeClick(badge)}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between group cursor-pointer ${
                  badge.unlocked
                    ? 'bg-white border-orange-200 hover:border-orange-400 hover:shadow-md'
                    : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        badge.unlocked
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {badge.unlocked ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="font-extrabold text-orange-600">+{badge.xpValue} XP</span>
                  <span className="text-slate-400 font-medium">
                    {badge.unlockedAt || 'Tap to test unlock'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
