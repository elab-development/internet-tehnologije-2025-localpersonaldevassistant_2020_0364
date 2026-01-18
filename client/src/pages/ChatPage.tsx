import Conversation from "../components/Conversation";
import InputComponent from "../components/InputComponent";
import Sessions from "../components/Sessions";
import { useChat } from "../context/ChatContext";
import "./ChatPage.css";

const ChatPage = () => {
  const { messages, currentSessionId, sessions } = useChat();

  const activeSession = sessions.find((s) => s.id === currentSessionId);

  return (
    <div id="chatPage">
      <div id="sidebar">
        <Sessions />
        <div>SETTINGS</div>
      </div>
      <div id="main">
        <div id="chatContainer">
          <div id="chatHeader">
            <h2>{activeSession?.title || "New Chat"}</h2>
          </div>
          <Conversation messages={messages} />
        </div>
        <InputComponent />
      </div>
    </div>
  );
};

export default ChatPage;
