import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Share2
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: 'Remote' | 'Hybrid' | 'On-site';
  salary: string;
  experience: string;
  domain: 'Frontend' | 'Backend' | 'Full Stack' | 'Database' | 'AI / ML';
  requiredSkills: string[];
  description: string;
  benefits: string[];
}

const JOBS_DATA: JobListing[] = [
  {
    id: 'job-1',
    title: 'Frontend React Developer',
    company: 'Razorpay',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    location: 'Bengaluru, India',
    type: 'Hybrid',
    salary: '₹12 - 18 LPA',
    experience: '1-3 Years',
    domain: 'Frontend',
    requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'],
    description: 'Build fast, responsive client payment dashboards and high-converting checkout flows with modern React and TypeScript.',
    benefits: ['Health Insurance', 'Remote Work Flexibility', 'Learning Stipend']
  },
  {
    id: 'job-2',
    title: 'Full Stack Engineer',
    company: 'Swiggy',
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=60',
    location: 'Remote',
    type: 'Remote',
    salary: '₹14 - 22 LPA',
    experience: '1-4 Years',
    domain: 'Full Stack',
    requiredSkills: ['React', 'Node.js', 'JavaScript', 'SQL', 'MongoDB'],
    description: 'Work on real-time order tracking, merchant partner portals, and high-throughput microservices using React and Node.js.',
    benefits: ['Full Remote', 'Annual Bonus', 'ESOPs Option']
  },
  {
    id: 'job-3',
    title: 'Backend Java Developer',
    company: 'Infosys Finacle',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60',
    location: 'Hyderabad, India',
    type: 'Hybrid',
    salary: '₹10 - 16 LPA',
    experience: '0-3 Years',
    domain: 'Backend',
    requiredSkills: ['Java', 'SQL', 'Data Structures', 'Spring Boot', 'REST APIs'],
    description: 'Architect resilient banking transaction APIs, database transactions, and scalable microservices in Java.',
    benefits: ['Relocation Assistance', 'PF & Gratuity', 'Certification Bonuses']
  },
  {
    id: 'job-4',
    title: 'Database & SQL Data Analyst',
    company: 'Flipkart',
    logo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&auto=format&fit=crop&q=60',
    location: 'Bengaluru, India',
    type: 'Hybrid',
    salary: '₹9 - 15 LPA',
    experience: '0-2 Years',
    domain: 'Database',
    requiredSkills: ['SQL', 'Python', 'Relational Databases', 'Analytics'],
    description: 'Write complex SQL queries, analyze millions of eCommerce transactions, build dashboards, and optimize warehouse queries.',
    benefits: ['Cab Allowance', 'Wellness Subsidy', 'Performance Incentives']
  },
  {
    id: 'job-5',
    title: 'Python & AI Engineer',
    company: 'Zomato AI Labs',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=60',
    location: 'Gurugram, India',
    type: 'On-site',
    salary: '₹15 - 24 LPA',
    experience: '1-3 Years',
    domain: 'AI / ML',
    requiredSkills: ['Python', 'Machine Learning', 'Data Structures', 'SQL'],
    description: 'Train recommendation engines and natural language models to assist customers and delivery partners.',
    benefits: ['Free Meals', 'Gym Membership', 'Stock Grants']
  },
  {
    id: 'job-6',
    title: 'Junior Web Developer',
    company: 'Postman',
    logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&auto=format&fit=crop&q=60',
    location: 'Remote',
    type: 'Remote',
    salary: '₹8 - 14 LPA',
    experience: '0-2 Years',
    domain: 'Frontend',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Git'],
    description: 'Collaborate with global developers to create interactive API documentation, component libraries, and landing pages.',
    benefits: ['Home Office Setup', 'Unlimited Books Policy', 'Flexible Hours']
  }
];

interface JobMatchingProps {
  userSkills?: string[];
  completedCourses?: string[];
  onNavigateToCourse?: () => void;
}

