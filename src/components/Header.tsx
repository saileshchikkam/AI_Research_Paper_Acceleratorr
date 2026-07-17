import React from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../ThemeContext';

interface HeaderProps {
  activeTab: string;
  user: User;
  onToggleSidebar?: () => void;
}

export default function Header({ activeTab, user, onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Academic Command Center';
      case 'library': return 'My Research Library';
      case 'workspace': return 'AI Workspace';
      case 'analytics': return 'Analytics';
      case 'profile': return 'Scholar Profile';
      case 'settings': return 'Settings';
      case 'synthesis': return 'Literature Synthesis Matrix Studio';
      default: return 'ResearchMind AI';
    }
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    let timeGreeting = 'Welcome';
    if (hours < 12) timeGreeting = 'Good Morning';
    else if (hours < 18) timeGreeting = 'Good Afternoon';
    else timeGreeting = 'Good Evening';
    return `${timeGreeting}, ${user.name || 'Scholar'} 👋`;
  };

  return (
    <header className="bg-white/10 dark:bg-[#070a14]/30 backdrop-blur-3xl border-b border-slate-200/20 dark:border-slate-800/40 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-40" id="top_header_root">
      {/* Left Side: Title & Mobile Toggle */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 -ml-1 rounded-xl text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-slate-800/40 transition-all shrink-0 cursor-pointer"
            id="mobile_sidebar_toggle"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex flex-col justify-center min-w-0 text-left">
          <h2 className="font-display font-extrabold text-base sm:text-lg md:text-xl text-slate-950 dark:text-white tracking-tight leading-tight truncate">
            {getPageTitle()}
          </h2>
          {activeTab === 'dashboard' && (
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex items-center gap-1.5 truncate text-left" id="user_greeting_header">
              {getGreeting()}
            </p>
          )}
        </div>
      </div>

      {/* Right Side: Only Dark Mode Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-slate-800/40 rounded-xl transition-all shrink-0 cursor-pointer" 
          id="theme_toggle_header" 
          title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500 animate-pulse" />}
        </button>
      </div>
    </header>
  );
}
