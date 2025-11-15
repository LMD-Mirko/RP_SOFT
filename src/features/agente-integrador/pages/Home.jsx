import React from "react";
import Header from "../components/Header";
import Chat from "@shared/components/ChatPanel";
import ChatHistoryPanel from "../components/ChatHistoryPanel";
import Sidebar from "../components/Sidebar";
import "../styles/chat.css";
import "../styles/history.css";

export default function Home() {
  return (
    <div className="app-wrapper">
      <Header />
      <div className="main-grid">
        <ChatHistoryPanel />
        <Chat />
        <Sidebar />
      </div>
      <footer className="footer">
        Desarrollado por <span className="hint">Géminis IA</span> — Analiza y comprende tus archivos
      </footer>
    </div>
  );
}
