import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BranchCode, UserYear } from '../types';
import { auth, updateUserProfileInFirestore, syncUserProfileToFirestore } from '../lib/firebase';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Code2,
  Cpu,
  Brain,
  Zap,
  Target,
  Building2,
  Plus,
  X,
  ShieldCheck,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BranchOption {
  code: BranchCode;
  label: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

const BRANCH_OPTIONS: BranchOption[] = [
  {
    code: 'CSE',
    label: 'CSE',
    name: 'Computer Science & Engineering',
    icon: Code2,
    color: 'from-blue-600 to-indigo-600',
    description: 'DSA, Systems, Cloud Architecture & Full-Stack Placement Tracks',
  },
  {
    code: 'IT',
    label: 'IT',
    name: 'Information Technology',
    icon: Cpu,
    color: 'from-indigo-600 to-violet-600',
    description: 'Web Tech, Database Systems, Enterprise Software & DevOps',
  },
  {
    code: 'AIML',
    label: 'AI & ML',
    name: 'Artificial Intelligence & Machine Learning',
    icon: Brain,
    color: 'from-purple-600 to-fuchsia-600',
    description: 'Deep Learning, NLP, Generative AI & Python Data Pipelines',
  },
  {
    code: 'ECE',
    label: 'ECE',
    name: 'Electronics & Communication',
    icon: Zap,
    color: 'from-emerald-600 to-teal-600',
    description: 'VLSI, Embedded Firmware, IoT & Cross-Domain IT Mobility',
  },
  {
    code: 'EEE',
    label: 'EEE',
    name: 'Electrical & Electronics',
    icon: Zap,
    color: 'from-amber-600 to-orange-600',
    description: 'Power Systems, EV Tech, Microcontrollers & Core Drives',
  },
  {
    code: 'MECH',
    label: 'Mechanical',
    name: 'Mechanical Engineering',
    icon: Target,
    color: 'from-rose-600 to-red-600',
    description: 'CAD/CAM, Robotics, Mechatronics, EV & Manufacturing',
  },
  {
    code: 'CIVIL',
    label: 'Civil',
    name: 'Civil Engineering',
    icon: Building2,
    color: 'from-stone-600 to-slate-700',
    description: 'Structural Analysis, BIM, Smart Cities & Infrastructure',
  },
  {
    code: 'CHEM',
    label: 'Chemical',
    name: 'Chemical Engineering',
    icon: BookOpen,
    color: 'from-cyan-600 to-teal-700',
    description: 'Process Design, Energy Transition, Bio-Tech & Pharma',
  },
];

const GRADUATION_YEARS = ['2025', '2026', '2027', '2028', '2029', '2030'];

const ACADEMIC_YEARS: UserYear[] = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year / Final',
  'Class 12 / JEE',
];

const POPULAR_INTERESTS: { name: string; category: string }[] = [
  { name: 'Data Structures & Algorithms', category: 'Coding' },
  { name: 'Full-Stack Web Systems (React/Node)', category: 'Development' },
  { name: 'Generative AI & LLMs', category: 'AI' },
  { name: 'System Design & Distributed Architecture', category: 'Core' },
  { name: 'Cloud Infrastructure & DevOps (Docker/AWS)', category: 'Cloud' },
  { name: 'Machine Learning & Neural Networks', category: 'AI' },
  { name: 'Database Engineering (PostgreSQL/SQL)', category: 'Core' },
  { name: 'Operating Systems & Concurrency', category: 'Core' },
  { name: 'VLSI & Chip Design', category: 'Hardware' },
  { name: 'Robotics & Embedded Systems', category: 'Hardware' },
  { name: 'Quantitative & Logical Aptitude (TCS NQT)', category: 'Placement' },
  { name: 'Campus GD & Technical HR Fluency', category: 'Placement' },
];

