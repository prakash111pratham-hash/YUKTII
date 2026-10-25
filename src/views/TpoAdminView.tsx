import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScoreGauge } from '../components/ScoreGauge';
import {
  ShieldCheck,
  Users,
  TrendingUp,
  BarChart3,
  Award,
  BookOpen,
  Settings,
  Plus,
  CheckCircle2,
  AlertTriangle,
  School,
  Sparkles,
} from 'lucide-react';

export const TpoAdminView: React.FC = () => {
  const { user, updateUser, language, setLanguage } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'tpo-report' | 'settings'>('tpo-report');

  // Student Profile settings edit state
  const [name, setName] = useState(user.name);
  const [college, setCollege] = useState(user.college || 'NIT Surathkal');
  const [cgpa, setCgpa] = useState(user.cgpa ? String(user.cgpa) : '8.75');
  const [targetLpa, setTargetLpa] = useState(user.targetLPA ? String(user.targetLPA) : '18');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      college,
      cgpa: Number(cgpa),
      targetLPA: Number(targetLpa),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const branchBatchStats = [
    { branch: 'Computer Science & Eng (CSE)', students: 180, day1Ready: '78%', avgLPA: '16.4 LPA', topDrive: 'Amazon, Google, TCS Prime' },
    { branch: 'AI & Machine Learning (AIML)', students: 60, day1Ready: '82%', avgLPA: '18.1 LPA', topDrive: 'NVIDIA, Microsoft, Fractal' },
    { branch: 'Electronics & Comm (ECE)', students: 140, day1Ready: '64%', avgLPA: '12.8 LPA', topDrive: 'Qualcomm, TI, Intel' },
    { branch: 'Mechanical Engineering (MECH)', students: 120, day1Ready: '58%', avgLPA: '8.4 LPA', topDrive: 'Tata Motors, L&T, Ather' },
    { branch: 'Civil Engineering (CIVIL)', students: 90, day1Ready: '52%', avgLPA: '7.2 LPA', topDrive: 'L&T Construction, Tata Projects' },
    { branch: 'Electrical Engineering (EEE)', students: 110, day1Ready: '60%', avgLPA: '9.8 LPA', topDrive: 'Schneider, ABB, Tata Power' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> College Training & Placement Office (TPO) & Settings
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Institutional Placement Analytics & Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Real-time batch readiness indicators, branch comparison indices, and personal profile preferences.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTabSub('tpo-report')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTabSub === 'tpo-report' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            TPO Batch Report
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSub('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTabSub === 'settings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profile & Settings
          </button>
        </div>
      </div>

      {/* 1. TPO BATCH REPORT */}
      {activeTabSub === 'tpo-report' && (
        <div className="space-y-6">
          {/* Institutional KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eligible Batch Size</span>
              <div className="text-2xl font-extrabold text-slate-900">700 Students</div>
              <span className="text-xs text-emerald-600 font-semibold">96% Registered on YUKTI</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day-1 Ready Rate</span>
              <div className="text-2xl font-extrabold text-indigo-600">67.4%</div>
              <span className="text-xs text-slate-500 font-medium">Composite score &gt; 75%</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Projected Average CTC</span>
              <div className="text-2xl font-extrabold text-emerald-600">₹13.2 LPA</div>
              <span className="text-xs text-slate-500 font-medium">+18% vs Last Academic Year</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Campus Drives</span>
              <div className="text-2xl font-extrabold text-amber-600">42 Companies</div>
              <span className="text-xs text-slate-500 font-medium">TCS, Infosys, Qualcomm, Zoho</span>
            </div>
          </div>

          {/* Departmental Table */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Branch-Wise Placement Readiness Audit</h3>
                <p className="text-xs text-slate-500">Benchmark across 2026-2027 graduating departments</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-3 px-4 font-bold text-slate-700">Engineering Branch</th>
                    <th className="py-3 px-4 font-bold text-slate-700">Cohort Size</th>
                    <th className="py-3 px-4 font-bold text-slate-700">Day-1 Readiness</th>
                    <th className="py-3 px-4 font-bold text-slate-700">Projected Avg LPA</th>
                    <th className="py-3 px-4 font-bold text-slate-700">Key Recruiters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {branchBatchStats.map((stat, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{stat.branch}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{stat.students}</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-600">{stat.day1Ready}</td>
                      <td className="py-3.5 px-4 font-extrabold text-indigo-700">{stat.avgLPA}</td>
                      <td className="py-3.5 px-4 text-slate-600">{stat.topDrive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROFILE & SETTINGS */}
      {activeTabSub === 'settings' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Student Profile & Goal Settings</h2>
            <p className="text-xs text-slate-500 mt-1">Configure your personal target package, college, and UI language.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">College / Institution</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Current CGPA</label>
                <input
                  type="text"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Campus LPA</label>
                <input
                  type="number"
                  value={targetLpa}
                  onChange={(e) => setTargetLpa(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Interface Language</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    language === 'en' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  English (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    language === 'hi' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Profile changes successfully updated.
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
