import type { OpenAIRequest, OpenAIResponse } from './types';

const SYSTEM_PROMPT = `You are an AI assistant for Levrok Labs, an AI consulting company specializing in helping family-owned businesses implement AI solutions.
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

