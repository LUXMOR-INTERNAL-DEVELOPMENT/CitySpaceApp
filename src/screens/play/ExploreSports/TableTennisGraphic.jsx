import React from "react";

const TableTennisGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Table Tennis">
    <defs>
      <linearGradient id="ttRubber" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="60%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>
      <linearGradient id="ttWood" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
      <radialGradient id="ttBall" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#eab308" />
      </radialGradient>
    </defs>
    {/* Perspective Grid Floor */}
    <g opacity="0.35" stroke="#94a3b8" strokeWidth="0.4">
      <line x1="12" y1="86" x2="88" y2="86" />
      <line x1="20" y1="74" x2="80" y2="74" />
      <line x1="20" y1="74" x2="12" y2="86" />
      <line x1="50" y1="74" x2="50" y2="86" />
      <line x1="80" y1="74" x2="88" y2="86" />
    </g>
    {/* Paddle Shadow */}
    <ellipse cx="46" cy="80" rx="20" ry="5" fill="#94a3b8" opacity="0.3" />
    {/* Racket */}
    <g transform="rotate(-32 46 52)">
      {/* Blade */}
      <circle cx="46" cy="38" r="21" fill="url(#ttRubber)" stroke="#7f1d1d" strokeWidth="2.5" />
      {/* Wood edge tape */}
      <path d="M 26 44 C 26 60, 66 60, 66 44" fill="none" stroke="#fed7aa" strokeWidth="2" />
      {/* Handle */}
      <path d="M 42 58 L 40 82 Q 46 85 52 82 L 50 58 Z" fill="url(#ttWood)" stroke="#78350f" strokeWidth="1" />
      <line x1="46" y1="60" x2="46" y2="82" stroke="#78350f" strokeWidth="1" opacity="0.6" />
    </g>
    {/* Ping Pong Ball */}
    <circle cx="68" cy="36" r="6" fill="url(#ttBall)" stroke="#ca8a04" strokeWidth="0.6" />
    <ellipse cx="68" cy="46" rx="4" ry="1.5" fill="#94a3b8" opacity="0.3" />
  </svg>
);

export default TableTennisGraphic;
