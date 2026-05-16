import React from 'react';
import { BookOpen, Trophy, Clock, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { cn } from '../lib/utils';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  isCompleted: boolean;
  progress: number;
  onEnroll: (courseId: string) => void;
  onComplete: (courseId: string) => void;
  onView: (course: Course) => void;
  userName: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  isEnrolled, 
  isCompleted, 
  progress, 
  onEnroll, 
  onComplete, 
  onView,
  userName 
}) => {
  const getStatus = () => {
    if (isCompleted) return { label: 'Completed', color: 'text-green-600 bg-green-50 border-green-100' };
    if (isEnrolled) return { label: 'In Progress', color: 'text-brand-blue bg-brand-blue/5 border-blue-100' };
    return { label: 'Available', color: 'text-brand-muted bg-brand-blue-light/30 border-brand-border/50' };
  };

  const status = getStatus();

  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Decorative Border (Frame)
    doc.setDrawColor(20, 30, 48); // Dark Navy
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    
    doc.setDrawColor(37, 99, 235); // Brand Blue
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);

    // 2. Background Pattern Hint (Simulated watermark)
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFIED', pageWidth / 2, pageHeight / 2 + 10, { align: 'center', angle: 45 });

    // 3. Header
    doc.setTextColor(20, 30, 48);
    doc.setFontSize(40);
    doc.setFont('times', 'bold');
    doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 45, { align: 'center' });

    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 40, 50, pageWidth / 2 + 40, 50);

    // 4. Body Text
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', pageWidth / 2, 70, { align: 'center' });

    doc.setFontSize(28);
    doc.setFont('times', 'bolditalic');
    doc.setTextColor(37, 99, 235);
    doc.text(userName.toUpperCase(), pageWidth / 2, 85, { align: 'center' });

    doc.setTextColor(20, 30, 48);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully completed the curriculum for', pageWidth / 2, 105, { align: 'center' });

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(course.title, pageWidth / 2, 120, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text(`Demonstrating technical proficiency in ${course.domain}`, pageWidth / 2, 130, { align: 'center' });

    // 5. Professional Seal (Simulated)
    doc.setDrawColor(37, 99, 235);
    doc.setFillColor(37, 99, 235);
    doc.circle(pageWidth / 2, 160, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('OFFICIAL', pageWidth / 2, 158, { align: 'center' });
    doc.text('VERIFIED', pageWidth / 2, 162, { align: 'center' });
    doc.text('SEAL', pageWidth / 2, 166, { align: 'center' });

    // 6. Footer (Signatures & Date)
    doc.setTextColor(20, 30, 48);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Left side: Date
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 40, 180);
    doc.line(40, 175, 80, 175);
    
    // Right side: Signature
    doc.setFont('times', 'italic');
    doc.text('S. Pathak', pageWidth - 80, 172);
    doc.setFont('helvetica', 'normal');
    doc.text('Authorized Director', pageWidth - 80, 180);
    doc.line(pageWidth - 80, 175, pageWidth - 40, 175);

    // 7. Credits
    doc.setFontSize(8);
    doc.text(`Certificate ID: ${Math.random().toString(36).substring(2, 15).toUpperCase()}`, pageWidth / 2, 195, { align: 'center' });

    doc.save(`${course.title.replace(/\s+/g, '_')}_Certificate.pdf`);
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
          <div className="h-1.5 bg-brand-blue-light/50 rounded-full overflow-hidden">
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
        <div className="flex gap-2 w-full">
          <button 
            onClick={() => onView(course)}
            className="flex-1 py-3.5 bg-brand-cream border border-brand-border text-brand-ink rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-blue-light transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Review Theory
          </button>
          <button 
            onClick={generateCertificate}
            className="flex-1 py-3.5 bg-white border border-brand-border text-brand-ink rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-cream transition-all flex items-center justify-center gap-2"
          >
            <Trophy className="w-3 h-3 text-amber-500" />
            Certificate
          </button>
        </div>
      ) : (
        <button 
          onClick={() => onView(course)}
          className="w-full py-3.5 bg-brand-accent text-brand-ink rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-50 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-brand-blue" />
          Start Learning
        </button>
      )}
    </div>
  );
}
