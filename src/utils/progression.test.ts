import { test } from 'node:test';
import assert from 'node:assert';
import {
  calculateLevelTier,
  calculateStudyGoalProgress,
  aggregateDomainPractice,
} from './progression';
import { PracticeSessionRecord } from '../types';

test('calculateLevelTier accurately computes tier, progress and xpNeeded', () => {
  // Test Level 1: 250 XP (0-500 XP)
  const l1 = calculateLevelTier(250);
  assert.strictEqual(l1.currentTier.level, 1);
  assert.strictEqual(l1.progressPercent, 50);
  assert.strictEqual(l1.xpNeeded, 250);

  // Test Level 3: 1450 XP (1200-2200 XP)
  const l3 = calculateLevelTier(1450);
  assert.strictEqual(l3.currentTier.level, 3);
  assert.strictEqual(l3.currentTier.title, 'Algorithmic Contender');
  assert.strictEqual(l3.progressPercent, 25);
  assert.strictEqual(l3.xpNeeded, 750);

  // Test Top Level: 7500 XP
  const l6 = calculateLevelTier(7500);
  assert.strictEqual(l6.currentTier.level, 6);
  assert.strictEqual(l6.progressPercent, 100);
  assert.strictEqual(l6.xpNeeded, 0);
});

test('calculateStudyGoalProgress computes completion percentage and remaining time', () => {
  // 2 hours studied out of 4 hours
  const p1 = calculateStudyGoalProgress(2, 4);
  assert.strictEqual(p1.percentage, 50);
  assert.strictEqual(p1.isGoalMet, false);
  assert.strictEqual(p1.remainingMinutes, 120);

  // 3.5 hours studied out of 3 hours (goal exceeded)
  const p2 = calculateStudyGoalProgress(3.5, 3);
  assert.strictEqual(p2.percentage, 100);
  assert.strictEqual(p2.isGoalMet, true);
  assert.strictEqual(p2.remainingMinutes, 0);
});

test('aggregateDomainPractice correctly sums minutes and questions by engineering domain', () => {
  const sampleSessions: PracticeSessionRecord[] = [
    {
      id: '1',
      date: '2026-10-20',
      domain: 'dsa',
      domainLabel: 'DSA',
      durationMinutes: 60,
      intensity: 2,
      questionsSolved: 4,
    },
    {
      id: '2',
      date: '2026-10-21',
      domain: 'dsa',
      domainLabel: 'DSA',
      durationMinutes: 30,
      intensity: 1,
      questionsSolved: 2,
    },
    {
      id: '3',
      date: '2026-10-22',
      domain: 'system_design',
      domainLabel: 'System Design',
      durationMinutes: 90,
      intensity: 4,
      questionsSolved: 1,
    },
  ];

  const result = aggregateDomainPractice(sampleSessions);
  assert.strictEqual(result.totalMinutes, 180);
  assert.strictEqual(result.totalHours, 3.0);
  assert.strictEqual(result.totalSessions, 3);
  assert.strictEqual(result.totalQuestions, 7);
  assert.strictEqual(result.distribution.dsa, 90);
  assert.strictEqual(result.distribution.system_design, 90);
});
