import React from "react";
import { Routes, Route } from "react-router-dom";
import RoleGate from "./pages/RoleGate";
import UserPanel from "./pages/UserPanel";
import ConfigPanel from "./pages/ConfigPanel";
import SystemPanel from "./pages/SystemPanel";
import ModuleLoader from "./pages/ModuleLoader";

export default function App() {
  return (
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
    </Routes>
  );
}
