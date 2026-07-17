import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, UserPlus, Mail, Lock, User as UserIcon, 
  Briefcase, ArrowRight, Sparkles, Loader2, KeyRound, ShieldAlert
} from 'lucide-react';

interface AuthCardProps {
  isLoginTab: boolean;
  setIsLoginTab: (isLogin: boolean) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  role: 'student' | 'professor' | 'researcher' | 'engineer';
  setRole: (val: 'student' | 'professor' | 'researcher' | 'engineer') => void;
  error: string;
  setError: (val: string) => void;
  successMessage: string;
  setSuccessMessage: (val: string) => void;
  loading: boolean;
  handleSeedLogin: (seedEmail: string) => Promise<void>;
  handleForgotPassword: () => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isHighlighted?: boolean;
}

export default function AuthCard({
  isLoginTab,
  setIsLoginTab,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  role,
  setRole,
  error,
  setError,
  successMessage,
  setSuccessMessage,
  loading,
  handleSeedLogin,
  handleForgotPassword,
  handleSubmit,
  isHighlighted = false
}: AuthCardProps) {
  // Focus States for glowing active input borders
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const seedAccounts = [
    { name: 'Aarav (Student)', email: 'aarav@university.edu', role: 'Student' },
    { name: 'Dr. Meera (Professor)', email: 'meera.iyer@university.edu', role: 'Professor' },
    { name: 'Rahul (ML Engineer)', email: 'rahul.ml@tech.co', role: 'Researcher' }
  ];

  return (
    <motion.div 
      animate={isHighlighted ? { 
        scale: 1.03, 
        boxShadow: "0 0 50px 20px rgba(16, 185, 129, 0.4)",
        borderColor: "rgba(16, 185, 129, 0.6)"
      } : { 
        scale: 1 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`w-full relative bg-white/25 dark:bg-[#070a14]/20 backdrop-blur-3xl border rounded-3xl overflow-hidden transition-all duration-500 group/card ${
        isHighlighted 
          ? 'border-emerald-500/80 shadow-[0_0_50px_20px_rgba(16,185,129,0.4)]' 
          : 'border-white/30 dark:border-slate-800/80 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.12)] hover:shadow-[0_40px_80px_-10px_rgba(16,185,129,0.15)] hover:border-white/40 dark:hover:border-slate-700/60'
      }`} 
      id="landing_auth_card_container"
    >
      {/* Liquid Shimmer Highlight overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 z-10" />
      
      {/* Dynamic sliding tab selection with Liquid Glass theme */}
      <div className="flex relative border-b border-slate-200/20 dark:border-slate-800/50 p-2.5 bg-white/10 dark:bg-slate-950/20" id="auth_tabs_container">
        {/* Slider background layer with Liquid Glass style */}
        <div 
          className="absolute top-2.5 bottom-2.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 border border-white/50 dark:border-slate-700/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-500 ease-out"
          style={{
            left: isLoginTab ? '10px' : 'calc(50% + 5px)',
            width: 'calc(50% - 15px)'
          }}
        />

        <button 
          type="button"
          onClick={() => { setIsLoginTab(true); setError(''); setSuccessMessage(''); }}
          className={`relative z-10 flex-1 py-3 text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${isLoginTab ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
          id="tab_login"
        >
          <LogIn className={`w-4 h-4 transition-transform duration-300 ${isLoginTab ? 'scale-110 text-emerald-500' : 'scale-100'}`} />
          Sign In
        </button>

        <button 
          type="button"
          onClick={() => { setIsLoginTab(false); setError(''); setSuccessMessage(''); }}
          className={`relative z-10 flex-1 py-3 text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${!isLoginTab ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
          id="tab_register"
        >
          <UserPlus className={`w-4 h-4 transition-transform duration-300 ${!isLoginTab ? 'scale-110 text-emerald-500' : 'scale-100'}`} />
          Register
        </button>
      </div>

      <div className="p-6 sm:p-9 relative z-20">
        
        {/* Status Messaging */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 p-4 bg-red-500/10 dark:bg-red-950/20 border border-red-500/20 dark:border-red-900/40 text-red-700 dark:text-red-400 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 shadow-inner"
              id="auth_error_container"
            >
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 p-4 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 shadow-inner"
              id="auth_success_container"
            >
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="popLayout">
            {!isLoginTab && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5 overflow-hidden"
                key="register_fields"
              >
                {/* Full Name */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <UserIcon className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'name' ? 'text-emerald-500 dark:text-emerald-400' : ''}`} />
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="e.g. Rahul Patel"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white/60 dark:bg-slate-950/60 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-300 shadow-inner ${
                        focusedField === 'name' 
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:ring-emerald-500/10' 
                          : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                      id="reg_name_input"
                    />
                  </div>
                </div>

                {/* Role / Field */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                    Your Role / Field
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <Briefcase className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'role' ? 'text-emerald-500 dark:text-emerald-400' : ''}`} />
                    </div>
                    <select 
                      value={role}
                      onChange={e => setRole(e.target.value as any)}
                      onFocus={() => setFocusedField('role')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-white/60 dark:bg-slate-950/60 text-sm text-slate-900 dark:text-slate-100 focus:outline-none transition-all duration-300 cursor-pointer appearance-none shadow-inner ${
                        focusedField === 'role' 
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:ring-emerald-500/10' 
                          : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                      id="reg_role_select"
                    >
                      <option value="student">Undergraduate / PG Student</option>
                      <option value="professor">Research Professor</option>
                      <option value="researcher">PhD Scholar / Scientist</option>
                      <option value="engineer">Machine Learning Engineer</option>
                    </select>
                    {/* Custom glass arrow icon */}
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Address */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Mail className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'email' ? 'text-emerald-500 dark:text-emerald-400' : ''}`} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="you@university.edu"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white/60 dark:bg-slate-950/60 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-300 shadow-inner ${
                  focusedField === 'email' 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:ring-emerald-500/10' 
                    : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                required
                id="email_input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                Password
              </label>
              {isLoginTab && (
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline hover:text-emerald-500 transition-colors font-black cursor-pointer flex items-center gap-1 font-mono"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Reset?
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'password' ? 'text-emerald-500 dark:text-emerald-400' : ''}`} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white/60 dark:bg-slate-950/60 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-300 shadow-inner ${
                  focusedField === 'password' 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:ring-emerald-500/10' 
                    : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                required
                id="password_input"
              />
            </div>
          </div>

          {/* Submission button with glass shimmer effect */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full relative overflow-hidden mt-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-600 hover:from-emerald-600 hover:via-cyan-600 hover:to-violet-700 text-white font-black uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-500 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
            id="submit_auth_btn"
          >
            {/* Shimmer element */}
            <div className="absolute inset-0 w-[30%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validating Session...</span>
              </>
            ) : (
              <>
                <span>{isLoginTab ? 'Sign In to Workspace' : 'Claim Free License'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 duration-300" />
              </>
            )}
          </button>
        </form>

        {/* Evaluator 1-Click login seeds with Liquid Glass style */}
        <div className="mt-8 pt-6 border-t border-slate-200/20 dark:border-slate-800/60 text-left" id="instant_login_container">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
              Evaluator 1-Click Access
            </h4>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {seedAccounts.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSeedLogin(acc.email)}
                disabled={loading}
                className="group w-full px-4.5 py-3.5 bg-white/35 hover:bg-emerald-500/5 dark:bg-slate-950/20 dark:hover:bg-emerald-950/20 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 text-left rounded-xl text-xs font-bold border border-white/20 dark:border-slate-800/80 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between cursor-pointer"
                id={`seed_login_btn_${idx}`}
              >
                <div className="flex flex-col text-left">
                  <span className="font-black text-slate-850 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {acc.name}
                  </span>
                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-mono mt-0.5">
                    {acc.email}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-white/60 dark:bg-slate-900/50 text-[9.5px] font-black font-mono border border-slate-200/30 dark:border-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-300 dark:group-hover:border-emerald-900/60 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all">
                  {acc.role}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
