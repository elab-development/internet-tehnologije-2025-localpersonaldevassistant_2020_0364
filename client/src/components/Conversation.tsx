import type { Message } from "../types/types";
import MessageTile from "./MessageTile";
import "./Conversation.css";

type Props = {
  messages: Message[];
};

const Conversation = (props: Props) => {
  return (
    <div id="chatContent">
      {props.messages.map((message) => (
        <MessageTile key={message.id} {...message} />
      ))}
    </div>
  );
};

export default Conversation;
