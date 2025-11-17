import { apiClient } from "./apiClient.js";

export const chatService = {
  async sendMessage(message) {
    return apiClient("/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};
