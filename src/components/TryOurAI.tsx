import React from 'react';

const TryOurAI: React.FC = () => {
  return (
    <div className="fixed bottom-[90px] left-8 z-30 pointer-events-none">
      {/* Handwritten Text */}
      <div className="relative">
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 120 100"  // Expanded viewBox for better arrow
          className="text-navy-900"
          style={{ transform: 'rotate(-5deg)' }}
        >
          {/* Try */}
          <text 
            x="4" 
            y="20" 
            className="fill-current text-blue-900" 
            style={{ 
              fontFamily: 'Lucida Calligraphy, Edwardian Script ITC, cursive', 
              fontSize: '22px', 
              fontWeight: 'normal',
              fontStyle: 'italic'
            }}
          >
            Try
          </text>
          
          {/* Our */}
          <text 
            x="58" 
            y="30" 
            className="fill-current text-blue-900" 
            style={{ 
              fontFamily: 'Lucida Calligraphy, Edwardian Script ITC, cursive', 
              fontSize: '22px', 
              fontWeight: 'normal',
              fontStyle: 'italic'
            }}
          >
            Our
          </text>
          
          {/* AI */}
          <text 
            x="25" 
            y="55" 
            className="fill-current text-blue-900" 
            style={{ 
              fontFamily: 'Lucida Calligraphy, Edwardian Script ITC, cursive', 
              fontSize: '22px', 
              fontWeight: 'normal',
              fontStyle: 'italic'
            }}
          >
            AI
          </text>
          
          {/* Curved Arrow - smooth downward curve */}
          <path
            d="M 65 52 Q 80 65 85 80"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-blue-900"
            strokeLinecap="round"
          />
          
          {/* Arrow Head - filled triangle pointing down */}
          <path
            d="M 85 80 L 80 75 L 90 75 Z"
            fill="currentColor"
            className="text-blue-900"
          />
        </svg>
      </div>
    </div>
  );
};

export default TryOurAI;
