import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. If you are on Hostinger, ensure you have set this environment variable in your build settings or .env file.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function getChatResponse(
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = [],
  modelType: 'gemini' | 'gpt' = 'gemini',
  language: string = 'English'
) {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: `You are Nova, a friendly AI assistant. 
        Currently acting as: ${modelType === 'gpt' ? 'ChatGPT Mode' : 'Gemini AI Mode'}.
        Please respond in: ${language}.
        Your tone is cheerful, professional, and concise. Help with marketing, SEO, blogging, corporate, financial, and product tasks.
        CRITICAL: Since you are a voice-first assistant, you should occasionally ask the user if they would like to hear the response in any of the other supported languages (Tamil, Malayalam, Hindi, Kannada, Telugu).`,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI returned an empty response. Please try again or rephrase your question.");
    }
    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
