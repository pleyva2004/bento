import React from 'react';

const Hero: React.FC = () => {
  return (
    <main className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
      {/* Top Centered Text */}
      <div className="absolute top-[120px] sm:top-[120px] md:top-[140px] left-0 right-0 text-center z-10">
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-light tracking-widest uppercase text-balance">
          [ LEVROK Labs - Intelligent Data Systems ]
        </p>
      </div>

      <div className="relative max-w-7xl w-full px-8 md:pl-24 lg:pl-32 lg:pr-16">
        {/* Main Content */}
        <div className="relative z-10 max-w-4xl">

          {/* Main Heading */}
          <div className="space-y-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-7xl 2xl:text-7xl font-bold leading-none tracking-tight space-y-1 md:space-y-1.5 lg:space-y-2">
              <div className="text-gray-900">WE BUILD</div>
              <div>
                <span className="text-gray-500">[</span>
                <span className="text-gray-900">INTELLIGENCE</span>
                <span className="text-gray-500">]</span>
              </div>
              <div className="text-gray-700">FOR GROWING</div>
              <div className="text-gray-400">ORGANIZATIONS</div>
            </h2>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Hero;
