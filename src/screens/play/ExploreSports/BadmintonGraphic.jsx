import React from "react";

const BadmintonGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Badminton">
    <defs>
      <linearGradient id="badmintonRacket" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="50%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="badmintonGrip" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
      <pattern id="bGrid" width="4" height="4" patternUnits="userSpaceOnUse">
        <path d="M 0 4 L 4 0 M 0 0 L 4 4" fill="none" stroke="#cbd5e1" strokeWidth="0.4" />
      </pattern>
      <radialGradient id="badmintonShuttle" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="80%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </radialGradient>
    </defs>
    {/* Perspective Grid Floor */}
    <g opacity="0.4" stroke="#94a3b8" strokeWidth="0.4">
      <line x1="10" y1="85" x2="90" y2="85" />
      <line x1="15" y1="75" x2="85" y2="75" />
      <line x1="25" y1="65" x2="75" y2="65" />
      <line x1="15" y1="75" x2="10" y2="85" />
      <line x1="30" y1="65" x2="25" y2="85" />
      <line x1="50" y1="65" x2="50" y2="85" />
      <line x1="70" y1="65" x2="75" y2="85" />
      <line x1="85" y1="75" x2="90" y2="85" />
    </g>
    {/* Racket Shadow */}
    <ellipse cx="46" cy="80" rx="22" ry="5" fill="#94a3b8" opacity="0.25" />
    {/* Racket */}
    <g transform="rotate(-30 45 50)">
      {/* Head frame */}
      <ellipse cx="45" cy="30" rx="19" ry="24" fill="url(#bGrid)" stroke="url(#badmintonRacket)" strokeWidth="3" />
      {/* Shaft */}
      <line x1="45" y1="54" x2="45" y2="78" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
      {/* Handle / Grip */}
      <rect x="42.5" y="78" width="5" height="18" rx="2.5" fill="url(#badmintonGrip)" stroke="#ca8a04" strokeWidth="0.6" />
      {/* Grip wraps */}
      <line x1="42.5" y1="82" x2="47.5" y2="84" stroke="#ca8a04" strokeWidth="0.7" />
      <line x1="42.5" y1="87" x2="47.5" y2="89" stroke="#ca8a04" strokeWidth="0.7" />
      <line x1="42.5" y1="92" x2="47.5" y2="94" stroke="#ca8a04" strokeWidth="0.7" />
    </g>
    {/* Shuttlecock */}
    <g transform="translate(62, 28) rotate(40)">
      {/* Feathers */}
      <path d="M-6,-4 L-11,-18 L11,-18 L6,-4 Z" fill="url(#badmintonShuttle)" stroke="#cbd5e1" strokeWidth="0.7" />
      <line x1="-8" y1="-18" x2="-4" y2="-4" stroke="#a855f7" strokeWidth="0.9" />
      <line x1="0" y1="-18" x2="0" y2="-4" stroke="#a855f7" strokeWidth="0.9" />
      <line x1="8" y1="-18" x2="4" y2="-4" stroke="#a855f7" strokeWidth="0.9" />
      <path d="M-10,-14 Q0,-12 10,-14" fill="none" stroke="#7c3aed" strokeWidth="1" />
      {/* Cork */}
      <ellipse cx="0" cy="-2" rx="5" ry="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.6" />
    </g>
  </svg>
);

export default BadmintonGraphic;
