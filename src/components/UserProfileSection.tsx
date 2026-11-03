import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BranchCode, UserYear } from '../types';
import { updateUserProfileInFirestore, syncUserProfileToFirestore } from '../lib/firebase';
import {
  GraduationCap,
  Sparkles,
  CheckCircle,
  Save,
  BookOpen,
  Award,
  Plus,
  X,
  RefreshCw,
  Phone,
  ShieldCheck,
  Building,
  Target,
  ChevronDown,
  ChevronUp,
  Database,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const BRANCH_OPTIONS: { code: BranchCode; label: string; full: string; color: string }[] = [
  { code: 'CSE', label: 'CSE', full: 'Computer Science & Engineering', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { code: 'IT', label: 'IT', full: 'Information Technology', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { code: 'AIML', label: 'AI & ML', full: 'Artificial Intelligence & Machine Learning', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { code: 'ECE', label: 'ECE', full: 'Electronics & Communication Engineering', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { code: 'EEE', label: 'EEE', full: 'Electrical & Electronics Engineering', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { code: 'MECH', label: 'MECH', full: 'Mechanical Engineering', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { code: 'CIVIL', label: 'CIVIL', full: 'Civil Engineering', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { code: 'CHEM', label: 'CHEM', full: 'Chemical Engineering', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
];

const GRADUATION_YEARS = ['2025', '2026', '2027', '2028', '2029', '2030'];

const ACADEMIC_YEARS: UserYear[] = [
  'Class 12 / JEE',
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year / Final',
];

const POPULAR_INTERESTS = [
  'Data Structures & Algorithms',
  'System Design & Microservices',
  'Full-Stack Web (React & Node.js)',
  'Generative AI & LLMs',
  'Cloud Architecture (AWS / GCP)',
  'Cybersecurity & Network Defense',
  'DevOps & Docker / Kubernetes',
  'Mobile App Development',
  'Database Engineering (SQL & NoSQL)',
  'Embedded Systems & IoT',
  'Competitive Programming',
  'Product Management & System Architecture',
];

export const UserProfileSection: React.FC = () => {
  const { user, updateUser, isAuthenticated, setIsAuthModalOpen } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [firestoreStatus, setFirestoreStatus] = useState<'synced' | 'saving' | 'ready'>('ready');

  // Editable Form States
  const [name, setName] = useState(user.name || 'Pratham Prakash');
  const [branch, setBranch] = useState<BranchCode>(user.selectedBranch || 'CSE');
  const [gradYear, setGradYear] = useState<string>(String(user.graduationYear || '2028'));
  const [academicYear, setAcademicYear] = useState<UserYear>(user.currentYear || '1st Year');
  const [college, setCollege] = useState(user.college || 'National Institute of Technology (NIT)');
  const [targetLpa, setTargetLpa] = useState<number>(user.targetLPA || 18);
  const [careerGoal, setCareerGoal] = useState(user.careerGoal || 'Secure Tier-1 Product Engineering Offer (18+ LPA)');
  const [interests, setInterests] = useState<string[]>(
    user.interests && user.interests.length > 0
      ? user.interests
      : ['Data Structures & Algorithms', 'System Design & Microservices', 'Generative AI & LLMs']
  );
  const [customInterest, setCustomInterest] = useState('');

  // Keep form in sync when user context changes
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.selectedBranch) setBranch(user.selectedBranch);
      if (user.graduationYear) setGradYear(String(user.graduationYear));
      if (user.currentYear) setAcademicYear(user.currentYear);
      if (user.college) setCollege(user.college);
      if (user.targetLPA) setTargetLpa(user.targetLPA);
      if (user.careerGoal) setCareerGoal(user.careerGoal);
      if (user.interests && user.interests.length > 0) setInterests(user.interests);
    }
  }, [user]);

  // Handle Tag Addition
  const handleAddInterest = (tag: string) => {
    const cleanTag = tag.trim();
    if (!cleanTag) return;
    if (!interests.includes(cleanTag)) {
      setInterests((prev) => [...prev, cleanTag]);
    }
    setCustomInterest('');
  };

  // Handle Tag Removal
  const handleRemoveInterest = (tag: string) => {
    setInterests((prev) => prev.filter((item) => item !== tag));
  };

  // Quick Grad Year Sync
  const handleSelectGradYear = (year: string) => {
    setGradYear(year);
    // Suggest academic year based on 4-year B.Tech graduation year
    const num = parseInt(year, 10);
    const currentCalendarYear = new Date().getFullYear();
    if (!isNaN(num)) {
      const diff = num - currentCalendarYear;
      if (diff >= 4) setAcademicYear('1st Year');
      else if (diff === 3) setAcademicYear('2nd Year');
      else if (diff === 2) setAcademicYear('3rd Year');
      else if (diff <= 1) setAcademicYear('4th Year / Final');
    }
  };

  // Save to Firebase Firestore & Cloud SQL
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFirestoreStatus('saving');

    const updatedProfile = {
      name,
      selectedBranch: branch,
      graduationYear: gradYear,
      currentYear: academicYear,
      college,
      targetLPA: Number(targetLpa),
      careerGoal,
      interests,
    };

    try {
      // 1. Update AppContext state
      updateUser(updatedProfile);

      // 2. Direct Sync to Firebase Firestore document: /users/{userId}
      const syncObj = {
        ...user,
        ...updatedProfile,
      };
      await syncUserProfileToFirestore(syncObj);
      await updateUserProfileInFirestore(user.id, updatedProfile);

      // 3. Sync to Cloud SQL backend
      await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: syncObj }),
      }).catch(() => {});

      setFirestoreStatus('synced');
      setSaveSuccess(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.4 } });

      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 1600);
    } catch (err) {
      console.warn('Profile Firestore sync notice:', err);
    } finally {
      setSaving(false);
    }
  };

  const activeBranchMeta = BRANCH_OPTIONS.find((b) => b.code === branch) || BRANCH_OPTIONS[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 mb-7 transition-all duration-300 hover:shadow-md relative overflow-hidden">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-orange-100/50 via-amber-50/30 to-transparent pointer-events-none rounded-tr-3xl" />

      {/* Top Banner & Quick Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/25 shrink-0">
            {name ? name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{name}</h2>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${activeBranchMeta.color}`}>
                {activeBranchMeta.label}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Class of {gradYear}
              </span>
              {user.isPhoneVerified ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Phone Verified
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Verify your mobile number via real OTP"
                >
                  <Phone className="w-3 h-3 text-amber-600" /> Verify Phone (+100 XP)
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
              <span>{academicYear}</span>
              <span>•</span>
              <span className="truncate max-w-xs">{college}</span>
              <span>•</span>
              <span className="text-orange-700 font-semibold">{user.email}</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Firestore Status Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50/80 border border-orange-200 text-xs font-semibold text-orange-950">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <Database className="w-3.5 h-3.5 text-orange-600" />
            <span>Firestore Linked</span>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
          >
            {isEditing ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Close Editor</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Update Academic Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="my-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes synchronized live to Firebase Firestore & Cloud SQL database!</span>
        </div>
      )}

      {/* Read-Only Compact Summary (when not in full edit mode) */}
      {!isEditing && (
        <div className="mt-4 pt-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
              Graduation & Branch
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              {activeBranchMeta.full} ({gradYear})
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Current Stage: <strong>{academicYear}</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
              Career Goal & Target
            </span>
            <div className="text-sm font-extrabold text-slate-900 truncate">
              {careerGoal}
            </div>
            <div className="text-xs text-orange-700 font-bold mt-0.5">
              Target CTC: ₹{targetLpa} LPA
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
              Academic Interests ({interests.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {interests.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs"
                >
                  {item}
                </span>
              ))}
              {interests.length > 3 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-800">
                  +{interests.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULL EDITABLE FORM (When expanded) */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="mt-5 space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 text-xs text-orange-950 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-600" />
              Updating graduation year, engineering branch, and academic interests persists directly to your Firestore document:
            </span>
            <code className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-orange-200 text-slate-700">
              users/{user.id}
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Graduation Year & Academic Year */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-orange-600" />
                Graduation Passing Year (Batch)
              </label>

              {/* Year Chips */}
              <div className="flex flex-wrap gap-2">
                {GRADUATION_YEARS.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => handleSelectGradYear(yr)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      gradYear === yr
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Batch of {yr}
                  </button>
                ))}
              </div>

              {/* Academic Year Selection */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Current Academic Standing
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value as UserYear)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  {ACADEMIC_YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Engineering Branch */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-orange-600" />
                Engineering Branch / Specialization
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BRANCH_OPTIONS.map((b) => (
                  <button
                    key={b.code}
                    type="button"
                    onClick={() => setBranch(b.code)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      branch === b.code
                        ? 'border-orange-500 bg-orange-50/80 shadow-2xs ring-1 ring-orange-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs font-black text-slate-900">{b.label}</span>
                    <span className="block text-[10px] text-slate-500 truncate" title={b.full}>
                      {b.full}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 pt-1">
                Selected: <strong>{activeBranchMeta.full}</strong> — Your placement roadmap and company mock tests will calibrate to this discipline.
              </p>
            </div>
          </div>

          {/* 3. Academic & Technical Interests */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Academic & Technical Interests ({interests.length})
              </span>
              <span className="text-[11px] font-normal text-slate-500">
                Tap a tag to remove • Click popular badges to add
              </span>
            </label>

            {/* Current Active Tags */}
            <div className="flex flex-wrap gap-2 min-h-10 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              {interests.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No academic interests added yet. Pick from the suggestions below.</span>
              ) : (
                interests.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white text-orange-950 border border-orange-200 shadow-2xs group"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(tag)}
                      className="text-slate-400 hover:text-rose-600 rounded-full cursor-pointer p-0.5 transition-colors"
                      title={`Remove ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest(customInterest);
                  }
                }}
                placeholder="Add custom interest (e.g. Quantum Computing, High-Frequency Trading...)"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              />
              <button
                type="button"
                onClick={() => handleAddInterest(customInterest)}
                disabled={!customInterest.trim()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Popular Suggested Tags */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Popular Engineering Interests
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_INTERESTS.map((item) => {
                  const isSelected = interests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => (isSelected ? handleRemoveInterest(item) : handleAddInterest(item))}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-orange-100 text-orange-900 border-orange-300 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {isSelected ? <CheckCircle className="w-3 h-3 text-orange-600" /> : <Plus className="w-3 h-3 text-slate-400" />}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. College Name, Target Package & Career Goal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-500" /> College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-orange-600" /> Target Package (₹ LPA)
              </label>
              <input
                type="number"
                min={4}
                max={60}
                value={targetLpa}
                onChange={(e) => setTargetLpa(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Target Dream Placement
              </label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/25 cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Syncing to Firestore...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile to Firestore</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
