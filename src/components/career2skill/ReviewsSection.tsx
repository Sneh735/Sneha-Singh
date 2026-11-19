import React, { useState } from 'react';
import { PlatformReview, StudentUser, EligibleBranch, ELIGIBLE_BRANCHES } from '../types';
import { MessageSquare, Star, PlusCircle, Award, CheckCircle2, Sparkles, Building2, User } from 'lucide-react';

interface ReviewsSectionProps {
  currentUser: StudentUser | null;
  onOpenAuth: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ currentUser, onOpenAuth }) => {
  // Start with empty state as requested: "No recent reviews yet – Be the first to land your dream job and share your review!"
  const [reviews, setReviews] = useState<PlatformReview[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form states
  const [company, setCompany] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [branch, setBranch] = useState<EligibleBranch>(currentUser?.branch || 'CSE');
  const [oppType, setOppType] = useState<'Internship with PPO' | 'Direct Placement'>('Internship with PPO');
  const [compDetails, setCompDetails] = useState('');
  const [rating, setRating] = useState(5);
  const [story, setStory] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!story.trim() || !company.trim()) return;

    const newReview: PlatformReview = {
      id: `rev-${Date.now()}`,
      studentName: currentUser?.name || 'Verified Fresher Candidate',
      branch: branch,
      companyPlaced: company.trim(),
      roleTitle: roleTitle.trim() || 'Software Engineer Fresher',
      opportunityType: oppType,
      packageOrStipend: compDetails.trim() || 'Undisclosed Package',
      rating: rating,
      reviewText: story.trim(),
      date: 'Just now',
      verifiedHire: true,
    };

    setReviews([newReview, ...reviews]);
    setShowSubmitModal(false);
    setCompany('');
    setRoleTitle('');
    setStory('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Success Stories & Community Validation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Student Reviews & Placement Experiences
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real feedback from undergraduate candidates across CSE, AIDS, IT, EC, and Data Science.
          </p>
        </div>

        <div>
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
              } else {
                setShowSubmitModal(true);
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Your Review</span>
          </button>
        </div>
      </div>

      {/* Main Reviews Container */}
      <div className="mt-8">
        {reviews.length === 0 ? (
          /* Clean Empty State as explicitly specified */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <MessageSquare className="w-8 h-8" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              No recent reviews yet – Be the first to land your dream job and share your review!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
              SKILL2CAREER is newly launched by founder Sneha Singh to ensure freshers have direct, un-gated access to genuine company openings without spam. When you interview or receive an offer through our listings, post your milestone here to inspire fellow undergraduates.
            </p>

            {/* Placeholder Layout Preview For Future User Feedback */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                Upcoming Feedback Layout Preview
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left opacity-60 pointer-events-none">
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200"></div>
                      <div>
                        <div className="h-3 w-28 bg-slate-200 rounded"></div>
                        <div className="h-2 w-16 bg-slate-200 rounded mt-1"></div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3 h-3 text-amber-300 fill-amber-300" />
                      ))}
                    </div>
                  </div>
                  <div className="h-3 w-4/5 bg-slate-200 rounded mt-2"></div>
                  <div className="h-3 w-3/5 bg-slate-200 rounded"></div>
                  <div className="h-2 w-24 bg-indigo-100 rounded mt-2"></div>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200"></div>
                      <div>
                        <div className="h-3 w-28 bg-slate-200 rounded"></div>
                        <div className="h-2 w-16 bg-slate-200 rounded mt-1"></div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3 h-3 text-amber-300 fill-amber-300" />
                      ))}
                    </div>
                  </div>
                  <div className="h-3 w-4/5 bg-slate-200 rounded mt-2"></div>
                  <div className="h-3 w-3/5 bg-slate-200 rounded"></div>
                  <div className="h-2 w-24 bg-indigo-100 rounded mt-2"></div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                  } else {
                    setShowSubmitModal(true);
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
              >
                <span>Write First Review</span>
              </button>
            </div>
          </div>
        ) : (
          /* Populated Reviews List */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {rev.branch}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">
                        {rev.studentName}
                      </h4>
                      <div className="text-xs text-slate-500">
                        {rev.branch} Student · {rev.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{rev.roleTitle} at {rev.companyPlaced}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-emerald-700 font-bold">{rev.packageOrStipend}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  "{rev.reviewText}"
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Hire from SKILL2CAREER</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Submit Your Placement / Internship Review
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Help your junior peers across CSE, AIDS, IT, EC, and Data Science learn from your journey.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swiggy, Razorpay"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Research Intern"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value as EligibleBranch)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    {ELIGIBLE_BRANCHES.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Compensation / Stipend
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹50k/mo or ₹14 LPA"
                    value={compDetails}
                    onChange={(e) => setCompDetails(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-slate-700 ml-2">
                    {rating} out of 5 stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Review & Tips for Freshers
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details on the interview rounds, coding questions asked, and how SKILL2CAREER helped you land the role..."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
