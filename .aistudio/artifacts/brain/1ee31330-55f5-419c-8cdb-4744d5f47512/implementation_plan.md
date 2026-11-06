# Creative Dancing AI Buddy & Enhanced Student Achievement Badges System

A creative animated AI mascot that wanders, dances with humorous expressions, and provides Gemini 3.8 Flash guidance, paired with an achievement badge showcase tracking student milestones in the Practice and Interview hubs.

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural direction below incorporates your confirmed preferences from Phase 1 interactive clarification:
> - **Confirmed Chatbot Experience**: An interactive floating companion ("Yuki") that floats and wanders around the screen edges, reacts with funny facial expressions, executes dance modes (Breakdance, Robot Dance, Disco Wiggle), and seamlessly opens into the full Gemini 3.8 Flash multi-turn counseling chat.
> - **Confirmed Badges Experience**: A visual achievement showcase on the main Dashboard featuring live progress bars, explicit unlock criteria, category filters, and confetti celebrations, tracking "Interview Streak", "Course Completion", "Mock Test Topper", and domain practice milestones connected with Firestore persistence.

---

## 1. Overview & Core Concept

1. **Creative Floating Dancing Chatbot Buddy ("Yuki")**:
   - Instead of a static button or boring drawer, students are accompanied by an expressive, animated 2D mascot.
   - **Playful Behaviors**: Idle floating, humorous edge wandering ("inspecting your code"), funny moments (giggling, blushing, dizzy spins, sunglasses cool pose), and user-triggered dance routines with particle notes.
   - **Gemini 3.8 Flash Integration**: Clicking the buddy expands an AI counseling panel powered by `models/gemini-3.8-flash` with Google Search grounding, contextual placement advice, and conversation memory.
   - **Freedom of Movement**: Draggable or autonomous wandering with a quiet "dock/sleep" toggle so it never blocks key workspace controls.

2. **Student Achievement Badges System (`Badges.tsx`)**:
   - Displayed directly on the **Dashboard Overview** as a premier visual token showcase.
   - **Dynamic Tracking & Criteria**:
     - **'Interview Streak'**: Consecutive days of AI mock interviews in the Mock Interview Studio.
     - **'Course Completion'**: Completing core engineering modules across DSA, Web Systems, and System Design.
     - **'Mock Test Topper'**: Attaining 90%+ score in TCS NQT, Infosys, or Company Mock Tests in the Practice Hub.
     - **Complementary Badges**: Cognitive Spark, Code Warrior, Speech Virtuoso, ATS Optimizer.
   - **Interactive Details**: Clicking any token opens an inspection modal with live criteria progress bars, XP reward attribution, and celebratory confetti.
   - **Persistence**: Synced to Firebase Firestore subcollection `/users/{userId}/badges/{badgeId}` and local state.

---

## 2. User Experience & Visual Design

### A. Creative Mascot Visual Identity & Animations
- **Design Persona**: "Yuki", an origami-styled neon-gold cyber spirit inspired by the YUKTI sacred geometric emblem.
- **Micro-Animations & Funny Moments**:
  - *Idle Hover*: Gentle float with eye-blinks and floating sparkle dust.
  - *Dance Modes*: Quick button or automatic celebration triggers:
    - 🕺 *Disco Groove*: Hip-hop bounce with musical note particles.
    - 🤖 *Robot Freeze*: Stiff mechanical head-tilts with funny soundwave visuals.
    - 🌀 *Breakdance Spin*: 360-degree flip ending in sunglasses pose.
  - *Edge Wander*: Smoothly glides along the bottom or side dock when idle, peeking out playfully.
- **Top Bar & Anti-Slop Compliance**: The floating mascot sits above viewport z-index with zero-pill metadata discipline, WCAG-compliant contrast, and clean tooltips.

### B. Badges Showcase Layout & Visual Architecture
- **Dashboard Section**: Positioned prominently in `DashboardView.tsx` with a dual-level display:
  - *Summary Ribbon*: Overall unlock counter (e.g. `4 of 8 Unlocked`), total badge XP, and category filter segmented controls (`All`, `Interview Hub`, `Practice Hub`, `Academic`).
  - *Medallion Token Grid*: Distinctive circular/squircle tokens with metallic gradient borders (Bronze, Emerald, Amber Gold, Cosmic Indigo).
  - *Lock State*: Locked tokens show clear grayscale glass with real-time percentage progress bars (`75%`, `2/3 Completed`) so students always know the exact next action to unlock.
  - *Inspection Modal*: High-fidelity preview with animated confetti, achievement date, and direct CTA (e.g., "Take Mock Interview to Unlock").

