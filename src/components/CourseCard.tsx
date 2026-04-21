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
    if (isEnrolled) return { label: 'In Progress', color: 'text-blue-600 bg-blue-50 border-blue-100' };
    return { label: 'Not Started', color: 'text-slate-400 bg-slate-50 border-slate-100' };
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
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors capitalize text-xs font-bold px-2.5">
          {course.domain}
        </div>
        <div className="flex items-center gap-1 text-slate-400 font-bold text-xs uppercase tracking-wider">
          <Trophy className="w-3 h-3 text-amber-500" />
          <span>{course.points} PTS</span>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{course.title}</h3>
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest mb-3 w-fit",
        status.color
      )}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {status.label}
      </div>
      
      <p className="text-slate-500 text-xs mb-4 line-clamp-2 h-8">{course.description}</p>
      
      {isEnrolled && !isCompleted && (
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-blue transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-slate-400 text-xs mb-6 mt-auto">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{course.duration}</span>
        </div>
      </div>

      {!isEnrolled ? (
        <button 
          onClick={() => onEnroll(course.id)}
          className="w-full py-2.5 bg-brand-blue text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-blue-dark transition-all active:scale-95"
        >
          Enroll Now
        </button>
      ) : isCompleted ? (
        <button 
          onClick={generateCertificate}
          className="w-full py-2.5 bg-white border border-brand-border text-brand-ink rounded-lg text-sm font-bold hover:bg-brand-cream transition-colors flex items-center justify-center gap-2"
        >
          Download Certificate
        </button>
      ) : (
        <button 
          onClick={() => onComplete(course.id)}
          className="w-full py-2.5 bg-brand-accent text-brand-ink rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-all active:scale-95"
        >
          Complete Course
        </button>
      )}
    </div>
  );
}
