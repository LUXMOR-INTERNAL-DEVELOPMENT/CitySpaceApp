import React from "react";

const SquashGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Squash">
    <defs>
      <linearGradient id="squashFrame" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="50%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <pattern id="squashMesh" width="3" height="3" patternUnits="userSpaceOnUse">
        <path d="M 0 0 L 3 0 M 0 0 L 0 3" fill="none" stroke="#94a3b8" strokeWidth="0.4" />
      </pattern>
    </defs>
    {/* Perspective Grid Floor */}
    <g opacity="0.35" stroke="#94a3b8" strokeWidth="0.4">
      <line x1="10" y1="85" x2="90" y2="85" />
      <line x1="20" y1="72" x2="80" y2="72" />
      <line x1="20" y1="72" x2="10" y2="85" />
      <line x1="50" y1="72" x2="50" y2="85" />
      <line x1="80" y1="72" x2="90" y2="85" />
    </g>
    {/* Shadow */}
    <ellipse cx="46" cy="80" rx="20" ry="5" fill="#94a3b8" opacity="0.3" />
    {/* Teardrop Squash Racket */}
    <g transform="rotate(-30 46 54)">
      {/* Head */}
      <path d="M 46 12 C 30 12, 30 42, 43 56 L 49 56 C 62 42, 62 12, 46 12 Z" fill="url(#squashMesh)" stroke="url(#squashFrame)" strokeWidth="3" />
      {/* Shaft */}
      <line x1="46" y1="56" x2="46" y2="74" stroke="#64748b" strokeWidth="2.5" />
      {/* Handle */}
      <rect x="43" y="74" width="6" height="20" rx="2.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
      <line x1="43" y1="78" x2="49" y2="80" stroke="#a16207" strokeWidth="0.8" />
      <line x1="43" y1="83" x2="49" y2="85" stroke="#a16207" strokeWidth="0.8" />
      <line x1="43" y1="88" x2="49" y2="90" stroke="#a16207" strokeWidth="0.8" />
    </g>
    {/* Squash Ball */}
    <g transform="translate(68, 52)">
      <circle cx="0" cy="0" r="5" fill="#0f172a" />
      {/* Double yellow dots */}
      <circle cx="-1.5" cy="0" r="0.8" fill="#facc15" />
      <circle cx="1.5" cy="0" r="0.8" fill="#facc15" />
    </g>
  </svg>
);

export default SquashGraphic;
