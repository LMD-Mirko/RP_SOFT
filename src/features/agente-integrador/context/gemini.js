import { createContext, useContext, useState } from "react";

const GeminiContext = createContext();

export const GeminiProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");
  const [model, setModel] = useState("gemini-1.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("chat_history");
    return saved ? JSON.parse(saved) : [];
  });

  return (
    <GeminiContext.Provider
      value={{
        apiKey,
        setApiKey,
        model,
        setModel,
        temperature,
        setTemperature,
        history,
        setHistory,
      }}
    >
      {children}
    </GeminiContext.Provider>
  );
};

export const useGemini = () => useContext(GeminiContext);
