import React from 'react';
import { FilterOptions, EligibleBranch, RoleType, OpportunityType, ELIGIBLE_BRANCHES } from '../types';
import { Search, RotateCcw, CheckSquare, Square, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface JobFiltersProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  totalJobsCount: number;
  filteredJobsCount: number;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  setFilters,
  totalJobsCount,
  filteredJobsCount,
}) => {
  const locations = ['All Locations', 'Bengaluru', 'Hyderabad', 'Pune', 'Remote', 'Mumbai'];

  const hasActiveFilters =
    Boolean(filters.searchQuery.trim()) ||
    filters.roleType !== 'All' ||
    filters.opportunityType !== 'All' ||
    filters.location !== 'All Locations' ||
    filters.selectedBranch !== 'All' ||
    filters.certificateOnly;

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      roleType: 'All',
      opportunityType: 'All',
      location: 'All Locations',
      selectedBranch: 'All',
      certificateOnly: false,
      minVacancies: 0,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs mb-6 overflow-hidden">
      
      {/* 1. Formal Search & Result Counter Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by role (e.g. SDE, AI Engineer, Product Ops), company, or tech stack..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Result Counter & Reset Button */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 text-xs">
            <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200/80 font-medium text-slate-700 tabular-nums">
              Showing <span className="font-bold text-indigo-600">{filteredJobsCount}</span> of {totalJobsCount} Verified Fresher Roles
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-200"
                title="Reset all search filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. Formal 4-Column Structured Filter Matrix */}
      <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/50">
        
        {/* Column 1: Role Type */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Role Type
          </label>
          <select
            value={filters.roleType}
            onChange={(e) => setFilters((prev) => ({ ...prev, roleType: e.target.value as 'All' | RoleType }))}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          >
            <option value="All">All Role Types</option>
            <option value="Technical">Technical Roles</option>
            <option value="Non-Technical">Non-Technical Roles</option>
          </select>
        </div>

        {/* Column 2: Opportunity Type */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Opportunity Type
          </label>
          <select
            value={filters.opportunityType}
            onChange={(e) => setFilters((prev) => ({ ...prev, opportunityType: e.target.value as 'All' | OpportunityType }))}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          >
            <option value="All">All Types (PPO & Placements)</option>
            <option value="Internship with PPO">Internship with PPO</option>
            <option value="Direct Placement">Direct Placement (Full-Time)</option>
          </select>
        </div>

        {/* Column 3: Location */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Column 4: Branch Eligibility */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Undergraduate Branch
          </label>
          <select
            value={filters.selectedBranch}
            onChange={(e) => setFilters((prev) => ({ ...prev, selectedBranch: e.target.value as 'All' | EligibleBranch }))}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          >
            <option value="All">All 5 Streams</option>
            {ELIGIBLE_BRANCHES.map((b) => (
              <option key={b.code} value={b.code}>
                {b.code} — {b.label}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* 3. Formal Credential Toggle & Policy Assurance Footer */}
      <div className="px-4 py-3 bg-white border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Certificate Filter Toggle */}
        <button
          type="button"
          onClick={() => setFilters((prev) => ({ ...prev, certificateOnly: !prev.certificateOnly }))}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
            filters.certificateOnly
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          {filters.certificateOnly ? (
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          ) : (
            <Square className="w-4 h-4 text-slate-400" />
          )}
          <span>Certificate of Completion Provided</span>
        </button>

        {/* Formal Institutional Compliance Badges */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict Freshers Policy (0-Exp Required)</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Placement Fees (100% Free for Students)</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <div className="text-indigo-600 font-semibold">
            Indeed App Direct Quick-Apply Verified
          </div>
        </div>

      </div>

    </div>
  );
};
