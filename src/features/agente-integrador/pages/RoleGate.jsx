import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCheck,
  FaTasks,
  FaFileAlt,
  FaComments,
  FaListAlt,
  FaQuestionCircle,
} from "react-icons/fa";

export default function RoleGate() {
  const navigate = useNavigate();

  const buttons = [
    { label: "Asistencia", icon: <FaUserCheck />, path: "/asistencia" },
    { label: "Gestión de tareas", icon: <FaTasks />, path: "/tareas" },
    { label: "Selección de practicantes", icon: <FaFileAlt />, path: "/practicantes" },
    { label: "Transcripción de sesiones", icon: <FaComments />, path: "/sesiones" },
    { label: "Conversación y asistencias", icon: <FaComments />, path: "/conversacion" },
    { label: "Sistema de evaluación", icon: <FaListAlt />, path: "/evaluacion" },
  ];

  const handleSelect = (role) => {
    if (role === "admin") navigate("/admin");
    else navigate("/user");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f5f6f7",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <aside
        style={{
          width: "320px",
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px 20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "12px",
            padding: "20px 40px",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          <h2 style={{ margin: 0 }}>RP</h2>
          <h3 style={{ margin: 0 }}>SOFT</h3>
        </div>

        <h4
          style={{
            color: "#555",
            fontWeight: "bold",
            fontSize: "12px",
            letterSpacing: "1px",
            marginBottom: "20px",
          }}
        >
          SISTEMA GENERAL DE RP_SOFT
        </h4>

        <div style={{ width: "100%", maxWidth: "260px" }}>
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={() => alert(`🔗 Redirigiendo a ${btn.label}...`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px 15px",
                marginBottom: "10px",
                width: "100%",
                cursor: "pointer",
                fontSize: "14px",
                transition: "0.3s",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#000";
                e.target.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#fff";
                e.target.style.color = "#000";
              }}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "20px", width: "100%", maxWidth: "260px" }}>
          <h5 style={{ color: "#666", marginBottom: "8px" }}>Otros</h5>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px 15px",
              width: "100%",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <FaQuestionCircle /> Centro de Ayuda
          </button>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "20px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 0",
            width: "100%",
            maxWidth: "260px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          REGRESAR
        </button>
      </aside>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          ⚙️ <span style={{ fontWeight: "bold" }}>Sistema General</span> — Selecciona tu tipo de acceso
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => handleSelect("admin")}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              width: "200px",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            👨‍💼 Administrador
          </button>

          <button
            onClick={() => handleSelect("user")}
            style={{
              backgroundColor: "#0ea5a9",
              color: "#fff",
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              width: "200px",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            👤 Usuario
          </button>
        </div>
      </main>
    </div>
  );
}
