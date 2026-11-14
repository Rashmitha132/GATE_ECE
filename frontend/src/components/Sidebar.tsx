import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Lightbulb, 
  Crosshair, 
  FileCheck2, 
  LineChart, 
  FolderKanban,
  LogOut,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { logout, user } = useAuth();

  const getNavItems = () => {
    if (user?.role === 'faculty') {
      return [
        { label: 'Faculty Portal', path: '/faculty', icon: GraduationCap },
        { label: 'Question Bank', path: '/practice', icon: Crosshair },
        { label: 'Mock Exams', path: '/tests', icon: FileCheck2 },
        { label: 'Curriculum & Syllabus', path: '/subjects', icon: BookOpen },
        { label: 'Study Resources', path: '/resources', icon: FolderKanban },
        { label: 'Batch Performance', path: '/performance', icon: LineChart },
      ];
    }
    if (user?.role === 'admin') {
      return [
        { label: 'Admin Governance', path: '/admin', icon: ShieldCheck },
        { label: 'Curriculum & Syllabus', path: '/subjects', icon: BookOpen },
        { label: 'Study Resources', path: '/resources', icon: FolderKanban },
      ];
    }
    return [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Curriculum & Syllabus', path: '/subjects', icon: BookOpen },
      { label: 'Learn', path: '/learn', icon: Lightbulb },
      { label: 'Practice', path: '/practice', icon: Crosshair },
      { label: 'Tests', path: '/tests', icon: FileCheck2 },
      { label: 'Performance', path: '/performance', icon: LineChart },
      { label: 'Resources', path: '/resources', icon: FolderKanban },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Responsive Sidebar Drawer */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 sm:w-64 bg-[#701a2b] text-white flex flex-col h-full shrink-0 shadow-2xl lg:shadow-xl select-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="p-5 sm:p-6 border-b border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-rose-950 flex items-center justify-center border border-rose-800 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif tracking-wide text-white leading-tight">GATE ECE</h2>
              <p className="text-[10px] text-rose-200 tracking-wider">
                {user?.role === 'faculty' ? 'Faculty Portal' : user?.role === 'admin' ? 'Admin Portal' : 'Learn • Practice • Achieve'}
              </p>
            </div>
          </div>

          {/* Close button on mobile only */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-rose-900/60 lg:hidden cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#500713] text-white shadow-md font-semibold border-l-4 border-amber-400 pl-3'
                      : 'text-rose-100/80 hover:bg-rose-900/50 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-rose-300" />
                  <span>{item.label}</span>
                </div>
                <span className="text-rose-400/60 text-xs">&rsaquo;</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Motivational / Role Graphic on Bottom Sidebar */}
        <div className="px-5 sm:px-6 py-4 mt-auto">
          <div className="relative rounded-xl overflow-hidden p-3.5 sm:p-4 border border-rose-800/60 bg-gradient-to-b from-[#8e2137]/60 to-[#500713]/80">
            <p className="font-serif italic text-amber-200/90 text-xs sm:text-sm leading-snug">
              {user?.role === 'faculty' ? '“Guiding Future Engineers”' : user?.role === 'admin' ? '“Institutional Excellence”' : '“Your GATE Journey Matters”'}
            </p>
            <div className="mt-1.5 text-[9px] sm:text-[10px] text-rose-200/70">
              {user?.role === 'faculty' ? 'GSSSIETW Faculty Management' : user?.role === 'admin' ? 'GSSSIETW Governance' : 'GSSSIETW Department of ECE'}
            </div>
          </div>

          {/* User logout action */}
          <div className="mt-3 sm:mt-4 pt-3 border-t border-rose-900/50 flex items-center justify-between text-xs text-rose-200">
            <div className="truncate max-w-[130px] sm:max-w-[140px]">
              <span className="font-medium text-white">{user?.full_name}</span>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-1 hover:text-white text-rose-300 transition cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
