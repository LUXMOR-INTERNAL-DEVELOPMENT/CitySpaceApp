import React from "react";

const BoxCricketGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Box Cricket">
    <defs>
      <linearGradient id="bcFloor" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#dcfce7" />
        <stop offset="100%" stopColor="#86efac" />
      </linearGradient>
      <linearGradient id="bcWall" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
      <pattern id="bcNet" width="4" height="4" patternUnits="userSpaceOnUse">
        <path d="M 0 0 L 4 4 M 4 0 L 0 4" fill="none" stroke="#94a3b8" strokeWidth="0.4" />
      </pattern>
      <radialGradient id="bcBall" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="40%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>
    </defs>
    {/* Box Net Enclosure */}
    <polygon points="12,20 88,20 88,88 12,88" fill="url(#bcWall)" opacity="0.4" />
    <polygon points="12,20 88,20 74,70 26,70" fill="url(#bcNet)" opacity="0.7" />
    {/* Green Turf Floor */}
    <polygon points="12,70 88,70 100,92 0,92" fill="url(#bcFloor)" />
    {/* White crease */}
    <line x1="32" y1="78" x2="68" y2="78" stroke="#ffffff" strokeWidth="2" />
    {/* Stumps / Wickets */}
    <g transform="translate(42, 40)">
      {/* 3 Stumps */}
      <rect x="2" y="4" width="2" height="28" fill="#d97706" rx="1" />
      <rect x="7" y="4" width="2" height="28" fill="#d97706" rx="1" />
      <rect x="12" y="4" width="2" height="28" fill="#d97706" rx="1" />
      {/* Bails */}
      <rect x="0" y="2" width="16" height="2" fill="#b45309" rx="0.5" />
    </g>
    {/* Red Cricket Ball */}
    <g transform="translate(62, 72)">
      <ellipse cx="0" cy="5" rx="5" ry="2" fill="#15803d" opacity="0.4" />
      <circle cx="0" cy="0" r="5" fill="url(#bcBall)" stroke="#991b1b" strokeWidth="0.5" />
      <path d="M -3 -3 Q 0 0 3 3" fill="none" stroke="#ffffff" strokeWidth="0.7" strokeDasharray="1,1" />
    </g>
  </svg>
);

export default BoxCricketGraphic;
