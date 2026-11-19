import React from 'react';
import { ShieldCheck, Target, Award, CheckCircle, GraduationCap, ArrowRight, HeartHandshake, Sparkles } from 'lucide-react';

const founderImage = '/assets/aistudio/my_pic_0db13024.png';

interface FounderSectionProps {
  onExploreJobs: () => void;
  onOpenMatcher: () => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({ onExploreJobs, onOpenMatcher }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Founder Story & Vision
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
          Behind SKILL2CAREER
        </h2>
        <p className="text-base text-indigo-600 font-bold mt-1">
          "Learn. Practice. Get Hired."
        </p>
      </div>

      {/* Main Profile Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 mb-10">
        <div className="md:col-span-5 bg-slate-100 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-300 mb-4">
            <img
              src={founderImage}
              alt="Sneha Singh, Founder of SKILL2CAREER"
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Sneha Singh</h3>
          <p className="text-xs font-medium text-indigo-600 mt-0.5">
            Founder & Chief Architect
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dedicated to Undergraduate Engineering</span>
          </div>
        </div>

        <div className="md:col-span-7 p-6 sm:p-8 space-y-4 text-slate-700 text-sm leading-relaxed">
          <h4 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
            Sneha Singh – Founder of SKILL2CAREER
          </h4>
          <p>
            Sneha Singh is the Founder of SKILL2CAREER, an AI-powered career development and job discovery platform designed to bridge the gap between undergraduate students and industry opportunities.
          </p>
          <p>
            Recognizing the challenges faced by fresh graduates in finding genuine, skill-based job opportunities, she envisioned a platform that makes career discovery more accessible, reliable, and transparent.
          </p>
          <p>
            Under her leadership, SKILL2CAREER integrates AI-powered career assessments, automated company domain verification, skill-based job recommendations, and direct application pathways through platforms like Indeed and verified corporate recruiters.
          </p>
          <p>
            Her vision is to empower students from CSE, IT, AI & Data Science, Electronics, and related technical fields with the right career guidance and opportunities to build successful professional journeys.
          </p>
          <ul className="space-y-2 text-xs sm:text-sm pt-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>100% Freshers Only:</strong> No 2-year experience traps. Every single posting is calibrated strictly for graduating batches and interns.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Mandatory Corporate Email Verification:</strong> Zero fake recruiter postings. Only verified company domains (e.g. @razorpay.com, @swiggy.in) are admitted.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Direct Indeed Integration:</strong> Smooth, seamless 1-click application pathways directly backed by the Indeed platform.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Guaranteed Completion Certificates:</strong> Tangible accreditation for your resume upon internship milestone completion.</span>
            </li>
          </ul>

          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={onExploreJobs}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>Explore Verified Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenMatcher}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
            >
              Try AI Skill Matcher
            </button>
          </div>
        </div>
      </div>

      {/* The 5 Disciplines Breakdown */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">
            Exclusively Tailored for 5 Undergraduate Disciplines
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Every technical round and curriculum bridge on SKILL2CAREER is tuned specifically to these streams:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-indigo-600 uppercase">Stream 01</div>
            <h4 className="font-bold text-slate-900 text-sm mt-1">Computer Science & Engineering (CSE)</h4>
            <p className="text-xs text-slate-600 mt-1">
              Core system architecture, low-latency microservices, operating systems, and DSA optimization.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-indigo-600 uppercase">Stream 02</div>
            <h4 className="font-bold text-slate-900 text-sm mt-1">AI & Data Science (AIDS)</h4>
            <p className="text-xs text-slate-600 mt-1">
              PyTorch deep learning, vector embedding pipelines, LLM fine-tuning, and neural network deployments.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-indigo-600 uppercase">Stream 03</div>
            <h4 className="font-bold text-slate-900 text-sm mt-1">Information Technology (IT)</h4>
            <p className="text-xs text-slate-600 mt-1">
              Cloud DevOps (AWS/GCP), containerization, full-stack micro-frontends, and secure database schemas.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-indigo-600 uppercase">Stream 04</div>
            <h4 className="font-bold text-slate-900 text-sm mt-1">Electronics & Communication (EC)</h4>
            <p className="text-xs text-slate-600 mt-1">
              Embedded C/C++, ARM microcontrollers, RTOS device drivers, CAN/SPI protocols, and IoT telemetry.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-indigo-600 uppercase">Stream 05</div>
            <h4 className="font-bold text-slate-900 text-sm mt-1">Data Science & Analytics</h4>
            <p className="text-xs text-slate-600 mt-1">
              Big Data ETL, statistical hypothesis testing, BI dashboards, predictive regression, and business modeling.
            </p>
          </div>

          <div className="bg-indigo-50/70 p-5 rounded-xl border border-indigo-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-indigo-700 uppercase">Our Promise</div>
              <h4 className="font-bold text-indigo-950 text-sm mt-1">Zero Cost for Students</h4>
              <p className="text-xs text-indigo-800 mt-1">
                Founded on the belief that fair opportunities should never require placement upfront fees or shady third-party intermediaries.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-indigo-700 mt-2">
              — Sneha Singh
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
