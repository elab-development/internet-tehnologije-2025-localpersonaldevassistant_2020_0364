import { Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Config } from "../../config/config";
import { ILLMProvider } from "./ILLMProvider";

export class GoogleProvider implements ILLMProvider {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(Config.GOOGLE_API_KEY);
  }

  async streamAsk(prompt: string, onChunk: (chunk: string) => void): Promise<string> {
    if (!Config.GOOGLE_API_KEY) {
      const msg = "Google API Key is missing.";
      onChunk(msg);
      return msg;
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: Config.GOOGLE_MODEL });

      const result = await model.generateContentStream(prompt);

      let fullText = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        onChunk(chunkText);
      }

      return fullText;
    } catch (error: any) {
      const msg = "Error connecting to Gemini";
      onChunk(msg);
      return msg;
    }
  }

  async ask(prompt: string): Promise<string> {
    if (!Config.GOOGLE_API_KEY) return "Google API Key missing.";

    try {
      const model = this.genAI.getGenerativeModel({ model: Config.GOOGLE_MODEL });
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("[GoogleProvider] Error:", error);
      return "Google AI unavailable.";
    }
  }
}
