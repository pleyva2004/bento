import { NextRequest, NextResponse } from 'next/server';
import { getChatResponse } from '@/lib/llm';
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

    const { message } = body;

    // Get AI response from OpenAI
    const aiMessage = await getChatResponse(message);

    const response: ChatResponse = { message: aiMessage };
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
    const errorResponse: ChatErrorResponse = { error: errorMessage };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

