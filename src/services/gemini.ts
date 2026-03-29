import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. To fix this:\n1. Click the ⚙️ (Settings) icon in the top-right of AI Studio.\n2. Go to 'Secrets'.\n3. Add a new secret with Name: GEMINI_API_KEY and Value: AIzaSyCcrrKi5LzngOTaBP-fg1KyfiaViFWpUf0\n4. Restart the app.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function getChatResponse(
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = [],
  modelType: 'gemini' | 'gpt' = 'gemini',
  language: string = 'English',
  userName: string = 'User'
) {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: `You are Nova, the official Skinfotech AI Assistant. 
        The user's name is ${userName}. Address them by name naturally.
        Currently acting as: ${modelType === 'gpt' ? 'ChatGPT Mode' : 'Gemini AI Mode'}.
        Please respond in: ${language}.
        
        Your capabilities:
        1. You can answer ANY question, from general knowledge to technical advice.
        2. You specialize in marketing, SEO, blogging, corporate, financial, and product tasks.
        3. You are a personal digital companion for the Skinfotech app.
        
        Your tone:
        - Cheerful, professional, and concise.
        - Helpful and proactive.
        
        CRITICAL: Since you are a voice-first assistant, you should occasionally ask the user if they would like to hear the response in any of the other supported languages (Tamil, Malayalam, Hindi, Kannada, Telugu).
        Always prioritize accuracy and helpfulness. If you don't know something, be honest but offer to help find the information.`,
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
