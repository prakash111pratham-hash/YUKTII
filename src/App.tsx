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
            <span className="px-2.5 py-1 rounded-lg border border-orange-200 bg-orange-50/50 text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Cloud SQL & Firebase Connected</span>
            </span>
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
