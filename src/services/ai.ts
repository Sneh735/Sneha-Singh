import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface ResumeAnalysis {
  skills: string[];
  experience: number;
  education: string;
  score: number;
  feedback: string[];
  matchingDomains: string[];
}

export const analyzeResume = async (text: string): Promise<ResumeAnalysis> => {
  const model = "gemini-3-flash-preview";
  const prompt = `Analyze the following resume text and extract key details. 
  Return the analysis in a JSON format.
  Resume text:
  ${text}`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          experience: { type: Type.NUMBER, description: "Total years of experience" },
          education: { type: Type.STRING },
          score: { type: Type.NUMBER, description: "Resume score from 0-100" },
          feedback: { type: Type.ARRAY, items: { type: Type.STRING } },
          matchingDomains: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["skills", "experience", "education", "score", "feedback", "matchingDomains"]
      }
    }
  });

  const analysis = JSON.parse(response.text || "{}");
  return analysis as ResumeAnalysis;
};
