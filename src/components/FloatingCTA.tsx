import React from 'react';

const FloatingCTA: React.FC = () => {
  return (
    <div className="fixed top-20 right-4 md:top-auto md:bottom-4 lg:bottom-8 md:right-8 z-40">
    <button className="
      bg-gray-900 text-white 
      px-4 sm:px-6 lg:px-8 py-3 sm:py-4 
      rounded-full 
      text-xs sm:text-sm font-medium tracking-wide
      hover:bg-gray-800 
      transition-all duration-300 
      shadow-lg hover:shadow-xl
      flex items-center space-x-2 sm:space-x-3
      group
      max-w-[280px] sm:max-w-none
    ">
      <span className="w-2 h-2 bg-white rounded-full opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0"></span>
      <span className="truncate">Schedule a No-Cost AI audit call</span>
    </button>
  </div>
  );
};

export default FloatingCTA;