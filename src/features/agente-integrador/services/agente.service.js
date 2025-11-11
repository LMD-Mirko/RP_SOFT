// src/features/agente-integrador/services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function sendPromptToGemini(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Error al comunicarse con Gemini:", err);
    return "⚠️ No se pudo obtener respuesta de Gemini.";
  }
}

// ✨ NUEVO: Streaming palabra por palabra
export async function streamGeminiResponse(prompt, onDataChunk, onFinish) {
  try {
    const streamResult = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    });

    for await (const chunk of streamResult.stream) {
      const chunkText = chunk.text();
      if (chunkText) onDataChunk(chunkText);
    }

    if (onFinish) onFinish();
  } catch (err) {
    console.error("Error en streamGeminiResponse:", err);
    onDataChunk("⚠️ Error al conectar con la API.");
    if (onFinish) onFinish();
  }
}
