import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  Flame,
  Clock,
  Sparkles,
  Plus,
  CheckCircle2,
  Trophy,
  Zap,
  Edit3,
  Check,
  Code2,
  Database,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DailyStudyGoal: React.FC = () => {
  const {
    studyGoal,
    updateStudyGoal,
    logStudyTime,
    logCodingProblems,
    user,
    incrementXp,
    unlockBadge,
  } = useApp();

  const [isEditingHours, setIsEditingHours] = useState(false);
  const [isEditingProblems, setIsEditingProblems] = useState(false);

  const [tempHoursTarget, setTempHoursTarget] = useState(studyGoal.targetHours || 3);
  const [tempProblemsTarget, setTempProblemsTarget] = useState(
    studyGoal.targetCodingProblems || 5
  );

  // Focus Hours Calculations
  const hoursTarget = studyGoal.targetHours || 3;
  const hoursStudied = studyGoal.studiedHoursToday || 0;
  const hoursPercent = Math.min(100, Math.round((hoursStudied / hoursTarget) * 100));
  const isHoursGoalMet = hoursStudied >= hoursTarget;
  const remainingHours = Math.max(0, hoursTarget - hoursStudied);
  const remainingMinutes = Math.round(remainingHours * 60);

  // Coding Problems Calculations
  const problemsTarget = studyGoal.targetCodingProblems || 5;
  const problemsSolved = studyGoal.solvedCodingProblemsToday || 0;
  const problemsPercent = Math.min(100, Math.round((problemsSolved / problemsTarget) * 100));
  const isProblemsGoalMet = problemsSolved >= problemsTarget;
  const remainingProblems = Math.max(0, problemsTarget - problemsSolved);

  // Overall Completion
  const allGoalsMet = isHoursGoalMet && isProblemsGoalMet;

  // Handle saving targets to AppContext & Firestore
  const handleSaveHoursTarget = () => {
    updateStudyGoal({ targetHours: Number(tempHoursTarget) });
    setIsEditingHours(false);
  };

  const handleSaveProblemsTarget = () => {
    updateStudyGoal({ targetCodingProblems: Number(tempProblemsTarget) });
    setIsEditingProblems(false);
  };

  // Quick Action Handlers
  const handleQuickAddHours = (minutes: number) => {
    logStudyTime(minutes, 'dsa');
    const newHours = hoursStudied + minutes / 60;
    if (!isHoursGoalMet && newHours >= hoursTarget) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      incrementXp(100, 'Met daily focus hours target!');
    }
  };

  const handleQuickAddProblems = (count: number) => {
    logCodingProblems(count);
    const newProblems = problemsSolved + count;
    if (!isProblemsGoalMet && newProblems >= problemsTarget) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      incrementXp(100, 'Met daily coding problem target!');
      unlockBadge('b-dsa-master');
    }
  };

  // Circular gauge math for hours (radius 44, circumference ≈ 276.46)
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffsetHours =
    circumference - (hoursPercent / 100) * circumference;
  const strokeDashoffsetProblems =
    circumference - (problemsPercent / 100) * circumference;

  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
      {/* Widget Header & Streak */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Daily Study Goals
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Firestore Synced
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Set and track daily focus hours & coding problem targets · {todayDateString}
            </p>
          </div>
        </div>

        {/* Live Streak & Global Milestone */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-orange-950">
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
            <span>{studyGoal.streakDays || 1}-Day Streak</span>
          </div>

          {allGoalsMet ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All Goals Complete! (+200 XP)</span>
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-500 hidden md:inline">
              Keep pushing to maintain your daily streak
            </span>
          )}
        </div>
      </div>

      {/* Main Dual Target Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ================= CARD 1: FOCUS HOURS ================= */}
        <div className="p-5 rounded-2xl bg-[#fffbf7] border border-orange-200/90 flex flex-col justify-between gap-5 relative overflow-hidden">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Focus Study Hours</span>
                <span className="text-[10px] text-slate-500">DSA & Core Engineering Theory</span>
              </div>
            </div>

            {!isEditingHours ? (
              <button
                type="button"
                onClick={() => {
                  setTempHoursTarget(hoursTarget);
                  setIsEditingHours(true);
                }}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-orange-200 shadow-2xs"
              >
                <Edit3 className="w-3 h-3" />
                <span>Adjust</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveHoursTarget}
                className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-lg shadow-2xs"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
            )}
          </div>

          {/* Edit Slider Mode or Progress Display */}
          {isEditingHours ? (
            <div className="p-3 bg-white rounded-xl border border-orange-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Set Daily Target:</span>
                <span className="text-orange-600 font-black">{tempHoursTarget} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={tempHoursTarget}
                onChange={(e) => setTempHoursTarget(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
              <div className="flex items-center justify-between gap-1">
                {[2, 3, 4, 5, 6].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setTempHoursTarget(h)}
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      tempHoursTarget === h
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              {/* Circular Gauge */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-orange-100"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-orange-600 transition-all duration-700 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffsetHours}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-slate-900 leading-none tabular-nums">
                    {hoursStudied}h
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">of {hoursTarget}h</span>
                  <span className="text-[10px] font-bold text-orange-600">{hoursPercent}%</span>
                </div>
              </div>

              {/* Status details */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Today's Focus:</span>
                  <span className="font-extrabold text-slate-900 tabular-nums">
                    {hoursStudied} / {hoursTarget} hrs
                  </span>
                </div>

                <div className="w-full bg-orange-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-600 h-full transition-all duration-500"
                    style={{ width: `${hoursPercent}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-600 pt-0.5">
                  {isHoursGoalMet ? (
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Goal Achieved today!
                    </span>
                  ) : (
                    <span>
                      <strong>{remainingMinutes}m remaining</strong> to hit your daily study goal
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Log Buttons for Hours */}
          <div className="pt-2 border-t border-orange-100">
            <span className="text-[10px] font-bold text-slate-500 block mb-1.5">
              ⚡ Quick Log Focus Time:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickAddHours(15)}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-orange-100 text-orange-950 border border-orange-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3 text-orange-600" />
                <span>+15m</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddHours(30)}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-orange-100 text-orange-950 border border-orange-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3 text-orange-600" />
                <span>+30m</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddHours(60)}
                className="py-1.5 px-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Zap className="w-3 h-3 text-amber-200" />
                <span>+1h Focus</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= CARD 2: CODING PROBLEMS ================= */}
        <div className="p-5 rounded-2xl bg-[#f8fbff] border border-blue-200/90 flex flex-col justify-between gap-5 relative overflow-hidden">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Coding Problem Targets</span>
                <span className="text-[10px] text-slate-500">DSA Arena & LeetCode/CodeChef</span>
              </div>
            </div>

            {!isEditingProblems ? (
              <button
                type="button"
                onClick={() => {
                  setTempProblemsTarget(problemsTarget);
                  setIsEditingProblems(true);
                }}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs"
              >
                <Edit3 className="w-3 h-3" />
                <span>Adjust</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveProblemsTarget}
                className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-lg shadow-2xs"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
            )}
          </div>

          {/* Edit Slider Mode or Progress Display */}
          {isEditingProblems ? (
            <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Set Daily Target:</span>
                <span className="text-blue-600 font-black">{tempProblemsTarget} Problems</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={tempProblemsTarget}
                onChange={(e) => setTempProblemsTarget(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex items-center justify-between gap-1">
                {[3, 5, 8, 10, 12].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTempProblemsTarget(p)}
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      tempProblemsTarget === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              {/* Circular Gauge */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-blue-100"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-blue-600 transition-all duration-700 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffsetProblems}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-slate-900 leading-none tabular-nums">
                    {problemsSolved}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">of {problemsTarget}</span>
                  <span className="text-[10px] font-bold text-blue-600">{problemsPercent}%</span>
                </div>
              </div>

              {/* Status details */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Problems Solved:</span>
                  <span className="font-extrabold text-slate-900 tabular-nums">
                    {problemsSolved} / {problemsTarget} Solved
                  </span>
                </div>

                <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-500"
                    style={{ width: `${problemsPercent}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-600 pt-0.5">
                  {isProblemsGoalMet ? (
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Coding Target Met! (+100 XP)
                    </span>
                  ) : (
                    <span>
                      <strong>{remainingProblems} problem(s) remaining</strong> to hit daily target
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Log Buttons for Problems */}
          <div className="pt-2 border-t border-blue-100">
            <span className="text-[10px] font-bold text-slate-500 block mb-1.5">
              ⚡ Quick Log Solved Problems:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickAddProblems(1)}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-blue-50 text-blue-950 border border-blue-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3 text-blue-600" />
                <span>+1 Easy</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddProblems(1)}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-blue-50 text-blue-950 border border-blue-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3 text-blue-600" />
                <span>+1 Medium</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddProblems(2)}
                className="py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>+2 Contest</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info & Target Sync Path */}
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-orange-600" />
          <span>Firestore Document:</span>
          <code className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
            users/{user.id || 'uid'}/studyGoals/{new Date().toISOString().slice(0, 10)}
          </code>
        </div>
        <span className="text-[10px] font-semibold text-slate-500">
          Last Synced: {new Date(studyGoal.lastUpdated || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};
