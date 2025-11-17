import { useState } from "react";

export default function useChatAI() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (text) => {
    const newMsg = { sender: "user", text };
    setMessages((prev) => [...prev, newMsg]);

    // Simulación de respuesta temporal
    setTimeout(() => {
      const botResponse = { sender: "bot", text: "🤖 Respuesta generada por la IA" };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  return { messages, sendMessage };
}