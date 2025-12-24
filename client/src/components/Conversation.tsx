import type { Message } from "../types/types";

type Props = {
  messages: Message[];
};

const Conversation = (props: Props) => {
  return (
    <div id="chatContent">
      {props.messages.map((message) => (
        <div key={message.id}>{message.content}</div>
      ))}
    </div>
  );
};

export default Conversation;
