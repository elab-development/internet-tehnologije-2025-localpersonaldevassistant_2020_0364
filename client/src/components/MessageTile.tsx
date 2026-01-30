import { useState } from "react";
import type { Message } from "../types/types";
import CommunicationController from "../communication/CommunicationController";
import "./MessageTile.css";
import ThumbUpIcon from "../assets/thumb-up.svg?react";
import ThumbDownIcon from "../assets/thumb-down.svg?react";
import SendIcon from "../assets/send-icon.svg";

const MessageTile = (message: Message) => {
  const [isPositive, setIsPositive] = useState<boolean | null>(message.feedback ? message.feedback.isPositive : null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState(message.feedback?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (positive: boolean) => {
    if (isPositive === positive) {
      setIsPositive(null);
      setShowCommentInput(false);
      return;
    }

    setIsPositive(positive);
    setShowCommentInput(true);
  };

  const submitFeedback = async () => {
    setIsSubmitting(true);
    await CommunicationController.sendRequest("POST", `/api/chat/${message.id}/feedback`, {
      body: { isPositive, comment },
    });
    setIsSubmitting(false);
    setShowCommentInput(false);
  };

  return (
    <div className={`messageRow ${message.senderType}`}>
      <div className={`messageBody ${message.senderType}`}>
        <p>{message.content}</p>

        {message.senderType === "LLM" && !message.isStreaming && message.id > 0 && (
          <div className="feedbackContainer">
            <div className="feedbackActions">
              <p className="feedbackQuestion">Was this response helpful?</p>
              <button className={`feedbackBtn ${isPositive === true ? "active like" : ""}`} onClick={() => handleRate(true)} title="Helpful">
                <ThumbUpIcon className="feedbackIcon" />
              </button>

              <button className={`feedbackBtn ${isPositive === false ? "active dislike" : ""}`} onClick={() => handleRate(false)} title="Not Helpful">
                <ThumbDownIcon className="feedbackIcon" />
              </button>
            </div>

            {showCommentInput && (
              <div className="feedbackInputWrapper">
                <input
                  type="text"
                  className="feedbackInput"
                  placeholder="Tell us more (optional)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitFeedback()}
                  autoFocus
                />
                <button className="feedbackSubmitBtn" onClick={submitFeedback} disabled={isSubmitting}>
                  {isSubmitting ? "..." : <img src={SendIcon} width="20" height="20" alt="Send" />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageTile;
