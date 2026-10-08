import React from "react";

const VolleyballGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Volleyball">
    <defs>
      <radialGradient id="vballShadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#64748b" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
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
    {/* Shadow */}
    <ellipse cx="50" cy="80" rx="22" ry="6" fill="url(#vballShadow)" />
    {/* Volleyball with classic Blue, Yellow & White panels */}
    <g transform="translate(50, 48) rotate(-15)">
      {/* Base sphere */}
      <circle cx="0" cy="0" r="26" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
      {/* Blue Panels */}
      <path d="M 0 -26 C 14 -26, 26 -14, 26 0 C 14 0, 0 -14, 0 -26 Z" fill="#2563eb" stroke="#1e293b" strokeWidth="1.2" />
      <path d="M -26 0 C -26 14, -14 26, 0 26 C 0 14, -14 0, -26 0 Z" fill="#1d4ed8" stroke="#1e293b" strokeWidth="1.2" />
      {/* Yellow Panels */}
      <path d="M 0 -26 C -14 -26, -26 -14, -26 0 C -14 0, 0 -14, 0 -26 Z" fill="#eab308" stroke="#1e293b" strokeWidth="1.2" />
      <path d="M 26 0 C 26 14, 14 26, 0 26 C 0 14, 14 0, 26 0 Z" fill="#facc15" stroke="#1e293b" strokeWidth="1.2" />
      {/* White Accent Strips / Center Curves */}
      <path d="M -18 -18 Q 0 0 18 18" stroke="#f8fafc" strokeWidth="3" fill="none" />
      <path d="M 18 -18 Q 0 0 -18 18" stroke="#f8fafc" strokeWidth="3" fill="none" />
      <circle cx="0" cy="0" r="26" fill="none" stroke="#1e293b" strokeWidth="1.8" />
    </g>
  </svg>
);

export default VolleyballGraphic;
