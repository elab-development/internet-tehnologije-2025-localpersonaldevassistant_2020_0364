import axios from "axios";
import { Config } from "../config/config";
import { Response } from "express";

export class LLMService {
  static async streamAsk(prompt: string, res: Response): Promise<string> {
    const response = await axios.post(
      Config.LLM_API_URL,
      {
        model: Config.LLM_MODEL,
        prompt: prompt,
        stream: true,
        options: { temperature: 0.7 },
      },
      { responseType: "stream" },
    );

    let fullText = "";

    return new Promise((resolve, reject) => {
      response.data.on("data", (chunk: Buffer) => {
        const lines = chunk
        .toString()
        .split("\n")
        .filter((line) => line.trim() !== "");

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.response) {
              const text = json.response;
              fullText += text;
              res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
            }
          } catch (e) {
            /* ignore parse errors */
          }
        }
      });

      response.data.on("end", () => resolve(fullText));
      response.data.on("error", (err: any) => reject(err));
    });
  }

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
