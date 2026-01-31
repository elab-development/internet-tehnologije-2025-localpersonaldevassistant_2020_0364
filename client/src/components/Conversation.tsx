import { useEffect, useRef } from "react";
import type { Message } from "../types/types";
import MessageTile from "./MessageTile";
import "./Conversation.css";

type Props = {
  messages: Message[];
};

const Conversation = (props: Props) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [props.messages]);

  return (
    <div id="chatContent">
      <div ref={messagesEndRef} />

      {props.messages.map((message) => (
        <MessageTile key={message.id} {...message} />
      ))}
    </div>
  );
};

export default Conversation;
