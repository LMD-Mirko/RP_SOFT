import React from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function DashboardLayout({ children, title }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar title={title} />
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>{children}</div>
      </div>
    </div>
  );
}
