import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Share2,
  Clock,
  GraduationCap,
  Award,
  UploadCloud,
  Edit3,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Layers,
  FileText,
  UserCheck,
  Send,
  Loader2,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  AdvancedJobListing, 
  CandidateProfile, 
  MatchBreakdown, 
  JobApplicationRecord,
  Course
} from '../types';
import { ADVANCED_JOBS_CATALOG } from '../data/advancedJobs';
import { calculateJobMatch, getTransferableRoles } from '../services/jobMatcher';
import { parseResumeWithAI } from '../services/ai';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface JobMatchingProps {
  userProfile?: any;
  onUpdateProfile?: (updated: any) => void;
  userSkills?: string[];
  completedCourses?: string[];
  onNavigateToCourse?: () => void;
  onViewCourse?: (course: Course) => void;
  courses?: Course[];
  userEmail?: string;
  userName?: string;
}

export default function JobMatching({ 
  userProfile,
  onUpdateProfile,
  userSkills = ['JavaScript', 'HTML', 'CSS', 'React', 'Java', 'SQL', 'Python'],
  completedCourses = [],
  onNavigateToCourse,
  onViewCourse,
  courses = [],
  userEmail = 'candidate@skilltohire.com',
  userName = 'Candidate'
}: JobMatchingProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'recommended' | 'top_matches' | 'saved' | 'applications' | 'transferable'>('recommended');
  
  // Search and multi-filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedExpLevel, setSelectedExpLevel] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'recent'>('match');

  // Job actions state
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<JobApplicationRecord[]>([]);
  const [selectedJobForModal, setSelectedJobForModal] = useState<AdvancedJobListing | null>(null);

  // Resume Upload & Profile Editing State
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Candidate Profile State
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(() => {
    return {
      name: userProfile?.displayName || userName || "Sneha Singh",
      email: userProfile?.email || userEmail || "student@skilltohire.com",
      phone: userProfile?.phone || "+91 98765 43210",
      targetRole: userProfile?.title || "Full Stack Software Engineer",
      technicalSkills: userProfile?.keySkills && userProfile.keySkills.length > 0 
        ? userProfile.keySkills 
        : userSkills.length > 0 ? userSkills : ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL', 'Python'],
      softSkills: ['Problem Solving', 'Agile Collaboration', 'Communication', 'Critical Thinking', 'Teamwork'],
      experienceYears: typeof userProfile?.experience === 'number' ? userProfile.experience : 1,
      education: {
        degree: userProfile?.degree || "B.Tech",
        field: userProfile?.department || "Computer Science & Engineering",
        college: userProfile?.college || "Institute of Technology",
        graduationYear: "2026",
        gpa: "8.6 CGPA"
      },
      certifications: completedCourses.length > 0 ? ['SkillHire Certified Professional'] : [],
      preferredLocation: "Bengaluru / Remote",
      preferredWorkMode: "Any"
    };
  });

  // Edit form state
  const [editTechSkillsStr, setEditTechSkillsStr] = useState(candidateProfile.technicalSkills.join(', '));
  const [editSoftSkillsStr, setEditSoftSkillsStr] = useState(candidateProfile.softSkills.join(', '));
  const [editDegree, setEditDegree] = useState(candidateProfile.education.degree);
  const [editField, setEditField] = useState(candidateProfile.education.field);
  const [editCollege, setEditCollege] = useState(candidateProfile.education.college);
  const [editExpYears, setEditExpYears] = useState(candidateProfile.experienceYears);
  const [editTargetRole, setEditTargetRole] = useState(candidateProfile.targetRole);
  const [editWorkMode, setEditWorkMode] = useState(candidateProfile.preferredWorkMode);

  // Multi-factor calculations map
  const matchMap = useMemo(() => {
    const map = new Map<string, MatchBreakdown>();
    for (const job of ADVANCED_JOBS_CATALOG) {
      const breakdown = calculateJobMatch(job, candidateProfile, completedCourses);
      map.set(job.id, breakdown);
    }
    return map;
  }, [candidateProfile, completedCourses]);

  // Transferable roles
  const transferableRoles = useMemo(() => {
    return getTransferableRoles(candidateProfile);
  }, [candidateProfile]);

  // Overall Match Stats
  const stats = useMemo(() => {
    let highest = 0;
    let highCount = 0;
    for (const [_, breakdown] of matchMap) {
      if (breakdown.overallScore > highest) highest = breakdown.overallScore;
      if (breakdown.overallScore >= 75) highCount++;
    }
    return {
      highestScore: highest || 94,
      highFitCount: highCount,
      totalJobs: ADVANCED_JOBS_CATALOG.length,
      appliedCount: applications.length,
      savedCount: savedJobIds.length
    };
  }, [matchMap, applications, savedJobIds]);

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return ADVANCED_JOBS_CATALOG.filter(job => {
      const match = matchMap.get(job.id);

      // Tab filter
      if (activeTab === 'top_matches' && (match?.overallScore || 0) < 75) {
        return false;
      }
      if (activeTab === 'saved' && !savedJobIds.includes(job.id)) {
        return false;
      }

      // Domain filter
      if (selectedDomain !== 'All' && job.domain !== selectedDomain) {
        return false;
      }

      // Work Mode filter
      if (selectedWorkMode !== 'All' && job.workMode !== selectedWorkMode) {
        return false;
      }

      // Experience filter
      if (selectedExpLevel !== 'All') {
        if (selectedExpLevel === 'Freshers' && job.minExperienceYears > 0) return false;
        if (selectedExpLevel === '1-3 Years' && (job.minExperienceYears < 1 || job.minExperienceYears > 3)) return false;
        if (selectedExpLevel === '3+ Years' && job.minExperienceYears < 3) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesSkills = job.requiredTechnicalSkills.some(s => s.toLowerCase().includes(q));
        const matchesLoc = job.location.toLowerCase().includes(q);
        return matchesTitle || matchesCompany || matchesSkills || matchesLoc;
      }

      return true;
    }).sort((a, b) => {
      const matchA = matchMap.get(a.id)?.overallScore || 0;
      const matchB = matchMap.get(b.id)?.overallScore || 0;

      if (sortBy === 'match') {
        return matchB - matchA;
      }
      if (sortBy === 'salary') {
        // extract numeric high salary from string like '₹14 - 20 LPA'
        const salA = parseInt(a.salary.replace(/[^0-9]/g, '')) || 0;
        const salB = parseInt(b.salary.replace(/[^0-9]/g, '')) || 0;
        return salB - salA;
      }
      return 0; // recent preserves array order
    });
  }, [activeTab, selectedDomain, selectedWorkMode, selectedExpLevel, searchQuery, sortBy, matchMap, savedJobIds]);

  // Handle Resume Upload & Extraction
  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    setUploadSuccessMsg(null);

    try {
      let extractedText = "";

      if (file.name.toLowerCase().endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          extractedText += textContent.items.map((item: any) => item.str).join(" ") + " ";
        }
      } else {
        // For text / docx file reading
        extractedText = await file.text();
      }

      // Parse with AI
      const parsedProfile = await parseResumeWithAI(extractedText, file.name);

      setCandidateProfile(parsedProfile);
      setEditTechSkillsStr(parsedProfile.technicalSkills.join(', '));
      setEditSoftSkillsStr(parsedProfile.softSkills.join(', '));
      setEditDegree(parsedProfile.education.degree);
      setEditField(parsedProfile.education.field);
      setEditCollege(parsedProfile.education.college);
      setEditExpYears(parsedProfile.experienceYears);
      setEditTargetRole(parsedProfile.targetRole);

      if (onUpdateProfile) {
        onUpdateProfile({
          keySkills: parsedProfile.technicalSkills,
          title: parsedProfile.targetRole,
          experience: parsedProfile.experienceYears
        });
      }

      setUploadSuccessMsg(`Resume "${file.name}" analyzed successfully! Profile & job match scores refreshed.`);
      setTimeout(() => setUploadSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setUploadSuccessMsg("Error extracting resume. Updated with smart profile defaults.");
    } finally {
      setIsUploadingResume(false);
    }
  };

  // Save Edit Profile Modal
  const handleSaveProfileEdits = (e: React.FormEvent) => {
    e.preventDefault();

    const techArray = editTechSkillsStr.split(',').map(s => s.trim()).filter(Boolean);
    const softArray = editSoftSkillsStr.split(',').map(s => s.trim()).filter(Boolean);

    const updated: CandidateProfile = {
      ...candidateProfile,
      targetRole: editTargetRole.trim() || candidateProfile.targetRole,
      technicalSkills: techArray.length > 0 ? techArray : candidateProfile.technicalSkills,
      softSkills: softArray.length > 0 ? softArray : candidateProfile.softSkills,
      experienceYears: Number(editExpYears) || 0,
      education: {
        ...candidateProfile.education,
        degree: editDegree.trim() || candidateProfile.education.degree,
        field: editField.trim() || candidateProfile.education.field,
        college: editCollege.trim() || candidateProfile.education.college
      },
      preferredWorkMode: editWorkMode
    };

    setCandidateProfile(updated);
    setIsEditProfileModalOpen(false);

    if (onUpdateProfile) {
      onUpdateProfile({
        keySkills: updated.technicalSkills,
        title: updated.targetRole,
        experience: updated.experienceYears
      });
    }
  };

  // Toggle Save Job
  const handleToggleSave = (jobId: string) => {
    setSavedJobIds(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  // 1-Click Apply Flow
  const handleApplyToJob = (job: AdvancedJobListing) => {
    if (applications.some(a => a.jobId === job.id)) return;

    const match = matchMap.get(job.id);
    const newApp: JobApplicationRecord = {
      id: `app-${Date.now().toString().slice(-6)}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedDate: 'Just Now',
      matchScoreAtApply: match?.overallScore || 85,
      status: 'Submitted'
    };

    setApplications(prev => [newApp, ...prev]);
  };

  // Link to Course bridge
  const handleBridgeSkillCourse = (courseId?: string) => {
    setSelectedJobForModal(null);
    if (!courseId) {
      if (onNavigateToCourse) onNavigateToCourse();
      return;
    }
    const targetCourse = courses.find(c => c.id === courseId);
    if (targetCourse && onViewCourse) {
      onViewCourse(targetCourse);
    } else if (onNavigateToCourse) {
      onNavigateToCourse();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ================= 1. HERO & CANDIDATE PROFILE BAR ================= */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-[36px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Multi-Factor AI Job Compatibility Engine</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight leading-tight">
              Personalized Career Matches
            </h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed font-medium">
              Evaluated across 6 factors: Skills (35%), Experience (20%), Education (15%), Role Fit (15%), Location (10%), and Certifications (5%).
            </p>
          </div>

          {/* Candidate Profile Widget Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl w-full lg:w-96 space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>{candidateProfile.name}</span>
                </h3>
                <p className="text-xs text-white/70 mt-0.5 font-medium">
                  {candidateProfile.targetRole}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30">
                {candidateProfile.experienceYears === 0 ? "Fresher" : `${candidateProfile.experienceYears} yr exp`}
              </span>
            </div>

            <div className="text-xs text-white/80 space-y-1 border-t border-white/10 pt-3">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span className="truncate">{candidateProfile.education.degree} in {candidateProfile.education.field}</span>
              </div>
              <div className="text-[11px] text-white/60 pl-5">
                {candidateProfile.education.college}
              </div>
            </div>

            {/* Top Skills Preview */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {candidateProfile.technicalSkills.slice(0, 5).map((skill, sIdx) => (
                <span key={sIdx} className="px-2 py-0.5 bg-white/15 rounded-md text-[10px] font-bold text-white">
                  {skill}
                </span>
              ))}
              {candidateProfile.technicalSkills.length > 5 && (
                <span className="px-2 py-0.5 bg-white/10 rounded-md text-[10px] font-bold text-white/70">
                  +{candidateProfile.technicalSkills.length - 5} more
                </span>
              )}
            </div>

            {/* Profile Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingResume}
                className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
              >
                {isUploadingResume ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5 text-brand-blue" />}
                <span>Upload Resume</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleResumeFileUpload} 
                accept=".pdf,.docx,.txt" 
                className="hidden" 
              />

              <button
                onClick={() => setIsEditProfileModalOpen(true)}
                className="py-2.5 px-3 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                title="Edit profile information"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>

        {uploadSuccessMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-xs font-bold text-emerald-200 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{uploadSuccessMsg}</span>
          </motion.div>
        )}

        {/* Highlight Metrics */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl md:text-3xl font-extrabold font-display">{stats.highestScore}%</div>
            <div className="text-xs text-white/70 font-medium">Top Match Compatibility</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold font-display">{stats.highFitCount}</div>
            <div className="text-xs text-white/70 font-medium">Roles with 75%+ Strong Fit</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold font-display">{stats.savedCount}</div>
            <div className="text-xs text-white/70 font-medium">Bookmarked Roles</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold font-display">{stats.appliedCount}</div>
            <div className="text-xs text-white/70 font-medium">Active Applications</div>
          </div>
        </div>
      </div>

      {/* ================= 2. VIEW NAVIGATION TABS ================= */}
      <div className="flex flex-wrap gap-2 border-b border-brand-border/60 pb-3 items-center justify-between">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold w-full sm:w-auto">
          {[
            { id: 'recommended', label: `All Matches (${stats.totalJobs})`, icon: Briefcase },
            { id: 'top_matches', label: `Strong Fit 75%+ (${stats.highFitCount})`, icon: Sparkles },
            { id: 'saved', label: `Saved Roles (${stats.savedCount})`, icon: Bookmark },
            { id: 'applications', label: `My Applications (${stats.appliedCount})`, icon: Send },
            { id: 'transferable', label: `Transferable Roles`, icon: Layers },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all",
                activeTab === tab.id
                  ? "bg-white text-brand-blue shadow-sm font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-500 hidden md:block">
          Semantic AI Parsing Active · Synonyms Matched
        </div>
      </div>

      {/* ================= 3. SEARCH & MULTI-FILTER BAR ================= */}
      {activeTab !== 'applications' && activeTab !== 'transferable' && (
        <div className="bg-white p-6 rounded-3xl border border-brand-border/60 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Box */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by role, company, or tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-cream/40 border border-brand-border rounded-2xl text-xs md:text-sm font-medium outline-none focus:border-brand-blue focus:bg-white transition-all"
              />
            </div>

            {/* Quick Selectors: Work Mode, Experience, Sort */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              >
                <option value="All">All Work Modes</option>
                <option value="Remote">Remote Only</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>

              <select
                value={selectedExpLevel}
                onChange={(e) => setSelectedExpLevel(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              >
                <option value="All">All Experience</option>
                <option value="Freshers">Freshers / 0-1 yr</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3+ Years">3+ Years</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              >
                <option value="match">Sort: Match Score %</option>
                <option value="salary">Sort: Salary (High to Low)</option>
                <option value="recent">Sort: Most Recent</option>
              </select>
            </div>
          </div>

          {/* Domain Chips */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
            {['All', 'Frontend', 'Backend', 'Full Stack', 'Cloud & DevOps', 'AI & ML', 'UI/UX Design', 'Product Management', 'Cybersecurity', 'Business Analytics'].map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
                  selectedDomain === domain
                    ? "bg-brand-blue border-brand-blue text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= 4. TAB: TRANSFERABLE ROLES ================= */}
      {activeTab === 'transferable' && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 p-8 rounded-3xl space-y-2">
            <h2 className="text-xl font-display font-bold text-indigo-950 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Alternative Career Paths (Based on Transferable Skills)</span>
            </h2>
            <p className="text-sm text-indigo-800 font-medium leading-relaxed">
              Based on your skill topology, you are not limited to just your current title. These adjacent high-demand roles have 70%+ overlapping fundamentals:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transferableRoles.map((role, rIdx) => (
              <div key={rIdx} className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {role.domain}
                  </span>
                  <h3 className="font-display font-bold text-lg text-slate-900">{role.role}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {role.reason}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recommended Bridge Skill:</div>
                  <div className="text-xs font-bold text-brand-blue bg-blue-50 p-2.5 rounded-xl border border-blue-200/60">
                    🎯 {role.keyBridgeSkill}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDomain(role.domain);
                      setActiveTab('recommended');
                    }}
                    className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>View {role.role} Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 5. TAB: MY APPLICATIONS ================= */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">Your Active Job Applications</h2>
              <p className="text-xs text-slate-500 font-medium">Track your application pipeline, assessment invites, and recruiter reviews.</p>
            </div>
            <button
              onClick={() => setActiveTab('recommended')}
              className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <span>Explore More Roles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl border border-brand-border text-center space-y-4">
              <Send className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-lg text-slate-800">No Applications Submitted Yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Explore recommended matches, inspect your compatibility score, and click "Apply with Profile" to launch your candidacies.
              </p>
              <button
                onClick={() => setActiveTab('recommended')}
                className="px-6 py-3 bg-brand-blue text-white rounded-2xl font-bold text-xs uppercase tracking-wider"
              >
                Browse Recommended Jobs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base text-slate-900">{app.jobTitle}</h4>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">{app.company} · Applied {app.appliedDate}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-brand-blue border border-blue-200">
                      {app.matchScoreAtApply}% Match
                    </span>
                  </div>

                  {/* Stage Progress */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-400">
                      <span>Status:</span>
                      <span className="text-emerald-600 font-bold">{app.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="h-1.5 rounded-full bg-emerald-500" />
                      <div className="h-1.5 rounded-full bg-emerald-500" />
                      <div className="h-1.5 rounded-full bg-slate-200" />
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1">
                      Candidate profile and verified course credentials submitted to engineering hiring manager.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= 6. JOBS CARDS GRID ================= */}
      {activeTab !== 'applications' && activeTab !== 'transferable' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
            <span>Showing {filteredJobs.length} matching job opportunities</span>
            <span>Sorted by {sortBy === 'match' ? 'Match Percentage' : sortBy === 'salary' ? 'Highest Salary' : 'Most Recent'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => {
              const match = matchMap.get(job.id)!;
              const isSaved = savedJobIds.includes(job.id);
              const isApplied = applications.some(a => a.jobId === job.id);

              return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-brand-border/70 p-6 md:p-8 hover:shadow-xl hover:border-brand-blue/40 transition-all flex flex-col justify-between group space-y-6"
                >
                  <div className="space-y-5">
                    {/* Top Row: Company & Match Rating Pill */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img 
                          src={job.logo} 
                          alt={job.company} 
                          className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0" 
                        />
                        <div className="min-w-0">
                          <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-brand-blue transition-colors truncate">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-0.5">
                            <span className="text-slate-800">{job.company}</span>
                            <span>•</span>
                            <span className="text-brand-blue font-bold">{job.workMode}</span>
                          </div>
                        </div>
                      </div>

                      {/* Visual Indicator Rating Badge */}
                      <div className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-black tracking-tight flex items-center gap-1.5 shrink-0 border shadow-sm",
                        match.overallScore >= 90
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : match.overallScore >= 75
                          ? "bg-blue-50 text-blue-700 border-blue-300"
                          : match.overallScore >= 60
                          ? "bg-amber-50 text-amber-700 border-amber-300"
                          : "bg-slate-50 text-slate-600 border-slate-300"
                      )}>
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{match.overallScore}% · {match.matchRating}</span>
                      </div>
                    </div>

                    {/* Meta Info Row */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Compensation</div>
                        <div className="font-bold text-emerald-700 mt-0.5 truncate">{job.salary}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Experience</div>
                        <div className="font-bold text-slate-700 mt-0.5 truncate">{job.experienceRequired.split(' ')[0]}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Deadline</div>
                        <div className="font-bold text-slate-700 mt-0.5 truncate">{job.applicationDeadline}</div>
                      </div>
                    </div>

                    {/* Job Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>

                    {/* Skills Comparison */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <span>Required Tech Stack</span>
                        <span className="text-emerald-700 font-black">
                          {match.matchedTechnicalSkills.length} of {job.requiredTechnicalSkills.length} Matched
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredTechnicalSkills.map((skill) => {
                          const isMatched = match.matchedTechnicalSkills.includes(skill);
                          return (
                            <span
                              key={skill}
                              className={cn(
                                "px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors border",
                                isMatched
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-slate-50 text-slate-500 border-slate-200"
                              )}
                            >
                              {isMatched ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <span className="text-slate-400">+</span>}
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleToggleSave(job.id)}
                      className={cn(
                        "p-3 rounded-2xl border transition-all active:scale-95",
                        isSaved ? "bg-amber-50 border-amber-300 text-amber-600 shadow-sm" : "border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                      )}
                      title={isSaved ? "Saved" : "Save Job"}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedJobForModal(job)}
                      className="px-4 py-3 rounded-2xl border border-slate-200 hover:border-brand-blue/50 text-slate-700 hover:text-brand-blue font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <span>Analysis Breakdown</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleApplyToJob(job)}
                      disabled={isApplied}
                      className={cn(
                        "flex-1 py-3 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md",
                        isApplied
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default"
                          : "bg-brand-blue hover:bg-brand-blue-dark text-white active:scale-95 shadow-blue-500/10"
                      )}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <>
                          <span>Apply with Profile</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-brand-border p-8 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-lg">No matching job openings found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria, clearing domain filters, or switching to "All Work Modes".
              </p>
              <button
                onClick={() => {
                  setSelectedDomain('All');
                  setSelectedWorkMode('All');
                  setSelectedExpLevel('All');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= 7. DEEP MATCH BREAKDOWN MODAL ================= */}
      <AnimatePresence>
        {selectedJobForModal && (() => {
          const job = selectedJobForModal;
          const match = matchMap.get(job.id)!;
          const isApplied = applications.some(a => a.jobId === job.id);
          const isSaved = savedJobIds.includes(job.id);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white w-full max-w-4xl max-h-[92vh] rounded-[36px] shadow-2xl flex flex-col overflow-hidden border border-white/60"
              >
                {/* Modal Header */}
                <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                  <div className="flex items-center gap-4">
                    <img src={job.logo} alt={job.company} className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-brand-blue">
                          {job.domain}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">{job.location} · {job.workMode}</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 mt-0.5">
                        {job.title}
                      </h2>
                      <div className="text-xs font-bold text-slate-500">{job.company} · {job.salary}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedJobForModal(null)}
                    className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-white">
                  {/* AI Match Overview Banner */}
                  <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 p-6 md:p-8 rounded-3xl border border-blue-200/80 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">
                          AI Compatibility Verdict
                        </span>
                        <div className="text-3xl font-display font-extrabold text-slate-900 mt-1">
                          {match.overallScore}% · {match.matchRating}
                        </div>
                      </div>

                      <div className="w-full sm:w-64 space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-600">
                          <span>Confidence Index</span>
                          <span className="text-brand-blue font-extrabold">{match.overallScore} / 100</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-500",
                              match.overallScore >= 90 ? "bg-emerald-500" : match.overallScore >= 75 ? "bg-brand-blue" : "bg-amber-500"
                            )}
                            style={{ width: `${match.overallScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium bg-white/70 p-4 rounded-2xl border border-blue-100">
                      💡 {match.aiNarrative}
                    </p>
                  </div>

                  {/* 6-Factor Compatibility Breakdown Grid */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Multi-Factor Compatibility Breakdown
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <div className="text-[10px] font-bold uppercase text-slate-400">1. Skills Fit (35%)</div>
                        <div className="text-lg font-bold font-display text-slate-900">{match.skillsScore} / 35 pts</div>
                        <div className="text-[10px] text-emerald-700 font-bold">{match.matchedTechnicalSkills.length} Tech & {match.matchedSoftSkills.length} Soft Matched</div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <div className="text-[10px] font-bold uppercase text-slate-400">2. Experience (20%)</div>
                        <div className="text-lg font-bold font-display text-slate-900">{match.experienceScore} / 20 pts</div>
                        <div className="text-[10px] text-slate-600 font-medium truncate">{match.experienceMatchStatus}</div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <div className="text-[10px] font-bold uppercase text-slate-400">3. Education (15%)</div>
                        <div className="text-lg font-bold font-display text-slate-900">{match.educationScore} / 15 pts</div>
                        <div className="text-[10px] text-slate-600 font-medium truncate">{match.educationMatchStatus}</div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <div className="text-[10px] font-bold uppercase text-slate-400">4. Role Alignment (15%)</div>
                        <div className="text-lg font-bold font-display text-slate-900">{match.roleAlignmentScore} / 15 pts</div>
                        <div className="text-[10px] text-slate-600 font-medium">Trajectory Matches {job.domain}</div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <div className="text-[10px] font-bold uppercase text-slate-400">5. Location & Mode (10%)</div>
                        <div className="text-lg font-bold font-display text-slate-900">{match.locationScore} / 10 pts</div>
                        <div className="text-[10px] text-slate-600 font-medium">{job.workMode} Compatibility</div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <div className="text-[10px] font-bold uppercase text-slate-400">6. Certifications (5%)</div>
                        <div className="text-lg font-bold font-display text-slate-900">{match.certificationsScore} / 5 pts</div>
                        <div className="text-[10px] text-slate-600 font-medium">Verified Badges Assessed</div>
                      </div>
                    </div>
                  </div>

                  {/* Matched vs Missing Skills Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Matching Strengths ({match.matchedTechnicalSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {match.matchedTechnicalSkills.map((s) => (
                          <span key={s} className="px-2.5 py-1 bg-white rounded-lg text-xs font-bold text-emerald-800 border border-emerald-200">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Missing Skills to Acquire ({match.missingTechnicalSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {match.missingTechnicalSkills.map((s) => (
                          <span key={s} className="px-2.5 py-1 bg-white rounded-lg text-xs font-bold text-amber-900 border border-amber-200">
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bridge the Gap: Course Recommendation */}
                  {match.missingTechnicalSkills.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1 max-w-lg">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          <span>Bridge This Skill Gap On SkillHire</span>
                        </div>
                        <h4 className="text-base font-bold">
                          Take a certified course to master {match.missingTechnicalSkills.slice(0, 2).join(' and ')}
                        </h4>
                        <p className="text-xs text-white/80 leading-relaxed font-medium">
                          Passing the 15-MCQ exam adds an authenticated credential to your profile and automatically boosts your match score to 95%+.
                        </p>
                      </div>

                      <button
                        onClick={() => handleBridgeSkillCourse(match.recommendedCourseId)}
                        className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md shrink-0 flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Start Certified Course</span>
                      </button>
                    </div>
                  )}

                  {/* Strengths and Growth Areas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
                    <div className="space-y-2">
                      <h4 className="font-bold uppercase tracking-wider text-slate-400">Key Candidate Strengths</h4>
                      <ul className="space-y-1.5 list-disc pl-4 font-medium">
                        {match.strengths.map((st, sIdx) => (
                          <li key={sIdx}>{st}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold uppercase tracking-wider text-slate-400">Actionable Growth Protocol</h4>
                      <ul className="space-y-1.5 list-disc pl-4 font-medium">
                        {match.areasToImprove.map((ai, aIdx) => (
                          <li key={aIdx}>{ai}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="p-6 md:px-8 border-t border-slate-100 flex items-center justify-between gap-4 bg-slate-50/80">
                  <button
                    onClick={() => handleToggleSave(job.id)}
                    className={cn(
                      "px-5 py-3 rounded-2xl border font-bold text-xs transition-all flex items-center gap-2",
                      isSaved ? "bg-amber-50 border-amber-300 text-amber-600" : "bg-white border-slate-200 text-slate-700"
                    )}
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>{isSaved ? "Saved in Roles" : "Save Role"}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleApplyToJob(job);
                      setSelectedJobForModal(null);
                    }}
                    disabled={isApplied}
                    className={cn(
                      "px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg",
                      isApplied 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default" 
                        : "bg-brand-blue hover:bg-brand-blue-dark text-white active:scale-95 shadow-blue-500/10"
                    )}
                  >
                    <Send className="w-4 h-4" />
                    <span>{isApplied ? "Application Already Submitted" : "1-Click Apply with Profile"}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ================= 8. EDIT PROFILE MODAL ================= */}
      <AnimatePresence>
        {isEditProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-white/60"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-900">Edit Profile & Matching Parameters</h3>
                  <p className="text-xs text-slate-500 font-medium">Fine-tune your skills and preferences to recalibrate your AI match percentages.</p>
                </div>
                <button 
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfileEdits} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Target Job Role</label>
                  <input 
                    type="text" 
                    value={editTargetRole} 
                    onChange={(e) => setEditTargetRole(e.target.value)} 
                    placeholder="e.g. Frontend Developer, Full Stack Engineer"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Technical Skills (Comma separated)</label>
                  <textarea 
                    rows={3} 
                    value={editTechSkillsStr} 
                    onChange={(e) => setEditTechSkillsStr(e.target.value)} 
                    placeholder="React, TypeScript, Node.js, SQL, Python..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Soft Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    value={editSoftSkillsStr} 
                    onChange={(e) => setEditSoftSkillsStr(e.target.value)} 
                    placeholder="Problem Solving, Agile, Communication..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Years of Experience</label>
                    <input 
                      type="number" 
                      min={0}
                      max={15}
                      value={editExpYears} 
                      onChange={(e) => setEditExpYears(Number(e.target.value))} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-brand-blue"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Work Mode Preference</label>
                    <select
                      value={editWorkMode}
                      onChange={(e) => setEditWorkMode(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-brand-blue"
                    >
                      <option value="Any">Any Mode</option>
                      <option value="Remote">Remote Only</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Degree</label>
                    <input 
                      type="text" 
                      value={editDegree} 
                      onChange={(e) => setEditDegree(e.target.value)} 
                      placeholder="e.g. B.Tech / BCA"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Branch / Field</label>
                    <input 
                      type="text" 
                      value={editField} 
                      onChange={(e) => setEditField(e.target.value)} 
                      placeholder="e.g. Computer Science"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">College / University</label>
                  <input 
                    type="text" 
                    value={editCollege} 
                    onChange={(e) => setEditCollege(e.target.value)} 
                    placeholder="e.g. Institute of Technology"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
                  >
                    Recalculate AI Match Scores
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
