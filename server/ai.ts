import { GoogleGenAI } from "@google/genai";
import { NEXUS_OPS_SYSTEM_PROMPT } from "./nexusOpsPrompt.js";

// Lazy initialize to not crash if env var is missing on import
let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

let currentSystemPrompt = NEXUS_OPS_SYSTEM_PROMPT;

export function getSystemPrompt() {
  return currentSystemPrompt;
}

export function setSystemPrompt(prompt: string) {
  currentSystemPrompt = prompt;
}

export async function processNexusOrchestration(query: string) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [{ role: "user", parts: [{ text: query }] }],
    config: {
      systemInstruction: currentSystemPrompt,
      temperature: 0.2, // Low temperature for more analytical/professional responses
    },
  });

  return response.text;
}
