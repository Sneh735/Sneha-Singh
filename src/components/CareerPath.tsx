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
      <div className="bg-white p-8 rounded-[32px] border border-brand-border flex items-center justify-between gap-6 flex-wrap">
        <div className="space-y-1">
          <h3 className="text-xl font-display font-black text-brand-ink">Personalised Roadmap</h3>
          <p className="text-brand-muted text-sm font-medium">Transform your current skills into a specialized career path.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={targetDomain}
            onChange={(e) => setTargetDomain(e.target.value)}
            className="px-4 py-2.5 bg-brand-cream border border-brand-border rounded-xl text-sm font-black uppercase tracking-widest outline-none focus:border-brand-blue"
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
            className="px-6 py-2.5 bg-brand-blue text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-100 hover:bg-brand-blue-dark transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            Generate Path
          </button>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 text-red-700 rounded-[32px] flex items-start gap-4 text-xs font-medium whitespace-pre-wrap leading-relaxed shadow-sm animate-shake">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-black uppercase tracking-widest text-red-800">Oracle Interruption</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {loading && !roadmap && (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
          <p className="text-brand-muted font-black uppercase tracking-widest text-[10px]">Architecting your future...</p>
        </div>
      )}

      <div className="relative">
        {roadmap && (
          <div className="space-y-6">
            {roadmap.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white border-2 border-brand-blue rounded-2xl flex items-center justify-center font-display font-black text-brand-blue shadow-sm shrink-0">
                    {idx + 1}
                  </div>
                  {idx !== roadmap.length - 1 && <div className="w-0.5 flex-1 bg-brand-blue/20 my-2" />}
                </div>
                
                <div className="flex-1 bg-white p-6 rounded-[24px] border border-brand-border hover:border-brand-blue transition-colors group-hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">{step.month}</span>
                      <h4 className="text-lg font-display font-black text-brand-ink">{step.focus}</h4>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-brand-blue-light flex items-center justify-center">
                      <Map className="w-4 h-4 text-brand-blue" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted flex items-center gap-2">
                        <BookOpen className="w-3 h-3" /> Technical Core
                      </p>
                      <ul className="space-y-1">
                        {step.topics.map((topic, i) => (
                          <li key={i} className="text-xs font-medium text-brand-ink flex items-center gap-2">
                            <span className="w-1 h-1 bg-brand-blue rounded-full" /> {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted flex items-center gap-2">
                        <ArrowRight className="w-3 h-3" /> Recommended
                      </p>
                      <ul className="space-y-1">
                        {step.resources.map((res, i) => (
                          <li key={i} className="text-xs font-medium text-brand-muted italic flex items-center gap-2">
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
              className="p-8 bg-brand-blue/5 rounded-[32px] border border-brand-blue/10 flex items-center justify-center gap-6"
            >
              <div className="text-center">
                <CheckCircle2 className="w-10 h-10 text-brand-blue mx-auto mb-2" />
                <p className="text-sm font-display font-black text-brand-ink">Career Goal: Ready for Junior ${targetDomain} Roles</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted mt-1">Ecosystem Validation Complete</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
