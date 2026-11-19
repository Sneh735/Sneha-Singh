import React, { useState } from 'react';
import { StudentUser, EligibleBranch, ELIGIBLE_BRANCHES } from '../types';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Mail, 
  GraduationCap, 
  Lock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface LandingAuthPageProps {
  onLoginSuccess: (user: StudentUser) => void;
  onOpenPoliciesModal: () => void;
}

export const LandingAuthPage: React.FC<LandingAuthPageProps> = ({ 
  onLoginSuccess,
  onOpenPoliciesModal,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('CSE');
  const [gradYear, setGradYear] = useState('2026');
  const [college, setCollege] = useState('');
  const [branchError, setBranchError] = useState<string | null>(null);

  // OTP Verification States
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);

  const validBranches = ['CSE', 'AIDS', 'IT', 'EC', 'Data Science'];

  const handleBranchSelect = (branchVal: string) => {
    setSelectedBranch(branchVal);
    if (!validBranches.includes(branchVal)) {
      setBranchError('Access Restricted: SKILL2CAREER is exclusively engineered for undergraduate students in CSE, AIDS, IT, EC, and Data Science streams.');
    } else {
      setBranchError(null);
    }
  };

  const handleSendOtp = () => {
    if (!email.trim() || !email.includes('@')) {
      setOtpError('Please enter a valid student email first.');
      return;
    }
    setOtpError(null);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setIsOtpSent(true);
    setIsOtpVerified(false);
    setOtpSuccessMessage(`Verification code sent! For demo verification, enter OTP: ${code}`);
  };

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      setOtpError('Please enter the 6-digit OTP code.');
      return;
    }
    if (otp.trim() === generatedOtp || otp.trim() === '123456') {
      setIsOtpVerified(true);
      setOtpError(null);
      setOtpSuccessMessage('Email verified successfully!');
    } else {
      setOtpError('Incorrect OTP code. Please check and enter the correct code.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validBranches.includes(selectedBranch)) {
      setBranchError('Access Restricted: Only CSE, AIDS, IT, EC, and Data Science students are eligible.');
      return;
    }

    if (isSignUp && !isOtpVerified) {
      setOtpError('Please verify your email address via OTP before creating your account.');
      return;
    }

    const newUser: StudentUser = {
      id: `usr-${Date.now()}`,
      name: name.trim() || (isSignUp ? 'Student Candidate' : email.split('@')[0] || 'Undergraduate Candidate'),
      email: email.trim() || 'student@university.edu.in',
      college: college.trim() || 'Engineering Institute of Technology',
      branch: selectedBranch as EligibleBranch,
      graduationYear: gradYear,
      skills: ['Problem Solving', 'Data Structures', 'Python / Java'],
    };

    onLoginSuccess(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Minimal Top Brand Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            S2C
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            SKILL2CAREER
          </span>
        </div>

        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Exclusively for <span className="text-slate-800 font-semibold">CSE · AIDS · IT · EC · Data Science</span>
        </div>
      </header>

      {/* Main Split Layout: Brand & Value on Left, Clean Auth Card on Right */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Tagline & Platform Core Value */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Undergraduate Early Career Gateway</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                SKILL2CAREER
              </h1>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
                Learn. Practice. Get Hired.
              </p>
            </div>

            <p className="text-base text-slate-600 leading-relaxed max-w-lg">
              The AI-powered recruitment launchpad designed strictly for undergraduate engineering students. Zero experience traps, 100% verified employer emails, and direct Indeed integration.
            </p>

            {/* Core Feature Proof Points */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span><strong>Freshers Only:</strong> Strictly 0-experience internships & entry-level roles.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span><strong>No Fake Listings:</strong> Mandatory verified corporate domain emails.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span><strong>Interactive AI Quiz:</strong> Match roles through conversational MCQ filtering.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Minimalist Auth Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">
              
              {/* Form Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setBranchError(null);
                    setOtpError(null);
                    setOtpSuccessMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    !isSignUp
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setBranchError(null);
                    setOtpError(null);
                    setOtpSuccessMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    isSignUp
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {branchError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{branchError}</span>
                </div>
              )}

              {otpError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{otpError}</span>
                </div>
              )}

              {otpSuccessMessage && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{otpSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Full Name (FIRST in Sign Up) */}
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Snehal Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Email Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Student / College Email
                    </label>
                    {isSignUp && isOtpVerified && (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="student@college.edu.in"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (isOtpVerified) setIsOtpVerified(false);
                        }}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      />
                    </div>
                    {isSignUp && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                          isOtpVerified
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {isOtpVerified ? 'Verified' : isOtpSent ? 'Resend OTP' : 'Send OTP'}
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. OTP Verification Section (in Sign Up) */}
                {isSignUp && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Email OTP Verification
                      </label>
                      <span className="text-[10px] text-slate-500">
                        {isOtpVerified ? 'Verified ✓' : isOtpSent ? 'Code sent to email' : 'Click Send OTP above'}
                      </span>
                    </div>

                    {!isOtpVerified ? (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono tracking-widest text-center bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={!isOtpSent}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg shadow-2xs transition-colors shrink-0"
                        >
                          Verify OTP
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 bg-emerald-100/70 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Email Address Confirmed & Verified</span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Undergraduate Branch Dropdown with Strict Validation */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Undergraduate Branch
                    </label>
                    <span className="text-[10px] text-indigo-600 font-semibold">
                      Eligible streams only
                    </span>
                  </div>
                  <select
                    value={selectedBranch}
                    onChange={(e) => handleBranchSelect(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-900"
                  >
                    <option value="CSE">CSE — Computer Science & Engineering</option>
                    <option value="AIDS">AIDS — Artificial Intelligence & Data Science</option>
                    <option value="IT">IT — Information Technology</option>
                    <option value="EC">EC — Electronics & Communication</option>
                    <option value="Data Science">Data Science — B.Tech / B.E.</option>
                  </select>
                </div>

                {isSignUp && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Grad Batch
                      </label>
                      <select
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="2027">2027</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        College Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. RVCE / MIT"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!!branchError}
                  className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isSignUp ? 'Register & Begin Career Quiz' : 'Log In & Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Discreet Minimal Footer - keeping policies and founder out of the first view */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} SKILL2CAREER · "Learn. Practice. Get Hired."
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <button
            onClick={onOpenPoliciesModal}
            className="text-slate-500 hover:text-slate-800 hover:underline transition-colors"
          >
            Privacy, Terms & Platform Policies
          </button>
        </div>
      </footer>
    </div>
  );
};
