import React from "react";

const PoolGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Pool">
    <defs>
      <radialGradient id="poolBall8" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="35%" stopColor="#1e293b" />
        <stop offset="75%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </radialGradient>
      <radialGradient id="ballShine" cx="30%" cy="25%" r="35%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Perspective Grid Floor */}
    <g opacity="0.35" stroke="#94a3b8" strokeWidth="0.4">
      <line x1="10" y1="85" x2="90" y2="85" />
      <line x1="20" y1="72" x2="80" y2="72" />
      <line x1="20" y1="72" x2="10" y2="85" />
      <line x1="50" y1="72" x2="50" y2="85" />
      <line x1="80" y1="72" x2="90" y2="85" />
    </g>
    {/* Ball Drop Shadow */}
    <ellipse cx="50" cy="78" rx="24" ry="7" fill="#64748b" opacity="0.4" />
    {/* The 8-Ball */}
    <g transform="translate(50, 48)">
      <circle cx="0" cy="0" r="28" fill="url(#poolBall8)" />
      {/* White circle target */}
      <circle cx="2" cy="-2" r="12" fill="#ffffff" />
      {/* Number 8 */}
      <text
        x="2"
        y="4"
        textAnchor="middle"
        fontSize="17"
        fontWeight="900"
        fontFamily="sans-serif"
        fill="#0f172a"
      >
        8
      </text>
      {/* Specular gloss highlight */}
      <circle cx="-9" cy="-12" r="10" fill="url(#ballShine)" />
    </g>
  </svg>
);

export default PoolGraphic;
