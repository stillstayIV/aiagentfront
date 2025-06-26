import { useState } from "react";
import { apiService } from "@/lib/api";

interface DataEntryFormProps {
  onDataStored?: (id: string) => void;
}

export default function DataEntryForm({ onDataStored }: DataEntryFormProps) {
  const [content, setContent] = useState("");
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const id = await apiService.storeData(content, context);
      setResultId(id);

      // Clear the form after successful submission
      setContent("");
      setContext("");

      // Notify parent component that data has been stored
      if (onDataStored) {
        onDataStored(id);
      }
    } catch (err) {
      setError("Failed to store data. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-main">
        <div className="glass-purple shadow-2xl rounded-lg p-6 w-full max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Store New Data
          </h2>

          {resultId && (
            <div className="mb-4 p-4 bg-green-900 text-green-300 rounded border-2 border-green-500 shadow-lg animate-pulse">
              <p className="font-medium">✅ Success!</p>
              <p>
                Data stored successfully with ID:{" "}
                <span className="font-mono bg-green-800 px-2 py-1 rounded">
                  {resultId}
                </span>
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-300 rounded border border-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-dark w-full px-3 py-2"
                rows={5}
                placeholder="Enter content to store..."
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="context"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Context (optional)
              </label>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="input-dark w-full px-3 py-2"
                rows={3}
                placeholder="Enter additional context..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-gradient disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Data"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
