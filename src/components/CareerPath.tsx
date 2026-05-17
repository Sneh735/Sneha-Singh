import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Map, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { generateRoadmap, RoadmapStep } from '../services/ai';
import { cn } from '../lib/utils';

interface CareerPathProps {
  skills: string[];
  currentDomain: string;
}

export default function CareerPath({ skills, currentDomain }: CareerPathProps) {
  const [roadmap, setRoadmap] = useState<RoadmapStep[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetDomain, setTargetDomain] = useState(currentDomain);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateRoadmap(skills, targetDomain);
      setRoadmap(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failing to connect to the Career Oracle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[32px] border border-brand-border/40 flex items-center justify-between gap-6 flex-wrap shadow-sm">
        <div className="space-y-1">
          <h3 className="text-[22px] font-display font-bold text-brand-blue-heading tracking-tight leading-tight">Career Architecture</h3>
          <p className="text-brand-muted text-[14px] font-medium leading-relaxed">Map your trajectory toward optimized industry domains.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={targetDomain}
            onChange={(e) => setTargetDomain(e.target.value)}
            className="px-5 py-3 bg-[#f8fafc] border border-brand-border rounded-2xl text-[13px] font-bold text-brand-blue-heading outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all shadow-sm"
          >
            <option value="Frontend Engineer">Frontend Engineer</option>
            <option value="Backend Specialist">Backend Specialist</option>
            <option value="Full Stack Architect">Full Stack Architect</option>
            <option value="AI/ML Engineer">AI/ML Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="DevOps Professional">DevOps Professional</option>
          </select>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-3 bg-brand-blue text-white rounded-2xl font-bold text-[14px] shadow-[0_15px_30px_-10px_rgba(26,110,245,0.4)] hover:bg-brand-blue-dark transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Map Roadmap
          </button>
        </div>
      </div>

      {error && (
        <div className="p-5 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-start gap-4 text-[13px] font-medium leading-relaxed shadow-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold uppercase tracking-widest text-red-800 text-[10px]">Oracle Protocol Failed</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {loading && !roadmap && (
        <div className="py-24 flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full border-4 border-brand-blue/10 border-t-brand-blue animate-spin" />
          <p className="text-brand-muted font-bold uppercase tracking-widest text-[11px] animate-pulse">Architecting Potential Nodes...</p>
        </div>
      )}

      <div className="relative">
        {roadmap && (
          <div className="space-y-8">
            {roadmap.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-8 group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white border-2 border-brand-blue rounded-full flex items-center justify-center font-display font-bold text-brand-blue shadow-[0_5px_15px_-5px_rgba(26,110,245,0.4)] shrink-0 z-10">
                    {idx + 1}
                  </div>
                  {idx !== roadmap.length - 1 && <div className="w-[3px] flex-1 bg-brand-blue/10 my-2 rounded-full" />}
                </div>
                
                <div className="flex-1 bg-white p-8 rounded-[28px] border border-brand-border/60 hover:border-brand-blue/30 transition-all group-hover:shadow-lg group-hover:shadow-brand-blue/5 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Map className="w-16 h-16 text-brand-blue -rotate-12" />
                  </div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-brand-blue mb-1 block">{step.month}</span>
                      <h4 className="text-[20px] font-display font-bold text-brand-blue-heading leading-tight tracking-tight">{step.focus}</h4>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-4">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-brand-muted flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-brand-blue" /> Knowledge Graph
                      </p>
                      <ul className="space-y-2.5">
                        {step.topics.map((topic, i) => (
                          <li key={i} className="text-[14px] font-medium text-brand-ink flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0" /> {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-brand-muted flex items-center gap-2.5">
                        <ArrowRight className="w-4 h-4 text-brand-blue" /> Strategic Growth
                      </p>
                      <ul className="space-y-2.5">
                        {step.resources.map((res, i) => (
                          <li key={i} className="text-[14px] font-medium text-brand-muted italic flex items-center gap-3 bg-[#f8fafc] px-4 py-2 rounded-xl border border-brand-border/40">
                             {res}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-10 bg-brand-blue/5 rounded-[32px] border border-brand-blue/10 flex items-center justify-center gap-6 relative overflow-hidden group"
            >
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-10 h-10 text-brand-blue" />
                </div>
                <p className="text-[18px] font-display font-bold text-brand-blue-heading tracking-tight mb-2">Baseline Competency Target: Junior {targetDomain}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-muted opacity-80">Ecosystem Architectural Alignment Complete</p>
              </div>
              <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl" />
              <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl" />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
