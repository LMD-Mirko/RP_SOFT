import React, { useState } from "react";
import {
  FaUserCheck,
  FaTasks,
  FaUserGraduate,
  FaClipboardList,
  FaComments,
  FaChartLine,
  FaQuestionCircle,
} from "react-icons/fa";
import { useGemini } from "../hooks/useGemini";

export default function LeftPanel() {
  const [activeButton, setActiveButton] = useState("Asistencia");
  const { setShowAgentIntegrator } = useGemini();

  const handleButtonClick = (text) => {
    setActiveButton(text);
    if (text === 'agente-integrador') {
      setShowAgentIntegrator(true);
    } else {
      setShowAgentIntegrator(false);
    }
  };

  const buttons = [
    { icon: <FaUserCheck />, text: "Asistencia" },
    { icon: <FaTasks />, text: "Gestión de tareas" },
    { icon: <FaUserGraduate />, text: "Selección de practicantes" },
    { icon: <FaClipboardList />, text: "Transcripción de sesiones" },
    { icon: <FaComments />, text: "agente-integrador" },
    { icon: <FaChartLine />, text: "Sistema de evaluación" },
  ];

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#000",
          color: "white",
          borderRadius: "12px",
          padding: "20px 30px",
          width: "150px",
          textAlign: "center",
          marginBottom: "12px",
        }}
      >
        <div style={{ fontSize: "28px", fontWeight: "700", letterSpacing: "1px" }}>RP</div>
        <div style={{ fontSize: "24px", fontWeight: "600" }}>SOFT</div>
      </div>

      <h4
        style={{
          color: "#555",
          fontSize: "13px",
          letterSpacing: "1px",
          marginBottom: "24px",
        }}
      >
        SISTEMA GENERAL DE RP_SOFT
      </h4>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {buttons.map((btn) => (
          <MenuButton
            key={btn.text}
            icon={btn.icon}
            text={btn.text}
            active={activeButton === btn.text}
            onClick={() => handleButtonClick(btn.text)}
          />
        ))}
      </div>

      <h5
        style={{
          marginTop: "20px",
          marginBottom: "10px",
          color: "#555",
          fontSize: "12px",
          fontWeight: "600",
          alignSelf: "flex-start",
        }}
      >
        Otros
      </h5>

      <MenuButton
        icon={<FaQuestionCircle />}
        text="Centro de Ayuda"
        active={activeButton === "Centro de Ayuda"}
        onClick={() => setActiveButton("Centro de Ayuda")}
      />

      <button
        style={{
          marginTop: "20px",
          backgroundColor: "#000",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "12px 0",
          width: "100%",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        REGRESAR
      </button>
    </div>
  );
}

function MenuButton({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: active ? "#000" : "white",
        color: active ? "white" : "#333",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        width: "100%",
        fontSize: "14px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        justifyContent: "flex-start",
        transition: "0.3s",
        cursor: "pointer",
      }}
      onMouseOver={(e) => {
        if (!active) e.target.style.backgroundColor = "#f5f5f5";
      }}
      onMouseOut={(e) => {
        if (!active) e.target.style.backgroundColor = "white";
      }}
    >
      <span style={{ color: active ? "white" : "#000", fontSize: "16px" }}>{icon}</span>
      {text}
    </button>
  );
}
