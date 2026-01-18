import type { Message } from "../types/types";
import "./MessageTile.css";

const MessageTile = (message: Message) => {
  return (
    <div className={`messageRow ${message.senderType}`}>
      <div className={`messageBody ${message.senderType}`}>
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default MessageTile;
