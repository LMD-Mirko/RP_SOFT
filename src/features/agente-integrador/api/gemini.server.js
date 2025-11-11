import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt, topic } = req.body;
    const context = topic
      ? `Eres un experto en ${topic}. Responde de manera precisa.`
      : "Eres un asistente profesional.";

    const result = await model.generateContent(`${context}\n\nUsuario: ${prompt}`);
    const text = await result.response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("❌ Error con Gemini:", error);
    res.status(500).json({ error: "Error en el servidor de Gemini." });
  }
});

app.listen(5000, () => console.log("🚀 Servidor Gemini activo en http://localhost:5000"));
