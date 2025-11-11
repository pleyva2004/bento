import React from 'react';

const Hero: React.FC = () => {
  return (
    <main className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
      <div className="relative max-w-7xl w-full px-8 lg:px-16">

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl -mt-16 md:-mt-20 lg:-mt-24">

          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight tracking-tight text-gray-900">
              We are<br />
              <span className="font-normal">Levrok Labs</span>
            </h2>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Hero;
