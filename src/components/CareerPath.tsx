import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Map, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  AlertCircle,
  Briefcase,
  Clock,
  TrendingUp,
  Building2,
  ExternalLink,
  GraduationCap,
  Hammer,
  RotateCcw,
  Award,
  Layers,
  CheckSquare,
  Square
} from 'lucide-react';
import { generateRoadmap, RoadmapStep } from '../services/ai';
import { CAREER_ROADMAPS, CareerRoadmapData, RoadmapMilestone } from '../data/careerRoadmaps';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface CareerPathProps {
  skills?: string[];
  currentDomain?: string;
  userProfile?: any;
  onUpdateProfile?: (updated: any) => void;
  onNavigateToCourse?: (courseId: string) => void;
}

export default function CareerPath({ 
  skills = [], 
  currentDomain = 'Full Stack Development',
  userProfile,
  onUpdateProfile,
  onNavigateToCourse
}: CareerPathProps) {
  // Mode: curated roadmaps vs AI customized generator
  const [activeMode, setActiveMode] = useState<'curated' | 'ai_custom'>('curated');
  
  // Selected curated career roadmap
  const [selectedCareerId, setSelectedCareerId] = useState<string>('frontend-dev');
  const [filterLevel, setFilterLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  
  // Completed skills set per career ID
  const [completedSkills, setCompletedSkills] = useState<{ [skillKey: string]: boolean }>({});
  const [isSaving, setIsSaving] = useState(false);

  // AI Custom Generator state
  const [customRoadmap, setCustomRoadmap] = useState<RoadmapStep[] | null>(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [customTargetDomain, setCustomTargetDomain] = useState(currentDomain || 'Frontend Engineer');
  const [customError, setCustomError] = useState<string | null>(null);

  const selectedCareer: CareerRoadmapData = 
    CAREER_ROADMAPS.find(c => c.id === selectedCareerId) || CAREER_ROADMAPS[0];

  // Load completed skills from userProfile or localStorage on mount/career switch
  useEffect(() => {
    const storageKey = `skillhire_roadmap_${userProfile?.uid || 'guest'}_${selectedCareerId}`;
    const savedLocal = localStorage.getItem(storageKey);
    let initialMap: { [key: string]: boolean } = {};

    if (userProfile?.roadmapProgress?.[selectedCareerId]) {
      const arr = userProfile.roadmapProgress[selectedCareerId] as string[];
      arr.forEach(s => { initialMap[s] = true; });
    } else if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        initialMap = parsed;
      } catch (e) {
        initialMap = {};
      }
    }
    setCompletedSkills(initialMap);
  }, [selectedCareerId, userProfile?.uid]);

  // Compute progress stats
  const allSkillsInCareer: string[] = selectedCareer.milestones.flatMap(m => m.skillsToAcquire);
  const totalSkillsCount = allSkillsInCareer.length;
  const completedCount = allSkillsInCareer.filter(s => completedSkills[`${selectedCareerId}_${s}`] || completedSkills[s]).length;
  const progressPercent = totalSkillsCount > 0 ? Math.round((completedCount / totalSkillsCount) * 100) : 0;

  // Toggle individual skill completion
  const handleToggleSkill = async (milestoneId: string, skillName: string) => {
    const skillKey = `${selectedCareerId}_${skillName}`;
    const currentStatus = !!completedSkills[skillKey];
    const updated = { ...completedSkills, [skillKey]: !currentStatus, [skillName]: !currentStatus };
    setCompletedSkills(updated);

    // Save to localStorage
    const storageKey = `skillhire_roadmap_${userProfile?.uid || 'guest'}_${selectedCareerId}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Save to Firestore if user is authenticated
    if (userProfile?.uid) {
      setIsSaving(true);
      try {
        const completedList = Object.keys(updated).filter(k => updated[k] && k.startsWith(`${selectedCareerId}_`)).map(k => k.replace(`${selectedCareerId}_`, ''));
        const userRef = doc(db, 'users', userProfile.uid);
        await updateDoc(userRef, {
          [`roadmapProgress.${selectedCareerId}`]: completedList,
          lastActiveRoadmap: selectedCareerId,
          lastRoadmapUpdated: new Date().toISOString()
        });
        if (onUpdateProfile) {
          onUpdateProfile({
            ...userProfile,
            roadmapProgress: {
              ...(userProfile.roadmapProgress || {}),
              [selectedCareerId]: completedList
            }
          });
        }
      } catch (err) {
        console.warn("Could not sync roadmap progress with Firestore, saved to local storage.", err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleResetProgress = async () => {
    if (!window.confirm("Are you sure you want to reset your progress for this career roadmap?")) return;
    const cleared = {};
    setCompletedSkills(cleared);
    const storageKey = `skillhire_roadmap_${userProfile?.uid || 'guest'}_${selectedCareerId}`;
    localStorage.removeItem(storageKey);

    if (userProfile?.uid) {
      try {
        const userRef = doc(db, 'users', userProfile.uid);
        await updateDoc(userRef, {
          [`roadmapProgress.${selectedCareerId}`]: []
        });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // AI Custom Generator handler
  const handleGenerateCustomRoadmap = async () => {
    setCustomLoading(true);
    setCustomError(null);
    try {
      const data = await generateRoadmap(skills, customTargetDomain);
      setCustomRoadmap(data);
    } catch (err: any) {
      console.error(err);
      setCustomError(err.message || "Failed to generate custom roadmap. Please try again.");
    } finally {
      setCustomLoading(false);
    }
  };

  const filteredMilestones = filterLevel === 'All' 
    ? selectedCareer.milestones 
    : selectedCareer.milestones.filter(m => m.level === filterLevel);

  return (
    <div className="space-y-8">
      {/* Top Banner Navigation: Mode Switcher */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-brand-border/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Map className="w-3.5 h-3.5" /> Interactive Learning Architect
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-brand-blue-heading tracking-tight">
            Career Learning Roadmaps
          </h2>
          <p className="text-brand-muted text-sm mt-1 max-w-2xl font-medium">
            Select an industry career path or generate a personalized AI trajectory tailored to your skill topology. Check off milestones as you learn.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-[#f1f5f9] p-1.5 rounded-2xl border border-brand-border/60 shrink-0">
          <button
            onClick={() => setActiveMode('curated')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeMode === 'curated'
                ? 'bg-white text-brand-blue-heading shadow-sm'
                : 'text-brand-muted hover:text-brand-ink'
            }`}
          >
            <Layers className="w-4 h-4 text-brand-blue" />
            Curated Career Paths
          </button>
          <button
            onClick={() => setActiveMode('ai_custom')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeMode === 'ai_custom'
                ? 'bg-white text-brand-blue-heading shadow-sm'
                : 'text-brand-muted hover:text-brand-ink'
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-blue" />
            AI Custom Oracle
          </button>
        </div>
      </div>

      {activeMode === 'curated' ? (
        <div className="space-y-8">
          {/* 10 Career Quick Selection Bar */}
          <div className="bg-white p-5 rounded-[28px] border border-brand-border/50 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3 flex items-center justify-between">
              <span>Choose Your Target Specialization ({CAREER_ROADMAPS.length} Roles)</span>
              {isSaving && <span className="text-[11px] text-brand-blue flex items-center gap-1 font-semibold"><Loader2 className="w-3 h-3 animate-spin" /> Saving progress...</span>}
            </p>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {CAREER_ROADMAPS.map((career) => {
                const isSelected = career.id === selectedCareerId;
                return (
                  <button
                    key={career.id}
                    onClick={() => setSelectedCareerId(career.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 flex items-center gap-2 ${
                      isSelected
                        ? 'bg-brand-blue text-white border-brand-blue shadow-[0_8px_16px_-4px_rgba(26,110,245,0.4)] scale-[1.02]'
                        : 'bg-white text-brand-ink border-brand-border/80 hover:border-brand-blue/40 hover:bg-[#f8fafc]'
                    }`}
                  >
                    <span>{career.role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Career Overview Card */}
          <div className="bg-gradient-to-br from-white via-white to-blue-50/40 p-8 rounded-[32px] border border-brand-border/60 shadow-sm relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-bold rounded-full">
                    {selectedCareer.domain}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {selectedCareer.averageSalary}
                  </span>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedCareer.estimatedDuration}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-brand-blue-heading tracking-tight">
                  {selectedCareer.role}
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed font-medium">
                  {selectedCareer.overview}
                </p>

                {/* Top Hiring Companies */}
                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-brand-muted flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> Top Recruiters:
                  </span>
                  {selectedCareer.hiringCompanies.map((c, i) => (
                    <span key={i} className="text-xs font-semibold bg-white px-2.5 py-1 rounded-lg border border-brand-border text-brand-ink">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Ring / Meter Card */}
              <div className="bg-white p-6 rounded-3xl border border-brand-border/70 shadow-sm flex flex-col items-center justify-center min-w-[240px] text-center shrink-0">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#f1f5f9"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#1a6ef5"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-display font-bold text-brand-blue-heading leading-none">
                      {progressPercent}%
                    </span>
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mt-0.5">
                      Completed
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-xs font-bold text-brand-blue-heading">
                  {completedCount} of {totalSkillsCount} Skills Mastered
                </div>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  {progressPercent === 100 ? '🎉 All milestones finished!' : 'Check skills off as you practice'}
                </p>

                {completedCount > 0 && (
                  <button
                    onClick={handleResetProgress}
                    className="mt-3 text-[11px] text-brand-muted hover:text-red-600 flex items-center gap-1 font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Progress
                  </button>
                )}
              </div>
            </div>

            {/* Required Skills Overview Breakdown */}
            <div className="mt-8 pt-6 border-t border-brand-border/50 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-brand-blue" /> Core Technical Competencies
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.requiredTechnicalSkills.map((sk, idx) => {
                    const isCandidateSkill = skills.some(s => s.toLowerCase() === sk.toLowerCase() || sk.toLowerCase().includes(s.toLowerCase()));
                    return (
                      <span
                        key={idx}
                        className={`text-xs px-3 py-1 rounded-xl font-semibold border flex items-center gap-1.5 ${
                          isCandidateSkill
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-white text-brand-ink border-brand-border/70'
                        }`}
                      >
                        {isCandidateSkill && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {sk}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-blue" /> Essential Soft Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.requiredSoftSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-xl font-semibold bg-white text-brand-muted border border-brand-border/70"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2">
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    filterLevel === lvl
                      ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                      : 'bg-white text-brand-muted border-brand-border hover:text-brand-ink hover:bg-[#f8fafc]'
                  }`}
                >
                  {lvl} Milestones
                </button>
              ))}
            </div>

            <div className="text-xs font-medium text-brand-muted">
              Showing <span className="font-bold text-brand-blue-heading">{filteredMilestones.length}</span> learning phases
            </div>
          </div>

          {/* Interactive Milestone Timeline */}
          <div className="space-y-8 relative">
            {filteredMilestones.map((milestone, idx) => {
              const milestoneSkills = milestone.skillsToAcquire;
              const milestoneCompletedCount = milestoneSkills.filter(s => completedSkills[`${selectedCareerId}_${s}`] || completedSkills[s]).length;
              const isMilestoneDone = milestoneSkills.length > 0 && milestoneCompletedCount === milestoneSkills.length;

              const levelColor = 
                milestone.level === 'Beginner' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                milestone.level === 'Intermediate' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                'text-purple-700 bg-purple-50 border-purple-200';

              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex gap-6 group"
                >
                  {/* Timeline Index Icon */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-sm shadow-sm border-2 transition-all ${
                      isMilestoneDone
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200'
                        : 'bg-white text-brand-blue border-brand-blue/30 group-hover:border-brand-blue'
                    }`}>
                      {isMilestoneDone ? <CheckCircle2 className="w-6 h-6" /> : `0${idx + 1}`}
                    </div>
                    {idx !== filteredMilestones.length - 1 && (
                      <div className="w-[2px] flex-1 bg-gradient-to-b from-brand-border to-brand-border/20 my-2" />
                    )}
                  </div>

                  {/* Milestone Card Body */}
                  <div className={`flex-1 bg-white p-7 sm:p-8 rounded-[30px] border transition-all ${
                    isMilestoneDone ? 'border-emerald-200 shadow-sm' : 'border-brand-border/60 hover:border-brand-blue/40 shadow-sm hover:shadow-md'
                  }`}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-brand-border/40">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${levelColor}`}>
                            {milestone.level}
                          </span>
                          <span className="text-xs font-bold text-brand-muted flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {milestone.duration}
                          </span>
                        </div>
                        <h4 className="text-xl font-display font-bold text-brand-blue-heading tracking-tight">
                          {milestone.title}
                        </h4>
                      </div>

                      {/* Milestone completion badge */}
                      <div className="text-right">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isMilestoneDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {milestoneCompletedCount} / {milestoneSkills.length} Checked
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-brand-muted font-medium mt-4 leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Interactive Skills Checklist */}
                    <div className="mt-6 pt-6 border-t border-brand-border/40">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-brand-blue" /> Target Skills (Click to check off as mastered)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {milestone.skillsToAcquire.map((skill, sIdx) => {
                          const isDone = !!(completedSkills[`${selectedCareerId}_${skill}`] || completedSkills[skill]);
                          return (
                            <button
                              key={sIdx}
                              onClick={() => handleToggleSkill(milestone.id, skill)}
                              className={`p-3 rounded-2xl border text-left text-xs font-bold flex items-center gap-3 transition-all ${
                                isDone 
                                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 shadow-xs' 
                                  : 'bg-[#fcfdfd] border-brand-border/70 text-brand-ink hover:border-brand-blue/50 hover:bg-white'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                                isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white text-transparent'
                              }`}>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                              <span className={isDone ? 'line-through text-emerald-800' : ''}>
                                {skill}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Practical Project Card */}
                    {milestone.practicalProject && (
                      <div className="mt-6 p-5 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-brand-border/70">
                        <div className="flex items-center gap-2 text-xs font-bold text-brand-blue-heading uppercase tracking-wider mb-1.5">
                          <Hammer className="w-4 h-4 text-brand-blue" /> Milestone Capstone Project
                        </div>
                        <h5 className="text-base font-bold text-brand-blue-heading">
                          {milestone.practicalProject.title}
                        </h5>
                        <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                          {milestone.practicalProject.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {milestone.practicalProject.deliverables.map((del, dIdx) => (
                            <span key={dIdx} className="text-[11px] font-semibold bg-white px-2.5 py-1 rounded-lg border border-brand-border text-slate-700">
                              ✓ {del}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Course & Learning Resources */}
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-brand-border/40">
                      {/* Course Link */}
                      {milestone.recommendedCourseTitle && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0 text-brand-blue">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Recommended Course</span>
                            <p className="text-xs font-bold text-brand-blue-heading">{milestone.recommendedCourseTitle}</p>
                          </div>
                          {onNavigateToCourse && (
                            <button
                              onClick={() => onNavigateToCourse(milestone.recommendedCourseId || 'web-dev-101')}
                              className="ml-2 px-3.5 py-1.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-blue-dark transition-all shadow-xs"
                            >
                              Learn Course
                            </button>
                          )}
                        </div>
                      )}

                      {/* External resources */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {milestone.resources.map((res, rIdx) => (
                          <a
                            key={rIdx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-ink hover:text-brand-blue hover:border-brand-blue/40 transition-all flex items-center gap-1.5 shadow-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-brand-blue" />
                            {res.title}
                            <ExternalLink className="w-3 h-3 text-brand-muted" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* AI Custom Career Oracle Generator */
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-brand-border/60 flex items-center justify-between gap-6 flex-wrap shadow-sm">
            <div className="space-y-1 max-w-xl">
              <h3 className="text-2xl font-display font-bold text-brand-blue-heading tracking-tight leading-tight">
                AI Career Path Generator
              </h3>
              <p className="text-brand-muted text-sm font-medium leading-relaxed">
                Provide your custom target career domain. Our neural career oracle analyzes your existing skill graph ({skills.length} skills found) and constructs a multi-month roadmap.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <select 
                value={customTargetDomain}
                onChange={(e) => setCustomTargetDomain(e.target.value)}
                className="px-5 py-3 bg-[#f8fafc] border border-brand-border rounded-2xl text-xs font-bold text-brand-blue-heading outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all shadow-sm"
              >
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend Specialist">Backend Specialist</option>
                <option value="Full Stack Architect">Full Stack Architect</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="DevOps Professional">DevOps Professional</option>
                <option value="Mobile App Developer">Mobile App Developer</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                <option value="Cloud Architect">Cloud Architect</option>
              </select>
              <button 
                onClick={handleGenerateCustomRoadmap}
                disabled={customLoading}
                className="px-8 py-3 bg-brand-blue text-white rounded-2xl font-bold text-sm shadow-[0_15px_30px_-10px_rgba(26,110,245,0.4)] hover:bg-brand-blue-dark transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
              >
                {customLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Trajectory
              </button>
            </div>
          </div>

          {customError && (
            <div className="p-5 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-start gap-4 text-xs font-medium leading-relaxed shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase tracking-widest text-red-800 text-[10px]">Generation Error</p>
                <p>{customError}</p>
              </div>
            </div>
          )}

          {customLoading && !customRoadmap && (
            <div className="py-24 flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-full border-4 border-brand-blue/10 border-t-brand-blue animate-spin" />
              <p className="text-brand-muted font-bold uppercase tracking-widest text-xs animate-pulse">
                Architecting Potential Knowledge Graph Nodes...
              </p>
            </div>
          )}

          {customRoadmap && (
            <div className="space-y-8">
              {customRoadmap.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-8 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white border-2 border-brand-blue rounded-full flex items-center justify-center font-display font-bold text-brand-blue shadow-[0_5px_15px_-5px_rgba(26,110,245,0.4)] shrink-0 z-10">
                      {idx + 1}
                    </div>
                    {idx !== customRoadmap.length - 1 && <div className="w-[3px] flex-1 bg-brand-blue/10 my-2 rounded-full" />}
                  </div>
                  
                  <div className="flex-1 bg-white p-8 rounded-[28px] border border-brand-border/60 hover:border-brand-blue/30 transition-all group-hover:shadow-lg group-hover:shadow-brand-blue/5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Map className="w-16 h-16 text-brand-blue -rotate-12" />
                    </div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-brand-blue mb-1 block">{step.month}</span>
                        <h4 className="text-[20px] font-display font-bold text-brand-blue-heading leading-tight tracking-tight">{step.focus}</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      <div className="space-y-4">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-muted flex items-center gap-2.5">
                          <BookOpen className="w-4 h-4 text-brand-blue" /> Knowledge Graph
                        </p>
                        <ul className="space-y-2.5">
                          {step.topics.map((topic, i) => (
                            <li key={i} className="text-sm font-medium text-brand-ink flex items-center gap-3">
                              <span className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0" /> {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-muted flex items-center gap-2.5">
                          <ArrowRight className="w-4 h-4 text-brand-blue" /> Strategic Growth
                        </p>
                        <ul className="space-y-2.5">
                          {step.resources.map((res, i) => (
                            <li key={i} className="text-sm font-medium text-brand-muted italic flex items-center gap-3 bg-[#f8fafc] px-4 py-2 rounded-xl border border-brand-border/40">
                               {res}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
