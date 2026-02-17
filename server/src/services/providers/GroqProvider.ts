import axios from "axios";
import { Response } from "express";
import { Config } from "../../config/config";
import { ILLMProvider } from "./ILLMProvider";

export class GroqProvider implements ILLMProvider {
  private apiUrl = "https://api.groq.com/openai/v1/chat/completions";

  async streamAsk(prompt: string, onChunk: (chunk: string) => void): Promise<string> {
    if (!Config.GROQ_API_KEY) {
      onChunk("Groq API Key is missing.");
      return "Error";
    }

    const response = await axios.post(
      this.apiUrl,
      {
        model: Config.GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        stream: true,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${Config.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "stream",
      },
    );

    let fullText = "";

    return new Promise((resolve, reject) => {
      response.data.on("data", (chunk: Buffer) => {
        const lines = chunk
          .toString()
          .split("\n")
          .filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line === "data: [DONE]") continue;
          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.replace("data: ", "");
              const json = JSON.parse(jsonStr);
              const delta = json.choices[0]?.delta?.content || "";

              if (delta) {
                fullText += delta;
                onChunk(delta);
              }
            } catch (e) {
              console.error("Error parsing Groq chunk", e);
            }
          }
        }
      });

      response.data.on("end", () => resolve(fullText));
      response.data.on("error", (err: any) => reject(err));
    });
  }

  async ask(prompt: string): Promise<string> {
    if (!Config.GROQ_API_KEY) return "Groq API Key missing.";

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: Config.GROQ_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${Config.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.choices[0]?.message?.content || "Empty response from Groq.";
    } catch (error) {
      console.error("[GroqProvider] Error:", error);
      return "Groq AI unavailable.";
    }
  }
}
