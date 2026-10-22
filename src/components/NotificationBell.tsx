import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { db, auth } from '../lib/firebase';
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  Bell,
  Clock,
  Briefcase,
  Calendar,
  CheckCircle,
  X,
  AlertCircle,
  Plus,
  Trash2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export interface AlertNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'internship_deadline' | 'test_reminder' | 'milestone' | 'system';
  dueDate?: string;
  isRead: boolean;
  linkTab?: string;
  createdAt?: string;
}

const DEFAULT_ALERTS: AlertNotification[] = [
  {
    id: 'alert-1',
    title: 'Google SWE Summer Internship 2026',
    message: 'Application deadline is in 3 days! Complete your ATS resume and submit referral codes.',
    type: 'internship_deadline',
    dueDate: 'In 3 Days (Oct 25)',
    isRead: false,
    linkTab: 'internships',
    createdAt: 'Today, 09:30 AM',
  },
  {
    id: 'alert-2',
    title: 'TCS NQT National Placement Mock',
    message: 'Upcoming full-length diagnostic test scheduled tomorrow at 10:00 AM. Review Quantitative & Reasoning.',
    type: 'test_reminder',
    dueDate: 'Tomorrow at 10:00 AM',
    isRead: false,
    linkTab: 'practice',
    createdAt: 'Yesterday',
  },
  {
    id: 'alert-3',
    title: 'Microsoft Engage Mentorship Program',
    message: 'Final project submission portal closing this Friday. Check required GitHub links.',
    type: 'internship_deadline',
    dueDate: 'In 5 Days',
    isRead: false,
    linkTab: 'internships',
    createdAt: '2 days ago',
  },
  {
    id: 'alert-4',
    title: 'DSA 15-Day Problem Streak Pending',
    message: 'Solve 1 Medium difficulty problem today to maintain your 14-day daily practice streak.',
    type: 'test_reminder',
    dueDate: 'Due Tonight 11:59 PM',
    isRead: true,
    linkTab: 'practice',
    createdAt: '3 days ago',
  },
];

