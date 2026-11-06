import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BranchCode } from '../types';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Flame,
  Zap,
  TrendingUp,
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  Sparkles,
  Building,
  GraduationCap,
  ShieldCheck,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PerformerRecord {
  id: string;
  rank: number;
  name: string;
  college: string;
  branch: BranchCode;
  batch: string;
  xp: number;
  mockTestTopperBadges: number;
  topMockScore: number;
  streakDays: number;
  recentMockTitle: string;
  isCurrentUser?: boolean;
}

const BASE_TOP_PERFORMERS: PerformerRecord[] = [
  {
    id: 'p-1',
    rank: 1,
    name: 'Ananya Sharma',
    college: 'IIT Bombay',
    branch: 'CSE',
    batch: 'Class of 2026',
    xp: 4850,
    mockTestTopperBadges: 6,
    topMockScore: 98,
    streakDays: 24,
    recentMockTitle: 'TCS Digital Advanced Mock (98%)',
  },
  {
    id: 'p-2',
    rank: 2,
    name: 'Rohan Kulkarni',
    college: 'NIT Trichy',
    branch: 'ECE',
    batch: 'Class of 2026',
    xp: 4420,
    mockTestTopperBadges: 5,
    topMockScore: 96,
    streakDays: 19,
    recentMockTitle: 'Qualcomm Hardware & C++ Mock (96%)',
  },
  {
    id: 'p-3',
    rank: 3,
    name: 'Sneha Patel',
    college: 'BITS Pilani',
    branch: 'IT',
    batch: 'Class of 2027',
    xp: 4180,
    mockTestTopperBadges: 4,
    topMockScore: 95,
    streakDays: 16,
    recentMockTitle: 'Amazon SDE-1 Coding Mock (95%)',
  },
  {
    id: 'p-4',
    rank: 4,
    name: 'Aditya Verma',
    college: 'Delhi Technological University (DTU)',
    branch: 'AIML',
    batch: 'Class of 2027',
    xp: 3920,
    mockTestTopperBadges: 4,
    topMockScore: 94,
    streakDays: 14,
    recentMockTitle: 'Infosys Specialist Programmer Mock (94%)',
  },
  {
    id: 'p-5',
    rank: 5,
    name: 'Vikram Nair',
    college: 'NIT Surathkal',
    branch: 'CSE',
    batch: 'Class of 2026',
    xp: 3740,
    mockTestTopperBadges: 3,
    topMockScore: 93,
    streakDays: 12,
    recentMockTitle: 'TCS NQT National Mock (93%)',
  },
  {
    id: 'p-6',
    rank: 6,
    name: 'Priya Sundaram',
    college: 'IIIT Hyderabad',
    branch: 'CSE',
    batch: 'Class of 2028',
    xp: 3510,
    mockTestTopperBadges: 3,
    topMockScore: 92,
    streakDays: 11,
    recentMockTitle: 'Google Technical Screening Mock (92%)',
  },
  {
    id: 'p-7',
    rank: 7,
    name: 'Arjun Mehra',
    college: 'RV College of Engineering, Bengaluru',
    branch: 'EEE',
    batch: 'Class of 2027',
    xp: 3280,
    mockTestTopperBadges: 2,
    topMockScore: 91,
    streakDays: 9,
    recentMockTitle: 'Schneider Electric Core Mock (91%)',
  },
];

