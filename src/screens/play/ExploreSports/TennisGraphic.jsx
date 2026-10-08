import React from "react";

const TennisGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Tennis">
    <defs>
      <linearGradient id="tennisFrame" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="50%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
      <pattern id="tennisString" width="3" height="3" patternUnits="userSpaceOnUse">
        <path d="M 0 0 L 3 0 M 0 0 L 0 3" fill="none" stroke="#93c5fd" strokeWidth="0.4" />
      </pattern>
      <radialGradient id="tennisBall" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#bef264" />
        <stop offset="50%" stopColor="#a3e635" />
        <stop offset="100%" stopColor="#65a30d" />
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
    {/* Racket Shadow */}
    <ellipse cx="46" cy="80" rx="20" ry="5" fill="#94a3b8" opacity="0.3" />
    {/* Tennis Racket */}
    <g transform="rotate(-30 46 54)">
      {/* Head */}
      <ellipse cx="46" cy="32" rx="18" ry="24" fill="url(#tennisString)" stroke="url(#tennisFrame)" strokeWidth="3" />
      {/* Throat / Yoke */}
      <polygon points="41,55 51,55 48,60 44,60" fill="url(#tennisFrame)" />
      {/* Shaft */}
      <rect x="44.5" y="58" width="3" height="16" fill="#1e3a8a" />
      {/* Handle */}
      <rect x="43" y="74" width="6" height="20" rx="2.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
      <line x1="43" y1="78" x2="49" y2="80" stroke="#a16207" strokeWidth="0.8" />
      <line x1="43" y1="83" x2="49" y2="85" stroke="#a16207" strokeWidth="0.8" />
      <line x1="43" y1="88" x2="49" y2="90" stroke="#a16207" strokeWidth="0.8" />
    </g>
    {/* Tennis Ball */}
    <g transform="translate(68, 48)">
      <circle cx="0" cy="0" r="8" fill="url(#tennisBall)" stroke="#4d7c0f" strokeWidth="0.6" />
      <path d="M -6 -4 Q 0 0 -6 4" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 6 -4 Q 0 0 6 4" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export default TennisGraphic;
