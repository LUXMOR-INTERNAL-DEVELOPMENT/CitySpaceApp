import React from "react";

const CricketGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Cricket">
    <defs>
      <linearGradient id="cricketWood" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="30%" stopColor="#fde68a" />
        <stop offset="70%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <radialGradient id="cricketBallRed" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="40%" stopColor="#dc2626" />
        <stop offset="90%" stopColor="#991b1b" />
        <stop offset="100%" stopColor="#450a0a" />
      </radialGradient>
    </defs>
    {/* Floor Grid */}
    <g opacity="0.35" stroke="#94a3b8" strokeWidth="0.4">
      <line x1="10" y1="85" x2="90" y2="85" />
      <line x1="20" y1="72" x2="80" y2="72" />
      <line x1="20" y1="72" x2="10" y2="85" />
      <line x1="50" y1="72" x2="50" y2="85" />
      <line x1="80" y1="72" x2="90" y2="85" />
    </g>
    {/* Shadow */}
    <ellipse cx="48" cy="80" rx="24" ry="5" fill="#94a3b8" opacity="0.3" />
    {/* Cricket Bat */}
    <g transform="rotate(32 46 54)">
      {/* Handle */}
      <rect x="44" y="10" width="5" height="24" rx="2.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
      <line x1="44" y1="16" x2="49" y2="17" stroke="#a16207" strokeWidth="0.8" />
      <line x1="44" y1="22" x2="49" y2="23" stroke="#a16207" strokeWidth="0.8" />
      <line x1="44" y1="28" x2="49" y2="29" stroke="#a16207" strokeWidth="0.8" />
      {/* Shoulders & Blade */}
      <path d="M 42 34 L 40 40 L 40 82 Q 46.5 86 53 82 L 53 40 L 51 34 Z" fill="url(#cricketWood)" stroke="#b45309" strokeWidth="1.2" />
      {/* Spine / Concave line */}
      <line x1="46.5" y1="36" x2="46.5" y2="82" stroke="#b45309" strokeWidth="0.8" opacity="0.7" />
    </g>
    {/* Red Leather Cricket Ball with White Seam */}
    <g transform="translate(34, 70)">
      <ellipse cx="0" cy="5" rx="7" ry="2" fill="#94a3b8" opacity="0.35" />
      <circle cx="0" cy="0" r="7" fill="url(#cricketBallRed)" stroke="#7f1d1d" strokeWidth="0.6" />
      {/* Raised white stitched seam */}
      <path d="M -4 -4 Q 0 0 4 4" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="1.5,1" />
    </g>
  </svg>
);

export default CricketGraphic;
