import React, { useState } from 'react';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  return (
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
  );
};

export default ChatInput;