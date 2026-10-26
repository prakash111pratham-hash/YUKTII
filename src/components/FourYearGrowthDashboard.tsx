import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart as RechartsRadar,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Award,
  BookOpen,
  Code2,
  Users,
  Sparkles,
  Layers,
  BarChart3,
  Compass,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react';

interface JourneyDataPoint {
  period: string; // 'Year 1' or 'Sem 1'
  periodLabel: string;
  yearNum: number;
  academic: number; // 0-100
  technical: number; // 0-100
  extracurricular: number; // 0-100
  compositeReadiness: number; // 0-100
  milestone?: string;
  highlightDetail?: string;
}

// 4-Year Academic Progression Data (Semester-by-Semester & Year-by-Year)
const SEMESTER_DATA: JourneyDataPoint[] = [
  {
    period: 'Sem 1',
    periodLabel: 'Sem 1 (Freshman Fall)',
    yearNum: 1,
    academic: 68,
    technical: 35,
    extracurricular: 40,
    compositeReadiness: 38,
    milestone: 'Engineering Transition',
    highlightDetail: 'C Programming, Calculus & Physics Lab fundamentals',
  },
  {
    period: 'Sem 2',
    periodLabel: 'Sem 2 (Freshman Spring)',
    yearNum: 1,
    academic: 74,
    technical: 48,
    extracurricular: 52,
    compositeReadiness: 49,
    milestone: 'First Hackathon Entry',
    highlightDetail: 'Data Structures in C++, Git basics, Club onboarding',
  },
  {
    period: 'Sem 3',
    periodLabel: 'Sem 3 (Sophomore Fall)',
    yearNum: 2,
    academic: 79,
    technical: 62,
    extracurricular: 58,
    compositeReadiness: 61,
    milestone: 'OOP & Discrete Math',
    highlightDetail: 'Java / Python OOP, 50 LeetCode solved, Linux workflows',
  },
  {
    period: 'Sem 4',
    periodLabel: 'Sem 4 (Sophomore Spring)',
    yearNum: 2,
    academic: 83,
    technical: 74,
    extracurricular: 67,
    compositeReadiness: 72,
    milestone: 'First Full-Stack Project',
    highlightDetail: 'PostgreSQL, Express/React, College Tech Fest Organizer',
  },
  {
    period: 'Sem 5',
    periodLabel: 'Sem 5 (Junior Fall)',
    yearNum: 3,
    academic: 86,
    technical: 82,
    extracurricular: 75,
    compositeReadiness: 81,
    milestone: 'Summer Internship Screening',
    highlightDetail: 'OS, DBMS, Computer Networks, 150+ DSA problems',
  },
  {
    period: 'Sem 6',
    periodLabel: 'Sem 6 (Junior Spring)',
    yearNum: 3,
    academic: 88,
    technical: 89,
    extracurricular: 82,
    compositeReadiness: 87,
    milestone: 'Smart India Hackathon Finalist',
    highlightDetail: 'Summer Internship secured, Cloud AWS/GCP, Lead Mentor',
  },
  {
    period: 'Sem 7',
    periodLabel: 'Sem 7 (Senior Fall)',
    yearNum: 4,
    academic: 90,
    technical: 94,
    extracurricular: 88,
    compositeReadiness: 93,
    milestone: 'Day-1 Campus Placement',
    highlightDetail: 'System Design rounds, Capstone Phase 1, PPO Offer in hand',
  },
  {
    period: 'Sem 8',
    periodLabel: 'Sem 8 (Senior Spring)',
    yearNum: 4,
    academic: 92,
    technical: 96,
    extracurricular: 91,
    compositeReadiness: 95,
    milestone: 'Degree Capstone & Onboarding',
    highlightDetail: 'Industry Capstone, Tech Community Keynote, Final CGPA 8.8+',
  },
];

