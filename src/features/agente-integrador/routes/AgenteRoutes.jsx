import React from "react";
import { Routes, Route } from "react-router-dom";
import RoleGate from "../pages/RoleGate";
import UserPanel from "../pages/UserPanel";
import ConfigPanel from "../pages/ConfigPanel";
import ModuleLoader from "../pages/ModuleLoader";

export default function AgenteRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleGate />} />
      <Route path="/user" element={<UserPanel />} />
      <Route path="/admin" element={<ConfigPanel />} />
      <Route path="/asistencia" element={<ModuleLoader title="Asistencia" />} />
    </Routes>
  );
}
