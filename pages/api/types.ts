// Chat API Types
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  message: string;
}

export interface ChatErrorResponse {
  error: string;
}

// OpenAI API Types
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens: number;
  temperature: number;
}

export interface OpenAIChoice {
  message: {
    content: string;
    role: string;
  };
  finish_reason: string;
  index: number;
}

export interface OpenAIResponse {
  choices: OpenAIChoice[];
  created: number;
  id: string;
  model: string;
  object: string;
}

// Schedule Meeting API Types
export interface ScheduleMeetingRequest {
  selectedDate: string;
  selectedTime: string;
  name: string;
  email: string;
  companyName: string;
  companyNiche: string;
}

export interface ScheduleMeetingResponse {
  message: string;
  meetingId: string;
}

export interface ScheduleMeetingErrorResponse {
  message: string;
}

// Email Helper Types
export interface EmailParams {
  to: string;
  name: string;
  companyName: string;
  meetingDate: Date;
  meetingTime: string;
}

export interface NotificationParams {
  name: string;
  email: string;
  companyName: string;
  companyNiche: string;
  meetingDate: Date;
  meetingTime: string;
}

// Type Guards
export function isChatRequest(body: any): body is ChatRequest {
  return body && typeof body.message === 'string';
}

export function isScheduleMeetingRequest(body: any): body is ScheduleMeetingRequest {
  return (
    body &&
    typeof body.selectedDate === 'string' &&
    typeof body.selectedTime === 'string' &&
    typeof body.name === 'string' &&
    typeof body.email === 'string' &&
    typeof body.companyName === 'string' &&
    typeof body.companyNiche === 'string'
  );
}

