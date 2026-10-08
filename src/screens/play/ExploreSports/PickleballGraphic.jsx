import React from "react";

const PickleballGraphic = () => (
  <svg viewBox="0 0 100 100" className="sport-svg" aria-label="Pickleball">
    <defs>
      <linearGradient id="picklePaddle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="60%" stopColor="#64748b" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <radialGradient id="pickleBall" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#eab308" />
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
    {/* Paddle Shadow */}
    <ellipse cx="48" cy="80" rx="20" ry="5" fill="#94a3b8" opacity="0.3" />
    {/* Paddle */}
    <g transform="rotate(28 48 55)">
      {/* Face */}
      <rect x="30" y="16" width="28" height="38" rx="8" fill="url(#picklePaddle)" stroke="#334155" strokeWidth="2" />
      <rect x="33" y="19" width="22" height="32" rx="5" fill="#64748b" opacity="0.4" />
      {/* Handle */}
      <rect x="40" y="54" width="8" height="24" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
      {/* Handle wrap lines */}
      <line x1="40" y1="60" x2="48" y2="62" stroke="#a16207" strokeWidth="0.8" />
      <line x1="40" y1="66" x2="48" y2="68" stroke="#a16207" strokeWidth="0.8" />
      <line x1="40" y1="72" x2="48" y2="74" stroke="#a16207" strokeWidth="0.8" />
    </g>
    {/* Yellow Perforated Ball */}
    <g transform="translate(38, 36)">
      <circle cx="0" cy="0" r="10" fill="url(#pickleBall)" stroke="#a16207" strokeWidth="0.5" />
      {/* Perforations */}
      <circle cx="-3" cy="-3" r="1.5" fill="#713f12" opacity="0.6" />
      <circle cx="3" cy="-2" r="1.5" fill="#713f12" opacity="0.6" />
      <circle cx="0" cy="3" r="1.5" fill="#713f12" opacity="0.6" />
      <circle cx="-5" cy="2" r="1.3" fill="#713f12" opacity="0.6" />
      <circle cx="5" cy="3" r="1.3" fill="#713f12" opacity="0.6" />
    </g>
  </svg>
);

export default PickleballGraphic;
