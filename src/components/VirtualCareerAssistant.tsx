import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  X, 
  MessageCircle, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  GraduationCap, 
  FileText, 
  Mic, 
  Briefcase,
  ChevronDown
} from 'lucide-react';
import { askCareerAssistant } from '../services/ai';
import { cn } from '../lib/utils';

interface AssistantMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: "🎯 Improve ATS Resume Score", text: "How can I improve my resume's ATS compatibility score on Skill to Hire?" },
  { label: "🎙️ Ace Voice Interview", text: "What are the best tips to clear technical voice mock interviews?" },
  { label: "💼 Highest Paying Roles", text: "Which tech skills (React, Java, Python, SQL) are highest in demand right now?" },
  { label: "📜 Getting Certificates", text: "How do I take course assessments and download my verified certificate?" }
];

const LOCAL_FALLBACK_ANSWERS: Record<string, string> = {
  ats: "To achieve 90%+ ATS score: 1) Use standard headings like Experience, Skills, Education. 2) Include action verbs and quantified impact (e.g., 'Improved API speed by 40%'). 3) Match keywords from target job descriptions. You can use our 'Resume Pro' tab to build a standard ATS format!",
  interview: "For AI Voice Interviews: 1) Structure answers using the STAR method (Situation, Task, Action, Result). 2) Keep answers concise (under 2 minutes). 3) Mention key trade-offs and complexity. You can click the Microphone button in 'Mock Interview' to practice speaking!",
  certificate: "To earn a verified certificate: 1) Go to 'My Learning' tab. 2) Select any course (HTML/CSS/JS, Python, Java, SQL, React). 3) Complete the 20-minute timed competency assessment with 80%+ score. You will instantly get a downloadable official PDF Certificate signed by the platform!",
  jobs: "Top in-demand roles right now include Full Stack Developers (React + Node.js/Java) and Data Engineers (Python + SQL). Check out the 'Job Matching' tab to see live openings and your calculated compatibility score!"
};

export default function VirtualCareerAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: "👋 Hi! I'm your Virtual Career Mentor on Skill to Hire. Ask me anything about career roadmaps, interview prep, resume optimization, or navigating courses!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const getSmartFallback = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('ats') || q.includes('resume') || q.includes('cv')) return LOCAL_FALLBACK_ANSWERS.ats;
    if (q.includes('interview') || q.includes('voice') || q.includes('mock')) return LOCAL_FALLBACK_ANSWERS.interview;
    if (q.includes('certif') || q.includes('quiz') || q.includes('score') || q.includes('exam')) return LOCAL_FALLBACK_ANSWERS.certificate;
    if (q.includes('job') || q.includes('salary') || q.includes('hire') || q.includes('demand')) return LOCAL_FALLBACK_ANSWERS.jobs;
    return "Great question! On Skill to Hire, you can practice Voice Mock Interviews, build ATS resumes, complete courses in HTML/CSS/JS, Python, Java & SQL, and match with tech jobs. What specific goal are you targeting?";
  };

  const handleSend = async (messageText: string) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const userMsg: AssistantMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let botResponse = "";
      try {
        const history = messages.slice(-4).map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }));
        botResponse = await askCareerAssistant(textToSend, history);
      } catch (err) {
        botResponse = getSmartFallback(textToSend);
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3.5 bg-brand-blue text-white rounded-full shadow-2xl shadow-blue-500/40 hover:bg-brand-blue-dark transition-all border-2 border-white/40 group"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-tight pr-1">Career Mentor AI</span>
        </motion.button>
      </div>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-brand-border/60 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-brand-blue-heading text-white flex items-center justify-between relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm leading-tight flex items-center gap-1.5">
                    Virtual Career Assistant
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    Online • Ready to Guide
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompts Bar */}
            <div className="p-3 bg-brand-cream/40 border-b border-brand-border/40 overflow-x-auto flex gap-2 scrollbar-none">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.text)}
                  className="px-3 py-1.5 bg-white border border-brand-border/80 hover:border-brand-blue hover:text-brand-blue text-brand-muted text-[11px] font-bold rounded-xl whitespace-nowrap transition-colors shadow-2xs shrink-0"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    m.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div
                    className={cn(
                      "p-3.5 rounded-2xl leading-relaxed shadow-2xs font-medium",
                      m.sender === 'user'
                        ? "bg-brand-blue text-white rounded-tr-none"
                        : "bg-white text-slate-800 border border-brand-border/60 rounded-tl-none"
                    )}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-brand-muted mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-brand-muted text-[11px] font-bold p-2 bg-white rounded-2xl w-fit border border-brand-border">
                  <div className="w-2 h-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" />
                  <span>Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-white border-t border-brand-border flex items-center gap-2"
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about careers, interviews, skills..."
                className="flex-1 px-4 py-2.5 bg-brand-cream/40 border border-brand-border rounded-xl text-xs font-medium outline-none focus:border-brand-blue focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-brand-blue-dark transition-all disabled:opacity-40 disabled:scale-95 shrink-0 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