// Year-aggregated Data
const YEAR_DATA: JourneyDataPoint[] = [
  {
    period: 'Year 1',
    periodLabel: 'Year 1: Foundations & Orientation',
    yearNum: 1,
    academic: 71,
    technical: 42,
    extracurricular: 46,
    compositeReadiness: 44,
    milestone: 'Foundations Mastered',
    highlightDetail: 'C/C++, Engineering Math, Git versioning & Tech Club Join',
  },
  {
    period: 'Year 2',
    periodLabel: 'Year 2: Core Engineering & Systems',
    yearNum: 2,
    academic: 81,
    technical: 68,
    extracurricular: 63,
    compositeReadiness: 67,
    milestone: 'Full-Stack & 100 DSA',
    highlightDetail: 'Data Structures, DBMS, Full-Stack deployment, Hackathon participant',
  },
  {
    period: 'Year 3',
    periodLabel: 'Year 3: Specialization & Internships',
    yearNum: 3,
    academic: 87,
    technical: 86,
    extracurricular: 79,
    compositeReadiness: 84,
    milestone: 'Internship & SIH Finalist',
    highlightDetail: 'OS/Networks core, 200+ LeetCode, Industrial Summer Internship',
  },
  {
    period: 'Year 4',
    periodLabel: 'Year 4: Placements & Industry Capstone',
    yearNum: 4,
    academic: 91,
    technical: 95,
    extracurricular: 90,
    compositeReadiness: 94,
    milestone: 'Day-1 Placement & Capstone',
    highlightDetail: 'System Design, Dream Placement Offer (18+ LPA), Capstone launch',
  },
];

// Multi-dimensional Radar Attributes for Year 1 vs Year 4
const RADAR_EVOLUTION_DATA = [
  { subject: 'Academic CGPA', year1: 65, current: 82, year4: 92, fullMark: 100 },
  { subject: 'DSA & Algorithms', year1: 30, current: 75, year4: 96, fullMark: 100 },
  { subject: 'System Design', year1: 20, current: 65, year4: 90, fullMark: 100 },
  { subject: 'Frameworks & Cloud', year1: 25, current: 80, year4: 95, fullMark: 100 },
  { subject: 'Hackathons & Projects', year1: 40, current: 78, year4: 92, fullMark: 100 },
  { subject: 'Leadership & Soft Skills', year1: 50, current: 74, year4: 89, fullMark: 100 },
];

