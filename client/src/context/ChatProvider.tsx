import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatContext } from "./ChatContext";
import CommunicationController from "../communication/CommunicationController";
import type { Message, Session, Mode, Snippet, ModelProvider } from "../types/types";

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { sessionId } = useParams();
  const currentSessionId = sessionId ? parseInt(sessionId) : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
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

  const refreshSnippets = () => {
    CommunicationController.sendRequest("GET", "/api/snippets", {}).then((response) => {
      if (response.ok) {
        setSnippets(response.payload as Snippet[]);
      }
    });
  };

  const addSnippet = async (code: string, language: string) => {
    if (snippets.some((s) => s.code === code)) return;

    const response = await CommunicationController.sendRequest("POST", "/api/snippets", {
      body: { code, language },
    });

    if (response.ok) {
      const newSnippet = (response.payload as { snippet: Snippet }).snippet;
      setSnippets((prev) => [newSnippet, ...prev]);
    }
  };

  const removeSnippet = async (id: number) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
    await CommunicationController.sendRequest("DELETE", `/api/snippets/${id}`, {});
  };

  useEffect(() => {
    refreshSessions();
    refreshSnippets();
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

  const sendMessageStream = async (content: string, mode: Mode, provider: ModelProvider) => {
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
      isStreaming: true,
    };
    addMessage(llmMsg);

    await CommunicationController.streamRequest(
      "/api/chat",
      { content, sessionId: currentSessionId, mode, provider },
      (chunk) => {
        setMessages((prev) => prev.map((msg) => (msg.id === tempLlmId ? { ...msg, content: msg.content + chunk } : msg)));
      },
      (finalData: { messageId?: number; sessionId?: number }) => {
        if (finalData.messageId) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempLlmId
                ? {
                    ...msg,
                    id: finalData.messageId!,
                    isStreaming: false,
                  }
                : msg,
            ),
          );
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
        snippets,
        addSnippet,
        removeSnippet,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
