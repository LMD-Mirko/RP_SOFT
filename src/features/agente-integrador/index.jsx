import React from "react";
import { Routes, Route } from "react-router-dom";
import RoleGate from "./pages/RoleGate";
import UserPanel from "./pages/UserPanel";
import ConfigPanel from "./pages/ConfigPanel";
import SystemPanel from "./pages/SystemPanel";
import ModuleLoader from "./pages/ModuleLoader";

export function AgenteIntegradorIndex() {
  return (
    <Routes>
      <Route path="/" element={<RoleGate />} />
      <Route path="/user" element={<UserPanel />} />
      <Route path="/admin" element={<ConfigPanel />} />
      <Route path="/sistema" element={<SystemPanel />} />
      <Route path="/modulo" element={<ModuleLoader />} />
    </Routes>
  );
}