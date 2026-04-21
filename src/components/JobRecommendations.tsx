import React from 'react';
import { Briefcase, MapPin, Building2, ExternalLink } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  domain: string;
  location: string;
}

interface JobRecommendationsProps {
  jobs: Job[];
  domain: string;
}

export default function JobRecommendations({ jobs, domain }: JobRecommendationsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-slate-900">Recommended Job Matches</h2>
        <a href="#" className="text-sm text-blue-600 font-medium hover:underline">View all</a>
      </div>
      
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800 tracking-tight">{job.title}</h4>
              <p className="text-sm text-slate-500">{job.company} • {job.location}</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="text-xs font-bold text-blue-600 mb-1 tracking-wider uppercase">98% MATCH</div>
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-1 h-3 bg-blue-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-xs font-medium">Complete courses to see more matching jobs</p>
          </div>
        )}
      </div>
    </div>
  );
}
