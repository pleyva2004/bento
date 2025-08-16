import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="fixed top-8 left-8 z-50">
      <div className="relative">
        {/* Background dark square */}
        <div className="w-14 h-14 bg-gray-600 border border-gray-600 transform rotate-90"></div>
        
        {/* Overlapping blue square */}
        
        {/* Main square with text */}
        <div className="absolute top-4 left-4 w-14 h-14 bg-gray-900 border border-gray-900 flex items-center justify-center">
          <span className="text-white text-xl font-bold tracking-tight">LL</span>
        </div>
      </div>
    </div>
  );
};

export default Logo;