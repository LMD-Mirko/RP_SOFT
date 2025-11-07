import { apiClient } from "./apiClient.js";

export const agenteService = {
  async getStatus() {
    return apiClient("/status");
  },
};