export const NotificationBell: React.FC = () => {
  const { setActiveTab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'deadlines' | 'tests'>('all');
  const [notifications, setNotifications] = useState<AlertNotification[]>(DEFAULT_ALERTS);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState<'internship_deadline' | 'test_reminder'>('internship_deadline');
  const [newDueDate, setNewDueDate] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentUid = auth.currentUser?.uid;

  // Listen to Firestore if authenticated, or use synchronized state
  useEffect(() => {
    if (!currentUid) {
      const stored = localStorage.getItem('yukti_alerts');
      if (stored) {
        try {
          setNotifications(JSON.parse(stored));
        } catch {
          // ignore error
        }
      }
      return;
    }

    try {
      const notifsRef = collection(db, 'users', currentUid, 'notifications');
      const q = query(notifsRef);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: AlertNotification[] = [];
          snapshot.forEach((docSnap) => {
            remoteList.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          setNotifications(remoteList);
        } else {
          // Seed defaults into firestore for this user
          DEFAULT_ALERTS.forEach(async (item) => {
            const itemRef = doc(db, 'users', currentUid, 'notifications', item.id);
            await setDoc(itemRef, { ...item, userId: currentUid, createdAt: new Date().toISOString() });
          });
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore notification sync error:', err);
    }
  }, [currentUid]);

  // Save to localStorage when offline
  const persistLocally = (list: AlertNotification[]) => {
    setNotifications(list);
    localStorage.setItem('yukti_alerts', JSON.stringify(list));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    persistLocally(updated);

    if (currentUid) {
      try {
        const notifRef = doc(db, 'users', currentUid, 'notifications', id);
        await updateDoc(notifRef, { isRead: true });
      } catch (err) {
        console.warn('Firestore update error:', err);
      }
    }
  };

  const handleMarkAllRead = async () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    persistLocally(updated);

    if (currentUid) {
      try {
        for (const notif of notifications) {
          if (!notif.isRead) {
            const notifRef = doc(db, 'users', currentUid, 'notifications', notif.id);
            await updateDoc(notifRef, { isRead: true });
          }
        }
      } catch (err) {
        console.warn('Firestore mark all read error:', err);
      }
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    persistLocally(updated);

    if (currentUid) {
      try {
        const notifRef = doc(db, 'users', currentUid, 'notifications', id);
        await deleteDoc(notifRef);
      } catch (err) {
        console.warn('Firestore delete error:', err);
      }
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAlert: AlertNotification = {
      id: `alert-${Date.now()}`,
      userId: currentUid,
      title: newTitle,
      message: newMessage || 'Personal reminder for upcoming milestone.',
      type: newType,
      dueDate: newDueDate || 'Soon',
      isRead: false,
      linkTab: newType === 'internship_deadline' ? 'internships' : 'practice',
      createdAt: 'Just now',
    };

    const updated = [newAlert, ...notifications];
    persistLocally(updated);

    if (currentUid) {
      try {
        const notifRef = doc(db, 'users', currentUid, 'notifications', newAlert.id);
        await setDoc(notifRef, { ...newAlert, createdAt: new Date().toISOString() });
      } catch (err) {
        console.warn('Firestore add alert error:', err);
      }
    }

    setNewTitle('');
    setNewMessage('');
    setNewDueDate('');
    setIsAddingReminder(false);
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'deadlines') return item.type === 'internship_deadline';
    if (activeFilter === 'tests') return item.type === 'test_reminder';
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
        title="View Deadline Alerts & Test Reminders"
        aria-label="Notification Bell"
      >
        <Bell className="w-4 h-4 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[90vw] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold">Deadlines & Test Reminders</h3>
                <span className="text-[10px] text-slate-300">
                  {unreadCount > 0 ? `${unreadCount} new alerts pending` : 'All caught up'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-medium text-indigo-200 hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Mark read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills & Add Button */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('deadlines')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'deadlines'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Internships
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('tests')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'tests'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Mock Tests
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingReminder(!isAddingReminder)}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200 shadow-2xs hover:bg-indigo-50 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>{isAddingReminder ? 'Cancel' : 'Add'}</span>
            </button>
          </div>

          {/* Add Reminder Form */}
          {isAddingReminder && (
            <form onSubmit={handleCreateReminder} className="p-3 bg-indigo-50/60 border-b border-indigo-100 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block text-[11px]">Set Custom Alert / Reminder</span>
              <input
                type="text"
                placeholder="Title (e.g. Amazon WOW Drive, TCS NQT Mock)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                >
                  <option value="internship_deadline">Internship Deadline</option>
                  <option value="test_reminder">Practice Test Reminder</option>
                </select>
                <input
                  type="text"
                  placeholder="Date (e.g. Oct 28 at 2 PM)"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Save to Firestore Alerts
              </button>
            </form>
          )}

          {/* Alert Items List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No pending alerts</p>
                <p className="text-[11px] text-slate-400 mt-0.5">You are up to date on all internship deadlines and mocks.</p>
              </div>
            ) : (
              filteredNotifications.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => {
                    if (alert.linkTab) setActiveTab(alert.linkTab);
                    setIsOpen(false);
                  }}
                  className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 relative ${
                    !alert.isRead ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  {/* Category Icon */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      alert.type === 'internship_deadline'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                    }`}
                  >
                    {alert.type === 'internship_deadline' ? (
                      <Briefcase className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>

                  {/* Text details */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 truncate">{alert.title}</span>
                      {!alert.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Unread" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                      {alert.dueDate && (
                        <span className="font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          {alert.dueDate}
                        </span>
                      )}
                      <span>{alert.createdAt}</span>
                    </div>
                  </div>

                  {/* Delete / Dismiss */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(alert.id, e)}
                    className="text-slate-300 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60 transition-colors cursor-pointer"
                    title="Dismiss alert"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Synced in real-time with your Cloud Firestore account
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
