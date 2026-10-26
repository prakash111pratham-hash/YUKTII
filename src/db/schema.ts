import { relations } from 'drizzle-orm';
import { boolean, doublePrecision, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table indexed by UID (supports Firebase Auth UID or generated user ID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  phone: text('phone'),
  isPhoneVerified: boolean('is_phone_verified').default(false).notNull(),
  isEmailVerified: boolean('is_email_verified').default(true).notNull(),
  college: text('college').default('Engineering College'),
  selectedBranch: text('selected_branch').default('CSE'),
  currentYear: text('current_year').default('1st Year'),
  xp: integer('xp').default(0).notNull(),
  streakDays: integer('streak_days').default(0).notNull(),
  targetLpa: integer('target_lpa').default(14),
  cgpa: doublePrecision('cgpa').default(8.0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Student resumes table
export const resumes = pgTable('resumes', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid')
    .references(() => users.uid, { onDelete: 'cascade' })
    .notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  location: text('location'),
  summary: text('summary'),
  linkedin: text('linkedin'),
  github: text('github'),
  portfolioUrl: text('portfolio_url'),
  education: jsonb('education'),
  skills: jsonb('skills'),
  projects: jsonb('projects'),
  achievements: jsonb('achievements'),
  certifications: jsonb('certifications'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Daily study goals tracking
export const studyGoals = pgTable('study_goals', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid')
    .references(() => users.uid, { onDelete: 'cascade' })
    .notNull(),
  targetHours: doublePrecision('target_hours').default(3.0).notNull(),
  studiedHoursToday: doublePrecision('studied_hours_today').default(0.0).notNull(),
  streakDays: integer('streak_days').default(0).notNull(),
  dateKey: text('date_key').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Practice sessions for the skill progression heatmap
export const practiceLogs = pgTable('practice_logs', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid')
    .references(() => users.uid, { onDelete: 'cascade' })
    .notNull(),
  domain: text('domain').notNull(),
  domainLabel: text('domain_label').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  intensity: integer('intensity').default(1).notNull(),
  questionsSolved: integer('questions_solved').default(0).notNull(),
  notes: text('notes'),
  date: text('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Internship and job application records
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid')
    .references(() => users.uid, { onDelete: 'cascade' })
    .notNull(),
  internshipId: text('internship_id').notNull(),
  company: text('company').notNull(),
  title: text('title').notNull(),
  appliedDate: text('applied_date').notNull(),
  status: text('status').notNull(),
  notes: text('notes'),
  deadline: text('deadline'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  resumes: many(resumes),
  studyGoals: many(studyGoals),
  practiceLogs: many(practiceLogs),
  applications: many(applications),
}));
