import React from 'react';
import { 
  LayoutDashboard, Library, Brain, TrendingUp, User as UserIcon, Settings, 
  LogOut
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'library', label: 'My Library', icon: Library },
    { id: 'workspace', label: 'AI Workspace', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Sidebar Backdrop Overlay on Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onClose}
          id="sidebar_backdrop"
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/20 dark:bg-[#070a14]/35 backdrop-blur-3xl text-slate-800 dark:text-slate-300 border-r border-slate-200/20 dark:border-slate-800/40 flex flex-col justify-between h-screen lg:sticky lg:top-0 shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`} 
        id="sidebar_root"
      >
        {/* Brand Section */}
        <div className="p-6 border-b border-slate-200/10 dark:border-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 via-cyan-500 to-violet-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 animate-[pulse_3s_infinite]" />
            </div>
            <div className="overflow-hidden">
              <h2 className="font-display font-extrabold text-base tracking-tight text-slate-900 dark:text-white truncate">ResearchMind AI</h2>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono tracking-widest uppercase mt-0.5">V1.0 Capstone</p>
            </div>
          </div>
          {/* Close button on Mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-colors"
            title="Close sidebar"
            id="sidebar_close_btn"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav List */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto" id="sidebar_nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group text-left ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500 shadow-sm' 
                    : 'hover:bg-slate-200/40 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400'
                }`}
                id={`sidebar_tab_${item.id}`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-all duration-300 group-hover:scale-110 ${isActive ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info / Logout Section */}
        <div className="p-4 border-t border-slate-200/10 dark:border-slate-800/40 bg-slate-200/10 dark:bg-slate-950/20" id="sidebar_user_footer">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'} 
              alt={user.name} 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/20"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate leading-snug">{user.name}</h4>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize font-medium">{user.role}</p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-all text-left cursor-pointer"
            id="logout_btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            Terminate Session
          </button>
        </div>
      </aside>
    </>
  );
}
