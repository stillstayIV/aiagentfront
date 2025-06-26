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

    // Simulate AI text generation with a delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock AI-generated response
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
- And much more!`;

    return NextResponse.json({ text: mockResponse });
  } catch (error) {
    console.error("Error generating text:", error);
    return NextResponse.json(
      { error: "Failed to generate text" },
      { status: 500 }
    );
  }
}
