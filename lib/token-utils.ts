import { encode } from 'gpt-tokenizer';
import type { ChatMessage } from './types';

// System prompt token count (approximate, will be added to total)
const SYSTEM_PROMPT_TOKENS = 100;
// Overhead per message (role, formatting, etc.)
const MESSAGE_OVERHEAD = 4;

/**
 * Count tokens in a text string
 */
export function countTokens(text: string): number {
  try {
    return encode(text).length;
  } catch (error) {
    // Fallback: rough estimation (1 token ≈ 4 characters)
    return Math.ceil(text.length / 4);
  }
}

/**
 * Count total tokens in a conversation including system prompt
 */
export function countMessageTokens(messages: ChatMessage[]): number {
  let total = SYSTEM_PROMPT_TOKENS; // System prompt overhead

  for (const message of messages) {
    total += countTokens(message.content);
    total += MESSAGE_OVERHEAD; // Role and formatting overhead
  }

  return total;
}

/**
 * Truncate messages to stay within token limit
 * Always preserves the most recent user message and works backwards
 */
export function truncateMessages(messages: ChatMessage[], maxTokens: number): ChatMessage[] {
  if (messages.length === 0) {
    return messages;
  }

  // Always keep the last message (current user message)
  const lastMessage = messages[messages.length - 1];
  const messagesToCheck = messages.slice(0, -1);

  // Start with just the last message and system prompt
  let currentTokens = SYSTEM_PROMPT_TOKENS + countTokens(lastMessage.content) + MESSAGE_OVERHEAD;
  const keptMessages: ChatMessage[] = [];

  // Work backwards from most recent to oldest, keeping as many as possible
  for (let i = messagesToCheck.length - 1; i >= 0; i--) {
    const message = messagesToCheck[i];
    const messageTokens = countTokens(message.content) + MESSAGE_OVERHEAD;

    if (currentTokens + messageTokens <= maxTokens) {
      currentTokens += messageTokens;
      keptMessages.unshift(message); // Add to beginning to maintain order
    } else {
      // Can't fit this message, stop here
      break;
    }
  }

  // Return kept messages + last message
  return [...keptMessages, lastMessage];
}

