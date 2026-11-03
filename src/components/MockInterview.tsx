import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User, 
  Bot, 
  Sparkles, 
  RefreshCcw,
  Loader2,
  MessageSquare,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { getInterviewFeedback } from '../services/ai';
import { cn } from '../lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  feedback?: string;
}

// Fallback questions for smooth demo if API key isn't provided or quota exhausted
const FALLBACK_QUESTIONS: Record<string, string[]> = {
  default: [
    "Tell me about yourself and your primary technical skills.",
    "Can you describe a challenging project you built and how you solved a difficult problem in it?",
    "How do you handle debugging and troubleshooting when your code behaves unexpectedly?",
    "Where do you see yourself technically in the next 2-3 years?"
  ],
  "web": [
    "Can you explain the difference between CSS Grid and Flexbox with a practical use case?",
    "How does the browser event loop handle microtasks versus macrotasks in JavaScript?",
    "What strategies do you use to optimize website load time and Core Web Vitals?"
  ],
  "react": [
    "What is the difference between useEffect and useLayoutEffect, and when would you use each?",
    "How does React 18+ handle automatic batching and concurrent rendering?",
    "Explain how you design state management for large-scale applications."
  ],
  "java": [
    "What is the difference between JVM, JRE, and JDK, and how does Garbage Collection work in Java?",
    "Can you explain the difference between HashMap and ConcurrentHashMap?",
    "What are SOLID design principles, and how have you applied them in your code?"
  ],
  "sql": [
    "What is the difference between Clustered and Non-Clustered Indexes in SQL?",
    "Can you explain ACID properties in database transactions and what happens during a rollback?",
    "How do you optimize a slow-running SQL query with multiple JOINs?"
  ]
};

