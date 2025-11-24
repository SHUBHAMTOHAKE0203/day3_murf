import React, { useState } from 'react';
import { Button } from '@/components/livekit/button';

// Wellness Heart Icon with Pulse Animation
function WellnessIcon() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-8 drop-shadow-2xl wellness-float"
    >
      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
        <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#00f2fe" />
        </linearGradient>
        <filter id="glow" x="0" y="0" width="140" height="140">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <g filter="url(#glow)">
        {/* Main heart shape */}
        <path
          d="M60 85C60 85 35 68 35 50C35 40 41 33 49 33C54 33 58 36 60 40C62 36 66 33 71 33C79 33 85 40 85 50C85 68 60 85 60 85Z"
          fill="url(#heartGradient)"
          className="wellness-heartbeat"
        />
        
        {/* Pulse wave line */}
        <path
          d="M20 60 L32 60 L36 48 L40 72 L44 56 L48 60 L100 60"
          stroke="url(#pulseGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.8"
        />
        
        {/* Small decorative circles */}
        <circle cx="60" cy="20" r="6" fill="#667eea" opacity="0.4" className="wellness-pulse-circle" />
        <circle cx="95" cy="40" r="5" fill="#764ba2" opacity="0.4" className="wellness-pulse-circle" style={{ animationDelay: '0.5s' } as React.CSSProperties} />
        <circle cx="25" cy="40" r="5" fill="#4facfe" opacity="0.4" className="wellness-pulse-circle" style={{ animationDelay: '1s' } as React.CSSProperties} />
      </g>
      
      <style>{`
        @keyframes wellness-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes wellness-heartbeat {
          0%, 100% { transform: scale(1); }
          10% { transform: scale(1.08); }
          20% { transform: scale(1); }
          30% { transform: scale(1.08); }
          40% { transform: scale(1); }
        }
        @keyframes wellness-pulse-circle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }
        .wellness-float {
          animation: wellness-float 3s ease-in-out infinite;
        }
        .wellness-heartbeat {
          animation: wellness-heartbeat 2.5s ease-in-out infinite;
          transform-origin: center;
        }
        .wellness-pulse-circle {
          animation: wellness-pulse-circle 2s ease-in-out infinite;
        }
      `}</style>
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
    <div ref={ref} className="min-h-screen w-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative overflow-hidden">
      {/* Animated background elements - Cult.fit inspired Aurora effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#667eea] rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#764ba2] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' } as React.CSSProperties}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4facfe] rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>
        <div className="absolute top-40 right-40 w-72 h-72 bg-[#f093fb] rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' } as React.CSSProperties}></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo/Brand */}
        <div className="mb-12 text-center">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#4facfe] font-bold text-2xl tracking-[0.3em] mb-2">
            WELLNESS AI
          </h1>
          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#667eea] to-transparent mx-auto opacity-60"></div>
        </div>

        {/* Wellness Icon */}
        <div className="transform transition-transform duration-700 hover:scale-110">
          <WellnessIcon />
        </div>

        {/* Main heading */}
        <h2 className="text-white text-4xl md:text-5xl font-bold mb-4 text-center tracking-tight leading-tight">
          Your Personal<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] to-[#764ba2]">
            Wellness Companion
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-[#a8b2d1] text-lg md:text-xl max-w-md text-center mb-12 leading-relaxed font-light">
          Daily check-ins, mindful conversations, and personalized wellness support
        </p>

        {/* CTA Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={onStartCall}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#5568d3] hover:to-[#6941a0] text-white text-lg font-semibold shadow-2xl hover:shadow-[#667eea]/50 transform hover:scale-105 active:scale-95 backdrop-blur-sm border-0 w-auto px-8 py-4"
        >
          <span className="flex items-center gap-3">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}
            >
              <path 
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" 
                fill="currentColor"
                opacity="0.5"
              />
              <path 
                d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6Z" 
                fill="currentColor"
              />
              <circle cx="12" cy="12" r="3" fill="white" opacity="0.9" />
            </svg>
            {startButtonText}
          </span>
        </Button>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center mt-12 max-w-xl">
          <div className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-[#a8b2d1] text-sm">
            Mood Tracking
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-[#a8b2d1] text-sm">
            Goal Setting
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-[#a8b2d1] text-sm">
            Personalized Support
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0c29] to-transparent pointer-events-none"></div>
    </div>
  );
};