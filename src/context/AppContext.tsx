import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ApplicationRecord,
  AptitudeScores,
  BranchCode,
  ResumeData,
  UserProfile,
} from '../types';
import { SAMPLE_APPLICATIONS, SAMPLE_RESUME_DATA, SAMPLE_STUDENT_PROFILE } from '../data/sampleProfileData';

interface AppContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  scores: AptitudeScores;
  setScores: React.Dispatch<React.SetStateAction<AptitudeScores>>;
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  applications: ApplicationRecord[];
  addApplication: (app: ApplicationRecord) => void;
  updateApplicationStatus: (id: string, status: ApplicationRecord['status']) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBranchForModal: BranchCode | null;
  setSelectedBranchForModal: (b: BranchCode | null) => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  showUniqueFeaturesModal: boolean;
  setShowUniqueFeaturesModal: (show: boolean) => void;
  incrementXp: (amount: number, reason?: string) => void;
}

const defaultScores: AptitudeScores = {
  logical: 88,
  quantitative: 82,
  verbal: 80,
  problemSolving: 90,
  spatialMechanical: 68,
  riasec: {
    realistic: 35,
    investigative: 85,
    artistic: 40,
    social: 45,
    enterprising: 60,
    conventional: 75,
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('careerpath_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name?.includes('Aarav') || parsed.name?.includes('Arav') || !parsed.name) {
          return { ...parsed, name: 'Pratham' };
        }
        return parsed;
      } catch {
        return SAMPLE_STUDENT_PROFILE;
      }
    }
    return SAMPLE_STUDENT_PROFILE;
  });

  const [scores, setScores] = useState<AptitudeScores>(() => {
    const saved = localStorage.getItem('careerpath_scores');
    return saved ? JSON.parse(saved) : defaultScores;
  });

  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('careerpath_resume');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          fullName: parsed.fullName?.includes('Aarav') ? 'Pratham' : (parsed.fullName || 'Pratham'),
          github: 'https://github.com/prakash111pratham-hash',
          linkedin: 'https://www.linkedin.com/in/pratham-prakash-3a8033362/?',
        };
      } catch {
        return SAMPLE_RESUME_DATA;
      }
    }
    return SAMPLE_RESUME_DATA;
  });

  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    const saved = localStorage.getItem('careerpath_apps');
    return saved ? JSON.parse(saved) : SAMPLE_APPLICATIONS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBranchForModal, setSelectedBranchForModal] = useState<BranchCode | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showUniqueFeaturesModal, setShowUniqueFeaturesModal] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('careerpath_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('careerpath_scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('careerpath_resume', JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem('careerpath_apps', JSON.stringify(applications));
  }, [applications]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addApplication = (app: ApplicationRecord) => {
    setApplications((prev) => [app, ...prev]);
    incrementXp(50, 'Applied to internship');
  };

  const updateApplicationStatus = (id: string, status: ApplicationRecord['status']) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const incrementXp = (amount: number, reason?: string) => {
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        scores,
        setScores,
        resumeData,
        setResumeData,
        applications,
        addApplication,
        updateApplicationStatus,
        activeTab,
        setActiveTab,
        selectedBranchForModal,
        setSelectedBranchForModal,
        language,
        setLanguage,
        showUniqueFeaturesModal,
        setShowUniqueFeaturesModal,
        incrementXp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
