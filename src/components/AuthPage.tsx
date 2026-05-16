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
  <div className="min-h-screen bg-[#0a1628] flex items-center justify-center relative overflow-hidden font-sans">
    {/* Background Decorative Elements */}
    <div className="absolute top-[-160px] right-[-100px] w-[500px] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute bottom-[-120px] left-[-80px] w-[380px] h-[380px] bg-brand-accent/5 blur-[100px] rounded-full pointer-events-none" />
    
    <button 
      onClick={() => setView('home')}
      className="fixed top-6 left-8 flex items-center gap-2 text-white/60 font-bold text-sm hover:text-white transition-colors"
    >
      <LayoutDashboard className="w-4 h-4 rotate-180" />
      Back to Home
    </button>

    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="bg-white w-full max-w-[450px] m-4 p-12 rounded-[32px] shadow-2xl relative z-10"
    >
      <div className="text-center font-display font-black text-xl tracking-tighter text-brand-ink mb-10">
        Skill<span className="text-brand-blue">toHire</span>
      </div>

      <h2 className="font-display font-extrabold text-3xl tracking-tight text-brand-ink leading-none">
        {type === 'login' ? 'Welcome back' : 'Create account'}
      </h2>
      <p className="text-brand-muted text-sm font-medium mt-2 mb-8">
        {type === 'login' ? 'Sign in to continue your journey' : 'Join thousands building their careers'}
      </p>

      {authError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 italic">
          {authError}
        </div>
      )}

      <button 
        onClick={handleGoogleLogin}
        className="w-full py-3.5 bg-white border border-slate-200 text-[#3c4043] rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-sm border-b-2"
      >
        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
        Continue with Google
      </button>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">or email interface</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      <form onSubmit={(e) => handleEmailAuth(e, type)} className="space-y-4">
        {type === 'register' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest pl-1">Full Name</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={authName}
              onChange={(e) => setAuthName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-brand-blue-light/30 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-blue transition-colors" 
            />
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest pl-1">Email Address</label>
          <input 
            type="email" 
            placeholder="you@example.com" 
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-brand-blue-light/30 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-blue transition-colors" 
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest pl-1">Password</label>
            {type === 'login' && <span className="text-[10px] font-bold text-brand-blue cursor-pointer hover:underline">Forgot?</span>}
          </div>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-brand-blue-light/30 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-blue transition-colors" 
          />
        </div>

        <button 
          type="submit"
          disabled={authLoading}
          className="w-full py-4 bg-brand-blue text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-100 hover:bg-brand-blue-dark transition-all active:scale-95 mt-4 disabled:opacity-50"
        >
          {authLoading ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div className="mt-8 text-center text-xs font-bold text-brand-muted">
        {type === 'login' ? (
          <>New here? <span onClick={() => setView('register')} className="text-brand-blue cursor-pointer hover:underline">Create an account</span></>
        ) : (
          <>Already have an account? <span onClick={() => setView('login')} className="text-brand-blue cursor-pointer hover:underline">Sign in</span></>
        )}
      </div>
    </motion.div>
  </div>
);

export default AuthPage;
