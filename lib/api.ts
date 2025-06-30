import axios from "axios";

// Create an axios instance for internal API routes
const internalApi = axios.create({
  baseURL: "", // Use relative URLs for same-origin requests
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
  // Health check for backend connection
  async checkHealth(): Promise<{
    status: string;
    backend: string;
    timestamp: string;
  }> {
    try {
      const response = await internalApi.get("/api/health");
      return response.data;
    } catch (error: unknown) {
      console.error("Health check failed:", error);

      // If we get a 503, the health endpoint is working but backend is down
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 503
      ) {
        return error.response.data; // Return the structured error response
      }

      // For other errors, return a generic error response
      return {
        status: "error",
        backend: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Store new data
  async storeData(content: string, context: string): Promise<string> {
    try {
      const response = await internalApi.post("/api/data", {
        content,
        context,
      });
      return response.data.id;
    } catch (error) {
      console.error("Error storing data:", error);
      throw error;
    }
  },

  // Search by similarity
  async searchSimilar(query: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await internalApi.post("/api/search/similar", {
        query,
        limit,
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error("Error searching by similarity:", error);
      return [];
    }
  },

  // Search by text
  async searchByText(query: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await internalApi.post("/api/search/text", {
        query,
        limit,
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error("Error searching by text:", error);
      return [];
    }
  },

  // Generate text using Typhoon
  async generateText(prompt: string): Promise<string> {
    try {
      const response = await internalApi.post("/api/generate", { prompt });
      return response.data.text;
    } catch (error) {
      console.error("Error generating text:", error);
      throw error;
    }
  },
};

export default apiService;
