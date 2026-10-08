import React from "react";

const SnookerGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Snooker">
    <defs>
      <radialGradient id="snookerRed" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="40%" stopColor="#dc2626" />
        <stop offset="90%" stopColor="#7f1d1d" />
        <stop offset="100%" stopColor="#450a0a" />
      </radialGradient>
      <linearGradient id="rackWood" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
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
    <ellipse cx="50" cy="80" rx="30" ry="7" fill="#94a3b8" opacity="0.35" />
    {/* Wooden Triangle Rack */}
    <polygon points="50,22 84,78 16,78" fill="none" stroke="url(#rackWood)" strokeWidth="4.5" strokeLinejoin="round" />
    {/* 15 Red Snooker Balls in Triangle Stack */}
    <g transform="translate(0, 3)">
      {/* Row 1 (Apex) */}
      <circle cx="50" cy="30" r="5" fill="url(#snookerRed)" />
      {/* Row 2 */}
      <circle cx="45" cy="39" r="5" fill="url(#snookerRed)" />
      <circle cx="55" cy="39" r="5" fill="url(#snookerRed)" />
      {/* Row 3 */}
      <circle cx="40" cy="48" r="5" fill="url(#snookerRed)" />
      <circle cx="50" cy="48" r="5" fill="url(#snookerRed)" />
      <circle cx="60" cy="48" r="5" fill="url(#snookerRed)" />
      {/* Row 4 */}
      <circle cx="35" cy="57" r="5" fill="url(#snookerRed)" />
      <circle cx="45" cy="57" r="5" fill="url(#snookerRed)" />
      <circle cx="55" cy="57" r="5" fill="url(#snookerRed)" />
      <circle cx="65" cy="57" r="5" fill="url(#snookerRed)" />
      {/* Row 5 (Base) */}
      <circle cx="30" cy="66" r="5" fill="url(#snookerRed)" />
      <circle cx="40" cy="66" r="5" fill="url(#snookerRed)" />
      <circle cx="50" cy="66" r="5" fill="url(#snookerRed)" />
      <circle cx="60" cy="66" r="5" fill="url(#snookerRed)" />
      <circle cx="70" cy="66" r="5" fill="url(#snookerRed)" />
    </g>
  </svg>
);

export default SnookerGraphic;
