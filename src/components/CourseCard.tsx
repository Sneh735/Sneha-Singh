import React from 'react';
import { BookOpen, Trophy, Clock } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { cn } from '../lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  domain: string;
  duration: string;
  points: number;
}

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  isCompleted: boolean;
  progress: number;
  onEnroll: (courseId: string) => void;
  onComplete: (courseId: string) => void;
  userName: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  isEnrolled, 
  isCompleted, 
  progress, 
  onEnroll, 
  onComplete, 
  userName 
}) => {
  const getStatus = () => {
    if (isCompleted) return { label: 'Completed', color: 'text-green-600 bg-green-50 border-green-100' };
    if (isEnrolled) return { label: 'In Progress', color: 'text-brand-blue bg-brand-blue/5 border-blue-100' };
    return { label: 'Available', color: 'text-slate-400 bg-slate-50 border-slate-100' };
  };

  const status = getStatus();

  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Design
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(30, 41, 59);
    doc.text("CERTIFICATE", 148.5, 60, { align: "center" });
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.text("OF COMPLETION", 148.5, 75, { align: "center" });

    doc.setFontSize(16);
    doc.text("This is to certify that", 148.5, 100, { align: "center" });

    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246);
    doc.text(userName, 148.5, 120, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(`has successfully completed the course`, 148.5, 140, { align: "center" });

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(course.title, 148.5, 155, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(`Issued on ${new Date().toLocaleDateString()}`, 148.5, 180, { align: "center" });

    doc.save(`${course.title}_Certificate.pdf`);
  };

  return (
    <div className="glass p-6 rounded-[32px] border border-white/40 flex flex-col group hover:shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest bg-white/50 border-white/20">
          <BookOpen className="w-3 h-3 text-brand-blue" />
          <span className="text-brand-ink">{course.domain}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-brand-muted">
          <Trophy className="w-3 h-3 text-amber-500" />
          <span>{course.points} PTS</span>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-display font-black text-brand-ink mb-1 group-hover:text-brand-blue transition-colors">
          {course.title}
        </h3>
        <div className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest",
          status.color
        )}>
          <span className="w-1 h-1 rounded-full bg-current" />
          {status.label}
        </div>
      </div>
      
      <p className="text-brand-muted text-xs mb-6 line-clamp-2 leading-relaxed h-8">
        {course.description}
      </p>
      
      {isEnrolled && !isCompleted && (
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-brand-muted">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-blue transition-all duration-700 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="h-1.5 bg-green-100 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-green-500" style={{ width: '100%' }} />
        </div>
      )}

      <div className="flex items-center gap-4 text-brand-muted text-[10px] font-black uppercase tracking-widest mb-6 mt-auto">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>{course.duration}</span>
        </div>
      </div>

      {!isEnrolled ? (
        <button 
          onClick={() => onEnroll(course.id)}
          className="w-full py-3.5 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-100 hover:bg-brand-blue-dark transition-all active:scale-95"
        >
          Enroll Now
        </button>
      ) : isCompleted ? (
        <button 
          onClick={generateCertificate}
          className="w-full py-3.5 bg-white border border-brand-border text-brand-ink rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-cream transition-all flex items-center justify-center gap-2"
        >
          Download Certificate
        </button>
      ) : (
        <button 
          onClick={() => onComplete(course.id)}
          className="w-full py-3.5 bg-brand-accent text-brand-ink rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-50 hover:opacity-90 transition-all active:scale-95"
        >
          Complete Course
        </button>
      )}
    </div>
  );
}
