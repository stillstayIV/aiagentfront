"use client";

import { useState } from "react";
import TextGenerationForm from "@/components/TextGenerationForm";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <div className="layout-container">
      {/* Toast container */}
      <Toaster position="top-right" />

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main-content">
        <div className="content-wrapper">
          <TextGenerationForm />
        </div>
      </main>

      <footer className="glass-dark py-6 w-full footer-bottom">
        <div className="text-center text-purple-300 px-4 max-w-full">
          <p>
            AI Agent with Weaviate Cloud Integration ©{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
