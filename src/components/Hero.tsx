import React, { useState, useEffect } from 'react';

interface HeroProps {
  scrollY: number;
}

const Hero: React.FC<HeroProps> = ({ scrollY }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  // State for cycling business text typewriter
  const [businessText, setBusinessText] = useState('');
  const [businessIndex, setBusinessIndex] = useState(0);
  const [showBusinessCursor, setShowBusinessCursor] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const fullText = "Levrin Labs";
  const businessTexts = ["Family Owned Businesses", "Personal Firms & Agencies", "Local Practices & Enterprises", "Independent Shops & Boutiques"];
  const currentBusinessText = businessTexts[currentTextIndex];
  
  useEffect(() => {
    // Start animation after 1.5 second delay
    const startDelay = setTimeout(() => {
      if (currentIndex < fullText.length) {
        const timer = setTimeout(() => {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, 120); // Clean, measured typing pace
        return () => clearTimeout(timer);
      } else if (currentIndex >= fullText.length) {
        // Hide cursor when typing is complete
        setShowCursor(false);
      }
    }, currentIndex === 0 ? 1500 : 0);
    
    return () => clearTimeout(startDelay);
  }, [currentIndex, fullText]);
  
  useEffect(() => {
    // Only blink cursor while typing is in progress
    if (currentIndex < fullText.length) {
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 700); // Slower, more elegant blink
      return () => clearInterval(cursorTimer);
    } else {
      // Keep cursor hidden when typing is complete
      setShowCursor(false);
    }
  }, [currentIndex, fullText.length]);

  // Animation for cycling business text with delete/retype
  useEffect(() => {
    let timer: number;
    
    // Immediate switch to next text after deletion completes
    if (isDeleting && businessIndex === 0) {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % businessTexts.length);
      return;
    }
    
    // Start after "Levrin Labs" animation finishes (3 seconds delay)
    const initialDelay = businessIndex === 0 && businessText === '' ? 3000 : 0;
    
    const startDelay = setTimeout(() => {
      if (!isDeleting && businessIndex < currentBusinessText.length) {
        // Typing phase
        timer = setTimeout(() => {
          setBusinessText(currentBusinessText.slice(0, businessIndex + 1));
          setBusinessIndex(businessIndex + 1);
        }, 100);
      } else if (!isDeleting && businessIndex === currentBusinessText.length) {
        // Pause after finishing typing before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1000);
      } else if (isDeleting && businessIndex > 0) {
        // Deleting phase
        timer = setTimeout(() => {
          setBusinessText(currentBusinessText.slice(0, businessIndex - 1));
          setBusinessIndex(businessIndex - 1);
        }, 80); // Faster deletion
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
    }, 600); // Different blink speed for variety
    return () => clearInterval(businessCursorTimer);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="relative max-w-7xl w-full px-8 lg:px-16">
        
       {/* Large Background Text - "Hello!" */}
       <div 
          className="flex items-center justify-center opacity-[0.04] pointer-events-none select-none"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <h1 className="text-[10rem] md:text-[14rem] lg:text-[18rem] xl:text-[22rem] font-extralight leading-none tracking-tight text-gray-900 italic">
          Hello!
          </h1>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl -mt-16 md:-mt-20 lg:-mt-24">
          
          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight tracking-tight text-gray-900">
              We are<br />
              <span className="font-normal">
                {displayedText}
                {showCursor && <span className="text-gray-900">|</span>}
              </span>
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
      <div className="hidden md:block absolute right-10 top-3/4 z-50">
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