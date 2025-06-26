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

  useEffect(() => {
    // Load history from localStorage on component mount
    loadHistory();
  }, []);

  const loadHistory = () => {
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
    localStorage.removeItem("ai-agent-history");
  };

  const deleteHistoryItem = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem("ai-agent-history", JSON.stringify(newHistory));
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
    <div className="form-container max-w-7xl mx-auto">
      {/* History Sidebar */}
      <div className="form-sidebar w-history-sidebar glass-purple shadow-2xl rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-200 flex items-center">
            <FaHistory className="mr-2 text-purple-400" /> History
          </h3>
          {history.length > 0 && (
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

        {history.length === 0 ? (
          <div className="text-center py-8">
            <FaHistory className="mx-auto text-4xl text-purple-600 mb-2" />
            <p className="text-purple-300 text-sm">No history yet</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => loadHistoryItem(item)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                  selectedHistoryItem?.id === item.id
                    ? "glass-purple border-purple-400 shadow-lg"
                    : "glass-dark border-purple-700 hover:glass-purple hover:border-purple-500"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-purple-100 text-sm truncate">
                      {item.prompt.slice(0, 60)}
                      {item.prompt.length > 60 ? "..." : ""}
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
                    className="btn-delete-sm flex items-center justify-center ml-2"
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
      <div className="form-main glass-purple shadow-2xl rounded-lg p-6 flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4 text-purple-200 flex items-center">
          <FaRobot className="mr-2 text-purple-400" /> AI Text Generation
        </h2>

        {error && (
          <div className="mb-4 p-3 glass-dark border border-red-700 text-red-300 rounded">
            {error}
          </div>
        )}

        {generatedText && (
          <div className="flex-1 min-h-0 mb-2">
            {/* <h3 className="text-lg font-medium mb-2 text-purple-200">
              Generated Text:
            </h3> */}
            <div className="glass-dark border border-purple-700 p-4 rounded-md text-purple-100 whitespace-pre-wrap h-full overflow-y-auto scrollbar-hide">
              {generatedText}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex-1 flex items-center justify-center mb-2">
            <div className="text-center">
              <div className="text-purple-400 text-lg font-medium">
                Generating...
              </div>
              <div className="text-purple-300 text-sm mt-1">
                Please wait while AI processes your request
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col mt-auto">
          <div className="mb-2">
            <label
              htmlFor="prompt"
              className="block mb-1 text-sm font-medium text-purple-300"
            >
              {/* Prompt label removed */}
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!isLoading && prompt.trim()) {
                    const formEvent = {
                      preventDefault: () => {},
                    } as React.FormEvent;
                    handleSubmit(formEvent);
                  }
                }
              }}
              className="input-dark w-full px-3 py-2 resize-none"
              rows={3}
              placeholder="Enter your prompt for the AI... (Press Enter to generate, Shift+Enter for new line)"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
