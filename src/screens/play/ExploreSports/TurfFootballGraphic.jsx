import React from "react";

const TurfFootballGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Turf Football">
    <defs>
      <linearGradient id="turfFloor" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#bbf7d0" />
        <stop offset="40%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#4ade80" />
      </linearGradient>
      <radialGradient id="soccerBall" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#64748b" />
      </radialGradient>
      <pattern id="turfNet" width="5" height="5" patternUnits="userSpaceOnUse">
        <path d="M 0 0 L 5 5 M 5 0 L 0 5" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
      </pattern>
    </defs>
    {/* Green Turf Floor */}
    <path d="M 6 58 L 94 58 L 100 96 L 0 96 Z" fill="url(#turfFloor)" opacity="0.75" />
    {/* Turf Line */}
    <ellipse cx="50" cy="85" rx="36" ry="6" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
    {/* Goal Frame & Netting */}
    <g transform="translate(16, 32)">
      {/* Net Backing */}
      <polygon points="6,6 62,6 56,36 12,36" fill="url(#turfNet)" opacity="0.6" />
      {/* Front Posts */}
      <polyline points="4,38 4,4 64,4 64,38" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Side depth */}
      <line x1="4" y1="4" x2="10" y2="0" stroke="#e2e8f0" strokeWidth="2.5" />
      <line x1="64" y1="4" x2="58" y2="0" stroke="#e2e8f0" strokeWidth="2.5" />
      <line x1="10" y1="0" x2="58" y2="0" stroke="#e2e8f0" strokeWidth="2.5" />
      <line x1="10" y1="0" x2="12" y2="36" stroke="#e2e8f0" strokeWidth="2" />
      <line x1="58" y1="0" x2="56" y2="36" stroke="#e2e8f0" strokeWidth="2" />
    </g>
    {/* Soccer Ball */}
    <g transform="translate(58, 74)">
      <ellipse cx="0" cy="6" rx="9" ry="2.5" fill="#15803d" opacity="0.4" />
      <circle cx="0" cy="0" r="7.5" fill="url(#soccerBall)" stroke="#334155" strokeWidth="0.6" />
      {/* Pentagon pattern */}
      <polygon points="0,-2 2,0 1,3 -1,3 -2,0" fill="#0f172a" />
      <polygon points="-6,-1 -4,-4 -2,-3 -3,0" fill="#0f172a" />
      <polygon points="6,-1 4,-4 2,-3 3,0" fill="#0f172a" />
      <polygon points="0,7 -3,5 -2,4 2,4 3,5" fill="#0f172a" />
    </g>
  </svg>
);

export default TurfFootballGraphic;
