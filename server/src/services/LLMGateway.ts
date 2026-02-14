import { ILLMProvider } from "./providers/ILLMProvider";
import { OllamaProvider } from "./providers/OllamaProvider";
import { GroqProvider } from "./providers/GroqProvider";
import { GoogleProvider } from "./providers/GoogleProvider";

export enum ModelProvider {
  OLLAMA = "OLLAMA",
  GROQ = "GROQ",
  GOOGLE = "GOOGLE",
}

export class LLMGateway {
  private static ollamaProvider = new OllamaProvider();
  private static groqProvider = new GroqProvider();
  private static googleProvider = new GoogleProvider();

  public static getProvider(providerName: string): ILLMProvider {
    switch (providerName) {
      case ModelProvider.GOOGLE:
        return this.googleProvider;
      case ModelProvider.GROQ:
        return this.groqProvider;
      case ModelProvider.OLLAMA:
      default:
        return this.ollamaProvider;
    }
  }
}