export default function MockInterview() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [topic, setTopic] = useState('Web Development (HTML, CSS, JS)');
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text to Speech
  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech start error:", err);
      }
    }
  };

  const getFallbackQuestion = (currentTopic: string, index: number) => {
    const key = Object.keys(FALLBACK_QUESTIONS).find(k => currentTopic.toLowerCase().includes(k)) || 'default';
    const list = FALLBACK_QUESTIONS[key];
    return list[index % list.length];
  };

  const handleStart = async () => {
    setStarted(true);
    setLoading(true);
    setError(null);
    try {
      let question = "";
      try {
        const response = await getInterviewFeedback(topic, []);
        question = response.question;
      } catch (apiErr: any) {
        console.warn("Using fallback question due to API error:", apiErr);
        question = getFallbackQuestion(topic, 0);
      }

      setMessages([{ role: 'assistant', text: question }]);
      speakText(question);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start mock interview. Please try again.");
      setStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      let nextQuestion = "";
      let feedback = "";

      try {
        const history = newMessages.map(m => ({ role: m.role, text: m.text }));
        const response = await getInterviewFeedback(topic, history);
        nextQuestion = response.question;
        feedback = response.feedback || "Good technical response! Ensure you also mention measurable metrics or optimization strategies.";
      } catch (apiErr: any) {
        console.warn("Using intelligent fallback due to AI link:", apiErr);
        feedback = "Strong point! Good technical structure. Remember to highlight real-world edge cases when answering in live interviews.";
        nextQuestion = getFallbackQuestion(topic, newMessages.length);
      }

      setMessages(prev => [
        ...prev, 
        { role: 'assistant', text: nextQuestion, feedback }
      ]);
      speakText(nextQuestion);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to get response from AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognitionRef.current && isListening) recognitionRef.current.stop();
    setIsListening(false);
    setIsSpeaking(false);
    setMessages([]);
    setStarted(false);
  };

  const [topics] = useState([
    'Web Development (HTML, CSS, JS)', 
    'React & Frontend Architecture',
    'Node.js & Backend Systems',
    'SQL & Database Engineering',
    'Data Structures & Algorithms (DSA)', 
    'Java Core & Spring Boot',
    'Python & AI/ML Systems'
  ]);
  const [topicSearch, setTopicSearch] = useState('');

  const filteredTopics = topics.filter(t => t.toLowerCase().includes(topicSearch.toLowerCase()));

  if (!started) {
    return (
      <div className="bg-white p-12 rounded-[32px] border border-brand-border/40 text-center space-y-10 max-w-2xl mx-auto shadow-sm">
        <div className="w-20 h-20 bg-brand-blue/5 rounded-[24px] flex items-center justify-center mx-auto border border-brand-blue/10 shadow-sm relative">
          <MessageSquare className="w-10 h-10 text-brand-blue" />
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
            <Mic className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold uppercase tracking-wider">
            <Mic className="w-3.5 h-3.5" /> AI Voice & Audio Enabled
          </div>
          <h2 className="text-[32px] font-display font-bold text-brand-blue-heading tracking-tight leading-tight">AI Voice Interview Simulator</h2>
          <p className="text-brand-muted text-[15px] font-medium leading-relaxed">
            Practice real technical interviews by speaking out your answers. The AI will speak questions aloud and provide cognitive feedback on your answers.
          </p>
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
            {filteredTopics.map(t => (
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
          className="w-full py-5 bg-brand-blue text-white rounded-2xl font-bold text-[15px] shadow-[0_20px_40px_-10px_rgba(26,110,245,0.4)] hover:bg-brand-blue-dark transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Mic className="w-5 h-5" /> Start Voice Interview Simulation
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
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-md relative">
            <Bot className="w-7 h-7 text-white" />
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-[18px] leading-tight">AI Interviewer Protocol</h3>
              {isSpeaking && (
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Volume2 className="w-3 h-3 animate-pulse" /> Speaking
                </span>
              )}
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-blue-heading/60 mt-0.5 bg-white/90 px-2 py-0.5 rounded inline-block">
              Domain: {topic}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button 
            onClick={() => {
              const next = !voiceEnabled;
              setVoiceEnabled(next);
              if (!next && window.speechSynthesis) window.speechSynthesis.cancel();
            }}
            title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
            className={cn(
              "p-2.5 rounded-xl transition-all border",
              voiceEnabled 
                ? "bg-white/20 text-white border-white/30 hover:bg-white/30" 
                : "bg-red-500/20 text-red-200 border-red-500/40"
            )}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleReset} 
            title="Restart Session"
            className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-white/10 group active:rotate-90"
          >
            <RefreshCcw className="w-4 h-4 group-hover:text-white transition-opacity text-white/70" />
          </button>
        </div>
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
                  "p-5 rounded-[24px] text-[15px] font-medium leading-relaxed shadow-sm border relative group",
                  m.role === 'user' 
                    ? "bg-brand-blue text-white rounded-tr-none border-brand-blue" 
                    : "bg-white text-brand-blue-heading border-brand-border/60 rounded-tl-none"
                )}>
                  {m.text}
                  {m.role === 'assistant' && (
                    <button 
                      onClick={() => speakText(m.text)}
                      title="Read question aloud"
                      className="ml-2 inline-flex items-center text-brand-muted hover:text-brand-blue transition-colors p-1"
                    >
                      <Volume2 className="w-3.5 h-3.5 inline" />
                    </button>
                  )}
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
              <div className="flex items-start gap-4 p-6 bg-red-50 text-red-700 rounded-[32px] text-xs font-medium border border-red-100 shadow-lg max-w-md">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-black uppercase tracking-widest text-red-800">Note</p>
                  <p className="whitespace-pre-wrap leading-relaxed">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input & Voice Controls */}
      <form onSubmit={handleSend} className="p-6 bg-white border-t border-brand-border">
        {isListening && (
          <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2 text-red-600 text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              Listening to your answer... Speak now!
            </div>
            <button 
              type="button" 
              onClick={toggleListening}
              className="text-[11px] font-bold text-red-700 underline"
            >
              Stop
            </button>
          </div>
        )}

        <div className="relative flex items-center gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type or speak your answer here..."}
            className="flex-1 bg-brand-cream/50 border border-brand-border rounded-2xl py-4 pl-6 pr-4 text-sm font-medium outline-none focus:border-brand-blue focus:bg-white transition-all"
          />

          {/* Voice Microphone Toggle */}
          <button 
            type="button"
            onClick={toggleListening}
            title={isListening ? "Stop Listening" : "Speak Answer via Mic"}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border shadow-sm",
              isListening 
                ? "bg-red-500 text-white border-red-600 animate-pulse shadow-red-200" 
                : "bg-white text-brand-blue border-brand-border hover:bg-brand-blue/5 hover:border-brand-blue"
            )}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send Button */}
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="w-12 h-12 bg-brand-blue text-white rounded-2xl flex items-center justify-center hover:bg-brand-blue-dark transition-all disabled:opacity-30 disabled:scale-95 shadow-md shadow-blue-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-3 text-[10px] font-bold uppercase tracking-widest text-brand-muted px-2">
          <span>Click Mic or type to respond</span>
          <span>Voice Synthesis + Speech Recognition</span>
        </div>
      </form>
    </div>
  );
}
