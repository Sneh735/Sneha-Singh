import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User, 
  Bot, 
  Sparkles, 
  Trophy, 
  RefreshCcw,
  Loader2,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { getInterviewFeedback } from '../services/ai';
import { cn } from '../lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  feedback?: string;
}

export default function MockInterview() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [topic, setTopic] = useState('Full Stack Development');
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleStart = async () => {
    setStarted(true);
    setLoading(true);
    setError(null);
    try {
      const response = await getInterviewFeedback(topic, []);
      setMessages([{ role: 'assistant', text: response.question }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start mock interview. Please try again.");
      setStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Map history for API
      const history = newMessages.map(m => ({ role: m.role, text: m.text }));
      const response = await getInterviewFeedback(topic, history);
      
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', text: response.question, feedback: response.feedback }
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to get response from AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setStarted(false);
  };

  const [topics] = useState(['Web Development (HTML, CSS, JS)', 'Data Structures & Algorithms (DSA)', 'Object-Oriented Programming (OOP)', 'Machine Learning (ML) & AI', 'Project Management', 'System Architecture', 'React/Frontend', 'Node.js/Backend', 'Java Core', 'Advanced Python', 'Data Science', 'AI/ML Engineering', 'React Hooks', 'Node.js Backend']);
  const [topicSearch, setTopicSearch] = useState('');

  const filteredTopics = topics.filter(t => t.toLowerCase().includes(topicSearch.toLowerCase()));

  if (!started) {
    return (
      <div className="bg-white p-12 rounded-[32px] border border-brand-border/40 text-center space-y-10 max-w-2xl mx-auto shadow-sm">
        <div className="w-20 h-20 bg-brand-blue/5 rounded-[24px] flex items-center justify-center mx-auto border border-brand-blue/10 shadow-sm">
          <MessageSquare className="w-10 h-10 text-brand-blue" />
        </div>
        <div className="space-y-3">
          <h2 className="text-[32px] font-display font-bold text-brand-blue-heading tracking-tight leading-tight">AI Interview Simulation</h2>
          <p className="text-brand-muted text-[15px] font-medium leading-relaxed">Test your technical depth and articulation against our optimized LLM interviewer. Receive real-time cognitive feedback.</p>
        </div>
        <div className="space-y-5">
          <label className="text-[11px] font-bold uppercase tracking-widest text-brand-muted block">Select Target Domain</label>
          <div className="relative group">
            <input 
              type="text" 
              value={topicSearch}
              onChange={(e) => {
                setTopicSearch(e.target.value);
                setTopic(e.target.value); 
              }}
              placeholder="Search or enter custom topic..."
              className="w-full px-5 py-4.5 bg-brand-cream/30 border border-brand-border rounded-2xl font-bold text-[14px] focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2.5 mt-4">
            {filteredTopics.slice(0, 8).map(t => (
              <button 
                key={t}
                onClick={() => {
                  setTopic(t);
                  setTopicSearch(t);
                }}
                className={cn(
                  "px-5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-tight transition-all border",
                  topic === t 
                    ? "bg-brand-blue border-brand-blue text-white shadow-lg active:scale-95" 
                    : "bg-white border-brand-border text-brand-muted hover:border-brand-blue/40"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={handleStart}
          disabled={!topic.trim()}
          className="w-full py-5 bg-brand-blue text-white rounded-2xl font-bold text-[15px] shadow-[0_20px_40px_-10px_rgba(26,110,245,0.4)] hover:bg-brand-blue-dark transition-all active:scale-95 disabled:opacity-50"
        >
          Initialize Simulation
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[750px] bg-white rounded-[32px] border border-brand-border/40 overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="p-6 bg-brand-blue-heading text-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-blue/10 opacity-30 pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-md">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-[18px] leading-tight">Interviewer Protocol Alpha</h3>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-blue-heading/60 mt-0.5 bg-white/90 px-2 py-0.5 rounded inline-block">Domain: {topic}</p>
          </div>
        </div>
        <button onClick={handleReset} className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-white/10 group active:rotate-90">
          <RefreshCcw className="w-4 h-4 group-hover:text-white transition-opacity text-white/70" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-[#f8fafc]">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-5 max-w-[90%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-1 shadow-md border",
                m.role === 'user' ? "bg-white border-brand-border" : "bg-brand-blue border-brand-blue shadow-brand-blue/20"
              )}>
                {m.role === 'user' ? <User className="w-5 h-5 text-brand-blue" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className="space-y-3">
                <div className={cn(
                  "p-5 rounded-[24px] text-[15px] font-medium leading-relaxed shadow-sm border",
                  m.role === 'user' 
                    ? "bg-brand-blue text-white rounded-tr-none border-brand-blue" 
                    : "bg-white text-brand-blue-heading border-brand-border/60 rounded-tl-none"
                )}>
                  {m.text}
                </div>
                {m.feedback && (
                  <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-[13px] font-bold text-emerald-800 italic leading-relaxed">{m.feedback}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex gap-4 max-w-[85%]"
            >
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center shrink-0 shadow-sm">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="p-4 bg-white border border-brand-border rounded-3xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-brand-muted/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-brand-muted/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-brand-muted/30 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex justify-center my-4"
            >
              <div className="flex items-start gap-4 p-6 bg-red-50 text-red-700 rounded-[32px] text-xs font-medium border border-red-100 shadow-lg animate-shake max-w-md">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-black uppercase tracking-widest text-red-800">System Link Failed</p>
                  <p className="whitespace-pre-wrap leading-relaxed">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-6 bg-white border-t border-brand-border">
        <div className="relative group">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full bg-brand-cream/50 border border-brand-border rounded-2xl py-4 pl-6 pr-14 text-sm font-medium outline-none focus:border-brand-blue focus:bg-white transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-brand-blue-dark transition-all disabled:opacity-30 disabled:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted mt-3 text-center opacity-60">Professional Simulation Environment</p>
      </form>
    </div>
  );
}
