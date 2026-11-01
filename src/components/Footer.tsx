'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#F0E8D4] bg-white text-[#77736A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-11 rounded-lg overflow-hidden bg-white p-1 border border-[#F0E8D4] shadow-sm">
            <Image
              src="/college-logo.jpg"
              alt="Hindusthan Logo"
              fill
              className="object-contain"
              sizes="36px"
            />
          </div>
          <div>
            <p className="text-sm font-black text-[#252525]">Hindusthan College of Engineering and Technology</p>
            <p className="text-xs text-[#77736A]">Events & Discovery Hub • Hindusthan Educational & Charitable Trust</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
          <Link href="/" className="hover:text-[#C99A27] transition-colors">
            Home
          </Link>
          <a href="/#events-discovery" className="hover:text-[#C99A27] transition-colors">
            Event Directory
          </a>
          <Link href="/event-archives" className="text-[#C99A27] hover:text-[#B38318] font-bold transition-colors">
            AIML Event Archives
          </Link>
          <a href="/#about-section" className="hover:text-[#C99A27] transition-colors">
            Campus Infrastructure
          </a>
          <Link href="/admin" className="text-[#C99A27] hover:text-[#B38318] font-black flex items-center gap-1.5 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Portal
          </Link>
        </div>

        {/* Spatial UI Badge */}
        <div className="text-xs text-[#77736A]">
          <span>Spatial UI Experience • Powered by Hindusthan Trust</span>
        </div>

      </div>

      {/* Department Initiative & Attribution Banner */}
      <div className="max-w-7xl mx-auto pt-6 mt-8 border-t border-[#F0E8D4]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-[#77736A]">
          <span className="font-bold text-[#252525]">Organized by:</span>
          <span>Department of Artificial Intelligence and Machine Learning (AIML)</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF9E8] border border-[#F0E8D4] text-[#252525] shadow-xs">
          <span className="text-[#77736A] font-semibold">Developed by:</span>
          <span className="font-bold text-[#C99A27]">Vignesh S — AIML</span>
        </div>
      </div>
    </footer>
  );
}
