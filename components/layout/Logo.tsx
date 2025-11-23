import React from 'react';
import Link from 'next/link';

const Logo: React.FC = () => {
  return (
    <Link href="/" className="fixed top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 z-50 cursor-pointer hover:opacity-80 transition-opacity">
      <div className="relative">
        {/* Background dark square */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-600 border border-gray-600 transform rotate-90"></div>

        {/* Overlapping blue square */}

        {/* Main square with text */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-900 border border-gray-900 flex items-center justify-center">
          <span className="text-white text-base sm:text-lg md:text-xl font-bold tracking-tight">LL</span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;

