import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  Linkedin, 
  BookOpen, 
  Code2, 
  Trophy, 
  BadgeCheck, 
  Download, 
  Loader2,
  Plus,
  Trash2,
  FileText,
  Sparkles,
  Github,
  Link,
  Calendar,
  GraduationCap,
  Briefcase,
  Camera,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  UploadCloud,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import jsPDF from 'jspdf';
import { auth, db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// --- Types ---

interface Education {
  id: string;
  degree: string;
  school: string;
  specialization: string;
  board: string;
  startYear: string;
  endYear: string;
  cgpa: string;
  status: 'Pursuing' | 'Completed';
  type: 'college' | 'school10' | 'school12';
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  githubLink: string;
  liveDemo: string;
  duration: string;
}

interface Certification {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  pdfUrl: string;
  fileName?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  organization: string;
}

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  photoURL: string;
  technicalSkills: string[];
  nonTechnicalSkills: string[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
}

// --- Components ---

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className={cn(
      "fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50",
      type === 'success' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
    )}
  >
    {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
    <span className="font-bold text-[14px]">{message}</span>
    <button onClick={onClose} className="ml-2 hover:opacity-70"><X className="w-4 h-4" /></button>
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle: string }) => (
  <div className="flex items-center gap-4 border-b border-brand-border/40 pb-6 mb-8">
    <div className="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center">
      <Icon className="w-6 h-6 text-brand-blue" />
    </div>
    <div>
      <h3 className="text-[20px] font-display font-bold text-brand-blue-heading">{title}</h3>
      <p className="text-[13px] font-medium text-brand-muted">{subtitle}</p>
    </div>
  </div>
);

