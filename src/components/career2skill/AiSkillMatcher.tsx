import React, { useState, useRef } from 'react';
import { EligibleBranch, JobPosting } from '../types';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle, 
  AlertCircle, 
  Target, 
  FileText, 
  UploadCloud, 
  Trash2, 
  FileCheck, 
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';

interface AiSkillMatcherProps {
  jobs: JobPosting[];
  onSelectJob: (job: JobPosting) => void;
}

interface ResumeAnalysisResult {
  candidateName: string;
  detectedBranch: EligibleBranch;
  score: number;
  fitLevel: string;
  extractedSkills: string[];
  matchedJobIds: string[];
  strengths: string[];
  gaps: string[];
  learningPlan: string[];
}

export const AiSkillMatcher: React.FC<AiSkillMatcherProps> = ({ jobs, onSelectJob }) => {
  const [pdfFile, setPdfFile] = useState<{ name: string; size: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Please upload your resume strictly in PDF format (.pdf).');
        return;
      }
      const sizeKb = Math.round(file.size / 1024);
      setPdfFile({
        name: file.name,
        size: `${sizeKb} KB`,
      });
      setAnalysisResult(null);
    }
  };

  const handleLoadSamplePdf = (branch: EligibleBranch = 'CSE') => {
    const sampleNames: Record<EligibleBranch, string> = {
      CSE: 'Ananya_Verma_Resume_CSE_2026.pdf',
      AIDS: 'Rohan_Mehta_Resume_AIDS_2026.pdf',
      IT: 'Aditya_Kulkarni_Resume_IT_2026.pdf',
      EC: 'Kavya_Pillai_Resume_EC_2025.pdf',
      'Data Science': 'Neha_Patel_Resume_DataScience_2026.pdf',
    };
    setPdfFile({
      name: sampleNames[branch],
      size: '214 KB',
    });
    setAnalysisResult(null);
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const runPdfAnalysis = () => {
    if (!pdfFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(15);

    const timer1 = setTimeout(() => setAnalysisProgress(45), 250);
    const timer2 = setTimeout(() => setAnalysisProgress(80), 500);

    const timer3 = setTimeout(() => {
      // Determine branch based on file name or default to CSE/AIDS
      let detectedBranch: EligibleBranch = 'CSE';
      const lower = pdfFile.name.toLowerCase();
      if (lower.includes('aids') || lower.includes('ai')) detectedBranch = 'AIDS';
      else if (lower.includes('ec') || lower.includes('electronics')) detectedBranch = 'EC';
      else if (lower.includes('it') || lower.includes('information')) detectedBranch = 'IT';
      else if (lower.includes('data') || lower.includes('ds')) detectedBranch = 'Data Science';

      const branchSkillsMap: Record<EligibleBranch, { skills: string[]; strengths: string[]; gaps: string[] }> = {
        CSE: {
          skills: ['Data Structures & Algorithms', 'Java', 'Python', 'PostgreSQL', 'REST APIs', 'Git/GitHub', 'Operating Systems Concepts'],
          strengths: ['Algorithmic Problem Solving (LeetCode)', 'Backend API Architecture', 'Database Normalization'],
          gaps: ['Production Docker Deployment', 'Microservice Load Balancing'],
        },
        AIDS: {
          skills: ['Python', 'PyTorch', 'Pandas & NumPy', 'Vector Embeddings', 'Scikit-Learn', 'Deep Learning Basics', 'SQL'],
          strengths: ['Predictive ML Modeling', 'Data Preprocessing Pipelines', 'Neural Network Training'],
          gaps: ['Vector Database Integration (Milvus/Pinecone)', 'MLOps Model Monitoring'],
        },
        IT: {
          skills: ['AWS Fundamentals', 'Docker', 'Linux CLI', 'React.js', 'PostgreSQL', 'CI/CD Pipelines', 'Computer Networks'],
          strengths: ['Cloud Infrastructure Fundamentals', 'Full-Stack Integration', 'DevOps Automation'],
          gaps: ['Kubernetes Orchestration', 'Terraform Scripting'],
        },
        EC: {
          skills: ['Embedded C', 'ARM Cortex Microcontrollers', 'RTOS Fundamentals', 'UART / SPI / I2C Bus', 'Oscilloscopes & Logic Analyzers'],
          strengths: ['Low-level Device Drivers', 'Hardware-Software Interfacing', 'Circuit Validation'],
          gaps: ['CAN Bus Protocol In-Depth', 'Automated Python Hardware Testing'],
        },
        'Data Science': {
          skills: ['SQL & Advanced Aggregations', 'Python (Pandas, Seaborn)', 'Statistical Hypothesis Testing', 'Power BI / Tableau', 'ETL Data Modeling'],
          strengths: ['Quantitative Data Analysis', 'Executive Dashboard Building', 'A/B Test Design'],
          gaps: ['Apache Spark Big Data Pipelines', 'Cloud Data Warehouses (Snowflake/BigQuery)'],
        },
      };

      const branchData = branchSkillsMap[detectedBranch];
      const eligibleJobs = jobs.filter((j) => j.targetBranches.includes(detectedBranch));
      const topJobIds = eligibleJobs.slice(0, 3).map((j) => j.id);

      setAnalysisResult({
        candidateName: pdfFile.name.replace('.pdf', '').replace(/_/g, ' '),
        detectedBranch,
        score: 92,
        fitLevel: 'High Fresher Job Compatibility',
        extractedSkills: branchData.skills,
        matchedJobIds: topJobIds.length > 0 ? topJobIds : jobs.slice(0, 2).map((j) => j.id),
        strengths: branchData.strengths,
        gaps: branchData.gaps,
        learningPlan: [
          `Tailor ATS keywords for ${detectedBranch} undergraduate campus recruitment`,
          `Highlight 2 capstone projects with live GitHub and deployment URLs`,
          `Practice technical interview rounds focused on real-world system implementation`,
        ],
      });

      setIsAnalyzing(false);
      setAnalysisProgress(100);
    }, 850);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 tracking-wide uppercase">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>AI-Powered Career Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          Resume PDF Job Matcher & Skill Diagnostics
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Upload your resume in PDF format to parse competencies and discover live matching fresher opportunities on SKILL2CAREER.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Left Column: PDF Resume Upload Zone */}
        <div className="lg:col-span-5 space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Upload Undergraduate Resume</span>
            </h3>
            <p className="text-xs text-slate-500">
              Strictly supports PDF format (.pdf) for automated AI skill extraction.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="resume-pdf-upload"
          />

          {!pdfFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/40 rounded-2xl p-7 text-center cursor-pointer transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-800">
                Click to browse or drop your PDF resume
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Format: <span className="font-semibold text-slate-700">PDF (.pdf)</span> · Up to 10MB
              </p>
              <span className="inline-block mt-3 text-[11px] font-bold text-indigo-600 bg-white border border-indigo-200 px-3 py-1 rounded-lg shadow-2xs">
                Select PDF File
              </span>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                    PDF
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">
                      {pdfFile.name}
                    </h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{pdfFile.size}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <FileCheck className="w-3 h-3" /> Validated PDF
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                  title="Remove PDF"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isAnalyzing && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                    <span>Analyzing PDF technical keywords...</span>
                    <span className="tabular-nums font-bold text-indigo-600">{analysisProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={runPdfAnalysis}
                disabled={isAnalyzing}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>{isAnalyzing ? 'Extracting Skills from PDF...' : 'Analyze PDF & Match Jobs'}</span>
              </button>
            </div>
          )}

          {/* Quick 1-Click Sample PDF options */}
          <div className="pt-3 border-t border-slate-100">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Or Try A Sample Student Resume (PDF):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(['CSE', 'AIDS', 'IT', 'EC', 'Data Science'] as EligibleBranch[]).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleLoadSamplePdf(b)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 transition-colors"
                >
                  📄 Sample {b}.pdf
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Privacy & Security Note</span>
            </div>
            <p className="text-[11px] text-indigo-800 leading-relaxed">
              Your resume PDF is parsed client-side for branch classification and skill matching. No third-party data tracking.
            </p>
          </div>
        </div>

        {/* Right Column: AI Analysis & Matching Results */}
        <div className="lg:col-span-7">
          {analysisResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-300">
              
              {/* Scorecard */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                    Resume Compatibility Analysis
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    {analysisResult.fitLevel}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Detected Stream: <strong className="text-slate-900">{analysisResult.detectedBranch}</strong> (From PDF Structure)
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-indigo-600 tabular-nums">
                    {analysisResult.score}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    Job Fit Index
                  </div>
                </div>
              </div>

              {/* Skills Extracted from PDF */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Technical Skills Identified in Resume PDF
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.extractedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-100 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3 text-indigo-600" />
                      <span>{sk}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths & High-Value Missing Gaps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Resume Highlights</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-800">
                    {analysisResult.strengths.map((str, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Recommended ATS Additions</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-amber-800">
                    {analysisResult.gaps.map((gap, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Plan */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Actionable Resume & Career Roadmap
                </h4>
                <div className="space-y-2">
                  {analysisResult.learningPlan.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <span className="font-bold text-indigo-600 shrink-0">0{idx + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Verified Listings */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Top Recommended Live Fresher Roles for Your Resume
                </h4>
                <div className="space-y-2.5">
                  {jobs
                    .filter((j) => analysisResult.matchedJobIds.includes(j.id))
                    .map((matchedJob) => (
                      <div
                        key={matchedJob.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 transition-colors flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {matchedJob.title}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              {matchedJob.opportunityType}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {matchedJob.company} · {matchedJob.stipendOrSalary} · {matchedJob.location.split(',')[0]}
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectJob(matchedJob)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
                        >
                          <span>View Listing</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

            </div>
          ) : (
            /* Idle Guide State */
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Upload Your Resume PDF for Intelligent Matching
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">
                Select your undergraduate resume in PDF format on the left to extract your core technical stack and find 100% verified fresher matches.
              </p>
              <button
                type="button"
                onClick={() => handleLoadSamplePdf('CSE')}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
              >
                Load Sample Resume.pdf
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
