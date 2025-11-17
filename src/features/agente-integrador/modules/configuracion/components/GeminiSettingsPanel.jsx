import React from "react";
import { useGemini } from "../../../features/agente-integrador/context/GeminiContext";
import GeminiSettingsPanel from "../../modules/configuracion/components/GeminiSettingsPanel";


export default function GeminiSettingsPanel() {
  const { apiKey, setApiKey, model, setModel, temperature, setTemperature } = useGemini();

  return (
    <div style={{ padding: "20px" }}>
      <h3>⚙️ Configuración de Gemini</h3>
      <label>API Key:</label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <label>Modelo:</label>
      <select value={model} onChange={(e) => setModel(e.target.value)}>
        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
        <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
      </select>

      <label>Temperatura: {temperature}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={temperature}
        onChange={(e) => setTemperature(parseFloat(e.target.value))}
      />
    </div>
  );
}
