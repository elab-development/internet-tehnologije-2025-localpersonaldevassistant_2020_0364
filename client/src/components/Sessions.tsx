import "./Sessions.css";
import SessionTile from "./SessionTile";
import { useChat } from "../context/ChatContext";

const Sessions = () => {
  const { sessions } = useChat();

  return (
    <div id="sessionsContainer">
      <h3>Sessions</h3>
      {sessions.map((session) => (
        <SessionTile key={session.id} id={session.id} title={session.title} />
      ))}
    </div>
  );
};

export default Sessions;
