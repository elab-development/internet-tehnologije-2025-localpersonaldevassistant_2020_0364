import { Response } from "express";

export interface ILLMProvider {
  streamAsk(prompt: string, onChunk: (chunk: string) => void): Promise<string>;
  ask(prompt: string): Promise<string>;
}
