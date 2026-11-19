export type UserRole = 'student' | 'employee';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  summary: string;
  content: string[];
  codeSnippet?: string;
  codeLanguage?: string;
  keyTakeaways: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  domain: string;
  category?: 'Technical' | 'Non-Technical';
  points: number;
  theoryPages: string[];
  modules?: CourseModule[];
  videoUrl?: string;
  quiz: QuizQuestion[];
  passingScore: number;
}

// --- Career2Skill / SKILL2CAREER Types ---

export type EligibleBranch = 'CSE' | 'AIDS' | 'IT' | 'EC' | 'Data Science';

export const ELIGIBLE_BRANCHES: { code: EligibleBranch; label: string; description: string }[] = [
  { code: 'CSE', label: 'Computer Science & Engineering', description: 'Core algorithms, software engineering, OS, networks' },
  { code: 'AIDS', label: 'AI & Data Science', description: 'Machine learning, deep learning, NLP, computer vision' },
  { code: 'IT', label: 'Information Technology', description: 'Cloud infrastructure, web systems, database design' },
  { code: 'EC', label: 'Electronics & Communication', description: 'Embedded systems, IoT, signal processing, VLSI/firmware' },
  { code: 'Data Science', label: 'Data Science & Analytics', description: 'Statistical modeling, big data pipelines, business intelligence' },
];

export type RoleType = 'Technical' | 'Non-Technical';
export type OpportunityType = 'Internship with PPO' | 'Direct Placement';
export type WorkMode = 'In-Office' | 'Remote' | 'Hybrid';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyLogoText: string;
  roleType: RoleType;
  opportunityType: OpportunityType;
  workMode: WorkMode;
  location: string;
  vacancies: number;
  experienceLevel: 'Freshers Only'; // strictly freshers only
  batchEligibility: string[]; // e.g. ['2025', '2026', '2027']
  targetBranches: EligibleBranch[];
  duration: string; // e.g., '6 Months (PPO Conversion)' or 'Full-Time (Direct)'
  stipendOrSalary: string; // e.g., '₹45,000/month + ₹12 LPA PPO'
  hasCertificateOfCompletion: boolean;
  certificateDetails?: string;
  verifiedCompanyEmail: string; // Mandatory real company email e.g. careers@razorpay.com
  isEmailDomainVerified: boolean;
  indeedUrl: string; // Direct integration/linking with Indeed app
  indeedJobId: string;
  description: string;
  keySkills: string[];
  selectionRounds: string[];
  postedDaysAgo: number;
  isGenuineVerified: boolean;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: EligibleBranch;
  graduationYear: string;
  skills: string[];
  avatarInitial?: string;
  role?: UserRole;
}

export interface PlatformReview {
  id: string;
  studentName: string;
  branch: EligibleBranch;
  companyPlaced: string;
  roleTitle: string;
  opportunityType: OpportunityType;
  packageOrStipend: string;
  rating: number; // 1-5
  reviewText: string;
  date: string;
  verifiedHire: boolean;
}

export interface CareerQuizPreferences {
  roleType: 'All' | RoleType;
  opportunityType: 'All' | OpportunityType;
  location: string;
  stipendPreference: string; // 'Any' | '35k+' | '45k+' | 'Placement'
  certificateRequired: boolean;
}

export interface FilterOptions {
  searchQuery: string;
  roleType: 'All' | RoleType;
  opportunityType: 'All' | OpportunityType;
  location: string;
  selectedBranch: 'All' | EligibleBranch;
  certificateOnly: boolean;
  minVacancies: number;
}

// --- Advanced AI-Powered Job Matching Types ---

export interface AdvancedJobListing {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  salary: string;
  experienceRequired: string;
  minExperienceYears: number;
  educationRequired: string;
  employmentType: 'Full-time' | 'Internship with PPO' | 'Direct Placement';
  domain: 'Frontend' | 'Backend' | 'Full Stack' | 'Cloud & DevOps' | 'AI & ML' | 'UI/UX Design' | 'Product Management' | 'Cybersecurity' | 'Business Analytics' | 'Database' | 'Digital Marketing';
  requiredTechnicalSkills: string[];
  requiredSoftSkills: string[];
  preferredCertifications: string[];
  description: string;
  responsibilities: string[];
  benefits: string[];
  applicationDeadline: string;
  postedDate: string;
  vacancies?: number;
}

export interface CandidateProfile {
  name: string;
  email: string;
  phone?: string;
  targetRole: string;
  technicalSkills: string[];
  softSkills: string[];
  experienceYears: number;
  education: {
    degree: string;
    field: string;
    college: string;
    graduationYear: string;
    gpa?: string;
  };
  workExperience?: {
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  certifications?: string[];
  preferredLocation: string;
  preferredWorkMode: 'Any' | 'Remote' | 'Hybrid' | 'On-site';
}

export interface MatchBreakdown {
  overallScore: number;
  matchRating: 'Excellent Match' | 'Strong Match' | 'Good Match' | 'Low Match';
  skillsScore: number; // Max 35
  experienceScore: number; // Max 20
  educationScore: number; // Max 15
  roleAlignmentScore: number; // Max 15
  locationScore: number; // Max 10
  certificationsScore: number; // Max 5
  matchedTechnicalSkills: string[];
  missingTechnicalSkills: string[];
  matchedSoftSkills: string[];
  missingSoftSkills: string[];
  experienceMatchStatus: string;
  educationMatchStatus: string;
  strengths: string[];
  areasToImprove: string[];
  recommendedCourseId?: string;
  aiNarrative: string;
}

export interface JobApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  matchScoreAtApply: number;
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Assessment Scheduled';
}
