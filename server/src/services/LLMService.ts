import axios from "axios";
import { Config } from "../config/config";

export class LLMService {
  static async ask(prompt: string): Promise<string> {
    try {
      const response = await axios.post(Config.LLM_API_URL, {
        model: Config.LLM_MODEL,
        prompt: prompt,
        stream: false,
        keep_alive: "5m",
        options: {
          temperature: 0.7,
          num_predict: 500,
        },
      });

      return response.data?.response || "I received an empty response from the AI.";
    } catch (error) {
      console.error("[LLMService] Error:", error);
      return "Local AI is unavailable. Please check if Docker is running and the qwen model is downloaded.";
    }
  }
}
