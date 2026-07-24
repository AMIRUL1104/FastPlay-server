import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MODEL = "gemini-3.1-flash-lite";

export const generateText = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  return response.text?.trim() ?? "";
};
