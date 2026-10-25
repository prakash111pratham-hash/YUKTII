import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ApplicationRecord,
  AptitudeScores,
  BranchCode,
  ResumeData,
  UserProfile,
  EngineeringDomain,
  PracticeSessionRecord,
  DailyStudyGoal,
  CareerBadge,
} from '../types';
import {
  SAMPLE_APPLICATIONS,
  SAMPLE_RESUME_DATA,
  SAMPLE_STUDENT_PROFILE,
  SAMPLE_STUDY_GOAL,
  CAREER_BADGES_DATA,
  generateInitialPracticeSessions,
} from '../data/sampleProfileData';
import {
  syncUserProfileToFirestore,
  syncDailyGoalToFirestore,
  syncPracticeLogToFirestore,
  initAuth,
} from '../lib/firebase';
import confetti from 'canvas-confetti';

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

  // New Features
  practiceSessions: PracticeSessionRecord[];
  addPracticeSession: (session: PracticeSessionRecord) => void;
  studyGoal: DailyStudyGoal;
  updateStudyGoal: (updates: Partial<DailyStudyGoal>) => void;
  logStudyTime: (minutes: number, domain?: EngineeringDomain) => void;
  careerBadges: CareerBadge[];
  unlockBadge: (badgeId: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
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
          fullName: parsed.fullName?.includes('Aarav') ? 'Pratham' : parsed.fullName || 'Pratham',
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

  // Practice Sessions for Heatmap
  const [practiceSessions, setPracticeSessions] = useState<PracticeSessionRecord[]>(() => {
    const saved = localStorage.getItem('careerpath_practice_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return generateInitialPracticeSessions();
      }
    }
    return generateInitialPracticeSessions();
  });

  // Daily Study Goal Tracker
  const [studyGoal, setStudyGoal] = useState<DailyStudyGoal>(() => {
    const saved = localStorage.getItem('careerpath_study_goal');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SAMPLE_STUDY_GOAL;
      }
    }
    return SAMPLE_STUDY_GOAL;
  });

  // Career Badges
  const [careerBadges, setCareerBadges] = useState<CareerBadge[]>(() => {
    const saved = localStorage.getItem('careerpath_badges');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return CAREER_BADGES_DATA;
      }
    }
    return CAREER_BADGES_DATA;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBranchForModal, setSelectedBranchForModal] = useState<BranchCode | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showUniqueFeaturesModal, setShowUniqueFeaturesModal] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('careerpath_user', JSON.stringify(user));
    syncUserProfileToFirestore(user).catch(() => {});
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

  useEffect(() => {
    localStorage.setItem('careerpath_practice_sessions', JSON.stringify(practiceSessions));
  }, [practiceSessions]);

  useEffect(() => {
    localStorage.setItem('careerpath_study_goal', JSON.stringify(studyGoal));
    syncDailyGoalToFirestore(user.id, studyGoal).catch(() => {});
  }, [studyGoal, user.id]);

  useEffect(() => {
    localStorage.setItem('careerpath_badges', JSON.stringify(careerBadges));
  }, [careerBadges]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = initAuth((firebaseUser) => {
      setUser((prev) => ({
        ...prev,
        id: firebaseUser.uid,
        name: firebaseUser.displayName || prev.name || 'Pratham',
        email: firebaseUser.email || prev.email || 'prakash111pratham@gmail.com',
        avatar: firebaseUser.photoURL || prev.avatar,
        isEmailVerified: firebaseUser.emailVerified,
      }));
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

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
    setUser((prev) => {
      const newXp = prev.xp + amount;
      return {
        ...prev,
        xp: newXp,
      };
    });
  };

  const addPracticeSession = (session: PracticeSessionRecord) => {
    setPracticeSessions((prev) => [session, ...prev]);
    // Also increase study time for today
    const hours = session.durationMinutes / 60;
    setStudyGoal((prev) => ({
      ...prev,
      studiedHoursToday: Math.round((prev.studiedHoursToday + hours) * 10) / 10,
      lastUpdated: new Date().toISOString(),
    }));
    // Award XP
    incrementXp(session.intensity * 25, `Completed ${session.domainLabel} practice`);
    // Sync to Firestore
    syncPracticeLogToFirestore(user.id, session).catch(() => {});
  };

  const updateStudyGoal = (updates: Partial<DailyStudyGoal>) => {
    setStudyGoal((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const logStudyTime = (minutes: number, domain: EngineeringDomain = 'dsa') => {
    const hours = minutes / 60;
    setStudyGoal((prev) => ({
      ...prev,
      studiedHoursToday: Math.round((prev.studiedHoursToday + hours) * 10) / 10,
      lastUpdated: new Date().toISOString(),
    }));

    const domainLabels: Record<EngineeringDomain, string> = {
      dsa: 'Data Structures & Algorithms',
      system_design: 'System Design & Architecture',
      core_cs: 'Core CS (OS/DBMS/CN)',
      aptitude: 'Quant & Logical Aptitude',
      gd_verbal: 'Verbal & Mock GD Speech',
    };

    const newSession: PracticeSessionRecord = {
      id: `sess-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      domain,
      domainLabel: domainLabels[domain],
      durationMinutes: minutes,
      intensity: minutes >= 60 ? 3 : minutes >= 30 ? 2 : 1,
      questionsSolved: minutes >= 30 ? 2 : 1,
      notes: `Quick study logged (+${minutes}m)`,
    };
    addPracticeSession(newSession);
  };

  const unlockBadge = (badgeId: string) => {
    setCareerBadges((prev) =>
      prev.map((b) => {
        if (b.id === badgeId && !b.unlocked) {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          incrementXp(b.xpValue, `Unlocked badge: ${b.title}`);
          return {
            ...b,
            unlocked: true,
            unlockedAt: 'Unlocked Today',
          };
        }
        return b;
      })
    );
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
        practiceSessions,
        addPracticeSession,
        studyGoal,
        updateStudyGoal,
        logStudyTime,
        careerBadges,
        unlockBadge,
        isAuthModalOpen,
        setIsAuthModalOpen,
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
