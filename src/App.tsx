import React, { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout, db, handleFirestoreError, OperationType } from './lib/firebase';
import { 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  orderBy, 
  updateDoc,
  limit
} from 'firebase/firestore';
import ResumeUploader from './components/ResumeUploader';
import AuthPage from './components/AuthPage';
import { CourseCard } from './components/CourseCard';
import ProfileEditor from './components/ProfileEditor';
import CourseContent from './components/CourseContent';
import { ResumeAnalysis } from './services/ai';
import { Course } from './types';
import { cn, getAvatarUrl } from './lib/utils';
import firebaseConfigData from '../firebase-applet-config.json';
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
  Clock,
  Map,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ResumeScoreChart from './components/ResumeScoreChart';
import { COURSES } from './data/courses';
import CareerPath from './components/CareerPath';
import MockInterview from './components/MockInterview';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'login' | 'register'>('home');
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'profile' | 'my_courses' | 'path' | 'interview' | 'resume'>('overview');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, { progress: number, status: string }>>({});
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [firebaseError, setFirebaseError] = useState<{ path: string, message: string } | null>(null);
  const [pinModal, setPinModal] = useState<{ isOpen: boolean, courseId: string | null, error: string | null, pin: string }>({
    isOpen: false,
    courseId: null,
    error: null,
    pin: ''
  });

  // Auth form state
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Search & Notifications state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [dbCourses, setDbCourses] = useState<Course[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch courses from DB
  useEffect(() => {
    const fetchCourses = async () => {
      // Always start with local COURSES to ensure UI is immediate
      setDbCourses(COURSES);
      
      try {
        const coursesSnap = await getDocs(collection(db, "courses"));
        if (!coursesSnap.empty) {
          const coursesList: Course[] = [];
          coursesSnap.forEach(d => coursesList.push(d.data() as Course));
          setDbCourses(coursesList);
        }
      } catch (err: any) {
        // Silent fail for courses, we already have the local fallback
        if (!err.message?.toLowerCase().includes("permission")) {
           console.error("Course fetch error:", err);
        }
      }
    };
    fetchCourses();
  }, [user]); // Re-fetch on login state change if needed, but works for guest too

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearch.trim().length > 1) {
      const results = dbCourses.filter(course => 
        course.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        course.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        course.domain.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch, dbCourses]);

  // Notifications Listener
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const notifPath = "notifications";
    const notifQuery = query(
      collection(db, notifPath),
      where("userId", "==", user.uid),
      limit(20) // Removed orderBy to avoid requiring index immediately
    );
    
    const unsubscribe = onSnapshot(notifQuery, (snapshot) => {
      const notifs: any[] = [];
      snapshot.forEach(d => notifs.push({ id: d.id, ...d.data() }));
      setNotifications(notifs);
    }, (err: any) => {
      console.error("Notifications fetch error:", err);
      // Don't show full screen error for background notification polling
      // but log it enough to be caught by the Diagnostic tool
      if (err.message.toLowerCase().includes("permission")) {
        console.warn("Permission denied for notifications. Verify rules and index.");
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setLoading(true);
        try {
          // Parallel fetch for speed
          const [profileSnap, enrollmentsSnap] = await Promise.all([
            getDoc(doc(db, "users", u.uid)),
            getDocs(query(collection(db, "enrollments"), where("userId", "==", u.uid)))
          ]);

          // Handle Profile
          if (profileSnap.exists()) {
            const data = profileSnap.data();
            setCompletedCourses(data.completedCourses || []);
            setUserProfile(data);
          } else {
            console.log("No profile found, creating default for:", u.uid);
            const newUser = {
              uid: u.uid,
              email: u.email || "",
              displayName: u.displayName || "Learner",
              photoURL: u.photoURL || "",
              linkedin: '',
              github: '',
              resumeUrl: '',
              bio: '',
              phoneNumber: '',
              education: '',
              graduationDetails: '',
              dob: '',
              enrollmentPin: '',
              experience: 0,
              keySkills: [],
              completedCourses: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(doc(db, "users", u.uid), newUser);
            setCompletedCourses([]);
            setUserProfile(newUser);
          }

          // Handle Enrollments
          const enrollMap: Record<string, any> = {};
          enrollmentsSnap.forEach(snap => {
            const d = snap.data();
            enrollMap[d.courseId] = { progress: d.progress, status: d.status };
          });
          setEnrollments(enrollMap);

        } catch (err: any) {
          console.error("Initialization error:", err);
          if (err.message?.toLowerCase().includes("permission")) {
            setFirebaseError({ path: "Initialization", message: "Permission Denied. Please check your Firestore rules." });
          }
          handleFirestoreError(err, OperationType.GET, "app_init");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const markNotificationRead = async (id: string) => {
    const notifRef = doc(db, "notifications", id);
    try {
      await updateDoc(notifRef, { read: true });
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleAnalysisComplete = async (data: ResumeAnalysis) => {
    setAnalysis(data);
  };

  const handleEmailAuth = async (e: React.FormEvent, type: 'login' | 'register') => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (type === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        await updateProfile(userCredential.user, { displayName: authName });
        // The onAuthStateChanged listener will handle creating the Firestore document
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
    } catch (err: any) {
      console.error("Auth error details:", err);
      let message = err.message;
      if (err.code === 'auth/operation-not-allowed') {
        const projectId = firebaseConfigData.projectId;
        message = `SIGN-IN PROVIDER DISABLED: You must enable 'Email/Password' in the Firebase Console for project [${projectId}]. Visit: https://console.firebase.google.com/project/${projectId}/authentication/providers`;
      } else if (err.code === 'auth/weak-password') {
        message = "SECURITY ALERT: Password must be at least 6 characters.";
      } else if (err.code === 'auth/email-already-in-use') {
        message = "IDENTITY CONFLICT: This email is already registered. Try logging in instead.";
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        message = "AUTH FAILURE: Incorrect email or password. Please verify your credentials.";
      } else if (err.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        const projectId = firebaseConfigData.projectId;
        message = `UNAUTHORIZED DOMAIN: This URL [${domain}] is not allowed in your Firebase settings. Please visit: https://console.firebase.google.com/project/${projectId}/authentication/settings and add '${domain}' to 'Authorized domains'.`;
      }
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        console.error("Google Auth error:", err);
      }
      if (err.code === 'auth/operation-not-allowed') {
        setAuthError(
          "Google authentication is not enabled. Please enable it in the Firebase Console."
        );
      } else if (err.code === 'auth/popup-closed-by-user') {
        setAuthError("Sign-in popup was closed. Please try again.");
      } else if (err.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        const projectId = firebaseConfigData.projectId;
        setAuthError(`UNAUTHORIZED DOMAIN: This URL [${domain}] is not allowed in your Firebase settings. Please visit: https://console.firebase.google.com/project/${projectId}/authentication/settings and add '${domain}' to 'Authorized domains'.`);
      } else {
        setAuthError(err.message);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const markCourseComplete = async (courseId: string) => {
    if (!user) return;
    const newCompleted = [...completedCourses, courseId];
    setCompletedCourses(newCompleted);
    
    // Update User Doc
    const userPath = `users/${user.uid}`;
    try {
      await setDoc(doc(db, "users", user.uid), { completedCourses: newCompleted }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, userPath);
    }
    
    // Update Enrollment
    const enrollmentPath = `enrollments/${user.uid}_${courseId}`;
    try {
      await setDoc(doc(db, "enrollments", `${user.uid}_${courseId}`), {
        progress: 100,
        status: 'completed'
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, enrollmentPath);
    }
    
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

  const handleEnrollWithPin = async (courseId: string) => {
    if (!userProfile?.enrollmentPin) {
      // If no PIN set, just enroll
      return enrollInCourse(courseId);
    }

    setPinModal({ isOpen: true, courseId, error: null, pin: '' });
  };

  const verifyPinAndEnroll = () => {
    if (pinModal.pin === userProfile.enrollmentPin) {
      if (pinModal.courseId) enrollInCourse(pinModal.courseId);
      setPinModal({ isOpen: false, courseId: null, error: null, pin: '' });
    } else {
      setPinModal(prev => ({ ...prev, error: "Invalid Enrollment Password. Access Denied." }));
    }
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
    <div className="min-h-screen bg-brand-cream font-sans flex text-slate-900 overflow-hidden">
      <AnimatePresence>
        {pinModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-ink/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md p-10 rounded-[40px] shadow-2xl border border-white/20"
            >
              <div className="w-16 h-16 bg-brand-blue/10 rounded-3xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-display font-black text-brand-ink tracking-tight mb-2">Authentication Required</h2>
              <p className="text-brand-muted text-sm font-medium mb-8 leading-relaxed">
                Please enter your Professional Enrollment PIN/Password to access this curriculum module.
              </p>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-brand-ink uppercase tracking-widest block pl-1">Enrollment Signature</label>
                  <input 
                    type="password" 
                    placeholder="••••••"
                    maxLength={6}
                    value={pinModal.pin}
                    onChange={(e) => setPinModal(prev => ({ ...prev, pin: e.target.value, error: null }))}
                    className="w-full px-5 py-4 bg-brand-blue-light/30 border border-brand-border rounded-2xl font-bold text-center text-2xl tracking-[0.5em] outline-none focus:border-brand-blue focus:bg-white transition-all"
                  />
                </div>

                {pinModal.error && (
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center animate-shake">{pinModal.error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setPinModal({ isOpen: false, courseId: null, error: null, pin: '' })}
                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-brand-muted hover:text-brand-ink transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={verifyPinAndEnroll}
                    className="flex-[2] py-4 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-brand-blue-dark transition-all active:scale-95"
                  >
                    Authenticate & Enroll
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeCourse && (
        <CourseContent 
          course={activeCourse} 
          onClose={() => setActiveCourse(null)} 
          onComplete={markCourseComplete}
          userName={user.displayName || "Learner"}
        />
      )}
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
            { id: 'path', icon: Map, label: 'Career Roadmap' },
            { id: 'interview', icon: MessageSquare, label: 'Mock Interview' },
            { id: 'resume', icon: Search, label: 'Resume Tools' },
            { id: 'profile', icon: Settings, label: 'Platform Settings' }
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
                src={getAvatarUrl(userProfile?.photoURL || user.photoURL, userProfile?.displayName || user.displayName)} 
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-blue-light/30 border border-brand-border rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:border-brand-blue focus:bg-white transition-all"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-brand-border shadow-2xl p-4 space-y-2 max-h-96 overflow-y-auto z-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted px-2 mb-2">Search Results</p>
                  {searchResults.map(course => (
                    <button 
                      key={course.id}
                      onClick={() => {
                        setActiveCourse(course);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center gap-4 p-3 hover:bg-brand-blue-light/30 rounded-2xl transition-all text-left"
                    >
                      <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-brand-blue" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-brand-ink truncate">{course.title}</p>
                        <p className="text-[10px] font-medium text-brand-muted truncate">{course.domain} • {course.duration}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6 ml-8">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={cn(
                  "relative p-2 text-brand-muted hover:text-brand-ink transition-colors rounded-xl",
                  showNotifications && "bg-brand-blue-light/50 text-brand-blue"
                )}
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-full right-0 mt-4 w-80 bg-white rounded-3xl border border-brand-border shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-brand-border bg-brand-cream/30 flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-ink">Notifications</p>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-muted hover:text-brand-ink"
                      >
                        Close
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center space-y-2">
                          <p className="text-xs font-bold text-brand-ink">All caught up!</p>
                          <p className="text-[10px] font-medium text-brand-muted">No new updates right now.</p>
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => markNotificationRead(n.id)}
                            className={cn(
                              "p-4 border-b border-brand-border last:border-0 cursor-pointer transition-colors",
                              n.read ? "opacity-60" : "bg-brand-blue-light/10"
                            )}
                          >
                            <div className="flex gap-3">
                              <div className={cn(
                                "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                n.read ? "bg-transparent" : "bg-brand-blue"
                              )} />
                              <div className="space-y-1">
                                <p className="text-xs font-black text-brand-ink leading-tight">{n.title}</p>
                                <p className="text-[10px] font-medium text-brand-muted leading-relaxed">{n.message}</p>
                                <p className="text-[8px] font-black text-brand-muted/50 uppercase tracking-widest">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-8 w-px bg-brand-border" />
            <button onClick={() => setDashboardTab('profile')} className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-brand-ink leading-none">{userProfile?.displayName || user.displayName}</p>
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Student</p>
              </div>
              <img 
                src={getAvatarUrl(userProfile?.photoURL || user.photoURL, userProfile?.displayName || user.displayName)} 
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border-2 border-brand-blue/20 group-hover:border-brand-blue transition-colors object-cover"
                alt="Profile"
              />
            </button>
          </div>
        </header>

        <main className="flex-1 p-10 space-y-8 overflow-y-auto bg-brand-cream/50">
          {firebaseError && (
            <div className="bg-red-50 border border-red-200 p-6 rounded-[32px] flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                <Settings className="w-6 h-6 text-red-600" />
              </div>
              <div className="space-y-4 flex-1">
                <h3 className="text-lg font-black text-red-900 leading-tight">Firebase Security Rules Required</h3>
                <p className="text-sm text-red-700 font-medium leading-relaxed">
                  Your project <span className="font-bold underline">[{firebaseConfigData.projectId}]</span> returned a <span className="font-mono bg-red-100 px-1 rounded px-1">PERMISSION_DENIED</span> error for path: <span className="font-mono bg-red-100 px-1 rounded">/{firebaseError.path}</span>. 
                  <br /><br />
                  Since this is your own Firebase project, you must **manually** deploy the security rules. 
                  Visit the <a href={`https://console.firebase.google.com/project/${firebaseConfigData.projectId}/firestore/rules`} target="_blank" rel="noreferrer" className="underline font-bold hover:text-red-900">Firestore Rules Console</a> and paste the required rules provided in the chat.
                </p>
                
                <div className="bg-brand-ink/5 p-4 rounded-2xl space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-ink">Required Configuration:</p>
                  <ul className="text-[10px] font-bold text-brand-muted space-y-1 list-disc pl-4">
                    <li>Copy rules from <code className="bg-brand-ink/10 px-1 rounded">firestore.rules</code> file in the project.</li>
                    <li>Enable **Email/Password** and **Google** Auth providers.</li>
                    <li>Add <code className="bg-brand-ink/10 px-1 rounded">{window.location.hostname}</code> to 'Authorized Domains' in Auth settings.</li>
                    <li>Check if index for <code className="bg-brand-ink/10 px-1 rounded">notifications (userId ASC, createdAt DESC)</code> is required.</li>
                  </ul>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setFirebaseError(null)}
                    className="text-[10px] font-black uppercase tracking-widest text-red-800 hover:opacity-70"
                  >
                    Dismiss Warning
                  </button>
                  <a 
                    href={`https://console.firebase.google.com/project/${firebaseConfigData.projectId}/firestore/rules`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Open Console
                  </a>
                </div>
              </div>
            </div>
          )}

          {dashboardTab === 'profile' ? (
            <div className="space-y-8">
              <header>
                <h1 className="text-3xl font-display font-black text-brand-ink tracking-tight">Identity Management</h1>
                <p className="text-brand-muted text-sm mt-1 font-medium">Fine-tune your professional presence across the SkillHire ecosystem.</p>
              </header>
              <div className="bg-white p-10 rounded-[40px] border border-brand-border shadow-sm">
                <ProfileEditor 
                  user={user} 
                  initialData={userProfile}
                  onUpdate={(updatedData) => {
                    setUserProfile(updatedData);
                  }} 
                />
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
                      onEnroll={handleEnrollWithPin}
                      onComplete={markCourseComplete}
                      onView={(c) => setActiveCourse(c)}
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
                <div className="grid grid-cols-1 gap-8">
                  <div className="glass p-8 rounded-[32px] space-y-4">
                    <h3 className="font-black uppercase tracking-widest text-[10px] text-brand-blue">Summary - {analysis.candidateName || 'Unknown Candidate'}</h3>
                    <p className="text-sm font-medium text-brand-muted leading-relaxed">{analysis.summary}</p>
                    <div className="flex gap-4 mt-2">
                      <div className="bg-brand-cream px-3 py-2 rounded-xl">
                         <p className="text-xs font-bold text-brand-ink">ATS Match: {analysis.matchPercentage}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-[32px] space-y-4">
                      <h3 className="font-black uppercase tracking-widest text-[10px] text-brand-blue">Strengths & Keywords</h3>
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-brand-ink mt-2">Top Strengths</p>
                        <ul className="space-y-2">
                          {analysis.topStrengths?.map((s, i) => (
                            <li key={i} className="text-xs font-medium text-brand-muted flex gap-2">
                              <span className="text-green-500">•</span> {s}
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs font-bold text-brand-ink mt-4">Found Keywords</p>
                        <div className="flex flex-wrap gap-1">
                           {analysis.keywordAnalysis?.foundKeywords?.map((kw, i) => (
                             <span key={i} className="text-[9px] px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200">{kw}</span>
                           ))}
                        </div>
                      </div>
                    </div>
                    <div className="glass p-8 rounded-[32px] space-y-4">
                      <h3 className="font-black uppercase tracking-widest text-[10px] text-brand-blue">Feedback & Improvements</h3>
                      <div className="space-y-3">
                        <ul className="space-y-2">
                          {analysis.actionableImprovements?.map((f, i) => (
                            <li key={i} className="text-xs font-medium text-brand-muted flex gap-2">
                              <span className="text-brand-blue">•</span> {f}
                            </li>
                          ))}
                        </ul>
                        {analysis.formattingIssues?.length > 0 && (
                          <>
                            <p className="text-xs font-bold text-red-500 mt-4">Formatting Issues</p>
                            <ul className="space-y-2">
                              {analysis.formattingIssues.map((issue, i) => (
                                <li key={i} className="text-xs font-medium text-red-400 flex gap-2">
                                  <span>⚠</span> {issue}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : dashboardTab === 'path' ? (
            <div className="space-y-8 max-w-5xl">
              <header>
                <h1 className="text-3xl font-display font-black text-brand-ink tracking-tight">Smart Career Roadmap</h1>
                <p className="text-brand-muted text-sm mt-1 font-medium">AI-driven learning paths tailored to your current skill topology and target roles.</p>
              </header>
              <CareerPath 
                skills={analysis?.keywordAnalysis?.foundKeywords || []} 
                currentDomain={'Web Development'} 
              />
            </div>
          ) : dashboardTab === 'interview' ? (
            <div className="space-y-8 max-w-5xl">
              <header>
                <h1 className="text-3xl font-display font-black text-brand-ink tracking-tight">Interview Simulation</h1>
                <p className="text-brand-muted text-sm mt-1 font-medium">Test your depth against our adversarial AI interviewer. Zero-risk practice environment.</p>
              </header>
              <MockInterview />
            </div>
          ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column: Learning & Courses */}
            <div className="flex-[2] space-y-10 w-full">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h1 className="text-4xl font-display font-black text-brand-ink tracking-tight">
                    Welcome back, {user.displayName?.split(' ')[0]}
                  </h1>
                </div>
                <div className="flex gap-2">
                  {userProfile?.linkedin && (
                    <a href={userProfile.linkedin.startsWith('http') ? userProfile.linkedin : `https://${userProfile.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white rounded-2xl border border-brand-border text-[#0077b5] hover:shadow-md transition-shadow">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {userProfile?.github && (
                    <a href={userProfile.github.startsWith('http') ? userProfile.github : `https://${userProfile.github}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white rounded-2xl border border-brand-border text-[#333] hover:shadow-md transition-shadow">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
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
                      onEnroll={handleEnrollWithPin}
                      onComplete={markCourseComplete}
                      onView={(c) => setActiveCourse(c)}
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
                <ResumeScoreChart score={analysis?.atsScore || 0} />
                <div className="space-y-2">
                  <p className="text-xs font-black text-brand-ink">
                    {analysis ? 'Optimized for Hiring' : 'Analysis Pending'}
                  </p>
                  <p className="text-[10px] font-medium text-brand-muted max-w-[180px]">
                    {analysis 
                      ? `Your resume has been successfully analyzed and scored for compatibility.` 
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
                  <div className="bg-brand-blue-light/40 p-4 rounded-3xl border border-brand-border/50">
                    <p className="text-[9px] font-black uppercase tracking-widest text-brand-muted mb-1">Courses</p>
                    <p className="text-xl font-display font-black text-brand-ink">{completedCourses.length}</p>
                  </div>
                  <div className="bg-brand-blue-light/40 p-4 rounded-3xl border border-brand-border/50">
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
                        <div key={courseId} className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl border border-brand-border/50 group hover:border-brand-blue transition-colors cursor-pointer">
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

  if (view === 'login') return (
    <AuthPage 
      type="login" 
      setView={setView}
      authEmail={authEmail}
      setAuthEmail={setAuthEmail}
      authPassword={authPassword}
      setAuthPassword={setAuthPassword}
      authName={authName}
      setAuthName={setAuthName}
      authError={authError}
      authLoading={authLoading}
      handleGoogleLogin={handleGoogleLogin}
      handleEmailAuth={handleEmailAuth}
    />
  );
  
  if (view === 'register') return (
    <AuthPage 
      type="register" 
      setView={setView}
      authEmail={authEmail}
      setAuthEmail={setAuthEmail}
      authPassword={authPassword}
      setAuthPassword={setAuthPassword}
      authName={authName}
      setAuthName={setAuthName}
      authError={authError}
      authLoading={authLoading}
      handleGoogleLogin={handleGoogleLogin}
      handleEmailAuth={handleEmailAuth}
    />
  );
  
  return null;
}


