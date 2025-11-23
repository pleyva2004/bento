import React from 'react';

const Hero: React.FC = () => {
  return (
    <main className="min-h-[90vh] flex items-center justify-center relative overflow-hidden pt-[10px] sm:pt-[124px] md:pt-[140px]">
      {/* Top Centered Text */}
      <div className="absolute top-4 sm:top-[110px] md:top-[130px] left-0 right-0 text-center z-10 flex items-center justify-center h-10 sm:h-auto">
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-light tracking-widest uppercase text-balance">
          [ LEVROK Labs - Intelligent Data Systems ]
        </p>
      </div>

      <div className="relative max-w-7xl w-full px-8 md:pl-24 lg:pl-32 lg:pr-16 -mt-20">        {/* Main Content */}
        <div className="relative z-10 max-w-4xl">

          {/* Main Heading */}
          <div className="backdrop-blur-[1px] bg-white/5 rounded-3xl p-6">
            <div className="space-y-0">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold leading-none tracking-tight space-y-1 md:space-y-1.5 lg:space-y-2">
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

        {/* Subheading */}
        <div className="text-lg sm:text-xl md:text-xl lg:text-xl xl:text-xl 2xl:text-xl text-gray-600 font-light tracking-wide mt-6 backdrop-blur-[1px] bg-white/5 rounded-3xl p-6">
          Using intelligence to scale and improve decision-making
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10 md:mt-12">
          {/* Primary Button - Get Started with Levrok */}
          <a
            href="/levrok"
            className="group relative px-6 py-3.5 sm:px-7 sm:py-4 md:px-8 md:py-4 bg-gray-100 text-gray-900 font-medium text-sm sm:text-base md:text-base inline-flex items-center justify-center hover:bg-gray-200 transition-all duration-300 border border-gray-300 uppercase tracking-wide overflow-hidden"
            style={{ clipPath: 'polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)' }}
          >
            {/* Top-left diagonal line */}
            <div className="absolute top-1 left-1 pointer-events-none">
              <svg width="16" height="16" fill="none" stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1.5">
                <line x1="14" y1="0" x2="0" y2="14" />
              </svg>
            </div>

            {/* Bottom-right diagonal line */}
            <div className="absolute bottom-1 right-1 pointer-events-none">
              <svg width="16" height="16" fill="none" stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1.5">
                <line x1="0" y1="14" x2="14" y2="0" />
              </svg>
            </div>

            GET STARTED WITH LEVROK

            {/* Arrow Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-up-right ml-2 sm:ml-2.5 md:ml-3 w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>

          {/* Secondary Button - Explore Insights */}
          <a
            href="/insights"
            className="group text-gray-700 font-light text-sm sm:text-base md:text-base inline-flex items-center justify-center hover:text-gray-900 transition-all duration-300 uppercase tracking-wide py-3.5 sm:py-4 md:py-4"
          >
            EXPLORE INSIGHTS

            {/* Arrow Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-up-right ml-2 sm:ml-2.5 md:ml-3 w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
        </div>

      </div>
    </main>
  );
};

export default Hero;

