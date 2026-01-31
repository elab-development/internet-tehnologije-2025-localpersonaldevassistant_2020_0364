import React from "react";
import "./SnippetList.css";
import { useChat } from "../context/ChatContext";

const SnippetList = () => {
  const { snippets, removeSnippet } = useChat();

  const deleteSnippetHandler = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("Remove this snippet?")) return;
    await removeSnippet(id);
  };

  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div id="snippetList">
      {snippets.length === 0 && (
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", marginTop: "20px" }}>No saved snippets yet.</p>
      )}
      {snippets.map((s) => (
        <div key={s.id} className="snippetItem" onClick={() => copySnippet(s.code)} title="Click to Copy">
          <div className="snippetHeader">
            <span className="snippetLang">{s.language}</span>
            <button className="deleteSnippetBtn" onClick={(e) => deleteSnippetHandler(e, s.id)}>
              ×
            </button>
          </div>
          <div className="snippetTitle">{s.title}</div>
        </div>
      ))}
    </div>
  );
};

export default SnippetList;
