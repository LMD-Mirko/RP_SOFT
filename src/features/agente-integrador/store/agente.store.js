import { create } from "zustand";

export const useAgenteStore = create((set) => ({
  status: "idle",
  messages: [],
  setStatus: (status) => set({ status }),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
}));
