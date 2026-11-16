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
    <main className="min-h-screen w-full text-[#252525] selection:bg-[#FFE99A] selection:text-[#252525] flex flex-col justify-between relative overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* FULL-SCREEN BACKGROUND: HICET CAMPUS FRONT VIEW           */}
      {/* Minimal Gradient Level for Maximum Campus Photo Clarity   */}
      {/* ========================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        
        {/* Full-screen HICET Campus Front-view Photograph */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/hicet-campus.jpg"
            alt="Hindusthan College of Engineering and Technology Campus Front View"
            fill
            priority
            quality={95}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Minimal Subtle Warm-Yellow & Cream Gradient Tint */}
        {/* Reduced to minimum level to preserve the vivid, natural campus colors & architecture */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF5]/25 via-transparent to-[#FFFDF5]/30" />
        <div className="absolute inset-0 bg-[#FFFDF5]/15" />
      </div>

      {/* Main Split-Screen Content Layer */}
      <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row items-stretch">
        
        {/* ========================================================= */}
        {/* LEFT HERO SECTION (~55% width on desktop)                */}
        {/* ========================================================= */}
        <section className="w-full lg:w-[55%] xl:w-[56%] flex flex-col justify-between p-4 sm:p-8 md:p-10 lg:p-12 xl:p-16 border-b lg:border-b-0 lg:border-r border-[#F0E8D4]/40">
          
          {/* Top Bar: Navigation Link & Campus Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center justify-between gap-4 mb-6 sm:mb-8"
          >
            {/* Back to Website Link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/95 hover:bg-[#FFE99A] border border-[#F0E8D4] text-xs font-bold text-[#252525] transition-all shadow-spatial-sm group backdrop-blur-md"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Website</span>
            </Link>

            {/* Small Label: HICET | CAMPUS EVENTS */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/95 border border-[#E7B83F]/40 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#C99A27] shadow-spatial-sm backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[#E7B83F]" />
              <span>HICET | CAMPUS EVENTS</span>
            </div>
          </motion.div>

          {/* Frosted Spatial Hero Card for Maximum Text Readability */}
          <div className="my-auto py-2 sm:py-4 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              className="rounded-3xl p-5 sm:p-8 bg-white/88 backdrop-blur-md border border-[#F0E8D4] shadow-[0_16px_40px_rgba(231,184,63,0.12),0_4px_16px_rgba(0,0,0,0.04)] space-y-6 sm:space-y-7"
            >
              
              {/* College Logo & Institution Name */}
              <div className="flex items-center gap-3.5">
                <div className="relative w-11 h-13 sm:w-13 sm:h-15 rounded-xl overflow-hidden bg-white p-1 border border-[#F0E8D4] shadow-xs shrink-0">
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
              </div>

              {/* Main Headline & Supporting Text */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-4xl font-black text-[#252525] tracking-tight leading-[1.18] font-sans">
                  Every Event Begins With an{' '}
                  <span className="relative inline-block text-[#C99A27]">
                    Experience.
                    <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-[#FFE99A] -z-10 rounded-full" />
                  </span>
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-[#5C5850] font-medium leading-relaxed">
                  Discover, organize and manage exciting campus events, celebrations and technical experiences at Hindusthan College of Engineering and Technology.
                </p>
              </div>

              {/* Abstract Spatial Event-Ticket Motif */}
              <div className="relative rounded-2xl bg-[#FFFDF5]/90 border border-[#F0E8D4] p-4 shadow-xs overflow-hidden">
                
                {/* Perforated Notch Details */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border border-[#F0E8D4]" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border border-[#F0E8D4]" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                  
                  {/* Ticket Left: Feature Pillars */}
                  <div className="space-y-1.5 pr-0 sm:pr-3 sm:border-r sm:border-dashed sm:border-[#F0E8D4]">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#C99A27]">
                      <Ticket className="w-3.5 h-3.5 text-[#E7B83F]" />
                      <span>HiCET Event Management</span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#252525] leading-snug">
                      Tech Symposia, Hackathons, Cultural Festivals & Sports
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#FFF9E8] text-[9.5px] font-bold text-[#77736A] border border-[#F0E8D4]">
                        Registration ON/OFF
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#FFF9E8] text-[9.5px] font-bold text-[#77736A] border border-[#F0E8D4]">
                        QR Pass
                      </span>
                    </div>
                  </div>

                  {/* Ticket Right: Academic Stats & Verification */}
                  <div className="space-y-1.5 pl-0 sm:pl-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#77736A]">
                      <Calendar className="w-3.5 h-3.5 text-[#C99A27]" />
                      <span>Academic Season 2025–2026</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-bold text-[#252525]">
                        Dept. of AIML Central Repository
                      </span>
                    </div>
                    <p className="text-[10.5px] text-[#77736A] leading-snug">
                      Authorized coordinators manage attendee CSV exports & historical records.
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
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4 text-xs text-[#4A4740] flex flex-wrap items-center justify-between gap-2"
          >
            <div className="px-3.5 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-[#F0E8D4]/80 shadow-xs">
              <span>Department of Artificial Intelligence and Machine Learning (AIML)</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-[#F0E8D4]/80 shadow-xs font-semibold text-[#252525]">
              Coimbatore, Tamil Nadu
            </div>
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
            
            {/* Floating Spatial Login Card with High-Clarity Frosted Depth */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-9 md:p-10 border border-[#F0E8D4] shadow-[0_20px_50px_rgba(231,184,63,0.18),0_8px_24px_rgba(0,0,0,0.06)] space-y-6">
              
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
