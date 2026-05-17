import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard } from 'lucide-react';

interface AuthPageProps {
  type: 'login' | 'register';
  setView: (view: 'home' | 'login' | 'register') => void;
  authEmail: string;
  setAuthEmail: (e: string) => void;
  authPassword: string;
  setAuthPassword: (p: string) => void;
  authName: string;
  setAuthName: (n: string) => void;
  authError: string | null;
  authLoading: boolean;
  handleGoogleLogin: () => void;
  handleEmailAuth: (e: React.FormEvent, type: 'login' | 'register') => void;
}

const AuthPage = ({ 
  type, 
  setView, 
  authEmail, 
  setAuthEmail, 
  authPassword, 
  setAuthPassword, 
  authName, 
  setAuthName, 
  authError, 
  authLoading, 
  handleGoogleLogin, 
  handleEmailAuth 
}: AuthPageProps) => (
  <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center relative overflow-hidden font-sans">
    {/* Background Decorative Elements */}
    <div className="absolute top-[-160px] right-[-100px] w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute bottom-[-120px] left-[-80px] w-[380px] h-[380px] bg-brand-blue/10 blur-[100px] rounded-full pointer-events-none" />
    
    <button 
      onClick={() => setView('home')}
      className="fixed top-8 left-8 flex items-center gap-2 text-brand-ink/60 font-bold text-sm hover:text-brand-blue transition-colors px-4 py-2 border border-brand-border rounded-full bg-white shadow-sm"
    >
      <LayoutDashboard className="w-4 h-4 rotate-180" />
      Return Home
    </button>

    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="bg-white w-full max-w-[450px] m-4 p-12 rounded-[40px] shadow-[0_20px_50px_rgba(26,110,245,0.08)] relative z-10 border border-brand-border/40"
    >
      <div className="text-center font-display font-extrabold text-[22px] tracking-tight text-brand-blue-heading mb-10">
        Skill<span className="text-brand-blue">toHire</span>
      </div>

      <h2 className="font-display font-extrabold text-[32px] tracking-tight text-brand-blue-heading leading-tight mb-2">
        {type === 'login' ? 'Welcome back' : 'Create account'}
      </h2>
      <p className="text-brand-muted text-[15px] font-medium mb-10 leading-relaxed">
        {type === 'login' ? 'Continue your precision learning path.' : 'Start engineering your career with AI.'}
      </p>

      {authError && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-in fade-in slide-in-from-top-4">
          {authError}
        </div>
      )}

      <button 
        onClick={handleGoogleLogin}
        className="w-full py-4 bg-white border border-brand-border text-brand-ink rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-sm hover:shadow-md"
      >
        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
        <span className="text-[14px]">Sign in with Google</span>
      </button>

      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-brand-border/60" />
        <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">OR EMAIL</span>
        <div className="flex-1 h-px bg-brand-border/60" />
      </div>

      <form onSubmit={(e) => handleEmailAuth(e, type)} className="space-y-6">
        {type === 'register' && (
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-brand-blue-heading uppercase tracking-widest pl-1">Name</label>
            <input 
              type="text" 
              placeholder="Elon Musk" 
              value={authName}
              onChange={(e) => setAuthName(e.target.value)}
              required
              className="w-full px-5 py-4 bg-brand-cream/50 border border-brand-border rounded-2xl font-medium outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all text-[14px]" 
            />
          </div>
        )}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-brand-blue-heading uppercase tracking-widest pl-1">Work Email</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            required
            className="w-full px-5 py-4 bg-brand-cream/50 border border-brand-border rounded-2xl font-medium outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all text-[14px]" 
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-brand-blue-heading uppercase tracking-widest pl-1">Password</label>
            {type === 'login' && <span className="text-[11px] font-bold text-brand-blue cursor-pointer hover:underline">Forgot?</span>}
          </div>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            required
            className="w-full px-5 py-4 bg-brand-cream/50 border border-brand-border rounded-2xl font-medium outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all text-[14px]" 
          />
        </div>

        <button 
          type="submit"
          disabled={authLoading}
          className="w-full py-4.5 bg-brand-blue text-white rounded-2xl font-bold text-[15px] shadow-[0_15px_30px_-10px_rgba(26,110,245,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(26,110,245,0.5)] transition-all active:scale-95 mt-6 disabled:opacity-50"
        >
          {authLoading ? 'Verifying...' : (type === 'login' ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div className="mt-10 text-center text-[14px] font-semibold text-brand-muted">
        {type === 'login' ? (
          <>New candidate? <span onClick={() => setView('register')} className="text-brand-blue cursor-pointer hover:underline font-bold">Apply for account</span></>
        ) : (
          <>Member already? <span onClick={() => setView('login')} className="text-brand-blue cursor-pointer hover:underline font-bold">Sign in here</span></>
        )}
      </div>
    </motion.div>
  </div>
);

export default AuthPage;
