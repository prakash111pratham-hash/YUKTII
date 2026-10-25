import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { JourneyTimeline } from './components/JourneyTimeline';
import { TopUniqueFeaturesModal } from './components/TopUniqueFeaturesModal';
import { DashboardView } from './views/DashboardView';
import { StrengthDiscoveryView } from './views/StrengthDiscoveryView';
import { BranchExplorerView } from './views/BranchExplorerView';
import { PracticeHubView } from './views/PracticeHubView';
import { MockInterviewView } from './views/MockInterviewView';
import { ResumePortfolioView } from './views/ResumePortfolioView';
import { InternshipsView } from './views/InternshipsView';
import { TpoAdminView } from './views/TpoAdminView';
import { WorkspaceHubView } from './views/WorkspaceHubView';
import { AiChatbot } from './components/AiChatbot';
import { AuthModal } from './components/AuthModal';
import { Compass, Sparkles, Heart } from 'lucide-react';

function AppContent() {
  const { activeTab, setActiveTab, setShowUniqueFeaturesModal } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'discover':
        return <StrengthDiscoveryView />;
      case 'branches':
        return <BranchExplorerView />;
      case 'practice':
        return <PracticeHubView />;
      case 'interview':
        return <MockInterviewView />;
      case 'resume':
        return <ResumePortfolioView />;
      case 'internships':
        return <InternshipsView />;
      case 'workspace':
        return <WorkspaceHubView />;
      case 'admin':
        return <TpoAdminView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf5ef] text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* 4-Year Journey Progress Timeline (Stage-based Navigation) */}
      <JourneyTimeline />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderActiveView()}
      </main>

      {/* Top 5 Unique Features Modal */}
      <TopUniqueFeaturesModal />

      {/* Email & Phone OTP Authentication Modal */}
      <AuthModal />

      {/* Floating Gemini AI Chatbot with Search Grounding */}
      <AiChatbot />

      {/* Footer */}
      <footer className="bg-white/90 border-t border-orange-200/80 py-8 px-4 text-xs text-slate-600 print:hidden mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 p-1 flex items-center justify-center shadow-md shadow-orange-500/20 overflow-hidden shrink-0">
              <img
                src="/assets/aistudio/image_ceca956a.png"
                alt="YUKTI Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">YUKTI</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                  युक्ति
                </span>
                <span className="text-[11px] font-bold text-orange-600 tracking-wider">
                  CHOOSE · BUILD · GET PLACED
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                The 4-Year Indian Engineering & Campus Placement Journey Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
            <button
              type="button"
              onClick={() => setShowUniqueFeaturesModal(true)}
              className="text-orange-600 font-bold hover:underline cursor-pointer"
            >
              National Career Framework
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('discover')}
              className="hover:text-orange-600 cursor-pointer"
            >
              Branch Fit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className="hover:text-orange-600 cursor-pointer"
            >
              Company Mocks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('interview')}
              className="hover:text-orange-600 cursor-pointer"
            >
              AI Interview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('internships')}
              className="hover:text-orange-600 cursor-pointer"
            >
              Internships
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('workspace')}
              className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
            >
              Workspace Suite
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <a
              href="https://github.com/prakash111pratham-hash"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg border border-orange-200 bg-orange-50/50 hover:bg-orange-100 text-slate-800 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/pratham-prakash-3a8033362/?"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg border border-orange-200 bg-orange-50/50 hover:bg-orange-100 text-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
