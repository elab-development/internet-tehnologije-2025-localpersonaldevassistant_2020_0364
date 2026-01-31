import { createContext, useContext } from "react";
import type { Message, Session, Mode, Snippet } from "../types/types";

export interface ChatContextType {
  currentSessionId: number | null;
  messages: Message[];
  sessions: Session[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  addMessage: (message: Message) => void;
  isLoading: boolean;
  loadSession: (sessionId: number) => void;
  refreshSessions: () => void;
  sendMessageStream: (content: string, mode: Mode) => Promise<void>;
  startNewSession: () => void;
  snippets: Snippet[];
  addSnippet: (code: string, language: string) => Promise<void>;
  removeSnippet: (id: number) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
