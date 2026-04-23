import React, { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import ResumeUploader from './components/ResumeUploader';
import { CourseCard } from './components/CourseCard';
import JobRecommendations from './components/JobRecommendations';
import ProfileEditor from './components/ProfileEditor';
import { ResumeAnalysis } from './services/ai';
import { cn } from './lib/utils';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Search, 
  LogOut, 
  User as UserIcon, 
  Sparkles,
  Trophy,
  Github,
  Mail,
  Linkedin,
  BookOpen,
  Bell,
  Settings,
  ChevronRight,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ResumeScoreChart from './components/ResumeScoreChart';

const COURSES = [
  { id: '1', title: 'Introduction to HTML', description: 'Learn the foundational building blocks of the web and structure your first page.', domain: 'Web Dev', duration: '5h', points: 100 },
  { id: '2', title: 'CSS Fundamentals', description: 'Master the art of styling web pages with layouts, colors, and responsive design.', domain: 'Web Dev', duration: '8h', points: 120 },
  { id: '3', title: 'JavaScript Basics', description: 'Understand the core concepts of JavaScript and add interactivity to your sites.', domain: 'Frontend', duration: '12h', points: 150 },
  { id: '4', title: 'Python for Beginners', description: 'Start your coding journey with one of the most popular and versatile languages.', domain: 'Coding', duration: '10h', points: 130 },
  { id: '5', title: 'Core Java', description: 'Dive into object-oriented programming with the powerful and robust Java language.', domain: 'Backend', duration: '15h', points: 180 },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'login' | 'register'>('home');
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'profile' | 'my_courses'>('overview');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, { progress: number, status: string }>>({});
  const [matchingJobs, setMatchingJobs] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Fetch user progress
        const userRef = doc(db, "users", u.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCompletedCourses(data.completedCourses || []);
          
          // Fetch Enrollments
          const enrollmentsQuery = query(collection(db, "enrollments"), where("userId", "==", u.uid));
          const enrollmentsSnap = await getDocs(enrollmentsQuery);
          const enrollMap: Record<string, any> = {};
          enrollmentsSnap.forEach(doc => {
            const d = doc.data();
            enrollMap[d.courseId] = { progress: d.progress, status: d.status };
          });
          setEnrollments(enrollMap);
        } else {
          // Initialize user document with mandatory fields
          const newUser = {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
            completedCourses: [],
            createdAt: new Date().toISOString()
          };
          await setDoc(userRef, newUser);
          setCompletedCourses([]);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAnalysisComplete = async (data: ResumeAnalysis) => {
    setAnalysis(data);
    // Fetch jobs from backend
    const res = await fetch('/api/jobs/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills: data.skills, domain: data.matchingDomains[0] })
    });
    const result = await res.json();
    setMatchingJobs(result.matches);
  };

  const markCourseComplete = async (courseId: string) => {
    if (!user) return;
    const newCompleted = [...completedCourses, courseId];
    setCompletedCourses(newCompleted);
    
    // Update User Doc
    await setDoc(doc(db, "users", user.uid), { completedCourses: newCompleted }, { merge: true });
    
    // Update Enrollment
    const enrollmentId = `${user.uid}_${courseId}`;
    await setDoc(doc(db, "enrollments", enrollmentId), {
      progress: 100,
      status: 'completed'
    }, { merge: true });
    
    setEnrollments(prev => ({
      ...prev,
      [courseId]: { progress: 100, status: 'completed' }
    }));
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) return;
    const enrollmentId = `${user.uid}_${courseId}`;
    const newEnrollment = {
      userId: user.uid,
      courseId,
      progress: 0,
      status: 'enrolled',
      enrolledAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, "enrollments", enrollmentId), newEnrollment);
    setEnrollments(prev => ({
      ...prev,
      [courseId]: { progress: 0, status: 'enrolled' }
    }));
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-brand-muted font-medium">Initializing Ecosystem...</p>
      </div>
    </div>
  );

  // Authenticated Dashboard
  if (user) return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-brand-border flex flex-col h-screen sticky top-0 hidden lg:flex">
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-blue rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-black text-2xl tracking-tighter text-brand-ink">SkillHire</span>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 mt-4">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Dashboard Home' },
            { id: 'my_courses', icon: GraduationCap, label: 'My Courses' },
            { id: 'resume', icon: Search, label: 'Resume Tools' },
            { id: 'jobs', icon: Sparkles, label: 'Job Matching' },
            { id: 'profile', icon: UserIcon, label: 'Settings' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setDashboardTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                (dashboardTab === item.id || (item.id === 'overview' && dashboardTab === 'overview')) 
                  ? "bg-brand-blue text-white shadow-lg shadow-blue-100" 
                  : "text-brand-muted hover:bg-slate-50 hover:text-brand-ink"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-brand-border">
          <div className="glass p-4 rounded-3xl relative group overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                alt="Profile"
              />
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-brand-ink truncate">{user.displayName}</p>
                <p className="text-[10px] font-bold text-brand-muted truncate">ID: {user.uid.slice(0, 8)}</p>
              </div>
              <button onClick={logout} className="p-2 text-brand-muted hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-brand-border px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted group-focus-within:text-brand-blue transition-colors" />
              <input 
                type="text" 
                placeholder="Search courses, skills, or mentors..." 
                className="w-full bg-slate-50 border border-brand-border rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:border-brand-blue focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-6 ml-8">
            <button className="relative p-2 text-brand-muted hover:text-brand-ink transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-brand-border" />
            <button onClick={() => setDashboardTab('profile')} className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-brand-ink leading-none">{user.displayName}</p>
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Student</p>
              </div>
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border-2 border-brand-blue/20 group-hover:border-brand-blue transition-colors"
                alt="Profile"
              />
            </button>
          </div>
        </header>

        <main className="flex-1 p-10 space-y-8 overflow-y-auto bg-[#fafbfc]">
          {dashboardTab === 'profile' ? (
            <div className="space-y-8">
              <header>
                <h1 className="text-3xl font-display font-black text-brand-ink tracking-tight">Identity Management</h1>
                <p className="text-brand-muted text-sm mt-1 font-medium">Fine-tune your professional presence across the SkillHire ecosystem.</p>
              </header>
              <div className="bg-white p-10 rounded-[40px] border border-brand-border shadow-sm">
                <ProfileEditor user={user} />
              </div>
            </div>
          ) : dashboardTab === 'my_courses' ? (
            <div className="space-y-8">
              <header>
                <h1 className="text-3xl font-display font-black text-brand-ink tracking-tight">University of You</h1>
                <p className="text-brand-muted text-sm mt-1 font-medium">Tracking your path to mastery. Complete courses to earn verified certificates.</p>
              </header>
              
              {Object.keys(enrollments).length === 0 ? (
                <div className="bg-white p-20 rounded-[40px] border border-brand-border shadow-sm text-center space-y-6">
                  <div className="w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-10 h-10 text-brand-blue opacity-40" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-black text-brand-ink">No Active Enrollments</h3>
                    <p className="text-brand-muted max-w-sm mx-auto font-medium">You haven't added any skills to your methodology yet. Explore the catalog to begin.</p>
                  </div>
                  <button 
                    onClick={() => setDashboardTab('overview')}
                    className="px-8 py-4 bg-brand-blue text-white rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:bg-brand-blue-dark transition-all active:scale-95"
                  >
                    Discover Courses
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {COURSES.filter(c => enrollments[c.id]).map(course => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      isEnrolled={true}
                      isCompleted={completedCourses.includes(course.id)}
                      progress={enrollments[course.id]?.progress || 0}
                      onEnroll={enrollInCourse}
                      onComplete={markCourseComplete}
                      userName={user.displayName || "Learner"}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : dashboardTab === 'resume' ? (
            <div className="space-y-10 max-w-4xl">
              <header>
                <h1 className="text-3xl font-display font-black text-brand-ink tracking-tight">Resume Evolution</h1>
                <p className="text-brand-muted text-sm mt-1 font-medium">Upload your resume to receive AI feedback and ecosystem mapping.</p>
              </header>
              <div className="glass p-12 rounded-[40px]">
                <ResumeUploader onAnalysisComplete={handleAnalysisComplete} />
              </div>
              {analysis && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-[32px] space-y-4">
                    <h3 className="font-black uppercase tracking-widest text-[10px] text-brand-blue">Analysis Insights</h3>
                    <ul className="space-y-3">
                      {analysis.feedback.map((f, i) => (
                        <li key={i} className="text-xs font-medium text-brand-muted flex gap-2">
                          <span className="text-brand-blue">•</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass p-8 rounded-[32px] space-y-4">
                    <h3 className="font-black uppercase tracking-widest text-[10px] text-brand-blue">Ecosystem Domain</h3>
                    <p className="text-2xl font-display font-black text-brand-ink">{analysis.matchingDomains[0]}</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-white rounded-md border text-[9px] font-black uppercase tracking-widest">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : dashboardTab === 'jobs' ? (
            <div className="space-y-8 max-w-5xl">
              <header>
                <h1 className="text-3xl font-display font-black text-brand-ink tracking-tight">Market Synchronization</h1>
                <p className="text-brand-muted text-sm mt-1 font-medium">Current matches based on your validated skill topology.</p>
              </header>
              <div className="glass p-10 rounded-[40px]">
                <JobRecommendations jobs={matchingJobs} domain={analysis?.matchingDomains[0] || 'General'} />
              </div>
            </div>
          ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column: Learning & Courses */}
            <div className="flex-[2] space-y-10 w-full">
              <header className="flex justify-between items-center">
                <div className="space-y-1">
                  <h1 className="text-4xl font-display font-black text-brand-ink tracking-tight">
                    Welcome back, {user.displayName?.split(' ')[0]}
                  </h1>
                  <p className="text-brand-muted text-sm font-medium">Your professional ecosystem is current. 4 new job matches found.</p>
                </div>
              </header>

              <section className="space-y-6">
                <div className="flex justify-between items-end">
                  <h2 className="text-2xl font-display font-black text-brand-ink">Active Curriculum</h2>
                  <button 
                    onClick={() => setDashboardTab('my_courses')}
                    className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-2 hover:opacity-70 transition-opacity"
                  >
                    View Enrolled <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {COURSES.map(course => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      isEnrolled={!!enrollments[course.id]}
                      isCompleted={completedCourses.includes(course.id)}
                      progress={enrollments[course.id]?.progress || 0}
                      onEnroll={enrollInCourse}
                      onComplete={markCourseComplete}
                      userName={user.displayName || "Learner"}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: AI Analysis & Tools */}
            <div className="flex-1 space-y-8 w-full">
              {/* Score Chart Widget */}
              <div className="glass p-8 rounded-[40px] border border-white/50 flex flex-col items-center text-center space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-brand-ink">Resume Score</h3>
                <ResumeScoreChart score={analysis?.score || 0} />
                <div className="space-y-2">
                  <p className="text-xs font-black text-brand-ink">
                    {analysis ? 'Optimized for Hiring' : 'Analysis Pending'}
                  </p>
                  <p className="text-[10px] font-medium text-brand-muted max-w-[180px]">
                    {analysis 
                      ? `Matching ${analysis.skills.length} core skills in ${analysis.matchingDomains[0]}.` 
                      : 'Upload your latest resume to analyze your ecosystem positioning.'}
                  </p>
                </div>
              </div>

              {/* Resume Widget */}
              <div className="glass p-8 rounded-[40px] border border-white/50 space-y-6 overflow-hidden relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                    <Search className="w-5 h-5 text-brand-blue" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-brand-ink">Analyzer</h3>
                </div>
                
                <ResumeUploader onAnalysisComplete={handleAnalysisComplete} />
              </div>

              {/* Stats Widget */}
              <div className="glass p-8 rounded-[40px] border border-white/50 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-brand-ink">Platform Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-3xl border border-brand-border/50">
                    <p className="text-[9px] font-black uppercase tracking-widest text-brand-muted mb-1">Courses</p>
                    <p className="text-xl font-display font-black text-brand-ink">{completedCourses.length}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl border border-brand-border/50">
                    <p className="text-[9px] font-black uppercase tracking-widest text-brand-muted mb-1">XP Points</p>
                    <p className="text-xl font-display font-black text-brand-ink">
                      {completedCourses.reduce((acc, id) => acc + (COURSES.find(c => c.id === id)?.points || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Certificates */}
              {completedCourses.length > 0 && (
                <div className="glass p-8 rounded-[40px] border border-white/50 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-widest text-brand-ink">Certificates</h3>
                    <Trophy className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="space-y-4">
                    {completedCourses.slice(0, 3).map(courseId => {
                      const course = COURSES.find(c => c.id === courseId);
                      return course ? (
                        <div key={courseId} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-brand-border/50 group hover:border-brand-blue transition-colors cursor-pointer">
                          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-brand-ink truncate uppercase tracking-tight">{course.title}</p>
                            <p className="text-[9px] font-medium text-brand-muted">Verified badge</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="pt-10 text-center text-brand-muted text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
          © 2026 Skill to Hire Platform — Built with Gemini 1.5 Pro
        </footer>
      </main>
    </div>
  </div>
);

  // Home Page
  if (view === 'home') return (
    <div className="min-h-screen bg-brand-cream font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-5 px-6 md:px-16 bg-brand-cream/90 backdrop-blur-xl border-b border-brand-border">
        <div className="flex items-center gap-2">
          <div className="font-display font-black text-2xl tracking-tighter text-brand-ink">
            Skill<span className="text-brand-blue">toHire</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('login')}
            className="text-sm font-bold text-brand-ink px-6 py-2.5 rounded-full border-1.5 border-brand-ink hover:bg-brand-ink hover:text-white transition-all"
          >
            Log In
          </button>
          <button 
            onClick={() => setView('register')}
            className="text-sm font-bold text-white bg-brand-blue px-6 py-2.5 rounded-full shadow-lg shadow-blue-100 hover:bg-brand-blue-dark transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      <div className="hero pt-44 pb-20 px-8 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-blue-200 bg-brand-blue/5 text-brand-blue rounded-full text-xs font-bold mb-10"
        >
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-blink" />
          AI-Powered Career Platform
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-extrabold text-[clamp(48px,8vw,84px)] leading-[1.05] tracking-tight max-w-4xl"
        >
          Build Skills. <br />
          Get <span className="relative">
            Hired
            <span className="absolute bottom-1 left-0 right-0 h-2 bg-brand-accent/40 rounded-full -rotate-1" />
          </span> Faster.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-xl text-brand-muted max-w-lg leading-relaxed font-medium"
        >
          The AI platform that bridges the gap between your skills and your dream job. Learn, practice, and get placed.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex gap-4 flex-wrap justify-center"
        >
          <button 
            onClick={() => setView('register')}
            className="px-10 py-5 bg-brand-blue text-white rounded-full font-bold text-lg shadow-xl shadow-blue-200 hover:bg-brand-blue-dark transition-all active:scale-95"
          >
            Start for Free →
          </button>
          <button 
            onClick={() => setView('login')}
            className="px-10 py-5 bg-white text-brand-ink border-1.5 border-brand-border rounded-full font-bold text-lg hover:border-brand-ink transition-all active:scale-95"
          >
            Sign In
          </button>
        </motion.div>
      </div>

      <div className="bg-white border-t border-brand-border flex flex-wrap justify-center gap-12 py-16 px-10">
        {[
          { icon: '🤖', label: 'AI Skill Analysis', sub: 'Identify gaps instantly' },
          { icon: '📚', label: 'Smart Learning', sub: 'Personalised roadmaps' },
          { icon: '💼', label: 'Job Matching', sub: 'Real career alignment' },
          { icon: '🎯', label: 'Interview Prep', sub: 'AI mock simulations' }
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-brand-cream rounded-2xl flex items-center justify-center text-2xl group-hover:bg-brand-blue/10 transition-colors">
              {feat.icon}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-brand-ink tracking-tight">{feat.label}</span>
              <span className="text-xs text-brand-muted font-medium">{feat.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Auth Card Template
  const renderAuthPage = (type: 'login' | 'register') => (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-160px] right-[-100px] w-[500px] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-120px] left-[-80px] w-[380px] h-[380px] bg-brand-accent/5 blur-[100px] rounded-full pointer-events-none" />
      
      <button 
        onClick={() => setView('home')}
        className="fixed top-6 left-8 flex items-center gap-2 text-white/60 font-bold text-sm hover:text-white transition-colors"
      >
        <LayoutDashboard className="w-4 h-4 rotate-180" />
        Back to Home
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white w-full max-w-[450px] m-4 p-12 rounded-[32px] shadow-2xl relative z-10"
      >
        <div className="text-center font-display font-black text-xl tracking-tighter text-brand-ink mb-10">
          Skill<span className="text-brand-blue">toHire</span>
        </div>

        <h2 className="font-display font-extrabold text-3xl tracking-tight text-brand-ink leading-none">
          {type === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-brand-muted text-sm font-medium mt-2 mb-8">
          {type === 'login' ? 'Sign in to continue your journey' : 'Join thousands building their careers'}
        </p>

        <button 
          onClick={loginWithGoogle}
          className="w-full py-3.5 bg-white border border-slate-200 text-[#3c4043] rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-sm border-b-2"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-brand-border/50" />
          <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">or email interface</span>
          <div className="flex-1 h-px bg-brand-border/50" />
        </div>

        <div className="space-y-4">
          {type === 'register' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest">Full Name</label>
              <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-slate-50 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-blue transition-colors" />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest">Email Address</label>
            <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 bg-slate-50 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-blue transition-colors" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest">Password</label>
              {type === 'login' && <span className="text-[10px] font-bold text-brand-blue cursor-pointer hover:underline">Forgot?</span>}
            </div>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-brand-border rounded-xl font-medium outline-none focus:border-brand-blue transition-colors" />
          </div>

          <button className="w-full py-4 bg-brand-blue text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-100 hover:bg-brand-blue-dark transition-all active:scale-95 mt-4">
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <div className="mt-8 text-center text-xs font-bold text-brand-muted">
          {type === 'login' ? (
            <>New here? <span onClick={() => setView('register')} className="text-brand-blue cursor-pointer hover:underline">Create an account</span></>
          ) : (
            <>Already have an account? <span onClick={() => setView('login')} className="text-brand-blue cursor-pointer hover:underline">Sign in</span></>
          )}
        </div>
      </motion.div>
    </div>
  );

  if (view === 'login') return renderAuthPage('login');
  if (view === 'register') return renderAuthPage('register');
  
  return null;
}

