import { NextRequest, NextResponse } from 'next/server';
import { getChatResponse, getChatResponseStream } from '@/lib/llm';
import { isChatRequest } from '@/lib/types';
import type { ChatResponse, ChatErrorResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Type validation
    if (!isChatRequest(body)) {
      const errorResponse: ChatErrorResponse = { error: 'Message is required' };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Support both legacy single message and new conversation history
    const messageOrHistory = body.messages || body.message;

    if (!messageOrHistory) {
      const errorResponse: ChatErrorResponse = { error: 'Message or messages required' };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check if client wants streaming (via query param or header)
    const url = new URL(request.url);
    const wantsStream = url.searchParams.get('stream') === 'true';

    if (wantsStream) {
      // Return streaming response
      try {
        const stream = await getChatResponseStream(messageOrHistory);

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (streamError) {
        console.error('Streaming Error:', streamError);
        // Fallback to non-streaming if streaming fails
        const aiMessage = await getChatResponse(messageOrHistory);
        const response: ChatResponse = { message: aiMessage };
        return NextResponse.json(response, { status: 200 });
      }
    }

    // Non-streaming response (fallback)
    const aiMessage = await getChatResponse(messageOrHistory);
    const response: ChatResponse = { message: aiMessage };
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
    const errorResponse: ChatErrorResponse = { error: errorMessage };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

