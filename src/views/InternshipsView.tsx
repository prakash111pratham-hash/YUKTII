import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INTERNSHIPS_DATA } from '../data/internshipsData';
import { ApplicationRecord, BranchCode, Internship } from '../types';
import { matchInternship } from '../utils/scoring';
import confetti from 'canvas-confetti';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  Bookmark,
  Send,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const InternshipsView: React.FC = () => {
  const { user, applications, addApplication, updateApplicationStatus, incrementXp } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'listings' | 'tracker'>('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [modeFilter, setModeFilter] = useState<string>('ALL');

  // 7-day bridge roadmap modal state
  const [selectedForRoadmap, setSelectedForRoadmap] = useState<{
    internship: Internship;
    match: ReturnType<typeof matchInternship>;
  } | null>(null);

  const userSkills = ['React', 'Node.js', 'PostgreSQL', 'C++', 'Python', 'SQL', 'Git'];

  // Filter listings
  const filteredListings = INTERNSHIPS_DATA.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBranch =
      branchFilter === 'ALL' || item.branchEligibility.includes(branchFilter as BranchCode);

    const matchesMode = modeFilter === 'ALL' || item.workMode === modeFilter;

    return matchesSearch && matchesBranch && matchesMode;
  });

  const handleApply = (internship: Internship) => {
    // Check if already applied
    const exists = applications.find((a) => a.internshipId === internship.id);
    if (exists) return;

    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      internshipId: internship.id,
      company: internship.company,
      title: internship.title,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      notes: `Applied for ${internship.duration} role in ${internship.location}.`,
      deadline: internship.deadline,
    };

    addApplication(newApp);
    confetti({ particleCount: 60, spread: 60 });
  };

  const handleSave = (internship: Internship) => {
    const exists = applications.find((a) => a.internshipId === internship.id);
    if (exists) return;

    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      internshipId: internship.id,
      company: internship.company,
      title: internship.title,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Saved',
      notes: 'Bookmarked for final review.',
      deadline: internship.deadline,
    };

    addApplication(newApp);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Briefcase className="w-3.5 h-3.5" /> Launchpad: Internships & Job Drives
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Indian Campus Internships & Skill Gap Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            25+ verified software & core engineering internships in Bengaluru, Pune, Hyderabad, and Chennai. Features real-time skill matching and auto-curated 7-day bridge learning sprints.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTabSub('listings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTabSub === 'listings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Openings ({filteredListings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSub('tracker')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTabSub === 'tracker' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Application Tracker ({applications.length})
          </button>
        </div>
      </div>

      {/* 1. LISTINGS VIEW */}
      {activeTabSub === 'listings' && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company, role, or skill (e.g. Zoho, Swiggy, Python, CAD)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="AIML">AI/ML</option>
                <option value="ECE">ECE</option>
                <option value="MECH">Mechanical</option>
                <option value="EEE">EEE</option>
                <option value="CIVIL">Civil</option>
                <option value="CHEM">Chemical</option>
              </select>

              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Modes</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((internship) => {
              const match = matchInternship(internship, userSkills);
              const isApplied = applications.some((a) => a.internshipId === internship.id);

              return (
                <div
                  key={internship.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                          {internship.company}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">{internship.title}</h3>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                        {match.matchPercent}% Match
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {internship.location}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-indigo-700">{internship.stipend}</span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {internship.description}
                    </p>

                    {/* Missing Skills Warning */}
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700">Required Skills:</span>
                        <span className="text-slate-500 font-normal">{internship.duration}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {internship.requiredSkills.map((s, i) => {
                          const hasSkill = match.matchedSkills.includes(s);
                          return (
                            <span
                              key={i}
                              className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                                hasSkill ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {s} {hasSkill ? '✓' : '!'}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedForRoadmap({ internship, match })}
                      className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>7-Day Gap Roadmap</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSave(internship)}
                        disabled={isApplied}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                        title="Bookmark"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApply(internship)}
                        disabled={isApplied}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-emerald-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        {isApplied ? 'Applied ✓' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. APPLICATION TRACKER (KANBAN / LIST) */}
      {activeTabSub === 'tracker' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Application Pipeline</h2>
              <p className="text-xs text-slate-500">Track and manage your campus applications from Saved to Offer</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['Saved', 'Applied', 'Interview', 'Offer'] as const).map((colStatus) => {
              const colApps = applications.filter((a) => a.status === colStatus);
              return (
                <div key={colStatus} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{colStatus}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                      {colApps.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {colApps.map((app) => (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-indigo-300 transition-all"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{app.company}</span>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{app.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500">{app.notes}</p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Due: {app.deadline || 'Rolling'}</span>
                          {colStatus !== 'Offer' && (
                            <button
                              type="button"
                              onClick={() => {
                                const nextStatus =
                                  colStatus === 'Saved'
                                    ? 'Applied'
                                    : colStatus === 'Applied'
                                    ? 'Interview'
                                    : 'Offer';
                                updateApplicationStatus(app.id, nextStatus);
                              }}
                              className="font-bold text-indigo-600 hover:underline cursor-pointer"
                            >
                              Advance →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {colApps.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-400 italic">No applications in this stage</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7-DAY BRIDGE ROADMAP MODAL */}
      {selectedForRoadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
              <button
                type="button"
                onClick={() => setSelectedForRoadmap(null)}
                className="absolute top-5 right-5 text-indigo-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-400/30">
                <Zap className="w-3.5 h-3.5" /> 7-Day Targeted Qualification Bridge
              </div>
              <h3 className="text-xl font-bold">{selectedForRoadmap.internship.company}: {selectedForRoadmap.internship.title}</h3>
              <p className="text-xs text-slate-300 mt-1">
                Your profile matches {selectedForRoadmap.match.matchPercent}%. Complete this 7-day sprint to master missing skills: {selectedForRoadmap.match.missingSkills.join(', ') || 'Domain polish'}.
              </p>
            </div>

            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedForRoadmap.match.sevenDayRoadmap.map((day) => (
                <div key={day.day} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    D{day.day}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{day.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{day.objective}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">Ready to prepare?</span>
              <button
                type="button"
                onClick={() => {
                  handleApply(selectedForRoadmap.internship);
                  setSelectedForRoadmap(null);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Apply & Add to Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
