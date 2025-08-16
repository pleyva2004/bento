import React from 'react';

const About: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pl-24 pr-8 bg-gray-50">
      <div className="max-w-4xl w-full">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
            About Neural Strategies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700">
                We are a team of AI experts, strategists, and engineers dedicated to helping businesses unlock the transformative power of artificial intelligence.
              </p>
              <p className="text-base leading-relaxed text-gray-600">
                Our approach combines deep technical expertise with strategic business insight to deliver AI solutions that drive real results.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Machine Learning</span>
                  <span className="text-sm text-gray-600">95%</span>
                </div>
                <div className="w-full bg-gray-200 h-1">
                  <div className="bg-gray-900 h-1 w-[95%]"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">AI Strategy</span>
                  <span className="text-sm text-gray-600">90%</span>
                </div>
                <div className="w-full bg-gray-200 h-1">
                  <div className="bg-gray-900 h-1 w-[90%]"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Implementation</span>
                  <span className="text-sm text-gray-600">88%</span>
                </div>
                <div className="w-full bg-gray-200 h-1">
                  <div className="bg-gray-900 h-1 w-[88%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;