---

## 3. Key Product Decisions & Trade-Offs

- **Autonomous Wandering with User Control**:
  - *Decision*: Allow the dancing mascot to wander gently between designated dock stations at the screen edges, but provide a 1-click "Settle / Sleep" button and drag support so students never feel obstructed during coding or mock tests.
  - *Why*: Balances humor and delight with distraction-free focus during exams.
- **Real Engagement Calculation**:
  - *Decision*: Wire badge progress directly to `AppContext` stores: `practiceSessions`, `scores`, `studyGoal`, and mock interview logs, persisting unlocked status to Firestore.
  - *Why*: Ensures badges represent real accomplishments rather than static mocks.
- **Model Choice (`models/gemini-3.8-flash`)**:
  - *Decision*: Route all AI chat requests to `models/gemini-3.8-flash` via the server proxy `/api/ai/chat` with Google Search grounding.
  - *Why*: Ultra-fast response latency (<1.5s) with high accuracy for Indian campus placement topics.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          User Interface                                │
│                                                                        │
│   ┌───────────────────────────┐      ┌─────────────────────────────┐   │
│   │ Floating Dancing Mascot   │      │ DashboardView               │   │
│   │ (Yuki Animated Chatbot)   │      │ ├── Hero Summary Banner     │   │
│   │ ├── Dance Mode Triggers   │      │ ├── UserProfileSection      │   │
│   │ ├── Edge Wander Engine    │      │ ├── LevelProgression        │   │
│   │ └── Gemini 3.8 Chat Modal │      │ └── Badges Showcase         │   │
│   └─────────────┬─────────────┘      └──────────────┬──────────────┘   │
└─────────────────┼───────────────────────────────────┼──────────────────┘
                  │                                   │
                  ▼                                   ▼
┌──────────────────────────────────┐ ┌───────────────────────────────────┐
│ AppContext / User State Store    │ │ PracticeHubView & MockInterview   │
│ ├── user.badges: string[]        │ │ ├── Interview completed events    │
│ ├── practiceSessions: Log[]      │ │ ├── Test scores (TCS NQT 90%+)    │
│ └── unlockBadge(badgeId, xp)     │ │ └── Course milestone updates      │
└─────────────────┬────────────────┘ └────────────────┬──────────────────┘
                  │                                   │
                  ▼                                   ▼
┌──────────────────────────────────┐ ┌───────────────────────────────────┐
│ Backend & AI Services (Express)  │ │ Firebase Firestore & Cloud SQL    │
│ ├── POST /api/ai/chat            │ │ ├── /users/{userId}/badges/{id}   │
│ │   └── gemini-3.8-flash (Search)│ │ └── /users/{userId} profile sync  │
│ └── POST /api/user/sync          │ └───────────────────────────────────┘
└──────────────────────────────────┘
```

### Component Implementation Steps

1. **`src/components/AiChatbot.tsx` Enhancement**:
   - Transform the launcher into an animated floating SVG/Canvas character with states: `idle`, `dancing`, `wandering`, `giggling`, `chatting`.
   - Add dance selector controls (Breakdance, Robot, Disco) with rhythmic CSS keyframes and funny emoji bubbles.
   - Add wander trajectory logic respecting screen viewport boundaries.
   - Update `server.ts` to use `gemini-3.8-flash` for all chat turns.

2. **`src/components/Badges.tsx` Comprehensive Overhaul**:
   - Define canonical achievement catalog:
     - `interview-streak`: 3-day consecutive mock interview streak in Interview Hub.
     - `mock-test-topper`: Score 90%+ in TCS NQT, Infosys, or Core Mock in Practice Hub.
     - `course-completion`: Complete 100% of branch milestone roadmap modules.
     - `code-warrior`, `aptitude-ace`, `speech-virtuoso`, `ats-architect`.
   - Real-time progress computation from `practiceSessions` and `scores`.
   - Interactive modal with confetti burst and Firestore document write.

3. **`src/views/DashboardView.tsx` Integration**:
   - Ensure `Badges` component is prominently showcased right below the primary metrics cards.
   - Real-time listener for newly unlocked achievements.
