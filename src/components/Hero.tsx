import React, { useState, useEffect } from 'react';

interface HeroProps {}

const Hero: React.FC<HeroProps> = () => {
  // Business text typewriter state
  const [businessText, setBusinessText] = useState('');
  const [businessIndex, setBusinessIndex] = useState(0);
  const [showBusinessCursor, setShowBusinessCursor] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const businessTexts = ["Family Owned Businesses", "Personal Firms & Agencies", "Local Practices & Enterprises", "Independent Shops & Boutiques"];
  const currentBusinessText = businessTexts[currentTextIndex];
  
  // Business text animation
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (isDeleting && businessIndex === 0) {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % businessTexts.length);
      return;
    }
    
    const initialDelay = businessIndex === 0 && businessText === '' ? 500 : 0;
    
    const startDelay = setTimeout(() => {
      if (!isDeleting && businessIndex < currentBusinessText.length) {
        timer = setTimeout(() => {
          setBusinessText(currentBusinessText.slice(0, businessIndex + 1));
          setBusinessIndex(businessIndex + 1);
        }, 100);
      } else if (!isDeleting && businessIndex === currentBusinessText.length) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1000);
      } else if (isDeleting && businessIndex > 0) {
        timer = setTimeout(() => {
          setBusinessText(currentBusinessText.slice(0, businessIndex - 1));
          setBusinessIndex(businessIndex - 1);
        }, 80);
      }
    }, initialDelay);
    
    return () => {
      clearTimeout(startDelay);
      clearTimeout(timer);
    };
  }, [businessIndex, currentBusinessText, isDeleting, businessText, businessTexts.length]);

  useEffect(() => {
    const businessCursorTimer = setInterval(() => {
      setShowBusinessCursor(prev => !prev);
    }, 600);
    return () => clearInterval(businessCursorTimer);
  }, []);

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

         {/* Mobile Tagline - Only visible on mobile */}
         <div className="lg:hidden relative z-10 mt-8 sm:mt-12 text-center">
           <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg max-w-sm mx-auto">
             <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
               Specialized In
             </p>
             <p className="text-lg sm:text-xl font-extralight leading-tight tracking-tight text-gray-900">
               AI Solutions<br />
               <span className="text-base sm:text-lg text-gray-600">
                 {businessText}
                 {showBusinessCursor && <span className="text-gray-600">|</span>}
               </span>
             </p>
           </div>
         </div>
      </div>

      {/* Tagline with line - Hidden on mobile, visible on larger screens */}
      <div className="hidden md:block absolute right-30 bottom-10 transform -translate-y-1/2 z-50">
        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-px bg-gradient-to-r from-gray-900 via-gray-600 to-transparent"></div>
            <div className="text-right">
              <p className="text-sm font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
                Specialized In
              </p>
              <p className="text-2xl md:text-3xl font-extralight leading-tight tracking-tight text-gray-900">
                AI Solutions<br />
                <span className="text-xl md:text-2xl text-gray-600">
                  {businessText}
                  {showBusinessCursor && <span className="text-gray-600">|</span>}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;