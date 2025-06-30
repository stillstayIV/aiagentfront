import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query, limit } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Forward request to agentic RAG backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${backendUrl}/api/search/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, limit: limit || 5 }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (backendError) {
      console.error("Backend connection error:", backendError);

      // Fallback to mock response if backend is not available
      const mockResults = [
        `Text search result 1 for: "${query}" (mock - backend unavailable)`,
        `Text search result 2 for: "${query}" (mock - backend unavailable)`,
        `Text search result 3 for: "${query}" (mock - backend unavailable)`,
      ];

      return NextResponse.json({ results: mockResults }, { status: 200 });
    }
  } catch (error) {
    console.error("Error performing text search:", error);
    return NextResponse.json(
      { error: "Failed to perform text search" },
      { status: 500 }
    );
  }
}
