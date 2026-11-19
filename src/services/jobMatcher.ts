import { AdvancedJobListing, CandidateProfile, MatchBreakdown } from '../types';

// Semantic synonym clusters for tech & soft skills
const SYNONYM_CLUSTERS: Record<string, string[]> = {
  'react': ['react', 'react.js', 'reactjs', 'nextjs', 'next.js', 'frontend', 'redux', 'zustand', 'jsx', 'tsx'],
  'javascript': ['javascript', 'js', 'es6', 'typescript', 'ts', 'ecmascript'],
  'typescript': ['typescript', 'ts', 'javascript', 'js'],
  'html': ['html', 'html5', 'semantic html', 'web design'],
  'css': ['css', 'css3', 'tailwind', 'tailwind css', 'sass', 'responsive design', 'flexbox', 'grid'],
  'node.js': ['node', 'node.js', 'nodejs', 'express', 'express.js', 'nest.js', 'backend', 'rest apis'],
  'python': ['python', 'fastapi', 'django', 'flask', 'pandas', 'numpy', 'scipy', 'pytorch'],
  'java': ['java', 'spring boot', 'spring', 'jvm', 'hibernate', 'jpa', 'microservices'],
  'sql': ['sql', 'postgresql', 'postgres', 'mysql', 'relational databases', 'rdbms', 'sqlite', 'oracle', 'queries'],
  'cloud': ['aws', 'cloud', 'docker', 'kubernetes', 'k8s', 'devops', 'ci/cd', 'terraform', 'gcp', 'azure', 'linux'],
  'docker': ['docker', 'containers', 'containerization', 'kubernetes', 'k8s', 'cloud', 'devops'],
  'kubernetes': ['kubernetes', 'k8s', 'docker', 'containers', 'cloud', 'orchestration'],
  'aws': ['aws', 'cloud', 's3', 'ec2', 'lambda', 'cloud infrastructure'],
  'ai & ml': ['ai', 'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'llm', 'nlp', 'scikit-learn', 'data science'],
  'data science': ['data science', 'pandas', 'numpy', 'data analytics', 'data modeling', 'statistics', 'power bi'],
  'ui/ux design': ['ui', 'ux', 'ui/ux', 'ui/ux design', 'figma', 'wireframing', 'prototyping', 'design systems', 'user research', 'user experience'],
  'figma': ['figma', 'ui/ux', 'design systems', 'wireframing', 'prototyping', 'auto-layout'],
  'product management': ['product management', 'agile', 'scrum', 'prds', 'user stories', 'roadmap', 'product strategy', 'kpis'],
  'cybersecurity': ['cybersecurity', 'ethical hacking', 'network security', 'penetration testing', 'owasp', 'infosec', 'cryptography'],
  'power bi': ['power bi', 'business analytics', 'excel', 'dax', 'data modeling', 'kpi dashboards', 'tableau'],
  'communication': ['communication', 'verbal communication', 'presentation', 'written communication', 'stakeholder management'],
  'problem solving': ['problem solving', 'analytical skills', 'critical thinking', 'debugging', 'troubleshooting'],
  'teamwork': ['teamwork', 'team collaboration', 'cross-functional collaboration', 'pair programming', 'agile collaboration'],
  'leadership': ['leadership', 'ownership', 'mentorship', 'initiative', 'strategic thinking'],
  'agile': ['agile', 'scrum', 'sprint ceremonies', 'kanban', 'jira']
};

export function isSkillMatched(required: string, candidateSkills: string[]): boolean {
  const reqNorm = required.toLowerCase().trim();
  const candNorms = candidateSkills.map(s => s.toLowerCase().trim());

  // 1. Direct or substring match
  if (candNorms.some(cs => cs === reqNorm || cs.includes(reqNorm) || reqNorm.includes(cs))) {
    return true;
  }

  // 2. Cluster / Synonym lookup
  for (const [clusterKey, synonyms] of Object.entries(SYNONYM_CLUSTERS)) {
    const reqBelongs = synonyms.some(syn => reqNorm.includes(syn) || syn.includes(reqNorm));
    if (reqBelongs) {
      const candidateHasSyn = candNorms.some(cs => 
        synonyms.some(syn => cs.includes(syn) || syn.includes(cs))
      );
      if (candidateHasSyn) return true;
    }
  }

  return false;
}

// Maps missing skills to a SkillHire course ID
function findRecommendedCourse(missingSkills: string[]): string | undefined {
  const normalized = missingSkills.join(' ').toLowerCase();
  if (normalized.includes('react') || normalized.includes('frontend')) return 'react-701';
  if (normalized.includes('docker') || normalized.includes('kubernetes') || normalized.includes('aws') || normalized.includes('cloud')) return 'cloud-1001';
  if (normalized.includes('sql') || normalized.includes('database') || normalized.includes('postgres')) return 'sql-901';
  if (normalized.includes('python') || normalized.includes('fastapi')) return 'python-401';
  if (normalized.includes('java') || normalized.includes('spring')) return 'java-301';
  if (normalized.includes('machine learning') || normalized.includes('pytorch') || normalized.includes('ai')) return 'aiml-501';
  if (normalized.includes('data structures') || normalized.includes('algorithms')) return 'dsa-201';
  if (normalized.includes('figma') || normalized.includes('ui/ux') || normalized.includes('wireframing')) return 'uiux-2001';
  if (normalized.includes('product management') || normalized.includes('prd') || normalized.includes('agile')) return 'pm-2101';
  if (normalized.includes('power bi') || normalized.includes('analytics') || normalized.includes('excel')) return 'biz-2301';
  if (normalized.includes('security') || normalized.includes('hacking') || normalized.includes('owasp')) return 'cyber-1101';
  if (normalized.includes('marketing') || normalized.includes('seo')) return 'mkt-2201';
  return 'web-dev-101';
}

export function calculateJobMatch(
  job: AdvancedJobListing,
  candidate: CandidateProfile,
  completedCourseIds: string[] = []
): MatchBreakdown {
  const allCandidateSkills = [
    ...candidate.technicalSkills,
    ...candidate.softSkills
  ];

  // ================= 1. Skills Match (35%) =================
  const matchedTech = job.requiredTechnicalSkills.filter(s => isSkillMatched(s, allCandidateSkills));
  const missingTech = job.requiredTechnicalSkills.filter(s => !isSkillMatched(s, allCandidateSkills));
  
  const matchedSoft = job.requiredSoftSkills.filter(s => isSkillMatched(s, allCandidateSkills));
  const missingSoft = job.requiredSoftSkills.filter(s => !isSkillMatched(s, allCandidateSkills));

  const techRatio = job.requiredTechnicalSkills.length > 0 
    ? (matchedTech.length / job.requiredTechnicalSkills.length) 
    : 1;
  const softRatio = job.requiredSoftSkills.length > 0 
    ? (matchedSoft.length / job.requiredSoftSkills.length) 
    : 1;

  // Technical is 25 pts, Soft is 10 pts
  const skillsScore = Math.round((techRatio * 25) + (softRatio * 10));

  // ================= 2. Experience Match (20%) =================
  let experienceScore = 0;
  let experienceMatchStatus = 'Compatible Experience';
  const candExp = candidate.experienceYears || 0;
  const reqMinExp = job.minExperienceYears || 0;

  if (candExp >= reqMinExp) {
    experienceScore = 20;
    experienceMatchStatus = candExp === 0 ? 'Eligible for Fresher Program' : `Well-Qualified (${candExp} yrs exp vs ${job.experienceRequired})`;
  } else if (reqMinExp - candExp <= 1) {
    experienceScore = 16;
    experienceMatchStatus = `Early Career Potential (Bridging with strong projects)`;
  } else {
    experienceScore = 10;
    experienceMatchStatus = `Requires additional hands-on experience`;
  }

  // ================= 3. Education Match (15%) =================
  let educationScore = 12; // baseline for degrees
  let educationMatchStatus = 'Education Matches Requirements';
  const candDegree = (candidate.education.degree || '').toLowerCase();
  const candField = (candidate.education.field || '').toLowerCase();
  const reqEdu = job.educationRequired.toLowerCase();

  const isCsDegree = candDegree.includes('b.tech') || candDegree.includes('b.e') || candDegree.includes('bca') || candDegree.includes('mca') || candDegree.includes('m.tech');
  const isAlignedField = candField.includes('computer') || candField.includes('it') || candField.includes('data') || candField.includes('ai') || candField.includes('engineering');

  if (reqEdu.includes('any graduate')) {
    educationScore = 15;
    educationMatchStatus = 'Full Qualification Alignment';
  } else if (isCsDegree && isAlignedField) {
    educationScore = 15;
    educationMatchStatus = `${candidate.education.degree} in ${candidate.education.field} (Directly Aligned)`;
  } else if (isCsDegree || isAlignedField) {
    educationScore = 13;
    educationMatchStatus = `Related technical background (${candidate.education.degree})`;
  } else {
    educationScore = 10;
    educationMatchStatus = `Non-traditional background (Assessed via skills & portfolio)`;
  }

  // ================= 4. Job Role Alignment (15%) =================
  let roleAlignmentScore = 10;
  const targetNorm = (candidate.targetRole || '').toLowerCase();
  const jobTitleNorm = job.title.toLowerCase();
  const jobDomainNorm = job.domain.toLowerCase();

  if (targetNorm && (jobTitleNorm.includes(targetNorm) || targetNorm.includes(jobDomainNorm))) {
    roleAlignmentScore = 15;
  } else if (job.domain === 'Frontend' && allCandidateSkills.some(s => s.toLowerCase().includes('react') || s.toLowerCase().includes('html'))) {
    roleAlignmentScore = 14;
  } else if (job.domain === 'Backend' && allCandidateSkills.some(s => s.toLowerCase().includes('java') || s.toLowerCase().includes('python') || s.toLowerCase().includes('sql'))) {
    roleAlignmentScore = 14;
  } else if (job.domain === 'Full Stack' && allCandidateSkills.some(s => s.toLowerCase().includes('react') && s.toLowerCase().includes('node'))) {
    roleAlignmentScore = 15;
  } else if (job.domain === 'AI & ML' && allCandidateSkills.some(s => s.toLowerCase().includes('python') || s.toLowerCase().includes('machine learning'))) {
    roleAlignmentScore = 15;
  } else if (job.domain === 'Cloud & DevOps' && allCandidateSkills.some(s => s.toLowerCase().includes('docker') || s.toLowerCase().includes('aws'))) {
    roleAlignmentScore = 15;
  } else if (job.domain === 'UI/UX Design' && allCandidateSkills.some(s => s.toLowerCase().includes('figma') || s.toLowerCase().includes('ui/ux'))) {
    roleAlignmentScore = 15;
  } else {
    roleAlignmentScore = 11; // transferable skills present
  }

  // ================= 5. Location & Work Mode Preference (10%) =================
  let locationScore = 7;
  const candLoc = (candidate.preferredLocation || '').toLowerCase();
  const candMode = candidate.preferredWorkMode || 'Any';
  const jobLoc = job.location.toLowerCase();

  if (job.workMode === 'Remote' || candMode === 'Any') {
    locationScore = 10;
  } else if (candMode === job.workMode) {
    locationScore = 10;
  } else if (candLoc && jobLoc.includes(candLoc)) {
    locationScore = 10;
  } else if (job.workMode === 'Hybrid') {
    locationScore = 8;
  } else {
    locationScore = 6;
  }

  // ================= 6. Certifications (5%) =================
  let certificationsScore = 2;
  const hasPlatformCert = completedCourseIds.length > 0;
  const matchedCourse = completedCourseIds.some(cid => {
    if (job.domain === 'Frontend' && cid.includes('react')) return true;
    if (job.domain === 'Backend' && (cid.includes('java') || cid.includes('python') || cid.includes('node'))) return true;
    if (job.domain === 'Database' && cid.includes('sql')) return true;
    if (job.domain === 'Cloud & DevOps' && cid.includes('cloud')) return true;
    if (job.domain === 'AI & ML' && cid.includes('aiml')) return true;
    if (job.domain === 'UI/UX Design' && cid.includes('uiux')) return true;
    if (job.domain === 'Product Management' && cid.includes('pm')) return true;
    if (job.domain === 'Business Analytics' && cid.includes('biz')) return true;
    return false;
  });

  if (matchedCourse) {
    certificationsScore = 5;
  } else if (hasPlatformCert || (candidate.certifications && candidate.certifications.length > 0)) {
    certificationsScore = 4;
  } else {
    certificationsScore = 2;
  }

  // Total Score (0-100)
  const overallScore = Math.min(100, Math.max(35, skillsScore + experienceScore + educationScore + roleAlignmentScore + locationScore + certificationsScore));

  // Rating bracket
  let matchRating: MatchBreakdown['matchRating'] = 'Good Match';
  if (overallScore >= 90) matchRating = 'Excellent Match';
  else if (overallScore >= 75) matchRating = 'Strong Match';
  else if (overallScore >= 60) matchRating = 'Good Match';
  else matchRating = 'Low Match';

  // Strengths
  const strengths: string[] = [];
  if (matchedTech.length >= 3) {
    strengths.push(`Core tech stack verified (${matchedTech.slice(0, 3).join(', ')}) matching ${job.company}'s requirements.`);
  }
  if (roleAlignmentScore >= 14) {
    strengths.push(`Target career trajectory aligns directly with this ${job.domain} opening.`);
  }
  if (educationScore >= 14) {
    strengths.push(`Academic background from ${candidate.education.college || 'university'} satisfies standard hiring benchmarks.`);
  }
  if (strengths.length < 2) {
    strengths.push(`Possesses transferable fundamentals suitable for ${job.title}.`);
  }

  // Areas to improve
  const areasToImprove: string[] = [];
  if (missingTech.length > 0) {
    areasToImprove.push(`Develop hands-on proficiency in ${missingTech.slice(0, 2).join(' and ')} to stand out.`);
  }
  if (!matchedCourse && completedCourseIds.length === 0) {
    areasToImprove.push(`Earn an official SkillHire certificate to validate your competency with hiring managers.`);
  }
  if (areasToImprove.length === 0) {
    areasToImprove.push(`Build a portfolio project demonstrating high-throughput architecture in ${job.title}.`);
  }

  const recommendedCourseId = findRecommendedCourse(missingTech);

  // Dynamic AI Narrative
  const topMatchedStr = matchedTech.slice(0, 3).join(', ') || 'fundamental skills';
  const topMissingStr = missingTech.slice(0, 2).join(' and ') || 'advanced patterns';
  const aiNarrative = `You are an ${overallScore}% (${matchRating}) fit for this ${job.title} role at ${job.company}. Your verified foundation in ${topMatchedStr} aligns strongly with their core engineering stack. Completing ${topMissingStr} will place you among the top 5% of qualified applicants.`;

  return {
    overallScore,
    matchRating,
    skillsScore,
    experienceScore,
    educationScore,
    roleAlignmentScore,
    locationScore,
    certificationsScore,
    matchedTechnicalSkills: matchedTech,
    missingTechnicalSkills: missingTech,
    matchedSoftSkills: matchedSoft,
    missingSoftSkills: missingSoft,
    experienceMatchStatus,
    educationMatchStatus,
    strengths,
    areasToImprove,
    recommendedCourseId,
    aiNarrative
  };
}

export function getTransferableRoles(candidate: CandidateProfile): { role: string; domain: string; reason: string; keyBridgeSkill: string }[] {
  const skillsStr = candidate.technicalSkills.join(' ').toLowerCase();
  const suggestions: { role: string; domain: string; reason: string; keyBridgeSkill: string }[] = [];

  if (skillsStr.includes('react') || skillsStr.includes('javascript')) {
    suggestions.push({
      role: 'Full Stack Node.js Engineer',
      domain: 'Full Stack',
      reason: 'Your React and JavaScript mastery transfers effortlessly to Node.js backend microservices.',
      keyBridgeSkill: 'Node.js & Express REST APIs'
    });
    suggestions.push({
      role: 'Mobile App Developer (React Native)',
      domain: 'Mobile Dev',
      reason: '90% of React component architecture directly maps to cross-platform mobile apps.',
      keyBridgeSkill: 'React Native & Mobile Lifecycle'
    });
  }

  if (skillsStr.includes('python') || skillsStr.includes('sql')) {
    suggestions.push({
      role: 'Analytics Engineer / Data Specialist',
      domain: 'Data Science',
      reason: 'Python and SQL constitute the core toolchain for enterprise data pipelines and analytics.',
      keyBridgeSkill: 'Power BI & Data Modeling'
    });
  }

  if (skillsStr.includes('sql') || skillsStr.includes('database')) {
    suggestions.push({
      role: 'Cloud Database Administrator',
      domain: 'Cloud & DevOps',
      reason: 'Relational query optimization and ACID fundamentals are in critical demand for cloud databases.',
      keyBridgeSkill: 'AWS RDS & Docker'
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      role: 'Junior Full Stack Web Architect',
      domain: 'Full Stack',
      reason: 'Modern web platforms value end-to-end builders who can bridge design and backend logic.',
      keyBridgeSkill: 'React & REST APIs'
    });
  }

  return suggestions.slice(0, 3);
}
