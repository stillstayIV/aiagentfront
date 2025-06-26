import { useState } from "react";
import { apiService } from "@/lib/api";
import { FaSearch } from "react-icons/fa";

interface SearchProps {
  type: "similarity" | "text";
}

export default function SearchForm({ type }: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Search query cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let searchResults: string[];

      if (type === "similarity") {
        searchResults = await apiService.searchSimilar(query);
      } else {
        searchResults = await apiService.searchByText(query);
      }

      setResults(searchResults);

      if (searchResults.length === 0) {
        setError("No results found for your query");
      }
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchTitle =
    type === "similarity" ? "Search by Similarity" : "Search by Text";
  const searchPlaceholder =
    type === "similarity"
      ? "      Enter search query to find semantically similar content..."
      : "      Enter keywords to find exact matches...";

  return (
    <div className="form-container">
      <div className="form-main">
        <div className="glass-purple shadow-2xl rounded-lg p-6 w-full max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-white">
            {searchTitle}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-300 rounded border border-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6 relative">
              <label
                htmlFor="query"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Search Query
              </label>
              <div className="relative">
                <input
                  id="query"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-dark w-full px-3 py-2 pl-10"
                  placeholder={searchPlaceholder}
                />
                <FaSearch className="absolute left-3 top-3 text-purple-400" />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-gradient disabled:opacity-50"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          {results.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 text-gray-300">
                Results
              </h3>
              <div className="scrollable-content scrollbar-hide max-h-96">
                <ul className="space-y-4">
                  {results.map((result, index) => (
                    <li key={index} className="py-4">
                      <p className="text-gray-200 bg-black bg-opacity-20 p-3 rounded-lg border border-purple-700 border-opacity-20">
                        {result}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
