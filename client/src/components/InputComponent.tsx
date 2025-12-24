import CommunicationController from "../communication/CommunicationController";
import { useChat } from "../context/ChatContext";
import type { Message } from "../types/types";
import "./InputComponent.css";

const InputComponent = () => {
  const { currentSessionId, setMessages } = useChat();

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

    setMessages((prevMessages) => [optimisticMessage, ...prevMessages]);
    inputFieldEl.value = "";

    CommunicationController.sendRequest("POST", "/api/chat", { body: { content, sessionId: currentSessionId } }).then((response) => {
      console.log("Message sent response:", response);
    });
  }

  return (
    <form id="inputContainer" onSubmit={handleSendButtonClick}>
      <input type="text" name="" id="inputField" />
      <button type="submit">SEND</button>
    </form>
  );
};

export default InputComponent;
