import React from "react";
import { useGemini } from "../context/GeminiContext";

export default function ChatHistory() {
  const { history, setHistory } = useGemini();

  const handleSelectChat = (chat) => {
    localStorage.setItem("last_chat", JSON.stringify(chat.messages));
    window.location.reload();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta conversación?")) {
      const updated = history.filter((item) => item.id !== id);
      setHistory(updated);
      localStorage.setItem("chat_history", JSON.stringify(updated));
    }
  };

  return (
    <aside
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <h3 style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
        <span>🕑</span> Historial de Chats
      </h3>

      {history.length === 0 ? (
        <p style={{ fontSize: "13px", color: "#777" }}>Aún no hay conversaciones guardadas.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {history.map((h) => (
            <li
              key={h.id}
              style={{
                marginBottom: "10px",
                padding: "8px 10px",
                background: "#f8f9fb",
                borderRadius: "6px",
                cursor: "pointer",
                border: "1px solid #e5e5e5",
              }}
            >
              <div onClick={() => handleSelectChat(h)}>
                <strong>{h.title}</strong>
                <br />
                <small>{h.date}</small>
                <br />
                <small>{h.preview}</small>
              </div>
              <button
                onClick={() => handleDelete(h.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#d33",
                  fontSize: "12px",
                  marginTop: "4px",
                  cursor: "pointer",
                }}
              >
                🗑️ Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
