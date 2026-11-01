'use client';

import React from 'react';

interface SpatialBackgroundProps {
  accentColor?: string;
  className?: string;
}

export default function SpatialBackground({ accentColor, className = '' }: SpatialBackgroundProps) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* 1. Subtle Architectural Dot Matrix Grid */}
      <div
        className="absolute inset-0 opacity-[0.24]"
        style={{
          backgroundImage: `radial-gradient(#E7B83F 1px, transparent 1px)`,
          backgroundSize: '38px 38px',
        }}
      />

      {/* 2. Soft Ambient Radial Light Orbs (Spatial Theme: Light Yellow & Warm White) */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[450px] bg-gradient-to-b from-[#FFF0B3]/40 via-[#FFF9E8]/30 to-transparent blur-[100px] animate-pulse-subtle" />
      
      <div className="absolute top-1/4 -right-20 w-[400px] sm:w-[600px] h-[500px] bg-radial-at-c from-[#FFE99A]/30 via-[#FFF6D8]/20 to-transparent blur-[90px] rounded-full" />
      
      <div className="absolute top-2/3 -left-28 w-[450px] sm:w-[650px] h-[550px] bg-radial-at-c from-[#FFF0B3]/35 via-[#FFFDF5]/20 to-transparent blur-[110px] rounded-full" />
      
      <div className="absolute bottom-10 right-1/4 w-[350px] sm:w-[500px] h-[400px] bg-radial-at-c from-[#FFE99A]/25 via-transparent to-transparent blur-[100px] rounded-full" />

      {/* Optional Custom Event Accent Color Blend */}
      {accentColor && (
        <div
          className="absolute top-12 right-12 w-[500px] h-[500px] rounded-full blur-[120px] opacity-25 transition-all duration-700"
          style={{ backgroundColor: accentColor }}
        />
      )}

      {/* 3. Delicate Abstract Curved Contour Lines (Vector SVG Waves) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.35]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
        fill="none"
      >
        <path
          d="M-100 250 C 350 120, 650 380, 1100 200 C 1300 120, 1450 180, 1600 160"
          stroke="url(#spatial-gold-gradient-1)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
        <path
          d="M-50 480 C 400 360, 750 620, 1200 440 C 1380 370, 1500 410, 1650 390"
          stroke="url(#spatial-gold-gradient-2)"
          strokeWidth="1.5"
        />
        <path
          d="M-80 720 C 300 600, 700 820, 1150 690 C 1350 630, 1480 670, 1600 640"
          stroke="url(#spatial-gold-gradient-1)"
          strokeWidth="1.2"
          strokeDasharray="6 8"
        />
        <defs>
          <linearGradient id="spatial-gold-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E7B83F" stopOpacity="0.05" />
            <stop offset="35%" stopColor="#E7B83F" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#C99A27" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#E7B83F" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="spatial-gold-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE99A" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#E7B83F" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#FFE99A" stopOpacity="0.08" />
          </linearGradient>
        </defs>
      </svg>

      {/* 4. Floating Translucent Spatial Geometric Shapes (Subtle Parallax / Floating) */}
      {/* Top Left Floating Rounded Square */}
      <div className="absolute top-28 left-[6%] w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/40 border border-[#F0E8D4]/70 shadow-[0_10px_30px_rgba(231,184,63,0.06)] backdrop-blur-xs animate-float-slow hidden md:block" />

      {/* Top Right Floating Translucent Pill */}
      <div className="absolute top-44 right-[8%] w-28 h-16 sm:w-36 sm:h-20 rounded-full bg-[#FFFDF5]/40 border border-[#FFE99A]/50 shadow-[0_8px_24px_rgba(231,184,63,0.05)] backdrop-blur-xs animate-float-reverse hidden lg:block" />

      {/* Mid Left Delicate Geometric Diamond */}
      <div className="absolute top-[55%] left-[4%] w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white/35 border border-[#F0E8D4]/60 shadow-xs rotate-45 animate-float-reverse hidden lg:block" />

      {/* Mid Right Floating Spatial Capsule */}
      <div className="absolute top-[65%] right-[5%] w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-[#FFF9E8]/35 border border-[#F0E8D4]/70 shadow-[0_12px_32px_rgba(231,184,63,0.05)] backdrop-blur-xs animate-float-slow hidden md:block" />

      {/* Bottom Center Subtle Translucent Ring */}
      <div className="absolute bottom-16 left-1/3 w-36 h-36 sm:w-48 sm:h-48 rounded-full border border-[#FFE99A]/30 pointer-events-none opacity-40 animate-pulse-subtle hidden sm:block" />
    </div>
  );
}
