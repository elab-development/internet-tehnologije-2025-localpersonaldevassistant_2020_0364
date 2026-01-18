import CommunicationController from "../communication/CommunicationController";
import { useChat } from "../context/ChatContext";
import type { Message } from "../types/types";
import "./InputComponent.css";

const InputComponent = () => {
  const { currentSessionId, addMessage, loadSession, refreshSessions } = useChat();

  function handleSendButtonClick(e: React.FormEvent) {
    e.preventDefault();

    const inputFieldEl = document.getElementById("inputField") as HTMLInputElement;
    const content = inputFieldEl.value;

    if (!content.trim()) return;

    const optimisticMessage: Message = {
      id: Date.now(),
      content,
      senderType: "USER",
      mode: "GENERATION",
      createdAt: new Date().toISOString(),
    };

    addMessage(optimisticMessage);
    inputFieldEl.value = "";

    CommunicationController.sendRequest("POST", "/api/chat", { body: { content, sessionId: currentSessionId } }).then((response) => {
      console.log("Message sent response:", response);
      const serverData = response.payload as Message & { session?: { id: number } };

      addMessage(serverData);

      if (!currentSessionId && serverData.session?.id) {
        const newId = serverData.session.id;
        loadSession(newId);
        refreshSessions();
      }
    });
  }

  return (
    <div id="inputFormWrapper">
      <form id="inputForm" onSubmit={handleSendButtonClick}>
        <input type="text" name="" id="inputField" />
        <button type="submit">SEND</button>
      </form>
    </div>
  );
};

export default InputComponent;
