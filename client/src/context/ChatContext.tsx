import { createContext, useContext } from "react";
import type { Message, Session } from "../types/types";

export interface ChatContextType {
  currentSessionId: number | null;
  messages: Message[];
  sessions: Session[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  addMessage: (message: Message) => void;
  isLoading: boolean;
  loadSession: (sessionId: number) => void;
  refreshSessions: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
