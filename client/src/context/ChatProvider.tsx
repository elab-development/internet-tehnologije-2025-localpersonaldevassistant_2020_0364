import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatContext } from "./ChatContext";
import CommunicationController from "../communication/CommunicationController";
import type { Message } from "../types/types";

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { sessionId } = useParams();
  const currentSessionId = sessionId ? parseInt(sessionId) : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const loadSession = (id: number) => {
    navigate(`/chat/${id}`);
  };

  useEffect(() => {
    if (!currentSessionId || isNaN(currentSessionId)) {
      return;
    }

    let isMounted = true;

    const timer = setTimeout(() => {
      setIsLoading(true);
      setMessages([]);
    }, 0);

    CommunicationController.sendRequest("GET", `/api/chat/${currentSessionId}/messages`, {})
      .then((res) => {
        if (isMounted && res.ok) {
          const data = res.payload as Message[];
          setMessages(Array.isArray(data) ? data : []);
          console.log("Loaded messages for session", currentSessionId, data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentSessionId]);

  return <ChatContext.Provider value={{ currentSessionId, messages, setMessages, isLoading, loadSession }}>{children}</ChatContext.Provider>;
};
