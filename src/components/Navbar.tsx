'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut, 
  Sparkles,
  Lock
} from 'lucide-react';

interface NavbarProps {
  onReplayIntro?: () => void;
}

export default function Navbar({ onReplayIntro }: NavbarProps) {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
      {/* Floating Spatial Pill Container */}
      <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-full bg-white/90 backdrop-blur-xl border border-[#F0E8D4] shadow-[0_10px_30px_-5px_rgba(231,184,63,0.1),0_4px_12px_-2px_rgba(0,0,0,0.03)] px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* College Identity & Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-12 sm:w-12 sm:h-14 rounded-xl overflow-hidden bg-white p-1 border border-[#F0E8D4] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/college-logo.jpg"
                alt="Hindusthan Logo"
                fill
                priority
                className="object-contain p-0.5"
                sizes="48px"
              />
            </div>
            <div className="flex flex-col max-w-[190px] xs:max-w-[240px] sm:max-w-md md:max-w-none">
              <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-tight text-[#252525] group-hover:text-[#C99A27] transition-colors uppercase leading-tight font-sans">
                HINDUSTHAN COLLEGE OF ENGINEERING AND TECHNOLOGY
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-wider text-[#77736A] uppercase">
                Events & Discovery Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              href="/"
              className="px-3.5 py-2 text-xs lg:text-sm font-semibold text-[#252525] hover:text-[#C99A27] hover:bg-[#FFF9E8] rounded-full transition-all"
            >
              Home
            </Link>
            <Link
              href="/#events-discovery"
              className="px-3.5 py-2 text-xs lg:text-sm font-semibold text-[#252525] hover:text-[#C99A27] hover:bg-[#FFF9E8] rounded-full transition-all"
            >
              All Events
            </Link>
            <Link
              href="/#events-discovery"
              className="px-3.5 py-2 text-xs lg:text-sm font-semibold text-[#252525] hover:text-[#C99A27] hover:bg-[#FFF9E8] rounded-full transition-all"
            >
              Upcoming
            </Link>
            <Link
              href="/#about-section"
              className="px-3.5 py-2 text-xs lg:text-sm font-semibold text-[#252525] hover:text-[#C99A27] hover:bg-[#FFF9E8] rounded-full transition-all"
            >
              About
            </Link>

            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                title="Replay College Logo Intro"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#C99A27] bg-[#FFF0B3]/50 hover:bg-[#FFE99A] border border-[#F0E8D4] rounded-full transition-all ml-1 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intro</span>
              </button>
            )}
          </nav>

          {/* Right Action / Admin Controls */}
          <div className="hidden md:flex items-center space-x-2.5">
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE99A] hover:bg-[#E7B83F] border border-[#E7B83F]/30 text-xs font-black text-[#252525] shadow-sm transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C99A27]" />
                  <span>Admin CMS</span>
                </Link>

                <button
                  onClick={() => logout()}
                  title="Sign out of Admin Session"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-bold text-[#77736A] transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-xs font-black text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] rounded-full shadow-[0_4px_12px_rgba(231,184,63,0.25)] transition-all ml-0.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                aria-label="Replay Logo Intro"
                className="p-2 text-[#C99A27] bg-[#FFF0B3]/50 rounded-full"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2.5 text-[#252525] hover:text-[#C99A27] rounded-full bg-[#FFFDF5] border border-[#F0E8D4] shadow-sm"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Floating Spatial Sheet) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl rounded-3xl border border-[#F0E8D4] bg-white/95 backdrop-blur-2xl px-5 pt-4 pb-6 space-y-3 shadow-[0_20px_40px_rgba(180,140,40,0.12)] animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm font-semibold text-[#252525] hover:bg-[#FFF9E8] rounded-xl"
          >
            Home
          </Link>
          <Link
            href="/#events-discovery"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm font-semibold text-[#252525] hover:bg-[#FFF9E8] rounded-xl"
          >
            All Events
          </Link>
          <Link
            href="/#about-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm font-semibold text-[#252525] hover:bg-[#FFF9E8] rounded-xl"
          >
            About Hindusthan
          </Link>

          <div className="pt-3 border-t border-[#F0E8D4]">
            {isAdmin ? (
              <div className="space-y-2">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-3.5 py-3 text-sm font-black text-[#252525] bg-[#FFE99A] rounded-2xl text-center shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C99A27]" />
                  <span>Admin CMS Dashboard</span>
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-2xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Admin</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-black text-[#252525] bg-[#FFE99A] rounded-2xl shadow-sm"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
