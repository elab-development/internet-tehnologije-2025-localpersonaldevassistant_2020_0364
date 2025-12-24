import Conversation from "../components/Conversation";
import InputComponent from "../components/InputComponent";
import Sessions from "../components/Sessions";
import { useChat } from "../context/ChatContext";
import "./ChatPage.css";

const ChatPage = () => {
  const { messages } = useChat();

  return (
    <div id="chatPage">
      <div id="sidebar">
        <Sessions />
        <div>SETTINGS</div>
      </div>
      <div id="main">
        <div id="chatContainer">
          <div id="chatHeader">HEADER OF CHAT</div>
          <Conversation messages={messages} />
        </div>
        <InputComponent />
      </div>
    </div>
  );
};

export default ChatPage;
