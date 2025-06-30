import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Forward request to agentic RAG backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${backendUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (backendError) {
      console.error("Backend connection error:", backendError);

      // Fallback to mock response if backend is not available
      const mockResponse = `AI Generated Response for: "${prompt}"
    
This is a simulated AI response that demonstrates text generation capabilities. In a real implementation, this would connect to an actual language model like OpenAI's GPT, Claude, or a local model.

Key points about your prompt:
• Your input was: "${prompt}"
• The AI would analyze the context and intent
• Generate relevant, coherent text based on the input
• Provide helpful and informative responses

This mock response shows how the interface would work with a real AI backend. The text generation feature could be used for:
- Creative writing assistance
- Code generation and explanation
- Question answering
- Content creation
- And much more!

Note: Backend at ${backendUrl} is not available, showing mock response.`;

      return NextResponse.json({ text: mockResponse });
    }
  } catch (error) {
    console.error("Error generating text:", error);
    return NextResponse.json(
      { error: "Failed to generate text" },
      { status: 500 }
    );
  }
}
