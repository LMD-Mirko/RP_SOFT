import React, { useState } from "react";
import { useGemini } from "../context/GeminiContext";
import { ROLE_PROMPTS } from "../config/prompt";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  const { apiKey, setApiKey, model, setModel, temperature, setTemperature } = useGemini();

  const [role, setRole] = useState("asistente");
  const [customPrompt, setCustomPrompt] = useState(ROLE_PROMPTS[role]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isConnected = !!apiKey?.trim();

  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setCustomPrompt(ROLE_PROMPTS[newRole]);
  };

  return (
    <aside
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            backgroundColor: "#f0f0f0",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⚙️
        </span>
        Configuración IA
      </h3>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            fontSize: "13px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
            color: "#444",
          }}
        >
          🔑 API de Clave:
        </label>

        <input
          type="password"
          placeholder="Ingresa tu API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{
            width: "100%",
            height: "42px",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
            outline: "none",
            backgroundColor: "white",
            boxSizing: "border-box",
          }}
        />

        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            textAlign: "center",
            backgroundColor: "#328AFD",
            color: "white",
            borderRadius: "8px",
            padding: "10px 0",
            marginTop: "10px",
            fontWeight: "600",
            textDecoration: "none",
            transition: "background 0.3s",
          }}
        >
          🔗 Vincular con Google Géminis
        </a>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            fontSize: "13px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
            color: "#444",
          }}
        >
          🧠 Modelo:
        </label>
        <select
          style={{
            width: "100%",
            height: "42px",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
            backgroundColor: "white",
          }}
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="gemini-2.5-flash">Géminis 2.5 Flash</option>
          <option value="gemini-2.5-pro">Géminis 2.5 Pro</option>
          <option value="gemini-1.5-turbo">Géminis 1.5 Turbo</option>
        </select>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: "500",
            marginBottom: "6px",
            color: "#555",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>🔥</span> Temperatura:
          <span style={{ marginLeft: "auto", fontSize: "12px" }}>{temperature}</span>
        </div>
        <input
          style={{ width: "100%" }}
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
        />
      </div>

      <div style={{ marginBottom: "18px" }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: "500",
            marginBottom: "6px",
            color: "#555",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>🎭</span> Rol del agente:
        </div>
        <select
          style={{
            width: "100%",
            height: "42px",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
            backgroundColor: "white",
          }}
          value={role}
          onChange={handleRoleChange}
        >
          <option value="asistente">Asistente académico</option>
          <option value="analista">Analista de datos</option>
          <option value="tutor">Tutor motivacional</option>
        </select>
      </div>

      <div style={{ marginTop: "auto", paddingBottom: "20px", textAlign: "center" }}>
        <button
          style={{
            backgroundColor: isConnected ? "#328AFD" : "#bbb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 0",
            width: "100%",
            fontWeight: "600",
            fontSize: "14px",
            marginBottom: "10px",
            cursor: "default",
            transition: "0.3s",
          }}
        >
          {isConnected ? "Conectado ✅" : "Desconectado ⚠️"}
        </button>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            backgroundColor: "#f7f7f7",
            color: "#333",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px 0",
            width: "100%",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          {showAdvanced ? "Ocultar configuración avanzada" : "Modo avanzado 🧩"}
        </button>

        {showAdvanced && (
          <div style={{ marginTop: "14px", borderTop: "1px solid #ddd", paddingTop: "10px" }}>
            <label style={{ fontSize: "13px", fontWeight: "500" }}>🧠 Prompt personalizado:</label>
            <textarea
              rows="5"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "10px",
                marginTop: "6px",
                fontSize: "13px",
                resize: "none",
              }}
            />
            <small
              style={{
                display: "block",
                marginTop: "4px",
                fontSize: "11px",
                color: "#555",
              }}
            >
              Puedes modificar las instrucciones del agente en tiempo real.
            </small>
          </div>
        )}

        <hr style={{ margin: "16px 0", border: "1px solid #eee" }} />
        <h4
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#666",
            marginBottom: "8px",
          }}
        >
          SISTEMA GENERAL DE RP_SOFT
        </h4>

        <button className="system-btn" onClick={() => navigate("/blank")}>
          🧾 Asistencia
        </button>
        <button className="system-btn" onClick={() => navigate("/blank")}>
          🧠 Gestión de tareas
        </button>
        <button className="system-btn" onClick={() => navigate("/blank")}>
          👨‍💼 Selección de practicantes
        </button>
        <button className="system-btn" onClick={() => navigate("/blank")}>
          🗒️ Transcripción de sesiones
        </button>
        <button className="system-btn" onClick={() => navigate("/blank")}>
          💬 Conversación y asistencias
        </button>
        <button className="system-btn" onClick={() => navigate("/blank")}>
          📊 Sistema de evaluación
        </button>

        <h5
          style={{
            marginTop: "18px",
            fontSize: "12px",
            color: "#999",
            fontWeight: "600",
          }}
        >
          Otros
        </h5>

        <button className="system-btn" onClick={() => navigate("/blank")}>
          ❓ Centro de Ayuda
        </button>

        <button className="return-btn" onClick={() => navigate("/dashboard")} style={{ marginTop: "12px" }}>
          REGRESAR
        </button>
      </div>
    </aside>
  );
}
