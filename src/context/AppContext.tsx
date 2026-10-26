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
  createFreshUserProfile,
  createFreshResumeData,
  createFreshStudyGoal,
  createFreshBadges,
} from '../data/sampleProfileData';
import {
  syncUserProfileToFirestore,
  syncDailyGoalToFirestore,
  syncPracticeLogToFirestore,
  logout,
} from '../lib/firebase';
import confetti from 'canvas-confetti';

interface AppContextType {
  isAuthenticated: boolean;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  loginUser: (userData: Partial<UserProfile>, isNew?: boolean) => void;
  logoutUser: () => void;
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

  // Study & Heatmap Features
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
  // Authentication session state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authState = localStorage.getItem('careerpath_auth_state');
    return authState ? authState === 'true' : true;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('careerpath_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Automatically purge any stale Pratham references and start fresh
        if (
          parsed.email === 'prakash111pratham@gmail.com' ||
          parsed.name === 'Pratham' ||
          String(parsed.email || '').includes('pratham')
        ) {
          localStorage.removeItem('careerpath_user');
          localStorage.removeItem('careerpath_resume');
          localStorage.removeItem('careerpath_study_goal');
          localStorage.removeItem('careerpath_practice_sessions');
          localStorage.removeItem('careerpath_apps');
          localStorage.removeItem('careerpath_badges');
          return SAMPLE_STUDENT_PROFILE;
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
        if (parsed.email === 'prakash111pratham@gmail.com' || parsed.fullName === 'Pratham') {
          return SAMPLE_RESUME_DATA;
        }
        return parsed;
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

  const [practiceSessions, setPracticeSessions] = useState<PracticeSessionRecord[]>(() => {
    const saved = localStorage.getItem('careerpath_practice_sessions');
    return saved ? JSON.parse(saved) : generateInitialPracticeSessions();
  });

  const [studyGoal, setStudyGoal] = useState<DailyStudyGoal>(() => {
    const saved = localStorage.getItem('careerpath_study_goal');
    return saved ? JSON.parse(saved) : SAMPLE_STUDY_GOAL;
  });

  const [careerBadges, setCareerBadges] = useState<CareerBadge[]>(() => {
    const saved = localStorage.getItem('careerpath_badges');
    return saved ? JSON.parse(saved) : CAREER_BADGES_DATA;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBranchForModal, setSelectedBranchForModal] = useState<BranchCode | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showUniqueFeaturesModal, setShowUniqueFeaturesModal] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Sync state to localStorage & Firestore & Cloud SQL
  useEffect(() => {
    localStorage.setItem('careerpath_auth_state', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('careerpath_user', JSON.stringify(user));
    if (isAuthenticated) {
      syncUserProfileToFirestore(user).catch(() => {});
      // Also sync to Cloud SQL backend
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      }).catch(() => {});
    }
  }, [user, isAuthenticated]);

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
    if (isAuthenticated && user?.id) {
      syncDailyGoalToFirestore(user.id, studyGoal).catch(() => {});
    }
  }, [studyGoal, user.id, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('careerpath_badges', JSON.stringify(careerBadges));
  }, [careerBadges]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  /**
   * Log in or register a user:
   * When any user logs in, completely initialize data to start fresh from ZERO:
   * 0 XP, 0 Streak, clean roadmap, personalized resume, fresh goals, and no repeated data!
   */
  const loginUser = (userData: Partial<UserProfile>, isNew: boolean = false) => {
    const isDifferentEmail = Boolean(
      userData.email && userData.email.toLowerCase() !== (user.email || '').toLowerCase()
    );

    if (isNew || isDifferentEmail) {
      // START FRESH FROM ZERO FOR ANY NEW OR SWITCHED USER
      const freshUser = createFreshUserProfile(userData);
      const freshResume = createFreshResumeData(freshUser);
      const freshGoal = createFreshStudyGoal();
      const freshBadgesList = createFreshBadges();

      setUser(freshUser);
      setResumeData(freshResume);
      setStudyGoal(freshGoal);
      setPracticeSessions([]); // Zero practice sessions initially
      setApplications([]); // Zero applications initially
      setCareerBadges(freshBadgesList); // All badges locked
      setIsAuthenticated(true);

      // Save user-scoped backup
      localStorage.setItem('careerpath_user', JSON.stringify(freshUser));
      localStorage.setItem('careerpath_resume', JSON.stringify(freshResume));
      localStorage.setItem('careerpath_study_goal', JSON.stringify(freshGoal));
      localStorage.setItem('careerpath_practice_sessions', JSON.stringify([]));
      localStorage.setItem('careerpath_apps', JSON.stringify([]));
      localStorage.setItem('careerpath_badges', JSON.stringify(freshBadgesList));
      localStorage.setItem('careerpath_auth_state', 'true');

      console.log(`[USER SESSION] Started fresh from zero for: ${freshUser.name} (${freshUser.email})`);
    } else {
      // Update existing session
      setUser((prev) => ({ ...prev, ...userData }));
      setIsAuthenticated(true);
      localStorage.setItem('careerpath_auth_state', 'true');
    }
  };

  /**
   * Sign Out process:
   * Cleans active credentials and sets authenticated state to false
   */
  const logoutUser = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn('Firebase logout notice:', e);
    }
    setIsAuthenticated(false);
    localStorage.setItem('careerpath_auth_state', 'false');

    // Reset current active profile to clean guest state
    const guestUser: UserProfile = {
      id: 'guest',
      name: 'Guest Student',
      email: '',
      currentYear: '1st Year',
      college: 'Engineering College',
      selectedBranch: 'CSE',
      targetLPA: 14,
      cgpa: 8.0,
      xp: 0,
      streakDays: 0,
      badges: [],
      interests: [],
      careerGoal: 'Sign in to configure your target package and career roadmap',
      completedAssessment: false,
      isPhoneVerified: false,
      isEmailVerified: false,
    };
    setUser(guestUser);
    setResumeData(createFreshResumeData(guestUser));
    setStudyGoal(createFreshStudyGoal());
    setPracticeSessions([]);
    setApplications([]);
    setCareerBadges(createFreshBadges());

    localStorage.removeItem('careerpath_user');
    localStorage.removeItem('careerpath_resume');
    localStorage.removeItem('careerpath_study_goal');
    localStorage.removeItem('careerpath_practice_sessions');
    localStorage.removeItem('careerpath_apps');
    localStorage.removeItem('careerpath_badges');

    console.log('[USER SESSION] Signed out successfully.');
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

  const addPracticeSession = (session: PracticeSessionRecord) => {
    setPracticeSessions((prev) => [session, ...prev]);
    const hours = session.durationMinutes / 60;
    setStudyGoal((prev) => ({
      ...prev,
      studiedHoursToday: Math.round((prev.studiedHoursToday + hours) * 10) / 10,
      lastUpdated: new Date().toISOString(),
    }));
    incrementXp(session.intensity * 25, `Completed ${session.domainLabel} practice`);
    if (isAuthenticated) {
      syncPracticeLogToFirestore(user.id, session).catch(() => {});
    }
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
        isAuthenticated,
        user,
        updateUser,
        loginUser,
        logoutUser,
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
