import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { content, context } = await request.json();

    // Forward request to agentic RAG backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${backendUrl}/api/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, context }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (backendError) {
      console.error("Backend connection error:", backendError);

      // Fallback to mock response if backend is not available
      const id = Math.random().toString(36).substring(2, 15);

      console.log("Storing data (mock):", {
        content: content?.substring(0, 50),
        context,
      });

      return NextResponse.json({ id }, { status: 200 });
    }
  } catch (error) {
    console.error("Error storing data:", error);
    return NextResponse.json(
      { error: "Failed to store data" },
      { status: 500 }
    );
  }
}
