import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey === "YOUR_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is missing or set to a placeholder. Please update it in the Secrets panel in AI Studio.");
  }
  return new GoogleGenAI({ apiKey });
};

export interface ResumeAnalysis {
  candidateName: string;
  atsScore: number;
  matchPercentage: number;
  summary: string;
  formattingIssues: string[];
  keywordAnalysis: {
    foundKeywords: string[];
    missingKeywords: string[];
  };
  sectionFeedback: {
    education: string;
    experience: string;
    projects: string;
  };
  topStrengths: string[];
  actionableImprovements: string[];
}

export interface RoadmapStep {
  month: string;
  focus: string;
  topics: string[];
  resources: string[];
}

export const analyzeResume = async (text: string): Promise<ResumeAnalysis> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Please analyze the following resume against the provided target job description.\n\nTarget Job Title/Description:\nSoftware Engineer / Software Developer (General Tech Role)\n\nResume Text (Extracted from PDF):\n${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidateName: { type: Type.STRING },
            atsScore: { type: Type.NUMBER },
            matchPercentage: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            formattingIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywordAnalysis: {
              type: Type.OBJECT,
              properties: {
                foundKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            sectionFeedback: {
              type: Type.OBJECT,
              properties: {
                education: { type: Type.STRING },
                experience: { type: Type.STRING },
                projects: { type: Type.STRING }
              }
            },
            topStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableImprovements: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["candidateName", "atsScore", "matchPercentage", "summary", "formattingIssues", "keywordAnalysis", "sectionFeedback", "topStrengths", "actionableImprovements"]
        },
        systemInstruction: `You are an advanced Applicant Tracking System (ATS) algorithm and a Senior Technical Recruiter. Your task is to analyze the text extracted from a candidate's PDF resume and evaluate its effectiveness, ATS compatibility, and match for a specific target role.`
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    if (error.message?.includes("API key not valid") || error.status === 400 || error.status === 401) {
      throw new Error("CONFIG ERROR: INVALID GEMINI API KEY. Please update your GEMINI_API_KEY in the Secrets panel.");
    }
    throw error;
  }
};

export const generateRoadmap = async (skills: string[], targetDomain: string): Promise<RoadmapStep[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a detailed learning roadmap for ${targetDomain}. The user already has these skills: ${skills.join(', ')}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              month: { type: Type.STRING },
              focus: { type: Type.STRING },
              topics: { type: Type.ARRAY, items: { type: Type.STRING } },
              resources: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["month", "focus", "topics", "resources"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error: any) {
    console.error("AI Roadmap Error:", error);
    if (error.message?.includes("API key not valid") || error.status === 400 || error.status === 401) {
      throw new Error("CONFIG ERROR: INVALID GEMINI API KEY. Please update your GEMINI_API_KEY in the Secrets panel.");
    }
    throw error;
  }
};

export const getInterviewFeedback = async (topic: string, history: { role: string, text: string }[]): Promise<{ question: string, feedback?: string }> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an interviewer. Topic: ${topic}. Interview history: ${JSON.stringify(history)}. Please provide the next question and brief feedback on the previous answer if applicable.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            feedback: { type: Type.STRING }
          },
          required: ["question"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("AI Interview Error:", error);
    if (error.message?.includes("API key not valid") || error.status === 400 || error.status === 401) {
      throw new Error("CONFIG ERROR: INVALID GEMINI API KEY. Please update your GEMINI_API_KEY in the Secrets panel.");
    }
    throw error;
  }
};
