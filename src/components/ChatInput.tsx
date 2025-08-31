import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

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
      setMessage('');
      setIsLoading(true);

      // Get AI response
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: message.trim() }),
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
        className={`bg-gray-100 bg-opacity-60 border border-gray-300 border-opacity-40 rounded-t-2xl transition-all duration-1000 ease-out overflow-hidden ${
          isExpanded ? 'h-[24rem]' : 'h-auto'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          
          {/* Expanded Chat Area */}
          <div className={`transition-all duration-1000 ${
            isExpanded 
              ? isCollapsing 
                ? 'opacity-0 transform translate-y-4 h-[18rem]' 
                : 'opacity-100 transform translate-y-0 h-[18rem]'
              : 'opacity-0 transform translate-y-4 h-0'
          }`}>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-300 border-opacity-100">
              <div className="flex items-center space-x-3 px-4 py-2 rounded-2xl bg-white border border-gray-300">
                <div className="w-3 h-3 bg-green-900 rounded-full"></div>
                <h3 className="font-medium text-gray-900">Levrok Labs AI</h3>
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
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          msg.isUser
                            ? 'bg-gray-800 bg-opacity-80 text-white border border-gray-700 border-opacity-50'
                            : 'bg-white text-gray-900 border border-gray-300'
                        }`}
                      >
                        <p className="text-sm">
                          <ReactMarkdown
                            components={{
                              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 mb-2" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 mb-2" {...props} />,
                              li: ({node, ...props}) => <li className="ml-0" {...props} />,
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
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