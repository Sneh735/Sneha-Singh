import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { analyzeResume, ResumeAnalysis } from '../services/ai';
import { cn } from '../lib/utils';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path from unpkg CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;


interface ResumeUploaderProps {
  onAnalysisComplete: (analysis: ResumeAnalysis) => void;
}

export default function ResumeUploader({ onAnalysisComplete }: ResumeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ");
    }
    return text;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const text = await extractTextFromPdf(file);
      const analysis = await analyzeResume(text);
      onAnalysisComplete(analysis);
    } catch (err: any) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to analyze resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className={cn(
        "w-full p-10 border-2 border-dashed rounded-[32px] transition-all duration-300 relative group",
        isUploading ? "border-brand-blue bg-brand-blue/5" : "border-brand-border hover:border-brand-blue hover:bg-brand-blue/5"
      )}>
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
          accept=".pdf" 
          onChange={handleFileUpload} 
          disabled={isUploading} 
        />
        
        <div className="flex flex-col items-center space-y-4 relative z-0">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg",
            isUploading ? "bg-brand-blue text-white animate-pulse" : "bg-white text-brand-blue group-hover:scale-110 border border-brand-border"
          )}>
            {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-[20px] font-display font-bold text-brand-blue-heading tracking-tight">Sync Methodology</h3>
            <p className="text-brand-muted text-[13px] font-medium max-w-[240px]">Drag PDF resume or click to browse local files.</p>
          </div>

          <div className="pt-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-brand-border/50">
              <FileText className="w-3.5 h-3.5" /> PDF Only
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-brand-border/50">
              <CheckCircle className="w-3.5 h-3.5" /> AI Scored
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="flex items-start gap-3 p-4 mt-6 bg-red-50 text-red-700 rounded-2xl text-[12px] font-medium border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="font-bold uppercase tracking-widest text-red-800 text-[10px] mb-1">Upload Error</p>
            <p className="leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
