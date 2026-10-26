import { db, isDatabaseConfigured } from './index.ts';
import { users, resumes, studyGoals, practiceLogs, applications } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface UserUpsertData {
  uid: string;
  name: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  college?: string;
  selectedBranch?: string;
  currentYear?: string;
  xp?: number;
  streakDays?: number;
  targetLpa?: number;
  cgpa?: number;
}

export async function upsertDbUser(userData: UserUpsertData) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  try {
    const existing = await db.select().from(users).where(eq(users.email, userData.email.toLowerCase().trim())).limit(1);
    if (existing && existing.length > 0) {
      const updated = await db
        .update(users)
        .set({
          name: userData.name,
          phone: userData.phone !== undefined ? userData.phone : existing[0].phone,
          isPhoneVerified: userData.isPhoneVerified !== undefined ? userData.isPhoneVerified : existing[0].isPhoneVerified,
          college: userData.college || existing[0].college,
          selectedBranch: userData.selectedBranch || existing[0].selectedBranch,
          currentYear: userData.currentYear || existing[0].currentYear,
          xp: userData.xp !== undefined ? userData.xp : existing[0].xp,
          streakDays: userData.streakDays !== undefined ? userData.streakDays : existing[0].streakDays,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing[0].id))
        .returning();
      return updated[0];
    }

    const inserted = await db
      .insert(users)
      .values({
        uid: userData.uid,
        name: userData.name,
        email: userData.email.toLowerCase().trim(),
        passwordHash: userData.passwordHash || '',
        phone: userData.phone || null,
        isPhoneVerified: Boolean(userData.isPhoneVerified),
        isEmailVerified: true,
        college: userData.college || 'Engineering College',
        selectedBranch: userData.selectedBranch || 'CSE',
        currentYear: userData.currentYear || '1st Year',
        xp: userData.xp || 0,
        streakDays: userData.streakDays || 0,
        targetLpa: userData.targetLpa || 14,
        cgpa: userData.cgpa || 8.0,
      })
      .returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to upsert user in database:', error);
    throw new Error('Database operation failed', { cause: error });
  }
}

export async function findDbUserByEmail(email: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  try {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.warn('Failed to find user by email in database:', error);
    return null;
  }
}

export async function updateDbUserPhone(email: string, phone: string, isVerified: boolean) {
  if (!isDatabaseConfigured()) {
    return null;
  }
  try {
    const updated = await db
      .update(users)
      .set({
        phone,
        isPhoneVerified: isVerified,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email.toLowerCase().trim()))
      .returning();
    return updated[0] || null;
  } catch (error) {
    console.warn('Failed to update phone in database:', error);
    return null;
  }
}
