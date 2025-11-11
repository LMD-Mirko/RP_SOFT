import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function streamGeminiResponse(prompt, onPartial, onFinish) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Envía texto parcial al chat
    if (onPartial) onPartial(text);
    if (onFinish) onFinish();
  } catch (error) {
    console.error("❌ Error al comunicarse con Gemini:", error);
    if (onPartial)
      onPartial("⚠️ No se pudo obtener respuesta de Gemini. Revisa tu clave API o conexión.");
    if (onFinish) onFinish();
  }
}
