import React from 'react';
import { StudentUser } from '../types';
import { UserCheck, LogOut, PlusCircle, Sparkles, MessageSquare, Bot } from 'lucide-react';

interface NavbarProps {
  currentTab: 'jobs' | 'ai-matcher' | 'reviews';
  setCurrentTab: (tab: 'jobs' | 'ai-matcher' | 'reviews') => void;
  currentUser: StudentUser;
  onLogout: () => void;
  onOpenPostJob: () => void;
  onRetakeQuiz: () => void;
  onOpenPolicies: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onLogout,
  onOpenPostJob,
  onRetakeQuiz,
  onOpenPolicies,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('jobs')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-base tracking-wider shadow-2xs group-hover:bg-indigo-700 transition-colors">
                S2C
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
                  SKILL2CAREER
                </span>
                <span className="text-[11px] font-medium text-indigo-600 tracking-normal hidden sm:block">
                  Learn. Practice. Get Hired.
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button
              onClick={() => setCurrentTab('jobs')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                currentTab === 'jobs'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Verified Opportunities
            </button>

            <button
              onClick={onRetakeQuiz}
              className="whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 text-slate-600 hover:text-indigo-600"
            >
              <Bot className="w-4 h-4 text-indigo-500" />
              <span>Career Quiz</span>
            </button>

            <button
              onClick={() => setCurrentTab('ai-matcher')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                currentTab === 'ai-matcher'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>AI Skill Fit</span>
            </button>

            <button
              onClick={() => setCurrentTab('reviews')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                currentTab === 'reviews'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span>Student Reviews</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Profile State */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                {currentUser.branch}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-medium">
                  <UserCheck className="w-3 h-3 inline" /> Verified Student
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="text-slate-400 hover:text-rose-600 p-1 transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2 bg-slate-50 text-xs font-medium text-slate-600 px-2">
        <button
          onClick={() => setCurrentTab('jobs')}
          className={`py-1 px-2 rounded ${currentTab === 'jobs' ? 'bg-indigo-50 text-indigo-700 font-bold' : ''}`}
        >
          Jobs
        </button>
        <button
          onClick={onRetakeQuiz}
          className="py-1 px-2 rounded hover:text-indigo-600 flex items-center gap-1"
        >
          <Bot className="w-3 h-3 text-indigo-500" />
          <span>Quiz</span>
        </button>
        <button
          onClick={() => setCurrentTab('ai-matcher')}
          className={`py-1 px-2 rounded ${currentTab === 'ai-matcher' ? 'bg-indigo-50 text-indigo-700 font-bold' : ''}`}
        >
          AI Matcher
        </button>
        <button
          onClick={() => setCurrentTab('reviews')}
          className={`py-1 px-2 rounded ${currentTab === 'reviews' ? 'bg-indigo-50 text-indigo-700 font-bold' : ''}`}
        >
          Reviews
        </button>
      </div>
    </header>
  );
};
