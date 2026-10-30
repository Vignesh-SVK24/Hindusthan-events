'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, 
  User, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Compass, 
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b19]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & College Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-white/95 p-1 border border-amber-400/50 shadow-md transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/college-logo.jpg"
                alt="Hindusthan Logo"
                fill
                className="object-contain p-0.5"
                sizes="48px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-wide text-white group-hover:text-amber-400 transition-colors uppercase leading-tight font-sans">
                HINDUSTHAN
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-amber-400/90 uppercase">
                Events & Discovery Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              href="/"
              className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#events-discovery"
              className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              All Events
            </Link>
            <Link
              href="/#events-discovery"
              className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              Upcoming
            </Link>
            <Link
              href="/#about-section"
              className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              About
            </Link>

            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                title="Replay College Logo Intro"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300/80 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intro</span>
              </button>
            )}
          </nav>

          {/* Right Action / Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 transition-all text-left"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    user.role === 'admin' 
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    {user.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white max-w-[120px] truncate leading-tight">
                      {user.full_name}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                      user.role === 'admin' ? 'text-amber-400' : 'text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0c1222] border border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-xs font-medium text-slate-200 truncate">{user.email}</p>
                    </div>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/10 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-emerald-400" />
                      My Event Registrations
                    </Link>

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left"
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
                  className="px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-lg transition-all"
                  title="Instant Admin Access for Evaluation"
                >
                  ⚡ Admin Demo
                </button>
                <button
                  onClick={() => quickLogin('student')}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/40 rounded-lg transition-all"
                  title="Instant Student Access for Evaluation"
                >
                  ⚡ Student Demo
                </button>
                
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all ml-1"
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
                className="p-2 text-amber-400 bg-amber-500/10 rounded-lg"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/80 border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#070b19] px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Home
          </Link>
          <Link
            href="/#events-discovery"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            All Events
          </Link>
          <Link
            href="/#about-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            About Hindusthan
          </Link>

          {user ? (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="px-3 py-2 bg-slate-900 rounded-lg border border-slate-800">
                <p className="text-xs font-bold text-white">{user.full_name}</p>
                <p className="text-[11px] text-amber-400 uppercase font-semibold">{user.role} • {user.email}</p>
              </div>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-amber-400 bg-amber-500/10 rounded-lg"
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 rounded-lg"
              >
                My Event Registrations
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    quickLogin('admin');
                  }}
                  className="px-3 py-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center"
                >
                  ⚡ Admin Demo
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    quickLogin('student');
                  }}
                  className="px-3 py-2 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center"
                >
                  ⚡ Student Demo
                </button>
              </div>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-sm font-bold text-slate-950 bg-amber-400 rounded-lg"
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
