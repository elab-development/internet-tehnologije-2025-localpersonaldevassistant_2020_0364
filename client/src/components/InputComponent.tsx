import { useChat } from "../context/ChatContext";
import type { Mode } from "../types/types";
import "./InputComponent.css";

const InputComponent = () => {
  const { sendMessageStream } = useChat();

  function handleSendButtonClick(e: React.FormEvent) {
    e.preventDefault();

    const inputFieldEl = document.getElementById("inputField") as HTMLInputElement;
    const content = inputFieldEl.value;

    if (!content.trim()) return;

    const modeSelectEl = document.getElementById("modeSelect") as HTMLSelectElement;
    const mode = (modeSelectEl.value as Mode) || "GENERATION";

    sendMessageStream(content, mode);

    inputFieldEl.value = "";
  }

  return (
    <div id="inputFormWrapper">
      <form id="inputForm" onSubmit={handleSendButtonClick}>
        <input type="text" name="" id="inputField" placeholder="Ask something..." autoComplete="off" />
        <select id="modeSelect">
          <option value="GENERATION">Generation</option>
          <option value="ANALYSIS">Analysis</option>
          <option value="DEBUG">Debug</option>
        </select>
        <button type="submit">SEND</button>
      </form>
    </div>
  );
};

export default InputComponent;
