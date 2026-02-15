import { Link, useNavigate } from "react-router-dom";
import ChatHeader from "../components/ChatHeader";
import Conversation from "../components/Conversation";
import InputComponent from "../components/InputComponent";
import Sessions from "../components/Sessions";
import { useChat } from "../context/ChatContext";
import CommunicationController from "../communication/CommunicationController";
import { AuthUtil } from "../utils/AuthUtil";
import "./ChatPage.css";

const ChatPage = () => {
  const { messages, currentSessionId, sessions, refreshSessions } = useChat();
  const activeSession = sessions.find((s) => s.id === currentSessionId);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await CommunicationController.sendRequest("POST", "/api/logout", {});
    localStorage.removeItem("token");
    navigate("/login");
  };

  const username = AuthUtil.getUsername();
  const userInitial = username.charAt(0).toUpperCase();

  return (
    <div id="chatPage">
      <div id="sidebar">
        <Sessions />
        <div id="userProfileContainer">
          <Link to="/stats" className="userInfo" style={{ textDecoration: "none", cursor: "pointer" }}>
            <div className="avatarCircle">{userInitial}</div>
            <span className="userName" title={username}>
              {username}
            </span>
          </Link>
          <button id="logoutButton" onClick={handleLogout} title="Logout">
            LOGOUT
          </button>
        </div>
      </div>
      <div id="main">
        <div id="chatContainer">
          <ChatHeader key={currentSessionId} sessionId={currentSessionId} currentTitle={activeSession?.title || ""} onRename={refreshSessions} />
          <Conversation messages={messages} />
        </div>
        <InputComponent />
      </div>
    </div>
  );
};

export default ChatPage;
