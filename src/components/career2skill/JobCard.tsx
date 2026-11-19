import React from 'react';
import { JobPosting } from '../types';
import { 
  Building2, 
  MapPin, 
  Users, 
  Clock, 
  IndianRupee, 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  Mail, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

interface JobCardProps {
  job: JobPosting;
  onSelect: (job: JobPosting) => void;
  onApplyIndeed: (job: JobPosting) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect, onApplyIndeed }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between">
      <div>
        {/* Top Header: Company and Genuine Verification Badge */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm tracking-tight shrink-0">
              {job.companyLogoText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  {job.company}
                </h3>
                {job.isGenuineVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60" title="Verified Employer Entity">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Genuine
                  </span>
                )}
              </div>
              
              {/* Mandatory Company Real Email Display */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-mono text-[11px] text-slate-600 truncate max-w-[200px]">
                  {job.verifiedCompanyEmail}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">(Official Domain)</span>
              </div>
            </div>
          </div>

          {/* Role Type: Technical vs Non-Technical & Experience Restriction */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                job.roleType === 'Technical'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/60'
              }`}
            >
              {job.roleType} Role
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
              Freshers Only
            </span>
          </div>
        </div>

        {/* Job Title */}
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-2 hover:text-indigo-600 cursor-pointer transition-colors"
          onClick={() => onSelect(job)}
        >
          {job.title}
        </h2>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Key Specification Grid: Location, Vacancies, Duration, Compensation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-y border-slate-100 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">LOCATION</span>
            <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{job.location.split(',')[0]}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-medium block">VACANCIES</span>
            <div className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5 tabular-nums">
              <Users className="w-3 h-3 text-indigo-500 shrink-0" />
              <span>{job.vacancies} Openings</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-medium block">TYPE & DURATION</span>
            <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{job.opportunityType}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-medium block">STIPEND / SALARY</span>
            <div className="font-bold text-indigo-700 flex items-center gap-1 mt-0.5 tabular-nums truncate">
              <IndianRupee className="w-3 h-3 text-indigo-600 shrink-0" />
              <span className="truncate">{job.stipendOrSalary}</span>
            </div>
          </div>
        </div>

        {/* Target Streams & Certificate Highlight */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 font-medium">Eligible Streams:</span>
            {job.targetBranches.map((branch) => (
              <span
                key={branch}
                className="font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
              >
                {branch}
              </span>
            ))}
          </div>

          {job.hasCertificateOfCompletion && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Completion Certificate Provided</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer: Indeed direct application & View Details */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
          <span>Indeed Ref:</span>
          <span className="text-slate-800 font-semibold">{job.indeedJobId}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(job)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
          >
            Full Details
          </button>
          
          <button
            onClick={() => onApplyIndeed(job)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#003A9B] hover:bg-[#002B73] rounded-md shadow-sm transition-colors whitespace-nowrap"
            title="Direct application via Indeed integration"
          >
            <span>Apply on Indeed</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
