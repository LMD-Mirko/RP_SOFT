import React from "react";
import { useGemini } from "../context/GeminiContext";
import AgentIntegrator from "./AgentIntegrator"; // Importa el nuevo componente

export default function ChatHistoryPanel() {
  const { history, setHistory, showAgentIntegrator } = useGemini();

  const handleClearAll = () => {
    if (window.confirm("¿Eliminar todo el historial de chats?")) {
      setHistory([]);
      localStorage.removeItem("chat_history");
    }
  };

  return (
    <aside className="card history-panel">
      {showAgentIntegrator ? (
        <AgentIntegrator />
      ) : (
        <>
          <h3>🕒 Historial de Chats</h3>
          {history.length === 0 ? (
            <p className="small">Aún no hay conversaciones guardadas.</p>
          ) : (
            <ul>
              {history.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.date}</span>
                  <p>{item.preview}...</p>
                </li>
              ))}
            </ul>
          )}
          {history.length > 0 && (
            <button className="secondary" onClick={handleClearAll}>
              Borrar todo
            </button>
          )}
        </>
      )}
    </aside>
  );
}
