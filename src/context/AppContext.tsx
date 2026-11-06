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
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  auth,
  syncUserProfileToFirestore,
  updateUserProfileInFirestore,
  getUserProfileFromFirestore,
  syncDailyGoalToFirestore,
  syncPracticeLogToFirestore,
  syncBadgeToFirestore,
  logout,
} from '../lib/firebase';
import confetti from 'canvas-confetti';

interface AppContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: UserProfile;
  firebaseUser: FirebaseUser | null;
  authUser: FirebaseUser | null;
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
  logCodingProblems: (count: number) => void;
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
  // Authentication session state & Firebase Auth State Observer
  const [user, setUser] = useState<UserProfile>(SAMPLE_STUDENT_PROFILE);
  const [loading, setLoading] = useState<boolean>(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Active Auth State Observer (onAuthStateChanged)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        setIsAuthenticated(true);
        // Dynamically fetch profile from /users/{userId} using currentUser.uid
        const remoteProfile = await getUserProfileFromFirestore(currentUser.uid).catch(() => null);
        const derivedName =
          currentUser.displayName ||
          (currentUser.email ? currentUser.email.split('@')[0] : 'Engineering Student');

        const activeUser: UserProfile = {
          id: currentUser.uid,
          uid: currentUser.uid,
          name: remoteProfile?.name || currentUser.displayName || derivedName,
          email: currentUser.email || remoteProfile?.email || '',
          phoneNumber: currentUser.phoneNumber || remoteProfile?.phoneNumber || '',
          isPhoneVerified: Boolean(currentUser.phoneNumber || remoteProfile?.isPhoneVerified),
          isEmailVerified: Boolean(currentUser.emailVerified),
          currentYear: (remoteProfile?.currentYear as any) || '1st Year',
          graduationYear: remoteProfile?.graduationYear || '2028',
          college: remoteProfile?.college || 'National Institute of Technology (NIT)',
          selectedBranch: (remoteProfile?.selectedBranch as any) || 'CSE',
          targetLPA: remoteProfile?.targetLPA || 18,
          cgpa: remoteProfile?.cgpa || 8.5,
          interests: remoteProfile?.interests || ['Coding', 'Web Systems', 'Algorithms'],
          xp: remoteProfile?.xp ?? 0,
          streakDays: remoteProfile?.streakDays ?? 0,
          badges: remoteProfile?.badges || [],
          completedAssessment: Boolean(remoteProfile?.completedAssessment),
          careerGoal: remoteProfile?.careerGoal || '',
          onboardingCompleted: remoteProfile?.onboardingCompleted ?? false,
        };

        setUser(activeUser);
        localStorage.setItem('careerpath_auth_state', 'true');
        localStorage.setItem('careerpath_user', JSON.stringify(activeUser));
      } else {
        // Will be null if not logged in
        // Check if there's an active verified custom session from phone/email OTP
        const storedAuth = localStorage.getItem('careerpath_auth_state');
        const storedUser = localStorage.getItem('careerpath_user');
        if (storedAuth === 'true' && storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (
              parsed &&
              parsed.email &&
              parsed.id &&
              parsed.id !== 'usr-pratham' &&
              parsed.id !== 'guest'
            ) {
              setUser(parsed);
              setIsAuthenticated(true);
              setLoading(false);
              return;
            }
          } catch {}
        }

        // Clean unauthenticated zero-state
        setUser(SAMPLE_STUDENT_PROFILE);
        setIsAuthenticated(false);
        localStorage.setItem('careerpath_auth_state', 'false');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [scores, setScores] = useState<AptitudeScores>(() => {
    const saved = localStorage.getItem('careerpath_scores');
    return saved ? JSON.parse(saved) : defaultScores;
  });

  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('careerpath_resume');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          return parsed;
        }
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
    if (user) {
      localStorage.setItem('careerpath_user', JSON.stringify(user));
      const targetUid = user.uid || user.id || auth.currentUser?.uid;
      if (targetUid) {
        localStorage.setItem(`careerpath_user_${targetUid}`, JSON.stringify(user));
      }
      if (isAuthenticated && targetUid && targetUid !== 'guest') {
        syncUserProfileToFirestore(user).catch(() => {});
        // Also sync to Cloud SQL backend
        fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        }).catch(() => {});
      }
    } else {
      localStorage.removeItem('careerpath_user');
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
    const targetUid = auth.currentUser?.uid || user?.uid || user?.id;
    if (isAuthenticated && targetUid && targetUid !== 'guest') {
      syncDailyGoalToFirestore(targetUid, studyGoal).catch(() => {});
    }
  }, [studyGoal, user?.id, user?.uid, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('careerpath_badges', JSON.stringify(careerBadges));
  }, [careerBadges]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const targetUid = prev.uid || prev.id || auth.currentUser?.uid || `usr-${Date.now()}`;
      const updated: UserProfile = {
        ...prev,
        ...updates,
        id: targetUid,
        uid: targetUid,
      };
      if (isAuthenticated && targetUid && targetUid !== 'guest') {
        syncUserProfileToFirestore(updated).catch(() => {});
        fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: updated }),
        }).catch(() => {});
      }
      return updated;
    });
  };

  /**
   * Log in or register a user:
   * When any user logs in:
   * - If returning user: restores their saved data from Firestore / localStorage
   * - If new user: starts fresh from ZERO (0% progress, 0 XP, 0 streak, all 0 scores)
   * And permanently saves their data!
   */
  const loginUser = (userData: Partial<UserProfile>, isNew: boolean = false) => {
    const targetUid = auth.currentUser?.uid || userData.uid || userData.id || `usr-${Date.now()}`;

    // Check for existing saved profile for this user if not an explicit new signup
    const savedUserJson = localStorage.getItem(`careerpath_user_${targetUid}`);
    if (savedUserJson && !isNew) {
      try {
        const parsed = JSON.parse(savedUserJson);
        if (parsed && parsed.email) {
          const restoredUser: UserProfile = {
            ...createFreshUserProfile(userData),
            ...parsed,
            id: targetUid,
            uid: targetUid,
          };
          setUser(restoredUser);
          setIsAuthenticated(true);
          localStorage.setItem('careerpath_user', JSON.stringify(restoredUser));
          localStorage.setItem('careerpath_auth_state', 'true');
          syncUserProfileToFirestore(restoredUser).catch(() => {});
          console.log(`[USER SESSION] Restored saved profile for: ${restoredUser.name} (${restoredUser.email})`);
          return;
        }
      } catch {}
    }

    const freshUser = createFreshUserProfile({
      ...userData,
      id: targetUid,
      uid: targetUid,
      xp: 0, // Starts fresh from 0
      streakDays: 0,
      completedAssessment: false,
      onboardingCompleted: isNew ? false : (userData.onboardingCompleted ?? false),
    });

    const freshResume = createFreshResumeData(freshUser);
    const freshGoal = createFreshStudyGoal();
    const freshBadgesList = createFreshBadges();
    const zeroScores: AptitudeScores = {
      logical: 0,
      quantitative: 0,
      verbal: 0,
      problemSolving: 0,
      spatialMechanical: 0,
      riasec: {
        realistic: 0,
        investigative: 0,
        artistic: 0,
        social: 0,
        enterprising: 0,
        conventional: 0,
      },
    };

    setUser(freshUser);
    setScores(zeroScores);
    setResumeData(freshResume);
    setStudyGoal(freshGoal);
    setPracticeSessions([]); // Zero practice sessions initially
    setApplications([]); // Zero applications initially
    setCareerBadges(freshBadgesList); // All badges locked
    setIsAuthenticated(true);

    // Save user-scoped backup and permanent persistence
    localStorage.setItem('careerpath_user', JSON.stringify(freshUser));
    localStorage.setItem(`careerpath_user_${targetUid}`, JSON.stringify(freshUser));
    localStorage.setItem('careerpath_scores', JSON.stringify(zeroScores));
    localStorage.setItem('careerpath_resume', JSON.stringify(freshResume));
    localStorage.setItem('careerpath_study_goal', JSON.stringify(freshGoal));
    localStorage.setItem('careerpath_practice_sessions', JSON.stringify([]));
    localStorage.setItem('careerpath_apps', JSON.stringify([]));
    localStorage.setItem('careerpath_badges', JSON.stringify(freshBadgesList));
    localStorage.setItem('careerpath_auth_state', 'true');

    if (targetUid && targetUid !== 'guest') {
      syncUserProfileToFirestore(freshUser).catch(() => {});
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: freshUser }),
      }).catch(() => {});
    }

    console.log(`[USER SESSION] Initialized fresh 0% progress and saved data for: ${freshUser.name} (${freshUser.email})`);
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
    setFirebaseUser(null);
    setUser(SAMPLE_STUDENT_PROFILE);
    localStorage.setItem('careerpath_auth_state', 'false');

    localStorage.removeItem('careerpath_user');
    localStorage.removeItem('careerpath_resume');
    localStorage.removeItem('careerpath_study_goal');
    localStorage.removeItem('careerpath_practice_sessions');
    localStorage.removeItem('careerpath_apps');
    localStorage.removeItem('careerpath_badges');
    localStorage.removeItem('firebase_id_token');
    localStorage.removeItem('firebase_refresh_token');
    localStorage.removeItem('firebase_uid');
    localStorage.removeItem('firebase_email');
    localStorage.removeItem('firebase_display_name');

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
      xp: (prev.xp || 0) + amount,
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

  const logCodingProblems = (count: number) => {
    setStudyGoal((prev) => {
      const nextCount = (prev.solvedCodingProblemsToday || 0) + count;
      return {
        ...prev,
        solvedCodingProblemsToday: nextCount,
        lastUpdated: new Date().toISOString(),
      };
    });
    incrementXp(count * 25, `Solved ${count} daily practice problem(s)`);
  };

  const unlockBadge = (badgeId: string) => {
    setCareerBadges((prev) =>
      prev.map((b) => {
        if (b.id === badgeId && !b.unlocked) {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          incrementXp(b.xpValue, `Unlocked badge: ${b.title}`);

          const targetUid = auth.currentUser?.uid || user?.uid || user?.id;
          if (targetUid && targetUid !== 'guest') {
            syncBadgeToFirestore(targetUid, {
              id: b.id,
              title: b.title,
              description: b.description,
              category: b.category,
              icon: b.icon,
              unlockedAt: new Date().toISOString(),
            }).catch(() => {});
          }

          return {
            ...b,
            unlocked: true,
            progressPercent: 100,
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
        loading,
        user,
        firebaseUser,
        authUser: firebaseUser,
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
        logCodingProblems,
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
