import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { googleSignIn, getAccessToken, logout, initAuth } from '../lib/firebase';
import { User } from 'firebase/auth';
import {
  Mail,
  FileText,
  CheckSquare,
  Calendar,
  FileSpreadsheet,
  MessageSquare,
  GraduationCap,
  Send,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Search,
  Clock,
  Sparkles,
  ShieldCheck,
  Inbox,
  Trash2,
  Edit3,
  Check,
  ListTodo,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CampusEmail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  isPlacement: boolean;
  unread: boolean;
}

interface WorkspaceDoc {
  id: string;
  title: string;
  category: 'Resume' | 'Interview Notes' | 'Project Spec' | 'Cover Letter';
  lastModified: string;
  docUrl: string;
  status: 'Ready' | 'Draft';
  author: string;
}

interface WorkspaceTask {
  id: string;
  title: string;
  category: 'Placement' | 'Academics' | 'Skill Practice';
  dueDate: string;
  completed: boolean;
  notes?: string;
}

interface CalendarPlacementEvent {
  id: string;
  title: string;
  type: 'Interview' | 'Mock Test' | 'Campus Drive' | 'Class Exam';
  dateStr: string;
  timeStr: string;
  location: string;
  meetLink?: string;
  confirmed: boolean;
}

interface CampusForm {
  id: string;
  title: string;
  purpose: string;
  responsesCount: number;
  status: 'Active' | 'Completed';
  lastResponseDate: string;
  formUrl: string;
}

interface ChatSpace {
  id: string;
  displayName: string;
  type: string;
  lastMessage: string;
  memberCount: number;
}

interface ClassroomCourse {
  id: string;
  name: string;
  section: string;
  faculty: string;
  assignments: { id: string; title: string; dueDate: string; submitted: boolean }[];
}

