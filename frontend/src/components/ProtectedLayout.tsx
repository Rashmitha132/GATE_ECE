import React, { useState, useRef, useEffect } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { InstitutionalFooter } from './InstitutionalFooter';
import { useAuth } from '../context/AuthContext';
import { Bell, Check, BookOpen, Layers, FileCheck2, FolderKanban, X, Menu } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  path: string;
  iconName: 'layers' | 'book' | 'test' | 'resource';
  isRead: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '1,040 Authentic GATE Questions Live',
    description: 'PYQs across all 10 subjects with step-by-step derivations now active in Question Bank.',
    path: '/practice',
    iconName: 'layers',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'Official GATE ECE Syllabus Available',
    description: 'Download subject-wise PDFs and Master Syllabus in Curriculum & Syllabus.',
    path: '/subjects',
    iconName: 'book',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'Sunday Mock Exam Simulation Ready',
    description: '65-question timed mock test is open under Mock Exams.',
    path: '/tests',
    iconName: 'test',
    isRead: false
  },
  {
    id: 'notif-4',
    title: 'Formula Sheets & Study Notes Updated',
    description: 'Review Sedra & Smith notes and GATE solved papers in Study Resources.',
    path: '/resources',
    iconName: 'resource',
    isRead: false
  }
];

export const ProtectedLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('gate_notifications_state');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_NOTIFICATIONS;
  });
  const notificationRef = useRef<HTMLDivElement>(null);

  // Dynamic Browser Tab Title based on active page
  useEffect(() => {
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard • GSSSIETW GATE ECE',
      '/subjects': 'Curriculum & Syllabus • GSSSIETW GATE ECE',
      '/learn': 'Learn Concepts • GSSSIETW GATE ECE',
      '/practice': 'Question Bank & Practice • GSSSIETW GATE ECE',
      '/tests': 'Mock Exams & Tests • GSSSIETW GATE ECE',
      '/performance': 'Performance Analytics • GSSSIETW GATE ECE',
      '/resources': 'Study Resources • GSSSIETW GATE ECE',
      '/faculty': 'Faculty Portal • GSSSIETW GATE ECE',
      '/admin': 'Admin Governance • GSSSIETW GATE ECE'
    };
    document.title = titles[location.pathname] || 'GSSSIETW • GATE ECE Platform';
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    try {
      localStorage.setItem('gate_notifications_state', JSON.stringify(updated));
    } catch {}
  };

  const markSingleAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    try {
      localStorage.setItem('gate_notifications_state', JSON.stringify(updated));
    } catch {}
    setShowNotifications(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#faf7f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#701a2b] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-stone-600">Loading GATE ECE Platform...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen w-screen flex bg-[#faf7f5] overflow-hidden relative">
      {/* Responsive Left Sidebar Drawer */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Workspace with Compact Top User Profile Bar and Scrollable Page View */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden w-full">
        {/* Sleek Authenticated Top Bar */}
        <header className="h-14 bg-white border-b border-rose-100/80 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1 rounded-lg text-stone-700 hover:bg-rose-50 hover:text-[#701a2b] lg:hidden cursor-pointer transition"
              title="Open menu"
            >
              <Menu className="w-5 h-5 text-[#701a2b]" />
            </button>
            <span className="text-xs uppercase font-semibold text-[#8e2137] tracking-wider hidden sm:inline">
              GSSSIETW &bull; ECE Department
            </span>
            <span className="text-xs font-bold text-[#701a2b] font-serif sm:hidden">
              GATE ECE
            </span>
          </div>

          {/* User Profile & Notification area */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button 
                type="button"
                onClick={() => setShowNotifications((prev) => !prev)}
                title="Notifications"
                className="relative p-2 rounded-full hover:bg-rose-50 text-stone-600 transition cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-rose-100 z-50 overflow-hidden animate-in fade-in duration-150">
                  <div className="p-3.5 bg-gradient-to-r from-[#500713] to-[#701a2b] text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-amber-300" />
                      <span className="font-serif font-bold text-xs">Department Notifications</span>
                      <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-sans">
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-rose-200 hover:text-white p-0.5 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-2 divide-y divide-stone-100 max-h-80 overflow-y-auto text-xs">
                    {notifications.map((item) => {
                      const Icon = 
                        item.iconName === 'layers' ? Layers :
                        item.iconName === 'book' ? BookOpen :
                        item.iconName === 'test' ? FileCheck2 : FolderKanban;
                      
                      const iconBg = 
                        item.iconName === 'layers' ? 'bg-emerald-50 text-emerald-700' :
                        item.iconName === 'book' ? 'bg-rose-50 text-[#701a2b]' :
                        item.iconName === 'test' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700';

                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          onClick={() => markSingleAsRead(item.id)}
                          className={`p-2.5 rounded-xl flex items-start justify-between gap-3 transition block ${
                            item.isRead 
                              ? 'opacity-60 hover:opacity-100 hover:bg-stone-50' 
                              : 'bg-rose-50/40 hover:bg-rose-50/70'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <p className={`text-[11px] leading-snug ${item.isRead ? 'font-medium text-stone-600' : 'font-bold text-stone-900'}`}>
                                {item.title}
                              </p>
                              <p className="text-[10px] text-stone-500 leading-tight">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {!item.isRead ? (
                            <span className="w-2 h-2 rounded-full bg-[#701a2b] shrink-0 mt-1.5" title="Unread"></span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-semibold shrink-0 mt-0.5 flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Read
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="p-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="text-stone-400 text-[10px]">GSSSIETW Department of ECE</span>
                    {unreadCount > 0 ? (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-[#701a2b] hover:text-[#500713] font-bold hover:underline flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mark all as read</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                        <Check className="w-3 h-3" /> All caught up!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
              <div className="w-8 h-8 rounded-full bg-[#701a2b] text-white flex items-center justify-center font-bold text-xs ring-2 ring-rose-100 select-none">
                {user.full_name?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div className="text-left hidden md:block">
                <div className="font-semibold text-stone-800 leading-tight text-xs">{user.full_name}</div>
                <div className="text-[10px] text-gray-500">
                  {user.role === 'faculty' ? 'Faculty • Department of ECE' :
                   user.role === 'admin' ? 'Administrator • Governance' :
                   'Student • GATE Aspirant'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content with Sticky/Natural Bottom Footer */}
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="p-6 md:p-8 flex-1">
            <Outlet />
          </div>
          <InstitutionalFooter />
        </main>
      </div>
    </div>
  );
};
