import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Award, Briefcase, GraduationCap } from 'lucide-react';

const founderImage = '/assets/aistudio/my_pic_0db13024.png';

interface FounderHeroProps {
  onExploreJobs: () => void;
  onOpenMatcher: () => void;
}

export const FounderHero: React.FC<FounderHeroProps> = ({ onExploreJobs, onOpenMatcher }) => {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text & Branding Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
              <span>Official Undergraduate Recruitment Portal</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 normal-case font-medium">Founded by Sneha Singh</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                SKILL2CAREER
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-indigo-600 tracking-tight">
                Learn. Practice. Get Hired.
              </p>
            </div>

            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              An AI-powered recruitment engine engineered exclusively for undergraduate students
              pursuing <span className="font-semibold text-slate-900">CSE</span>, <span className="font-semibold text-slate-900">AIDS</span>, <span className="font-semibold text-slate-900">IT</span>, <span className="font-semibold text-slate-900">EC</span>, and <span className="font-semibold text-slate-900">Data Science</span>.
              Zero spam, zero experienced candidate bias, and 100% verified fresher opportunities.
            </p>

            {/* Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">01 · Learn</div>
                <div className="text-sm font-semibold text-slate-900">Branch-Curated Skills</div>
                <div className="text-xs text-slate-500 mt-1">Core stacks aligned with tech industry requirements.</div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">02 · Practice</div>
                <div className="text-sm font-semibold text-slate-900">Real Problem Sets</div>
                <div className="text-xs text-slate-500 mt-1">Authentic coding tests & architectural assessments.</div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">03 · Get Hired</div>
                <div className="text-sm font-semibold text-slate-900">Freshers Only</div>
                <div className="text-xs text-slate-500 mt-1">Direct corporate links + Indeed integrations.</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreJobs}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors"
              >
                <span>Browse Freshers Listings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenMatcher}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-lg border border-slate-300 transition-colors"
              >
                <span>Check AI Career Readiness</span>
              </button>
            </div>

            <div className="flex items-center gap-6 pt-3 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mandatory Official Company Emails</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Verified Completion Certificates</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <div className="hidden sm:flex items-center gap-1.5 font-medium text-slate-700">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>PPO Internships & Placements</span>
              </div>
            </div>
          </div>

          {/* Right Column: Founder Profile Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-start gap-4">
                {/* Profile Image with Fallback */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-sm bg-slate-200">
                    <img
                      src={founderImage}
                      alt="Sneha Singh, Founder of SKILL2CAREER"
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Resilient fallback container if image fails to render
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-indigo-700 text-white font-bold text-2xl">SS</div>';
                        }
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    Founder
                  </div>
                </div>

                {/* Founder Credentials */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
                    Platform Leadership
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Sneha Singh
                  </h3>
                  <p className="text-xs font-medium text-slate-600">
                    Founder & Chief Mentor, SKILL2CAREER
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Passionate tech educator bridging college curricula with actual high-growth startup recruiting.
                  </p>
                </div>
              </div>

              {/* Founder's Personal Message */}
              <div className="mt-5 pt-4 border-t border-slate-200/80">
                <blockquote className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "Most job boards flood undergraduate students with irrelevant requirements asking for 2-3 years of prior experience. At SKILL2CAREER, every posting is strictly for freshers, backed by genuine employer emails, and tuned to the exact strengths of CSE, AIDS, IT, EC, and Data Science students."
                </blockquote>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">— Sneha Singh</span>
                  <span className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                    5 Streams · 0-Year Experience Focus
                  </span>
                </div>
              </div>

              {/* Branch Quick Highlights */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  Eligible Streams:
                </span>
                <span className="font-mono font-semibold text-slate-900">
                  CSE · AIDS · IT · EC · Data Science
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
