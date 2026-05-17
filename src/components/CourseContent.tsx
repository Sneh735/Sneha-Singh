import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CheckCircle, ChevronLeft, ChevronRight, Trophy, Download, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Course } from '../types';
import jsPDF from 'jspdf';

interface CourseContentProps {
  course: Course;
  onClose: () => void;
  onComplete: (courseId: string, score: number) => void;
  userName: string;
}

export default function CourseContent({ course, onClose, onComplete, userName }: CourseContentProps) {
  const [step, setStep] = useState<'quiz' | 'result'>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [generatingCert, setGeneratingCert] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState(0);

  // Shuffle questions on component mount or when a new attempt starts
  const shuffledQuiz = useMemo(() => {
    return [...course.quiz].sort(() => Math.random() - 0.5);
  }, [course.quiz, quizAttempt]);

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
  const totalPossibleMarks = 100;
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

    doc.setFontSize(48);
    doc.setTextColor(26, 110, 245);
    doc.setFont("helvetica", "bold");
    doc.text(userName.toUpperCase(), 400, 260, { align: 'center' });

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("in the industry certification program", 400, 310, { align: 'center' });

    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text(course.title.toUpperCase(), 400, 360, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.text(`Authenticated Score: ${marks}/100 Grade (Threshold: ${passingMarks}%)`, 400, 400, { align: 'center' });
    doc.text(`Completion Date: ${date} | Certificate ID: ${certID}`, 400, 420, { align: 'center' });

    // Footer / Signatures
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(1);
    doc.line(150, 500, 350, 500);
    doc.line(450, 500, 650, 500);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("SKILLTOHIRE VERIFICATION", 250, 515, { align: 'center' });
    doc.text("ACADEMIC COUNCIL", 550, 515, { align: 'center' });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(18);
    doc.text("SkillToHire Verified", 250, 490, { align: 'center' });
    doc.text("Official Council", 550, 490, { align: 'center' });

    doc.save(`STH_Certificate_${course.id}.pdf`);
    setGeneratingCert(false);
  };

  const handleFinish = () => {
    if (isPassed) {
      onComplete(course.id, marks);
      onClose();
    } else {
      // Retry logic - trigger a reshuffle by incrementing quizAttempt
      setQuizAttempt(prev => prev + 1);
      setCurrentQuestion(0);
      setAnswers([]);
      setTimeLeft(1200);
      setIsTimeUp(false);
      setStep('quiz');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-brand-ink/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-white/50"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-brand-border/40 flex justify-between items-center bg-brand-cream/10">
          <div className="flex items-center gap-5">
            <button 
              onClick={onClose}
              className="p-3 hover:bg-white rounded-full transition-all border border-transparent hover:border-brand-border group active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 text-brand-muted group-hover:text-brand-blue" />
            </button>
            <div>
              <h2 className="text-[20px] font-display font-bold text-brand-blue-heading tracking-tight leading-tight">{course.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold uppercase text-brand-blue">{course.domain}</span>
                <span className="text-[11px] text-brand-border">•</span>
                <span className="text-[11px] font-bold uppercase text-brand-muted">
                  {step === 'quiz' ? 'Professional Assessment' : 'Domain Validation'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {step === 'quiz' && (
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-colors",
                timeLeft < 60 ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-brand-border text-brand-blue-heading"
              )}>
                <Clock className={cn("w-4 h-4", timeLeft < 60 && "animate-pulse")} />
                <span className="text-[14px] font-bold tabular-nums">{formatTime(timeLeft)}</span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-brand-border rounded-full shadow-sm">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-blue-heading">{course.points} XP CREDIT</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-white">
          <AnimatePresence mode="wait">
            {step === 'quiz' && (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10 max-w-4xl mx-auto"
              >
                <div className="flex items-center justify-between mb-10 pb-8 border-b border-brand-border/40">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                      <HelpCircle className="w-7 h-7 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-[22px] font-display font-bold text-brand-blue-heading tracking-tight">Competency Assessment</h3>
                      <p className="text-[11px] font-bold uppercase text-brand-muted tracking-widest">Industry Standard Validation</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-brand-blue tabular-nums">{Math.round(((currentQuestion + 1) / shuffledQuiz.length) * 100)}% COMPLETE</span>
                      <div className="text-[11px] font-bold tracking-widest text-brand-muted uppercase">QUESTION {currentQuestion + 1} / {shuffledQuiz.length}</div>
                    </div>
                    <div className="h-1.5 w-48 bg-brand-blue/5 rounded-full overflow-hidden border border-brand-border/30">
                      <div className="h-full bg-brand-blue transition-all duration-500" style={{ width: `${((currentQuestion + 1) / shuffledQuiz.length) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-10 min-h-[300px]">
                  <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-10"
                      >
                      <h4 className="text-[28px] font-display font-bold text-brand-blue-heading leading-tight tracking-tight">
                        {shuffledQuiz[currentQuestion].question}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {shuffledQuiz[currentQuestion].options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={cn(
                              "p-6 text-left rounded-3xl border-2 transition-all font-bold text-[15px] flex gap-5 items-center group relative overflow-hidden",
                              answers[currentQuestion] === idx 
                                ? "bg-brand-blue border-brand-blue text-white shadow-[0_15px_30px_-10px_rgba(26,110,245,0.4)] scale-[1.02]"
                                : "bg-white border-brand-border/60 text-brand-ink hover:border-brand-blue/40 shadow-sm active:scale-98"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-[13px] border transition-colors",
                              answers[currentQuestion] === idx ? "bg-white/20 border-white/20 text-white" : "bg-brand-cream border-brand-border/40 text-brand-muted"
                            )}>
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="flex-1 leading-snug">{option}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {step === 'result' && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-10 max-w-2xl mx-auto"
              >
                <div className={cn(
                  "w-36 h-36 rounded-[48px] flex items-center justify-center mb-10 rotate-12 shadow-2xl border-8 border-white",
                  isPassed ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                )}>
                  {isPassed ? <CheckCircle className="w-16 h-16" /> : <AlertCircle className="w-16 h-16" />}
                </div>
                <h3 className="text-[42px] font-display font-bold text-brand-blue-heading mb-3 tracking-tight leading-tight">
                  {isPassed ? `Congratulations, ${userName}!` : "Requirement Deficit"}
                </h3>
                <p className="text-brand-muted font-medium text-[17px] mb-12 max-w-lg leading-relaxed">
                  {isPassed 
                    ? `Outstanding performance, ${userName}. Your technical handle on ${course.title} exceeds our verified benchmarks.` 
                    : isTimeUp 
                      ? "Assessment session expired. The time limit was exceeded before completion." 
                      : "You did not qualify. Please try again. Professional mastery requires total technical conceptualization."}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <div className="bg-[#f8fafc] p-8 rounded-[32px] border border-brand-border/60 space-y-6 shadow-sm text-left relative overflow-hidden">
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-brand-muted relative z-10">
                      <span>Performance Metrics</span>
                      <span className={cn("text-[14px]", isPassed ? "text-emerald-600" : "text-red-600")}>
                        {marks}% Mastery
                      </span>
                    </div>
                    <div className="h-2.5 bg-brand-cream rounded-full overflow-hidden border border-brand-border/20 relative z-10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${marks}%` }}
                        className={cn("h-full transition-all duration-1000", isPassed ? "bg-emerald-500" : "bg-red-500")}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-brand-muted uppercase tracking-widest relative z-10">
                      <span>Threshold: {passingMarks}%</span>
                      <span>{marks >= 100 ? "GENIUS LEVEL" : marks >= 90 ? "EXCELLENT" : "QUALIFIED"}</span>
                    </div>
                    {isPassed && <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Trophy className="w-24 h-24 text-brand-blue" />
                    </div>}
                  </div>

                  {isPassed && (
                    <div className="bg-brand-blue p-8 rounded-[32px] text-white space-y-6 shadow-[0_20px_40px_-15px_rgba(26,110,245,0.4)] flex flex-col justify-center text-left relative overflow-hidden group">
                      <div className="relative z-10">
                        <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] opacity-80 mb-6">CREDENTIAL DISPATCH</h4>
                        <button 
                          onClick={generateCertificate}
                          disabled={generatingCert}
                          className="w-full py-4.5 bg-white text-brand-blue rounded-2xl font-bold text-[14px] flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-95 transition-all shadow-lg"
                        >
                          {generatingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                          Download Certificate
                        </button>
                      </div>
                      <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-10 border-t border-brand-border/40 bg-white flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-muted italic flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
            Verification Standard: SKILL-{course.id.toUpperCase()}
          </div>
          <div className="flex gap-4">
            {step === 'quiz' && (
              <button 
                disabled={answers[currentQuestion] === undefined}
                onClick={nextQuestion}
                className="px-12 py-4 bg-brand-blue text-white rounded-2xl font-bold text-[14px] shadow-[0_15px_30px_-10px_rgba(26,110,245,0.4)] hover:bg-brand-blue-dark transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 group"
              >
                {currentQuestion < shuffledQuiz.length - 1 ? 'Verify Response' : 'Commit Criteria'} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
              </button>
            )}

            {step === 'result' && (
              <button 
                onClick={handleFinish}
                className={cn(
                  "px-12 py-4 text-white rounded-2xl font-bold text-[14px] shadow-[0_15px_30px_-10px_rgba(30,41,59,0.2)] transition-all active:scale-95",
                  isPassed ? "bg-brand-blue-heading" : "bg-brand-blue"
                )}
              >
                {isPassed ? "Finish Session" : "Retry Assessment"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg 
    className={cn("animate-spin", className)} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
