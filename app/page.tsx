"use client";

import { useState, useEffect } from "react";
import TextGenerationForm from "@/components/TextGenerationForm";
import Navbar from "@/components/Navbar";
import { Toaster, toast } from "react-hot-toast";
import { apiService } from "@/lib/api";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<{
    status: string;
    backend: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    // Check backend health on component mount
    const checkBackendHealth = async () => {
      try {
        const health = await apiService.checkHealth();
        setBackendStatus(health);

        if (health.status === "connected") {
          toast.success("Connected to Agentic RAG backend", { duration: 3000 });
        } else {
          toast.error("Backend disconnected - using mock responses", {
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Failed to check backend health:", error);
        toast.error("Failed to check backend status", { duration: 3000 });
      }
    };

    checkBackendHealth();
  }, []);

  const reconnectBackend = async () => {
    try {
      const health = await apiService.checkHealth();
      setBackendStatus(health);

      if (health.status === "connected") {
        toast.success("Reconnected to Agentic RAG backend");
      } else {
        toast.error("Still unable to connect to backend");
      }
    } catch (error) {
      console.error("Reconnection failed:", error);
      toast.error("Reconnection failed");
    }
  };

  return (
    <div className="layout-container">
      {/* Toast container */}
      <Toaster position="top-right" />

      <Navbar />

      <main className="main-content">
        <div className="content-wrapper">
          {/* Backend Status Indicator - Only show when disconnected */}
          {backendStatus && backendStatus.status !== "connected" && (
            <div className="fixed top-20 right-4 z-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-red-900 text-red-300 border border-red-700">
              <span>Backend: Disconnected</span>
              <button
                onClick={reconnectBackend}
                className="ml-2 px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-xs transition-colors"
                title="Try to reconnect"
              >
                Retry
              </button>
            </div>
          )}

          <TextGenerationForm />
        </div>
      </main>

      <footer className="glass-dark py-6 w-full footer-bottom">
        <div className="text-center text-purple-300 px-4 max-w-full">
          <p>AI Agent with Agentic RAG Backend © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
