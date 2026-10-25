import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EngineeringDomain, PracticeSessionRecord } from '../types';
import {
  Flame,
  Clock,
  CheckCircle2,
  Filter,
  Plus,
  Sparkles,
  Cpu,
  Layers,
  Database,
  Calculator,
  MessageSquare,
  X,
} from 'lucide-react';

const DOMAIN_CONFIG: Record<
  EngineeringDomain,
  { label: string; short: string; color: string; bg: string; icon: any }
> = {
  dsa: {
    label: 'Data Structures & Algorithms',
    short: 'DSA',
    color: '#ea580c',
    bg: 'bg-orange-500',
    icon: Cpu,
  },
  system_design: {
    label: 'System Design & Architecture',
    short: 'System Design',
    color: '#d97706',
    bg: 'bg-amber-500',
    icon: Layers,
  },
  core_cs: {
    label: 'Core CS (OS, DBMS, Networks)',
    short: 'Core CS',
    color: '#059669',
    bg: 'bg-emerald-600',
    icon: Database,
  },
  aptitude: {
    label: 'Quantitative & Logical Aptitude',
    short: 'Aptitude',
    color: '#4f46e5',
    bg: 'bg-indigo-600',
    icon: Calculator,
  },
  gd_verbal: {
    label: 'Verbal & Mock GD Speech',
    short: 'GD & Verbal',
    color: '#db2777',
    bg: 'bg-pink-600',
    icon: MessageSquare,
  },
};

