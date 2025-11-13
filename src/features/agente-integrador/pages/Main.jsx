import React from "react";
import LeftPanel from "../components/LeftPanel";
import { ChatPanel as Chat } from "@shared/components/ChatPanel";
import Sidebar from "../components/Sidebar";

export default function Main() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr 300px",
        height: "100vh",
        gap: "12px",
        padding: "12px",
        backgroundColor: "#f7f8fa",
      }}
    >
      <LeftPanel />
      <Chat />
      <Sidebar />
    </div>
  );
}
