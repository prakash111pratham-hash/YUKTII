import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { OnboardingProfileWizard } from './components/OnboardingProfileWizard';
import { Compass, Sparkles, Heart } from 'lucide-react';

function AppContent() {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    setShowUniqueFeaturesModal,
    isAuthenticated,
    user,
    firebaseUser,
    loading,
    setIsAuthModalOpen,
    updateUser,
  } = useApp();

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

  // 1. Loading screen while Firebase checks auth state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf5ef] text-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-[#faf6ee] border border-amber-200/90 p-2.5 flex items-center justify-center shadow-lg shadow-amber-900/10 animate-pulse">
          <img
            src="/assets/aistudio/image_18d72958.png"
            alt="YUKTI Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-orange-700 tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span>Authenticating Session...</span>
        </div>
      </div>
    );
  }

  // 2. Enforce Zero-State / Redirect Gate:
  // If user is null and loading is false, render the Sign In / Auth Modal by default rather than showing the dashboard with placeholder user details like Pratham Prakash.
  const isUserAuthenticated = isAuthenticated && (Boolean(firebaseUser) || (Boolean(user) && Boolean(user.email) && user.id !== ''));
  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#faf5ef] text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#faf6ee] border border-amber-200/90 p-2.5 flex items-center justify-center shadow-xl shadow-amber-900/10 mb-6">
            <img
              src="/assets/aistudio/image_18d72958.png"
              alt="YUKTI Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 mb-4 uppercase tracking-wider">
            Zero-State Access Gate · Authentication Required
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Welcome to YUKTI Student Platform
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mb-8 leading-relaxed">
            Please sign in with your real mobile phone number (OTP) or student email to access your personal 4-year engineering roadmap, placement mock tests, and verified academic profile.
          </p>

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-xl hover:scale-102 transition-all cursor-pointer"
          >
            <span>Sign In / Register with Phone OTP or Email</span>
            <Sparkles className="w-4 h-4 text-amber-200" />
          </button>
        </main>

        {/* Auth Modal rendered by default for unauthenticated visitors */}
        <AuthModal forceOpen={true} />

        <footer className="bg-white/90 border-t border-orange-200/80 py-6 px-4 text-xs text-slate-500 text-center">
          YUKTI · Choose · Build · Get Placed · Secured by Firebase Authentication
        </footer>
      </div>
    );
  }

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

      {/* Onboarding Profile Wizard triggered for new users after their first successful Firebase authentication */}
      {isUserAuthenticated && !user?.onboardingCompleted && (
        <OnboardingProfileWizard
          isOpen={true}
          onClose={() => updateUser({ onboardingCompleted: true })}
        />
      )}

      {/* Floating Gemini AI Chatbot with Search Grounding */}
      <AiChatbot />

      {/* Footer */}
      <footer className="bg-white/90 border-t border-orange-200/80 py-8 px-4 text-xs text-slate-600 print:hidden mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf6ee] border border-amber-200/90 p-0.5 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
              <img
                src="/assets/aistudio/image_18d72958.png"
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
