import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { EligibleBranch, ELIGIBLE_BRANCHES } from '../types';

interface EligibilityNoticeProps {
  selectedBranch: 'All' | EligibleBranch;
  onSelectBranch: (branch: 'All' | EligibleBranch) => void;
}

export const EligibilityNotice: React.FC<EligibilityNoticeProps> = ({
  selectedBranch,
  onSelectBranch,
}) => {
  return (
    <div className="bg-indigo-900 text-white border-b border-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Main Notice Message */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-1.5 bg-indigo-800 rounded-md shrink-0 mt-0.5 sm:mt-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-white tracking-wide uppercase text-[11px] bg-indigo-800/80 px-2 py-0.5 rounded mr-2">
                Restricted Eligibility Policy
              </span>
              <span className="text-indigo-100">
                This platform is strictly restricted to undergraduate students in{' '}
                <strong className="text-white font-semibold">CSE</strong>,{' '}
                <strong className="text-white font-semibold">AIDS</strong>,{' '}
                <strong className="text-white font-semibold">IT</strong>,{' '}
                <strong className="text-white font-semibold">EC</strong>, and{' '}
                <strong className="text-white font-semibold">Data Science</strong>. All applicants are verified for fresher (0-exp) status.
              </span>
            </div>
          </div>

          {/* Quick Branch Quick Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 text-xs shrink-0">
            <span className="text-indigo-300 font-medium text-[11px] mr-1">Filter by Branch:</span>
            <button
              onClick={() => onSelectBranch('All')}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedBranch === 'All'
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'bg-indigo-800/60 text-indigo-200 hover:bg-indigo-800'
              }`}
            >
              All 5 Streams
            </button>
            {ELIGIBLE_BRANCHES.map((b) => (
              <button
                key={b.code}
                onClick={() => onSelectBranch(b.code)}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedBranch === b.code
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'bg-indigo-800/60 text-indigo-200 hover:bg-indigo-800'
                }`}
                title={b.label}
              >
                {b.code}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