export const TopPerformersLeaderboard: React.FC = () => {
  const { user, scores, careerBadges, setActiveTab } = useApp();

  const [selectedBranch, setSelectedBranch] = useState<'ALL' | BranchCode>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'topperBadges' | 'xp'>('topperBadges');

  // Check if current user has unlocked 'Mock Test Topper'
  const userHasMockTopper = careerBadges.some(
    (b) => b.id === 'b-mock-topper' && b.unlocked
  );
  const userMockTopperCount = userHasMockTopper ? 1 : 0;
  const userTopMockScore = Math.max(scores.problemSolving, scores.quantitative, 88);

  // Construct current user record
  const currentUserRecord: PerformerRecord = {
    id: user.id || 'curr-user',
    rank: 8,
    name: user.name || 'You',
    college: user.college || 'Engineering College',
    branch: user.selectedBranch || 'CSE',
    batch: `Class of ${user.graduationYear || '2028'}`,
    xp: user.xp || 0,
    mockTestTopperBadges: userMockTopperCount,
    topMockScore: userTopMockScore,
    streakDays: user.streakDays || 1,
    recentMockTitle: userHasMockTopper
      ? 'TCS NQT National Mock (92%)'
      : 'In-Progress (88% Best Score)',
    isCurrentUser: true,
  };

  // Merge list and compute dynamic sorting
  const fullList = [...BASE_TOP_PERFORMERS];

  // If user has higher score/badges, position them dynamically
  if (!fullList.some((p) => p.isCurrentUser)) {
    fullList.push(currentUserRecord);
  }

  // Sort based on chosen metric
  const sortedList = [...fullList].sort((a, b) => {
    if (sortBy === 'topperBadges') {
      if (b.mockTestTopperBadges !== a.mockTestTopperBadges) {
        return b.mockTestTopperBadges - a.mockTestTopperBadges;
      }
      return b.xp - a.xp;
    }
    return b.xp - a.xp;
  });

  // Re-index ranks after sort
  const rankedList = sortedList.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  // Filter by branch & search query
  const filteredList = rankedList.filter((item) => {
    const matchesBranch =
      selectedBranch === 'ALL' || item.branch === selectedBranch;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.branch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const topThree = rankedList.slice(0, 3);
  const currentUserRanked = rankedList.find((p) => p.isCurrentUser) || currentUserRecord;

  const handleCelebrateRank = () => {
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Crown className="w-5 h-5 text-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Top Performers Leaderboard
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-700" /> Mock Test Toppers
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Top campus engineers ranked by verified 'Mock Test Topper' badges and platform XP points
              </p>
            </div>
          </div>
        </div>

        {/* Sort Metric Selector */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-semibold text-slate-500">Rank by:</span>
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSortBy('topperBadges')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                sortBy === 'topperBadges'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Topper Badges
            </button>
            <button
              type="button"
              onClick={() => setSortBy('xp')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                sortBy === 'xp'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overall Points (XP)
            </button>
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM SPOTLIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Silver (Rank 2) */}
        {topThree[1] && (
          <div className="order-2 md:order-1 p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200/90 text-center flex flex-col justify-between items-center relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-200 text-slate-700">
              #2 SILVER
            </div>
            <div className="w-16 h-16 rounded-2xl bg-slate-300 text-slate-800 font-black text-xl flex items-center justify-center border-2 border-white shadow-md my-2">
              {topThree[1].name.charAt(0)}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900">{topThree[1].name}</h3>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[190px]">
                {topThree[1].college}
              </p>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                <span>{topThree[1].branch}</span>
                <span>·</span>
                <span>{topThree[1].batch}</span>
              </div>
            </div>

            <div className="w-full mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-around text-xs">
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Topper Badges</span>
                <span className="text-sm font-black text-amber-700 flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" /> {topThree[1].mockTestTopperBadges}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Total XP</span>
                <span className="text-sm font-black text-slate-800 tabular-nums">
                  {topThree[1].xp}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Gold (Rank 1 - Center & Prominent) */}
        {topThree[0] && (
          <div className="order-1 md:order-2 p-6 rounded-3xl bg-gradient-to-b from-amber-50/80 via-yellow-50/40 to-white border-2 border-amber-300 text-center flex flex-col justify-between items-center relative overflow-hidden shadow-lg shadow-amber-500/10 transform md:-translate-y-2 group">
            <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 flex items-center gap-1 shadow-2xs">
              <Crown className="w-3 h-3" /> #1 NATIONAL CHAMPION
            </div>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 font-black text-2xl flex items-center justify-center border-4 border-white shadow-xl my-2">
              {topThree[0].name.charAt(0)}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">{topThree[0].name}</h3>
              <p className="text-xs text-slate-600 font-semibold truncate max-w-[210px]">
                {topThree[0].college}
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-300">
                <span>{topThree[0].branch}</span>
                <span>·</span>
                <span>{topThree[0].batch}</span>
              </div>
            </div>

            <div className="w-full mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-around text-xs">
              <div>
                <span className="block text-[10px] text-amber-800/80 font-bold uppercase">Topper Badges</span>
                <span className="text-base font-black text-amber-700 flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4 text-amber-600" /> {topThree[0].mockTestTopperBadges}
                </span>
              </div>
              <div className="h-6 w-px bg-amber-200" />
              <div>
                <span className="block text-[10px] text-amber-800/80 font-bold uppercase">Total XP</span>
                <span className="text-base font-black text-slate-900 tabular-nums">
                  {topThree[0].xp}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bronze (Rank 3) */}
        {topThree[2] && (
          <div className="order-3 p-5 rounded-2xl bg-gradient-to-b from-orange-50/40 to-slate-100/60 border border-orange-200/80 text-center flex flex-col justify-between items-center relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-200 text-orange-900">
              #3 BRONZE
            </div>
            <div className="w-16 h-16 rounded-2xl bg-orange-300 text-orange-950 font-black text-xl flex items-center justify-center border-2 border-white shadow-md my-2">
              {topThree[2].name.charAt(0)}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900">{topThree[2].name}</h3>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[190px]">
                {topThree[2].college}
              </p>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                <span>{topThree[2].branch}</span>
                <span>·</span>
                <span>{topThree[2].batch}</span>
              </div>
            </div>

            <div className="w-full mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-around text-xs">
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Topper Badges</span>
                <span className="text-sm font-black text-amber-700 flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" /> {topThree[2].mockTestTopperBadges}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Total XP</span>
                <span className="text-sm font-black text-slate-800 tabular-nums">
                  {topThree[2].xp}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CURRENT USER STANDING CARD */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
            {currentUserRanked.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-orange-950">
                Your Current Leaderboard Standing
              </span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-orange-200 text-orange-900">
                Rank #{currentUserRanked.rank}
              </span>
            </div>
            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2 mt-0.5">
              <span>{currentUserRanked.mockTestTopperBadges} 'Mock Test Topper' Badges</span>
              <span>·</span>
              <span className="font-bold text-slate-900 tabular-nums">{currentUserRanked.xp} Total XP</span>
              <span>·</span>
              <span>{currentUserRanked.recentMockTitle}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            type="button"
            onClick={handleCelebrateRank}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-orange-800 bg-white border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
          >
            🎉 Celebrate
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('practice')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Take Mock Test to Climb</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Branch Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['ALL', 'CSE', 'IT', 'AIML', 'ECE', 'EEE', 'MECH'] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBranch(b)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBranch === b
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b === 'ALL' ? 'All Disciplines' : b}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or college..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          />
        </div>
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="py-3 px-4 w-16">Rank</th>
              <th className="py-3 px-4">Student & College</th>
              <th className="py-3 px-4">Discipline</th>
              <th className="py-3 px-4 text-center">Topper Badges</th>
              <th className="py-3 px-4 text-right">Platform Points</th>
              <th className="py-3 px-4 text-right">Top Mock Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredList.map((student) => (
              <tr
                key={student.id}
                className={`transition-colors ${
                  student.isCurrentUser
                    ? 'bg-orange-50/70 font-semibold text-slate-900'
                    : 'hover:bg-slate-50/80 text-slate-700'
                }`}
              >
                {/* Rank Number */}
                <td className="py-3.5 px-4 font-black">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${
                      student.rank === 1
                        ? 'bg-amber-400 text-amber-950 font-black'
                        : student.rank === 2
                        ? 'bg-slate-300 text-slate-800 font-bold'
                        : student.rank === 3
                        ? 'bg-orange-300 text-orange-950 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    #{student.rank}
                  </span>
                </td>

                {/* Student Info */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        student.isCurrentUser
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>{student.name}</span>
                        {student.isCurrentUser && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-200 text-orange-900">
                            You
                          </span>
                        )}
                        {student.mockTestTopperBadges >= 4 && (
                          <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate max-w-xs">
                        {student.college}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Branch */}
                <td className="py-3.5 px-4">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    {student.branch}
                  </span>
                </td>

                {/* Topper Badges */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 font-extrabold text-amber-700 text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Trophy className="w-3 h-3 text-amber-600" />
                    <span>{student.mockTestTopperBadges} Badges</span>
                  </span>
                </td>

                {/* Platform Points */}
                <td className="py-3.5 px-4 text-right font-black text-slate-900 tabular-nums">
                  {student.xp} XP
                </td>

                {/* Top Mock Score */}
                <td className="py-3.5 px-4 text-right font-bold text-emerald-700 tabular-nums">
                  {student.topMockScore}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
