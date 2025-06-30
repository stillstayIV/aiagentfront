import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${backendUrl}/api/agent/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Backend health check failed: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({
        status: "connected",
        backend: backendUrl,
        backendHealth: data,
        timestamp: new Date().toISOString(),
      });
    } catch (backendError) {
      console.error("Backend health check failed:", backendError);

      return NextResponse.json(
        {
          status: "disconnected",
          backend: backendUrl,
          error:
            backendError instanceof Error
              ? backendError.message
              : "Unknown error",
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
