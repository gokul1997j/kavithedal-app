import { GoogleGenAI, Chat, GenerativeModel } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!genAI) {
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing from environment variables.");
      throw new Error("API Key not found");
    }
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const initializeChat = async (): Promise<Chat> => {
  const ai = getAIClient();
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Slightly creative for book descriptions
      maxOutputTokens: 1000,
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async function* (message: string) {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session.");
  }

  try {
    const streamResult = await chatSession.sendMessageStream({ message });
    
    for await (const chunk of streamResult) {
        if (chunk.text) {
            yield chunk.text;
        }
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    yield "I apologize, but I'm having trouble connecting to the library archives right now. Please try again in a moment.";
  }
};

export const generateMarketingCopy = async (topic: string): Promise<string> => {
    const ai = getAIClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a short, engaging social media post (max 100 words) for Kavithedal Publication about: ${topic}. Use emojis and hashtags.`,
        });
        return response.text || "Could not generate content.";
    } catch (e) {
        console.error("Error generating marketing copy", e);
        return "Error generating marketing copy.";
    }
}