import React, { useState } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
      setIsChatOpen(true);

      // Simulate AI response after a delay
      setTimeout(() => {
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: "Thanks for your message! This is a demo response from Neural Strategies AI. We'll get back to you soon with more details about our AI solutions.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };

  const closeChatOverlay = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      {/* Chat Overlay */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"
            onClick={closeChatOverlay}
          ></div>
          
          {/* Chat Window */}
          <div className="relative w-full max-w-2xl h-96 bg-white bg-opacity-80 backdrop-blur-lg rounded-xl border border-white border-opacity-30 shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 border-opacity-50">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="font-medium text-gray-900">Neural Strategies AI</h3>
              </div>
              <button
                onClick={closeChatOverlay}
                className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.isUser
                        ? 'bg-gray-900 text-white'
                        : 'bg-white bg-opacity-60 text-gray-900 border border-gray-200 border-opacity-50'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 border-opacity-50">
              <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Continue the conversation..."
                    className="w-full px-4 py-2 bg-white bg-opacity-60 border border-gray-300 border-opacity-50 rounded-full 
                      focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 
                      transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 hover:scale-105 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="text-xs">→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Neural Strategies anything..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full 
                  focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 
                  hover:border-gray-500 hover:shadow-md
                  transition-all duration-300"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 hover:scale-105 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="text-sm">→</span>
              </button>
            </div>
          </form>
          <p className="text-xs text-gray-500 text-center mt-2">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatInput;