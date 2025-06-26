import { useState, useEffect } from "react";
import { FaHistory, FaClock } from "react-icons/fa";

interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  timestamp: Date;
}

export default function HistoryForm() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    // Load history from localStorage on component mount
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
  }, []);

  const clearHistory = () => {
    setHistory([]);
    setSelectedItem(null);
    localStorage.removeItem("ai-agent-history");
  };

  const deleteItem = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem("ai-agent-history", JSON.stringify(newHistory));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString();
  };

  return (
    <div className="glass-purple shadow-2xl rounded-lg p-6 w-full max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-purple-200 flex items-center">
          <FaHistory className="mr-2 text-purple-400" /> Generation History
        </h2>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="btn-delete flex items-center text-sm"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <FaHistory className="mx-auto text-6xl text-purple-600 mb-4" />
          <p className="text-purple-200 text-lg">No generation history yet</p>
          <p className="text-purple-300 text-sm mt-2">
            Your text generations will appear here for easy reference
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* History List */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-purple-200 mb-3">
              Recent Generations ({history.length})
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-hide">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                    selectedItem?.id === item.id
                      ? "glass-purple border-purple-400 shadow-lg"
                      : "glass-dark border-purple-700 hover:glass-purple hover:border-purple-500"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-purple-100 text-sm truncate">
                        {item.prompt.slice(0, 80)}
                        {item.prompt.length > 80 ? "..." : ""}
                      </p>
                      <div className="flex items-center mt-1 text-purple-300 text-xs">
                        <FaClock className="mr-2" />
                        {formatTimestamp(item.timestamp)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                      className="btn-delete-sm flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4"
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
          </div>

          {/* Selected Item Details */}
          <div>
            {selectedItem ? (
              <div>
                <h3 className="text-lg font-medium text-purple-200 mb-3">
                  Generation Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-purple-300 mb-2">
                      Prompt:
                    </h4>
                    <div className="glass-dark border border-purple-700 p-3 rounded-md text-purple-100">
                      {selectedItem.prompt}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-purple-300 mb-2">
                      Generated Response:
                    </h4>
                    <div className="glass-dark border border-purple-700 p-3 rounded-md text-purple-100 whitespace-pre-wrap max-h-64 overflow-y-auto scrollbar-hide">
                      {selectedItem.response}
                    </div>
                  </div>
                  <div className="text-xs text-purple-400">
                    Generated on: {formatTimestamp(selectedItem.timestamp)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-purple-300">
                  Select an item from the history to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
