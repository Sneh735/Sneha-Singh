import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedGenAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!cachedGenAI) {
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined.");
    }
    
    // In case the key is wrapped in quotes
    apiKey = apiKey.trim();
    if (apiKey.startsWith('"') && apiKey.endsWith('"')) {
      apiKey = apiKey.substring(1, apiKey.length - 1);
    }
    
    if (apiKey === "YOUR_GEMINI_API_KEY" || apiKey === "AIzaSy...") {
      throw new Error("GEMINI_API_KEY is still set to a placeholder value. Please go to the 'Secrets' panel in AI Studio and set a valid Gemini API key.");
    }
    
    // Check if the key looks like a Firebase key instead of a Gemini key (common mistake)
    // Most Gemini keys are ~39 chars and start with AIzaSy
    if (apiKey && apiKey.length < 30) {
      console.warn(`[AI] Warning: GEMINI_API_KEY seems unusually short (${apiKey.length} chars).`);
    }

    console.log(`[AI] Initializing with API key (length: ${apiKey.length}, prefix: ${apiKey.substring(0, 7)}...)`);
    cachedGenAI = new GoogleGenAI({ apiKey });
  }
  return cachedGenAI;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // AI Skill Analysis Endpoint
  app.post("/api/ai/analyze-resume", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || text.length < 10) {
        return res.status(400).json({ error: "Resume text is too short or empty. Please ensure the PDF is readable." });
      }

      console.log(`[AI] Analyzing resume (${text.length} chars)`);
      let ai;
      try {
        ai = getGenAI();
      } catch (e: any) {
        console.error("[AI] Configuration Error:", e.message);
        return res.status(500).json({ 
          error: "Gemini API key is missing or invalid in the server environment.",
          help: "Please check the 'Secrets' panel in AI Studio and ensure GEMINI_API_KEY is set correctly."
        });
      }
      
      const response = await ai.models.generateContent({ 
        model: "gemini-1.5-flash", 
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
      
      const resultText = response.text || "{}";
      res.json(JSON.parse(resultText));
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      
      const isApiKeyInvalid = error.message?.includes("API key not valid") || error.status === 400 || error.status === 401;
      
      if (isApiKeyInvalid) {
        return res.status(401).json({
          error: "INVALID GEMINI API KEY",
          help: "The API key in your 'Secrets' panel is invalid. Make sure you are using a GEMINI API key from https://aistudio.google.com/app/apikey and NOT a Firebase API key. Update it in AI Studio > Secrets > GEMINI_API_KEY."
        });
      }

      const status = error.status || 500;
      res.status(status).json({ 
        error: error.message || "Internal server error during AI analysis",
        details: error.details || [] 
      });
    }
  });

  // AI Learning Path Endpoint
  app.post("/api/ai/generate-roadmap", async (req, res) => {
    try {
      const { skills, targetDomain } = req.body;
      const ai = getGenAI();
      const response = await ai.models.generateContent({ 
        model: "gemini-1.5-flash",
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
      res.json(JSON.parse(response.text || "[]"));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Mock Interview Endpoint
  app.post("/api/ai/interview-chat", async (req, res) => {
    try {
      const { topic, history } = req.body;
      const ai = getGenAI();
      const response = await ai.models.generateContent({ 
        model: "gemini-1.5-flash",
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
      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example Job Match logic (Backend)
  app.post("/api/jobs/match", (req, res) => {
    const { skills, domain } = req.body;
    // In a real app, this would query a database of jobs
    // Here we simulate it
    res.json({
      matches: [
        { id: "1", title: `${domain} Specialist`, company: "TechCorp", location: "Remote" },
        { id: "2", title: "Full Stack Engineer", company: "DevShop", location: "Singapore" }
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
