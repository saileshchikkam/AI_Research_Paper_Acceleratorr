import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Sun, Moon } from 'lucide-react';

interface LandingHeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onGetStartedClick: () => void;
}

export default function LandingHeader({ theme, toggleTheme, onGetStartedClick }: LandingHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed left-0 right-0 z-50 transition-all duration-500 flex items-center justify-between ${
        scrolled 
          ? 'top-4 mx-auto w-[92%] max-w-7xl rounded-2xl bg-white/45 dark:bg-slate-900/45 backdrop-blur-3xl border border-white/25 dark:border-slate-800/80 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.3)] py-3 px-6' 
          : 'top-0 w-full bg-transparent border-b border-transparent py-6 px-8'
      }`} 
      id="landing_header"
    >
      <div className="w-full flex items-center justify-between">
        
        {/* Brand logo & tag */}
        <div className="flex items-center gap-3.5 select-none">
          <div className="bg-gradient-to-tr from-emerald-400 via-cyan-500 to-violet-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center">
            <Brain className="w-5.5 h-5.5 animate-pulse" />
          </div>
          <div className="text-left">
            <h1 className="font-display font-black text-lg sm:text-xl tracking-tight text-slate-950 dark:text-white leading-none">
              ResearchMind <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-violet-500 dark:from-emerald-400 dark:to-cyan-400">AI</span>
            </h1>
            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase mt-1">
              Research Paper Accelerator
            </p>
          </div>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/15">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-amber-500" />
            Gemini 2.5 Active
          </span>

          {/* Get started link */}
          <button
            onClick={onGetStartedClick}
            className="hidden sm:inline-flex px-4.5 py-2 text-xs font-black uppercase tracking-wider text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-white/60 dark:hover:bg-slate-950/60 transition-all duration-300 shadow-sm cursor-pointer"
          >
            Access Workspace
          </button>

          {/* Theme switcher */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-slate-900 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-950/20" 
            id="theme_toggle_landing" 
            title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400 animate-pulse" />}
          </button>
        </div>

      </div>
    </header>
  );
}
