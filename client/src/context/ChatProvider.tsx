import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatContext } from "./ChatContext";
import CommunicationController from "../communication/CommunicationController";
import type { Message, Session, Mode } from "../types/types";

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { sessionId } = useParams();
  const currentSessionId = sessionId ? parseInt(sessionId) : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const refreshSessions = () => {
    CommunicationController.sendRequest("GET", "/api/chat/sessions", {}).then((response) => {
      if (response.ok) {
        setSessions(response.payload as Session[]);
      }
    });
  };

  const loadSession = (id: number) => {
    navigate(`/chat/${id}`);
  };

  const startNewSession = () => {
    setMessages([]);
    navigate("/chat");
  };

  useEffect(() => {
    refreshSessions();
  }, []);

  useEffect(() => {
    if (!currentSessionId || isNaN(currentSessionId)) {
      return;
    }

    let isMounted = true;

    const timer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(true);
        setMessages([]);
      }
    }, 0);

    CommunicationController.sendRequest("GET", `/api/chat/${currentSessionId}/messages`, {})
      .then((res) => {
        if (isMounted && res.ok) {
          const data = res.payload as Message[];
          setTimeout(() => {
            if (isMounted) {
              setMessages(Array.isArray(data) ? data : []);
              setIsLoading(false);
            }
          }, 0);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [currentSessionId]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [message, ...prev]);
  };

  const sendMessageStream = async (content: string, mode: Mode) => {
    const userMsg: Message = {
      id: Date.now(),
      content,
      senderType: "USER",
      mode,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMsg);

    const tempLlmId = Date.now() + 1;
    const llmMsg: Message = {
      id: tempLlmId,
      content: "",
      senderType: "LLM",
      mode,
      createdAt: new Date().toISOString(),
    };
    addMessage(llmMsg);

    await CommunicationController.streamRequest(
      "/api/chat",
      { content, sessionId: currentSessionId, mode },
      (chunk) => {
        setMessages((prev) => prev.map((msg) => (msg.id === tempLlmId ? { ...msg, content: msg.content + chunk } : msg)));
      },
      (finalData: { messageId?: number; sessionId?: number }) => {
        if (finalData.messageId) {
          setMessages((prev) => prev.map((msg) => (msg.id === tempLlmId ? { ...msg, id: finalData.messageId! } : msg)));
        }

        if (finalData.sessionId) {
          refreshSessions();
          if (!currentSessionId) {
            loadSession(finalData.sessionId);
          }
        }
      },
    );
  };

  return (
    <ChatContext.Provider
      value={{
        currentSessionId,
        messages,
        setMessages,
        isLoading,
        loadSession,
        addMessage,
        sessions,
        refreshSessions,
        sendMessageStream,
        startNewSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
