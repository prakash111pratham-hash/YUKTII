import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, Calendar, Zap, Code2, Mic, Brain } from 'lucide-react';

interface SkillDataPoint {
  day: string;
  dayNum: number;
  coding: number;
  communication: number;
  aptitude: number;
  milestone?: string;
}

// Generate realistic 30-day upward trajectory for an engineering student
const generate30DayProgression = (): SkillDataPoint[] => {
  const points: SkillDataPoint[] = [];
  const baseCoding = 52;
  const baseComm = 56;
  const baseApt = 64;

  for (let i = 1; i <= 30; i++) {
    // Smoothed gradual growth with realistic fluctuations
    const progressFactor = i / 30;
    const coding = Math.min(94, Math.round(baseCoding + progressFactor * 36 + Math.sin(i * 0.8) * 2));
    const communication = Math.min(88, Math.round(baseComm + progressFactor * 26 + Math.cos(i * 0.9) * 2));
    const aptitude = Math.min(90, Math.round(baseApt + progressFactor * 22 + Math.sin(i * 0.5) * 1.5));

    let milestone: string | undefined;
    if (i === 1) milestone = 'Stage 1 Started';
    else if (i === 8) milestone = 'Solved First 5 LeetCode DSA';
    else if (i === 15) milestone = 'TCS NQT Mock 78%';
    else if (i === 22) milestone = 'Speech Lab: 135 WPM';
    else if (i === 30) milestone = 'Day-1 Ready Index: 88%';

    points.push({
      day: `Day ${i}`,
      dayNum: i,
      coding,
      communication,
      aptitude,
      milestone,
    });
  }
  return points;
};

const fullData = generate30DayProgression();

export const SkillProgressionChart: React.FC = () => {
  const [range, setRange] = useState<'30' | '14' | '7'>('30');
  const [activeSeries, setActiveSeries] = useState<{
    coding: boolean;
    communication: boolean;
    aptitude: boolean;
  }>({
    coding: true,
    communication: true,
    aptitude: true,
  });

  const filteredData =
    range === '7'
      ? fullData.slice(23)
      : range === '14'
      ? fullData.slice(16)
      : fullData;

  const currentCoding = fullData[29].coding;
  const currentComm = fullData[29].communication;
  const currentApt = fullData[29].aptitude;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as SkillDataPoint;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
          <div className="font-extrabold text-indigo-300 pb-1 border-b border-slate-700 flex items-center justify-between gap-4">
            <span>{label}</span>
            {point.milestone && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                🚩 {point.milestone}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-purple-300 flex items-center gap-1 font-semibold">
              <Code2 className="w-3.5 h-3.5" /> Coding:
            </span>
            <span className="font-extrabold">{point.coding}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sky-300 flex items-center gap-1 font-semibold">
              <Mic className="w-3.5 h-3.5" /> Communication:
            </span>
            <span className="font-extrabold">{point.communication}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-emerald-300 flex items-center gap-1 font-semibold">
              <Brain className="w-3.5 h-3.5" /> Aptitude:
            </span>
            <span className="font-extrabold">{point.aptitude}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100/70 text-orange-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                30-Day Skill Growth Progression
              </h2>
              <p className="text-xs text-slate-500">
                Tracking verified metrics in Coding, Communication, and Aptitude over time
              </p>
            </div>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
          {(['7', '14', '30'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                range === r ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === '30' ? '30 Days' : `${r} Days`}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Chips */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setActiveSeries((prev) => ({ ...prev, coding: !prev.coding }))}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            activeSeries.coding
              ? 'bg-purple-50/70 border-purple-200 shadow-xs ring-2 ring-purple-500/20'
              : 'bg-slate-50 border-slate-200 opacity-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-purple-700 uppercase">Coding Mastery</span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
          </div>
          <div className="text-lg font-extrabold text-slate-900 mt-1">{currentCoding}%</div>
          <span className="text-[10px] text-emerald-600 font-bold">+38% past month</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSeries((prev) => ({ ...prev, communication: !prev.communication }))}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            activeSeries.communication
              ? 'bg-sky-50/70 border-sky-200 shadow-xs ring-2 ring-sky-500/20'
              : 'bg-slate-50 border-slate-200 opacity-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-sky-700 uppercase">Communication</span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          </div>
          <div className="text-lg font-extrabold text-slate-900 mt-1">{currentComm}%</div>
          <span className="text-[10px] text-emerald-600 font-bold">+26% past month</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSeries((prev) => ({ ...prev, aptitude: !prev.aptitude }))}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            activeSeries.aptitude
              ? 'bg-emerald-50/70 border-emerald-200 shadow-xs ring-2 ring-emerald-500/20'
              : 'bg-slate-50 border-slate-200 opacity-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Aptitude & Quants</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-lg font-extrabold text-slate-900 mt-1">{currentApt}%</div>
          <span className="text-[10px] text-emerald-600 font-bold">+22% past month</span>
        </button>
      </div>

      {/* Recharts Area Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCoding" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorApt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              interval={range === '30' ? 4 : range === '14' ? 2 : 0}
            />
            <YAxis
              domain={[40, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />

            {activeSeries.coding && (
              <Area
                type="monotone"
                dataKey="coding"
                name="Coding"
                stroke="#9333ea"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCoding)"
              />
            )}
            {activeSeries.communication && (
              <Area
                type="monotone"
                dataKey="communication"
                name="Communication"
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorComm)"
              />
            )}
            {activeSeries.aptitude && (
              <Area
                type="monotone"
                dataKey="aptitude"
                name="Aptitude"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorApt)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <span>Click any metric card above to toggle visibility</span>
        <span className="font-semibold text-indigo-600">Day 1 to Day 30 verified trajectory</span>
      </div>
    </div>
  );
};
