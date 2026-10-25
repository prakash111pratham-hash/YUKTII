import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  Flame,
  Clock,
  Sparkles,
  Plus,
  CheckCircle,
  Trophy,
  Zap,
  Edit2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DailyStudyGoal: React.FC = () => {
  const { studyGoal, updateStudyGoal, logStudyTime, user, incrementXp } = useApp();
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempTarget, setTempTarget] = useState(studyGoal.targetHours);

  const percentage = Math.min(
    100,
    Math.round((studyGoal.studiedHoursToday / studyGoal.targetHours) * 100)
  );

  const isGoalMet = studyGoal.studiedHoursToday >= studyGoal.targetHours;
  const remainingHours = Math.max(0, studyGoal.targetHours - studyGoal.studiedHoursToday);
  const remainingMinutes = Math.round(remainingHours * 60);

  const handleSaveGoal = () => {
    updateStudyGoal({ targetHours: Number(tempTarget) });
    setIsEditingGoal(false);
  };

  const handleQuickAdd = (minutes: number, label: string) => {
    logStudyTime(minutes, 'dsa');
    if (!isGoalMet && studyGoal.studiedHoursToday + minutes / 60 >= studyGoal.targetHours) {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      incrementXp(100, 'Met daily study goal!');
    }
  };

  // Circular gauge calculations (radius 48, perimeter = 2 * PI * 48 ≈ 301.6)
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-orange-600 flex items-center justify-center shadow-xs">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Daily Engineering Study Goal
            </h2>
            <p className="text-xs text-slate-500">
              Track hours dedicated to DSA, System Design, and campus prep
            </p>
          </div>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200/80 px-3 py-1.5 rounded-full">
          <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
          <span className="text-xs font-bold text-orange-900">
            {studyGoal.streakDays}-Day Streak
          </span>
        </div>
      </div>

      {/* Main Tracker Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Circular Progress Gauge */}
        <div className="flex flex-col items-center justify-center p-3">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-orange-100"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-orange-600 transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 leading-none">
                {studyGoal.studiedHoursToday}h
              </span>
              <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                of {studyGoal.targetHours}h goal
              </span>
              <span className="text-xs font-bold text-orange-600 mt-0.5">{percentage}%</span>
            </div>
          </div>

          <div className="mt-3 text-center">
            {isGoalMet ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Goal Completed (+100 XP)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-800 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                {remainingMinutes}m remaining today
              </span>
            )}
          </div>
        </div>

        {/* Target Adjuster & Metrics */}
        <div className="space-y-4 md:col-span-2">
          {/* Target Hours Controller */}
          <div className="p-4 rounded-2xl bg-[#fffbf7] border border-orange-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-600" /> Daily Target Study Hours
              </span>
              {!isEditingGoal ? (
                <button
                  type="button"
                  onClick={() => {
                    setTempTarget(studyGoal.targetHours);
                    setIsEditingGoal(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Change Target</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveGoal}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Save</span>
                </button>
              )}
            </div>

            {isEditingGoal ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={tempTarget}
                    onChange={(e) => setTempTarget(Number(e.target.value))}
                    className="flex-1 accent-orange-600 cursor-pointer"
                  />
                  <span className="text-sm font-extrabold text-orange-950 w-12 text-right">
                    {tempTarget} hrs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 5, 6].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setTempTarget(hrs)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        tempTarget === hrs
                          ? 'bg-orange-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {hrs}h
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>
                  Currently targeting <strong className="text-slate-900">{studyGoal.targetHours} hours/day</strong>
                </span>
                <span className="font-semibold text-orange-800">
                  {studyGoal.studiedHoursToday}h logged today
                </span>
              </div>
            )}
          </div>

          {/* Quick Log Buttons */}
          <div>
            <span className="block text-xs font-bold text-slate-700 mb-2">
              ⚡ Quick Log Engineering Practice Time:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickAdd(15, '+15m Revision')}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-orange-900 text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-orange-600" />
                <span>+15m Revision</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAdd(30, '+30m DSA Practice')}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-orange-900 text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-orange-600" />
                <span>+30m Problem</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAdd(60, '+1h Deep Focus')}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>+1h Deep Focus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
