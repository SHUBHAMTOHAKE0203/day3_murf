import React, { useState } from 'react';
import { Button } from '@/components/livekit/button';

function CoffeeIcon() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-8 drop-shadow-2xl"
    >
      <g filter="url(#glow)">
        <path
          d="M30 45C30 42 32 40 35 40H75C78 40 80 42 80 45V70C80 77 75 82 68 82H42C35 82 30 77 30 70V45Z"
          fill="#D4A574"
          stroke="#8B6F47"
          strokeWidth="2"
        />
        <ellipse cx="55" cy="44" rx="20" ry="4" fill="#6B5439" opacity="0.3" />
        
        <path
          d="M80 50H85C88 50 90 52 90 55V60C90 63 88 65 85 65H80"
          stroke="#8B6F47"
          strokeWidth="2"
          fill="none"
        />
        
        <path
          d="M40 82V90C40 92 42 94 44 94H66C68 94 70 92 70 90V82"
          stroke="#8B6F47"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        <g opacity="0.6">
          <path
            d="M45 30C45 30 47 20 50 20"
            stroke="#8B6F47"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M55 28C55 28 57 18 60 18"
            stroke="#8B6F47"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M65 30C65 30 67 20 70 20"
            stroke="#8B6F47"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </g>
      
      <defs>
        <filter id="glow" x="0" y="0" width="120" height="120">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div ref={ref} className="min-h-screen w-full bg-gradient-to-br from-[#2d2520] via-[#3d2f28] to-[#2d2520] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#D4A574] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8B6F47] rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4A574] rounded-full mix-blend-overlay filter blur-[100px] opacity-5"></div>
      </div>

      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo/Brand */}
        <div className="mb-12 text-center">
          <h1 className="text-[#D4A574] font-serif text-2xl tracking-[0.3em] mb-2 opacity-90">CAFÉ PERSONA</h1>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D4A574] to-transparent mx-auto opacity-50"></div>
        </div>

        {/* Coffee Icon */}
        <div className="transform transition-transform duration-700 hover:scale-110">
          <CoffeeIcon />
        </div>

        {/* Main heading */}
        <h2 className="text-[#F5F3F0] text-4xl md:text-5xl font-serif mb-4 text-center tracking-tight">
          Your Personal<br />Barista Awaits
        </h2>

        {/* Subtitle */}
        <p className="text-[#D4A574] text-lg md:text-xl max-w-md text-center mb-12 leading-relaxed font-light tracking-wide">
          Let our AI barista craft your perfect order with the warmth of conversation
        </p>

        {/* CTA Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={onStartCall}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-[#D4A574] hover:bg-[#C49563] text-[#2d2520] text-lg shadow-2xl hover:shadow-[#D4A574]/50 transform hover:scale-105 active:scale-95 backdrop-blur-sm border-0 w-auto"
        >
          <span className="flex items-center gap-3">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
            >
              <path 
                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" 
                fill="currentColor"
              />
              <path 
                d="M12 6C10.8954 6 10 6.89543 10 8V8.5C10 9.60457 10.8954 10.5 12 10.5C13.1046 10.5 14 9.60457 14 8.5V8C14 6.89543 13.1046 6 12 6Z" 
                fill="currentColor"
              />
              <path 
                d="M12 13.5C10.8954 13.5 10 14.3954 10 15.5V16C10 17.1046 10.8954 18 12 18C13.1046 18 14 17.1046 14 16V15.5C14 14.3954 13.1046 13.5 12 13.5Z" 
                fill="currentColor"
              />
            </svg>
            {startButtonText}
          </span>
        </Button>

        
      </div>

      {/* Footer */}
     
    </div>
  );
};