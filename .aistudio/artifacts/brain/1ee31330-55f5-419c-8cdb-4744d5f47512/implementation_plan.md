# Implementation Plan: User Profile Management & Real Mobile Authentication

Integrate an embedded User Profile management section into the Dashboard overview for updating graduation year, engineering branch, and academic interests with real-time Firebase Firestore synchronization. Enhance phone authentication with combined Firebase Phone Auth and direct SMS OTP verification, and ensure a pristine fresh-start onboarding experience for every new student.

---

## 1. User Profile Management Component (Embedded in Dashboard)
- **Component**: Create `src/components/UserProfileCard.tsx` (modular and styled to match YUKTI's clean engineering aesthetics).
- **Embedded Integration**: Mount the profile editor directly into the top of `src/views/DashboardView.tsx` with quick inline editing and expanded settings toggling.
- **Editable Academic Fields**:
  - **Graduation Year / Batch**: Selectable graduation years (2025, 2026, 2027, 2028, 2029) and synchronized academic year (1st Year to 4th Year).
  - **Engineering Branch**: Standard Indian engineering branches (CSE, IT, ECE, EE, ME, Civil, AI/Data Science, etc.) with automatic curriculum roadmap recalculation.
  - **Academic & Technical Interests**: Interactive tag selector with popular engineering domains (Algorithms, Full-Stack, System Design, AI/ML, Cloud Computing, Cyber Security, Robotics, etc.) plus a custom tag addition input.
  - **Career Goal & Target LPA**: Direct editing of placement goals and target CTC package.
- **Firestore Persistence**:
  - Automatically persist updates to Firestore document `/users/{userId}` via `updateDoc`/`setDoc(..., { merge: true })`.
  - Concurrently sync to Cloud SQL backend `/api/user/sync` and local React state in `AppContext`.
  - Display immediate feedback toasts upon saving.

---

## 2. Combined Firebase Phone Auth & Direct OTP Authentication
- **Firebase Phone Auth Integration**:
  - Configure `RecaptchaVerifier` and `signInWithPhoneNumber` in `src/lib/firebase.ts` for native Firebase SMS OTP dispatch.
  - Pair with backend direct SMS OTP verification in `server.ts` (`/api/auth/send-otp` & `/api/auth/verify-otp`) to guarantee delivery across all Indian mobile numbers (+91) without browser popup blocks.
- **Real Mobile Number Verification Flow**:
  - Validate 10-digit mobile number format with automatic +91 country prefixing.
  - 6-digit OTP input with keyboard auto-navigation, countdown resend timer (45s), and auto-verification.
  - Upon successful verification, award +100 XP, set `isPhoneVerified: true`, and persist the verified phone number to the student's Firestore profile.

---

## 3. Fresh Start Protocol for Every New User
- **Zero-State Guarantees**:
  - Ensure all newly registered accounts start at **0 XP**, **0-day streak**, **0 hours logged**, and **empty practice sessions**.
  - No dummy or mock user records (`Sreya Sengupta`, etc.) will ever appear on a new user's dashboard or resume.
  - On account switch or logout, clean all cached localStorage sessions (`careerpath_user`, `careerpath_practice_sessions`, `careerpath_badges`, etc.) so new credentials never inherit prior state.
- **Profile Initialization**:
  - When a student registers or verifies their phone/email, automatically seed a personalized clean profile in Firestore with their entered name, phone, branch, and graduation year.

---

## 4. Firestore Blueprint & Verification
- Update `firebase-blueprint.json` to include `graduationYear`, `interests`, `phoneNumber`, and `isPhoneVerified` in the `UserProfile` schema.
- Update `firestore.rules` if necessary and deploy via `DeployRules`.
- Verify compilation with `compile_applet` and test in the real browser.

---

## Verification Plan
1. **Compilation & Linting**: Run `compile_applet` and `lint_applet` (`tsc --noEmit`) to verify 0 syntax or type errors.
2. **Unit Tests**: Run `npx --yes tsx --test src/utils/scoring.test.ts src/utils/progression.test.ts` to confirm progression logic holds.
3. **Interactive Profile Update Test**: Edit graduation year, branch, and add/remove academic interests in the Dashboard; verify instant UI update and Firestore sync.
4. **Phone OTP Verification Test**: Test mobile number verification in the Auth modal and ensure `Phone Verified` badge appears with 100 XP awarded.
5. **Fresh User Test**: Register a new student and verify that dashboard starts at 0 XP with a completely clean slate.
