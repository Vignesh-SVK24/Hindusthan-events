'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  Ticket,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onReplayIntro?: () => void;
}

export default function Navbar({ onReplayIntro }: NavbarProps) {
  const { user, logout, quickLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
      {/* Floating Spatial Navigation Surface Container */}
      <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-full bg-white/90 backdrop-blur-xl border border-[#F0E8D4] shadow-[0_10px_30px_-5px_rgba(231,184,63,0.1),0_4px_12px_-2px_rgba(0,0,0,0.03)] px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* College Identity & Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-12 sm:w-12 sm:h-14 rounded-xl overflow-hidden bg-white p-1 border border-[#F0E8D4] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/college-logo.jpg"
                alt="Hindusthan Logo"
                fill
                className="object-contain p-0.5"
                sizes="48px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-black tracking-wide text-[#252525] group-hover:text-[#C99A27] transition-colors uppercase leading-tight font-sans">
                HINDUSTHAN
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#77736A] uppercase">
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

          {/* Right Action / Authentication Controls */}
          <div className="hidden md:flex items-center space-x-2.5">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] hover:border-[#E7B83F] shadow-sm transition-all text-left"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    user.role === 'admin' 
                      ? 'bg-[#E7B83F] text-[#252525] font-black shadow-sm' 
                      : 'bg-[#FFF0B3] text-[#252525]'
                  }`}>
                    {user.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#252525] max-w-[120px] truncate leading-tight">
                      {user.full_name}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${
                      user.role === 'admin' ? 'text-[#C99A27]' : 'text-[#77736A]'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#77736A] ml-0.5" />
                </button>

                {/* Spatial Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#F0E8D4] shadow-[0_15px_35px_rgba(180,140,40,0.12)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#F0E8D4]">
                      <p className="text-[10px] text-[#77736A]">Signed in as</p>
                      <p className="text-xs font-semibold text-[#252525] truncate">{user.email}</p>
                    </div>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#C99A27] hover:bg-[#FFF9E8] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin CMS Dashboard
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#252525] hover:bg-[#FFF9E8] transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-[#C99A27]" />
                      My Event Registrations
                    </Link>

                    <div className="border-t border-[#F0E8D4] my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* 1-Click Fast Switch Demo Buttons */}
                <button
                  onClick={() => quickLogin('admin')}
                  className="px-3 py-1.5 text-xs font-bold text-[#252525] bg-[#FFF0B3]/60 hover:bg-[#FFE99A] border border-[#F0E8D4] rounded-full transition-all shadow-sm"
                  title="Instant Admin Access for Evaluation"
                >
                  ⚡ Admin Demo
                </button>
                <button
                  onClick={() => quickLogin('student')}
                  className="px-3 py-1.5 text-xs font-bold text-[#252525] bg-[#FFF6D8] hover:bg-[#FFE99A] border border-[#F0E8D4] rounded-full transition-all shadow-sm"
                  title="Instant Student Access for Evaluation"
                >
                  ⚡ Student Demo
                </button>
                
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-black text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] rounded-full shadow-[0_4px_12px_rgba(231,184,63,0.25)] transition-all ml-0.5"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="p-2 text-[#C99A27] bg-[#FFF0B3]/50 rounded-full"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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

          {user ? (
            <div className="pt-3 border-t border-[#F0E8D4] space-y-2">
              <div className="px-3.5 py-2.5 bg-[#FFF9E8] rounded-2xl border border-[#F0E8D4]">
                <p className="text-xs font-black text-[#252525]">{user.full_name}</p>
                <p className="text-[11px] text-[#C99A27] uppercase font-bold">{user.role} • {user.email}</p>
              </div>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 text-sm font-bold text-[#252525] bg-[#FFE99A] rounded-xl text-center shadow-sm"
                >
                  Admin CMS Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 text-sm font-semibold text-[#252525] bg-[#FFF0B3]/50 rounded-xl"
              >
                My Event Registrations
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#F0E8D4] space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    quickLogin('admin');
                  }}
                  className="px-3 py-2.5 text-xs font-bold text-[#252525] bg-[#FFF0B3]/70 border border-[#F0E8D4] rounded-xl text-center shadow-sm"
                >
                  ⚡ Admin Demo
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    quickLogin('student');
                  }}
                  className="px-3 py-2.5 text-xs font-bold text-[#252525] bg-[#FFF6D8] border border-[#F0E8D4] rounded-xl text-center shadow-sm"
                >
                  ⚡ Student Demo
                </button>
              </div>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3 text-center text-sm font-black text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] rounded-2xl shadow-[0_4px_12px_rgba(231,184,63,0.25)]"
              >
                Sign In / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
