import { useState } from "react";
import CommunicationController from "../communication/CommunicationController";
import "./ChatHeader.css";

type Props = {
  sessionId: number | null;
  currentTitle: string;
  onRename: () => void;
};

const ChatHeader = ({ sessionId, currentTitle, onRename }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(currentTitle);

  const saveChanges = async () => {
    if (sessionId && title.trim() && title !== currentTitle) {
      await CommunicationController.sendRequest("PUT", `/api/chat/sessions/${sessionId}`, {
        body: { title },
      });
      onRename();
    }
    setIsEditing(false);
  };

  return (
    <div id="chatHeader">
      {isEditing ? (
        <input
          className="editTitleInput"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveChanges}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveChanges();
            if (e.key === "Escape") {
              setTitle(currentTitle);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <h2 className={sessionId ? "editable" : ""} onClick={() => sessionId && setIsEditing(true)} title={sessionId ? "Click to rename" : ""}>
          {currentTitle || "New Chat"}
        </h2>
      )}
    </div>
  );
};

export default ChatHeader;
