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
import "./systemPanel.css";

export default function SystemPanel() {
  const navigate = useNavigate();

  const buttons = [
    { label: "Asistencia", icon: <FaUserCheck />, path: "/asistencia" },
    { label: "Gestión de tareas", icon: <FaTasks />, path: "/tareas" },
    { label: "Selección de practicantes", icon: <FaFileAlt />, path: "/practicantes" },
    { label: "Transcripción de sesiones", icon: <FaComments />, path: "/sesiones" },
    { label: "Conversación y asistencias", icon: <FaComments />, path: "/conversacion" },
    { label: "Sistema de evaluación", icon: <FaListAlt />, path: "/evaluacion" },
  ];

  return (
    <div className="system-wrapper">
      <div className="logo-box">
        <h2>RP</h2>
        <h3>SOFT</h3>
      </div>

      <h4 className="system-title">SISTEMA GENERAL DE RP_SOFT</h4>

      <div className="system-buttons">
        {buttons.map((btn, i) => (
          <button
            key={i}
            className="system-btn"
            onClick={() => navigate(btn.path)}
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>

      <div className="system-others">
        <h5>Otros</h5>
        <button className="system-btn" onClick={() => navigate("/ayuda")}>
          <FaQuestionCircle /> Centro de Ayuda
          </button>
      </div>


      <button className="return-btn" onClick={() => window.location.href = "/"}>
        🔙 REGRESAR
      </button>
    </div>
  );
}