export const WorkspaceHubView: React.FC = () => {
  const { user, incrementXp } = useApp();

  type TabType = 'gmail' | 'docs' | 'tasks' | 'calendar' | 'forms' | 'chat' | 'classroom';
  const [activeTabSub, setActiveTabSub] = useState<TabType>('gmail');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // --- Confirmation Dialog States (Mandatory for mutating Workspace actions) ---
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    actionLabel: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    description: '',
    actionLabel: 'Confirm',
    onConfirm: () => {},
  });

  // --- 1. GMAIL STATE ---
  const [emails, setEmails] = useState<CampusEmail[]>([
    {
      id: 'em-1',
      from: 'TPO Placement Cell <tpo@nitk.edu.in>',
      subject: 'TCS Digital & Prime Campus Drive 2026 - Shortlist Released',
      snippet: 'Dear Students, The shortlist for Round 2 Technical Interview has been announced. Check slot details...',
      date: 'Today, 10:30 AM',
      isPlacement: true,
      unread: true,
    },
    {
      id: 'em-2',
      from: 'Zoho Talent Acquisition <campus-recruitment@zohocorp.com>',
      subject: 'Interview Schedule: Software Development Engineer Intern',
      snippet: 'Congratulations! Your profile has been shortlisted for the Virtual Technical Round scheduled on Tuesday...',
      date: 'Yesterday',
      isPlacement: true,
      unread: true,
    },
    {
      id: 'em-3',
      from: 'Prof. K. Ramanathan <ramanathan.cs@nitk.edu.in>',
      subject: 'Assignment 4 Deadline Extension - Distributed Database Systems',
      snippet: 'The submission deadline for the PostgreSQL sharding assignment has been extended by 48 hours...',
      date: 'Oct 20',
      isPlacement: false,
      unread: false,
    },
  ]);
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('tpo@nitk.edu.in');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // --- 2. GOOGLE DOCS STATE ---
  const [docsList, setDocsList] = useState<WorkspaceDoc[]>([
    {
      id: 'doc-1',
      title: `${user.name}_SDE_Campus_Resume_2026`,
      category: 'Resume',
      lastModified: 'Modified 2 hours ago',
      docUrl: 'https://docs.google.com/document/d/1yukt-sample-resume-doc/edit',
      status: 'Ready',
      author: user.name,
    },
    {
      id: 'doc-2',
      title: 'TCS_Infosys_Technical_Interview_Revision_Notes',
      category: 'Interview Notes',
      lastModified: 'Modified yesterday',
      docUrl: 'https://docs.google.com/document/d/1yukt-sample-interview-notes/edit',
      status: 'Ready',
      author: user.name,
    },
    {
      id: 'doc-3',
      title: 'Operating_Systems_Capstone_Project_Design_Spec',
      category: 'Project Spec',
      lastModified: 'Modified 3 days ago',
      docUrl: 'https://docs.google.com/document/d/1yukt-sample-os-spec/edit',
      status: 'Draft',
      author: user.name,
    },
    {
      id: 'doc-4',
      title: 'Google_SWE_Summer_Internship_Statement_of_Purpose',
      category: 'Cover Letter',
      lastModified: 'Modified Oct 18',
      docUrl: 'https://docs.google.com/document/d/1yukt-sample-sop-cover/edit',
      status: 'Ready',
      author: user.name,
    },
  ]);
  const [createDocModalOpen, setCreateDocModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<WorkspaceDoc['category']>('Resume');

  // --- 3. GOOGLE TASKS STATE ---
  const [tasksList, setTasksList] = useState<WorkspaceTask[]>([
    {
      id: 'task-1',
      title: 'Solve 5 LeetCode Mediums on Graph BFS/DFS for Amazon Round',
      category: 'Placement',
      dueDate: 'Tomorrow',
      completed: false,
      notes: 'Focus on Cycle Detection in Directed Graphs and Topological Sort.',
    },
    {
      id: 'task-2',
      title: 'Record 2-minute elevator pitch in YUKTI Voice Speech Lab',
      category: 'Skill Practice',
      dueDate: 'Friday',
      completed: false,
      notes: 'Target 130 WPM cadence with zero filler words.',
    },
    {
      id: 'task-3',
      title: 'Submit Distributed Database Systems Lab Assignment on Classroom',
      category: 'Academics',
      dueDate: 'Oct 26',
      completed: false,
      notes: 'Include benchmarking screenshots of PostgreSQL query planner.',
    },
    {
      id: 'task-4',
      title: 'Update GitHub README and deploy live demo link for ATS scan',
      category: 'Placement',
      dueDate: 'Completed',
      completed: true,
      notes: 'Added cloud URL and architecture diagram.',
    },
  ]);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<WorkspaceTask['category']>('Placement');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Tomorrow');

  // --- 4. GOOGLE CALENDAR STATE ---
  const [calendarEvents, setCalendarEvents] = useState<CalendarPlacementEvent[]>([
    {
      id: 'ev-1',
      title: 'TCS NQT National Placement Diagnostic Mock',
      type: 'Mock Test',
      dateStr: 'Tomorrow, Oct 23',
      timeStr: '10:00 AM - 12:00 PM IST',
      location: 'Virtual Proctored Exam (YUKTI Arena)',
      confirmed: true,
    },
    {
      id: 'ev-2',
      title: 'Zoho Corporation - Technical Interview Round 1',
      type: 'Interview',
      dateStr: 'Tuesday, Oct 28',
      timeStr: '02:00 PM - 03:00 PM IST',
      location: 'Google Meet',
      meetLink: 'https://meet.google.com/ykt-placement-zoho',
      confirmed: true,
    },
    {
      id: 'ev-3',
      title: 'Amazon Campus Pre-Placement Talk & Q&A',
      type: 'Campus Drive',
      dateStr: 'Friday, Oct 31',
      timeStr: '04:00 PM - 05:30 PM IST',
      location: 'College Main Auditorium & Live Stream',
      confirmed: true,
    },
  ]);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<CalendarPlacementEvent['type']>('Interview');
  const [newEventDate, setNewEventDate] = useState('Oct 29, 2026');
  const [newEventTime, setNewEventTime] = useState('11:00 AM - 12:00 PM IST');
  const [newEventLocation, setNewEventLocation] = useState('Google Meet');

  // --- 5. GOOGLE FORMS STATE ---
  const [formsList, setFormsList] = useState<CampusForm[]>([
    {
      id: 'form-1',
      title: 'TPO 2026 Campus Placement Registration & Branch Verification',
      purpose: 'Official college verification form for Tier-1 company shortlisting.',
      responsesCount: 385,
      status: 'Active',
      lastResponseDate: '10 minutes ago',
      formUrl: 'https://docs.google.com/forms/d/1yukt-tpo-registration/viewform',
    },
    {
      id: 'form-2',
      title: 'Technical Mock Interview Candidate Peer Feedback Survey',
      purpose: 'Peer review form evaluating STAR methodology and algorithmic explanation.',
      responsesCount: 94,
      status: 'Active',
      lastResponseDate: 'Yesterday',
      formUrl: 'https://docs.google.com/forms/d/1yukt-peer-feedback/viewform',
    },
    {
      id: 'form-3',
      title: 'Company Drive Debrief: Real Interview Questions Archive',
      purpose: 'Student question collection for TCS Digital, Amazon, and Infosys drives.',
      responsesCount: 210,
      status: 'Active',
      lastResponseDate: '2 days ago',
      formUrl: 'https://docs.google.com/forms/d/1yukt-interview-debrief/viewform',
    },
  ]);
  const [createFormModalOpen, setCreateFormModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormPurpose, setNewFormPurpose] = useState('');

  // --- 6. GOOGLE CHAT STATE ---
  const [chatSpaces, setChatSpaces] = useState<ChatSpace[]>([
    {
      id: 'sp-1',
      displayName: 'NITK Surathkal - 2026 Campus Placement Forum',
      type: 'Official Space',
      lastMessage: 'TPO: Amazon pre-placement talk starting at 4 PM in Main Auditorium.',
      memberCount: 420,
    },
    {
      id: 'sp-2',
      displayName: 'TCS Digital / Prime Preparation Group',
      type: 'Study Group',
      lastMessage: 'Pratham: Sharing recent Advanced Quantitative question patterns from yesterday drive.',
      memberCount: 185,
    },
    {
      id: 'sp-3',
      displayName: 'Core Engineering (Mechanical & Civil) Drives',
      type: 'Department Forum',
      lastMessage: 'L&T GET applications close tomorrow midnight.',
      memberCount: 230,
    },
  ]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('sp-1');
  const [chatMessages, setChatMessages] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    'sp-1': [
      { author: 'Training & Placement Officer', text: 'Good morning batch. Qualcomm and Amazon have shared the final candidate shortlists.', time: '09:15 AM' },
      { author: 'Neha Verma', text: 'Are the interview slots sequential or concurrent across panels?', time: '09:22 AM' },
      { author: 'TPO Assistant', text: 'Slots are sequential. Report to Lab 3 with two hard copies of your ATS resume.', time: '09:30 AM' },
    ],
    'sp-2': [
      { author: 'Rohan Iyer', text: 'Anyone solved the cryptarithmetic puzzle from Infosys round?', time: 'Yesterday' },
      { author: 'Pratham', text: 'Yes, check the Practice Arena in YUKTI under Company Mocks, it has full explanations.', time: 'Yesterday' },
    ],
    'sp-3': [
      { author: 'Prof. Desai', text: 'Tata Motors EV team is hosting an interactive session on battery pack thermal design.', time: 'Oct 19' },
    ],
  });
  const [newChatText, setNewChatText] = useState('');

  // --- 7. GOOGLE CLASSROOM STATE ---
  const [courses, setCourses] = useState<ClassroomCourse[]>([
    {
      id: 'c-1',
      name: 'CS301: Advanced Data Structures & Algorithms',
      section: '3rd Year B.Tech CSE',
      faculty: 'Dr. Ramesh Sundaram',
      assignments: [
        { id: 'a-1', title: 'Lab 6: Red-Black Tree Balancing & Benchmarks', dueDate: 'Due Tomorrow, 11:59 PM', submitted: false },
        { id: 'a-2', title: 'Lab 5: Dijkstra and A* Shortest Path on Indian Road Networks', dueDate: 'Submitted', submitted: true },
      ],
    },
    {
      id: 'c-2',
      name: 'CS304: Relational & Distributed Database Management',
      section: '3rd Year B.Tech CSE',
      faculty: 'Dr. Anita George',
      assignments: [
        { id: 'a-3', title: 'Project 2: PostgreSQL Indexing & B-Tree Query Optimizer', dueDate: 'Due in 3 days', submitted: false },
        { id: 'a-4', title: 'Quiz 2: ACID Properties and Serializability', dueDate: 'Graded (95%)', submitted: true },
      ],
    },
    {
      id: 'c-3',
      name: 'HU302: Professional Technical Communication & Campus GD',
      section: 'Campus Placement Prep Module',
      faculty: 'Prof. Meera Nair',
      assignments: [
        { id: 'a-5', title: 'Speech Assignment: 2-Minute Spoken Elevator Pitch', dueDate: 'Due Friday', submitted: false },
      ],
    },
  ]);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = initAuth((user, token) => {
      setCurrentUser(user);
      if (token) setAccessToken(token);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err) {
      console.error('Sign in failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  // --- CONFIRMED MUTATION HANDLERS (with user confirmation requirement) ---
  const triggerConfirmation = (title: string, description: string, actionLabel: string, action: () => void) => {
    setConfirmModal({
      open: true,
      title,
      description,
      actionLabel,
      onConfirm: action,
    });
  };

  // Email Send
  const handleInitiateSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) return;

    triggerConfirmation(
      'Send Campus Placement Email?',
      `You are about to dispatch an official email to "${emailTo}" with subject: "${emailSubject}".`,
      'Send Email',
      () => {
        const newMail: CampusEmail = {
          id: `em-${Date.now()}`,
          from: `Me (${currentUser?.email || user.email})`,
          subject: emailSubject,
          snippet: emailBody.slice(0, 80) + '...',
          date: 'Just now',
          isPlacement: true,
          unread: false,
        };
        setEmails([newMail, ...emails]);
        setComposeModalOpen(false);
        setEmailSubject('');
        setEmailBody('');
        incrementXp(50, 'Dispatched Placement Communication Email');
        confetti({ particleCount: 50, spread: 60 });
      }
    );
  };

  // Doc Create
  const handleInitiateCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    triggerConfirmation(
      'Create New Google Doc?',
      `A new career document titled "${newDocTitle}" (${newDocCategory}) will be created in your Google Drive.`,
      'Create Document',
      () => {
        const newDoc: WorkspaceDoc = {
          id: `doc-${Date.now()}`,
          title: newDocTitle,
          category: newDocCategory,
          lastModified: 'Just now',
          docUrl: `https://docs.google.com/document/create`,
          status: 'Ready',
          author: user.name,
        };
        setDocsList([newDoc, ...docsList]);
        setCreateDocModalOpen(false);
        setNewDocTitle('');
        incrementXp(40, 'Created Google Doc for Placement Prep');
        confetti({ particleCount: 40, spread: 50 });
      }
    );
  };

  // Task Create & Toggle
  const handleInitiateCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    triggerConfirmation(
      'Add Task to Google Tasks?',
      `Add "${newTaskTitle}" due on "${newTaskDueDate}" to your Google Tasks checklist.`,
      'Add Task',
      () => {
        const newTask: WorkspaceTask = {
          id: `task-${Date.now()}`,
          title: newTaskTitle,
          category: newTaskCategory,
          dueDate: newTaskDueDate,
          completed: false,
        };
        setTasksList([newTask, ...tasksList]);
        setCreateTaskModalOpen(false);
        setNewTaskTitle('');
        incrementXp(25, 'Scheduled Academic / Placement Task');
      }
    );
  };

  const handleToggleTask = (taskId: string) => {
    setTasksList((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const next = !t.completed;
          if (next) confetti({ particleCount: 30, spread: 40 });
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  // Calendar Event Create
  const handleInitiateCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    triggerConfirmation(
      'Schedule Event in Google Calendar?',
      `Add "${newEventTitle}" on ${newEventDate} (${newEventTime}) at ${newEventLocation} to your primary Google Calendar.`,
      'Schedule in Calendar',
      () => {
        const newEv: CalendarPlacementEvent = {
          id: `ev-${Date.now()}`,
          title: newEventTitle,
          type: newEventType,
          dateStr: newEventDate,
          timeStr: newEventTime,
          location: newEventLocation,
          confirmed: true,
        };
        setCalendarEvents([newEv, ...calendarEvents]);
        setCreateEventModalOpen(false);
        setNewEventTitle('');
        incrementXp(35, 'Scheduled Placement Event in Google Calendar');
        confetti({ particleCount: 40, spread: 50 });
      }
    );
  };

  // Form Create
  const handleInitiateCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormTitle.trim()) return;

    triggerConfirmation(
      'Publish New Google Form?',
      `Create and share "${newFormTitle}" for campus candidate responses.`,
      'Publish Form',
      () => {
        const newF: CampusForm = {
          id: `form-${Date.now()}`,
          title: newFormTitle,
          purpose: newFormPurpose || 'Campus survey form',
          responsesCount: 0,
          status: 'Active',
          lastResponseDate: 'Just created',
          formUrl: 'https://docs.google.com/forms/create',
        };
        setFormsList([newF, ...formsList]);
        setCreateFormModalOpen(false);
        setNewFormTitle('');
        setNewFormPurpose('');
        incrementXp(30, 'Created Placement Survey Form');
      }
    );
  };

  // Post Chat
  const handleInitiatePostChat = () => {
    if (!newChatText.trim()) return;

    triggerConfirmation(
      'Post Message to Google Chat Space?',
      `Send your message to "${chatSpaces.find((s) => s.id === selectedSpaceId)?.displayName}": "${newChatText}"`,
      'Post Message',
      () => {
        const updated = { ...chatMessages };
        const currentList = updated[selectedSpaceId] || [];
        updated[selectedSpaceId] = [
          ...currentList,
          {
            author: currentUser?.displayName || user.name,
            text: newChatText,
            time: 'Just now',
          },
        ];
        setChatMessages(updated);
        setNewChatText('');
        incrementXp(20, 'Posted message in Campus Space');
      }
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" /> Google Workspace Academic & Placement Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Institutional Productivity & Communications Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Integrate your official Gmail, Google Docs, Tasks, Calendar, Forms, Chat, and Classroom to streamline your campus journey.
          </p>
        </div>

        {/* Google OAuth Login Pill */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2.5 p-2 pr-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={currentUser.photoURL || user.avatar}
                alt={currentUser.displayName || user.name}
                className="w-9 h-9 rounded-xl object-cover border border-slate-200"
              />
              <div className="text-left text-xs">
                <span className="font-bold text-slate-900 block truncate max-w-[130px]">
                  {currentUser.displayName || user.name}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Connected
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="ml-2 text-[11px] text-slate-400 hover:text-rose-600 hover:underline cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google Workspace'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab Navigation - All 7 Tools */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 border-b border-slate-200">
        {[
          { id: 'gmail', label: 'Gmail', icon: Mail, count: emails.filter((e) => e.unread).length },
          { id: 'docs', label: 'Google Docs', icon: FileText, count: docsList.length },
          { id: 'tasks', label: 'Google Tasks', icon: ListTodo, count: tasksList.filter((t) => !t.completed).length },
          { id: 'calendar', label: 'Google Calendar', icon: Calendar, count: calendarEvents.length },
          { id: 'forms', label: 'Google Forms', icon: FileSpreadsheet, count: formsList.length },
          { id: 'chat', label: 'Google Chat', icon: MessageSquare, count: 3 },
          { id: 'classroom', label: 'Classroom', icon: GraduationCap, count: courses.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabSub === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabSub(tab.id as TabType)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---------------- 1. GMAIL VIEW ---------------- */}
      {activeTabSub === 'gmail' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campus & Placement Inbox</h2>
              <p className="text-xs text-slate-500">Official shortlists, interview calls, and university announcements</p>
            </div>
            <button
              type="button"
              onClick={() => setComposeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Compose Email</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {emails.map((m) => (
              <div key={m.id} className="py-3.5 flex items-start justify-between gap-4 group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{m.from}</span>
                      {m.isPlacement && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Placement
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">{m.subject}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{m.snippet}</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 font-medium">{m.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 2. GOOGLE DOCS VIEW ---------------- */}
      {activeTabSub === 'docs' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Career & Technical Google Docs</h2>
              <p className="text-xs text-slate-500">Live ATS resumes, company interview cheat-sheets, and capstone specifications</p>
            </div>
            <button
              type="button"
              onClick={() => setCreateDocModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Doc</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docsList.map((docItem) => (
              <div
                key={docItem.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {docItem.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">{docItem.lastModified}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{docItem.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Author: {docItem.author} • Google Docs Format</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {docItem.status}
                  </span>
                  <a
                    href={docItem.docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>Open in Google Docs</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 3. GOOGLE TASKS VIEW ---------------- */}
      {activeTabSub === 'tasks' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Google Tasks • Placement & Academic To-Dos</h2>
              <p className="text-xs text-slate-500">Track company practice targets, semester assignments, and deadline checklists</p>
            </div>
            <button
              type="button"
              onClick={() => setCreateTaskModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {tasksList.map((t) => (
              <div
                key={t.id}
                onClick={() => handleToggleTask(t.id)}
                className="py-3 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                      t.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {t.completed && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h3
                      className={`text-xs sm:text-sm font-bold ${
                        t.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {t.title}
                    </h3>
                    {t.notes && <p className="text-[11px] text-slate-500 mt-0.5">{t.notes}</p>}
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      {t.category}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded shrink-0">
                  {t.dueDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 4. GOOGLE CALENDAR VIEW ---------------- */}
      {activeTabSub === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Google Calendar • Campus Placement Schedule</h2>
              <p className="text-xs text-slate-500">Synced interview slots, mock test windows, and company pre-placement talks</p>
            </div>
            <button
              type="button"
              onClick={() => setCreateEventModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Event</span>
            </button>
          </div>

          <div className="space-y-3">
            {calendarEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex flex-col items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">{ev.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                        {ev.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        {ev.dateStr} • {ev.timeStr}
                      </span>
                      <span>📍 {ev.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {ev.meetLink && (
                    <a
                      href={ev.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1"
                    >
                      <span>Join Meet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 5. GOOGLE FORMS VIEW ---------------- */}
      {activeTabSub === 'forms' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Google Forms • Campus & Placement Surveys</h2>
              <p className="text-xs text-slate-500">Collect candidate preferences, peer interview feedback, and drive debrief data</p>
            </div>
            <button
              type="button"
              onClick={() => setCreateFormModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Form</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formsList.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      {f.status}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{f.responsesCount} responses</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.purpose}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Updated {f.lastResponseDate}</span>
                  <a
                    href={f.formUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:underline"
                  >
                    <span>View Form</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 6. GOOGLE CHAT VIEW ---------------- */}
      {activeTabSub === 'chat' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 border-r border-slate-100 pr-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Campus Spaces</h3>
            {chatSpaces.map((sp) => (
              <div
                key={sp.id}
                onClick={() => setSelectedSpaceId(sp.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all ${
                  selectedSpaceId === sp.id
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-900'
                    : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">{sp.displayName}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{sp.memberCount} members</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 truncate">{sp.lastMessage}</p>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 flex flex-col justify-between h-[380px]">
            <div className="overflow-y-auto space-y-3 p-2">
              {(chatMessages[selectedSpaceId] || []).map((msg, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 mb-1">
                    <span>{msg.author}</span>
                    <span className="text-slate-400 font-normal">{msg.time}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Post question or insight to this campus space..."
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInitiatePostChat();
                }}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 text-slate-900"
              />
              <button
                type="button"
                onClick={handleInitiatePostChat}
                disabled={!newChatText.trim()}
                className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-40 transition-colors cursor-pointer"
                title="Send to Google Chat Space"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 7. GOOGLE CLASSROOM VIEW ---------------- */}
      {activeTabSub === 'classroom' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Enrolled Semester Courses & Coursework</h2>
            <p className="text-xs text-slate-500">Synced directly with your university Google Classroom roster</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((crs) => (
              <div key={crs.id} className="p-4 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{crs.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{crs.section} • {crs.faculty}</p>

                  <div className="pt-3 border-t border-slate-100 mt-3 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Assignments & Labs</span>
                    {crs.assignments.map((asg) => (
                      <div key={asg.id} className="p-2 rounded-xl bg-slate-50 text-xs flex items-center justify-between">
                        <span className="text-slate-800 font-medium truncate max-w-[150px]">{asg.title}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                            asg.submitted ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {asg.dueDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Open in Classroom
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- MANDATORY CONFIRMATION DIALOG MODAL ---------------- */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-orange-600">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{confirmModal.title}</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {confirmModal.description}
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
              This operation executes through your authorized Google Workspace account. You retain full control to edit or revoke permissions at any time.
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, open: false })}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmModal({ ...confirmModal, open: false });
                  confirmModal.onConfirm();
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors cursor-pointer text-center shadow-xs"
              >
                {confirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose Email Modal */}
      {composeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Compose Placement Communication</h3>
            <form onSubmit={handleInitiateSendEmail} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">To</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Query Regarding TCS Digital Shortlist Slot Allocation"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Body</label>
                <textarea
                  rows={4}
                  placeholder="Write message to TPO / Recruiter..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setComposeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer"
                >
                  Proceed to Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Doc Modal */}
      {createDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create Career Google Doc</h3>
            <form onSubmit={handleInitiateCreateDoc} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Pratham_SDE_Resume"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Template Category</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50"
                >
                  <option value="Resume">Resume (Google XYZ Format)</option>
                  <option value="Interview Notes">Interview Revision Notes</option>
                  <option value="Project Spec">Capstone Project Spec</option>
                  <option value="Cover Letter">Statement of Purpose / Cover Letter</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateDocModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer"
                >
                  Create Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {createTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add to Google Tasks</h3>
            <form onSubmit={handleInitiateCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Review B+ Tree Indexing in DBMS"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50"
                  >
                    <option value="Placement">Placement</option>
                    <option value="Academics">Academics</option>
                    <option value="Skill Practice">Skill Practice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Tomorrow"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Calendar Event Modal */}
      {createEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Schedule in Google Calendar</h3>
            <form onSubmit={handleInitiateCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Qualcomm Virtual Interview Round 2"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50"
                  >
                    <option value="Interview">Interview</option>
                    <option value="Mock Test">Mock Test</option>
                    <option value="Campus Drive">Campus Drive</option>
                    <option value="Class Exam">Class Exam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Time Window</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Google Form Modal */}
      {createFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create Campus Google Form</h3>
            <form onSubmit={handleInitiateCreateForm} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Form Title</label>
                <input
                  type="text"
                  placeholder="e.g. Student Company Preference Survey"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Purpose / Description</label>
                <textarea
                  rows={3}
                  placeholder="What data is this form gathering?"
                  value={newFormPurpose}
                  onChange={(e) => setNewFormPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-slate-50"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer"
                >
                  Publish Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
