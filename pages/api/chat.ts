import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  ChatResponse,
  ChatErrorResponse,
  OpenAIRequest,
  OpenAIResponse,
} from './types';
import { isChatRequest } from './types';

type ChatApiResponse = ChatResponse | ChatErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatApiResponse>
): Promise<void> {
  // Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Type validation
  if (!isChatRequest(req.body)) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const { message } = req.body;

  const system_prompt = `You are an AI assistant for Levrok Labs, an AI consulting company specializing in helping family-owned businesses implement AI solutions.
Answer in short sentences, use bullet points if more information is needed.
Do not be redundant, do not repeat the same information. Only say information once.
Format: If it is a simple and quick answer, write the response as a Markdown bullet list, with each item on a new line. Ensure that the bullet points are indented.
If it is a long answer, write 2-3 sentences, and bullet points if more information is needed. Use minimal Markdown. Only for headers and bullet points and italics if needed.`;

  try {
    const openAIRequest: OpenAIRequest = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: system_prompt,
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

    res.status(200).json({ message: data.choices[0].message.content });
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
    res.status(500).json({ error: errorMessage });
  }
}

