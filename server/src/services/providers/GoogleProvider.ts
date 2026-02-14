import { Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Config } from "../../config/config";
import { ILLMProvider } from "./ILLMProvider";

export class GoogleProvider implements ILLMProvider {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(Config.GOOGLE_API_KEY);
  }

  async streamAsk(prompt: string, res: Response): Promise<string> {
    if (!Config.GOOGLE_API_KEY) {
      const msg = "Google API Key is missing on server.";
      res.write(`data: ${JSON.stringify({ content: msg })}\n\n`);
      return msg;
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: Config.GOOGLE_MODEL });

      const result = await model.generateContentStream(prompt);

      let fullText = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;

        res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }

      return fullText;
    } catch (error: any) {
      console.error("[GoogleProvider] Error:", error);

      let errorMessage = "Error connecting to Google Gemini.";
      if (error.message?.includes("404")) {
        errorMessage = "Model not found or API not enabled in Google Cloud Console.";
      } else if (error.message?.includes("API key")) {
        errorMessage = "Invalid Google API Key.";
      }

      res.write(`data: ${JSON.stringify({ content: errorMessage })}\n\n`);
      return errorMessage;
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
