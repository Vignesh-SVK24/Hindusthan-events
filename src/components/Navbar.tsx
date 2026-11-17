'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut, 
  Sparkles,
  User,
  ChevronDown,
  Calendar,
  History,
  LogIn,
  Settings,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface NavbarProps {
  onReplayIntro?: () => void;
}

export default function Navbar({ onReplayIntro }: NavbarProps) {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    router.push('/login');
  };

  // Helper to extract user initials
  const getInitials = (name?: string) => {
    if (!name) return 'HC';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
      {/* Floating Spatial Pill Container */}
      <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-full bg-white/92 backdrop-blur-xl border border-[#F0E8D4] shadow-[0_10px_30px_-5px_rgba(231,184,63,0.1),0_4px_12px_-2px_rgba(0,0,0,0.03)] px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* College Identity & Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <div className="relative w-9 h-11 xs:w-10 xs:h-12 sm:w-12 sm:h-14 rounded-xl overflow-hidden bg-white p-1 border border-[#F0E8D4] shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
              <Image
                src="/college-logo.jpg"
                alt="Hindusthan Logo"
                fill
                priority
                className="object-contain p-0.5"
                sizes="(max-width: 640px) 40px, 48px"
              />
            </div>
            <div className="flex flex-col min-w-0 max-w-[210px] xs:max-w-[260px] sm:max-w-md md:max-w-none">
              <span className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-black tracking-tight text-[#252525] group-hover:text-[#C99A27] transition-colors uppercase leading-[1.15] font-sans">
                HINDUSTHAN COLLEGE OF ENGINEERING AND TECHNOLOGY
              </span>
              <span className="text-[8.5px] xs:text-[9.5px] sm:text-[10px] md:text-[11px] font-bold tracking-wider text-[#77736A] uppercase mt-0.5">
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
              href="/event-archives"
              className="px-3.5 py-2 text-xs lg:text-sm font-bold text-[#C99A27] bg-[#FFF9E8] border border-[#F0E8D4] hover:bg-[#FFE99A] hover:text-[#252525] rounded-full transition-all shadow-xs"
            >
              AIML Archives
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#C99A27] bg-[#FFF0B3]/50 hover:bg-[#FFE99A] border border-[#F0E8D4] rounded-full transition-all ml-1 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intro</span>
              </button>
            )}
          </nav>

          {/* Right Action / Authenticated User Profile Menu */}
          <div className="hidden md:flex items-center space-x-2.5">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-[#FFFDF5] hover:bg-[#FFF9E8] border border-[#F0E8D4] hover:border-[#E7B83F] shadow-xs transition-all cursor-pointer select-none group"
                >
                  {/* User Avatar Circle */}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-[#FFE99A] to-[#E7B83F] flex items-center justify-center text-xs font-black text-[#252525] border border-white shadow-xs shrink-0">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <span>{getInitials(user.full_name)}</span>
                    )}
                  </div>

                  {/* Name and Role Label */}
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-[#252525] group-hover:text-[#C99A27] transition-colors leading-tight line-clamp-1 max-w-[120px]">
                      {user.full_name}
                    </span>
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#77736A] leading-none">
                      {isAdmin ? 'Administrator' : 'Campus Member'}
                    </span>
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-[#77736A] group-hover:text-[#252525] transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Floating Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-white/95 backdrop-blur-2xl border border-[#F0E8D4] shadow-[0_20px_50px_rgba(231,184,63,0.18),0_8px_24px_rgba(0,0,0,0.06)] p-3 space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* Header: User Info Card */}
                    <div className="p-3 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-[#FFE99A] to-[#E7B83F] flex items-center justify-center text-sm font-black text-[#252525] border border-white shadow-xs shrink-0">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.full_name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <span>{getInitials(user.full_name)}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-[#252525] truncate">
                          {user.full_name}
                        </p>
                        <p className="text-[11px] text-[#77736A] truncate">
                          {user.email}
                        </p>
                        <div className="pt-1">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFE99A] text-[9.5px] font-black uppercase text-[#C99A27] border border-[#E7B83F]/40">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              Administrator
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[9.5px] font-black uppercase text-emerald-700 border border-emerald-200">
                              <Sparkles className="w-2.5 h-2.5" />
                              Campus Member
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="space-y-1">
                      {isAdmin && (
                        <>
                          <Link
                            href="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#252525] hover:bg-[#FFE99A] rounded-xl transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#C99A27]" />
                            <span>Admin CMS Dashboard</span>
                          </Link>
                          <Link
                            href="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#555] hover:bg-[#FFF9E8] rounded-xl transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5 text-[#C99A27]" />
                            <span>Create New Event</span>
                          </Link>
                        </>
                      )}

                      <Link
                        href="/#events-discovery"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#555] hover:bg-[#FFF9E8] rounded-xl transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#77736A]" />
                        <span>Browse Events Directory</span>
                      </Link>

                      <Link
                        href="/event-archives"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#555] hover:bg-[#FFF9E8] rounded-xl transition-colors"
                      >
                        <History className="w-3.5 h-3.5 text-[#77736A]" />
                        <span>AIML Historical Archives</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#555] hover:bg-[#FFF9E8] rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-[#77736A]" />
                        <span>Switch Account</span>
                      </button>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2 border-t border-[#F0E8D4]">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              /* If unauthenticated: Simple Sign In button */
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-xs font-black text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] rounded-full shadow-[0_4px_12px_rgba(231,184,63,0.25)] transition-all ml-0.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
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
        <div className="md:hidden mt-2 mx-auto max-w-7xl rounded-3xl border border-[#F0E8D4] bg-white/95 backdrop-blur-2xl p-4 sm:p-5 space-y-1.5 shadow-[0_20px_40px_rgba(180,140,40,0.12)] animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* User Status Bar if Logged In */}
          {user && (
            <div className="p-3 mb-2 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gradient-to-tr from-[#FFE99A] to-[#E7B83F] flex items-center justify-center text-xs font-black text-[#252525] border border-white shadow-xs shrink-0">
                {user.avatar_url ? (
                  <Image src={user.avatar_url} alt={user.full_name} fill className="object-cover" sizes="36px" />
                ) : (
                  <span>{getInitials(user.full_name)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-[#252525] truncate">{user.full_name}</p>
                <p className="text-[10.5px] text-[#77736A] truncate">{user.email}</p>
              </div>
              <span className="text-[9.5px] font-black uppercase text-[#C99A27] bg-[#FFE99A] px-2 py-0.5 rounded-full">
                {isAdmin ? 'Admin' : 'Member'}
              </span>
            </div>
          )}

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-sm font-semibold text-[#252525] hover:text-[#C99A27] hover:bg-[#FFF9E8] rounded-xl transition-colors"
          >
            Home
          </Link>
          <Link
            href="/#events-discovery"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-sm font-semibold text-[#252525] hover:text-[#C99A27] hover:bg-[#FFF9E8] rounded-xl transition-colors"
          >
            All Events
          </Link>
          <Link
            href="/#events-discovery"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-sm font-semibold text-[#252525] hover:text-[#C99A27] hover:bg-[#FFF9E8] rounded-xl transition-colors"
          >
            Upcoming Events
          </Link>
          <Link
            href="/event-archives"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-sm font-bold text-[#C99A27] bg-[#FFF9E8] border border-[#F0E8D4] hover:bg-[#FFE99A] hover:text-[#252525] rounded-xl transition-all shadow-xs"
          >
            AIML Event Archives
          </Link>
          <Link
            href="/#about-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-sm font-semibold text-[#252525] hover:text-[#C99A27] hover:bg-[#FFF9E8] rounded-xl transition-colors"
          >
            About
          </Link>

          <div className="pt-3 border-t border-[#F0E8D4]">
            {user ? (
              <div className="space-y-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-3.5 py-3 text-sm font-black text-[#252525] bg-[#FFE99A] rounded-2xl text-center shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#C99A27]" />
                    <span>Admin CMS Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-2xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Account</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-black text-[#252525] bg-[#FFE99A] rounded-2xl shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to HICET Events</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
