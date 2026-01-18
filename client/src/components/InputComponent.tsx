import CommunicationController from "../communication/CommunicationController";
import { useChat } from "../context/ChatContext";
import type { Message } from "../types/types";
import "./InputComponent.css";

const InputComponent = () => {
  const { currentSessionId, addMessage } = useChat();

  function handleSendButtonClick(e: React.FormEvent) {
    e.preventDefault();

    const inputFieldEl = document.getElementById("inputField") as HTMLInputElement;
    const content = inputFieldEl.value;

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
      // Adding server response message in the chat
      addMessage(response.payload as Message);
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
