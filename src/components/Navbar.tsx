import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Flame,
  Zap,
  Globe,
  User,
  Menu,
  X,
  Compass,
  BookOpen,
  Wrench,
  Award,
  Briefcase,
  LayoutDashboard,
  ShieldCheck,
  Mail,
  Linkedin,
  LogIn,
} from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export const Navbar: React.FC = () => {
  const {
    isAuthenticated,
    user,
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    setShowUniqueFeaturesModal,
    setIsAuthModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard', icon: LayoutDashboard },
    { id: 'discover', label: language === 'hi' ? 'स्टेज 1: खोज' : 'Stage 1: Discover', icon: Compass },
    { id: 'branches', label: language === 'hi' ? 'स्टेज 2: ब्रांचेस' : 'Stage 2: Branches', icon: BookOpen },
    { id: 'practice', label: language === 'hi' ? 'स्टेज 3: अभ्यास' : 'Stage 3: Practice', icon: Wrench },
    { id: 'interview', label: language === 'hi' ? 'स्टेज 4: इंटरव्यू' : 'Stage 4: Interview', icon: Award },
    { id: 'resume', label: language === 'hi' ? 'रेज़्युमे' : 'Resume', icon: User },
    { id: 'internships', label: language === 'hi' ? 'इंटर्नशिप' : 'Internships', icon: Briefcase },
    { id: 'workspace', label: language === 'hi' ? 'वर्कस्पेस हब' : 'Workspace Hub', icon: Mail },
    { id: 'admin', label: language === 'hi' ? 'टीपीओ / कॉलेज' : 'TPO & Analytics', icon: ShieldCheck },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fffaf5]/95 backdrop-blur-md border-b border-orange-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-600 p-1 flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src="/assets/aistudio/image_ceca956a.png"
                  alt="YUKTI Logo Icon"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                    YUKTI
                  </span>
                </div>
                <span className="block text-[9px] font-bold text-orange-700 tracking-wider uppercase">
                  {language === 'hi' ? 'चुनें · सीखें · सफल हों' : 'CHOOSE · BUILD · GET PLACED'}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* National Career Framework Button */}
            <button
              type="button"
              onClick={() => setShowUniqueFeaturesModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span>National Career Framework</span>
            </button>

            {/* Notification Bell Component */}
            <NotificationBell />

            {/* GitHub & LinkedIn Profile Links */}
            <div className="hidden md:flex items-center gap-1">
              <a
                href="https://github.com/prakash111pratham-hash"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border border-orange-200 text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                title="GitHub: prakash111pratham-hash"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/pratham-prakash-3a8033362/?"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border border-orange-200 text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                title="LinkedIn: Pratham Prakash"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            {/* Streak & XP */}
            <div className="hidden xl:flex items-center gap-2 bg-orange-100/60 px-2.5 py-1 rounded-full border border-orange-200">
              <div className="flex items-center gap-1 text-xs font-bold text-orange-700" title="Daily Practice Streak">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                <span>{user.streakDays}d</span>
              </div>
              <div className="w-[1px] h-3 bg-orange-300" />
              <div className="flex items-center gap-1 text-xs font-bold text-orange-800" title="Experience Points">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{user.xp} XP</span>
              </div>
            </div>

            {/* Bilingual Hindi/English Switcher */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-orange-200 bg-white text-xs font-bold text-slate-800 hover:bg-orange-50 transition-colors cursor-pointer"
              title="Toggle English / Hindi language"
            >
              <Globe className="w-3.5 h-3.5 text-orange-600" />
              <span>{language === 'en' ? 'HI (हिन्दी)' : 'EN (English)'}</span>
            </button>

            {/* User Profile & Auth Pill */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white border border-orange-200 hover:border-orange-500 shadow-2xs transition-all cursor-pointer group"
                title="Manage Account, Email & Mobile OTP Verification"
              >
                <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-orange-500/30 group-hover:ring-orange-500">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline group-hover:text-orange-600 transition-colors">
                    {user.name.split(' ')[0]}
                  </span>
                  {user.isPhoneVerified && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Mobile Verified" />
                  )}
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm shadow-orange-600/25 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <button
            type="button"
            onClick={() => {
              setShowUniqueFeaturesModal(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-900 hover:text-orange-950 font-bold text-xs border border-slate-300"
          >
            <Sparkles className="w-4 h-4 text-orange-600" />
            National Career Advisory Framework
          </button>

          <div className="grid grid-cols-2 gap-1 pt-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-orange-500 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-orange-50 hover:text-orange-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-orange-100 text-xs text-slate-500">
            <span>Logged in: {user.name} ({user.currentYear})</span>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/prakash111pratham-hash"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-orange-600 font-semibold"
              >
                GitHub
              </a>
              <span>•</span>
              <a
                href="https://www.linkedin.com/in/pratham-prakash-3a8033362/?"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-orange-600 font-semibold"
              >
                LinkedIn
              </a>
              <span>•</span>
              <span className="text-orange-600 font-bold">🔥 {user.streakDays}d</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
