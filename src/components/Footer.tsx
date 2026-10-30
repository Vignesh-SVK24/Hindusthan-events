'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#040711] text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-11 rounded-lg overflow-hidden bg-white/95 p-1 border border-amber-400/50">
            <Image
              src="/college-logo.jpg"
              alt="Hindusthan Logo"
              fill
              className="object-contain"
              sizes="36px"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Hindusthan Educational & Charitable Trust</p>
            <p className="text-xs text-slate-500">College Events Hub • All Rights Reserved © {new Date().getFullYear()}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <a href="#events-discovery" className="hover:text-amber-400 transition-colors">
            Event Directory
          </a>
          <a href="#about-section" className="hover:text-amber-400 transition-colors">
            Campus Infrastructure
          </a>
          <Link href="/admin" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Portal
          </Link>
        </div>

        {/* Built With */}
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span>Engineered for excellence with Next.js & Framer Motion</span>
        </div>

      </div>
    </footer>
  );
}
