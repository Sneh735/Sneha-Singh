import React, { useState } from 'react';
import { JobPosting, EligibleBranch, ELIGIBLE_BRANCHES, RoleType, OpportunityType, WorkMode } from '../types';
import { X, ShieldAlert, CheckCircle2, Building, Mail, Award, AlertTriangle, Link as LinkIcon } from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (job: JobPosting) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onJobCreated,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [roleType, setRoleType] = useState<RoleType>('Technical');
  const [opportunityType, setOpportunityType] = useState<OpportunityType>('Internship with PPO');
  const [workMode, setWorkMode] = useState<WorkMode>('Hybrid');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [vacancies, setVacancies] = useState<number>(5);
  const [duration, setDuration] = useState('6 Months Internship + PPO');
  const [stipendOrSalary, setStipendOrSalary] = useState('₹40,000/month · PPO ₹14 LPA');
  const [hasCertificate, setHasCertificate] = useState(true);
  const [certificateDetails, setCertificateDetails] = useState('Official Company Project Completion Certificate & Letter of Recommendation');
  const [companyEmail, setCompanyEmail] = useState('');
  const [indeedUrl, setIndeedUrl] = useState('');
  const [description, setDescription] = useState('');
  const [skillsStr, setSkillsStr] = useState('DSA, Python, React, SQL');
  const [selectedBranches, setSelectedBranches] = useState<EligibleBranch[]>(['CSE', 'IT', 'AIDS']);

  const [emailError, setEmailError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Strict domain validation to prevent fake listings
  const validateCompanyEmail = (email: string) => {
    const forbiddenFreeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com', 'proton.me'];
    const parts = email.split('@');
    if (parts.length !== 2 || !parts[1].includes('.')) {
      return 'Please enter a valid official company email address.';
    }
    const domain = parts[1].toLowerCase();
    if (forbiddenFreeDomains.some((d) => domain.includes(d))) {
      return 'Anti-Fraud Policy: Free public email providers (@gmail, @yahoo, etc.) are strictly prohibited. You must provide a registered official corporate domain (e.g., careers@yourcompany.com).';
    }
    return null;
  };

  const handleBranchToggle = (branch: EligibleBranch) => {
    if (selectedBranches.includes(branch)) {
      if (selectedBranches.length > 1) {
        setSelectedBranches(selectedBranches.filter((b) => b !== branch));
      }
    } else {
      setSelectedBranches([...selectedBranches, branch]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateCompanyEmail(companyEmail);
    if (err) {
      setEmailError(err);
      return;
    }

    const initials = company
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 3)
      .toUpperCase() || 'EMP';

    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      company: company.trim(),
      companyLogoText: initials,
      roleType,
      opportunityType,
      workMode,
      location: location.trim(),
      vacancies: Number(vacancies) || 1,
      experienceLevel: 'Freshers Only',
      batchEligibility: ['2025', '2026', '2027'],
      targetBranches: selectedBranches,
      duration: duration.trim(),
      stipendOrSalary: stipendOrSalary.trim(),
      hasCertificateOfCompletion: hasCertificate,
      certificateDetails: hasCertificate ? certificateDetails : undefined,
      verifiedCompanyEmail: companyEmail.trim().toLowerCase(),
      isEmailDomainVerified: true,
      indeedUrl: indeedUrl.trim() || `https://www.indeed.com/jobs?q=${encodeURIComponent(company)}+Fresher`,
      indeedJobId: `IND-${initials}-${Math.floor(10000 + Math.random() * 90000)}`,
      description: description.trim(),
      keySkills: skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
      selectionRounds: ['Aptitude & Technical Assessment', 'Technical Coding Round', 'Hiring Manager Discussion'],
      postedDaysAgo: 0,
      isGenuineVerified: true,
    };

    onJobCreated(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
                Employer Verified Postings
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Post a Fresher Opportunity (0-Exp Only)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enforcing Sneha Singh's anti-fake listing verification protocol
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Trust Banner */}
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Mandatory Verification:</span> Every job must provide an official corporate domain email (no Gmail/Yahoo) and specify exact vacancies, duration, and stipend.
            </div>
          </div>

          {emailError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{emailError}</span>
            </div>
          )}

          {/* Job Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Opportunity Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SDE Intern with PPO Conversion"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Razorpay Technologies"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Mandatory Corporate Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mandatory Official Company Email (Domain Verified) *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="careers@yourcompany.com (Official domain only)"
                value={companyEmail}
                onChange={(e) => {
                  setCompanyEmail(e.target.value);
                  setEmailError(null);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Gmail, Yahoo, Outlook, and other free domains are blocked to prevent fraudulent postings.
            </p>
          </div>

          {/* Role Type, Opportunity Type, Work Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role Classification *
              </label>
              <select
                value={roleType}
                onChange={(e) => setRoleType(e.target.value as RoleType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                <option value="Technical">Technical Role</option>
                <option value="Non-Technical">Non-Technical Role</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Opportunity Format *
              </label>
              <select
                value={opportunityType}
                onChange={(e) => setOpportunityType(e.target.value as OpportunityType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                <option value="Internship with PPO">Internship with PPO</option>
                <option value="Direct Placement">Direct Placement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Mode
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="In-Office">In-Office</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Location & Vacancies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru, Karnataka or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Number of Vacancies (Exact Seats) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={vacancies}
                onChange={(e) => setVacancies(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums font-bold"
              />
            </div>
          </div>

          {/* Duration & Stipend/Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration / Program Timeline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 6 Months (PPO Conversion) or Full-Time"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stipend / CTC Compensation *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ₹45,000/month or ₹10.5 LPA"
                value={stipendOrSalary}
                onChange={(e) => setStipendOrSalary(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>
          </div>

          {/* Certificate of Completion Checkbox */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCertificate}
                onChange={(e) => setHasCertificate(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                Certification of Completion Provided Upon Program End
              </span>
            </label>
            {hasCertificate && (
              <input
                type="text"
                placeholder="Details (e.g. Official Project Completion Certificate & PPO Letter)"
                value={certificateDetails}
                onChange={(e) => setCertificateDetails(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Eligible Branches Selection (Restricted to CSE, AIDS, IT, EC, Data Science) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Eligible Undergraduate Branches (Strict S2C Selection)
            </label>
            <div className="flex flex-wrap gap-2">
              {ELIGIBLE_BRANCHES.map((b) => {
                const isSelected = selectedBranches.includes(b.code);
                return (
                  <button
                    type="button"
                    key={b.code}
                    onClick={() => handleBranchToggle(b.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : ''}{b.code}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Select which of the 5 authorized undergraduate streams may apply.
            </p>
          </div>

          {/* Indeed Application Integration URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Direct Indeed Job URL (Integration Link)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://www.indeed.com/jobs?q=YourCompany+Internship"
                value={indeedUrl}
                onChange={(e) => setIndeedUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Candidates can one-click apply directly inside the Indeed app or website.
            </p>
          </div>

          {/* Key Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Technical/Functional Skills (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Java, Spring Boot, MySQL, REST APIs, Git"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description & Responsibilities *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detail the daily tasks, learning outcomes, and mentorship support..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              Publish Verified Fresher Listing
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
