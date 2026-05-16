import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, HelpCircle, CheckCircle, ChevronLeft, ChevronRight, Trophy, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { Course } from '../types';
import jsPDF from 'jspdf';

interface CourseContentProps {
  course: Course;
  onClose: () => void;
  onComplete: (courseId: string) => void;
  userName: string;
}

export default function CourseContent({ course, onClose, onComplete, userName }: CourseContentProps) {
  const [step, setStep] = useState<'theory' | 'quiz' | 'result'>('theory');
  const [currentTheoryPage, setCurrentTheoryPage] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [generatingCert, setGeneratingCert] = useState(false);
  const [startTime] = useState(Date.now());

  const marks = answers.reduce((acc, ans, idx) => {
    return acc + (ans === course.quiz[idx]?.correctAnswer ? 10 : 0);
  }, 0);

  const totalPossibleMarks = course.quiz.length * 10;
  const passingMarks = 16 * 10; // 16 out of 20 = 80% passing
  const isPassed = marks >= passingMarks;

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < course.quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep('result');
    }
  };

  const handleTheoryNext = () => {
    if (currentTheoryPage < course.theoryPages.length - 1) {
      setCurrentTheoryPage(prev => prev + 1);
    } else {
      setStep('quiz');
    }
  };

  const handleTheoryBack = () => {
    if (currentTheoryPage > 0) {
      setCurrentTheoryPage(prev => prev - 1);
    }
  };

  const generateCertificate = () => {
    setGeneratingCert(true);
    const certID = "STH-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // ... existing certificate logic refined ...
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600]
    });

    // Background
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, 800, 600, 'F');
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(15);
    doc.rect(20, 20, 760, 560);

    doc.setTextColor(0, 31, 63);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.text("SKILL TO HIRE", 400, 80, { align: 'center' });
    doc.setFontSize(32);
    doc.text("CERTIFICATE OF EXPERTISE", 400, 130, { align: 'center' });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text("THIS IS TO OFFICIALLY VALIDATE THAT", 400, 200, { align: 'center' });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.text(userName.toUpperCase(), 400, 260, { align: 'center' });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text(`HAS COMPLETED THE 6-HOUR INTENSIVE PROGRAM IN`, 400, 320, { align: 'center' });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text(course.title.toUpperCase(), 400, 380, { align: 'center' });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.text(`Verified Score: ${marks}/${totalPossibleMarks} (Minimum Requirement: ${passingMarks})`, 400, 420, { align: 'center' });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`CERTIFICATE ID: ${certID}`, 400, 460, { align: 'center' });

    doc.setDrawColor(180, 180, 180);
    doc.line(100, 520, 300, 520);
    doc.line(500, 520, 700, 520);
    doc.setFontSize(10);
    doc.text("ACADEMIC DIRECTOR", 200, 540, { align: 'center' });
    doc.text("TECHNICAL ARCHITECT", 600, 540, { align: 'center' });

    doc.save(`STH_Certificate_${certID}.pdf`);
    setGeneratingCert(false);
  };

  const handleFinish = () => {
    if (isPassed) {
      onComplete(course.id);
      onClose();
    } else {
      setStep('theory');
      setCurrentTheoryPage(0);
      setCurrentQuestion(0);
      setAnswers([]);
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
        <div className="p-6 md:p-8 border-b border-brand-border/50 flex justify-between items-center bg-brand-cream/30">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 text-brand-muted group-hover:text-brand-ink" />
            </button>
            <div>
              <h2 className="text-xl font-display font-black text-brand-ink">{course.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">{course.domain}</span>
                <span className="text-[10px] text-brand-muted">•</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted">{step === 'theory' ? 'Advanced Theory' : step === 'quiz' ? 'Technical Assessment' : 'Final Report'}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-muted">
              <Trophy className="w-3 h-3 text-amber-500" />
              <span>{course.points} XP CREDIT</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-brand-cream/5">
          <AnimatePresence mode="wait">
            {step === 'theory' && (
              <motion.div 
                key="theory"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 max-w-3xl mx-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-black text-brand-ink">Academic Deep-Dive</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Module {currentTheoryPage + 1} of {course.theoryPages.length}</p>
                    </div>
                  </div>
                  <div className="course-stats relative overflow-hidden group">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-brand-muted uppercase tracking-tighter">Accredited Duration</span>
                        <span className="text-xs font-black text-brand-ink">06:00:00</span>
                     </div>
                     <div className="w-px h-6 bg-brand-border/20 self-center" />
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-brand-muted uppercase tracking-tighter">Course Modules</span>
                        <span className="text-xs font-black text-brand-ink">{currentTheoryPage + 1} / 10</span>
                     </div>
                     <div className="w-px h-6 bg-brand-border/20 self-center" />
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-brand-muted uppercase tracking-tighter">XP Value</span>
                        <span className="text-xs font-black text-brand-blue">+{course.points}</span>
                     </div>
                     {currentTheoryPage === 9 && (
                       <div className="ml-auto flex items-center">
                         <span className="certificate-badge animate-pulse">CREDENTIAL ELIGIBLE</span>
                       </div>
                     )}
                  </div>
                </div>
                <div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:font-black prose-p:font-medium prose-p:text-brand-ink/80 prose-li:font-medium prose-strong:text-brand-blue min-h-[400px]">
                  <ReactMarkdown>{course.theoryPages[currentTheoryPage]}</ReactMarkdown>
                </div>
              </motion.div>
            )}

            {step === 'quiz' && (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-xl">
                      <HelpCircle className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-display font-black text-brand-ink tracking-tight">Medium Difficulty Assessment</h3>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-[10px] font-black tracking-widest text-brand-muted uppercase">CRITERION {currentQuestion + 1} / {course.quiz.length}</div>
                    <div className="h-1 w-24 bg-brand-blue/10 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-brand-blue transition-all" style={{ width: `${((currentQuestion + 1) / course.quiz.length) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h4 className="text-2xl font-display font-black text-brand-ink leading-tight">
                    {course.quiz[currentQuestion].question}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.quiz[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={cn(
                          "p-6 text-left rounded-3xl border-2 transition-all font-bold text-sm flex gap-4 items-center group",
                          answers[currentQuestion] === idx 
                            ? "bg-brand-blue border-brand-blue text-white shadow-xl scale-[1.01]"
                            : "bg-white border-brand-border/30 text-brand-ink hover:border-brand-blue/30 active:scale-95"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-xs",
                          answers[currentQuestion] === idx ? "bg-white/20 text-white" : "bg-brand-cream text-brand-muted"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="flex-1 leading-snug">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'result' && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-10"
              >
                <div className={cn(
                  "w-32 h-32 rounded-[40px] flex items-center justify-center mb-8 rotate-12 shadow-xl border-4 border-white",
                  isPassed ? "bg-green-500 text-white" : "bg-red-500 text-white"
                )}>
                  {isPassed ? <CheckCircle className="w-16 h-16" /> : <HelpCircle className="w-16 h-16" />}
                </div>
                <h3 className="text-4xl font-display font-black text-brand-ink mb-2 tracking-tighter">
                  {isPassed ? "Excellence Validated" : "Insight Requirements Unmet"}
                </h3>
                <p className="text-brand-muted font-bold text-lg mb-8 max-w-sm">
                  {isPassed 
                    ? `Brilliant work, ${userName}! You've demonstrated advanced mastery of ${course.title}.` 
                    : "The assessment criteria were not fully satisfied. Success requires deep technical focus."}
                </p>
                
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
                  <div className="flex-1 bg-white p-8 rounded-[40px] border border-brand-border/50 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-muted">
                      <span>Total Marks</span>
                      <span className={cn(isPassed ? "text-green-600" : "text-red-600")}>
                        {marks} / {totalPossibleMarks}
                      </span>
                    </div>
                    <div className="h-3 bg-brand-cream rounded-full overflow-hidden border border-brand-border/20">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(marks / totalPossibleMarks) * 100}%` }}
                        className={cn("h-full", isPassed ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" : "bg-red-500")}
                      />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted text-left">Certification Threshold: {passingMarks} Marks</p>
                  </div>

                  {isPassed && (
                    <div className="flex-1 bg-brand-blue p-8 rounded-[40px] text-white space-y-4 shadow-xl shadow-blue-100 flex flex-col justify-center">
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Credential Ready</h4>
                      <button 
                        onClick={generateCertificate}
                        disabled={generatingCert}
                        className="w-full py-4 bg-white text-brand-blue rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-opacity-90 active:scale-95 transition-all"
                      >
                        {generatingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Download Certificate
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-brand-border/50 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-muted italic opacity-60">
            Professional Certification Standard • Assessment ID: {course.id}-{Date.now().toString().slice(-4)}
          </div>
          <div className="flex gap-3">
            {step === 'theory' && (
              <>
                {currentTheoryPage > 0 && (
                  <button 
                    onClick={handleTheoryBack}
                    className="px-6 py-4 bg-white text-brand-ink border-2 border-brand-border/30 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-brand-cream transition-all active:scale-95 flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                )}
                <button 
                  onClick={handleTheoryNext}
                  className="px-10 py-4 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-200 hover:bg-brand-blue-dark transition-all active:scale-95 flex items-center gap-3 group"
                >
                  {currentTheoryPage < course.theoryPages.length - 1 ? 'Next Module' : 'Begin Assessment'} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}

            {step === 'quiz' && (
              <button 
                disabled={answers[currentQuestion] === undefined}
                onClick={nextQuestion}
                className="px-10 py-4 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-200 hover:bg-brand-blue-dark transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 group"
              >
                {currentQuestion < course.quiz.length - 1 ? 'Verify Next Node' : 'Commit Assessment'} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {step === 'result' && (
              <button 
                onClick={handleFinish}
                className={cn(
                  "px-10 py-4 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl transition-all active:scale-95",
                  isPassed ? "bg-brand-ink shadow-slate-200" : "bg-brand-blue shadow-blue-200"
                )}
              >
                {isPassed ? "Return to Dashboard" : "Re-authenticate Domain Expertise"}
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
