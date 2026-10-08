import React from "react";

const BasketballGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Basketball">
    <defs>
      <radialGradient id="bballSphere" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="50%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#9a3412" />
      </radialGradient>
      <linearGradient id="bHoop" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>
    </defs>
    {/* Clear Backboard */}
    <rect x="25" y="10" width="50" height="36" rx="3" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.8" opacity="0.85" />
    <rect x="37" y="22" width="26" height="20" fill="none" stroke="#ef4444" strokeWidth="1.5" />
    {/* Hoop Rim */}
    <ellipse cx="50" cy="42" rx="18" ry="4" fill="none" stroke="url(#bHoop)" strokeWidth="3" />
    {/* White Net */}
    <path d="M 34 43 L 40 68 L 60 68 L 66 43" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3,2" />
    <path d="M 40 43 L 45 68 M 46 44 L 50 68 M 54 44 L 50 68 M 60 43 L 55 68" stroke="#cbd5e1" strokeWidth="1" />
    <ellipse cx="50" cy="68" rx="10" ry="2" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
    {/* Basketball Swishing Through */}
    <g transform="translate(50, 48)">
      <circle cx="0" cy="0" r="13" fill="url(#bballSphere)" stroke="#7c2d12" strokeWidth="0.8" />
      {/* Ribs / Seams */}
      <line x1="-13" y1="0" x2="13" y2="0" stroke="#431407" strokeWidth="1.2" />
      <line x1="0" y1="-13" x2="0" y2="13" stroke="#431407" strokeWidth="1.2" />
      <path d="M -9 -9 Q 0 0 -9 9" fill="none" stroke="#431407" strokeWidth="1.1" />
      <path d="M 9 -9 Q 0 0 9 9" fill="none" stroke="#431407" strokeWidth="1.1" />
    </g>
  </svg>
);

export default BasketballGraphic;
