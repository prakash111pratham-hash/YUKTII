import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateResumeAtsScore } from '../utils/scoring';
import { ScoreGauge } from '../components/ScoreGauge';
import {
  FileText,
  Sparkles,
  Printer,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Globe,
  Award,
  FileDown,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ResumePortfolioView: React.FC = () => {
  const { resumeData, setResumeData, user, incrementXp } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'resume' | 'portfolio'>('resume');
  const [optimizingIndex, setOptimizingIndex] = useState<{ pIdx: number; bIdx: number } | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const atsReport = calculateResumeAtsScore(resumeData);

  const handlePrint = () => {
    setActiveTabSub('resume');
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleExportPdf = () => {
    setActiveTabSub('resume');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    incrementXp(50, 'Exported ATS Resume as PDF');
    setExportNotice('Opening system print preview. Choose "Save as PDF" to save offline.');
    setTimeout(() => {
      window.print();
    }, 150);
    setTimeout(() => setExportNotice(null), 5000);
  };

  const handleExportOfflineDocument = () => {
    try {
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${resumeData.fullName} - ATS Resume</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1e293b; line-height: 1.45; font-size: 11pt; margin: 0; padding: 20px; }
    h1 { font-size: 22pt; margin: 0 0 6px 0; text-transform: uppercase; text-align: center; color: #0f172a; letter-spacing: 0.5px; }
    .contacts { text-align: center; font-size: 9.5pt; color: #475569; margin-bottom: 12px; }
    .contacts a { color: #ea580c; text-decoration: none; }
    h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; border-bottom: 1.5px solid #0f172a; padding-bottom: 2px; margin: 14px 0 6px 0; }
    .section { margin-bottom: 10px; }
    .item-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 10.5pt; }
    .item-sub { display: flex; justify-content: space-between; font-size: 9.5pt; color: #475569; margin-bottom: 4px; }
    ul { margin: 4px 0 8px 18px; padding: 0; }
    li { margin-bottom: 3px; font-size: 10pt; }
    .skills-row { margin-bottom: 4px; font-size: 10pt; }
    .badge { display: inline-block; background: #fff7ed; border: 1px solid #fdba74; padding: 2px 6px; border-radius: 4px; font-size: 9pt; color: #9a3412; font-weight: bold; }
  </style>
</head>
<body>
  <h1>${resumeData.fullName}</h1>
  <div class="contacts">
    ${resumeData.email} • ${resumeData.phone} • ${resumeData.location}<br>
    <a href="${resumeData.linkedin}">LinkedIn: ${resumeData.linkedin}</a> •
    <a href="${resumeData.github}">GitHub: ${resumeData.github}</a>
  </div>

  <h2>Professional Profile</h2>
  <div class="section"><p style="margin: 0; font-size: 10pt;">${resumeData.summary}</p></div>

  <h2>Education</h2>
  <div class="section">
    ${resumeData.education.map((e) => `
      <div class="item-header"><span>${e.degree}</span><span>${e.score}</span></div>
      <div class="item-sub"><span>${e.institution}</span><span>${e.year}</span></div>
    `).join('')}
  </div>

  <h2>Technical Skills</h2>
  <div class="section">
    ${resumeData.skills.map((s) => `
      <div class="skills-row"><strong>${s.category}:</strong> ${s.items.join(', ')}</div>
    `).join('')}
  </div>

  <h2>Projects</h2>
  <div class="section">
    ${resumeData.projects.map((p) => `
      <div class="item-header"><span>${p.title} | ${p.techStack}</span><span>${p.githubLink || p.liveLink || ''}</span></div>
      <ul>
        ${p.bullets.map((b) => `<li>${b}</li>`).join('')}
      </ul>
    `).join('')}
  </div>

  <h2>Experience</h2>
  <div class="section">
    ${(resumeData.experience || []).map((exp) => `
      <div class="item-header"><span>${exp.role} - ${exp.company}</span><span>${exp.period}</span></div>
      <ul>
        ${exp.bullets.map((b) => `<li>${b}</li>`).join('')}
      </ul>
    `).join('')}
  </div>

  <h2>Key Achievements & Certifications</h2>
  <div class="section">
    <ul>
      ${resumeData.achievements.map((a) => `<li>${a}</li>`).join('')}
      ${resumeData.certifications.map((c) => `<li>${c}</li>`).join('')}
    </ul>
  </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.fullName.toLowerCase().replace(/\s+/g, '_')}_ats_resume.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      incrementXp(50, 'Exported Offline Resume Document');
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      setExportNotice('Offline standalone resume file downloaded! Open in any browser to view or print offline.');
      setTimeout(() => setExportNotice(null), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOptimizeBullet = async (pIdx: number, bIdx: number, currentBullet: string) => {
    setOptimizingIndex({ pIdx, bIdx });
    setIsAiLoading(true);
    setAiSuggestions(null);

    try {
      const res = await fetch('/api/ai/resume-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletPoint: currentBullet,
          role: 'Software Development Engineer',
        }),
      });
      const data = await res.json();
      if (data.data?.improvedBullets) {
        setAiSuggestions(data.data.improvedBullets);
      } else {
        setAiSuggestions([
          `Architected and deployed system using modern stack, improving query latency by 35% across 500+ student users.`,
          `Engineered reliable backend service handling peak batch requests with zero downtime.`,
        ]);
      }
    } catch (e) {
      setAiSuggestions([
        `Architected and deployed system using modern stack, improving query latency by 35% across 500+ student users.`,
        `Engineered reliable backend service handling peak batch requests with zero downtime.`,
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyOptimizedBullet = (pIdx: number, bIdx: number, newText: string) => {
    const updated = { ...resumeData };
    updated.projects[pIdx].bullets[bIdx] = newText;
    setResumeData(updated);
    setOptimizingIndex(null);
    setAiSuggestions(null);
    incrementXp(30, 'Enhanced resume bullet point');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" /> Stage 4: ATS Resume Architect & Portfolio Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ATS-Friendly Resume & Live Student Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Optimized for Indian campus recruitment parsers (TCS, Infosys, Amazon, Qualcomm). Live ATS recruiter score, Google XYZ bullet enhancer, and 1-click print.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTabSub('resume')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTabSub === 'resume' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ATS Resume
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSub('portfolio')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTabSub === 'portfolio' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Public Portfolio
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/30 transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Export ATS PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportOfflineDocument}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 text-xs font-bold transition-colors cursor-pointer"
              title="Download standalone offline HTML/ATS file"
            >
              <Download className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden sm:inline">Offline Doc</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Direct browser print"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {exportNotice && (
          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-orange-950 flex items-center gap-2 print:hidden animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>

      {/* 1. RESUME BUILDER & LIVE ATS SCORE */}
      {activeTabSub === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: ATS Score & Recommendations */}
          <div className="space-y-5 print:hidden">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Live ATS Recruiter Score
              </h2>
              <ScoreGauge
                score={atsReport.score}
                size={130}
                label="ATS Match"
                colorScheme={atsReport.score >= 80 ? 'emerald' : 'indigo'}
              />
              <span className="text-xs font-bold text-slate-600">
                {atsReport.score >= 80 ? '🟢 Strong Indian Campus Shortlist' : '🟡 Needs Metrics & Keywords'}
              </span>

              {/* Metric Breakdown */}
              <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block font-bold">Bullets</span>
                  <span className="font-extrabold text-slate-800">{atsReport.bulletScore}/30</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block font-bold">Keywords</span>
                  <span className="font-extrabold text-slate-800">{atsReport.keywordScore}/30</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block font-bold">Format</span>
                  <span className="font-extrabold text-slate-800">{atsReport.formattingScore}/35</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Suggestions to Reach 95%+
              </h3>
              <ul className="text-xs text-slate-600 space-y-2">
                {atsReport.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Printable ATS Resume Document */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-md font-sans text-slate-900 space-y-6 print:p-0 print:border-none print:shadow-none">
            {/* Contact Header */}
            <div className="text-center border-b border-slate-300 pb-4 space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight uppercase text-slate-900">
                {resumeData.fullName}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {resumeData.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {resumeData.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {resumeData.location}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-orange-800 font-semibold pt-1">
                <a href={resumeData.linkedin} target="_blank" rel="noreferrer" className="hover:underline hover:text-orange-950">
                  {resumeData.linkedin}
                </a>
                <span>•</span>
                <a href={resumeData.github} target="_blank" rel="noreferrer" className="hover:underline hover:text-orange-950">
                  {resumeData.github}
                </a>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                Professional Profile
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">{resumeData.summary}</p>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                Education
              </h2>
              <div className="space-y-2">
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      <div className="text-slate-600">{edu.institution}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-indigo-700">{edu.score}</div>
                      <div className="text-slate-500">{edu.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                Technical Skills
              </h2>
              <div className="space-y-1 text-xs">
                {resumeData.skills.map((cat, idx) => (
                  <div key={idx}>
                    <strong className="text-slate-900">{cat.category}: </strong>
                    <span className="text-slate-700">{cat.items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects with AI Enhancer */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                Technical Projects
              </h2>
              <div className="space-y-4">
                {resumeData.projects.map((proj, pIdx) => (
                  <div key={pIdx} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">
                        {proj.title} <span className="font-normal text-xs text-slate-500">| {proj.techStack}</span>
                      </div>
                      {proj.githubLink && (
                        <span className="text-[11px] text-indigo-600 font-semibold">{proj.githubLink}</span>
                      )}
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="group relative">
                          <span>{b}</span>
                          <button
                            type="button"
                            onClick={() => handleOptimizeBullet(pIdx, bIdx, b)}
                            className="ml-2 text-[10px] text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer print:hidden"
                          >
                            ✨ AI Enhance
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* AI Suggestions popup */}
                    {optimizingIndex?.pIdx === pIdx && aiSuggestions && (
                      <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2 mt-2 print:hidden">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900 text-[11px]">Choose an Optimized Google XYZ Bullet:</span>
                          <button
                            type="button"
                            onClick={() => setAiSuggestions(null)}
                            className="text-[10px] text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                        {aiSuggestions.map((sug, sIdx) => (
                          <div
                            key={sIdx}
                            onClick={() => applyOptimizedBullet(pIdx, optimizingIndex.bIdx, sug)}
                            className="p-2 rounded-lg bg-white border border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer text-xs text-slate-800 transition-colors"
                          >
                            {sug}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements & Certifications */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                Key Honors & Certifications
              </h2>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {resumeData.achievements.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
                {resumeData.certifications.map((cert, i) => (
                  <li key={i}>{cert}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. PUBLIC PORTFOLIO VIEW */}
      {activeTabSub === 'portfolio' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md max-w-5xl mx-auto space-y-10">
          {/* Profile Hero */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-8">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-28 h-28 rounded-2xl object-cover shadow-lg border-2 border-indigo-100 shrink-0"
            />
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Available for Summer 2027 SDE Internships
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">{resumeData.fullName}</h1>
              <p className="text-sm font-semibold text-slate-600 max-w-xl">
                B.Tech in Computer Science & Engineering • NIT Surathkal • CGPA: 8.75/10.0
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <a
                  href={resumeData.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub Profile
                </a>
                <a
                  href={resumeData.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-800 border border-orange-200 text-xs font-bold hover:bg-orange-100 transition-colors shadow-2xs"
                >
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Featured Engineering Projects */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Featured Capstone Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resumeData.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">{proj.techStack}</p>
                    <ul className="mt-3 text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                      {proj.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Verified Code Repository</span>
                    <a
                      href={proj.githubLink || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                    >
                      <span>Inspect Code</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges & Verifications */}
          <div className="p-6 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3">
            <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-orange-600" /> YUKTI Verified Credentials
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {user.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-white text-orange-950 border border-orange-200 text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
