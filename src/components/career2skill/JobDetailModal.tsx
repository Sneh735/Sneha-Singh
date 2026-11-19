import React, { useState } from 'react';
import { JobPosting, StudentUser } from '../types';
import { 
  X, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Users, 
  Clock, 
  IndianRupee, 
  Award, 
  Mail, 
  ArrowUpRight, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface JobDetailModalProps {
  job: JobPosting;
  currentUser: StudentUser | null;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  currentUser,
  onClose,
  onOpenAuth,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [appliedIndeed, setAppliedIndeed] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(job.verifiedCompanyEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleIndeedClick = () => {
    setAppliedIndeed(true);
    window.open(job.indeedUrl, '_blank', 'noopener,noreferrer');
  };

  const handleEmailApply = () => {
    const subject = encodeURIComponent(`Application: ${job.title} - ${currentUser ? currentUser.name : 'Undergraduate Candidate'}`);
    const body = encodeURIComponent(
      `Dear Hiring Team at ${job.company},\n\nI am writing to express my strong interest in the ${job.title} opportunity (${job.opportunityType}) posted on SKILL2CAREER.\n\nCandidate Details:\n- Stream/Branch: ${currentUser ? currentUser.branch : 'CSE / AIDS / IT / EC / Data Science'}\n- Experience: Freshers Only (0 Years)\n- Indeed Ref ID: ${job.indeedJobId}\n\nKindly find my resume attached.\n\nBest regards,\n${currentUser ? currentUser.name : 'Applicant'}`
    );
    window.location.href = `mailto:${job.verifiedCompanyEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
              {job.companyLogoText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {job.company}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Real Listing
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Posted {job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo} days ago`} · Ref: {job.indeedJobId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-800">
          
          {/* Title & Branch Notice */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {job.roleType} Role
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Strictly Freshers Only (0-Exp)
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                {job.opportunityType}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
          </div>

          {/* Core Specifications Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Vacancies</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block tabular-nums">
                {job.vacancies} Openings
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Compensation</span>
              <span className="font-bold text-indigo-700 text-sm mt-0.5 block tabular-nums">
                {job.stipendOrSalary}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Duration</span>
              <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                {job.duration}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Work Mode</span>
              <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                {job.workMode} ({job.location.split(',')[0]})
              </span>
            </div>
          </div>

          {/* Certificate of Completion Highlight */}
          {job.hasCertificateOfCompletion && (
            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">
                  Certification of Completion Guaranteed
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {job.certificateDetails || 'Official certificate awarded upon program conclusion detailing technical projects and mentor evaluations.'}
                </p>
              </div>
            </div>
          )}

          {/* Mandatory Verified Real Company Email */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Mandatory Verified Employer Email
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Domain Authenticated
              </span>
            </div>
            <p className="text-xs text-slate-600">
              In accordance with SKILL2CAREER founder Sneha Singh's trust guidelines, this recruiter's official corporate email is validated to prevent fake listings:
            </p>
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-indigo-200 text-xs font-mono">
              <span className="text-indigo-900 font-semibold select-all">
                {job.verifiedCompanyEmail}
              </span>
              <button
                onClick={handleCopyEmail}
                className="text-slate-500 hover:text-indigo-600 p-1 flex items-center gap-1 text-[11px] font-sans"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Eligible Branches & Batches */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Eligible Undergraduate Branches (Strict)
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.targetBranches.map((branch) => (
                <span
                  key={branch}
                  className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold text-xs rounded-md border border-slate-200"
                >
                  {branch}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Eligible Batches: {job.batchEligibility.join(', ')} Passouts only. Students from other streams are not eligible.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Role Overview & Responsibilities
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Key Skills Required */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Required Skills & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.keySkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Selection Rounds */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Hiring Process Stages
            </h4>
            <ol className="space-y-1.5 text-xs text-slate-700 list-decimal pl-4">
              {job.selectionRounds.map((round, idx) => (
                <li key={idx} className="leading-snug">
                  {round}
                </li>
              ))}
            </ol>
          </div>

        </div>

        {/* Modal Footer with Application Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            {!currentUser && (
              <span className="text-amber-800 font-medium">
                Note: Non-registered students must confirm their branch (CSE/AIDS/IT/EC/Data Science) upon application.
              </span>
            )}
            {currentUser && (
              <span className="text-emerald-700 font-medium">
                Logged in as {currentUser.name} ({currentUser.branch})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleEmailApply}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
            >
              Email Verified Recruiter
            </button>
            <button
              onClick={handleIndeedClick}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#003A9B] hover:bg-[#002B73] rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <span>{appliedIndeed ? 'Applied via Indeed' : 'Apply on Indeed'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
