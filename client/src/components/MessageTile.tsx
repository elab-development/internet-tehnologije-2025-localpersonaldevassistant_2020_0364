import { useState } from "react";
import type { Message } from "../types/types";
import CommunicationController from "../communication/CommunicationController";
import "./MessageTile.css";
import ThumbUpIcon from "../assets/thumb-up.svg?react";
import ThumbDownIcon from "../assets/thumb-down.svg?react";
import SendIcon from "../assets/send-icon.svg";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import { StarFillIcon, StarIcon } from "../assets/StarIcons";
import { useChat } from "../context/ChatContext";

const MessageTile = (message: Message) => {
  const { snippets, addSnippet, removeSnippet } = useChat();

  const [isPositive, setIsPositive] = useState<boolean | null>(message.feedback ? message.feedback.isPositive : null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState(message.feedback?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    const button = e.currentTarget as HTMLButtonElement;
    button.innerText = "Copied!";
    setTimeout(() => {
      button.innerText = "Copy";
    }, 2000);
    navigator.clipboard.writeText(code);
  };

  const handleToggleSnippet = async (code: string, language: string) => {
    const existingSnippet = snippets.find((s) => s.code.trim() === code.trim());

    if (existingSnippet) {
      await removeSnippet(existingSnippet.id);
    } else {
      await addSnippet(code, language);
    }
  };

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
        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // eslint-disable-next-line
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                const codeString = String(children).replace(/\n$/, "");
                const isSaved = !inline && snippets.some((s) => s.code.trim() === codeString.trim());

                return !inline && match ? (
                  <div className="codeBlockWrapper">
                    <div className="codeBlockHeader">
                      <span>{match[1]}</span>
                      <div className="codeBlockActions">
                        <button
                          onClick={() => handleToggleSnippet(codeString, match[1])}
                          title={isSaved ? "Remove from Snippets" : "Save Snippet"}
                          className={isSaved ? "active" : "inactive"}
                        >
                          {isSaved ? <StarFillIcon style={{ color: "var(--primary)" }} /> : <StarIcon />}
                        </button>
                        <button onClick={(e) => handleCopyCode(codeString, e)}>Copy</button>
                      </div>
                    </div>
                    <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" children={codeString} {...props} />
                  </div>
                ) : (
                  <code className="inlineCode" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {message.senderType === "LLM" && !message.isStreaming && (
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
