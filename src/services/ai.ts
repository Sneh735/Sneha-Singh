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
    const response = await fetch("/api/ai/analyze-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      const errorMessage = result.error || "Failed to analyze resume";
      throw new Error(errorMessage);
    }
    
    return result;
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
};

export const generateRoadmap = async (skills: string[], targetDomain: string): Promise<RoadmapStep[]> => {
  try {
    const response = await fetch("/api/ai/generate-roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills, targetDomain }),
    });
    if (!response.ok) throw new Error("Failed to generate roadmap");
    return await response.json();
  } catch (error) {
    console.error("AI Roadmap Error:", error);
    throw error;
  }
};

export const getInterviewFeedback = async (topic: string, history: { role: string, text: string }[]): Promise<{ question: string, feedback?: string }> => {
  try {
    const response = await fetch("/api/ai/interview-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, history }),
    });
    if (!response.ok) throw new Error("Failed to get interview feedback");
    return await response.json();
  } catch (error) {
    console.error("AI Interview Error:", error);
    throw error;
  }
};
