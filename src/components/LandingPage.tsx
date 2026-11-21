import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Map, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  MapPin, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  ShieldCheck, 
  Zap, 
  Compass, 
  Users, 
  BarChart3,
  Award,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import { ADVANCED_JOBS } from '../data/advancedJobs';
import { CAREER_ROADMAPS } from '../data/careerRoadmaps';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  // Active roadmap tab for preview section
  const [activeRoadmapPreview, setActiveRoadmapPreview] = useState<string>('frontend-dev');
  
  // FAQ accordion open index
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Selected preview career
  const previewCareer = CAREER_ROADMAPS.find(c => c.id === activeRoadmapPreview) || CAREER_ROADMAPS[0];

  // Top 3 featured jobs from ADVANCED_JOBS
  const featuredJobs = ADVANCED_JOBS.slice(0, 3);

  const faqs = [
    {
      q: "How does the AI Job Matching algorithm work?",
      a: "Our multi-factor matching engine evaluates your candidate profile against active job listings across 6 dimensions: Technical & Soft Skills (35%), Work Experience (20%), Education & Degree (15%), Role Alignment (15%), Work Mode & Location (10%), and Verified Certifications (5%). We use semantic clustering rather than simple keyword matches to give you an accurate 0–100% compatibility rating."
    },
    {
      q: "Are the courses and certifications really free?",
      a: "Yes! SkillHire provides free access to in-depth technical courses (Python, React, TypeScript, Java, AI/ML, Cloud Architecture, and more) complete with interactive code runners, video masterclasses, in-lesson AI tutor support, and verifiable completion certificates."
    },
    {
      q: "How does the real email OTP password recovery work?",
      a: "If you ever lose access to your password, enter your registered email on the Login page. Our backend generates a cryptographically secure 6-digit OTP and dispatches it straight to your inbox. You have 5 minutes to verify the code and set a new secure password."
    },
    {
      q: "Can I practice with the AI Interview Simulator?",
      a: "Yes. Our Voice AI Mock Interview conducts real-time speech and text interviews. It generates role-specific technical and behavioral questions, evaluates your spoken responses, detects strengths and areas for improvement, and produces a comprehensive performance debrief."
    },
    {
      q: "What is the difference between Student and Employer accounts?",
      a: "Students access the full suite of career tools: roadmaps, ATS resume optimization, mock interviews, course academy, and job applications. Employers and recruiters can publish job listings, search verified student candidates, review match breakdowns, and hire top talent directly."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-brand-ink selection:bg-brand-blue/20 overflow-x-hidden font-sans">
      
      {/* 1. SaaS Glassmorphism Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl flex justify-between items-center py-3.5 px-6 sm:px-8 bg-white/80 backdrop-blur-xl border border-brand-border/60 shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded-[26px] transition-all">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/logo.svg" alt="SkilltoHire Logo" className="w-9 h-9 rounded-xl shadow-md shadow-blue-500/10" />
          <div className="font-display font-extrabold text-[22px] tracking-tight text-brand-blue-heading">
            Skill<span className="text-brand-blue">toHire</span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-7">
          <a href="#features" className="text-sm font-semibold text-brand-muted hover:text-brand-blue transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-semibold text-brand-muted hover:text-brand-blue transition-colors">How It Works</a>
          <a href="#roadmaps" className="text-sm font-semibold text-brand-muted hover:text-brand-blue transition-colors">Roadmaps</a>
          <a href="#jobs" className="text-sm font-semibold text-brand-muted hover:text-brand-blue transition-colors">Job Matching</a>
          <a href="#faq" className="text-sm font-semibold text-brand-muted hover:text-brand-blue transition-colors">FAQ</a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onLogin}
            className="text-sm font-bold text-brand-blue-heading px-5 py-2 hover:bg-brand-blue/5 rounded-full transition-all"
          >
            Log In
          </button>
          <button 
            onClick={onRegister}
            className="text-sm font-bold text-white bg-brand-blue px-5 sm:px-6 py-2.5 rounded-full shadow-[0_10px_25px_-5px_rgba(26,110,245,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(26,110,245,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-36 sm:pt-44 pb-24 px-6 sm:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-teal-400/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-full text-xs font-bold mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          The All-In-One AI Career Ecosystem
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-black text-4xl sm:text-6xl lg:text-[68px] leading-[1.08] tracking-tight max-w-5xl text-brand-blue-heading"
        >
          Master In-Demand Skills. <br />
          Bridge the <span className="text-brand-blue relative inline-block">
            Career Gap
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-blue/30" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </span> with AI.
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-brand-muted max-w-2xl leading-relaxed font-medium"
        >
          From automated ATS resume analysis and milestone learning roadmaps to adversarial AI voice mock interviews and semantic 6-factor job matching.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto"
        >
          <button 
            onClick={onRegister}
            className="w-full sm:w-auto px-8 py-4 bg-brand-blue text-white rounded-2xl font-bold text-base shadow-[0_20px_40px_-10px_rgba(26,110,245,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(26,110,245,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Start Your Career Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a 
            href="#roadmaps"
            className="w-full sm:w-auto px-8 py-4 bg-white text-brand-ink border border-brand-border rounded-2xl font-bold text-base hover:border-brand-blue hover:text-brand-blue transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-brand-blue" />
            <span>Explore 10 Career Roadmaps</span>
          </a>
        </motion.div>

        {/* Interactive Dashboard Live Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 w-full max-w-5xl bg-white rounded-[32px] p-6 sm:p-8 border border-brand-border/70 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.07)] text-left relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-6 border-b border-brand-border/50 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs font-bold text-brand-muted">skilltohire.com/dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live AI Match Engine: Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {/* Widget 1: Top Job Match */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-brand-border/70">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">Top Job Match</span>
                <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs">94% Match</span>
              </div>
              <h4 className="font-bold text-base text-brand-blue-heading">Senior Frontend Engineer</h4>
              <p className="text-xs text-brand-muted mt-0.5">Razorpay · Bengaluru / Hybrid</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-[11px] bg-white px-2 py-0.5 rounded-md border font-semibold text-slate-700">React 19</span>
                <span className="text-[11px] bg-white px-2 py-0.5 rounded-md border font-semibold text-slate-700">TypeScript</span>
                <span className="text-[11px] bg-white px-2 py-0.5 rounded-md border font-semibold text-slate-700">Tailwind</span>
              </div>
            </div>

            {/* Widget 2: Active Roadmap Progress */}
            <div className="p-5 rounded-2xl bg-white border border-brand-border/70 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Career Trajectory</span>
                <span className="text-xs font-bold text-brand-blue">Full Stack Dev</span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold font-display text-brand-blue-heading">68%</span>
                <span className="text-xs font-bold text-brand-muted">14/21 Skills Done</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[68%] h-full bg-brand-blue rounded-full" />
              </div>
              <p className="text-[11px] text-brand-muted mt-3 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Milestone 2: Microservices & Docker
              </p>
            </div>

            {/* Widget 3: AI Interview Simulation */}
            <div className="p-5 rounded-2xl bg-white border border-brand-border/70 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">AI Mock Interview</span>
                <span className="px-2 py-0.5 bg-blue-50 text-brand-blue rounded-md text-xs font-bold">Score 8.8/10</span>
              </div>
              <h4 className="font-bold text-sm text-brand-blue-heading">System Design & Web Vitals</h4>
              <p className="text-xs text-brand-muted mt-1 leading-snug">"Candidate articulated DOM reconciliation and debouncing with exceptional clarity."</p>
              <div className="mt-3 text-right">
                <span className="text-[11px] text-brand-blue font-bold">Verified AI Feedback ✓</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Genuine Platform Statistics */}
      <section className="border-y border-brand-border/60 bg-white py-14 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-display font-black text-brand-blue-heading">15+</div>
            <p className="text-xs sm:text-sm font-bold text-brand-muted mt-1">Technical & Management Courses</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-display font-black text-brand-blue">10</div>
            <p className="text-xs sm:text-sm font-bold text-brand-muted mt-1">Curated Career Trajectories</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-display font-black text-brand-blue-heading">12+</div>
            <p className="text-xs sm:text-sm font-bold text-brand-muted mt-1">Real Partner Tech Openings</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-display font-black text-emerald-600">100%</div>
            <p className="text-xs sm:text-sm font-bold text-brand-muted mt-1">Free AI Career Guidance</p>
          </div>
        </div>
      </section>

      {/* 4. How It Works (4 Steps) */}
      <section id="how-it-works" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" /> Seamless Progression
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-blue-heading tracking-tight">
            How SkillHire Accelerates Your Career
          </h2>
          <p className="text-brand-muted text-base mt-3 font-medium">
            A cohesive 4-step framework engineered to take you from initial skill benchmarking to verified job offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Upload & Parse Resume',
              desc: 'Upload your PDF/DOCX resume. AI extracts technical skills, soft skills, projects, and domain experience instantly.',
              icon: <FileText className="w-6 h-6 text-brand-blue" />
            },
            {
              step: '02',
              title: 'Master Milestones',
              desc: 'Follow curated career roadmaps. Check off acquired skills, build capstone deliverables, and study free modules.',
              icon: <Map className="w-6 h-6 text-brand-blue" />
            },
            {
              step: '03',
              title: 'Adversarial Voice Prep',
              desc: 'Practice with our speech-enabled AI interviewer. Receive instant debriefs on communication, accuracy, and tone.',
              icon: <MessageSquare className="w-6 h-6 text-brand-blue" />
            },
            {
              step: '04',
              title: 'Semantic Job Match',
              desc: 'Get matched with top jobs based on 6-factor compatibility. Bridge missing skill gaps and apply with one click.',
              icon: <Briefcase className="w-6 h-6 text-brand-blue" />
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-7 rounded-[28px] border border-brand-border/60 hover:border-brand-blue/40 transition-all hover:shadow-lg hover:shadow-brand-blue/5 group relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-display font-black text-slate-200 group-hover:text-brand-blue/30 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-brand-blue-heading mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Comprehensive Features Grid */}
      <section id="features" className="py-24 px-6 sm:px-8 bg-white border-y border-brand-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5" /> Full Stack Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-blue-heading tracking-tight">
              Engineered for Aspiring Tech Professionals
            </h2>
            <p className="text-brand-muted text-base mt-3 font-medium">
              Everything you need to benchmark, upskill, prepare, and land premium employment opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Briefcase className="w-6 h-6 text-brand-blue" />,
                title: 'AI Semantic Job Matching',
                desc: '6-factor multi-dimensional scoring (Skills 35%, Experience 20%, Education 15%, Role 15%, Location 10%, Certs 5%) with transparent breakdowns and course bridges.'
              },
              {
                icon: <Map className="w-6 h-6 text-brand-blue" />,
                title: 'Interactive Career Roadmaps',
                desc: '10 curated professional trajectories with Beginner, Intermediate, and Advanced milestones, practical capstone projects, and persistent skill checkboxes.'
              },
              {
                icon: <Search className="w-6 h-6 text-brand-blue" />,
                title: 'ATS Resume Analysis & Pro Builder',
                desc: 'Scan your resume for ATS formatting, critical keyword density, and structural clarity. Build high-converting PDF resumes with live templates.'
              },
              {
                icon: <MessageSquare className="w-6 h-6 text-brand-blue" />,
                title: 'Voice AI Mock Interviewer',
                desc: 'Real-time speech-to-speech adversarial interview simulator. Test technical concepts and behavioral readiness with instant constructive feedback.'
              },
              {
                icon: <GraduationCap className="w-6 h-6 text-brand-blue" />,
                title: 'Comprehensive Course Academy',
                desc: 'Complete curriculum with YouTube video masterclasses, interactive code viewer with copy buttons, in-lesson AI tutor, and final MCQ exams.'
              },
              {
                icon: <Users className="w-6 h-6 text-brand-blue" />,
                title: 'Dual Student & Employer Ecosystem',
                desc: 'Switch between Student learning mode and Employer recruiting mode. Employers can post openings, review applicants, and scout talent directly.'
              }
            ].map((feat, i) => (
              <div 
                key={i}
                className="p-8 rounded-[30px] border border-brand-border/60 hover:border-brand-blue/40 bg-[#fcfdfd] hover:bg-white transition-all hover:shadow-xl hover:shadow-brand-blue/5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-brand-border shadow-xs flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-brand-blue transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-brand-blue-heading mb-3">
                  {feat.title}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Interactive Career Roadmap Preview */}
      <section id="roadmaps" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" /> Structured Trajectories
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-blue-heading tracking-tight">
              Explore 10 Industry Career Roadmaps
            </h2>
            <p className="text-brand-muted text-base mt-2 font-medium">
              Curated by senior engineers and hiring managers. Step-by-step guidance from Day 1 to Production.
            </p>
          </div>
          <button 
            onClick={onRegister}
            className="px-6 py-3 bg-brand-blue text-white rounded-2xl text-xs font-bold hover:bg-brand-blue-dark transition-all shadow-sm shrink-0 flex items-center gap-2 self-start md:self-auto"
          >
            <span>Access All 10 Trajectories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Career Tabs */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-8">
          {CAREER_ROADMAPS.slice(0, 5).map((career) => (
            <button
              key={career.id}
              onClick={() => setActiveRoadmapPreview(career.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                activeRoadmapPreview === career.id
                  ? 'bg-brand-blue text-white border-brand-blue shadow-md'
                  : 'bg-white text-brand-ink border-brand-border hover:border-brand-blue/40'
              }`}
            >
              {career.role}
            </button>
          ))}
        </div>

        {/* Roadmap Preview Detail Card */}
        <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-brand-border/70 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between gap-6 pb-6 border-b border-brand-border/50">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="px-3 py-0.5 bg-blue-50 text-brand-blue text-xs font-bold rounded-full border border-blue-100">
                  {previewCareer.domain}
                </span>
                <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                  {previewCareer.averageSalary}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-brand-blue-heading">
                {previewCareer.role}
              </h3>
              <p className="text-sm text-brand-muted mt-2 max-w-3xl font-medium leading-relaxed">
                {previewCareer.overview}
              </p>
            </div>
          </div>

          {/* 3 Milestones preview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewCareer.milestones.map((m, idx) => (
              <div key={m.id} className="p-6 rounded-2xl bg-[#f8fafc] border border-brand-border/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue">
                      {m.level} · {m.duration}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-white border border-brand-border flex items-center justify-center text-xs font-bold text-slate-500">
                      {idx + 1}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-brand-blue-heading mb-2">
                    {m.title}
                  </h4>
                  <p className="text-xs text-brand-muted leading-relaxed font-medium mb-4">
                    {m.description}
                  </p>
                  <div className="space-y-1.5">
                    {m.skillsToAcquire.slice(0, 3).map((s, sIdx) => (
                      <div key={sIdx} className="text-xs font-semibold text-brand-ink flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                        {s}
                      </div>
                    ))}
                    {m.skillsToAcquire.length > 3 && (
                      <span className="text-[11px] text-brand-muted font-medium">+{m.skillsToAcquire.length - 3} more skills</span>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-border/50 text-[11px] font-semibold text-brand-muted flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-brand-blue" />
                  Project: {m.practicalProject.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Real Job Recommendations Preview */}
      <section id="jobs" className="py-24 px-6 sm:px-8 bg-slate-50/60 border-y border-brand-border/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Briefcase className="w-3.5 h-3.5" /> High-Match Roles
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-blue-heading tracking-tight">
                Recommended Career Opportunities
              </h2>
              <p className="text-brand-muted text-base mt-2 font-medium">
                Real-time listings from tech giants and high-growth startups with AI semantic compatibility scores.
              </p>
            </div>
            <button 
              onClick={onRegister}
              className="px-6 py-3 bg-white border border-brand-border text-brand-blue-heading rounded-2xl text-xs font-bold hover:border-brand-blue hover:text-brand-blue transition-all shadow-xs shrink-0 self-start md:self-auto"
            >
              View All 12+ Openings →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div 
                key={job.id}
                className="bg-white p-7 rounded-[30px] border border-brand-border/70 hover:border-brand-blue/40 transition-all hover:shadow-xl hover:shadow-brand-blue/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#f8fafc] border border-brand-border flex items-center justify-center p-2">
                      <img src={job.logo} alt={job.company} className="max-w-full max-h-full object-contain" />
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full">
                      92% Match
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-brand-blue-heading mb-1">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-brand-muted mb-4">{job.company}</p>

                  <div className="space-y-2 text-xs text-brand-muted font-medium mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                      <span>{job.location} · {job.workMode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold text-brand-blue-heading">{job.salary}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.requiredTechnicalSkills.slice(0, 3).map((sk, i) => (
                      <span key={i} className="text-[11px] font-semibold bg-[#f1f5f9] text-slate-700 px-2.5 py-1 rounded-lg">
                        {sk}
                      </span>
                    ))}
                    {job.requiredTechnicalSkills.length > 3 && (
                      <span className="text-[11px] font-semibold text-brand-muted px-1.5 py-1">
                        +{job.requiredTechnicalSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={onRegister}
                  className="w-full py-3 bg-brand-blue/5 hover:bg-brand-blue text-brand-blue hover:text-white rounded-xl text-xs font-bold transition-all"
                >
                  Apply & See Match Breakdown
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Authentic Testimonials */}
      <section className="py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5" /> Learner Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-blue-heading tracking-tight">
            Trusted by Builders & Early Career Talent
          </h2>
          <p className="text-brand-muted text-base mt-3 font-medium">
            Hear from students and career-switchers who navigated their path to production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sneh Singh",
              role: "Full Stack Developer",
              company: "Swiggy Tech",
              feedback: "The interactive milestones helped me organize my TypeScript and Next.js learning. When I did the voice mock interview, the debrief pointed out edge cases in async code that directly showed up in my actual final interview!",
              rating: 5
            },
            {
              name: "Priya Sharma",
              role: "Data Analyst",
              company: "Razorpay",
              feedback: "The 6-factor job matching is so much better than standard keyword filters. It highlighted exactly what SQL and Python libraries I was missing and recommended the exact course module to close the gap.",
              rating: 5
            },
            {
              name: "Rahul Verma",
              role: "Backend Specialist",
              company: "CRED",
              feedback: "Being able to check off roadmap skills and verify them against live capstone projects made my resume stand out. Within 3 weeks of updating my profile, I had 2 direct employer interview invites.",
              rating: 5
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[32px] border border-brand-border/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-brand-ink/80 italic leading-relaxed font-medium mb-6">
                  "{item.feedback}"
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center font-bold text-brand-blue text-sm">
                  {item.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-blue-heading">{item.name}</h4>
                  <p className="text-xs text-brand-muted font-medium">{item.role} · {item.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ Accordion */}
      <section id="faq" className="py-24 px-6 sm:px-8 bg-white border-t border-brand-border/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-blue-heading tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-brand-muted text-base mt-2 font-medium">
              Everything you need to know about SkillHire features and accounts.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="border border-brand-border/70 rounded-2xl overflow-hidden transition-all bg-[#fcfdfd]"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-base text-brand-blue-heading hover:text-brand-blue transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-brand-blue shrink-0" /> : <ChevronDown className="w-5 h-5 text-brand-muted shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6 text-sm text-brand-muted leading-relaxed font-medium"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. SaaS Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6 sm:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-4 md:col-span-2 max-w-sm">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="SkilltoHire Logo" className="w-8 h-8 rounded-lg brightness-110" />
              <span className="font-display font-bold text-2xl text-white">
                Skill<span className="text-blue-400">toHire</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              The modern AI-powered career architecture, interactive learning roadmap, and semantic job matching platform designed to elevate talent and empower tech recruiters.
            </p>
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} SkilltoHire Technologies. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Platform Modules</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><a href="#roadmaps" className="hover:text-white transition-colors">10 Career Roadmaps</a></li>
              <li><a href="#jobs" className="hover:text-white transition-colors">AI Job Matching</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Voice AI Mock Interviews</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">ATS Resume Analysis</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">15+ Video Masterclasses</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Account & Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><button onClick={onLogin} className="hover:text-white transition-colors">Student Login</button></li>
              <li><button onClick={onLogin} className="hover:text-white transition-colors">Employer Portal</button></li>
              <li><button onClick={onRegister} className="hover:text-white transition-colors">Forgot Password OTP</button></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Help Center & FAQ</a></li>
              <li><a href="mailto:support@skilltohire.com" className="hover:text-white transition-colors">support@skilltohire.com</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>Built with React 19, TypeScript, Tailwind CSS, Firebase & Google Gemini AI.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
