import { Response } from "express";

export interface ILLMProvider {
  streamAsk(prompt: string, res: Response): Promise<string>;
  ask(prompt: string): Promise<string>;
}
