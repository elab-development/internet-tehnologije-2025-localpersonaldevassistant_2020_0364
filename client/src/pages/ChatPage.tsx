import InputComponent from "../components/InputComponent";
import "./ChatPage.css";

const ChatPage = () => {
  return (
    <div id="chatPage">
      <div id="sidebar">
        <div>CHATS</div>
        <div>SETTINGS</div>
      </div>
      <div id="main">
        <div id="chatContainer">
          <div id="chatHeader">HEADER OF CHAT</div>
          <div id="chatContent">CHAT CONTENT</div>
        </div>
        <InputComponent />
      </div>
    </div>
  );
};

export default ChatPage;
