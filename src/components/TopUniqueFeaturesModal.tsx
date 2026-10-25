import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Brain, Cpu, Mic, FileText, Zap, Compass, CheckCircle2 } from 'lucide-react';

export const TopUniqueFeaturesModal: React.FC = () => {
  const { showUniqueFeaturesModal, setShowUniqueFeaturesModal, setActiveTab } = useApp();

  if (!showUniqueFeaturesModal) return null;

  const features = [
    {
      num: '01',
      title: 'AI Branch Fit Predictor & "What-If" Cutoff Engine',
      badge: 'Entrance & Branch Selection',
      icon: Compass,
      tagline: 'Scientific RIASEC + JEE/State CET Matrix + Core vs IT Mobility',
      description:
        'Unlike basic quiz tools that guess based on random questions, our Branch Fit Predictor calculates a multi-dimensional cognitive fit score combining psychometric RIASEC profiles, aptitude rubrics, and JEE rank percentiles. It features a side-by-side "What-If" comparison engine showing 4-year syllabus overlap, Tier-1 vs Tier-3 LPA salary trajectories, and cross-branch mobility (e.g. Mechanical to Robotics, ECE to VLSI vs IT).',
      targetTab: 'discover',
      actionLabel: 'Try Branch Predictor & What-If Matrix',
    },
    {
      num: '02',
      title: 'Real Indian Campus Placement Simulator (Company-Pattern Engine)',
      badge: 'Company Mock Drives',
      icon: Cpu,
      tagline: 'Authentic TCS NQT, Infosys SpringBoard, Product MAANG & Core Mocks',
      description:
        'Standard mock tests offer generic questions. YUKTI faithfully replicates real Indian campus test patterns: TCS NQT with Foundation & Advanced Quantitative sections and strict sectional timers; Infosys with cryptarithmetic and negative marking; Product MAANG with O(N) constraints; and Core Engineering (L&T / Tata Motors) with IS code standards.',
      targetTab: 'practice',
      actionLabel: 'Launch Placement Mock Arena',
    },
    {
      num: '03',
      title: 'Voice AI Speech & Fluency Lab (Indian Engineering Accent & Filler Detector)',
      badge: 'Campus GD & HR Rounds',
      icon: Mic,
      tagline: 'Web Speech API + Indian English Filler Word & WPM Pace Analytics',
      description:
        'Group Discussions (GD) and HR rounds eliminate up to 60% of candidates who clear coding tests. Our Speech Lab captures your speech in real-time using the Web Speech API, flags frequent Indian English filler words ("basically", "actually", "you know", "like"), computes your exact Words Per Minute (WPM) cadence (110-160 WPM ideal), and flags common grammatical slips like "myself" or "having experience".',
      targetTab: 'practice',
      actionLabel: 'Open Voice Speech & GD Lab',
    },
    {
      num: '04',
      title: 'ATS Resume Architect with Real-Time Indian Recruiter Score & One-Click Portfolio',
      badge: 'ATS & Portfolio Engine',
      icon: FileText,
      tagline: 'Google XYZ Bullet Optimizer, CGPA/GATE Check & Instant Web Portfolio',
      description:
        'Tailored specifically for Indian campus engineering drives. Checks for crucial filters used by campus recruiters (CGPA, 10th/12th %, GitHub links, LeetCode, GATE score). Includes an AI Google XYZ-Formula rewriter ("Accomplished [X] measured by [Y] by doing [Z]") and instantly generates a public-ready student portfolio page from completed projects.',
      targetTab: 'resume',
      actionLabel: 'Open ATS Resume & Portfolio',
    },
    {
      num: '05',
      title: 'Smart Internship Skill-Gap Analyzer with Auto-Curated 7-Day Bridge Roadmap',
      badge: 'Zero-To-Offer Bridge',
      icon: Zap,
      tagline: 'Don’t just see what is missing — bridge it in 7 focused sprint days',
      description:
        'When you browse any of our 25+ Indian tech & core internships (Zoho, Swiggy, Tata Motors, Qualcomm, Ather), YUKTI cross-references the job requirements against your known skills. It calculates a precise match % and automatically synthesizes a day-by-day 7-Day Sprint Roadmap with free learning resources, mini-projects, and interview tips to become qualified.',
      targetTab: 'internships',
      actionLabel: 'Explore Internships & Gap Analyzer',
    },
    {
      num: 'Bonus',
      title: 'TPO / College Batch Analytics & Hindi/English Vernacular Ready',
      badge: 'Campus & Accessibility',
      icon: Brain,
      tagline: 'College Training & Placement Officer (TPO) readiness overview & toggleable Hindi',
      description:
        'Equipped with an administrative TPO view that tracks batch-wise readiness across departments (CSE, ECE, Mech), uncovers low-scoring topics across the cohort, and provides a full Hindi language switch for students from vernacular mediums across tier-2/3 Indian colleges.',
      targetTab: 'admin',
      actionLabel: 'View TPO College Analytics',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 relative">
          <button
            type="button"
            onClick={() => setShowUniqueFeaturesModal(false)}
            className="absolute top-5 right-5 text-indigo-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> National Career Advisory Framework
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Career & Placement Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
            A comprehensive, multi-stage platform supporting engineering students from entrance counseling to tier-1 campus placement offers.
          </p>
        </div>

        {/* Feature List */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto divide-y divide-slate-100">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.num} className="pt-6 first:pt-0 flex flex-col md:flex-row gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-lg">
                  {feat.num}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {feat.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-600 mb-2">{feat.tagline}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{feat.description}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUniqueFeaturesModal(false);
                      setActiveTab(feat.targetTab);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                    {feat.actionLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            All 5 modules fully functional with interactive test cases & live speech engine.
          </div>
          <button
            type="button"
            onClick={() => setShowUniqueFeaturesModal(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold cursor-pointer"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
