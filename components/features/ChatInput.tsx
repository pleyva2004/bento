'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { countMessageTokens, truncateMessages } from '@/lib/token-utils';
import type { ChatMessage } from '@/lib/types';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [customHeight, setCustomHeight] = useState(384); // 24rem = 384px
  const [isDragging, setIsDragging] = useState(false);
  const ORIGINAL_HEIGHT = 384; // Add this constant
  const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null);
  const [useStreaming, setUseStreaming] = useState(true); // Try streaming first
  const [tokenCount, setTokenCount] = useState(0);
  const TOKEN_LIMIT = 3800; // Leave room for response generation

  // Handle vertical drag to resize height - UPDATED for mobile support
  useEffect(() => {
    const handleMove = (clientY: number) => {
      if (isDragging) {
        const newHeight = Math.max(ORIGINAL_HEIGHT, window.innerHeight - clientY); // Use original height as floor
        setCustomHeight(newHeight);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling
      handleMove(e.touches[0].clientY);
    };

    const handleEnd = () => {
      setIsDragging(false);
      // Re-enable text selection - Enhanced for mobile
      document.body.style.userSelect = '';
      (document.body.style as any).webkitUserSelect = '';
      (document.body.style as any).webkitTouchCallout = '';
      (document.body.style as any).webkitTapHighlightColor = '';
      document.onselectstart = null;
    };

    if (isDragging) {
      // Disable text selection during drag - Enhanced for mobile
      document.body.style.userSelect = 'none';
      (document.body.style as any).webkitUserSelect = 'none';
      (document.body.style as any).webkitTouchCallout = 'none';
      (document.body.style as any).webkitTapHighlightColor = 'transparent';
      document.onselectstart = () => false;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
      // Ensure text selection is re-enabled on cleanup - Enhanced for mobile
      document.body.style.userSelect = '';
      (document.body.style as any).webkitUserSelect = '';
      (document.body.style as any).webkitTouchCallout = '';
      (document.body.style as any).webkitTapHighlightColor = '';
      document.onselectstart = null;
    };
  }, [isDragging]);


  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  // Count tokens whenever messages change
  useEffect(() => {
    if (messages.length === 0) {
      setTokenCount(0);
      return;
    }

    // Convert messages to ChatMessage format for token counting
    const chatMessages: ChatMessage[] = messages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text
    }));

    const count = countMessageTokens(chatMessages);
    setTokenCount(count);
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now(),
        text: message.trim(),
        isUser: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      const userMessageText = message.trim();
      setMessage('');
      setIsLoading(true);

      // Build conversation history for API (include current messages + new message)
      let conversationHistory: ChatMessage[] = [
        ...messages.map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.text
        })),
        {
          role: 'user' as const,
          content: userMessageText
        }
      ];

      // Check if we need to truncate messages to stay within token limit
      const currentTokenCount = countMessageTokens(conversationHistory);
      if (currentTokenCount > TOKEN_LIMIT) {
        // Truncate messages, keeping the most recent ones
        conversationHistory = truncateMessages(conversationHistory, TOKEN_LIMIT);

        // Update messages state to match truncated history (remove old messages)
        // Match truncated ChatMessages back to original Message objects to preserve IDs/timestamps
        const allMessagesWithNew = [...messages, userMessage];
        const truncatedMessages: Message[] = [];

        for (const chatMsg of conversationHistory) {
          // Find matching original message by content and role
          const originalMsg = allMessagesWithNew.find(
            msg => msg.text === chatMsg.content && msg.isUser === (chatMsg.role === 'user')
          );
          if (originalMsg) {
            truncatedMessages.push(originalMsg);
          }
        }

        // Update state with truncated messages (preserving original IDs and timestamps)
        setMessages(truncatedMessages);
      }

      // Try streaming first if enabled
      if (useStreaming) {
        try {
          const response = await fetch('/api/chat?stream=true', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: conversationHistory }),
          });

          // Check if we got a streaming response
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('text/event-stream')) {
            // Handle streaming response
            await handleStreamingResponse(response);
            return;
          } else {
            // If we didn't get a stream, parse as JSON and fallback
            const data = await response.json();
            const aiMessage: Message = {
              id: Date.now() + 1,
              text: data.message || "Sorry, I couldn't process that request.",
              isUser: false,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsLoading(false);
            return;
          }
        } catch (streamError) {
          console.warn('Streaming failed, falling back to HTTP:', streamError);
          setUseStreaming(false); // Disable streaming for future requests
        }
      }

      // Fallback to non-streaming HTTP request
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: conversationHistory }),
        });

        const data = await response.json();
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: data.message || "Sorry, I couldn't process that request.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      } catch (error) {
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble connecting right now. Please try again.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
      }
    }
  };

  const handleStreamingResponse = async (response: Response) => {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let accumulatedText = '';
    const messageId = Date.now() + 1;
    setStreamingMessageId(messageId);

    // Add initial empty message that will be updated
    const aiMessage: Message = {
      id: messageId,
      text: '',
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsLoading(false);
          setStreamingMessageId(null);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              accumulatedText += parsed.content;

              // Hide typing indicator as soon as first content arrives
              if (isLoading) {
                setIsLoading(false);
              }

              // Update the message with accumulated text
              setMessages(prev => prev.map(msg =>
                msg.id === messageId
                  ? { ...msg, text: accumulatedText }
                  : msg
              ));
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
      }
    } catch (error) {
      console.error('Error reading stream:', error);
      setIsLoading(false);
      setStreamingMessageId(null);
      throw error;
    }
  };

  const handleInputFocus = () => {
    if (!isExpanded && !isCollapsing) {
      setIsExpanded(true);
    }
  };

  const handleMinimize = () => {
    setIsCollapsing(true);
    // Wait for animation to complete before hiding content
    setTimeout(() => {
      setIsExpanded(false);
      setIsCollapsing(false);
      setCustomHeight(384);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="fixed left-0 right-0 z-30 bottom-0">
      <div
        className={`bg-gray-100 bg-opacity-60 border border-gray-300 border-opacity-40 rounded-t-2xl overflow-hidden ${isDragging ? '' : 'transition-all duration-1000 ease-out'
          }`}
        style={{ height: isExpanded ? `${customHeight}px` : 'auto' }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Drag Handle */}
          {isExpanded && (
            <div
              className={`h-2 w-full cursor-ns-resize hover:bg-gray-300 hover:bg-opacity-50 transition-colors ${isDragging ? 'bg-gray-300 bg-opacity-70' : ''
                }`}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
            />
          )}
          {/* Expanded Chat Area */}
          <div className={`transition-all duration-1000 ${isExpanded
            ? isCollapsing
              ? 'opacity-0 transform translate-y-4'
              : 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform translate-y-4 h-0'
            }`} style={{ height: isExpanded ? `${customHeight - (window.innerWidth >= 768 ? 120 : 135)}px` : '0' }}>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-300 border-opacity-100">
              <div className="flex items-center space-x-3 px-4 py-2 rounded-2xl bg-white border border-gray-300">
                <div className="w-3 h-3 bg-green-900 rounded-full"></div>
                <h3 className="font-medium text-gray-900">Levrok Labs AI</h3>
                <span className={`text-xs font-medium ${
                  tokenCount < 3000
                    ? 'text-green-600'
                    : tokenCount < 3600
                    ? 'text-yellow-600'
                    : 'text-orange-600'
                }`}>
                  {tokenCount}/{TOKEN_LIMIT} tokens
                </span>
              </div>
              <button
                onClick={handleMinimize}
                className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center"
              >
                <span className="text-lg leading-none">−</span>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 64px)' }}>
              {messages.length === 0 && !isLoading ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">Start a conversation with Levrok Labs</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.isUser
                          ? 'bg-gray-800 bg-opacity-80 text-white border border-gray-700 border-opacity-50'
                          : 'bg-white text-gray-900 border border-gray-300'
                          } ${msg.id === streamingMessageId ? 'relative' : ''}`}
                      >
                        <p className="text-sm">
                          <ReactMarkdown
                            components={{
                              ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 mb-2" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 mb-2" {...props} />,
                              li: ({ node, ...props }) => <li className="ml-0" {...props} />,
                              p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                          {msg.id === streamingMessageId && (
                            <span className="inline-block w-1.5 h-4 ml-0.5 bg-gray-900 animate-pulse" />
                          )}
                        </p>
                        {/* <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </p> */}
                      </div>
                    </div>
                  ))}

                  {/* Loading Animation */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-white border border-gray-300">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          {/* <span className="text-xs text-gray-500">Levrok Labs is thinking...</span> */}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className={`p-4 ${isExpanded ? 'pb-6' : ''}`}>
            <form onSubmit={handleSubmit} className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={handleInputFocus}
                  disabled={isLoading}
                  rows={1}
                  placeholder={isExpanded ? "Continue the conversation..." : "Ask about Levrok Labs..."}
                  className="w-full px-4 py-3 pr-12 bg-white bg-opacity-50 border border-gray-300 border-opacity-50 rounded-2xl text-gray-900 placeholder-gray-600 resize-none overflow-hidden
                    focus:outline-none focus:border-gray-400 focus:border-opacity-70 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-20
                    hover:border-gray-400 hover:border-opacity-60 hover:bg-opacity-60
                    transition-all duration-300"
                  style={{ minHeight: '48px' }}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="absolute right-2 bottom-3 w-8 h-8 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-100 hover:scale-105 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="text-sm">→</span>
                </button>
              </div>
            </form>

            {!isExpanded && (
              <p className="text-xs text-gray-500 text-center mt-2">
                AI can make mistakes. Consider checking important information. Press Enter to send, Shift+Enter for new line.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

