import React from "react";

const PadelGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Padel">
    <defs>
      <linearGradient id="padelFace" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="60%" stopColor="#334155" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <radialGradient id="padelBall" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#ca8a04" />
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
    <ellipse cx="48" cy="80" rx="20" ry="5" fill="#94a3b8" opacity="0.3" />
    {/* Padel Racket */}
    <g transform="rotate(32 46 54)">
      {/* Head */}
      <rect x="28" y="16" width="30" height="36" rx="14" fill="url(#padelFace)" stroke="#1e293b" strokeWidth="2.5" />
      {/* Padel Perforation Holes */}
      <circle cx="37" cy="26" r="1.4" fill="#cbd5e1" />
      <circle cx="43" cy="26" r="1.4" fill="#cbd5e1" />
      <circle cx="49" cy="26" r="1.4" fill="#cbd5e1" />
      <circle cx="37" cy="32" r="1.4" fill="#cbd5e1" />
      <circle cx="43" cy="32" r="1.4" fill="#cbd5e1" />
      <circle cx="49" cy="32" r="1.4" fill="#cbd5e1" />
      <circle cx="37" cy="38" r="1.4" fill="#cbd5e1" />
      <circle cx="43" cy="38" r="1.4" fill="#cbd5e1" />
      <circle cx="49" cy="38" r="1.4" fill="#cbd5e1" />
      <circle cx="43" cy="44" r="1.4" fill="#cbd5e1" />
      {/* Bridge / Throat */}
      <polygon points="38,50 48,50 45,55 41,55" fill="#1e293b" />
      {/* Handle */}
      <rect x="40" y="54" width="6" height="24" rx="2.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
      <line x1="40" y1="60" x2="46" y2="62" stroke="#a16207" strokeWidth="0.8" />
      <line x1="40" y1="66" x2="46" y2="68" stroke="#a16207" strokeWidth="0.8" />
      <line x1="40" y1="72" x2="46" y2="74" stroke="#a16207" strokeWidth="0.8" />
    </g>
    {/* Padel Ball */}
    <circle cx="48" cy="28" r="8" fill="url(#padelBall)" stroke="#ca8a04" strokeWidth="0.6" />
    <path d="M 44 23 Q 48 28 52 23" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
  </svg>
);

export default PadelGraphic;
