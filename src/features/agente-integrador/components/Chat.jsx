// Re-export shared ChatPanel to avoid duplication.
export { ChatPanel as default } from '@shared/components/ChatPanel';

  const prompts = {
    analista:
      SYSTEM_PROMPT +
      "\n💼 Eres un analista de datos. Resalta tendencias, correlaciones y conclusiones cuantitativas.",
    asistente:
      SYSTEM_PROMPT +
      "\n🎓 Eres un asistente académico. Explica temas con ejemplos educativos y lenguaje claro.",
    tutor:
      SYSTEM_PROMPT +
      "\n🌱 Eres un tutor motivacional. Usa un tono empático, positivo y humano.",
  };

  const finalPrompt = customPrompt || prompts[rolSeleccionado] || SYSTEM_PROMPT;

  const callGeminiAPI = async (promptText) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: promptText }] }],
            generationConfig: {
              temperature,
              topK: 32,
              topP: 1,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 404)
          throw new Error(
            "❌ Modelo no encontrado (404). Verifica el nombre del modelo."
          );
        if (response.status === 403)
          throw new Error("❌ API Key inválida o sin permisos (403).");
        throw new Error(`⚠️ Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ Sin respuesta de la IA."
      );
    } catch (error) {
      throw new Error("🚫 Error al conectar con la API: " + error.message);
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

    try {
      const aiText = await callGeminiAPI(userMsg);
      appendMessage(aiText, "bot");
      saveToHistory("Conversación con IA");
    } catch (error) {
      appendMessage(error.message, "bot");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    appendMessage(`📎 Has subido el archivo: ${file.name}`, "user");
    const ext = file.name.split(".").pop().toLowerCase();
    let content = "";

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        if (["txt", "csv", "json"].includes(ext)) {
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
        } else {
          appendMessage("⚠️ Tipo de archivo no compatible.", "bot");
          return;
        }

        await analyzeFile(file.name, content);
      } catch (error) {
        appendMessage("❌ Error al leer el archivo: " + error.message, "bot");
      }
    };

    if (["xlsx", "xls"].includes(ext)) reader.readAsArrayBuffer(file);
    else reader.readAsText(file);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxHeight: "100vh",
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
        {messages.map((msg, i) => {
          const isLastBotMessage =
            msg.who === "bot" && i === messages.length - 1 && isLoading;

          const isUser = msg.who === "user";

          return (
            <div
              key={i}
              style={{
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
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          borderTop: "1px solid #eee",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "#fff",
        }}
      >
        <input
          type="file"
          id="file-upload"
          accept=".txt,.csv,.json,.xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <label
          htmlFor="file-upload"
          style={{ cursor: "pointer", fontSize: "20px" }}
        >
          📎
        </label>

        <input
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "24px",
            border: "1px solid #ddd",
            fontSize: "14px",
            outline: "none",
          }}
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          style={{
            backgroundColor: "#000000ff",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: !apiKey || isLoading ? "not-allowed" : "pointer",
            opacity: !apiKey || isLoading ? 0.7 : 1,
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={clearConversation}
        >
          🗑️
        </button>
      </div>
    </div>
  );
;
