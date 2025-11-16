import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopBar({ title, onLogout }) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        backgroundColor: "#111",
        color: "white",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      <div>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginRight: "10px",
            backgroundColor: "#0ea5a9",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          🔁 Cambiar rol
        </button>
        <button
          onClick={onLogout}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </header>
  );
}
