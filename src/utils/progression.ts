import { EngineeringDomain, PracticeSessionRecord, LevelTier } from '../types';
import { LEVEL_TIERS } from '../data/sampleProfileData';

export function calculateLevelTier(xp: number): {
  currentTier: LevelTier;
  nextTier: LevelTier | null;
  progressPercent: number;
  xpNeeded: number;
} {
  const currentTier =
    LEVEL_TIERS.find((t) => xp >= t.minXp && xp < t.maxXp) ||
    LEVEL_TIERS[LEVEL_TIERS.length - 1];

  const nextIdx = LEVEL_TIERS.findIndex((t) => t.level === currentTier.level) + 1;
  const nextTier = nextIdx < LEVEL_TIERS.length ? LEVEL_TIERS[nextIdx] : null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      xpNeeded: 0,
    };
  }

  const tierRange = currentTier.maxXp - currentTier.minXp;
  const progressInTier = xp - currentTier.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((progressInTier / tierRange) * 100)));
  const xpNeeded = Math.max(0, nextTier.minXp - xp);

  return {
    currentTier,
    nextTier,
    progressPercent,
    xpNeeded,
  };
}

export function calculateStudyGoalProgress(studiedHours: number, targetHours: number): {
  percentage: number;
  isGoalMet: boolean;
  remainingMinutes: number;
} {
  const safeTarget = Math.max(0.5, targetHours);
  const percentage = Math.min(100, Math.round((studiedHours / safeTarget) * 100));
  const isGoalMet = studiedHours >= safeTarget;
  const remainingHours = Math.max(0, safeTarget - studiedHours);
  const remainingMinutes = Math.round(remainingHours * 60);

  return {
    percentage,
    isGoalMet,
    remainingMinutes,
  };
}

export function aggregateDomainPractice(sessions: PracticeSessionRecord[]) {
  const distribution: Record<EngineeringDomain, number> = {
    dsa: 0,
    system_design: 0,
    core_cs: 0,
    aptitude: 0,
    gd_verbal: 0,
  };

  let totalMinutes = 0;
  let totalQuestions = 0;

  sessions.forEach((s) => {
    distribution[s.domain] = (distribution[s.domain] || 0) + s.durationMinutes;
    totalMinutes += s.durationMinutes;
    totalQuestions += s.questionsSolved || 0;
  });

  return {
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    totalMinutes,
    totalSessions: sessions.length,
    totalQuestions,
    distribution,
  };
}
