import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, GraduationCap, Briefcase } from 'lucide-react';
import { UserRole } from '../types';
import { cn } from '../lib/utils';

interface AuthPageProps {
  type: 'login' | 'register';
  setView: (view: 'home' | 'login' | 'register') => void;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
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
  selectedRole,
  setSelectedRole,
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
      className="bg-white w-full max-w-[480px] m-4 p-8 sm:p-12 rounded-[40px] shadow-[0_20px_50px_rgba(26,110,245,0.08)] relative z-10 border border-brand-border/40"
    >
      <div className="flex items-center justify-center gap-2 mb-8">
        <img src="/logo.svg" alt="Skill to Hire Logo" className="w-8 h-8 rounded-xl shadow-md shadow-blue-200" />
        <div className="text-center font-display font-extrabold text-[22px] tracking-tight text-brand-blue-heading">
          Skill<span className="text-brand-blue">toHire</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="font-display font-extrabold text-[28px] sm:text-[32px] tracking-tight text-brand-blue-heading leading-tight mb-2">
          {type === 'login' 
            ? (selectedRole === 'student' ? 'Student Sign In' : 'Employee Sign In') 
            : (selectedRole === 'student' ? 'Create Student Account' : 'Create Employee Account')
          }
        </h2>
        <p className="text-brand-muted text-[14px] font-medium leading-relaxed">
          {selectedRole === 'student'
            ? 'Access AI career roadmaps, voice interviews & verified jobs.'
            : 'Post verified fresher openings & recruit top campus talent.'
          }
        </p>
      </div>

      {/* Role Selection Switch */}
      <div className="mb-8">
        <label className="text-[11px] font-bold text-brand-blue-heading uppercase tracking-widest block mb-2 text-center">
          Choose Account Type
        </label>
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={cn(
              "py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all",
              selectedRole === 'student'
                ? "bg-white text-brand-blue shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Login as Student</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('employee')}
            className={cn(
              "py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all",
              selectedRole === 'employee'
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Briefcase className="w-4 h-4" />
            <span>Login as Employee</span>
          </button>
        </div>
      </div>

      {authError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-in fade-in slide-in-from-top-4">
          {authError}
        </div>
      )}

      <button 
        onClick={handleGoogleLogin}
        className="w-full py-4 bg-white border border-brand-border text-brand-ink rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-sm hover:shadow-md"
      >
        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
        <span className="text-[14px]">
          Sign in with Google ({selectedRole === 'student' ? 'Student' : 'Employee'})
        </span>
      </button>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-brand-border/60" />
        <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">OR EMAIL</span>
        <div className="flex-1 h-px bg-brand-border/60" />
      </div>

      <form onSubmit={(e) => handleEmailAuth(e, type)} className="space-y-5">
        {type === 'register' && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-brand-blue-heading uppercase tracking-widest pl-1">
              {selectedRole === 'student' ? 'Full Name' : 'Employee / Recruiter Name'}
            </label>
            <input 
              type="text" 
              placeholder={selectedRole === 'student' ? 'Sneha Singh' : 'Talent Acquisition Partner'} 
              value={authName}
              onChange={(e) => setAuthName(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-brand-cream/50 border border-brand-border rounded-2xl font-medium outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all text-[14px]" 
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-brand-blue-heading uppercase tracking-widest pl-1">
            {selectedRole === 'student' ? 'Student Email' : 'Official / Corporate Email'}
          </label>
          <input 
            type="email" 
            placeholder={selectedRole === 'student' ? 'student@university.edu' : 'recruiter@company.com'} 
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            required
            className="w-full px-5 py-3.5 bg-brand-cream/50 border border-brand-border rounded-2xl font-medium outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all text-[14px]" 
          />
        </div>

        <div className="space-y-1.5">
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
            className="w-full px-5 py-3.5 bg-brand-cream/50 border border-brand-border rounded-2xl font-medium outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all text-[14px]" 
          />
        </div>

        <button 
          type="submit"
          disabled={authLoading}
          className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold text-[15px] shadow-[0_15px_30px_-10px_rgba(26,110,245,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(26,110,245,0.5)] transition-all active:scale-95 mt-4 disabled:opacity-50"
        >
          {authLoading ? 'Verifying...' : (type === 'login' ? `Sign In as ${selectedRole === 'student' ? 'Student' : 'Employee'}` : `Create ${selectedRole === 'student' ? 'Student' : 'Employee'} Account`)}
        </button>
      </form>

      <div className="mt-8 text-center text-[13px] font-semibold text-brand-muted">
        {type === 'login' ? (
          <>New user? <span onClick={() => setView('register')} className="text-brand-blue cursor-pointer hover:underline font-bold">Create account</span></>
        ) : (
          <>Member already? <span onClick={() => setView('login')} className="text-brand-blue cursor-pointer hover:underline font-bold">Sign in here</span></>
        )}
      </div>
    </motion.div>
  </div>
);

export default AuthPage;
