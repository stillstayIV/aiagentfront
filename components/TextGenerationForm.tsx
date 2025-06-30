import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { FaRobot, FaHistory, FaClock } from "react-icons/fa";

interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  timestamp: Date;
}

export default function TextGenerationForm() {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<HistoryItem | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag to prevent hydration mismatch
    setIsClient(true);
    // Load history from localStorage on component mount
    loadHistory();
  }, []);

  const loadHistory = () => {
    if (typeof window === "undefined") return; // Skip on server-side

    const savedHistory = localStorage.getItem("ai-agent-history");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map(
          (item: {
            id: string;
            prompt: string;
            response: string;
            timestamp: string;
          }) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })
        );
        setHistory(parsedHistory);
      } catch (error) {
        console.error("Error loading history:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Prompt cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setGeneratedText(null);
      const text = await apiService.generateText(prompt);
      setGeneratedText(text);

      // Save to history
      const historyItem = {
        id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        prompt: prompt.trim(),
        response: text,
        timestamp: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        const existingHistory = localStorage.getItem("ai-agent-history");
        const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
        historyArray.unshift(historyItem); // Add to beginning of array

        // Keep only last 50 items
        if (historyArray.length > 50) {
          historyArray.splice(50);
        }

        localStorage.setItem("ai-agent-history", JSON.stringify(historyArray));

        // Reload history to update the sidebar
        loadHistory();
      }

      // Clear the prompt after successful generation
      setPrompt("");
    } catch (err) {
      setError("Failed to generate text. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setSelectedHistoryItem(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("ai-agent-history");
    }
  };

  const deleteHistoryItem = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id);
    setHistory(newHistory);
    if (typeof window !== "undefined") {
      localStorage.setItem("ai-agent-history", JSON.stringify(newHistory));
    }
    if (selectedHistoryItem?.id === id) {
      setSelectedHistoryItem(null);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString();
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setGeneratedText(item.response);
    setSelectedHistoryItem(item);
  };

  return (
    <div className="form-container">
      {/* History Sidebar */}
      <div className="form-sidebar glass-purple shadow-2xl rounded-lg p-3">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h3 className="text-lg font-semibold text-purple-200 flex items-center">
            <FaHistory className="mr-2 text-purple-400" /> History
          </h3>
          {isClient && history.length > 0 && (
            <button
              onClick={clearHistory}
              className="btn-delete-sm flex items-center justify-center"
              title="Clear all history"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          )}
        </div>

        {!isClient || history.length === 0 ? (
          <div className="text-center py-6 flex-shrink-0">
            <FaHistory className="mx-auto text-3xl text-purple-600 mb-2" />
            <p className="text-purple-300 text-sm">
              {!isClient ? "Loading..." : "No history yet"}
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-2 no-scrollbar min-h-0 overflow-y-auto history-scroll">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => loadHistoryItem(item)}
                className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedHistoryItem?.id === item.id
                    ? "glass-purple shadow-lg"
                    : "glass-dark hover:glass-purple"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-purple-100 text-xs truncate">
                      {item.prompt.slice(0, 50)}
                      {item.prompt.length > 50 ? "..." : ""}
                    </p>
                    <div className="flex items-center mt-1 text-purple-300 text-xs">
                      <FaClock className="mr-1" />
                      {formatTimestamp(item.timestamp)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHistoryItem(item.id);
                    }}
                    className="btn-delete-sm flex items-center justify-center ml-1"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Text Generation Form */}
      <div className="form-main glass-purple shadow-2xl rounded-lg p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-3 text-purple-200 flex items-center">
          <FaRobot className="mr-2 text-purple-400" /> AI Text Generation
        </h2>

        {error && (
          <div className="mb-3 p-3 glass-dark border border-red-700 text-red-300 rounded">
            {error}
          </div>
        )}

        {/* Content Display Area */}
        {!generatedText && !isLoading && (
          <div className="mb-4 flex flex-col flex-1 content-display">
            <div className="glass-dark p-4 rounded-md text-purple-300 flex items-center justify-center flex-1">
              <div className="text-center">
                <FaRobot className="mx-auto text-4xl text-purple-600 mb-4" />
                <p className="text-lg mb-2">
                  พิมพ์คำถามและกด Enter เพื่อเริ่มสร้างข้อความ
                </p>
                <p className="text-sm text-purple-400">
                  AI จะตอบคำถามและแสดงผลแบบเต็มที่นี่
                </p>
              </div>
            </div>
          </div>
        )}

        {generatedText && (
          <div className="mb-4 flex flex-col flex-1 content-display">
            <div
              className="glass-dark p-4 rounded-md text-purple-100 whitespace-pre-wrap generated-text-area scroll-smooth-hidden text-wrap-balance"
              style={{
                maxHeight: "calc(100vh - 450px)",
                minHeight: "200px",
              }}
            >
              {generatedText}
              {/* Debug info */}
              <div className="text-xs text-purple-400 mt-4 pt-3 border-t border-purple-700 border-opacity-20">
                ความยาว: {generatedText.length} ตัวอักษร | เวลา:{" "}
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div
            className="mb-4 flex items-center justify-center flex-1"
            style={{ minHeight: "400px" }}
          >
            <div className="text-center">
              <div className="text-purple-400 text-xl font-medium flex items-center justify-center gap-3 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                กำลังสร้างคำตอบ...
              </div>
              <div className="text-purple-300 text-sm">
                💡 กด{" "}
                <kbd className="px-2 py-1 bg-purple-800 rounded text-xs">
                  Enter
                </kbd>{" "}
                เพื่อส่งคำถาม หรือ{" "}
                <kbd className="px-2 py-1 bg-purple-800 rounded text-xs">
                  Shift+Enter
                </kbd>{" "}
                เพื่อขึ้นบรรทัดใหม่
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-shrink-0 mt-auto pt-3">
          <div className="mb-2">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!isLoading && prompt.trim()) {
                    // Create a synthetic form event for submission
                    const syntheticEvent = {
                      preventDefault: () => {},
                      target: e.target,
                    } as React.FormEvent<HTMLFormElement>;
                    handleSubmit(syntheticEvent);
                  }
                }
                // Allow Shift+Enter for new line (default behavior)
              }}
              className="w-full px-4 py-3 bg-black bg-opacity-60 border border-purple-600 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 resize-y min-h-24 max-h-32 no-scrollbar textarea-no-wrap"
              style={{
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                lineHeight: "1.5",
              }}
              rows={3}
              placeholder="พิมพ์คำถามของคุณที่นี่..."
              disabled={isLoading}
            />
            <div className="text-xs text-purple-400 mt-1 flex items-center gap-1">
              <span>💡</span>
              <span>
                กด{" "}
                <kbd className="px-1 py-0.5 bg-purple-800 rounded text-xs">
                  Enter
                </kbd>{" "}
                เพื่อส่ง หรือ{" "}
                <kbd className="px-1 py-0.5 bg-purple-800 rounded text-xs">
                  Shift+Enter
                </kbd>{" "}
                เพื่อขึ้นบรรทัดใหม่
              </span>
            </div>
            {/* Hidden submit button for form submission */}
            <button
              type="submit"
              className="hidden"
              disabled={isLoading || !prompt.trim()}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
