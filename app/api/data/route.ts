import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { content, context } = await request.json();

    // TODO: Implement actual data storage logic here
    // For now, just return a mock ID based on content length
    const id = Math.random().toString(36).substring(2, 15);

    console.log("Storing data:", {
      content: content?.substring(0, 50),
      context,
    });

    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error("Error storing data:", error);
    return NextResponse.json(
      { error: "Failed to store data" },
      { status: 500 }
    );
  }
}
