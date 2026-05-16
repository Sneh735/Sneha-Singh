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
    <div className="space-y-4 font-sans">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-display font-black text-brand-ink underline decoration-brand-blue/30 underline-offset-8 decoration-4">Market Signal</h2>
        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline">Ecosystem Scanner</a>
      </div>
      
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-brand-border/50 flex items-center gap-4 hover:border-brand-blue transition-all cursor-pointer group shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-brand-blue-light/50 flex items-center justify-center font-black text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all transform group-hover:rotate-6">
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-black text-brand-ink tracking-tight truncate">{job.title}</h4>
              <p className="text-xs text-brand-muted font-medium">{job.company} • {job.location}</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="text-[9px] font-black text-brand-blue mb-1 tracking-widest uppercase">MATCH INDEX</div>
              <div className="flex gap-1">
                <div className="w-3 h-1 bg-brand-blue rounded-full"></div>
                <div className="w-3 h-1 bg-brand-blue rounded-full"></div>
                <div className="w-3 h-1 bg-brand-blue rounded-full"></div>
                <div className="w-1.5 h-1 bg-brand-border rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="py-16 text-center text-brand-muted bg-brand-blue-light/20 rounded-[40px] border border-dashed border-brand-border">
            <Briefcase className="w-10 h-10 mx-auto mb-4 opacity-20 text-brand-blue" />
            <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Analysis Data</p>
            <p className="text-[9px] font-medium mt-1 italic">Upload a resume to synchronize with global matches</p>
          </div>
        )}
      </div>
    </div>
  );
}
