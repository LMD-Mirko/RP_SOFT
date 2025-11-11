import React, { useState, useEffect, useRef } from "react";
import ExcelJS from "exceljs";
import { useGemini } from "../context/GeminiContext";
import { SYSTEM_PROMPT } from "../config/prompt";
import { streamGeminiResponse } from "../services/geminiService";
import "./chat.css";

export default function Chat() {
  const { apiKey, model, temperature, history, setHistory } = useGemini();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("last_chat");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      appendMessage(
        "¡Hola! Soy tu agente IA 🤖. ¿En qué puedo ayudarte hoy?",
        "bot"
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("last_chat", JSON.stringify(messages));
  }, [messages]);

  const appendMessage = (text, who = "bot") => {
    setMessages((prev) => {
      const updated = [...prev, { text, who }];
      localStorage.setItem("last_chat", JSON.stringify(updated));
      return updated;
    });
  };

  const saveToHistory = (title = "Nueva conversación") => {
    const entry = {
      id: Date.now(),
      title,
      date: new Date().toLocaleString(),
      preview: messages[messages.length - 1]?.text?.slice(0, 50) || "",
      messages,
    };
    setHistory((prev) => {
      const updated = [...prev, entry];
      localStorage.setItem("chat_history", JSON.stringify(updated));
      return updated;
    });
  };

  const clearConversation = () => {
    if (window.confirm("¿Seguro que deseas eliminar esta conversación?")) {
      setMessages([]);
      localStorage.removeItem("last_chat");
    }
  };

  const analyzeFile = async (fileName, content) => {
    try {
      appendMessage(`🔍 Analizando archivo ${fileName}...`, "bot");
      appendMessage("...", "bot");

      await streamGeminiResponse(
        `Analiza el archivo ${fileName} y dame un resumen claro:\n${content}`,
        (partial) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.who === "bot") last.text += partial;
            else updated.push({ text: partial, who: "bot" });
            localStorage.setItem("last_chat", JSON.stringify(updated));
            return updated;
          });
        },
        () => {
          saveToHistory("Análisis de archivo con IA");
          setIsLoading(false);
        }
      );
    } catch (error) {
      appendMessage("❌ Error al analizar el archivo: " + error.message, "bot");
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    for (const file of files) {
      appendMessage(`📎 Archivo subido: ${file.name}`, "user");
      const ext = file.name.split(".").pop().toLowerCase();
      let content = "";

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          if (
            ["txt", "csv", "json", "md", "html", "xml", "js", "py"].includes(
              ext
            )
          ) {
            content = e.target.result;
          } else if (["xlsx", "xls"].includes(ext)) {
            const buffer = e.target.result;
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            const sheet = workbook.worksheets[0];
            const rows = [];
            sheet.eachRow({ includeEmpty: true }, (row) => {
              const cells = row.values
                .slice(1)
                .map((v) => (v == null ? "" : String(v)));
              rows.push(cells);
            });
            content = rows.map((r) => r.join(" | ")).join("\n");
          } else if (["pdf"].includes(ext)) {
            content = "📄 Archivo PDF subido (contenido no extraído).";
          } else {
            content = "⚠️ Tipo de archivo no soportado para análisis directo.";
          }

          await analyzeFile(file.name, content);
        } catch (error) {
          appendMessage("❌ Error al leer el archivo: " + error.message, "bot");
        }
      };

      if (["xlsx", "xls"].includes(ext)) reader.readAsArrayBuffer(file);
      else reader.readAsText(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      appendMessage("❌ Debes configurar tu API Key primero.", "bot");
      return;
    }

    const userMsg = input.trim();
    appendMessage(userMsg, "user");
    setInput("");
    setIsLoading(true);
    appendMessage("...", "bot");

    await streamGeminiResponse(
      input,
      (partial) => {
        setMessages((prev) => [...prev, { text: partial, who: "bot" }]);
      },
      () => {
        saveToHistory("Conversación con IA");
        setIsLoading(false);
      }
    );
  };

  const toggleFileMenu = () => setShowFileMenu(!showFileMenu);
  const handleOptionSelect = (type) => {
    document.getElementById(`file-upload-${type}`).click();
    setShowFileMenu(false);
  };

  const menuButtonStyle = {
    display: "block",
    width: "100%",
    padding: "8px 10px",
    textAlign: "left",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#333",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
<<<<<<< HEAD
        {messages.map((msg, i) => {
          const isLastBotMessage =
            msg.who === "bot" && i === messages.length - 1 && isLoading;

          const isUser = msg.who === "user";

          return (
=======
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.who === "user" ? "flex-end" : "flex-start",
            }}
          >
>>>>>>> b771374 (feat(chat): integración de Gemini API y ajustes de centrado visual)
            <div
              className={msg.who === "bot" && isLoading ? "typing-cursor" : ""}
              style={{
<<<<<<< HEAD
                width: "100%",
                marginBottom: "12px",
                display: "flex",
                justifyContent: isUser ? "flex-end" : "center",
                alignItems: "flex-start",
              }}
            >
              <div
                className={isLastBotMessage ? "typing-cursor" : ""}
                style={{
                  maxWidth: "80%",
                  minWidth: "120px",
                  padding: "12px 16px",
                  borderRadius: isUser ? "18px 18px 0 18px" : "18px",
                  backgroundColor: isUser ? "#000000ff" : "#f0f0f0",
                  color: isUser ? "white" : "#333",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {msg.text}
              </div>
=======
                maxWidth: "80%",
                padding: "12px 16px",
                borderRadius:
                  msg.who === "user" ? "18px 18px 0 18px" : "18px 18px 18px 0",
                backgroundColor: msg.who === "user" ? "#000" : "#f0f0f0",
                color: msg.who === "user" ? "#fff" : "#333",
              }}
            >
              {msg.text}
>>>>>>> b771374 (feat(chat): integración de Gemini API y ajustes de centrado visual)
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "820px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "40px",
          border: "1px solid #ddd",
          padding: "10px 16px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
          }}
        >
          <div style={{ position: "relative" }}>
            <button
              onClick={toggleFileMenu}
              style={{
                fontSize: "22px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#f5f5f5",
                border: "none",
                cursor: "pointer",
              }}
            >
              +
            </button>

            {showFileMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "45px",
                  left: 0,
                  background: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  padding: "10px",
                  zIndex: 10,
                  width: "190px",
                }}
              >
                <p
                  style={{
                    fontWeight: "600",
                    fontSize: "13px",
                    marginBottom: "8px",
                    color: "#444",
                  }}
                >
                  Selecciona el tipo de archivo:
                </p>

                <button
                  onClick={() => handleOptionSelect("text")}
                  style={menuButtonStyle}
                >
                  📄 Texto / CSV / JSON
                </button>
                <button
                  onClick={() => handleOptionSelect("excel")}
                  style={menuButtonStyle}
                >
                  📊 Excel (.xlsx)
                </button>
                <button
                  onClick={() => handleOptionSelect("pdf")}
                  style={menuButtonStyle}
                >
                  📘 PDF
                </button>
                <button
                  onClick={() => handleOptionSelect("otros")}
                  style={menuButtonStyle}
                >
                  🧩 Otros tipos
                </button>
              </div>
            )}
          </div>

          <input
            type="file"
            id="file-upload-text"
            accept=".txt,.csv,.json"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <input
            type="file"
            id="file-upload-excel"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <input
            type="file"
            id="file-upload-pdf"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <input
            type="file"
            id="file-upload-otros"
            accept=".docx,.pptx,.xml,.html,.md,.js,.py"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />

          <input
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "24px",
              border: "none",
              outline: "none",
              fontSize: "14px",
            }}
            placeholder="Pregunta lo que quieras..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            style={{
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: !apiKey || isLoading ? "not-allowed" : "pointer",
            }}
            onClick={handleSend}
            disabled={!apiKey || isLoading}
          >
            ➤
          </button>

          <button
            style={{
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
            }}
            onClick={clearConversation}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
