import React from "react";

const FootballGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Football">
    <defs>
      <linearGradient id="fbTurf" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#bbf7d0" />
        <stop offset="50%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#4ade80" />
      </linearGradient>
      <pattern id="fbNet" width="4" height="4" patternUnits="userSpaceOnUse">
        <path d="M 0 0 L 4 4 M 4 0 L 0 4" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
      </pattern>
      <radialGradient id="fbBall" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#64748b" />
      </radialGradient>
    </defs>
    {/* Green field turf */}
    <path d="M 0 60 L 100 60 L 100 96 L 0 96 Z" fill="url(#fbTurf)" opacity="0.8" />
    {/* Goal Posts & Net */}
    <g transform="translate(18, 28)">
      <polygon points="6,6 58,6 52,36 12,36" fill="url(#fbNet)" opacity="0.6" />
      <polyline points="4,36 4,4 60,4 60,36" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="4" y1="4" x2="8" y2="0" stroke="#e2e8f0" strokeWidth="2" />
      <line x1="60" y1="4" x2="56" y2="0" stroke="#e2e8f0" strokeWidth="2" />
      <line x1="8" y1="0" x2="56" y2="0" stroke="#e2e8f0" strokeWidth="2" />
    </g>
    {/* Big Classic Soccer Ball */}
    <g transform="translate(50, 75)">
      <ellipse cx="0" cy="7" rx="14" ry="4" fill="#15803d" opacity="0.4" />
      <circle cx="0" cy="0" r="12" fill="url(#fbBall)" stroke="#334155" strokeWidth="0.8" />
      {/* Central pentagon */}
      <polygon points="0,-4 4,-1 2,4 -2,4 -4,-1" fill="#0f172a" />
      <polygon points="-9,-2 -6,-8 -3,-6 -5,0" fill="#0f172a" />
      <polygon points="9,-2 6,-8 3,-6 5,0" fill="#0f172a" />
      <polygon points="0,11 -4,8 -3,6 3,6 4,8" fill="#0f172a" />
    </g>
  </svg>
);

export default FootballGraphic;