export const FourYearGrowthDashboard: React.FC = () => {
  const { user } = useApp();

  const [granularity, setGranularity] = useState<'year' | 'semester'>('year');
  const [chartType, setChartType] = useState<'area' | 'bar' | 'radar'>('area');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'academic' | 'technical' | 'extracurricular'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<JourneyDataPoint | null>(null);

  const activeDataset = granularity === 'year' ? YEAR_DATA : SEMESTER_DATA;

  // Determine current student year index (1 to 4)
  const currentYearNumber =
    user.currentYear.includes('1')
      ? 1
      : user.currentYear.includes('2')
      ? 2
      : user.currentYear.includes('3')
      ? 3
      : 4;

  const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as JourneyDataPoint;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-slate-700 text-xs space-y-2 min-w-[240px]">
          <div className="pb-1.5 border-b border-slate-700/80 flex items-center justify-between gap-3">
            <span className="font-bold text-orange-400 text-sm">{point.periodLabel}</span>
            {point.milestone && (
              <span className="text-[10px] bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded-full font-semibold">
                🎯 {point.milestone}
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-blue-300">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Academic:
              </span>
              <span className="font-bold text-white">{point.academic}%</span>
            </div>
            <div className="flex items-center justify-between text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> Technical DSA & Dev:
              </span>
              <span className="font-bold text-white">{point.technical}%</span>
            </div>
            <div className="flex items-center justify-between text-amber-300">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Extracurricular & GD:
              </span>
              <span className="font-bold text-white">{point.extracurricular}%</span>
            </div>
            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-orange-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Day-1 Placement Index:
              </span>
              <span className="font-extrabold text-white">{point.compositeReadiness}%</span>
            </div>
          </div>

          {point.highlightDetail && (
            <div className="pt-1 text-[11px] text-slate-300 italic border-t border-slate-800/80">
              Key Milestone: {point.highlightDetail}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              4-Year Engineering Journey Growth Dashboard
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Visual progression benchmarked across Academic Coursework, Technical/DSA Mastery, and Extracurricular Leadership
          </p>
        </div>

        {/* View toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Chart Type Toggle */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === 'area' ? 'bg-white text-orange-600 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Area Trajectory
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === 'bar' ? 'bg-white text-orange-600 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Category Bars
            </button>
            <button
              type="button"
              onClick={() => setChartType('radar')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === 'radar' ? 'bg-white text-orange-600 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Evolution Radar
            </button>
          </div>

          {/* Granularity Toggle (Only for Area and Bar) */}
          {chartType !== 'radar' && (
            <div className="inline-flex p-1 bg-orange-50 rounded-xl text-xs font-semibold text-orange-950 border border-orange-100">
              <button
                type="button"
                onClick={() => setGranularity('year')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  granularity === 'year' ? 'bg-orange-600 text-white shadow-xs' : 'hover:text-orange-900'
                }`}
              >
                4-Year View
              </button>
              <button
                type="button"
                onClick={() => setGranularity('semester')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  granularity === 'semester' ? 'bg-orange-600 text-white shadow-xs' : 'hover:text-orange-900'
                }`}
              >
                8-Semester View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
          <div className="flex items-center justify-between text-blue-700 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Academic
            </span>
            <span className="text-[11px] bg-blue-100 px-1.5 py-0.5 rounded font-bold">+24% Δ</span>
          </div>
          <div className="text-2xl font-black text-blue-950">92%</div>
          <div className="text-[11px] text-blue-800 font-medium">8.8+ CGPA Coursework Depth</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Technical
            </span>
            <span className="text-[11px] bg-emerald-100 px-1.5 py-0.5 rounded font-bold">+61% Δ</span>
          </div>
          <div className="text-2xl font-black text-emerald-950">96%</div>
          <div className="text-[11px] text-emerald-800 font-medium">250+ DSA & System Design</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Extracurricular
            </span>
            <span className="text-[11px] bg-amber-100 px-1.5 py-0.5 rounded font-bold">+51% Δ</span>
          </div>
          <div className="text-2xl font-black text-amber-950">91%</div>
          <div className="text-[11px] text-amber-800 font-medium">Hackathons & Club Leadership</div>
        </div>

        <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-1">
          <div className="flex items-center justify-between text-orange-700 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Day-1 Readiness
            </span>
            <span className="text-[11px] bg-orange-200/80 px-1.5 py-0.5 rounded font-bold text-orange-900">
              Tier-1 Ready
            </span>
          </div>
          <div className="text-2xl font-black text-orange-950">95%</div>
          <div className="text-[11px] text-orange-800 font-medium">Target: INR {user.targetLPA || 18} LPA</div>
        </div>
      </div>

      {/* Category Filter Pills (when in Area/Bar view) */}
      {chartType !== 'radar' && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Highlight Category:</span>
            <div className="inline-flex gap-1.5">
              {(
                [
                  { id: 'all', label: 'All 3 Categories' },
                  { id: 'academic', label: 'Academic Only' },
                  { id: 'technical', label: 'Technical Only' },
                  { id: 'extracurricular', label: 'Extracurricular Only' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                    categoryFilter === tab.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>
              Current Standing:{' '}
              <strong className="text-slate-800 font-bold">{user.currentYear}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Primary Chart Area using Recharts */}
      <div className="w-full h-80 sm:h-96 pt-2">
        {chartType === 'area' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeDataset} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="academicGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="techGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="extraGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="placementGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="period"
                stroke="#64748b"
                tick={{ fontSize: 12, fontWeight: 600 }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                domain={[20, 100]}
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
                tickLine={false}
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                iconType="circle"
              />

              {(categoryFilter === 'all' || categoryFilter === 'academic') && (
                <Area
                  type="monotone"
                  dataKey="academic"
                  name="Academic & Coursework Depth"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#academicGrad)"
                />
              )}

              {(categoryFilter === 'all' || categoryFilter === 'technical') && (
                <Area
                  type="monotone"
                  dataKey="technical"
                  name="Technical & Problem Solving"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#techGrad)"
                />
              )}

              {(categoryFilter === 'all' || categoryFilter === 'extracurricular') && (
                <Area
                  type="monotone"
                  dataKey="extracurricular"
                  name="Extracurricular & Leadership"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#extraGrad)"
                />
              )}

              {categoryFilter === 'all' && (
                <Area
                  type="monotone"
                  dataKey="compositeReadiness"
                  name="Placement Readiness Index"
                  stroke="#ea580c"
                  strokeWidth={3}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#placementGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}

        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeDataset} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="period"
                stroke="#64748b"
                tick={{ fontSize: 12, fontWeight: 600 }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
                tickLine={false}
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />

              {(categoryFilter === 'all' || categoryFilter === 'academic') && (
                <Bar
                  dataKey="academic"
                  name="Academic Coursework"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              )}

              {(categoryFilter === 'all' || categoryFilter === 'technical') && (
                <Bar
                  dataKey="technical"
                  name="Technical / DSA"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              )}

              {(categoryFilter === 'all' || categoryFilter === 'extracurricular') && (
                <Bar
                  dataKey="extracurricular"
                  name="Extracurricular & GD"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'radar' && (
          <div className="w-full h-full flex flex-col md:flex-row items-center justify-around gap-4">
            <div className="w-full md:w-3/5 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsRadar data={RADAR_EVOLUTION_DATA}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#475569' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                  <Radar
                    name="Year 1 (Freshman Baseline)"
                    dataKey="year1"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.2}
                  />
                  <Radar
                    name="Current Standing (Mid-Journey)"
                    dataKey="current"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="Year 4 (Target Campus Graduate)"
                    dataKey="year4"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.25}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip />
                </RechartsRadar>
              </ResponsiveContainer>
            </div>

            <div className="w-full md:w-2/5 p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3 text-xs text-orange-950">
              <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Evolution Delta Insights
              </div>
              <p className="leading-relaxed text-slate-700">
                Notice the massive compounding acceleration in{' '}
                <strong className="text-emerald-700">DSA & Algorithms (+66 pts)</strong> and{' '}
                <strong className="text-emerald-700">System Design (+70 pts)</strong> between Year 1 and Year 4.
              </p>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] pb-1 border-b border-orange-200/60">
                  <span className="font-semibold text-slate-700">Year 1 Freshman Baseline:</span>
                  <span className="font-bold text-slate-800">44% Composite Readiness</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pb-1 border-b border-orange-200/60">
                  <span className="font-semibold text-orange-800">Current Standing ({user.currentYear}):</span>
                  <span className="font-bold text-orange-900">77% Active Progress</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-800">Year 4 Campus Target:</span>
                  <span className="font-bold text-emerald-900">95% (Day-1 Day Ready)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4-Year Milestone Interactive Ribbon */}
      <div className="pt-2 border-t border-slate-100">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-orange-600" /> Key Engineering Journey Milestones Along the 4 Years
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {YEAR_DATA.map((item) => {
            const isCurrent = item.yearNum === currentYearNumber;
            const isCompleted = item.yearNum < currentYearNumber;
            return (
              <div
                key={item.period}
                className={`p-3.5 rounded-2xl border transition-all text-xs ${
                  isCurrent
                    ? 'bg-orange-50/80 border-orange-300 ring-2 ring-orange-400/30 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className={isCurrent ? 'text-orange-900' : isCompleted ? 'text-emerald-900' : 'text-slate-800'}>
                    {item.period}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isCurrent
                        ? 'bg-orange-200 text-orange-900'
                        : isCompleted
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isCurrent ? 'Current' : isCompleted ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 text-sm mb-1">{item.milestone}</div>
                <p className="text-[11px] text-slate-600 leading-normal">{item.highlightDetail}</p>
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-500">Readiness:</span>
                  <span className={item.compositeReadiness >= 80 ? 'text-emerald-600' : 'text-orange-600'}>
                    {item.compositeReadiness}%
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
