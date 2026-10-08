import React from "react";

const CricketNetsGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Cricket Nets">
    <defs>
      <linearGradient id="netTunnel" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f0fdf4" />
        <stop offset="100%" stopColor="#bbf7d0" />
      </linearGradient>
      <linearGradient id="netPitch" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
      <pattern id="cricketNetPattern" width="4" height="4" patternUnits="userSpaceOnUse">
        <path d="M 0 0 L 4 4 M 4 0 L 0 4" fill="none" stroke="#4ade80" strokeWidth="0.5" />
      </pattern>
    </defs>
    {/* Net Tunnel Perspective Frame */}
    {/* Left Net */}
    <polygon points="10,8 35,40 35,76 10,94" fill="url(#cricketNetPattern)" opacity="0.8" />
    {/* Right Net */}
    <polygon points="90,8 65,40 65,76 90,94" fill="url(#cricketNetPattern)" opacity="0.8" />
    {/* Top Ceiling Net */}
    <polygon points="10,8 90,8 65,40 35,40" fill="url(#cricketNetPattern)" opacity="0.6" />
    {/* Tunnel metal arches */}
    <polyline points="10,94 10,8 90,8 90,94" fill="none" stroke="#22c55e" strokeWidth="2.5" />
    <polyline points="22,86 22,24 78,24 78,86" fill="none" stroke="#86efac" strokeWidth="1.5" />
    <polyline points="35,76 35,40 65,40 65,76" fill="none" stroke="#22c55e" strokeWidth="1.8" />
    {/* Green Turf Pitch */}
    <polygon points="35,76 65,76 75,94 25,94" fill="url(#netPitch)" />
    {/* Crease line */}
    <line x1="33" y1="79" x2="67" y2="79" stroke="#ffffff" strokeWidth="1.5" />
    {/* Far Wickets */}
    <g transform="translate(47, 56)">
      <rect x="0" y="2" width="1.5" height="15" fill="#f59e0b" />
      <rect x="3" y="2" width="1.5" height="15" fill="#f59e0b" />
      <rect x="6" y="2" width="1.5" height="15" fill="#f59e0b" />
      <line x1="-1" y1="1" x2="8" y2="1" stroke="#d97706" strokeWidth="1.5" />
    </g>
  </svg>
);

export default CricketNetsGraphic;
