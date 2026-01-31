import { useState } from "react";
import "./Sessions.css";
import SessionTile from "./SessionTile";
import SnippetList from "./SnippetList";
import { useChat } from "../context/ChatContext";

const Sessions = () => {
  const { sessions, startNewSession } = useChat();
  const [activeTab, setActiveTab] = useState<"chats" | "snippets">("chats");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <button className="newChatBtn" onClick={startNewSession}>
        + NEW CHAT
      </button>

      <div className="tabContainer">
        <button className={`tabBtn ${activeTab === "chats" ? "active" : ""}`} onClick={() => setActiveTab("chats")}>
          CHATS
        </button>
        <button className={`tabBtn ${activeTab === "snippets" ? "active" : ""}`} onClick={() => setActiveTab("snippets")}>
          SNIPPETS
        </button>
      </div>

      <div id="sessionsContainer">
        {activeTab === "chats" ? (
          <>
            {sessions.map((session) => (
              <SessionTile key={session.id} id={session.id} title={session.title} />
            ))}
          </>
        ) : (
          <SnippetList />
        )}
      </div>
    </div>
  );
};

export default Sessions;
