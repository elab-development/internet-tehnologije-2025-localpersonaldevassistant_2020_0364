import { useState } from "react";
import { useChat } from "../context/ChatContext";
import type { Mode, ModelProvider } from "../types/types";
import "./InputComponent.css";
import sendIcon from "../assets/send-icon.svg";

const InputComponent = () => {
  const { sendMessageStream } = useChat();

  const [selectedMode, setSelectedMode] = useState<Mode>("GENERATION");
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>("OLLAMA");
  const [inputValue, setInputValue] = useState("");

  function handleSendButtonClick(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessageStream(inputValue, selectedMode, selectedProvider);
    setInputValue("");
  }

  return (
    <div id="inputFormWrapper">
      <form id="inputForm" onSubmit={handleSendButtonClick}>
        <input
          type="text"
          id="inputField"
          placeholder="Ask something..."
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <div className="controlsContainer">
          <select
            className="configSelect"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as ModelProvider)}
            title="Select AI Model"
          >
            <option value="OLLAMA">Local (Qwen)</option>
            <option value="GROQ">Groq (Llama 3)</option>
            <option value="GOOGLE">Google (Gemini 2.5 Flash Lite)</option>
          </select>

          <select className="configSelect" value={selectedMode} onChange={(e) => setSelectedMode(e.target.value as Mode)} title="Select Interaction Mode">
            <option value="GENERATION">Generation</option>
            <option value="ANALYSIS">Analysis</option>
            <option value="DEBUG">Debug</option>
          </select>
        </div>

        <button type="submit">
          <img src={sendIcon} width="25" height="25" alt="Send" />
        </button>
      </form>
    </div>
  );
};

export default InputComponent;
