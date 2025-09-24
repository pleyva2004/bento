import React, { useState, useEffect } from 'react';

interface HeroProps {}

const Hero: React.FC<HeroProps> = () => {
  // Business text typewriter state
  const [businessText, setBusinessText] = useState('');
  const [businessIndex, setBusinessIndex] = useState(0);
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