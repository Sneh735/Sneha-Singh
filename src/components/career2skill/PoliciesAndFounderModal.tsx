import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Award, User } from 'lucide-react';

const founderImage = '/assets/aistudio/my_pic_0db13024.png';

interface PoliciesAndFounderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'policies' | 'founder';
}

export const PoliciesAndFounderModal: React.FC<PoliciesAndFounderModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'policies',
}) => {
  const [activeTab, setActiveTab] = useState<'policies' | 'founder'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('policies')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'policies'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Privacy & Recruitment Policies
            </button>
            <button
              onClick={() => setActiveTab('founder')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'founder'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Founder Profile & Mission
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed space-y-5">
          
          {activeTab === 'policies' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>SKILL2CAREER Student Protection & Recruitment Policies</span>
                </h3>
                <p className="text-slate-500 text-xs">
                  Effective October 2026 · Governing all verified fresher listings on SKILL2CAREER
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="font-bold text-emerald-900 text-xs uppercase tracking-wide">
                  Zero Application Fee Guarantee
                </div>
                <p className="text-emerald-800 text-xs">
                  SKILL2CAREER is completely free for undergraduate students. Recruiters and companies are strictly prohibited from demanding registration fees, placement processing charges, or mandatory paid training programs.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    1. Mandatory Corporate Email Verification
                  </h4>
                  <p className="text-xs text-slate-600">
                    To eliminate fraudulent postings and deceptive third-party placement agencies, employers must provide official corporate domain email addresses (e.g., @company.com). Free email providers (@gmail.com, @yahoo.com) are automatically blocked.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    2. Strict Freshers-Only Mandate
                  </h4>
                  <p className="text-xs text-slate-600">
                    Every listing published on this portal must require zero prior industry experience (0 years). Listings that secretly demand 1–3 years of prior full-time experience are audited and taken down immediately.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    3. Undergraduate Branch Scope
                  </h4>
                  <p className="text-xs text-slate-600">
                    SKILL2CAREER is exclusively engineered for students pursuing degrees in Computer Science & Engineering (CSE), Artificial Intelligence & Data Science (AIDS), Information Technology (IT), Electronics & Communication (EC), and Data Science.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    4. Indeed Integration & Transparent Links
                  </h4>
                  <p className="text-xs text-slate-600">
                    Applications routed via Indeed or direct company ATS are transparently linked without hidden affiliate tracking, telemetry, or unwanted data sharing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'founder' && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-indigo-200 shrink-0 bg-slate-200">
                  <img
                    src={founderImage}
                    alt="Sneha Singh, Founder of SKILL2CAREER"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    Sneha Singh
                  </h3>
                  <div className="text-xs font-semibold text-indigo-600">
                    Founder, SKILL2CAREER
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Tagline: <span className="font-bold italic text-slate-800">"Learn. Practice. Get Hired."</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Sneha Singh – Founder of SKILL2CAREER
                </h4>
                <p>
                  Sneha Singh is the Founder of SKILL2CAREER, an AI-powered career development and job discovery platform designed to bridge the gap between undergraduate students and industry opportunities.
                </p>
                <p>
                  Recognizing the challenges faced by fresh graduates in finding genuine, skill-based job opportunities, she envisioned a platform that makes career discovery more accessible, reliable, and transparent.
                </p>
                <p>
                  Under her leadership, SKILL2CAREER integrates AI-powered career assessments, automated company domain verification, skill-based job recommendations, and direct application pathways through platforms like Indeed and verified corporate recruiters.
                </p>
                <p>
                  Her vision is to empower students from CSE, IT, AI & Data Science, Electronics, and related technical fields with the right career guidance and opportunities to build successful professional journeys.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
