import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { analyzeResume, ResumeAnalysis } from '../services/ai';
import { cn } from '../lib/utils';
import * as pdfjsLib from 'pdfjs-dist';

// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-12 border border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center text-center space-y-6">
      <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center">
        {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Sync your Resume</h3>
        <p className="text-slate-500 mt-1 max-w-sm">We'll use AI to extract your skills and match you with open roles.</p>
      </div>
      
      <label className={cn(
        "cursor-pointer px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-700 transition-all active:scale-95 inline-block",
        isUploading && "pointer-events-none opacity-80"
      )}>
        {isUploading ? "Analyzing..." : "Upload PDF Resume"}
        <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={isUploading} />
      </label>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
