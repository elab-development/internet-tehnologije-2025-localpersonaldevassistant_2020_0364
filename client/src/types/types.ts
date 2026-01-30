export interface Session {
  id: number;
  title: string;
  createdAt: string;
  lastActivityAt: string;
}

export type SenderType = "USER" | "LLM";

export type Mode = "ANALYSIS" | "GENERATION" | "DEBUG";

export interface Feedback {
  id: number;
  isPositive: boolean;
  comment?: string;
}

export interface Message {
  id: number;
  content: string;
  senderType: SenderType;
  mode: Mode;
  createdAt: string;
  feedback?: Feedback;
  isStreaming?: boolean;
}
