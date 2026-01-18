import axios from "axios";
import { Config } from "../config/config";

export class LLMService {
  // Use the specific port and model you exposed in Docker
  static async ask(prompt: string): Promise<string> {
    try {
      const response = await axios.post(Config.LLM_API_URL, {
        model: Config.LLM_MODEL,
        prompt: prompt,
        stream: false, // Wait for the full response before returning
        options: {
          temperature: 0.7,
          num_predict: 500, // Prevents the model from running too long on limited RAM
        },
      });

      return response.data?.response || "I received an empty response from the AI.";
    } catch (error) {
      console.error("[LLMService] Error:", error);
      return "Local AI is unavailable. Please check if Docker is running and the qwen model is downloaded.";
    }
  }
}
