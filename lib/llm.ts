import type { OpenAIRequest, OpenAIResponse } from './types';

const SYSTEM_PROMPT = `You are an AI assistant for Levrok Labs, an AI consulting company specializing in helping family-owned businesses implement AI solutions.

Contex:
  Founder: Pablo Leyva
  Get in Touch: Schedule a no-cost AI audit call with Pablo Leyva.
  Values: Giving an equal opportunity to all. One business at a time.
  Mission: To build intelligence for growing organizations.
  Vision: Allowing organizations to grow without limits with the power of Artificial Intelligence.

Answer in short sentences, use bullet points if more information is needed.
Do not be redundant, do not repeat the same information. Only say information once.
Format: If it is a simple and quick answer, write the response as a Markdown bullet list, with each item on a new line. Ensure that the bullet points are indented.
If it is a long answer, write 2-3 sentences, and bullet points if more information is needed. Use minimal Markdown. Only for headers and bullet points and italics if needed.`;

export async function getChatResponse(message: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const openAIRequest: OpenAIRequest = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: message,
      },
    ],
    max_tokens: 300,
    temperature: 0.7,
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(openAIRequest),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = (await response.json()) as OpenAIResponse;

  // Validate response structure
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response structure from OpenAI API');
  }

  return data.choices[0].message.content;
}

// Streaming version using Server-Sent Events
export async function getChatResponseStream(message: string): Promise<ReadableStream> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const openAIRequest = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: message,
      },
    ],
    max_tokens: 300,
    temperature: 0.7,
    stream: true, // Enable streaming
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(openAIRequest),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  // Transform OpenAI's stream to a clean SSE format
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            controller.close();
            break;
          }

          // Decode the chunk
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              // OpenAI sends [DONE] when stream is complete
              if (data === '[DONE]') {
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;

                if (content) {
                  // Send as SSE format
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch (e) {
                // Skip invalid JSON chunks
                console.error('Error parsing chunk:', e);
              }
            }
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

