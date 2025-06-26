import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // TODO: Implement actual text search logic here
    // For now, just return mock results
    const mockResults = [
      `Text search result 1 for: "${query}"`,
      `Text search result 2 for: "${query}"`,
      `Text search result 3 for: "${query}"`,
    ];

    return NextResponse.json({ results: mockResults }, { status: 200 });
  } catch (error) {
    console.error("Error performing text search:", error);
    return NextResponse.json(
      { error: "Failed to perform text search" },
      { status: 500 }
    );
  }
}
