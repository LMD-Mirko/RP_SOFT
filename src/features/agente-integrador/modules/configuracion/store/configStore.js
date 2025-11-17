import { create } from "zustand";

export const useConfigStore = create((set) => ({
  apiKey: "",
  model: "gemini-2.0-flash",
  temperature: 0.7,
  setApiKey: (key) => set({ apiKey: key }),
  setModel: (model) => set({ model }),
  setTemperature: (t) => set({ temperature: t }),
}));