interface OnboardingProfileWizardProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const OnboardingProfileWizard: React.FC<OnboardingProfileWizardProps> = ({
  isOpen = true,
  onClose,
}) => {
  const { user, updateUser, isAuthenticated, firebaseUser } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedBranch, setSelectedBranch] = useState<BranchCode>(user?.selectedBranch || 'CSE');
  const [graduationYear, setGraduationYear] = useState<string>(
    String(user?.graduationYear || '2028')
  );
  const [customGradYear, setCustomGradYear] = useState('');
  const [currentYear, setCurrentYear] = useState<UserYear>(user?.currentYear || '1st Year');
  const [college, setCollege] = useState(
    user?.college && user.college !== 'Engineering College'
      ? user.college
      : 'National Institute of Technology (NIT)'
  );
  const [targetLPA, setTargetLPA] = useState<number>(user?.targetLPA || 18);
  const [interests, setInterests] = useState<string[]>(
    user?.interests && user.interests.length > 0
      ? user.interests
      : ['Data Structures & Algorithms', 'Full-Stack Web Systems (React/Node)', 'Generative AI & LLMs']
  );
  const [customInterest, setCustomInterest] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // If already completed onboarding or modal not open, return null
  if (!isOpen) return null;

  const targetUid = firebaseUser?.uid || user?.uid || user?.id || auth.currentUser?.uid;

  const toggleInterest = (tag: string) => {
    if (interests.includes(tag)) {
      setInterests(interests.filter((i) => i !== tag));
    } else {
      setInterests([...interests, tag]);
    }
  };

  const addCustomInterest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customInterest.trim();
    if (clean && !interests.includes(clean)) {
      setInterests([...interests, clean]);
      setCustomInterest('');
    }
  };

  const removeInterest = (tag: string) => {
    setInterests(interests.filter((i) => i !== tag));
  };

  const handleSaveToFirestore = async () => {
    setSaving(true);
    const finalGradYear = customGradYear.trim() || graduationYear;

    const profileUpdates: Partial<typeof user> = {
      selectedBranch,
      graduationYear: finalGradYear,
      currentYear,
      college: college.trim() || 'National Institute of Technology (NIT)',
      targetLPA,
      interests,
      onboardingCompleted: true,
    };

    try {
      // 1. Direct write to Firestore document: /users/{userId}
      if (targetUid && targetUid !== 'guest') {
        await updateUserProfileInFirestore(targetUid, profileUpdates);
        await syncUserProfileToFirestore({
          ...user,
          ...profileUpdates,
          id: targetUid,
          uid: targetUid,
        });
      }

      // 2. Sync to local AppContext
      updateUser(profileUpdates);

      // 3. Backup sync to Cloud SQL backend
      await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            ...user,
            ...profileUpdates,
            id: targetUid,
          },
        }),
      }).catch(() => {});

      setSaveSuccess(true);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });

      setTimeout(() => {
        setSaving(false);
        if (onClose) {
          onClose();
        }
      }, 1200);
    } catch (err) {
      console.error('Error saving onboarding profile to Firestore:', err);
      // Still update local state so user can proceed
      updateUser(profileUpdates);
      setSaving(false);
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-orange-200 relative my-6 text-slate-900">
        {/* Close / Skip button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Skip for now"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Wizard Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#faf6ee] border border-amber-200/90 p-1 flex items-center justify-center shadow-md shadow-amber-900/10 overflow-hidden shrink-0">
            <img
              src="/assets/aistudio/image_18d72958.png"
              alt="YUKTI Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200 uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3 text-orange-600" />
              <span>Step {currentStep} of 4 · Welcome Setup</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Personalize Your Engineering Profile
            </h2>
          </div>
        </div>

        {/* Progress Step Bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { step: 1, label: 'Branch' },
            { step: 2, label: 'Grad Year' },
            { step: 3, label: 'Interests' },
            { step: 4, label: 'Confirm' },
          ].map((item) => (
            <div key={item.step} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  currentStep >= item.step ? 'bg-orange-600' : 'bg-slate-200'
                }`}
              />
              <span
                className={`text-[10px] font-bold block truncate ${
                  currentStep === item.step ? 'text-orange-600' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Engineering Branch Selection */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                What is your engineering branch?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                We calibrate your company mock tests (TCS, Infosys, Core), interview syllabi, and RIASEC predictor accordingly.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {BRANCH_OPTIONS.map((branch) => {
                const Icon = branch.icon;
                const isSelected = selectedBranch === branch.code;
                return (
                  <button
                    key={branch.code}
                    type="button"
                    onClick={() => setSelectedBranch(branch.code)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/80 shadow-md ring-2 ring-orange-500/20'
                        : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${branch.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block">
                        {branch.label}
                      </span>
                      <span className="text-[10px] text-slate-500 line-clamp-2 leading-tight mt-0.5">
                        {branch.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College / University Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology (NIT)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Graduation Year & Standing */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                When do you graduate?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Helps tailor your 4-year sprint milestones and countdown to campus placement drives.
              </p>
            </div>

            {/* Quick Chips for Graduation Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Expected Graduation Batch
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {GRADUATION_YEARS.map((year) => {
                  const isSelected = graduationYear === year && !customGradYear;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setGraduationYear(year);
                        setCustomGradYear('');
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
                      Class of {year}
                    </button>
                  );
                })}
              </div>

              {/* Custom Graduation Year input */}
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Other Year:</span>
                <input
                  type="text"
                  maxLength={4}
                  value={customGradYear}
                  onChange={(e) => setCustomGradYear(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 2031"
                  className="w-24 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Current Academic Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Current Academic Year
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ACADEMIC_YEARS.slice(0, 4).map((year) => {
                  const isSelected = currentYear === year;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => setCurrentYear(year)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target LPA Goal */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Target Campus Placement Package
                </label>
                <span className="text-xs font-black text-orange-600">
                  ₹{targetLPA} LPA
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="45"
                step="1"
                value={targetLPA}
                onChange={(e) => setTargetLPA(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-0.5">
                <span>Core / IT (6 LPA)</span>
                <span>Tier-1 Product (18 LPA)</span>
                <span>Dream / Unicorn (40+ LPA)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Academic & Technical Interests */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                What are your academic & tech interests?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pick what excites you. We automatically suggest matching internship gaps and daily study targets.
              </p>
            </div>

            {/* Selected tags */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                Selected Interests ({interests.length})
              </span>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-orange-50/50 rounded-xl border border-orange-200">
                {interests.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    Select tags below or add your own...
                  </span>
                ) : (
                  interests.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-orange-800 border border-orange-200 shadow-2xs"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(tag)}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Popular suggestions */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-2">
                Popular Engineering Domains (Click to toggle)
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[170px] overflow-y-auto pr-1">
                {POPULAR_INTERESTS.map((item) => {
                  const isChecked = interests.includes(item.name);
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => toggleInterest(item.name)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                        isChecked
                          ? 'bg-orange-600 text-white border-orange-600 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
                      <span>{item.name}</span>
                      {isChecked && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Tag */}
            <form onSubmit={addCustomInterest} className="flex gap-2 pt-1">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Add custom interest (e.g. Cybersecurity, Rust, Solidity)"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Review & Save to Firestore */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Ready to launch your 4-year roadmap!
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your profile details. Clicking save will persist your graduation year, branch, and academic interests directly to your Firestore document.
              </p>
            </div>

            {/* Summary Card */}
            <div className="bg-[#fffaf5] rounded-2xl border border-orange-200/90 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                <span className="text-xs text-slate-500 font-semibold">Engineering Branch:</span>
                <span className="text-xs font-black text-slate-900">
                  {BRANCH_OPTIONS.find((b) => b.code === selectedBranch)?.name || selectedBranch}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                <span className="text-xs text-slate-500 font-semibold">Expected Graduation:</span>
                <span className="text-xs font-black text-orange-600">
                  Class of {customGradYear.trim() || graduationYear} ({currentYear})
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                <span className="text-xs text-slate-500 font-semibold">College / University:</span>
                <span className="text-xs font-bold text-slate-800">
                  {college || 'National Institute of Technology (NIT)'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                <span className="text-xs text-slate-500 font-semibold">Target Placement Goal:</span>
                <span className="text-xs font-black text-emerald-700">
                  ₹{targetLPA} LPA Package
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-semibold block mb-1.5">
                  Academic & Tech Focus:
                </span>
                <div className="flex flex-wrap gap-1">
                  {interests.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white text-orange-900 border border-orange-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Firestore Destination Indicator */}
            <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/90 text-[11px] flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">Firestore Target Path:</span>
                <code className="font-mono text-[10px] text-slate-700 bg-white px-2 py-0.5 rounded border border-orange-200">
                  users/{targetUid || 'uid'}
                </code>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                Direct Sync Active
              </span>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={saving || saveSuccess}
                onClick={handleSaveToFirestore}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-black shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-75"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving to Firestore...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Profile Saved! Launching...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Save Profile & Launch Platform</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
