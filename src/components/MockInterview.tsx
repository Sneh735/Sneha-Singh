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
      <div className="bg-white p-12 rounded-[40px] border border-brand-border text-center space-y-8 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-brand-blue/5 rounded-3xl flex items-center justify-center mx-auto">
          <MessageSquare className="w-10 h-10 text-brand-blue" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-display font-black text-brand-ink">AI Mock Interview</h2>
          <p className="text-brand-muted font-medium">Practice with a strict but helpful AI interviewer. Get feedback on your technical depth and communication.</p>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted block">Search or Select Your Interview Topic</label>
          <input 
            type="text" 
            value={topicSearch}
            onChange={(e) => {
              setTopicSearch(e.target.value);
              setTopic(e.target.value); // Sync topic with search if they want a custom one
            }}
            placeholder="Search topics or enter a custom project/topic..."
            className="w-full px-5 py-4 bg-brand-cream/50 border border-brand-border rounded-2xl font-medium text-sm focus:border-brand-blue outline-none transition-all shadow-sm"
          />
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {filteredTopics.map(t => (
              <button 
                key={t}
                onClick={() => {
                  setTopic(t);
                  setTopicSearch(t);
                }}
                className={cn(
                  "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                  topic === t ? "bg-brand-blue text-white shadow-lg shadow-blue-100" : "bg-brand-cream text-brand-muted hover:bg-brand-blue-light"
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
          className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-200 hover:bg-brand-blue-dark transition-all active:scale-95 disabled:opacity-50"
        >
          Begin Simulation
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[700px] bg-white rounded-[40px] border border-brand-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 bg-brand-ink text-white flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg leading-none">Interviewer Alpha</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent/80 mt-1">Topic: {topic}</p>
          </div>
        </div>
        <button onClick={handleReset} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-brand-cream/20">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm",
                m.role === 'user' ? "bg-brand-accent" : "bg-brand-blue"
              )}>
                {m.role === 'user' ? <User className="w-4 h-4 text-brand-ink" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className="space-y-2">
                <div className={cn(
                  "p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                  m.role === 'user' ? "bg-brand-ink text-white rounded-tr-none" : "bg-white text-brand-ink border border-brand-border rounded-tl-none"
                )}>
                  {m.text}
                </div>
                {m.feedback && (
                  <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="p-3 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl flex items-start gap-2"
                  >
                    <Sparkles className="w-3 h-3 text-brand-blue shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-brand-blue italic">{m.feedback}</p>
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
