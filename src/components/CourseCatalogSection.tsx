import React, { useState, useMemo } from 'react';
import { Course, QuizQuestion } from '../types';
import { CourseCard } from './CourseCard';
import { generateCustomCourse } from '../services/ai';
import { 
  Search, 
  Sparkles, 
  PlusCircle, 
  Layers, 
  Code2, 
  Briefcase, 
  Filter, 
  CheckCircle, 
  Loader2, 
  X, 
  BookOpen, 
  Compass,
  Laptop,
  Palette,
  TrendingUp,
  BrainCircuit,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CourseCatalogSectionProps {
  courses: Course[];
  enrollments: Record<string, { progress: number; status: string }>;
  completedCourses: string[];
  onEnroll: (courseId: string) => void;
  onComplete: (courseId: string, score: number) => void;
  onView: (course: Course) => void;
  userName: string;
  onAddCustomCourse: (course: Course) => void;
  isEmployee?: boolean;
}

export default function CourseCatalogSection({
  courses,
  enrollments,
  completedCourses,
  onEnroll,
  onComplete,
  onView,
  userName,
  onAddCustomCourse,
  isEmployee = false
}: CourseCatalogSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Technical' | 'Non-Technical'>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  
  // AI Generator Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState<'Technical' | 'Non-Technical'>('Technical');
  const [aiDifficulty, setAiDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState<string | null>(null);

  // Manual Course Modal (for Instructor / Employee)
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualDomain, setManualDomain] = useState('Engineering');
  const [manualCategory, setManualCategory] = useState<'Technical' | 'Non-Technical'>('Technical');

  // Available unique domains from current courses
  const domains = useMemo(() => {
    const list = Array.from(new Set(courses.map(c => c.domain)));
    return ['All', ...list];
  }, [courses]);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Category filter
      if (selectedCategory !== 'All' && course.category && course.category !== selectedCategory) {
        return false;
      }
      // Domain filter
      if (selectedDomain !== 'All' && course.domain !== selectedDomain) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesDesc = course.description.toLowerCase().includes(q);
        const matchesDomain = course.domain.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesDomain;
      }
      return true;
    });
  }, [courses, selectedCategory, selectedDomain, searchQuery]);

  const handleGenerateAiCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationSuccess(null);

    try {
      const newCourse = await generateCustomCourse(aiTopic.trim(), aiCategory, aiDifficulty);
      onAddCustomCourse(newCourse);
      setGenerationSuccess(`Course "${newCourse.title}" successfully created with 15 verified quiz questions!`);
      setTimeout(() => {
        setIsAiModalOpen(false);
        setAiTopic('');
        setGenerationSuccess(null);
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateManualCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const newCourse: Course = {
      id: `manual-${Date.now().toString().slice(-5)}`,
      title: manualTitle.trim(),
      description: manualDesc.trim() || `Instructor-curated curriculum for ${manualTitle.trim()}.`,
      image: manualCategory === 'Non-Technical'
        ? "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60"
        : "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
      duration: "6 Hours",
      difficulty: "Intermediate",
      domain: manualDomain,
      category: manualCategory,
      points: 1200,
      theoryPages: [],
      quiz: Array.from({ length: 15 }, (_, i) => ({
        question: `Module Assessment Question ${i + 1} for ${manualTitle}: What represents industry best practice?`,
        options: [
          `Implementing standard architecture principles and verifying edge cases for ${manualTitle}`,
          "Bypassing compliance and quality guidelines",
          "Working without automated regression testing",
          "Hardcoding production credentials"
        ],
        correctAnswer: 0
      })),
      passingScore: 12
    };

    onAddCustomCourse(newCourse);
    setIsManualModalOpen(false);
    setManualTitle('');
    setManualDesc('');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-blue-500/10">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Unlimited Learning Catalog · Technical & Non-Technical</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight">
              Curriculum & Skill Mastery
            </h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed font-medium">
              Explore 15+ verified domains or generate a custom AI curriculum on any topic in seconds with instant PDF certification.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Generate Course with AI ✨</span>
            </button>

            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-2xl font-bold text-xs uppercase tracking-wider backdrop-blur-md flex items-center gap-2 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>{isEmployee ? "Create Corporate Course" : "Add Custom Topic"}</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-extrabold font-display">{courses.length} Available</div>
            <div className="text-xs text-white/70">Courses & Certifications</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-display">15 MCQs</div>
            <div className="text-xs text-white/70">Per Course Exam</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-display">Verifiable</div>
            <div className="text-xs text-white/70">Instant PDF Certificates</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-display">On-Demand</div>
            <div className="text-xs text-white/70">AI Course Synthesizer</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-brand-border/60 shadow-sm space-y-5">
        {/* Row 1: Search & Major Category Tabs */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search across React, Cloud, Figma, Marketing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-brand-cream/40 border border-brand-border rounded-2xl text-sm font-medium outline-none focus:border-brand-blue focus:bg-white transition-all"
            />
          </div>

          {/* Major Category Segmented Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full md:w-auto">
            {[
              { id: 'All', label: 'All Catalog', icon: Layers },
              { id: 'Technical', label: 'Technical (Coding & Cloud)', icon: Laptop },
              { id: 'Non-Technical', label: 'Non-Technical (Business & Design)', icon: Palette },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={cn(
                  "flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all",
                  selectedCategory === cat.id
                    ? "bg-white text-brand-blue shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <cat.icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Sub-domain Pill Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0 mr-1">Domain:</span>
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border",
                selectedDomain === domain
                  ? "bg-brand-blue border-brand-blue text-white shadow-sm"
                  : "bg-white border-brand-border text-slate-600 hover:border-brand-blue/30"
              )}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-brand-border p-16 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No matching curriculum found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Can't find what you're looking for? Generate this topic immediately with our AI!
          </p>
          <button
            onClick={() => {
              setAiTopic(searchQuery || 'Custom Topic');
              setIsAiModalOpen(true);
            }}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate "{searchQuery || 'Custom Topic'}" with AI</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="relative flex flex-col justify-between">
              {/* Category indicator pill */}
              <div className="absolute top-4 right-4 z-10">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm",
                  course.category === 'Non-Technical'
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                )}>
                  {course.category || 'Technical'}
                </span>
              </div>

              <CourseCard 
                course={course} 
                isEnrolled={!!enrollments[course.id]}
                isCompleted={completedCourses.includes(course.id)}
                progress={enrollments[course.id]?.progress || 0}
                onEnroll={onEnroll}
                onComplete={onComplete}
                onView={onView}
                userName={userName}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Generate AI Course */}
      <AnimatePresence>
        {isAiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg p-8 rounded-[36px] shadow-2xl border border-slate-200 relative"
            >
              <button
                onClick={() => !isGenerating && setIsAiModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-xl text-slate-900 leading-tight">
                    On-Demand AI Course Creator
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Type any technical or non-technical topic in the world.
                  </p>
                </div>
              </div>

              {generationSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-emerald-800">{generationSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleGenerateAiCourse} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Course Topic or Technology
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g., Kubernetes, Graphic Design, Prompt Engineering, Financial Analysis"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      required
                      disabled={isGenerating}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-indigo-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Category
                      </label>
                      <select
                        value={aiCategory}
                        onChange={(e) => setAiCategory(e.target.value as any)}
                        disabled={isGenerating}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-indigo-600"
                      >
                        <option value="Technical">💻 Technical (Coding/Cloud)</option>
                        <option value="Non-Technical">💼 Non-Technical (Business/Design)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Difficulty
                      </label>
                      <select
                        value={aiDifficulty}
                        onChange={(e) => setAiDifficulty(e.target.value as any)}
                        disabled={isGenerating}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-indigo-600"
                      >
                        <option value="Beginner">Beginner Level</option>
                        <option value="Intermediate">Intermediate Level</option>
                        <option value="Advanced">Advanced Level</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>Automatic Curriculum Generation:</span>
                    </div>
                    <p className="text-[11px] text-indigo-700 leading-relaxed">
                      AI will automatically structure learning modules, curriculum outline, and 15 multiple-choice exam questions with verifiable PDF certification upon 80% score.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!aiTopic.trim() || isGenerating}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Synthesizing 15 Exam Questions & Modules...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate & Add to Catalog</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Manual Add Course (for Employee / Instructor) */}
      <AnimatePresence>
        {isManualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg p-8 rounded-[36px] shadow-2xl border border-slate-200 relative"
            >
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <PlusCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-xl text-slate-900 leading-tight">
                    Publish Course Curriculum
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Add custom company or university training programs.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateManualCourse} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Course Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Corporate Cybersecurity Policies or Advanced Product Analytics"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
                  <textarea 
                    placeholder="Key concepts, goals, and methodologies taught..."
                    value={manualDesc}
                    onChange={(e) => setManualDesc(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:border-blue-600 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
                    <select
                      value={manualCategory}
                      onChange={(e) => setManualCategory(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-600"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Non-Technical">Non-Technical</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Domain Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Design, Cloud, Management"
                      value={manualDomain}
                      onChange={(e) => setManualDomain(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-200 transition-all active:scale-95 mt-2"
                >
                  Publish to Platform Catalog
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
