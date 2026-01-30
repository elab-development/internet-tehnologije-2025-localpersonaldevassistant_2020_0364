import "./Sessions.css";
import SessionTile from "./SessionTile";
import { useChat } from "../context/ChatContext";

const Sessions = () => {
  const { sessions, startNewSession } = useChat(); // Destructure new function

  return (
    <div id="sessionsContainer">
      <button className="newChatBtn" onClick={startNewSession}>
        + NEW CHAT
      </button>

      <h3>CONVERSATIONS</h3>
      {sessions.map((session) => (
        <SessionTile key={session.id} id={session.id} title={session.title} />
      ))}
    </div>
  );
};

export default Sessions;