const ResumeBuilder: React.FC = () => {
  const [data, setData] = useState<ResumeData>({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    summary: '',
    photoURL: '',
    technicalSkills: [''],
    nonTechnicalSkills: [''],
    education: [
      { id: '10th', degree: '10th Standard', school: '', specialization: 'General', board: '', startYear: '', endYear: '', cgpa: '', status: 'Completed', type: 'school10' },
      { id: '12th', degree: '12th Standard', school: '', specialization: '', board: '', startYear: '', endYear: '', cgpa: '', status: 'Completed', type: 'school12' }
    ],
    projects: [],
    certifications: [],
    achievements: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'personal' | 'skills' | 'education' | 'projects' | 'more'>('personal');

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Firebase Integration ---

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      const userRef = doc(db, 'users', auth.currentUser.uid);
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.resumeBuilderData) {
            setData(userData.resumeBuilderData as ResumeData);
          }
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const autoSave = useCallback(async (newData: ResumeData) => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    const userRef = doc(db, 'users', auth.currentUser.uid);
    try {
      await updateDoc(userRef, { 
        resumeBuilderData: newData,
        updatedAt: new Date().toISOString() 
      });
    } catch (err) {
      console.error("Auto-save failed:", err);
    } finally {
      setIsSaving(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      autoSave(data);
    }, 2000);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [data, autoSave, isLoading]);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Profile Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;
    
    if (!file.type.startsWith('image/')) {
      showToast("Please upload an image file.", "error");
      return;
    }

    const storageRef = ref(storage, `users/${auth.currentUser.uid}/resumes/profile_pic`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(prev => ({ ...prev, profilePic: progress }));
      },
      (error) => {
        showToast("Upload failed: " + error.message, "error");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setData(prev => ({ ...prev, photoURL: downloadURL }));
        showToast("Profile picture updated", "success");
        setUploadProgress(prev => {
          const next = { ...prev };
          delete next.profilePic;
          return next;
        });
      }
    );
  };

  // Generic List Handlers
  const addEducation = () => {
    const newEdu: Education = {
      id: Math.random().toString(36).substr(2, 9),
      degree: '',
      school: '',
      specialization: '',
      board: '',
      startYear: '',
      endYear: '',
      cgpa: '',
      status: 'Completed',
      type: 'college'
    };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const addProject = () => {
    const newProj: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      technologies: '',
      githubLink: '',
      liveDemo: '',
      duration: ''
    };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const addAchievement = () => {
    const newAch: Achievement = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      date: '',
      organization: ''
    };
    setData(prev => ({ ...prev, achievements: [...prev.achievements, newAch] }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, certIndex: number) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    if (file.type !== 'application/pdf') {
      showToast("Only PDF files are allowed.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size must be under 5MB.", "error");
      return;
    }

    const fileId = Math.random().toString(36).substr(2, 9);
    const storageRef = ref(storage, `users/${auth.currentUser.uid}/certificates/${fileId}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(prev => ({ ...prev, [certIndex]: progress }));
      },
      (error) => {
        showToast("Upload failed: " + error.message, "error");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const newCerts = [...data.certifications];
        newCerts[certIndex] = { 
          ...newCerts[certIndex], 
          pdfUrl: downloadURL, 
          fileName: file.name 
        };
        setData(prev => ({ ...prev, certifications: newCerts }));
        showToast("Certificate uploaded successfully", "success");
        setUploadProgress(prev => {
          const next = { ...prev };
          delete next[certIndex];
          return next;
        });
      }
    );
  };

  const addCertification = () => {
    setData(prev => ({ 
      ...prev, 
      certifications: [
        ...prev.certifications, 
        { id: Math.random().toString(36).substr(2, 9), title: '', organization: '', issueDate: '', pdfUrl: '' }
      ] 
    }));
  };

  // --- PDF Generation ---

  const generatePDF = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      let yPos = 50;

      // Header background
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, pageWidth, 120, 'F');

      yPos = 60;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(255, 255, 255);
      doc.text(data.fullName.toUpperCase() || "NAME", pageWidth / 2, yPos, { align: 'center' });

      yPos += 25;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 200, 200);
      const contact = `${data.email} | ${data.phone} | ${data.linkedin}`;
      doc.text(contact, pageWidth / 2, yPos, { align: 'center' });

      yPos = 150;
      doc.setTextColor(30, 41, 59);

      // Helper for sections
      const renderSectionTitle = (title: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(37, 99, 235);
        doc.text(title, margin, yPos);
        yPos += 8;
        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(1.5);
        doc.line(margin, yPos, margin + 40, yPos);
        yPos += 20;
        doc.setTextColor(30, 41, 59);
      };

      // Summary
      if (data.summary) {
        renderSectionTitle("PROFILE");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const splitSummary = doc.splitTextToSize(data.summary, pageWidth - (margin * 2));
        doc.text(splitSummary, margin, yPos);
        yPos += (splitSummary.length * 12) + 25;
      }

      // Experience/Education
      if (data.education.length > 0) {
        renderSectionTitle("EDUCATION");
        data.education.forEach(edu => {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          
          let degreeText = edu.degree || (edu.type === 'school10' ? 'Secondary (10th)' : 'Senior Secondary (12th)');
          doc.text(degreeText, margin, yPos);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          const timeText = edu.status === 'Pursuing' ? `Expected ${edu.endYear}` : edu.endYear;
          doc.text(timeText, pageWidth - margin, yPos, { align: 'right' });
          
          yPos += 14;
          doc.setFont("helvetica", "italic");
          let detailLine = edu.specialization;
          if (edu.specialization && edu.school) detailLine += " | ";
          detailLine += edu.school;
          if (edu.board) detailLine += ` (${edu.board})`;
          
          doc.text(detailLine, margin, yPos);
          
          yPos += 14;
          doc.setFont("helvetica", "normal");
          let statsLine = [];
          if (edu.cgpa) statsLine.push(`Result: ${edu.cgpa}`);
          if (edu.status) statsLine.push(`Status: ${edu.status}`);
          
          doc.text(statsLine.join(" | "), margin, yPos);
          yPos += 22;
        });
      }

      // Projects
      if (data.projects.length > 0) {
        renderSectionTitle("PROJECTS");
        data.projects.forEach(proj => {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text(proj.title, margin, yPos);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.text(proj.duration, pageWidth - margin, yPos, { align: 'right' });
          yPos += 14;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          const splitDesc = doc.splitTextToSize(proj.description, pageWidth - (margin * 2));
          doc.text(splitDesc, margin, yPos);
          yPos += (splitDesc.length * 12) + 8;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.text(`Built with: ${proj.technologies}`, margin, yPos);
          yPos += 18;
        });
      }

      // Skills
      renderSectionTitle("SKILLS");
      doc.setFont("helvetica", "bold");
      doc.text("Technical: ", margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(data.technicalSkills.filter(Boolean).join(", "), margin + 70, yPos);
      yPos += 16;
      doc.setFont("helvetica", "bold");
      doc.text("Professional: ", margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(data.nonTechnicalSkills.filter(Boolean).join(", "), margin + 70, yPos);
      yPos += 30;

      doc.save(`${data.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      setIsGenerating(false);
      showToast("Resume downloaded successfully", "success");
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-brand-blue/10 border-t-brand-blue rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="w-8 h-8 text-brand-blue" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-brand-blue-heading">Constructing Architect...</h2>
          <p className="text-brand-muted font-medium mt-1">Retrieving your personal secure storage database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Navigation Sidebar */}
        <div className="lg:w-64 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-brand-border/40 shadow-sm sticky top-10">
            <div className="mb-6 px-4">
              <h4 className="text-[11px] font-bold text-brand-muted uppercase tracking-widest">Builder Steps</h4>
            </div>
            <div className="space-y-1">
              {[
                { id: 'personal', icon: User, label: 'Identity' },
                { id: 'skills', icon: Code2, label: 'Expertise' },
                { id: 'education', icon: GraduationCap, label: 'Academic' },
                { id: 'projects', icon: Briefcase, label: 'Portfolio' },
                { id: 'more', icon: Trophy, label: 'Achievements' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold text-[14px]",
                    activeTab === tab.id 
                      ? "bg-brand-blue/10 text-brand-blue" 
                      : "text-brand-muted hover:bg-brand-blue/5 hover:text-brand-ink"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-brand-border/40 space-y-4">
              <div className="flex items-center gap-3 px-4">
                <div className={cn("w-2 h-2 rounded-full", isSaving ? "bg-orange-500 animate-pulse" : "bg-emerald-500")} />
                <span className="text-[11px] font-bold text-brand-muted uppercase tracker-widest">
                  {isSaving ? "Auto-saving..." : "Synced live"}
                </span>
              </div>
              
              <button 
                onClick={generatePDF}
                disabled={isGenerating || !data.fullName}
                className="w-full flex items-center justify-center gap-3 py-4 bg-brand-blue text-white rounded-2xl font-bold text-[15px] shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden group"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />}
                Generate PDF
              </button>
            </div>
          </div>
        </div>

        {/* Middle: Form Sections */}
        <div className="flex-1 space-y-8 pb-32">
          <AnimatePresence mode="wait">
            {activeTab === 'personal' && (
              <motion.div 
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 lg:p-12 rounded-[40px] border border-brand-border/40 shadow-sm"
              >
                <SectionHeader 
                  icon={User} 
                  title="Professional Identity" 
                  subtitle="How recruiters will identify and contact you across platforms." 
                />

                <div className="flex flex-col md:flex-row gap-12 items-start mb-12">
                  <div className="relative group mx-auto md:mx-0">
                    <div className="w-32 h-32 rounded-[32px] bg-brand-blue/5 border-2 border-dashed border-brand-blue/20 flex items-center justify-center overflow-hidden">
                      {data.photoURL ? (
                        <img src={data.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="w-8 h-8 text-brand-blue/40 mx-auto mb-2" />
                          <span className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-widest">Upload Image</span>
                        </div>
                      )}
                      
                      {uploadProgress.profilePic && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full border-4 border-brand-blue/20 border-t-brand-blue animate-spin" />
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-90 transition-all border-4 border-white">
                      <Plus className="w-5 h-5" />
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <InputField label="Full Label" name="fullName" value={data.fullName} onChange={handleInputChange} placeholder="Alex Carter" icon={<User className="w-4 h-4" />} />
                    <InputField label="Email Address" name="email" value={data.email} onChange={handleInputChange} placeholder="alex@carter.dev" icon={<Mail className="w-4 h-4" />} />
                    <InputField label="Phone Number" name="phone" value={data.phone} onChange={handleInputChange} placeholder="+1 (415) 555-0123" icon={<Phone className="w-4 h-4" />} />
                    <InputField label="LinkedIn Handle" name="linkedin" value={data.linkedin} onChange={handleInputChange} placeholder="linkedin.com/in/alexcarter" icon={<Linkedin className="w-4 h-4" />} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-widest">Professional Summary</label>
                    <span className={cn(
                      "text-[10px] font-bold",
                      data.summary.split(/\s+/).filter(Boolean).length > 250 ? "text-red-500" : "text-brand-muted"
                    )}>
                      {data.summary.split(/\s+/).filter(Boolean).length} / 250 words
                    </span>
                  </div>
                    <textarea
                      name="summary"
                      value={data.summary || ''}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your career journey, key motivations, and unique value proposition..."
                    className="w-full px-6 py-5 bg-brand-blue/[0.02] border border-brand-border/60 rounded-[28px] font-medium text-[15px] focus:border-brand-blue outline-none transition-all resize-none min-h-[160px] leading-relaxed"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div 
                key="skills"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-brand-border/40 shadow-sm">
                  <SectionHeader 
                    icon={Code2} 
                    title="Expertise Spectrum" 
                    subtitle="Define your toolset and methodology across hard and soft domains." 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[15px] font-bold text-brand-blue-heading">Technical Arsenal</h4>
                        <button onClick={() => setData(d => ({ ...d, technicalSkills: [...d.technicalSkills, ''] }))} className="text-brand-blue hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {data.technicalSkills.map((skill, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              type="text" 
                              value={skill || ''} 
                              onChange={(e) => {
                                const next = [...data.technicalSkills];
                                next[idx] = e.target.value;
                                setData(d => ({ ...d, technicalSkills: next }));
                              }}
                              placeholder="e.g. React, TypeScript, Node.js"
                              className="flex-1 px-5 py-4 bg-brand-blue/[0.02] border border-brand-border/60 rounded-2xl font-medium text-[14px] focus:border-brand-blue outline-none"
                            />
                            <button onClick={() => setData(d => ({ ...d, technicalSkills: d.technicalSkills.filter((_, i) => i !== idx) }))} className="p-4 text-brand-muted hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[15px] font-bold text-brand-blue-heading">Leadership & Method</h4>
                        <button onClick={() => setData(d => ({ ...d, nonTechnicalSkills: [...d.nonTechnicalSkills, ''] }))} className="text-brand-blue hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {data.nonTechnicalSkills.map((skill, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              type="text" 
                              value={skill || ''} 
                              onChange={(e) => {
                                const next = [...data.nonTechnicalSkills];
                                next[idx] = e.target.value;
                                setData(d => ({ ...d, nonTechnicalSkills: next }));
                              }}
                              placeholder="e.g. Agile, Team Lead, Product Design"
                              className="flex-1 px-5 py-4 bg-brand-blue/[0.02] border border-brand-border/60 rounded-2xl font-medium text-[14px] focus:border-brand-blue outline-none"
                            />
                            <button onClick={() => setData(d => ({ ...d, nonTechnicalSkills: d.nonTechnicalSkills.filter((_, i) => i !== idx) }))} className="p-4 text-brand-muted hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'education' && (
              <motion.div 
                key="education"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-brand-border/40 shadow-sm">
                  <div className="flex justify-between items-center border-b border-brand-border/40 pb-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-brand-blue" />
                      </div>
                      <div>
                        <h3 className="text-[20px] font-display font-bold text-brand-blue-heading">Academic Pedigree</h3>
                        <p className="text-[13px] font-medium text-brand-muted">Your educational timeline from secondary to degree levels.</p>
                      </div>
                    </div>
                    <button 
                      onClick={addEducation}
                      className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-[13px] hover:scale-105 active:scale-95 transition-all shadow-md shadow-brand-blue/10"
                    >
                      <Plus className="w-4 h-4" />
                      Add Higher Ed
                    </button>
                  </div>

                  <div className="space-y-8">
                    {data.education.map((edu, idx) => (
                      <div key={edu.id} className="p-8 bg-[#f8fafc] border border-brand-border/60 rounded-[32px] relative group overflow-hidden">
                        {edu.type !== 'school10' && edu.type !== 'school12' && (
                          <button 
                            onClick={() => setData(d => ({ ...d, education: d.education.filter(e => e.id !== edu.id) }))}
                            className="absolute top-4 right-4 p-2 text-brand-muted hover:text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                        <div className="mb-6 flex items-center gap-2">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            edu.type === 'college' ? "bg-brand-blue text-white" : "bg-slate-200 text-slate-600"
                          )}>
                            {edu.type === 'college' ? 'University / College' : edu.type === 'school10' ? 'Secondary (10th)' : 'Senior Secondary (12th)'}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <EduInput 
                            label={edu.type === 'college' ? 'Degree / Course Name' : 'Qualification'} 
                            value={edu.degree} 
                            onChange={(v) => {
                              const next = [...data.education];
                              next[idx].degree = v;
                              setData(d => ({ ...d, education: next }));
                            }} 
                            placeholder={edu.type === 'college' ? "e.g. Bachelor of Technology" : (edu.type === 'school10' ? "Secondary (10th)" : "Senior Secondary (12th)")}
                          />
                          <EduInput 
                            label="Branch / Specialization" 
                            value={edu.specialization} 
                            onChange={(v) => {
                              const next = [...data.education];
                              next[idx].specialization = v;
                              setData(d => ({ ...d, education: next }));
                            }} 
                            placeholder={edu.type === 'college' ? "e.g. Computer Science" : (edu.type === 'school12' ? "e.g. PCM / Commerce" : "General")}
                          />
                          <EduInput 
                            label={edu.type === 'college' ? 'College / University Name' : 'School Name'} 
                            value={edu.school} 
                            onChange={(v) => {
                              const next = [...data.education];
                              next[idx].school = v;
                              setData(d => ({ ...d, education: next }));
                            }} 
                            placeholder={edu.type === 'college' ? "e.g. IIT Delhi" : "e.g. DPS International"}
                          />
                          <EduInput 
                            label="Board / University" 
                            value={edu.board} 
                            onChange={(v) => {
                              const next = [...data.education];
                              next[idx].board = v;
                              setData(d => ({ ...d, education: next }));
                            }} 
                            placeholder={edu.type === 'college' ? "e.g. Anna University" : "e.g. CBSE / ICSE"}
                          />
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-widest pl-1">Passing Year</label>
                            <input 
                              type="text"
                              value={edu.endYear || ''}
                              onChange={(e) => {
                                const next = [...data.education];
                                next[idx].endYear = e.target.value;
                                setData(d => ({ ...d, education: next }));
                              }}
                              placeholder={edu.status === 'Pursuing' ? "Expected 2025" : "2022"}
                              className="w-full px-5 py-4 bg-white border border-brand-border rounded-2xl font-medium text-[14px] focus:border-brand-blue outline-none"
                            />
                          </div>
                          <EduInput 
                            label="CGPA / Percentage" 
                            value={edu.cgpa} 
                            onChange={(v) => {
                              const next = [...data.education];
                              next[idx].cgpa = v;
                              setData(d => ({ ...d, education: next }));
                            }} 
                            placeholder="e.g. 9.2 or 88%"
                          />
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-widest pl-1">Current Status</label>
                            <div className="flex gap-2 p-1 bg-brand-blue/5 rounded-2xl">
                              {['Pursuing', 'Completed'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => {
                                    const next = [...data.education];
                                    next[idx].status = status as 'Pursuing' | 'Completed';
                                    setData(d => ({ ...d, education: next }));
                                  }}
                                  className={cn(
                                    "flex-1 py-3 rounded-xl text-[12px] font-bold transition-all",
                                    edu.status === status ? "bg-white text-brand-blue shadow-sm" : "text-brand-muted hover:text-brand-blue"
                                  )}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div 
                key="projects"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-brand-border/40 shadow-sm">
                  <div className="flex justify-between items-center border-b border-brand-border/40 pb-6 mb-8">
                    <SectionHeader 
                      icon={Briefcase} 
                      title="Portfolio Builders" 
                      subtitle="Showcase tangible products and solutions you've engineered." 
                    />
                    <button 
                      onClick={addProject}
                      className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-[13px] hover:scale-105 active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Project
                    </button>
                  </div>

                  <div className="space-y-8">
                    {data.projects.map((proj, idx) => (
                      <div key={proj.id} className="p-10 bg-brand-blue/[0.01] border border-brand-border/40 rounded-[40px] relative">
                         <button 
                          onClick={() => setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== proj.id) }))}
                          className="absolute top-4 right-4 p-2 text-brand-muted hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <InputField 
                              label="Project Name" 
                              name={`proj-title-${idx}`} 
                              value={proj.title} 
                              onChange={(e) => {
                                const next = [...data.projects];
                                next[idx].title = e.target.value;
                                setData(d => ({ ...d, projects: next }));
                              }} 
                              placeholder="e.g. AI-Powered CRM" 
                              icon={<FileText className="w-4 h-4" />}
                            />
                            <div className="space-y-2">
                              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-widest pl-1">Description</label>
                              <textarea
                                value={proj.description || ''}
                                onChange={(e) => {
                                  const next = [...data.projects];
                                  next[idx].description = e.target.value;
                                  setData(d => ({ ...d, projects: next }));
                                }}
                                placeholder="Describe problem solved and your technical implementation..."
                                className="w-full px-5 py-4 bg-white border border-brand-border rounded-2xl font-medium text-[14px] focus:border-brand-blue outline-none resize-none min-h-[120px]"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                             <InputField 
                              label="Technologies Used" 
                              name={`proj-tech-${idx}`} 
                              value={proj.technologies} 
                              onChange={(e) => {
                                const next = [...data.projects];
                                next[idx].technologies = e.target.value;
                                setData(d => ({ ...d, projects: next }));
                              }} 
                              placeholder="React, Firebase, Tailwind" 
                              icon={<Code2 className="w-4 h-4" />}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <EduInput label="GitHub Link" value={proj.githubLink} onChange={(v) => {
                                const next = [...data.projects];
                                next[idx].githubLink = v;
                                setData(d => ({ ...d, projects: next }));
                              }} placeholder="github.com/..." />
                              <EduInput label="Live Demo" value={proj.liveDemo} onChange={(v) => {
                                const next = [...data.projects];
                                next[idx].liveDemo = v;
                                setData(d => ({ ...d, projects: next }));
                              }} placeholder="demo.com" />
                            </div>
                            <EduInput label="Project Duration" value={proj.duration} onChange={(v) => {
                                const next = [...data.projects];
                                next[idx].duration = v;
                                setData(d => ({ ...d, projects: next }));
                              }} placeholder="Jan 2023 - Mar 2023" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'more' && (
              <motion.div 
                key="more"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Certifications with PDF Upload */}
                <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-brand-border/40 shadow-sm">
                  <div className="flex justify-between items-center border-b border-brand-border/40 pb-6 mb-8">
                    <SectionHeader 
                      icon={BadgeCheck} 
                      title="Verified Proof" 
                      subtitle="Industry certifications and continuous learning milestones." 
                    />
                    <button 
                      onClick={addCertification}
                      className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-[13px] hover:scale-105 active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Certificate
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.certifications.map((cert, idx) => (
                      <div key={cert.id} className="p-8 bg-[#f8fafc] border border-brand-border/60 rounded-[32px] space-y-5 relative group">
                        <button 
                          onClick={() => setData(d => ({ ...d, certifications: d.certifications.filter(c => c.id !== cert.id) }))}
                          className="absolute top-4 right-4 p-2 text-brand-muted hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="space-y-4">
                          <EduInput label="Certificate Title" value={cert.title} onChange={(v) => {
                            const next = [...data.certifications];
                            next[idx].title = v;
                            setData(d => ({ ...d, certifications: next }));
                          }} placeholder="Google Cloud Architect" />
                          <div className="grid grid-cols-2 gap-4">
                            <EduInput label="Issuing Org" value={cert.organization} onChange={(v) => {
                              const next = [...data.certifications];
                              next[idx].organization = v;
                              setData(d => ({ ...d, certifications: next }));
                            }} placeholder="Coursera" />
                            <EduInput label="Issue Date" value={cert.issueDate} onChange={(v) => {
                              const next = [...data.certifications];
                              next[idx].issueDate = v;
                              setData(d => ({ ...d, certifications: next }));
                            }} placeholder="Nov 2023" />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-brand-border/40">
                          {cert.pdfUrl ? (
                            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-brand-border/60">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <FileText className="w-5 h-5 text-brand-blue shrink-0" />
                                <span className="text-[12px] font-bold text-brand-blue-heading truncate">{cert.fileName || 'certificate.pdf'}</span>
                              </div>
                              <div className="flex gap-2">
                                <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className="p-2 text-brand-muted hover:text-brand-blue">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                                <button onClick={() => {
                                  const next = [...data.certifications];
                                  next[idx].pdfUrl = '';
                                  next[idx].fileName = '';
                                  setData(d => ({ ...d, certifications: next }));
                                }} className="p-2 text-brand-muted hover:text-red-500">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-brand-blue/20 rounded-2xl bg-brand-blue/[0.02] hover:bg-brand-blue/5 transition-colors cursor-pointer relative overflow-hidden group">
                              <UploadCloud className="w-6 h-6 text-brand-blue/40 group-hover:scale-110 group-hover:text-brand-blue transition-all" />
                              <span className="text-[11px] font-bold text-brand-blue/40 mt-2 uppercase tracking-wide group-hover:text-brand-blue">Upload PDF (Max 5MB)</span>
                              <input type="file" className="hidden" accept="application/pdf" onChange={(e) => handleFileUpload(e, idx)} />
                              
                              {uploadProgress[idx] && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-brand-blue/20 border-t-brand-blue animate-spin" />
                                    <span className="text-[10px] font-bold text-brand-blue">{Math.round(uploadProgress[idx])}%</span>
                                  </div>
                                </div>
                              )}
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-brand-border/40 shadow-sm">
                   <div className="flex justify-between items-center border-b border-brand-border/40 pb-6 mb-8">
                    <SectionHeader 
                      icon={Trophy} 
                      title="Key Achievements" 
                      subtitle="Distinctions and awards that define your excellence." 
                    />
                    <button 
                      onClick={addAchievement}
                      className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-[13px] hover:scale-105 active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Achievement
                    </button>
                  </div>

                  <div className="space-y-6">
                    {data.achievements.map((ach, idx) => (
                      <div key={ach.id} className="p-8 bg-[#f8fafc] border border-brand-border/60 rounded-[32px] relative group">
                        <button 
                          onClick={() => setData(d => ({ ...d, achievements: d.achievements.filter(a => a.id !== ach.id) }))}
                          className="absolute top-4 right-4 p-2 text-brand-muted hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div className="lg:col-span-1 space-y-4">
                             <EduInput label="Title" value={ach.title} onChange={(v) => {
                                const next = [...data.achievements];
                                next[idx].title = v;
                                setData(d => ({ ...d, achievements: next }));
                              }} placeholder="Dean's List" />
                             <EduInput label="Org / Event" value={ach.organization} onChange={(v) => {
                                const next = [...data.achievements];
                                next[idx].organization = v;
                                setData(d => ({ ...d, achievements: next }));
                              }} placeholder="University Name" />
                             <EduInput label="Date" value={ach.date} onChange={(v) => {
                                const next = [...data.achievements];
                                next[idx].date = v;
                                setData(d => ({ ...d, achievements: next }));
                              }} placeholder="2022" icon={<Calendar className="w-4 h-4" />} />
                          </div>
                          <div className="lg:col-span-2 space-y-2">
                             <label className="text-[11px] font-bold text-brand-muted uppercase tracking-widest pl-1">Description</label>
                             <textarea
                                value={ach.description || ''}
                                onChange={(e) => {
                                  const next = [...data.achievements];
                                  next[idx].description = e.target.value;
                                  setData(d => ({ ...d, achievements: next }));
                                }}
                                placeholder="Describe your contribution and why this achievement is significant..."
                                className="w-full px-5 py-4 bg-white border border-brand-border rounded-2xl font-medium text-[14px] focus:border-brand-blue outline-none resize-none min-h-[140px]"
                              />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const InputField: React.FC<{ 
  label: string; 
  name: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  icon: React.ReactNode; 
  placeholder: string;
}> = ({ label, name, value, onChange, icon, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-widest pl-1">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-border/80">
        {icon}
      </div>
      <input 
        type="text" 
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-5 py-4 bg-brand-blue/[0.02] border border-brand-border/60 rounded-2xl font-medium text-[14px] focus:border-brand-blue outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  </div>
);

const EduInput = ({ label, value, onChange, placeholder, icon }: { label: string, value: string, onChange: (v: string) => void, placeholder: string, icon?: any }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-brand-muted uppercase tracking-widest pl-1">{label}</label>
    <div className="relative">
       {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-border/60">
          {icon}
        </div>
      )}
      <input 
        type="text" 
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full pr-5 py-3.5 bg-white border border-brand-border/60 rounded-[18px] font-medium text-[13px] focus:border-brand-blue outline-none transition-all placeholder:text-slate-300",
          icon ? "pl-11" : "pl-5"
        )}
      />
    </div>
  </div>
);

export default ResumeBuilder;
