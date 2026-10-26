import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, DailyStudyGoal, PracticeSessionRecord } from '../types';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
const dbId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;
export const db = dbId ? getFirestore(app, dbId) : getFirestore(app);

// Connection test as required by firebase integration guidelines
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: Client currently offline or initializing.');
    }
    return false;
  }
}
// Run connection test quietly on startup
testConnection().catch(() => {});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Sync Notice:', JSON.stringify(errInfo));
}

// Standard Google Auth Provider for student login
export const standardGoogleProvider = new GoogleAuthProvider();
standardGoogleProvider.setCustomParameters({ prompt: 'select_account' });

// Google Auth Provider with full Google Workspace integration scopes
export const workspaceGoogleProvider = new GoogleAuthProvider();
workspaceGoogleProvider.setCustomParameters({ prompt: 'consent' });
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/gmail.compose');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/chat.spaces.readonly');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/chat.messages');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/chat.messages.readonly');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/classroom.courses.readonly');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/classroom.coursework.me.readonly');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/classroom.announcements.readonly');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/documents');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/documents.readonly');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/drive.file');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/tasks');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/tasks.readonly');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/forms.body');
workspaceGoogleProvider.addScope('https://www.googleapis.com/auth/forms.responses.readonly');

let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (
  withWorkspaceScopes: boolean = false
): Promise<{ user: User; accessToken: string } | null> => {
  const targetProvider = withWorkspaceScopes ? workspaceGoogleProvider : standardGoogleProvider;
  try {
    const result = await signInWithPopup(auth, targetProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    return {
      user: result.user,
      accessToken: cachedAccessToken || '',
    };
  } catch (error: any) {
    // Gracefully handle user cancellation or popup dismissal without error explosion
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/user-cancelled' ||
      String(error?.message || '').includes('popup-closed-by-user') ||
      String(error?.message || '').includes('cancelled-popup-request')
    ) {
      console.warn('Google Sign-In popup was closed or cancelled by the user.');
      return null;
    }
    if (error?.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by your browser. Please allow popups for this site.');
    }
    console.error('Firebase Google Sign-In error:', error);
    throw error;
  }
};

export const emailSignIn = async (email: string, pass: string): Promise<User> => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    return res.user;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

export const emailSignUp = async (email: string, pass: string, name: string): Promise<User> => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
    }
    return res.user;
  } catch (error) {
    console.error('Email sign-up error:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Firestore Persistence Helpers
export async function syncUserProfileToFirestore(user: UserProfile): Promise<void> {
  // Only attempt direct client Firestore write if the user has an active Firebase Auth session
  // Cloud SQL backend persistence is handled concurrently by /api/user/sync
  if (!auth.currentUser) {
    return;
  }
  const currentUid = auth.currentUser.uid;
  const path = `users/${currentUid}`;
  try {
    await setDoc(
      doc(db, 'users', currentUid),
      {
        uid: currentUid,
        name: user.name,
        email: user.email,
        college: user.college || '',
        currentYear: user.currentYear,
        selectedBranch: user.selectedBranch || 'CSE',
        cgpa: user.cgpa || 8.8,
        targetLPA: user.targetLPA || 18,
        xp: user.xp,
        streakDays: user.streakDays,
        phoneNumber: user.phoneNumber || '',
        isPhoneVerified: Boolean(user.isPhoneVerified),
        isEmailVerified: Boolean(user.isEmailVerified),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function syncDailyGoalToFirestore(
  userId: string,
  goal: DailyStudyGoal
): Promise<void> {
  if (!auth.currentUser) {
    return;
  }
  const currentUid = auth.currentUser.uid;
  const todayKey = new Date().toISOString().slice(0, 10);
  const path = `users/${currentUid}/studyGoals/${todayKey}`;
  try {
    await setDoc(
      doc(db, 'users', currentUid, 'studyGoals', todayKey),
      {
        id: todayKey,
        userId: currentUid,
        targetHours: goal.targetHours,
        studiedHours: goal.studiedHoursToday,
        streakDays: goal.streakDays,
        date: todayKey,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function syncPracticeLogToFirestore(
  userId: string,
  log: PracticeSessionRecord
): Promise<void> {
  if (!auth.currentUser) {
    return;
  }
  const currentUid = auth.currentUser.uid;
  const path = `users/${currentUid}/practiceLogs/${log.id}`;
  try {
    await setDoc(
      doc(db, 'users', currentUid, 'practiceLogs', log.id),
      {
        id: log.id,
        userId: currentUid,
        domain: log.domain,
        durationMinutes: log.durationMinutes,
        intensity: log.intensity,
        questionsSolved: log.questionsSolved,
        date: log.date,
        notes: log.notes || '',
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
