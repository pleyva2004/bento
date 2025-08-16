import React from 'react';

const FloatingCTA: React.FC = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button className="
        bg-gray-900 text-white 
        px-8 py-4 
        rounded-full 
        text-sm font-medium tracking-wide
        hover:bg-gray-800 
        transition-all duration-300 
        shadow-lg hover:shadow-xl
        flex items-center space-x-3
        group
      ">
        <span className="w-2 h-2 bg-white rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></span>
        <span>Schedule a free AI audit call</span>
      </button>
    </div>
  );
};

export default FloatingCTA;