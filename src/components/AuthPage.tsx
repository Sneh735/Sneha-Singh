import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Briefcase, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  KeyRound, 
  Clock, 
  RefreshCw, 
  ShieldCheck,
  Send,
  Loader2
} from 'lucide-react';
import { UserRole } from '../types';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

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

export default function AuthPage({ 
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
}: AuthPageProps) {
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatchError, setPasswordMismatchError] = useState<string | null>(null);

  // Remember Me
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot Password / OTP State
  // Mode: 'none' | 'email' | 'otp' | 'new_password' | 'success'
  const [recoveryStep, setRecoveryStep] = useState<'none' | 'email' | 'otp' | 'new_password' | 'success'>('none');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Recovery Timers & Feedback
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(60); // 60 seconds
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPass, setIsResettingPass] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoverySuccessMsg, setRecoverySuccessMsg] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [isSendingFirebaseEmail, setIsSendingFirebaseEmail] = useState(false);

  // Load Remembered Email on Mount
  useEffect(() => {
    const saved = localStorage.getItem('skilltohire_remembered_email');
    if (saved) {
      setAuthEmail(saved);
      setRememberMe(true);
    }
  }, [setAuthEmail]);

  // Handle Form Submit for Login/Register with Validations
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMismatchError(null);

    if (type === 'register') {
      if (authPassword !== confirmPassword) {
        setPasswordMismatchError("Passwords do not match. Please verify and re-enter.");
        return;
      }
      if (authPassword.length < 6) {
        setPasswordMismatchError("Password must be at least 6 characters long.");
        return;
      }
    }

    if (rememberMe) {
      localStorage.setItem('skilltohire_remembered_email', authEmail);
    } else {
      localStorage.removeItem('skilltohire_remembered_email');
    }

    handleEmailAuth(e, type);
  };

  // OTP Expiry & Resend Timers
  useEffect(() => {
    if (recoveryStep !== 'otp') return;

    const interval = setInterval(() => {
      setOtpTimer(prev => (prev > 0 ? prev - 1 : 0));
      setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [recoveryStep]);

  // 1. Dispatch OTP via Backend
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetEmail = recoveryEmail.trim() || authEmail.trim();

    if (!targetEmail || !targetEmail.includes('@')) {
      setRecoveryError("Please enter a valid registered email address.");
      return;
    }

    setIsSendingOtp(true);
    setRecoveryError(null);
    setRecoverySuccessMsg(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP.");
      }

      setMaskedEmail(data.maskedEmail || targetEmail);
      setRecoveryStep('otp');
      setOtpTimer(data.expiresInSeconds || 300);
      setResendCooldown(60);
      setOtpInput('');
      setDevOtpHint(data.devOtp || null);
      setRecoverySuccessMsg(data.message || `OTP dispatched to ${targetEmail}`);

      // If development OTP provided, prefill/hint
      if (data.devOtp) {
        console.log("Local Dev OTP for Testing:", data.devOtp);
      }
    } catch (err: any) {
      setRecoveryError(err.message || "Could not deliver OTP. Please check your email address.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Direct Firebase Email Reset Link
  const handleSendFirebaseEmail = async () => {
    const targetEmail = recoveryEmail.trim() || authEmail.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setRecoveryError("Please enter a valid registered email address.");
      return;
    }
    setIsSendingFirebaseEmail(true);
    setRecoveryError(null);
    try {
      await sendPasswordResetEmail(auth, targetEmail);
      setRecoverySuccessMsg(`Official Google Firebase password reset link sent to ${targetEmail}! Please check your inbox (or spam) to set a new password.`);
    } catch (err: any) {
      console.error("Firebase reset email error:", err);
      if (err.code === 'auth/user-not-found') {
        setRecoveryError("No user registered with this email. Please check spelling or register.");
      } else if (err.code === 'auth/too-many-requests') {
        setRecoveryError("Too many requests sent. Please try again after a few minutes.");
      } else {
        setRecoveryError(err.message || "Failed to send reset email link.");
      }
    } finally {
      setIsSendingFirebaseEmail(false);
    }
  };

  // 2. Verify OTP via Backend
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim() || otpInput.trim().length < 6) {
      setRecoveryError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setIsVerifyingOtp(true);
    setRecoveryError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: recoveryEmail.trim() || authEmail.trim(), 
          otp: otpInput.trim() 
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid or expired OTP.");
      }

      setResetToken(data.resetToken);
      setRecoveryStep('new_password');
      setRecoveryError(null);
    } catch (err: any) {
      setRecoveryError(err.message || "Failed to verify OTP.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // 3. Reset Password with Token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setRecoveryError("Passwords do not match. Please ensure both fields match.");
      return;
    }
    if (newPassword.length < 6) {
      setRecoveryError("Password must be at least 6 characters long.");
      return;
    }

    setIsResettingPass(true);
    setRecoveryError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recoveryEmail.trim() || authEmail.trim(),
          resetToken,
          newPassword
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setRecoveryStep('success');
      setAuthPassword(newPassword);
      setAuthEmail(recoveryEmail.trim() || authEmail.trim());
    } catch (err: any) {
      setRecoveryError(err.message || "Password update failed. Please try again.");
    } finally {
      setIsResettingPass(false);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center relative overflow-hidden font-sans p-4">
      {/* Background Soft Glows */}
      <div className="absolute top-[-160px] right-[-100px] w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-120px] left-[-80px] w-[380px] h-[380px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Return Home Button */}
      <button 
        onClick={() => setView('home')}
        className="fixed top-6 left-6 z-20 flex items-center gap-2 text-slate-600 font-bold text-xs hover:text-brand-blue transition-colors px-4 py-2 border border-slate-200 rounded-full bg-white/80 backdrop-blur-md shadow-sm active:scale-95"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </button>

      {/* ================= MAIN AUTH CARD ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white w-full max-w-[500px] p-8 sm:p-11 rounded-[36px] shadow-[0_25px_60px_-15px_rgba(26,110,245,0.08)] relative z-10 border border-slate-200/80 my-8"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5 mb-7">
          <div className="w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-extrabold text-lg">
            S
          </div>
          <div className="font-display font-extrabold text-2xl tracking-tight text-slate-900">
            Skill<span className="text-brand-blue">toHire</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-900 leading-tight mb-1.5">
            {type === 'login' 
              ? (selectedRole === 'student' ? 'Student Sign In' : 'Employee Sign In') 
              : (selectedRole === 'student' ? 'Create Student Account' : 'Create Employer Account')
            }
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-sm mx-auto">
            {selectedRole === 'student'
              ? 'Access interactive roadmaps, 6-factor job matching & verified certificates.'
              : 'Recruit top engineering talent with verified skills and post fresher opportunities.'
            }
          </p>
        </div>

        {/* Role Segmented Switcher */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={cn(
                "py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all",
                selectedRole === 'student'
                  ? "bg-white text-brand-blue shadow-sm border border-slate-200/70"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Account</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('employee')}
              className={cn(
                "py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all",
                selectedRole === 'employee'
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200/70"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Briefcase className="w-4 h-4" />
              <span>Employer Hub</span>
            </button>
          </div>
        </div>

        {/* Error Messages */}
        {(authError || passwordMismatchError) && (
          <div className="mb-5 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{authError || passwordMismatchError}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full py-3.5 bg-white border border-slate-200 text-slate-800 rounded-2xl font-bold text-xs flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-sm hover:shadow"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          <span>Continue with Google ({selectedRole === 'student' ? 'Student' : 'Employer'})</span>
        </button>

        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OR WITH EMAIL</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider pl-1">
                {selectedRole === 'student' ? 'Full Name' : 'Recruiter / Company Rep Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder={selectedRole === 'student' ? 'Sneha Singh' : 'Acquisition Lead'} 
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium outline-none focus:border-brand-blue focus:bg-white text-xs transition-all" 
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider pl-1">
              {selectedRole === 'student' ? 'Student Email' : 'Work Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                placeholder={selectedRole === 'student' ? 'student@university.edu' : 'recruiter@company.com'} 
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium outline-none focus:border-brand-blue focus:bg-white text-xs transition-all" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider pl-1">Password</label>
              {type === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryEmail(authEmail);
                    setRecoveryStep('email');
                  }}
                  className="text-[11px] font-bold text-brand-blue hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••" 
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium outline-none focus:border-brand-blue focus:bg-white text-xs transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Registration Only) */}
          {type === 'register' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider pl-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium outline-none focus:border-brand-blue focus:bg-white text-xs transition-all" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 select-none">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
                className="w-4 h-4 rounded text-brand-blue focus:ring-brand-blue border-slate-300"
              />
              <span>Remember my email</span>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={authLoading}
            className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 hover:bg-brand-blue-dark transition-all active:scale-95 disabled:opacity-50 mt-3 flex items-center justify-center gap-2"
          >
            {authLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Authentication...</span>
              </>
            ) : (
              <span>{type === 'login' ? `Sign In as ${selectedRole === 'student' ? 'Student' : 'Employer'}` : `Create ${selectedRole === 'student' ? 'Student' : 'Employer'} Account`}</span>
            )}
          </button>
        </form>

        {/* Bottom Switcher */}
        <div className="mt-7 text-center text-xs font-semibold text-slate-500">
          {type === 'login' ? (
            <>New to SkillToHire? <span onClick={() => setView('register')} className="text-brand-blue cursor-pointer hover:underline font-bold">Create free account</span></>
          ) : (
            <>Already have an account? <span onClick={() => setView('login')} className="text-brand-blue cursor-pointer hover:underline font-bold">Sign in here</span></>
          )}
        </div>
      </motion.div>

      {/* ================= FORGOT PASSWORD / REAL EMAIL OTP MODAL ================= */}
      <AnimatePresence>
        {recoveryStep !== 'none' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-md p-8 sm:p-10 rounded-[36px] shadow-2xl border border-white/60 relative overflow-hidden"
            >
              {/* Modal Step 1: Enter Registered Email */}
              {recoveryStep === 'email' && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <KeyRound className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">Password Recovery</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Enter your registered email address. We will generate and deliver a secure 6-digit OTP code to verify your identity.
                    </p>
                  </div>

                  {recoveryError && (
                    <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-200">
                      {recoveryError}
                    </div>
                  )}

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider pl-1">Registered Email</label>
                      <input 
                        type="email" 
                        value={recoveryEmail} 
                        onChange={(e) => setRecoveryEmail(e.target.value)} 
                        placeholder="you@domain.com"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:border-brand-blue focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp || !recoveryEmail.trim()}
                      className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>Send Recovery OTP Code</span>
                    </button>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-slate-200"></div>
                      <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
                      <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    <button
                      type="button"
                      disabled={isSendingFirebaseEmail || !recoveryEmail.trim()}
                      onClick={handleSendFirebaseEmail}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200 disabled:opacity-50"
                    >
                      {isSendingFirebaseEmail ? <Loader2 className="w-4 h-4 animate-spin text-brand-blue" /> : <Mail className="w-4 h-4 text-brand-blue" />}
                      <span>Send Official Reset Link to Inbox</span>
                    </button>
                  </form>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setRecoveryStep('none')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      Cancel & Return to Login
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Step 2: Enter 6-Digit OTP Code */}
              {recoveryStep === 'otp' && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">Enter 6-Digit OTP</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      We sent a 6-digit verification code to <span className="font-bold text-slate-800">{maskedEmail || recoveryEmail}</span>.
                    </p>
                  </div>

                  {recoverySuccessMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{recoverySuccessMsg}</span>
                    </div>
                  )}

                  {recoveryError && (
                    <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-200">
                      {recoveryError}
                    </div>
                  )}

                  {/* Countdown Timer */}
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 py-2.5 rounded-2xl border border-slate-200">
                    <Clock className="w-4 h-4 text-brand-blue" />
                    <span>OTP Expires in: <span className="text-red-600 font-mono text-sm">{formatTimer(otpTimer)}</span></span>
                  </div>

                  {/* Dev / Testing OTP Auto-Fill Banner */}
                  {devOtpHint && (
                    <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-blue shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 text-[11px]">Testing Verification Code:</p>
                          <p className="font-mono font-bold text-brand-blue tracking-widest text-sm">{devOtpHint}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpInput(devOtpHint)}
                        className="px-3 py-1.5 bg-brand-blue text-white rounded-xl font-bold text-[11px] hover:bg-brand-blue-dark transition-all shadow-xs shrink-0"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider text-center block">
                        6-Digit Security Code
                      </label>
                      <input 
                        type="text" 
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="••••••"
                        className="w-full text-center text-2xl font-bold font-mono tracking-[10px] px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-brand-blue focus:bg-white"
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp || otpInput.length < 6 || otpTimer === 0}
                      className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      {isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>Verify OTP & Continue</span>
                    </button>
                  </form>

                  {/* Resend Action */}
                  <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isSendingOtp}
                      onClick={() => handleSendOtp()}
                      className={cn(
                        "flex items-center gap-1.5 transition-colors",
                        resendCooldown > 0 ? "text-slate-400 cursor-not-allowed" : "text-brand-blue hover:underline"
                      )}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend Code Now'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecoveryStep('email')}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      Change Email
                    </button>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      disabled={isSendingFirebaseEmail}
                      onClick={handleSendFirebaseEmail}
                      className="text-xs font-bold text-brand-blue hover:underline flex items-center justify-center gap-1.5 mx-auto"
                    >
                      {isSendingFirebaseEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                      <span>Didn't receive email? Send direct reset link to inbox</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Step 3: Set New Password */}
              {recoveryStep === 'new_password' && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">Create New Password</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Identity verified! Choose a strong password of at least 6 characters.
                    </p>
                  </div>

                  {recoveryError && (
                    <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-200">
                      {recoveryError}
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider pl-1">New Password</label>
                      <div className="relative">
                        <input 
                          type={showNewPassword ? "text" : "password"} 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full px-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:border-brand-blue focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider pl-1">Confirm New Password</label>
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:border-brand-blue focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isResettingPass || !newPassword || !confirmNewPassword}
                      className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      {isResettingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      <span>Save New Password & Finish</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Modal Step 4: Success Message */}
              {recoveryStep === 'success' && (
                <div className="text-center space-y-6 py-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">Password Reset Complete!</h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                      Your credentials have been securely updated in the database. You can now log into your account with your new password.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setRecoveryStep('none');
                      setView('login');
                    }}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
