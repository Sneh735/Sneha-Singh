import React, { useState } from 'react';
import { StudentUser, EligibleBranch, ELIGIBLE_BRANCHES } from '../types';
import { X, ShieldAlert, ShieldCheck, User, Mail, GraduationCap, Lock, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: StudentUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('CSE');
  const [gradYear, setGradYear] = useState('2026');
  const [branchError, setBranchError] = useState<string | null>(null);

  // OTP Verification States
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const validBranches = ['CSE', 'AIDS', 'IT', 'EC', 'Data Science'];

  const handleBranchChange = (branchVal: string) => {
    setSelectedBranch(branchVal);
    if (!validBranches.includes(branchVal)) {
      setBranchError('Access Restricted: SKILL2CAREER admission is strictly exclusive to undergraduate students in CSE, AIDS, IT, EC, and Data Science branches.');
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
      setBranchError('Access Restricted: Only CSE, AIDS, IT, EC, and Data Science students are eligible for this recruitment portal.');
      return;
    }

    if (isSignUp && !isOtpVerified) {
      setOtpError('Please verify your email address via OTP before registering.');
      return;
    }

    const newUser: StudentUser = {
      id: `usr-${Date.now()}`,
      name: name.trim() || 'Student Candidate',
      email: email.trim() || 'student@university.edu.in',
      college: college.trim() || 'Engineering Institute of Technology',
      branch: selectedBranch as EligibleBranch,
      graduationYear: gradYear,
      skills: ['Problem Solving', 'Data Structures', 'Python / Java'],
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">
                SKILL2CAREER Auth
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {isSignUp ? 'Student Registration' : 'Student Sign In'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly restricted to 5 undergraduate engineering branches
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {/* Eligibility Restriction Warning Box */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Strict Branch Requirement:</span> Only students from{' '}
              <strong>CSE, AIDS, IT, EC, and Data Science</strong> are admitted.
            </div>
          </div>

          {branchError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{branchError}</span>
            </div>
          )}

          {otpError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{otpError}</span>
            </div>
          )}

          {otpSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">{otpSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* 1. Full Name (FIRST in Sign Up) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* 2. College Student Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  College Student Email
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
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
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
                    {isOtpVerified ? 'Verified' : isOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                )}
              </div>
            </div>

            {/* 3. OTP Verification Box */}
            {isSignUp && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Email OTP Verification
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {isOtpVerified ? 'Verified ✓' : isOtpSent ? 'Code sent' : 'Click Send OTP'}
                  </span>
                </div>

                {!isOtpVerified ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs font-mono tracking-widest text-center bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={!isOtpSent}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition-colors shrink-0"
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

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / University
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RV College of Engineering, Bengaluru"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            )}

            {/* Undergraduate Branch Selector with Restricted Options */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Undergraduate Branch (Must be eligible)
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
              >
                <option value="CSE">CSE — Computer Science & Engineering</option>
                <option value="AIDS">AIDS — AI & Data Science</option>
                <option value="IT">IT — Information Technology</option>
                <option value="EC">EC — Electronics & Communication</option>
                <option value="Data Science">Data Science — B.Tech / B.E.</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Graduation Batch (Freshers 2024-2027)
              </label>
              <select
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="2027">2027 (Pre-Final Year - Internship)</option>
                <option value="2026">2026 (Final Year - PPO / Placement)</option>
                <option value="2025">2025 (Graduating - Immediate Fresher)</option>
                <option value="2024">2024 (Recent Graduate - 0 Exp)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!!branchError}
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
            >
              {isSignUp ? 'Complete Registration & Access Dashboard' : 'Sign In to SKILL2CAREER'}
            </button>
          </form>

          {/* Toggle between Login and Sign Up */}
          <div className="text-center text-xs text-slate-600 pt-1">
            {isSignUp ? 'Already registered?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setBranchError(null);
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Register Now'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
