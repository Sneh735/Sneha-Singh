import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  Download, 
  Clock, 
  BookOpen,
  Video,
  Code2,
  Sparkles,
  Send,
  Loader2,
  Check,
  Copy,
  RotateCcw,
  X,
  Award
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Course, CourseModule } from '../types';
import { getCourseModules, getCourseVideoUrl } from '../data/courseModules';
import { askCourseAiTutor } from '../services/ai';
import jsPDF from 'jspdf';

interface CourseContentProps {
  course: Course;
  onClose: () => void;
  onComplete: (courseId: string, score: number) => void;
  userName: string;
}

export default function CourseContent({ course, onClose, onComplete, userName }: CourseContentProps) {
  // Navigation Modes: 'learn' | 'quiz' | 'result'
  const [step, setStep] = useState<'learn' | 'quiz' | 'result'>('learn');
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [completedModules, setCompletedModules] = useState<number[]>([0]);

  // AI Tutor State
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorAnswer, setTutorAnswer] = useState<string | null>(null);
  const [isAskingTutor, setIsAskingTutor] = useState(false);

  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [generatingCert, setGeneratingCert] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState(0);

  // Resolved Modules & Video
  const modules = useMemo(() => getCourseModules(course), [course]);
  const videoUrl = useMemo(() => getCourseVideoUrl(course), [course]);
  const currentModule: CourseModule = modules[activeModuleIndex] || modules[0];

  // Shuffle quiz questions on mount or attempt restart
  const shuffledQuiz = useMemo(() => {
    return [...course.quiz].sort(() => Math.random() - 0.5);
  }, [course.quiz, quizAttempt]);

  // Quiz Timer
  useEffect(() => {
    if (step !== 'quiz' || isTimeUp) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          setStep('result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, isTimeUp]);

  const correctAnswersCount = answers.reduce((acc, ans, idx) => {
    return acc + (ans === shuffledQuiz[idx]?.correctAnswer ? 1 : 0);
  }, 0);

  const marks = Math.round((correctAnswersCount / shuffledQuiz.length) * 100);
  const passingMarks = 80;
  const isPassed = marks >= passingMarks;

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledQuiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep('result');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuestion.trim() || isAskingTutor) return;

    setIsAskingTutor(true);
    setTutorAnswer(null);

    try {
      const response = await askCourseAiTutor(course.title, currentModule.title, tutorQuestion.trim());
      setTutorAnswer(response);
    } catch (err) {
      console.error(err);
      setTutorAnswer("Could not reach AI Tutor at this moment. Please review the module notes above!");
    } finally {
      setIsAskingTutor(false);
    }
  };

  const handleSelectModule = (index: number) => {
    setActiveModuleIndex(index);
    if (!completedModules.includes(index)) {
      setCompletedModules(prev => [...prev, index]);
    }
    setTutorAnswer(null);
    setTutorQuestion('');
  };

  const generateCertificate = () => {
    setGeneratingCert(true);
    const certID = "STH-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600]
    });

    // Outer Border
    doc.setFillColor(26, 110, 245); // Brand Blue
    doc.rect(0, 0, 800, 600, 'F');
    
    // Inner Background
    doc.setFillColor(255, 255, 255);
    doc.rect(20, 20, 760, 560, 'F');
    
    // Decorative lines
    doc.setDrawColor(26, 110, 245);
    doc.setLineWidth(2);
    doc.rect(30, 30, 740, 540);
    doc.setLineWidth(0.5);
    doc.rect(35, 35, 730, 530);

    // Content
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.text("SKILL TO HIRE", 400, 100, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.text("PROFESSIONAL CERTIFICATION", 400, 130, { align: 'center' });

    doc.setDrawColor(26, 110, 245);
    doc.setLineWidth(3);
    doc.line(300, 150, 500, 150);

    doc.setFontSize(18);
    doc.text("This document validates the successful domain mastery of", 400, 200, { align: 'center' });

    doc.setFontSize(46);
    doc.setTextColor(26, 110, 245);
    doc.setFont("helvetica", "bold");
    doc.text(userName.toUpperCase(), 400, 260, { align: 'center' });

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("in the verified curriculum program", 400, 310, { align: 'center' });

    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text(course.title.toUpperCase(), 400, 360, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.text(`Authenticated Score: ${marks}/100 Grade (Threshold: ${passingMarks}%)`, 400, 400, { align: 'center' });
    doc.text(`Completion Date: ${date} | Certificate ID: ${certID}`, 400, 420, { align: 'center' });

    // Signatures
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(1);
    doc.line(150, 500, 350, 500);
    doc.line(450, 500, 650, 500);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("SKILLTOHIRE ACADEMIC VERIFICATION", 250, 515, { align: 'center' });
    doc.text("OFFICIAL COUNCIL SIGNATURE", 550, 515, { align: 'center' });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(16);
    doc.text("Sneha Singh (Council Chair)", 250, 490, { align: 'center' });
    doc.text("Skill2Career Council", 550, 490, { align: 'center' });

    doc.save(`STH_Certificate_${course.id}.pdf`);
    setGeneratingCert(false);
  };

  const handleFinish = () => {
    if (isPassed) {
      onComplete(course.id, marks);
      onClose();
    } else {
      setQuizAttempt(prev => prev + 1);
      setCurrentQuestion(0);
      setAnswers([]);
      setTimeLeft(1200);
      setIsTimeUp(false);
      setStep('learn'); // Return to learning to study again
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-6xl h-[94vh] rounded-[32px] sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-white/60"
      >
        {/* Top Header */}
        <div className="p-5 md:px-8 border-b border-brand-border/40 flex flex-wrap justify-between items-center bg-slate-50/70 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2.5 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-brand-border text-slate-500 hover:text-brand-blue active:scale-95 shadow-sm"
              title="Close modal"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {course.domain}
                </span>
                {course.category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {course.category}
                  </span>
                )}
              </div>
              <h2 className="text-lg md:text-xl font-display font-bold text-brand-blue-heading tracking-tight leading-snug mt-0.5">
                {course.title}
              </h2>
            </div>
          </div>

          {/* Center Tabs: Learn vs Exam */}
          <div className="flex bg-slate-200/80 p-1 rounded-2xl border border-slate-300/60 text-xs font-bold">
            <button
              onClick={() => setStep('learn')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
                step === 'learn'
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. Study Curriculum</span>
            </button>
            <button
              onClick={() => {
                setStep('quiz');
                setCurrentQuestion(0);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
                step === 'quiz' || step === 'result'
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>2. 15-MCQ Exam</span>
            </button>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-3">
            {step === 'quiz' && (
              <div className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-sm transition-colors text-xs font-bold tabular-nums",
                timeLeft < 120 ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-white border-brand-border text-slate-800"
              )}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 border border-amber-200/60 rounded-full text-amber-700 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{course.points} XP CREDIT</span>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {/* ===================== STEP 1: STUDY & LEARN ===================== */}
            {step === 'learn' && (
              <motion.div 
                key="learn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col md:flex-row overflow-hidden"
              >
                {/* Left Sidebar: Modules Navigation */}
                <div className="w-full md:w-80 bg-slate-50/70 border-r border-brand-border/40 p-4 md:p-6 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Course Modules ({modules.length})
                      </span>
                      <span className="text-[11px] font-bold text-brand-blue">
                        {completedModules.length} of {modules.length} Read
                      </span>
                    </div>

                    <div className="space-y-2">
                      {modules.map((m, idx) => (
                        <button
                          key={m.id}
                          onClick={() => handleSelectModule(idx)}
                          className={cn(
                            "w-full text-left p-3.5 rounded-2xl transition-all border flex items-start gap-3",
                            activeModuleIndex === idx
                              ? "bg-white border-brand-blue text-brand-blue shadow-md shadow-blue-500/5 ring-2 ring-brand-blue/10"
                              : "bg-white/60 hover:bg-white border-slate-200/70 text-slate-700"
                          )}
                        >
                          <div className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
                            activeModuleIndex === idx
                              ? "bg-brand-blue text-white"
                              : completedModules.includes(idx)
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          )}>
                            {completedModules.includes(idx) && activeModuleIndex !== idx ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold leading-tight line-clamp-2">
                              {m.title}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              ⏱️ {m.duration}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ready for Exam Callout in Sidebar */}
                  <div className="pt-6 mt-6 border-t border-slate-200">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-wider">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>Ready for Exam?</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Complete reading all 4 modules, then pass the 15-question quiz (80% score) to download your verified PDF certificate.
                      </p>
                      <button
                        onClick={() => {
                          setStep('quiz');
                          setCurrentQuestion(0);
                        }}
                        className="w-full py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Start 15-MCQ Exam</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Pane: Lesson Reader & Video */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-white">
                  {/* Module Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-blue uppercase tracking-wider">
                        <span>Chapter {activeModuleIndex + 1} of {modules.length}</span>
                        <span>•</span>
                        <span>Estimated {currentModule.duration}</span>
                      </div>
                      <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                        {currentModule.title}
                      </h1>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        {currentModule.summary}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowVideo(!showVideo)}
                      className={cn(
                        "px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 border",
                        showVideo
                          ? "bg-brand-blue text-white border-brand-blue shadow-md"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      )}
                    >
                      <Video className="w-4 h-4 text-rose-500" />
                      <span>{showVideo ? "Hide Video Lecture" : "Watch Video Masterclass"}</span>
                    </button>
                  </div>

                  {/* Video Player Embed (if toggled) */}
                  {showVideo && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-video w-full bg-slate-900"
                    >
                      <iframe 
                        src={videoUrl} 
                        title="Course Lecture Video" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </motion.div>
                  )}

                  {/* Lesson Reading Content */}
                  <div className="space-y-6 text-slate-700 leading-relaxed text-[15px]">
                    {currentModule.content.map((paragraph, pIdx) => (
                      <p key={pIdx} className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Code / Framework Snippet Box (if available) */}
                  {currentModule.codeSnippet && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider px-2">
                        <span className="flex items-center gap-1.5">
                          <Code2 className="w-4 h-4 text-brand-blue" />
                          <span>Industry Standard Syntax & Pattern ({currentModule.codeLanguage || 'code'})</span>
                        </span>
                        <button
                          onClick={() => handleCopyCode(currentModule.codeSnippet!)}
                          className="flex items-center gap-1 text-slate-600 hover:text-brand-blue transition-colors py-1 px-2 rounded-lg hover:bg-slate-100"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                        </button>
                      </div>
                      <div className="bg-slate-950 text-slate-100 rounded-3xl p-5 md:p-6 font-mono text-xs md:text-sm overflow-x-auto shadow-inner leading-relaxed">
                        <pre>{currentModule.codeSnippet}</pre>
                      </div>
                    </div>
                  )}

                  {/* Key Takeaways */}
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Executive Key Takeaways</span>
                    </h4>
                    <ul className="space-y-2 text-xs md:text-sm text-emerald-950 font-medium">
                      {currentModule.keyTakeaways.map((point, kIdx) => (
                        <li key={kIdx} className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive AI Mentor / Doubt Explainer */}
                  <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 border border-blue-200/70 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-brand-blue text-white flex items-center justify-center shadow-md">
                          <Sparkles className="w-4 h-4 text-amber-300" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Ask AI Mentor About This Module</h4>
                          <p className="text-[11px] text-slate-500 font-medium">Instant explanation, analogies, or practical examples</p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleAskTutor} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder={`e.g., Explain ${currentModule.title.split(':')[1] || 'this concept'} with a simple analogy...`}
                        value={tutorQuestion}
                        onChange={(e) => setTutorQuestion(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs md:text-sm outline-none focus:border-brand-blue shadow-sm font-medium"
                      />
                      <button
                        type="submit"
                        disabled={!tutorQuestion.trim() || isAskingTutor}
                        className="px-5 py-3 bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-50 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
                      >
                        {isAskingTutor ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        <span>Ask AI</span>
                      </button>
                    </form>

                    {/* AI Answer Display */}
                    {tutorAnswer && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-5 rounded-2xl border border-blue-200 text-xs md:text-sm text-slate-800 leading-relaxed font-medium shadow-sm space-y-2"
                      >
                        <div className="font-bold text-brand-blue flex items-center gap-1.5 text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>AI Mentor Guidance:</span>
                        </div>
                        <div className="whitespace-pre-line text-slate-700">
                          {tutorAnswer}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Bottom Navigation for Modules */}
                  <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                    <button
                      onClick={() => handleSelectModule(Math.max(0, activeModuleIndex - 1))}
                      disabled={activeModuleIndex === 0}
                      className="px-5 py-3 rounded-2xl font-bold text-xs border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 flex items-center gap-2 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous Chapter</span>
                    </button>

                    {activeModuleIndex < modules.length - 1 ? (
                      <button
                        onClick={() => handleSelectModule(activeModuleIndex + 1)}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                      >
                        <span>Next: Module {activeModuleIndex + 2}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setStep('quiz');
                          setCurrentQuestion(0);
                        }}
                        className="px-7 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-xl transition-all active:scale-95 animate-pulse"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-950" />
                        <span>Ready! Start 15-Question Exam 🚀</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===================== STEP 2: 15-MCQ EXAM ===================== */}
            {step === 'quiz' && (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 max-w-4xl mx-auto w-full"
              >
                {/* Exam Sub-Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700">
                      <HelpCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-slate-900">
                        Professional Certification Assessment
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Target Passing Score: 80% (12 / 15 correct) to unlock PDF certificate
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('learn')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Return to Lessons</span>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Question {currentQuestion + 1} of {shuffledQuiz.length}</span>
                    <span className="text-brand-blue">
                      {Math.round(((currentQuestion + 1) / shuffledQuiz.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="h-full bg-brand-blue transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / shuffledQuiz.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Box */}
                <div className="space-y-6 min-h-[300px]">
                  <h4 className="text-lg md:text-xl font-display font-bold text-slate-900 leading-snug">
                    {shuffledQuiz[currentQuestion]?.question}
                  </h4>

                  <div className="space-y-3">
                    {shuffledQuiz[currentQuestion]?.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={cn(
                          "w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all flex items-start gap-4 text-xs md:text-sm font-medium",
                          answers[currentQuestion] === idx
                            ? "border-brand-blue bg-blue-50/70 text-brand-blue font-bold shadow-md shadow-blue-500/5 ring-4 ring-brand-blue/10"
                            : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5",
                          answers[currentQuestion] === idx
                            ? "border-brand-blue bg-brand-blue text-white"
                            : "border-slate-300 text-slate-500"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="flex-1 leading-relaxed">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Bottom Action */}
                <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="px-5 py-3 rounded-2xl font-bold text-xs border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-slate-700 flex items-center gap-2 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Question</span>
                  </button>

                  <button
                    onClick={nextQuestion}
                    disabled={answers[currentQuestion] === undefined}
                    className="px-7 py-3 bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-40 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/10 transition-all active:scale-95"
                  >
                    <span>{currentQuestion === shuffledQuiz.length - 1 ? "Submit Assessment 🏁" : "Next Question →"}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ===================== STEP 3: RESULT & CERTIFICATE ===================== */}
            {step === 'result' && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 overflow-y-auto p-8 md:p-14 flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto w-full"
              >
                <div className={cn(
                  "w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl border-4",
                  isPassed
                    ? "bg-green-100 text-green-600 border-green-200"
                    : "bg-red-100 text-red-600 border-red-200"
                )}>
                  {isPassed ? <Trophy className="w-12 h-12" /> : <RotateCcw className="w-12 h-12" />}
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Exam Performance Evaluation
                  </div>
                  <h3 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
                    {isPassed ? "Congratulations, Passed!" : "Certification Incomplete"}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                    {isPassed
                      ? `You achieved an authenticated score of ${marks}%, exceeding the 80% competency threshold for ${course.title}.`
                      : `You scored ${marks}%. An 80% score is required to unlock your verified credential. Review the course lessons and try again.`}
                  </p>
                </div>

                {/* Score Stats Badge */}
                <div className="grid grid-cols-3 gap-4 w-full bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center">
                  <div>
                    <div className="text-2xl font-extrabold font-display text-slate-900">{marks}%</div>
                    <div className="text-[11px] text-slate-500 font-bold uppercase mt-0.5">Your Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold font-display text-slate-900">{correctAnswersCount} / {shuffledQuiz.length}</div>
                    <div className="text-[11px] text-slate-500 font-bold uppercase mt-0.5">Correct MCQs</div>
                  </div>
                  <div>
                    <div className={cn("text-2xl font-extrabold font-display", isPassed ? "text-green-600" : "text-red-500")}>
                      {isPassed ? "PASSED" : "RETAKE"}
                    </div>
                    <div className="text-[11px] text-slate-500 font-bold uppercase mt-0.5">Status</div>
                  </div>
                </div>

                {/* Result Actions */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                  {isPassed ? (
                    <>
                      <button
                        onClick={generateCertificate}
                        disabled={generatingCert}
                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        {generatingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        <span>Download Official Certificate (PDF) 📄</span>
                      </button>
                      <button
                        onClick={handleFinish}
                        className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        Claim Badge & Return
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setQuizAttempt(prev => prev + 1);
                          setCurrentQuestion(0);
                          setAnswers([]);
                          setTimeLeft(1200);
                          setIsTimeUp(false);
                          setStep('learn');
                        }}
                        className="px-8 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Review Lessons & Study Notes 📖</span>
                      </button>
                      <button
                        onClick={() => {
                          setQuizAttempt(prev => prev + 1);
                          setCurrentQuestion(0);
                          setAnswers([]);
                          setTimeLeft(1200);
                          setIsTimeUp(false);
                          setStep('quiz');
                        }}
                        className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Retake Exam 🔄</span>
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
