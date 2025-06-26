import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Define the data types
export interface AiData {
  id: string;
  content: string;
  context: string;
  timestamp: string;
}

// API functions
export const apiService = {
  // Store new data
  async storeData(content: string, context: string): Promise<string> {
    try {
      const response = await api.post("/api/data", { content, context });
      return response.data.id;
    } catch (error) {
      console.error("Error storing data:", error);
      throw error;
    }
  },

  // Search by similarity
  async searchSimilar(query: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await api.get("/api/search/similar", {
        params: { query, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching by similarity:", error);
      return [];
    }
  },

  // Search by text
  async searchByText(query: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await api.get("/api/search/text", {
        params: { query, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching by text:", error);
      return [];
    }
  },

  // Generate text using Typhoon
  async generateText(prompt: string): Promise<string> {
    try {
      const response = await api.post("/api/generate", { prompt });
      return response.data.text;
    } catch (error) {
      console.error("Error generating text:", error);
      throw error;
    }
  },
};

export default apiService;
