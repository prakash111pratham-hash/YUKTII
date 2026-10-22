import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRANCHES_DATA } from '../data/branchesData';
import { CAREER_PATHS_DATA } from '../data/careersData';
import { BranchCode } from '../types';
import {
  BookOpen,
  Briefcase,
  Layers,
  GraduationCap,
  Sparkles,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Code,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Award,
} from 'lucide-react';

export const BranchExplorerView: React.FC = () => {
  const { user, selectedBranchForModal, setSelectedBranchForModal, setActiveTab } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'branches' | 'careers'>('branches');
  const [selectedBranchCode, setSelectedBranchCode] = useState<BranchCode>(user.selectedBranch || 'CSE');
  const [selectedCareerId, setSelectedCareerId] = useState<string>(CAREER_PATHS_DATA[0].id);

  const activeBranch = BRANCHES_DATA.find((b) => b.code === selectedBranchCode) || BRANCHES_DATA[0];
  const activeCareer = CAREER_PATHS_DATA.find((c) => c.id === selectedCareerId) || CAREER_PATHS_DATA[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Stage Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Stage 2: Curriculum & Career Architect
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Branch Deep-Dives & 20+ Career Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Complete 4-year academic syllabus breakdowns, Tier-1/2/3 starting salaries in LPA, GATE PSU cutoffs, and beginner roadmaps with free course links.
          </p>
        </div>

        {/* View Switcher: Branches vs Careers */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTabSub('branches')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTabSub === 'branches' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Branch Curriculums (8)
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSub('careers')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTabSub === 'careers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Career Roadmaps ({CAREER_PATHS_DATA.length})
          </button>
        </div>
      </div>

      {/* BRANCHES VIEW */}
      {activeTabSub === 'branches' && (
        <div className="space-y-6">
          {/* Branch Pill Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {BRANCHES_DATA.map((branch) => {
              const isSelected = branch.code === selectedBranchCode;
              return (
                <button
                  key={branch.code}
                  type="button"
                  onClick={() => setSelectedBranchCode(branch.code)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>{branch.code}</span>
                  <span className={`text-[11px] font-normal hidden sm:inline ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                    • {branch.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Branch Main Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">{activeBranch.code} Specialization</span>
                <h2 className="text-2xl font-extrabold text-slate-900">{activeBranch.name}</h2>
                <p className="text-sm font-semibold text-slate-600 mt-1">{activeBranch.tagline}</p>
              </div>

              {/* Salary Pills */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Tier-1 Median</div>
                  <div className="text-sm font-extrabold text-emerald-900">{activeBranch.averageStartingLPA.tier1}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Tier-2/3 Median</div>
                  <div className="text-sm font-bold text-slate-800">{activeBranch.averageStartingLPA.tier2}</div>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">{activeBranch.overview}</p>

            {/* 4-Year Journey Curriculum Accordion */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">4-Year Curriculum Roadmap (Year 1 to Year 4)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeBranch.fourYearCurriculum.map((yr) => (
                  <div
                    key={yr.year}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-extrabold text-indigo-600 uppercase">Year {yr.year}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{yr.title}</h4>

                      <div className="mt-3">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Key Subjects:</div>
                        <ul className="mt-1 text-xs text-slate-700 space-y-1">
                          {yr.keySubjects.map((s, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3 p-2 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600">
                        <strong className="text-slate-800">Lab:</strong> {yr.handsOnLab}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-[11px] text-indigo-800 font-medium">
                      🎯 <strong>Milestone:</strong> {yr.milestone}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiters & Higher Studies Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" /> Premier Campus Recruiters
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeBranch.topRecruiters.map((r, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600" /> Higher Studies (GATE & PSUs)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeBranch.higherStudies.gateScope}
                </p>
                <p className="text-xs text-slate-500 italic mt-1">
                  MS / MBA: {activeBranch.higherStudies.msOptions}
                </p>
              </div>
            </div>

            {/* Cross-Branch Mobility Path */}
            {activeBranch.crossBranchPaths.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Cross-Branch Mobility Bridge: {activeBranch.crossBranchPaths[0].targetRole}
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-2">
                  {activeBranch.crossBranchPaths[0].howToBridge}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeBranch.crossBranchPaths[0].bridgeSkills.map((s, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-amber-800 border border-amber-300">
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CAREERS ROADMAP VIEW */}
      {activeTabSub === 'careers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Career List */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2 max-h-[800px] overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
              Select Career Path ({CAREER_PATHS_DATA.length})
            </h3>
            {CAREER_PATHS_DATA.map((career) => {
              const isSelected = career.id === selectedCareerId;
              return (
                <button
                  key={career.id}
                  type="button"
                  onClick={() => setSelectedCareerId(career.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border border-indigo-200 shadow-xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{career.title}</span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded">
                      {career.avgSalaryLPA}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span>Affinity: {career.branchAffinity.join(', ')}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{career.difficulty}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Career Roadmap Stages */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">Career Blueprint</span>
                <h2 className="text-2xl font-extrabold text-slate-900">{activeCareer.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{activeCareer.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-500">Average Compensation</div>
                <div className="text-base font-extrabold text-emerald-600">{activeCareer.avgSalaryLPA}</div>
              </div>
            </div>

            {/* Stages */}
            <div className="space-y-6">
              {activeCareer.roadmapStages.map((stage) => (
                <div
                  key={stage.step}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {stage.step}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{stage.title}</h4>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{stage.duration}</span>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">Core Syllabus Topics:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.topics.map((t, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <strong className="text-slate-900 block">Mini-Project Milestone:</strong>
                      <span className="text-slate-600">{stage.miniProject}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('practice')}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      Practice DSA for this →
                    </button>
                  </div>

                  {/* Free Resources links */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Recommended Free Learning:</div>
                    <div className="flex flex-wrap gap-2">
                      {stage.freeResources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
                        >
                          <span>{res.name} ({res.platform})</span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
