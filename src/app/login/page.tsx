'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  Calendar,
  Ticket,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Please enter your administrator username or email.');
      return;
    }

    if (!password) {
      setError('Please enter the administrator password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await login(password);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please check your credentials.');
        return;
      }
      router.push('/admin');
    } catch {
      setError('A connection error occurred. Please verify your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#FFFDF5] text-[#252525] selection:bg-[#FFE99A] selection:text-[#252525] flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Background Layer: Delicate Golden Glows & Spatial Depth Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Golden Ambient Orbs */}
        <div className="absolute -top-32 -left-32 w-96 sm:w-[520px] h-96 sm:h-[520px] bg-gradient-to-br from-[#FFE99A]/40 via-[#FFF9E8]/30 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute top-1/3 right-0 w-80 sm:w-[460px] h-80 sm:h-[460px] bg-gradient-to-bl from-[#FFE99A]/30 via-[#FFF0B3]/20 to-transparent rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#FFF0B3]/35 to-transparent rounded-full blur-3xl opacity-50" />

        {/* Subtle Decorative Geometric Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#E7B83F 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Main Split-Screen Container */}
      <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row items-stretch">
        
        {/* ========================================================= */}
        {/* LEFT HERO SECTION (~55% width on desktop)                */}
        {/* ========================================================= */}
        <section className="w-full lg:w-[55%] xl:w-[56%] flex flex-col justify-between p-5 sm:p-8 md:p-10 lg:p-12 xl:p-16 border-b lg:border-b-0 lg:border-r border-[#F0E8D4]/80">
          
          {/* Top Bar: Navigation Link & Campus Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center justify-between gap-4 mb-8 sm:mb-12"
          >
            {/* Back to Website Link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/90 hover:bg-[#FFE99A] border border-[#F0E8D4] text-xs font-bold text-[#252525] transition-all shadow-xs group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Website</span>
            </Link>

            {/* Small Label: HICET | CAMPUS EVENTS */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FFF9E8] border border-[#E7B83F]/30 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#C99A27] shadow-xs">
              <Sparkles className="w-3 h-3 text-[#E7B83F]" />
              <span>HICET | CAMPUS EVENTS</span>
            </div>
          </motion.div>

          {/* Core Brand & Inspiring Hero Headline */}
          <div className="space-y-6 sm:space-y-8 max-w-2xl my-auto py-4">
            
            {/* College Logo & Institution Name */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="flex items-center gap-3.5"
            >
              <div className="relative w-12 h-14 sm:w-14 sm:h-16 rounded-2xl overflow-hidden bg-white p-1 border border-[#F0E8D4] shadow-spatial-sm shrink-0">
                <Image
                  src="/college-logo.jpg"
                  alt="Hindusthan College of Engineering and Technology"
                  fill
                  priority
                  className="object-contain p-0.5"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#C99A27] block">
                  Hindusthan Educational & Charitable Trust
                </span>
                <h2 className="text-xs sm:text-sm md:text-base font-black text-[#252525] uppercase tracking-tight leading-tight">
                  Hindusthan College of Engineering and Technology
                </h2>
              </div>
            </motion.div>

            {/* Main Headline & Supporting Text */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="space-y-3 sm:space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-5xl font-black text-[#252525] tracking-tight leading-[1.15] font-sans">
                Every Event Begins With an{' '}
                <span className="relative inline-block text-[#C99A27]">
                  Experience.
                  <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-[#FFE99A] -z-10 rounded-full" />
                </span>
              </h1>
              <p className="text-sm sm:text-base text-[#77736A] leading-relaxed max-w-xl font-normal">
                Discover, organize and manage exciting campus events, celebrations and technical experiences at Hindusthan College of Engineering and Technology.
              </p>
            </motion.div>

            {/* Subtle Decorative Campus Event Elements (Abstract Ticket & Calendar Motifs) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="pt-2 sm:pt-4"
            >
              {/* Abstract Spatial Event-Ticket Motif */}
              <div className="relative rounded-3xl bg-white/80 backdrop-blur-md border border-[#F0E8D4] p-4 sm:p-5 shadow-[0_12px_32px_rgba(231,184,63,0.08)] overflow-hidden">
                
                {/* Decorative Perforated Notch Details */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#FFFDF5] border border-[#F0E8D4]" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#FFFDF5] border border-[#F0E8D4]" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  
                  {/* Ticket Left: Feature Pillars */}
                  <div className="space-y-2 pr-0 sm:pr-4 sm:border-r sm:border-dashed sm:border-[#F0E8D4]">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C99A27]">
                      <Ticket className="w-4 h-4 text-[#E7B83F]" />
                      <span>HiCET Event Management</span>
                    </div>
                    <p className="text-xs font-semibold text-[#252525]">
                      Unified Portal for Tech Symposia, Hackathons, Cultural Festivals & Sports
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#FFF9E8] text-[10px] font-bold text-[#77736A] border border-[#F0E8D4]">
                        Live Registration ON/OFF
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#FFF9E8] text-[10px] font-bold text-[#77736A] border border-[#F0E8D4]">
                        QR Pass Generation
                      </span>
                    </div>
                  </div>

                  {/* Ticket Right: Academic Stats & Verification */}
                  <div className="space-y-2 pl-0 sm:pl-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#77736A]">
                      <Calendar className="w-4 h-4 text-[#C99A27]" />
                      <span>Academic Season 2025–2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-[#252525]">
                        Department of AIML Central Repository
                      </span>
                    </div>
                    <p className="text-[11px] text-[#77736A] leading-snug">
                      Authorized department coordinators publish events, manage attendee CSV exports & historical records.
                    </p>
                  </div>

                </div>
              </div>
            </motion.div>

          </div>

          {/* Left Footer: Institutional Attribution */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-6 sm:pt-8 text-xs text-[#77736A] flex flex-wrap items-center justify-between gap-2 border-t border-[#F0E8D4]/60"
          >
            <span>Department of Artificial Intelligence and Machine Learning (AIML)</span>
            <span className="font-semibold text-[#252525]">Coimbatore, Tamil Nadu</span>
          </motion.div>

        </section>

        {/* ========================================================= */}
        {/* RIGHT LOGIN SECTION (~45% width on desktop)               */}
        {/* ========================================================= */}
        <section className="w-full lg:w-[45%] xl:w-[44%] flex items-center justify-center p-4 sm:p-8 md:p-10 lg:p-12 xl:p-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="w-full max-w-md"
          >
            
            {/* Floating Spatial Login Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-9 md:p-10 border border-[#F0E8D4] shadow-[0_20px_50px_rgba(231,184,63,0.14),0_8px_20px_rgba(0,0,0,0.03)] space-y-6">
              
              {/* Card Header: Welcome Back */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9E8] border border-[#FFE99A] text-[11px] font-black uppercase tracking-wider text-[#C99A27]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E7B83F]" />
                  <span>Admin Console</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight font-sans">
                  Welcome Back!
                </h2>
                
                <p className="text-xs sm:text-sm text-[#77736A] leading-relaxed">
                  Sign in to access the event administration dashboard.
                </p>
              </div>

              {/* Error Alert Box */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-semibold"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </motion.div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                
                {/* Field 1: Username or Email */}
                <div>
                  <label 
                    htmlFor="admin-username-input" 
                    className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-2"
                  >
                    Username or Email
                  </label>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77736A]">
                      <User className="w-4 h-4" />
                    </div>
                    
                    <input
                      id="admin-username-input"
                      type="text"
                      required
                      autoFocus
                      autoComplete="username"
                      placeholder="e.g. admin or admin@hindusthan.net"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-sm focus:outline-none focus:border-[#E7B83F] focus:ring-2 focus:ring-[#FFE99A]/50 transition-all placeholder:text-[#77736A]/50 font-sans"
                    />
                  </div>
                </div>

                {/* Field 2: Password */}
                <div>
                  <label 
                    htmlFor="admin-password-input" 
                    className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-2"
                  >
                    Password
                  </label>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77736A]">
                      <Lock className="w-4 h-4" />
                    </div>
                    
                    <input
                      id="admin-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="Enter administrator password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 sm:py-3.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-sm focus:outline-none focus:border-[#E7B83F] focus:ring-2 focus:ring-[#FFE99A]/50 transition-all placeholder:text-[#77736A]/50 font-sans"
                    />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#77736A] hover:text-[#252525] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#F0E8D4] text-[#E7B83F] focus:ring-[#FFE99A] accent-[#E7B83F] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#77736A] group-hover:text-[#252525] transition-colors">
                      Remember this device
                    </span>
                  </label>
                  
                  <span className="text-[11px] font-bold text-[#C99A27] bg-[#FFF9E8] px-2 py-0.5 rounded-full border border-[#F0E8D4]">
                    7-Day Secure Session
                  </span>
                </div>

                {/* Full-Width Golden-Accent Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-[0_4px_16px_rgba(231,184,63,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99] cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#252525]" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <span>Sign In to Dashboard →</span>
                  )}
                </button>

              </form>

              {/* Below Form: Authorized Administrators Only */}
              <div className="pt-4 border-t border-[#F0E8D4]/80 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[11px] font-black uppercase tracking-wider text-[#77736A]">
                  <Lock className="w-3 h-3 text-[#C99A27]" />
                  <span>Authorized Administrators Only</span>
                </div>

                <p className="text-[11px] text-[#77736A] leading-relaxed">
                  HiCET College Events Hub • Department of AIML
                  <br />
                  Institutional access only. No public or student registration is required.
                </p>
              </div>

            </div>

          </motion.div>

        </section>

      </div>

    </main>
  );
}
