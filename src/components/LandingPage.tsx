import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, ArrowRight, Award, Compass, 
  FileText, MessageSquare, Layers, HelpCircle, Network, Eye, Library 
} from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../ThemeContext';

// Import our redesigned subcomponents
import LandingHeader from './landing/LandingHeader';
import InteractiveBackground from './landing/InteractiveBackground';
import FeaturesSection from './landing/FeaturesSection';
import WhySection from './landing/WhySection';
import AuthCard from './landing/AuthCard';

interface LandingPageProps {
  onLoginSuccess: (user: User) => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'professor' | 'researcher' | 'engineer'>('student');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthHighlighted, setIsAuthHighlighted] = useState(false);

  const authSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToAuth = () => {
    authSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setIsAuthHighlighted(true);
    setTimeout(() => {
      setIsAuthHighlighted(false);
    }, 1200);
  };

  const scrollToFeatures = () => {
    document.getElementById('landing_features_section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Keep original auth & login/register functionality EXACTLY
  const handleSeedLogin = async (seedEmail: string) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: seedEmail, password: 'password' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem('researchmind_token', data.token);
        }
        onLoginSuccess(data.user);
      } else {
        setError(data.message || data.error || 'Login failed');
      }
    } catch (err) {
      setError('Could not connect to full-stack server.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first to reset your password.');
      return;
    }
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(data.message || `A password reset link has been successfully sent to ${email}`);
      } else {
        setError(data.message || 'Could not send password reset email.');
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError('Could not connect to full-stack server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isLoginTab) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.token) {
            localStorage.setItem('researchmind_token', data.token);
          }
          onLoginSuccess(data.user);
        } else {
          setError(data.message || data.error || 'Invalid credentials.');
        }
      } else {
        if (!name || !email || !password) {
          setError('Name, email, and password are required');
          setLoading(false);
          return;
        }
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          if (data.token) {
            localStorage.setItem('researchmind_token', data.token);
          }
          setSuccessMessage('Account created successfully!');
          onLoginSuccess(data.user);
        } else {
          setError(data.message || data.error || 'Registration failed.');
        }
      }
    } catch (err: any) {
      console.error("Auth error caught:", err);
      setError('Could not establish server database connection.');
    } finally {
      setLoading(false);
    }
  };

  // Animated feature badges list matching the emerald-cyan-violet aurora palette
  const badgesList = [
    { label: 'AI Summary', icon: <FileText className="w-3.5 h-3.5" />, color: 'from-emerald-500/10 to-cyan-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15' },
    { label: 'AI Chat', icon: <MessageSquare className="w-3.5 h-3.5" />, color: 'from-cyan-500/10 to-violet-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/15' },
    { label: 'Flashcards', icon: <Layers className="w-3.5 h-3.5" />, color: 'from-violet-500/10 to-fuchsia-500/10 text-violet-600 dark:text-violet-400 border-violet-500/15' },
    { label: 'Quiz Generator', icon: <HelpCircle className="w-3.5 h-3.5" />, color: 'from-fuchsia-500/10 to-rose-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/15' },
    { label: 'Mind Maps', icon: <Network className="w-3.5 h-3.5" />, color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-teal-400 border-emerald-500/15' },
    { label: 'Research Insights', icon: <Eye className="w-3.5 h-3.5" />, color: 'from-amber-500/10 to-rose-500/10 text-amber-600 dark:text-amber-400 border-amber-500/15' },
    { label: 'Comparative Analysis', icon: <Library className="w-3.5 h-3.5" />, color: 'from-rose-500/10 to-violet-500/10 text-rose-600 dark:text-rose-400 border-rose-500/15' }
  ];

  return (
    <div 
      className="min-h-screen bg-slate-50 dark:bg-[#070a13] text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between transition-colors duration-500 relative overflow-x-hidden pt-20 lg:pt-28" 
      id="landing_page_root"
    >
      {/* 1. Liquid Glass Dynamic Canvas Background with spot follow */}
      <InteractiveBackground />

      {/* 2. Frosted Premium Nav Header */}
      <LandingHeader 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onGetStartedClick={scrollToAuth} 
      />

      {/* 3. Hero Section & Liquid Glass Registration Panel - Compact and balanced layout */}
      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-2 sm:py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10 w-full" id="landing_main">
        
        {/* Left Column: Brand Statement, Subtitle, description & Animated Badges */}
        <div className="lg:col-span-7 space-y-6 text-left lg:pt-2" id="landing_marketing_pane">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/20 shadow-md backdrop-blur-sm">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Advanced Research Paper Accelerator v2.5</span>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl text-slate-950 dark:text-white tracking-tight leading-[1.05]">
              ResearchMind <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-600">AI</span>
            </h2>
            
            <p className="font-display font-extrabold text-xl sm:text-2xl lg:text-3.5xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-violet-400 tracking-tight leading-snug">
              Understand Research Papers Faster with AI
            </p>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-medium">
              Upload complex research articles and instantly receive hyper-structured AI summaries, grounded chats with precise citation mapping, quizzes, flashcards, visual networks, and automated literature reviews.
            </p>
          </div>

          {/* Micro-interactive animated feature badges exactly as specified */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
              Core Intelligence Engines
            </h4>
            
            <div className="flex flex-wrap gap-2.5 max-w-2xl" id="hero_animated_badges">
              {badgesList.map((badge, idx) => (
                <div
                  key={idx}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border bg-gradient-to-r ${badge.color} shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none`}
                >
                  <span className="shrink-0">{badge.icon}</span>
                  <span className="text-xs font-black tracking-wide">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={scrollToAuth}
              className="group px-7 py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-600 hover:from-emerald-600 hover:via-cyan-600 hover:to-violet-700 text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-500 flex items-center gap-2.5 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1.5 duration-300" />
            </button>

            <button
              onClick={scrollToFeatures}
              className="px-7 py-4 bg-white/40 dark:bg-slate-900/30 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-black uppercase tracking-wider text-xs sm:text-sm rounded-xl border border-slate-200/50 dark:border-slate-800/80 hover:border-emerald-200 dark:hover:border-emerald-900 shadow-sm backdrop-blur-sm transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4.5 h-4.5" />
              <span>Explore Features</span>
            </button>
          </div>

        </div>

        {/* Right Column: Redesigned Elevated Glassmorphic Input Form - Perfectly aligned */}
        <div 
          ref={authSectionRef}
          className="lg:col-span-5 w-full flex flex-col gap-4 -mt-2 sm:-mt-4 lg:mt-0" 
          id="landing_form_pane"
        >
          <AuthCard 
            isLoginTab={isLoginTab}
            setIsLoginTab={setIsLoginTab}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            name={name}
            setName={setName}
            role={role}
            setRole={setRole}
            error={error}
            setError={setError}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
            loading={loading}
            handleSeedLogin={handleSeedLogin}
            handleForgotPassword={handleForgotPassword}
            handleSubmit={handleSubmit}
            isHighlighted={isAuthHighlighted}
          />

          <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 px-4 font-mono leading-relaxed" id="landing_footer_credits">
            Secure, tokenless server-side indexing. Zero browser leaks of active model secrets guaranteed.
          </div>
        </div>

      </main>

      {/* 4. Beautiful Feature Matrix Grid */}
      <FeaturesSection onFeatureClick={scrollToAuth} />

      {/* 5. Performance Comparison Matrix */}
      <WhySection onBenefitClick={scrollToAuth} />

      {/* 6. High-end Footer Bar */}
      <footer className="border-t border-slate-200/40 dark:border-slate-800/60 bg-white/40 dark:bg-[#090d19]/40 backdrop-blur-xl py-10 px-6 text-center text-xs text-slate-400 dark:text-slate-500 font-mono relative z-10" id="landing_copyright_footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <span>© 2026 ResearchMind AI. Developed under Final Year Capstone CSE guidelines.</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">Security Policy</span>
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">API Grounding v2.5</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
