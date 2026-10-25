import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ChevronRight,
  Award,
  BookOpen,
  Briefcase,
  Cpu,
  Compass,
  ArrowRight,
  ExternalLink,
  Target,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface Milestone {
  id: string;
  year: 1 | 2 | 3 | 4;
  title: string;
  category: 'Foundation' | 'Technical' | 'Industrial' | 'Placement';
  status: 'completed' | 'in_progress' | 'upcoming';
  description: string;
  criteria: string;
  dateCompleted?: string;
  xpReward: number;
  targetModule: string;
}

export const FourYearRoadmap: React.FC = () => {
  const { user, scores, applications, setActiveTab, incrementXp, unlockBadge } = useApp();

  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [selectedYearFilter, setSelectedYearFilter] = useState<number | 'all'>('all');

  // Interactive milestone state initialized from user activities
  const [milestones, setMilestones] = useState<Milestone[]>([
    // Year 1
    {
      id: 'm-assess-passed',
      year: 1,
      title: 'Assessment Passed',
      category: 'Foundation',
      status: user.completedAssessment ? 'completed' : 'in_progress',
      description: 'Completed Stage 1 cognitive aptitude evaluation, RIASEC vocational index, and psychometric profile.',
      criteria: 'Attain 70%+ across Logical, Quantitative, and Verbal assessments.',
      dateCompleted: 'Aug 2023 • Verified',
      xpReward: 150,
      targetModule: 'discover',
    },
    {
      id: 'm-branch-fit',
      year: 1,
      title: 'Branch Fit Confirmed',
      category: 'Foundation',
      status: 'completed',
      description: 'Selected primary engineering branch (CSE) and analyzed 4-year curriculum roadmap & syllabus overlap.',
      criteria: 'Review year-by-year syllabus and complete branch discovery matrix.',
      dateCompleted: 'Sept 2023 • Verified',
      xpReward: 100,
      targetModule: 'branches',
    },
    {
      id: 'm-prog-basics',
      year: 1,
      title: 'Engineering Foundations Mastered',
      category: 'Technical',
      status: 'completed',
      description: 'Built core competencies in C/C++, basic algorithms, Linux terminal workflows, and Git version control.',
      criteria: 'Pass 1st year CS fundamentals and engineering math.',
      dateCompleted: 'May 2024 • Verified',
      xpReward: 120,
      targetModule: 'practice',
    },

    // Year 2
    {
      id: 'm-dsa-100',
      year: 2,
      title: 'DSA 100 Solved',
      category: 'Technical',
      status: 'completed',
      description: 'Mastered fundamental Data Structures: Arrays, Hash Maps, Linked Lists, Binary Trees, and Recursion.',
      criteria: 'Solve 100+ problems across Easy & Medium tiers on LeetCode/GFG.',
      dateCompleted: 'Jan 2025 • Verified',
      xpReward: 250,
      targetModule: 'practice',
    },
    {
      id: 'm-fullstack-app',
      year: 2,
      title: 'First Full-Stack Project Deployed',
      category: 'Technical',
      status: 'completed',
      description: 'Engineered and deployed a production web application with relational database, authentication, and live cloud URL.',
      criteria: 'Public GitHub repo with documentation, CI/CD, and live demo link.',
      dateCompleted: 'Apr 2025 • Verified',
      xpReward: 200,
      targetModule: 'resume',
    },
    {
      id: 'm-hackathon',
      year: 2,
      title: 'National Hackathon Entry',
      category: 'Technical',
      status: 'completed',
      description: 'Collaborated in 36-hour Smart India Hackathon internal qualifier with prototype demonstration.',
      criteria: 'Submit working software solution in team setting.',
      dateCompleted: 'June 2025 • Verified',
      xpReward: 180,
      targetModule: 'practice',
    },

    // Year 3
    {
      id: 'm-internship-sec',
      year: 3,
      title: 'Internship Secured',
      category: 'Industrial',
      status: applications.some((a) => a.status === 'Offer' || a.status === 'Interview') ? 'completed' : 'completed',
      description: 'Awarded summer industrial software internship with live stipend (₹35,000/mo) at leading tech company.',
      criteria: 'Clear screening test, technical rounds, and receive formal offer letter.',
      dateCompleted: 'Sept 2025 • Industrial Milestone',
      xpReward: 350,
      targetModule: 'internships',
    },
    {
      id: 'm-ats-resume',
      year: 3,
      title: 'ATS Resume Certified (85%+)',
      category: 'Industrial',
      status: 'completed',
      description: 'Crafted Google XYZ-bullet resume with verified CGPA, tech stack tags, and quantified metrics.',
      criteria: 'Achieve 85%+ score on Indian Recruiter ATS scanner.',
      dateCompleted: 'Nov 2025 • Verified',
      xpReward: 150,
      targetModule: 'resume',
    },
    {
      id: 'm-gd-speech',
      year: 3,
      title: 'Campus GD & Speech Cleared',
      category: 'Industrial',
      status: 'in_progress',
      description: 'Trained speech delivery to optimal 120-150 WPM cadence with zero filler words using Web Speech AI.',
      criteria: 'Complete 3 Voice GD Simulations with 80%+ fluency score.',
      xpReward: 180,
      targetModule: 'practice',
    },

    // Year 4
    {
      id: 'm-tcs-mock',
      year: 4,
      title: 'TCS NQT / MAANG Mock 80%+',
      category: 'Placement',
      status: 'in_progress',
      description: 'Scoring consistently in 85th+ percentile on full-length company pattern diagnostic tests.',
      criteria: 'Clear Advanced Coding & Foundation tests within strict sectional cutoff.',
      xpReward: 300,
      targetModule: 'practice',
    },
    {
      id: 'm-capstone',
      year: 4,
      title: 'Final Year Capstone Project',
      category: 'Placement',
      status: 'upcoming',
      description: 'Major IEEE/Industry sponsored senior capstone with research paper submission or live deployment.',
      criteria: 'Faculty defense and working industry demonstration.',
      xpReward: 250,
      targetModule: 'resume',
    },
    {
      id: 'm-placement-offer',
      year: 4,
      title: 'Day-1 Placement Offer In-Hand',
      category: 'Placement',
      status: 'upcoming',
      description: 'Final campus placement offer secured at target compensation (₹18+ LPA).',
      criteria: 'Receive official campus placement cell offer letter.',
      xpReward: 500,
      targetModule: 'interview',
    },
  ]);

  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  const toggleMilestone = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'completed' ? 'in_progress' : 'completed';
          if (nextStatus === 'completed') {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            incrementXp(m.xpReward, `Completed milestone: ${m.title}`);

            // Automatically reward unique career badges
            if (m.id === 'm-internship-sec') unlockBadge('b-intern-secured');
            if (m.id === 'm-assess-passed') unlockBadge('b-assess-ace');
            if (m.id === 'm-dsa-100') unlockBadge('b-dsa-warrior');
            if (m.id === 'm-ats-resume') unlockBadge('b-ats-ready');
            if (m.id === 'm-placement-offer') unlockBadge('b-day1-offer');
            if (m.id === 'm-gd-speech') unlockBadge('b-gd-fluent');
          }
          return {
            ...m,
            status: nextStatus,
            dateCompleted: nextStatus === 'completed' ? 'Completed Just Now' : undefined,
          };
        }
        return m;
      })
    );
  };

  const filteredMilestones = milestones.filter((m) => {
    if (selectedYearFilter === 'all') return true;
    return m.year === selectedYearFilter;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-orange-600" />
            <span>4-Year Engineering Journey Visualizer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Interactive Academic & Placement Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking your verified milestones from Class 12 / 1st Year entrance to Day-1 placement offer.
          </p>
        </div>

        {/* Overall Progress Gauge */}
        <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-3 border border-slate-200/80 shrink-0">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium block">Journey Completed</span>
            <span className="text-lg font-black text-slate-900">
              {completedCount} <span className="text-xs font-normal text-slate-400">/ {milestones.length} Milestones</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 flex items-center justify-center font-black text-xs text-indigo-700 bg-white">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Year Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedYearFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedYearFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 4 Years
          </button>
          {[1, 2, 3, 4].map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => setSelectedYearFilter(yr)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedYearFilter === yr
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Year {yr}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-400 hidden md:inline">
          Tap any milestone to view verification criteria & solve next step
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-500 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Visual Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {filteredMilestones.map((m) => {
          const isCompleted = m.status === 'completed';
          const isInProgress = m.status === 'in_progress';
          const isHighlight = m.id === 'm-assess-passed' || m.id === 'm-internship-sec';

          return (
            <div
              key={m.id}
              onClick={() => setSelectedMilestone(m)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between group ${
                isCompleted
                  ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 hover:shadow-xs'
                  : isInProgress
                  ? 'bg-indigo-50/30 border-indigo-200 hover:border-indigo-400 hover:shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 opacity-80'
              } ${isHighlight ? 'ring-2 ring-orange-400/40' : ''}`}
            >
              {/* Year & Category Pill */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    Year {m.year} • {m.category}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => toggleMilestone(m.id, e)}
                    className="p-1 rounded-md hover:bg-white transition-colors cursor-pointer"
                    title={isCompleted ? 'Mark as In-Progress' : 'Mark as Completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : isInProgress ? (
                      <Clock className="w-5 h-5 text-indigo-600 animate-pulse" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {m.title}
                  </h3>
                  {isHighlight && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 border border-orange-200">
                      Key
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500">
                  {m.dateCompleted || (isInProgress ? 'In Progress' : 'Upcoming')}
                </span>
                <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                  Inspect <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone Detail Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Year {selectedMilestone.year} • {selectedMilestone.category} Milestone
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {selectedMilestone.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMilestone(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedMilestone.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Verification Criteria:</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {selectedMilestone.criteria}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500 font-medium">Reward: +{selectedMilestone.xpReward} XP</span>
              <span
                className={`font-bold px-2 py-0.5 rounded ${
                  selectedMilestone.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedMilestone.status === 'in_progress'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Status: {selectedMilestone.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const mId = selectedMilestone.id;
                  setSelectedMilestone(null);
                  toggleMilestone(mId, { stopPropagation: () => {} } as any);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                {selectedMilestone.status === 'completed' ? 'Mark as In-Progress' : 'Mark as Completed'}
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = selectedMilestone.targetModule;
                  setSelectedMilestone(null);
                  setActiveTab(target);
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <span>Go to Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
