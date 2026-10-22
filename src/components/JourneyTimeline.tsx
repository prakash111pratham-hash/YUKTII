import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, BookOpen, Wrench, Briefcase, Award } from 'lucide-react';

export const JourneyTimeline: React.FC = () => {
  const { activeTab, setActiveTab, user } = useApp();

  const stages = [
    {
      id: 'discover',
      stageNum: 'Stage 1',
      title: 'Branch Discovery',
      target: 'Class 12 / JEE / 1st Year',
      desc: 'Cognitive Aptitude & RIASEC Fit',
      icon: Compass,
    },
    {
      id: 'branches',
      stageNum: 'Stage 2',
      title: 'Curriculum & Careers',
      target: '1st - 2nd Year',
      desc: '4-Year Syllabus & 20+ Roadmaps',
      icon: BookOpen,
    },
    {
      id: 'practice',
      stageNum: 'Stage 3',
      title: 'Skill Builder',
      target: '2nd - 3rd Year',
      desc: 'Company Mocks, DSA & Speech Lab',
      icon: Wrench,
    },
    {
      id: 'interview',
      stageNum: 'Stage 4',
      title: 'Placement Readiness',
      target: '3rd - 4th Year',
      desc: 'AI Mock Interviews & ATS Resume',
      icon: Award,
    },
    {
      id: 'internships',
      stageNum: 'Launchpad',
      title: 'Internships & Jobs',
      target: 'Final Year / Placements',
      desc: '25+ Indian Drives & Gap Roadmaps',
      icon: Briefcase,
    },
  ];

  return (
    <div className="bg-white/85 backdrop-blur-xs border-b border-orange-200/70 shadow-2xs py-2.5 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between overflow-x-auto pb-1 scrollbar-none gap-2 md:gap-4">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeTab === stage.id;
            return (
              <React.Fragment key={stage.id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(stage.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-orange-50 border-2 border-orange-500 shadow-xs ring-2 ring-orange-500/10'
                      : 'hover:bg-orange-50/50 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-orange-100/60 text-orange-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase ${
                          isActive ? 'text-orange-600' : 'text-slate-400'
                        }`}
                      >
                        {stage.stageNum}
                      </span>
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        isActive ? 'text-slate-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {stage.title}
                    </div>
                    <div className="text-[10px] text-slate-500 hidden sm:block">
                      {stage.target}
                    </div>
                  </div>
                </button>

                {idx < stages.length - 1 && (
                  <div className="hidden lg:block w-6 h-[2px] bg-slate-200 shrink-0 self-center" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
