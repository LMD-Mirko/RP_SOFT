  import React, { useState } from "react";
  import * as XLSX from "xlsx";
  import { useGemini } from "../context/GeminiContext";

  export default function FileUploader() {
    const { apiKey, model, temperature } = useGemini();
    const [fileName, setFileName] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setFileName(file.name);
      const ext = file.name.split(".").pop().toLowerCase();

      if (["txt", "csv", "json"].includes(ext)) {
        const reader = new FileReader();
        reader.onload = (event) => analyzeFile(event.target.result);
        reader.readAsText(file);
      } else if (["xlsx", "xls"].includes(ext)) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
          });
          const text = worksheet
            .map((row) => row.join(" | "))
            .join("\n");
          analyzeFile(text);
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert("⚠️ Solo se admiten archivos .txt, .csv, .json, .xlsx o .xls");
      }
    };

    const analyzeFile = async (content) => {
      if (!apiKey) {
        alert("Debes configurar tu API Key en la barra lateral.");
        return;
      }

      setIsLoading(true);
      setResponse("");

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `Analiza el contenido del siguiente archivo (${fileName}) y brinda un resumen general, observaciones y conclusiones:`,
                    },
                    { text: content },
                  ],
                },
              ],
              generationConfig: {
                temperature,
                topK: 32,
                topP: 1,
                maxOutputTokens: 2048,
              },
            }),
          }
        );

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || "Error al conectar con la API");
        }

        const data = await res.json();
        const aiText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "⚠️ No se obtuvo análisis.";
        setResponse(aiText);
      } catch (e) {
        setResponse("❌ Error: " + e.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="card uploader">
        <h3>📂 Analizador de Archivos</h3>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".txt,.csv,.json,.xlsx,.xls"
        />
        {fileName && <p><strong>Archivo:</strong> {fileName}</p>}
        {isLoading && <p>⏳ Analizando...</p>}
        {response && (
          <div className="analysis">
            <h4>🧠 Resultado del análisis:</h4>
            <p>{response}</p>
          </div>
        )}
      </div>
    );
  }
