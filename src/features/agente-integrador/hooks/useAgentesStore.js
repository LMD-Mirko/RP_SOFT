import { create } from "zustand";

export const useAgenteStore = create((set) => ({
  role: "guest",
  setRole: (role) => set({ role }),
  chatHistory: [],
  addMessage: (msg) => set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
}));
