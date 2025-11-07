import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import RoleGate from "./features/agente-integrador/pages/RoleGate";
import UserPanel from "./features/agente-integrador/pages/UserPanel";
import ConfigPanel from "./features/agente-integrador/pages/ConfigPanel";
import ModuleLoader from "./features/agente-integrador/pages/ModuleLoader";
import SystemPanel from "./features/agente-integrador/pages/SystemPanel";

import { GeminiProvider } from "./features/agente-integrador/context/GeminiContext";
import { AuthProvider } from "./features/agente-integrador/context/AuthContext";

import "./features/agente-integrador/styles/app.css";
import "./features/agente-integrador/styles/chat.css";
import "./features/agente-integrador/styles/history.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("❌ ErrorBoundary atrapó un error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: "Inter, Arial, sans-serif" }}>
          <h2>⚠️ Se produjo un error al renderizar</h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f8fa", padding: 12, borderRadius: 8 }}>
            {String(this.state.error)}
          </pre>
          <p>Revisa la consola (F12 → Console) y confirma qué import falló.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <GeminiProvider>
        <Router>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<RoleGate />} />

              <Route path="/admin" element={<ConfigPanel />} />
              <Route path="/user" element={<UserPanel />} />


              <Route path="/sistema" element={<SystemPanel />} />
              <Route path="/asistencia" element={<ModuleLoader title="Asistencia" />} />
              <Route path="/tareas" element={<ModuleLoader title="Gestión de Tareas" />} />
              <Route path="/practicantes" element={<ModuleLoader title="Selección de Practicantes" />} />
              <Route path="/sesiones" element={<ModuleLoader title="Transcripción de Sesiones" />} />
              <Route path="/conversacion" element={<ModuleLoader title="Conversación y Asistencias" />} />
              <Route path="/evaluacion" element={<ModuleLoader title="Sistema de Evaluación" />} />
              <Route path="/ayuda" element={<ModuleLoader title="Centro de Ayuda" />} />

              <Route path="/debug" element={<div style={{padding:24}}>✅ Router y render OK</div>} />
            </Routes>
          </ErrorBoundary>
        </Router>
      </GeminiProvider>
    </AuthProvider>
  </React.StrictMode>
);
