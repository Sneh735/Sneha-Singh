import React, { useState, useEffect, useRef } from 'react';
import { StudentUser, CareerQuizPreferences, RoleType, OpportunityType } from '../types';
import { 
  Bot, 
  User as UserIcon, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Layers, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ChatGptCareerQuizProps {
  currentUser: StudentUser;
  onQuizComplete: (prefs: CareerQuizPreferences) => void;
  onSkip: () => void;
}

interface QuizMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  options?: { label: string; value: string; desc?: string }[];
  stepIndex?: number;
}

export const ChatGptCareerQuiz: React.FC<ChatGptCareerQuizProps> = ({
  currentUser,
  onQuizComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<QuizMessage[]>([]);
  const [answers, setAnswers] = useState<{
    roleType: 'All' | RoleType;
    opportunityType: 'All' | OpportunityType;
    location: string;
    stipendPreference: string;
    certificateRequired: boolean;
  }>({
    roleType: 'All',
    opportunityType: 'All',
    location: 'All Locations',
    stipendPreference: 'Any',
    certificateRequired: false,
  });

  const [isDone, setIsDone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Question definitions
  const quizSteps = [
    {
      id: 'step-role',
      question: `Hey ${currentUser.name}! I'm your SKILL2CAREER Assistant. Since you're an undergraduate in ${currentUser.branch}, let's find the best verified freshers opportunities for you. To begin:\n\nWhat role domain are you most interested in?`,
      options: [
        { label: 'Technical Roles', value: 'Technical', desc: 'Software engineering, AI/ML, Embedded systems, Data pipelines' },
        { label: 'Non-Technical Roles', value: 'Non-Technical', desc: 'Product operations, tech support specialist, solution consulting' },
        { label: 'Open to Both', value: 'All', desc: 'Show both technical engineering and tech-adjacent roles' },
      ],
    },
    {
      id: 'step-opp',
      question: 'Awesome choice! Next question:\n\nWhich opportunity format are you targeting right now?',
      options: [
        { label: 'Internships with PPO', value: 'Internship with PPO', desc: 'Pre-Placement Offer conversion upon successful completion' },
        { label: 'Direct Placement Jobs', value: 'Direct Placement', desc: 'Immediate full-time roles (Freshers 0-exp only)' },
        { label: 'Open to Both Formats', value: 'All', desc: 'Include both PPO internships and direct placements' },
      ],
    },
    {
      id: 'step-location',
      question: 'Got it noted. Now let me know your preferred job location:',
      options: [
        { label: 'Bengaluru', value: 'Bengaluru', desc: 'India’s Silicon Valley tech startup hub' },
        { label: 'Hyderabad or Pune', value: 'Hyderabad', desc: 'Major tech parks & enterprise engineering hubs' },
        { label: 'Remote Only', value: 'Remote', desc: 'Work from anywhere with high flexibility' },
        { label: 'Any Location', value: 'All Locations', desc: 'Willing to relocate or work anywhere in India' },
      ],
    },
    {
      id: 'step-stipend',
      question: 'Understood. What is your expectation regarding stipend or compensation?',
      options: [
        { label: 'Any Fair Fresher Stipend', value: 'Any', desc: 'Focus on top learning experience and brand prestige' },
        { label: '₹40,000+ / Month', value: '40k+', desc: 'High-stipend tier with strong conversion rates' },
        { label: 'Direct Placement (8 - 16+ LPA)', value: 'Placement', desc: 'High starting annual CTC for fresh graduates' },
      ],
    },
    {
      id: 'step-cert',
      question: 'Final question: Is an official Certification of Completion required for your university credits or portfolio?',
      options: [
        { label: 'Yes, Certificate Required', value: 'true', desc: 'Only show listings with official completion credentials' },
        { label: 'No, Optional / Not Required', value: 'false', desc: 'Include all verified opportunities' },
      ],
    },
  ];

  // Initialize first assistant message
  useEffect(() => {
    setMessages([
      {
        id: 'msg-0',
        sender: 'assistant',
        text: quizSteps[0].question,
        options: quizSteps[0].options,
        stepIndex: 0,
      },
    ]);
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDone]);

  const handleSelectOption = (value: string, label: string) => {
    // 1. Add user message
    const userMsg: QuizMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: label,
    };

    // Update answers state
    const nextAnswers = { ...answers };
    if (currentStep === 0) nextAnswers.roleType = value as 'All' | RoleType;
    if (currentStep === 1) nextAnswers.opportunityType = value as 'All' | OpportunityType;
    if (currentStep === 2) nextAnswers.location = value;
    if (currentStep === 3) nextAnswers.stipendPreference = value;
    if (currentStep === 4) nextAnswers.certificateRequired = value === 'true';
    setAnswers(nextAnswers);

    const nextStep = currentStep + 1;

    if (nextStep < quizSteps.length) {
      setCurrentStep(nextStep);
      const assistantMsg: QuizMessage = {
        id: `asst-${nextStep}`,
        sender: 'assistant',
        text: quizSteps[nextStep].question,
        options: quizSteps[nextStep].options,
        stepIndex: nextStep,
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
    } else {
      // Quiz completed
      setIsDone(true);
      const completionMsg: QuizMessage = {
        id: 'asst-done',
        sender: 'assistant',
        text: `Perfect, ${currentUser.name}! I've calibrated your verified fresher matches:\n\n• Target Domain: ${nextAnswers.roleType}\n• Format: ${nextAnswers.opportunityType}\n• Preferred Location: ${nextAnswers.location}\n• Certificate Required: ${nextAnswers.certificateRequired ? 'Yes' : 'No'}\n\nAll non-freshers and unverified companies have been filtered out. Click below to launch your personalized dashboard!`,
      };
      setMessages((prev) => [...prev, userMsg, completionMsg]);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsDone(false);
    setAnswers({
      roleType: 'All',
      opportunityType: 'All',
      location: 'All Locations',
      stipendPreference: 'Any',
      certificateRequired: false,
    });
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: quizSteps[0].question,
        options: quizSteps[0].options,
        stepIndex: 0,
      },
    ]);
  };

  return (
    <div className="min-h-[85vh] max-w-3xl mx-auto px-4 py-8 flex flex-col justify-between">
      
      {/* Quiz Top Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">
                SKILL2CAREER Career Assistant
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Quiz Filter
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive MCQ Questionnaire for {currentUser.name} ({currentUser.branch} Stream)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSkip}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Skip to All Jobs
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-6 overflow-hidden">
        <div
          className="bg-indigo-600 h-1.5 transition-all duration-300"
          style={{ width: `${isDone ? 100 : ((currentStep + 1) / quizSteps.length) * 100}%` }}
        ></div>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 space-y-4 mb-6">
        {messages.map((msg, index) => {
          const isAssistant = msg.sender === 'assistant';
          const isLatestAssistant = isAssistant && index === messages.length - 1 && !isDone;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[78%] space-y-3`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                    isAssistant
                      ? 'bg-white border border-slate-200 text-slate-800'
                      : 'bg-indigo-600 text-white font-medium rounded-tr-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* MCQ Options displayed only for the active latest assistant message */}
                {isLatestAssistant && msg.options && (
                  <div className="space-y-2 pt-1 animate-in fade-in duration-300">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Select your answer:
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelectOption(opt.value, opt.label)}
                          className="w-full text-left p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 shadow-2xs transition-all group flex items-start justify-between gap-3"
                        >
                          <div>
                            <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-700">
                              {opt.label}
                            </div>
                            {opt.desc && (
                              <div className="text-xs text-slate-500 mt-0.5">
                                {opt.desc}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Completion Action Bar */}
      {isDone && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Quiz Evaluation Completed
              </span>
            </div>
            <button
              onClick={handleRestart}
              className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>

          <button
            onClick={() => onQuizComplete(answers)}
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 group"
          >
            <span>Launch Tailored Job Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

    </div>
  );
};