export const SkillHeatmap: React.FC = () => {
  const { practiceSessions, addPracticeSession, user } = useApp();
  const [selectedDomain, setSelectedDomain] = useState<EngineeringDomain | 'all'>('all');
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    sessions: PracticeSessionRecord[];
    totalMinutes: number;
  } | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form state for logging a new session
  const [logForm, setLogForm] = useState({
    domain: 'dsa' as EngineeringDomain,
    durationMinutes: 45,
    intensity: 2 as 1 | 2 | 3 | 4,
    questionsSolved: 3,
    notes: '',
  });

  // Generate 14 weeks calendar grid (98 days)
  const calendarDays = useMemo(() => {
    const days: { dateStr: string; dayOfWeek: number; monthName: string; isToday: boolean }[] = [];
    const today = new Date();
    // Start 14 weeks ago on the closest Sunday
    const start = new Date(today);
    start.setDate(today.getDate() - 97);
    // Align start to Sunday
    const startDayOfWeek = start.getDay();
    start.setDate(start.getDate() - startDayOfWeek);

    const curr = new Date(start);
    while (curr <= today || days.length < 98) {
      const dateStr = curr.toISOString().slice(0, 10);
      days.push({
        dateStr,
        dayOfWeek: curr.getDay(),
        monthName: curr.toLocaleDateString('en-US', { month: 'short' }),
        isToday: dateStr === today.toISOString().slice(0, 10),
      });
      curr.setDate(curr.getDate() + 1);
    }
    return days;
  }, []);

  // Filtered sessions map by dateStr
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, PracticeSessionRecord[]>();
    practiceSessions.forEach((s) => {
      if (selectedDomain === 'all' || s.domain === selectedDomain) {
        const list = map.get(s.date) || [];
        list.push(s);
        map.set(s.date, list);
      }
    });
    return map;
  }, [practiceSessions, selectedDomain]);

  // Aggregate stats
  const stats = useMemo(() => {
    const filtered = practiceSessions.filter(
      (s) => selectedDomain === 'all' || s.domain === selectedDomain
    );
    const totalMinutes = filtered.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalSessions = filtered.length;
    const totalQuestions = filtered.reduce((acc, s) => acc + s.questionsSolved, 0);

    // Distribution by domain
    const distribution: Record<EngineeringDomain, number> = {
      dsa: 0,
      system_design: 0,
      core_cs: 0,
      aptitude: 0,
      gd_verbal: 0,
    };
    practiceSessions.forEach((s) => {
      distribution[s.domain] = (distribution[s.domain] || 0) + s.durationMinutes;
    });

    return {
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      totalSessions,
      totalQuestions,
      distribution,
    };
  }, [practiceSessions, selectedDomain]);

  // Determine intensity cell color
  const getCellColor = (dateStr: string) => {
    const sessions = sessionsByDate.get(dateStr);
    if (!sessions || sessions.length === 0) {
      return 'bg-orange-100/50 hover:ring-2 hover:ring-orange-300';
    }
    const maxIntensity = Math.max(...sessions.map((s) => s.intensity));
    switch (maxIntensity) {
      case 1:
        return 'bg-orange-300 text-orange-950 hover:ring-2 hover:ring-orange-400';
      case 2:
        return 'bg-orange-400 text-white hover:ring-2 hover:ring-orange-500';
      case 3:
        return 'bg-orange-600 text-white hover:ring-2 hover:ring-orange-600';
      case 4:
      default:
        return 'bg-orange-800 text-white shadow-xs hover:ring-2 hover:ring-orange-900';
    }
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: PracticeSessionRecord = {
      id: `sess-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      domain: logForm.domain,
      domainLabel: DOMAIN_CONFIG[logForm.domain].label,
      durationMinutes: Number(logForm.durationMinutes),
      intensity: logForm.intensity,
      questionsSolved: Number(logForm.questionsSolved),
      notes: logForm.notes || undefined,
    };
    addPracticeSession(newSession);
    setIsLogModalOpen(false);
    setLogForm({
      domain: 'dsa',
      durationMinutes: 45,
      intensity: 2,
      questionsSolved: 3,
      notes: '',
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
            <span>Multi-Domain Skill Progression Heatmap</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Engineering Practice Frequency & Intensity
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Visual tracking of DSA, System Design, Core CS, Aptitude, and Mock GD sessions over the past 14 weeks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsLogModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm shadow-orange-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Practice Session</span>
          </button>
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Domain:
        </span>
        <button
          type="button"
          onClick={() => setSelectedDomain('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedDomain === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Domains ({practiceSessions.length})
        </button>
        {(Object.keys(DOMAIN_CONFIG) as EngineeringDomain[]).map((dom) => {
          const cfg = DOMAIN_CONFIG[dom];
          const Icon = cfg.icon;
          const isActive = selectedDomain === dom;
          return (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? `${cfg.bg} text-white shadow-xs`
                  : 'bg-orange-50/80 border border-orange-200/60 text-slate-700 hover:bg-orange-100/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cfg.short}</span>
            </button>
          );
        })}
      </div>

      {/* Heatmap Grid & Stat Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Heatmap Matrix (3 cols) */}
        <div className="xl:col-span-3 bg-[#fffbf7] rounded-2xl p-5 border border-orange-200/80 shadow-2xs overflow-x-auto">
          <div className="min-w-[620px]">
            {/* Days of week labels & grid */}
            <div className="flex gap-2">
              <div className="flex flex-col justify-between text-[10px] font-bold text-slate-400 py-1 pr-2 w-7">
                <span>Sun</span>
                <span>Tue</span>
                <span>Thu</span>
                <span>Sat</span>
              </div>

              {/* 14 Weeks Column Grid */}
              <div className="flex-1 grid grid-flow-col grid-rows-7 gap-1.5">
                {calendarDays.slice(-98).map((day) => {
                  const sessions = sessionsByDate.get(day.dateStr) || [];
                  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

                  return (
                    <div
                      key={day.dateStr}
                      onMouseEnter={() =>
                        setHoveredDay({
                          date: day.dateStr,
                          sessions,
                          totalMinutes,
                        })
                      }
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] cursor-pointer transition-all duration-150 ${getCellColor(
                        day.dateStr
                      )} ${day.isToday ? 'ring-2 ring-orange-500' : ''}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-orange-200/60">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="font-semibold text-slate-600">Intensity:</span>
                <span>Less</span>
                <span className="w-3 h-3 rounded-[3px] bg-orange-100/50 inline-block border border-orange-200/60" />
                <span className="w-3 h-3 rounded-[3px] bg-orange-300 inline-block" />
                <span className="w-3 h-3 rounded-[3px] bg-orange-400 inline-block" />
                <span className="w-3 h-3 rounded-[3px] bg-orange-600 inline-block" />
                <span className="w-3 h-3 rounded-[3px] bg-orange-800 inline-block" />
                <span>Deep Focus (90m+)</span>
              </div>

              {/* Hover Tooltip display */}
              <div className="text-[11px] font-bold text-orange-950">
                {hoveredDay ? (
                  hoveredDay.sessions.length > 0 ? (
                    <span>
                      📅 {hoveredDay.date}:{' '}
                      <strong className="text-orange-700">{hoveredDay.totalMinutes}m</strong> across{' '}
                      {hoveredDay.sessions.length} sessions ({hoveredDay.sessions.map((s) => s.domainLabel.split(' ')[0]).join(', ')})
                    </span>
                  ) : (
                    <span className="text-slate-400">📅 {hoveredDay.date}: No practice logged</span>
                  )
                ) : (
                  <span className="text-slate-400">Hover over any day for session breakdown</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Domain Distribution Cards */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800 block">
              14-Week Practice Summary
            </span>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <span className="text-2xl font-black text-slate-900">{stats.totalHours}</span>
                <span className="block text-[11px] text-slate-500 font-semibold">Total Hours</span>
              </div>
              <div>
                <span className="text-2xl font-black text-orange-600">{stats.totalSessions}</span>
                <span className="block text-[11px] text-slate-500 font-semibold">Practice Sessions</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-600">{stats.totalQuestions}</span>
                <span className="block text-[11px] text-slate-500 font-semibold">Problems Solved</span>
              </div>
              <div>
                <span className="text-2xl font-black text-amber-600">{user.streakDays}d</span>
                <span className="block text-[11px] text-slate-500 font-semibold">Current Streak</span>
              </div>
            </div>
          </div>

          {/* Domain Breakdown Bars */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Domain Practice Share
            </span>
            {(Object.keys(DOMAIN_CONFIG) as EngineeringDomain[]).map((dom) => {
              const cfg = DOMAIN_CONFIG[dom];
              const minutes = stats.distribution[dom] || 0;
              const total = Math.max(1, Object.values(stats.distribution).reduce((a, b) => a + b, 0));
              const pct = Math.round((minutes / total) * 100);

              return (
                <div key={dom} className="text-xs">
                  <div className="flex justify-between font-semibold text-slate-700 mb-0.5">
                    <span className="truncate">{cfg.short}</span>
                    <span className="text-slate-500 font-bold">{pct}% ({Math.round(minutes / 60)}h)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cfg.bg} rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Log Practice Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-orange-200 relative">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Flame className="w-5 h-5 fill-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Log Practice Session</h3>
                <p className="text-xs text-slate-500">Record practice for heatmap & daily study goal</p>
              </div>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Engineering Domain
                </label>
                <select
                  value={logForm.domain}
                  onChange={(e) =>
                    setLogForm({ ...logForm, domain: e.target.value as EngineeringDomain })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="dsa">Data Structures & Algorithms (Trees, Graphs, DP)</option>
                  <option value="system_design">System Design & Architecture (Scalability, Caching)</option>
                  <option value="core_cs">Core CS Fundamentals (OS, DBMS, CN)</option>
                  <option value="aptitude">Quant & Logical Aptitude (TCS NQT Pattern)</option>
                  <option value="gd_verbal">Verbal & Campus Mock GD (Speech Cadence)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    step="5"
                    value={logForm.durationMinutes}
                    onChange={(e) =>
                      setLogForm({ ...logForm, durationMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Problems Solved
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={logForm.questionsSolved}
                    onChange={(e) =>
                      setLogForm({ ...logForm, questionsSolved: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Session Intensity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { level: 1, label: 'Light (15-30m)' },
                    { level: 2, label: 'Medium (30-60m)' },
                    { level: 3, label: 'Intensive (60-90m)' },
                    { level: 4, label: 'Deep (90m+)' },
                  ].map((item) => (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => setLogForm({ ...logForm, intensity: item.level as 1 | 2 | 3 | 4 })}
                      className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                        logForm.intensity === item.level
                          ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Lvl {item.level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Session Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Solved 3 Dynamic Programming medium problems on LeetCode"
                  value={logForm.notes}
                  onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/30 cursor-pointer transition-all"
                >
                  Log & Earn XP (+{logForm.intensity * 25} XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
