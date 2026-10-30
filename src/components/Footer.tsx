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
            <p className="text-sm font-black text-[#252525]">Hindusthan Educational & Charitable Trust</p>
            <p className="text-xs text-[#77736A]">College Events Hub • All Rights Reserved © {new Date().getFullYear()}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
          <Link href="/" className="hover:text-[#C99A27] transition-colors">
            Home
          </Link>
          <a href="#events-discovery" className="hover:text-[#C99A27] transition-colors">
            Event Directory
          </a>
          <a href="#about-section" className="hover:text-[#C99A27] transition-colors">
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
    </footer>
  );
}
