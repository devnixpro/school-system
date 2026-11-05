'use client';
import React from 'react';

export const GraduationCapIcon = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Top Diamond Gradient (Light Blue to Darker Blue) */}
        <linearGradient id="capTopGradient" x1="20" y1="20" x2="80" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Base Bottom Gradient (White to Soft Gray shadow) */}
        <linearGradient id="capBaseGradient" x1="50" y1="50" x2="50" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>

      {/* 3D Base Cap Box */}
      <path
        d="M 25,52 L 50,65 L 75,52 L 75,68 C 75,76 50,84 50,84 C 50,84 25,76 25,68 Z"
        fill="url(#capBaseGradient)"
      />

      {/* Top Diamond Board */}
      <path
        d="M 50,22 L 88,38 L 50,54 L 12,38 Z"
        fill="url(#capTopGradient)"
      />

      {/* Side Tassel Strap & Knob */}
      <path
        d="M 76,43 L 80,58"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      
      <circle cx="80" cy="62" r="4.5" fill="#38BDF8" />
    </svg>
  );
};

export default GraduationCapIcon;