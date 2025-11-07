import React from "react";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

export default function ConfigPanel() {
  const { logout } = useAuth();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar title="👨‍💼 Panel del Administrador" onLogout={logout} />
        <div style={{ flex: 1, display: "flex", padding: "12px" }}>
          <Chat />
        </div>
      </div>
    </div>
  );
}
