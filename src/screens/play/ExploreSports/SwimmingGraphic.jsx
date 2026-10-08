import React from "react";

const SwimmingGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Swimming">
    <defs>
      <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#065f46" />
        <stop offset="40%" stopColor="#0d9488" />
        <stop offset="80%" stopColor="#14b8a6" />
        <stop offset="100%" stopColor="#042f2e" />
      </linearGradient>
      <linearGradient id="strapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="50%" stopColor="#4b5563" />
        <stop offset="100%" stopColor="#1f2937" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="50" cy="74" rx="36" ry="8" fill="#94a3b8" opacity="0.3" />
    {/* Straps extending backwards */}
    <path d="M 16 52 Q 6 42 12 36 Q 30 38 48 40" fill="none" stroke="url(#strapGrad)" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M 84 52 Q 94 42 88 36 Q 70 38 52 40" fill="none" stroke="url(#strapGrad)" strokeWidth="4.5" strokeLinecap="round" />
    {/* Frame and Lenses */}
    <g transform="translate(0, 4)">
      {/* Left Lens */}
      <path d="M 20 46 C 20 36, 42 34, 46 45 C 48 53, 38 60, 26 58 C 21 57, 20 52, 20 46 Z" fill="url(#lensGrad)" stroke="#111827" strokeWidth="2.5" />
      {/* Left lens glare */}
      <path d="M 24 43 Q 32 38 41 42" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none" />
      {/* Bridge */}
      <path d="M 45 46 Q 50 43 55 46" fill="none" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" />
      {/* Right Lens */}
      <path d="M 80 46 C 80 36, 58 34, 54 45 C 52 53, 62 60, 74 58 C 79 57, 80 52, 80 46 Z" fill="url(#lensGrad)" stroke="#111827" strokeWidth="2.5" />
      {/* Right lens glare */}
      <path d="M 59 42 Q 68 38 76 43" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none" />
      {/* Side Clips */}
      <rect x="15" y="44" width="6" height="8" rx="2" fill="#047857" stroke="#111827" strokeWidth="1" />
      <rect x="79" y="44" width="6" height="8" rx="2" fill="#047857" stroke="#111827" strokeWidth="1" />
    </g>
  </svg>
);

export default SwimmingGraphic;