export default function JobMatching({ 
  userSkills = ['JavaScript', 'HTML', 'CSS', 'React', 'Java', 'SQL', 'Python'],
  completedCourses = [],
  onNavigateToCourse 
}: JobMatchingProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  // Normalize skills list for matching
  const candidateSkills = (userSkills && userSkills.length > 0)
    ? userSkills.map(s => s.toLowerCase().trim())
    : ['html', 'css', 'javascript', 'react', 'java', 'sql'];

  // Calculate Match Percentage for a job
  const calculateMatch = (job: JobListing) => {
    const required = job.requiredSkills.map(s => s.toLowerCase());
    const matched = required.filter(s => candidateSkills.some(cs => cs.includes(s) || s.includes(cs)));
    const percentage = Math.round((matched.length / required.length) * 100);
    return {
      percentage: Math.max(40, Math.min(percentage, 100)), // realistic presentation
      matchedSkills: job.requiredSkills.filter(s => candidateSkills.some(cs => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs))),
      missingSkills: job.requiredSkills.filter(s => !candidateSkills.some(cs => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs)))
    };
  };

  const handleApply = (jobId: string) => {
    setAppliedJobs(prev => ({ ...prev, [jobId]: true }));
  };

  const toggleSave = (jobId: string) => {
    setSavedJobs(prev => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const filteredJobs = JOBS_DATA.filter(job => {
    const matchesDomain = selectedDomain === 'All' || job.domain === selectedDomain;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  }).sort((a, b) => calculateMatch(b).percentage - calculateMatch(a).percentage);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-blue-500/10">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Skill-to-Job Matching Engine
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            Curated Job Matches For You
          </h1>
          <p className="text-white/80 text-sm md:text-base leading-relaxed font-medium">
            Based on your verified competencies, resume analysis, and enrolled courses, our algorithm calculated your real-time compatibility scores for top hiring companies.
          </p>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold font-display">94%</div>
            <div className="text-xs text-white/70">Top Match Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-display">{JOBS_DATA.length}+</div>
            <div className="text-xs text-white/70">Active Openings</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-display">₹15 LPA</div>
            <div className="text-xs text-white/70">Avg. Compensation</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-display">Instant</div>
            <div className="text-xs text-white/70">Fast Track Referral</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-brand-border/60 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by role, company, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-brand-cream/40 border border-brand-border rounded-2xl text-sm font-medium outline-none focus:border-brand-blue focus:bg-white transition-all"
          />
        </div>

        {/* Domain Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['All', 'Frontend', 'Backend', 'Full Stack', 'Database', 'AI / ML'].map(domain => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                selectedDomain === domain 
                  ? "bg-brand-blue border-brand-blue text-white shadow-md shadow-blue-200" 
                  : "bg-white border-brand-border text-brand-muted hover:text-brand-blue-heading hover:border-brand-blue/30"
              )}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map(job => {
          const match = calculateMatch(job);
          const isApplied = appliedJobs[job.id];
          const isSaved = savedJobs[job.id];

          return (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-brand-border/60 p-6 md:p-8 hover:shadow-lg hover:border-brand-blue/30 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Row: Company & Match Badge */}
                <div className="flex justify-between items-start gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <img 
                      src={job.logo} 
                      alt={job.company} 
                      className="w-12 h-12 rounded-2xl object-cover border border-brand-border/60 shadow-sm"
                    />
                    <div>
                      <h3 className="font-display font-bold text-lg text-brand-blue-heading group-hover:text-brand-blue transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-muted mt-0.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{job.company}</span>
                        <span>•</span>
                        <span className="text-brand-blue">{job.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Badge */}
                  <div className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-black tracking-tight flex items-center gap-1.5 shrink-0 border",
                    match.percentage >= 80 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : match.percentage >= 60 
                        ? "bg-amber-50 text-amber-700 border-amber-200" 
                        : "bg-blue-50 text-brand-blue border-blue-200"
                  )}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{match.percentage}% Match</span>
                  </div>
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap gap-4 text-xs font-medium text-brand-muted mb-5 py-3 border-y border-brand-border/30">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-muted/70" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-brand-muted/70" />
                    {job.experience}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-brand-muted leading-relaxed line-clamp-2 mb-5">
                  {job.description}
                </p>

                {/* Skills Analysis */}
                <div className="space-y-3 mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-brand-muted flex items-center justify-between">
                    <span>Required Tech Stack</span>
                    <span className="text-emerald-600 font-black">{match.matchedSkills.length} Matched</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.map(skill => {
                      const isMatched = match.matchedSkills.includes(skill);
                      return (
                        <span
                          key={skill}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors border",
                            isMatched
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          )}
                        >
                          {isMatched && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-brand-border/40 flex items-center justify-between gap-3">
                <button
                  onClick={() => toggleSave(job.id)}
                  className={cn(
                    "p-3 rounded-xl border transition-colors",
                    isSaved ? "bg-amber-50 border-amber-300 text-amber-600" : "border-brand-border text-brand-muted hover:text-brand-blue"
                  )}
                  title={isSaved ? "Saved" : "Save Job"}
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleApply(job.id)}
                  disabled={isApplied}
                  className={cn(
                    "flex-1 py-3 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm",
                    isApplied
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default"
                      : "bg-brand-blue text-white hover:bg-brand-blue-dark active:scale-95 shadow-blue-200"
                  )}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      Application Submitted
                    </>
                  ) : (
                    <>
                      <span>Apply with Profile</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-brand-border p-8">
          <Briefcase className="w-12 h-12 text-brand-muted mx-auto mb-3" />
          <h3 className="font-bold text-brand-blue-heading text-lg">No matching roles found</h3>
          <p className="text-sm text-brand-muted mt-1">Try clearing your search query or selecting "All" categories.</p>
        </div>
      )}
    </div>
  );
}
