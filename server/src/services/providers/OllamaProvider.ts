import axios from "axios";
import { Response } from "express";
import { Config } from "../../config/config";
import { ILLMProvider } from "./ILLMProvider";

export class OllamaProvider implements ILLMProvider {
  async streamAsk(prompt: string, onChunk: (chunk: string) => void): Promise<string> {
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
              onChunk(text);
            }
          } catch (e) {
            // ignore parse errors
          }
        }
      });

      response.data.on("end", () => resolve(fullText));
      response.data.on("error", (err: any) => reject(err));
    });
  }

  async ask(prompt: string): Promise<string> {
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

      return response.data?.response || "Empty response from Ollama.";
    } catch (error) {
      console.error("[OllamaProvider] Error:", error);
      return "Local AI unavailable.";
    }
  }
}
