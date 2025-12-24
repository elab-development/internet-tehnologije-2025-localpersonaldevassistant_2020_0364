export interface Session {
  id: number;
  title: string;
  createdAt: string;
  lastActivityAt: string;
}

export type SenderType = "USER" | "LLM";

export type Mode = "ANALYSIS" | "GENERATION" | "DEBUG";

export interface Message {
  id: number;
  content: string;
  senderType: SenderType;
  mode: Mode;
  createdAt: string;
}
