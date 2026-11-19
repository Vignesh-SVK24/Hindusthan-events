'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  Mail,
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
  KeyRound,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import LogoIntro from '@/components/LogoIntro';
import { SkeletonBase, SkeletonTitle, SkeletonText, SkeletonButton, SkeletonInput } from '@/components/skeleton';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { user, isAdmin, isUser, isLoading: authChecking, loginAdmin, loginWithGoogle, sendEmailOtp, verifyEmailOtp, logout } = useAuth();

  // Intro animation state: Show if visitor hasn't seen intro this session
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const introViewed = sessionStorage.getItem('hindusthan_intro_viewed');
    if (!introViewed) {
      setShowIntro(true);
    }
  }, []);

  // View state: 'user' (normal user flow) or 'admin' (admin password flow)
  const [authMode, setAuthMode] = useState<'user' | 'admin'>('user');

  // Normal User Flow States (Passwordless Email OTP)
  const [email, setEmail] = useState('');
  const [otpStep, setOtpStep] = useState<'email' | 'otp'>('email');
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Admin Flow States (Username/Email + Password)
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminRemember, setAdminRemember] = useState(true);

  // Shared UI Feedback States
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Timer for OTP cooldown
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Handle Google Sign-In redirect
  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch {
      setError('Could not connect to Google authentication provider.');
      setGoogleLoading(false);
    }
  };

  // Step 1: Send Passwordless Email OTP
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await sendEmailOtp(email.trim());
      if (!res.success) {
        setError(res.error || 'Failed to send verification code. Please try again.');
        return;
      }

      setOtpStep('otp');
      setOtpCountdown(60);
      setSuccessMessage(`A 6-digit verification code has been dispatched to ${email.trim().toLowerCase()}.`);
    } catch {
      setError('A connection error occurred. Please verify your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Create Normal User Session
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await verifyEmailOtp(email.trim(), otpCode.trim());
      if (!res.success) {
        setError(res.error || 'Invalid or expired verification code. Please check and try again.');
        setOtpCode(''); // Clear OTP input on failure as required
        return;
      }

      // Normal users are redirected to the public homepage
      router.push('/');
    } catch {
      setError('A network error occurred during verification. Please try again.');
      setOtpCode('');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP (with 60s minimum cooldown)
  const handleResendOtp = async () => {
    if (otpCountdown > 0) return;
    setError(null);
    setLoading(true);
    try {
      const res = await sendEmailOtp(email.trim());
      if (!res.success) {
        setError(res.error || 'Could not dispatch a new code.');
      } else {
        setOtpCountdown(60);
        setSuccessMessage(`A fresh 6-digit code has been dispatched to ${email.trim().toLowerCase()}.`);
        setOtpCode('');
      }
    } finally {
      setLoading(false);
    }
  };

  // Admin Login Submission
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminUsername.trim()) {
      setError('Please enter your administrator username or email.');
      return;
    }

    if (!adminPassword) {
      setError('Please enter the administrator password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await loginAdmin(adminPassword);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please check your credentials.');
        return;
      }
      // Authorized Administrators are redirected to the admin dashboard
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
      {/* 1. INTRO SEQUENCE: Animated HICET College Logo Zoom-Out   */}
      {/* ========================================================= */}
      {showIntro && (
        <LogoIntro
          forceShow={showIntro}
          onComplete={() => {
            setShowIntro(false);
            sessionStorage.setItem('hindusthan_intro_viewed', 'true');
          }}
        />
      )}

      {/* ========================================================= */}
      {/* 2. FULL-SCREEN BACKGROUND: HICET CAMPUS FRONT VIEW        */}
      {/* Minimal Gradient Level for Maximum Campus Clarity         */}
      {/* ========================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
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

        {/* Minimal subtle warm-yellow, cream and white gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF5]/30 via-transparent to-[#FFFDF5]/35" />
        <div className="absolute inset-0 bg-[#FFFDF5]/15" />
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN SPLIT-SCREEN CONTENT CONTAINER                   */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row items-stretch">
        
        {/* ========================================================= */}
        {/* LEFT SECTION – HICET BRANDING (~55% width on desktop)    */}
        {/* ========================================================= */}
        <section className="w-full lg:w-[55%] xl:w-[56%] flex flex-col justify-between p-4 sm:p-8 md:p-10 lg:p-12 xl:p-16 border-b lg:border-b-0 lg:border-r border-[#F0E8D4]/40">
          
          {/* Top Bar: Navigation & Campus Events Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center justify-between gap-4 mb-6 sm:mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/95 hover:bg-[#FFE99A] border border-[#F0E8D4] text-xs font-bold text-[#252525] transition-all shadow-spatial-sm group backdrop-blur-md"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Website</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/95 border border-[#E7B83F]/40 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#C99A27] shadow-spatial-sm backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[#E7B83F]" />
              <span>HICET | CAMPUS EVENTS</span>
            </div>
          </motion.div>

          {/* Frosted Spatial Hero Card */}
          <div className="my-auto py-2 sm:py-4 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              className="rounded-3xl p-5 sm:p-8 bg-white/88 backdrop-blur-md border border-[#F0E8D4] shadow-[0_16px_40px_rgba(231,184,63,0.12),0_4px_16px_rgba(0,0,0,0.04)] space-y-6 sm:space-y-7"
            >
              
              {/* College Logo & Institution Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4">
                <div className="relative h-12 sm:h-14 md:h-16 aspect-[668/191] rounded-xl overflow-hidden bg-white p-1.5 border border-[#F0E8D4] shadow-xs shrink-0">
                  <Image
                    src="/hindusthan-banner-logo.jpg"
                    alt="Hindusthan Educational Institutions"
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 640px) 168px, (max-width: 768px) 196px, 224px"
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

              {/* Main Heading & Supporting Text */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-4xl font-black text-[#252525] tracking-tight leading-[1.18] font-sans">
                  Welcome to{' '}
                  <span className="relative inline-block text-[#C99A27]">
                    HICET Events
                    <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-[#FFE99A] -z-10 rounded-full" />
                  </span>
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-[#5C5850] font-medium leading-relaxed">
                  Discover, experience and participate in exciting campus events, technical symposiums, hackathons and cultural celebrations.
                </p>
              </div>

              {/* Spatial Event-Ticket Motif */}
              <div className="relative rounded-2xl bg-[#FFFDF5]/90 border border-[#F0E8D4] p-4 shadow-xs overflow-hidden">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border border-[#F0E8D4]" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border border-[#F0E8D4]" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                  <div className="space-y-1.5 pr-0 sm:pr-3 sm:border-r sm:border-dashed sm:border-[#F0E8D4]">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#C99A27]">
                      <Ticket className="w-3.5 h-3.5 text-[#E7B83F]" />
                      <span>Single Campus Pass</span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#252525] leading-snug">
                      Instant event access with Google or passwordless email.
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#FFF9E8] text-[9.5px] font-bold text-[#77736A] border border-[#F0E8D4]">
                        No Password Needed
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#FFF9E8] text-[9.5px] font-bold text-[#77736A] border border-[#F0E8D4]">
                        Instant OTP
                      </span>
                    </div>
                  </div>

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
                      Verified registration status, real-time seat counters & event certificates.
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
        {/* RIGHT SECTION – LOGIN CARD (~45% width on desktop)        */}
        {/* ========================================================= */}
        <section className="w-full lg:w-[45%] xl:w-[44%] flex items-center justify-center p-4 sm:p-8 md:p-10 lg:p-12 xl:p-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="w-full max-w-md"
          >
            
            {/* If checking auth session */}
            {authChecking ? (
              <div
                aria-busy="true"
                aria-label="Verifying authentication session"
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-9 md:p-10 border border-[#F0E8D4] shadow-[0_20px_50px_rgba(231,184,63,0.18)] space-y-6"
              >
                <div className="space-y-2">
                  <SkeletonBase className="w-32 h-6 rounded-full" />
                  <SkeletonTitle width="w-48" height="h-7" />
                  <SkeletonText width="w-64" height="h-3.5" />
                </div>
                <SkeletonButton size="h-12 w-full rounded-2xl" />
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#F0E8D4]" />
                  <SkeletonText width="w-12" height="h-3" />
                  <div className="flex-1 h-px bg-[#F0E8D4]" />
                </div>
                <div className="space-y-4">
                  <SkeletonInput height="h-12 rounded-2xl" />
                  <SkeletonButton size="h-12 w-full rounded-2xl" />
                </div>
              </div>
            ) : user ? (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-9 md:p-10 border border-[#F0E8D4] shadow-[0_20px_50px_rgba(231,184,63,0.18),0_8px_24px_rgba(0,0,0,0.06)] space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFF9E8] border border-[#FFE99A] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#C99A27] bg-[#FFF9E8] px-3 py-1 rounded-full border border-[#F0E8D4]">
                    {isAdmin ? 'Administrator' : 'Campus Member'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#252525]">
                    Signed in as {user.full_name}
                  </h2>
                  <p className="text-xs text-[#77736A]">{user.email}</p>
                </div>

                <div className="pt-2 space-y-3">
                  <Link
                    href={isAdmin ? '/admin' : '/'}
                    className="w-full py-3.5 rounded-2xl font-black text-sm text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-spatial flex items-center justify-center gap-2 transition-all"
                  >
                    <span>{isAdmin ? 'Go to Admin Console →' : 'Continue to Campus Homepage →'}</span>
                  </Link>

                  <button
                    onClick={() => logout()}
                    className="w-full py-2.5 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                  >
                    Switch Account / Log Out
                  </button>
                </div>
              </div>
            ) : (
              /* Floating Spatial Login Card */
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-9 md:p-10 border border-[#F0E8D4] shadow-[0_20px_50px_rgba(231,184,63,0.18),0_8px_24px_rgba(0,0,0,0.06)] space-y-6">
                
                {/* Alert Messages (Errors or Success) */}
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

                {successMessage && !error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800 font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{successMessage}</span>
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {/* ===================================================== */}
                  {/* VIEW A: NORMAL USER AUTHENTICATION                    */}
                  {/* ===================================================== */}
                  {authMode === 'user' ? (
                    <motion.div
                      key="normal-user-view"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      {/* Header */}
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9E8] border border-[#FFE99A] text-[11px] font-black uppercase tracking-wider text-[#C99A27]">
                          <Sparkles className="w-3.5 h-3.5 text-[#E7B83F]" />
                          <span>Student & Faculty Portal</span>
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight font-sans">
                          Welcome Back!
                        </h2>
                        
                        <p className="text-xs sm:text-sm text-[#77736A] leading-relaxed">
                          Sign in to explore HICET campus events.
                        </p>
                      </div>

                      {/* OPTION A: Google Sign-In Button */}
                      <div>
                        <button
                          type="button"
                          onClick={handleGoogleLogin}
                          disabled={googleLoading}
                          className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-white hover:bg-[#FFFDF5] border border-[#F0E8D4] hover:border-[#E7B83F] text-xs sm:text-sm font-bold text-[#252525] shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer group active:scale-[0.99] disabled:opacity-60"
                        >
                          {googleLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#C99A27]" />
                          ) : (
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                              <path
                                fill="#4285F4"
                                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                              />
                              <path
                                fill="#34A853"
                                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                              />
                              <path
                                fill="#EA4335"
                                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                              />
                            </svg>
                          )}
                          <span>Continue with Google</span>
                        </button>
                      </div>

                      {/* Divider with "OR" */}
                      <div className="relative flex items-center justify-center my-3">
                        <div className="border-t border-[#F0E8D4] w-full" />
                        <span className="bg-white/95 px-3 text-[11px] font-black uppercase text-[#77736A] tracking-wider shrink-0">
                          OR
                        </span>
                        <div className="border-t border-[#F0E8D4] w-full" />
                      </div>

                      {/* OPTION B: Passwordless Email Login */}
                      {otpStep === 'email' ? (
                        <form onSubmit={handleSendEmailOtp} className="space-y-4">
                          <div>
                            <label 
                              htmlFor="user-email-input" 
                              className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-2"
                            >
                              Email Address
                            </label>
                            
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77736A]">
                                <Mail className="w-4 h-4" />
                              </div>
                              
                              <input
                                id="user-email-input"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="name@hindusthan.net or your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-sm focus:outline-none focus:border-[#E7B83F] focus:ring-2 focus:ring-[#FFE99A]/50 transition-all placeholder:text-[#77736A]/50 font-sans"
                              />
                            </div>
                            <p className="text-[11px] text-[#77736A] mt-1.5">
                              No password needed. We will send a secure 6-digit access code.
                            </p>
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-[0_4px_16px_rgba(231,184,63,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99] cursor-pointer"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin text-[#252525]" />
                                <span>Generating Access Code...</span>
                              </>
                            ) : (
                              <span>Continue with Email →</span>
                            )}
                          </button>

                          <p className="text-[10.5px] text-center text-[#77736A] leading-relaxed pt-1">
                            By continuing, you agree to our terms of service and campus event privacy guidelines.
                          </p>
                        </form>
                      ) : (
                        /* Step 2: 6-Digit OTP Verification Form */
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                          <div className="rounded-2xl bg-[#FFFDF5] border border-[#FFE99A] p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#252525]">
                                Enter 6-Digit Verification Code
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setOtpStep('email');
                                  setError(null);
                                  setSuccessMessage(null);
                                  setOtpCode('');
                                }}
                                className="text-[11px] font-bold text-[#C99A27] hover:underline"
                              >
                                Change Email
                              </button>
                            </div>

                            <p className="text-[11px] text-[#77736A] leading-relaxed">
                              Sent to <strong className="text-[#252525]">{email.trim().toLowerCase()}</strong>. Please check your inbox and spam folder. Valid for 5 minutes.
                            </p>

                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77736A]">
                                <KeyRound className="w-4 h-4" />
                              </div>
                              <input
                                id="user-otp-input"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                autoFocus
                                required
                                placeholder="• • • • • •"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                onPaste={(e) => {
                                  const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                                  if (text) {
                                    e.preventDefault();
                                    setOtpCode(text);
                                  }
                                }}
                                className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-white border border-[#F0E8D4] text-[#252525] text-xl font-mono tracking-[0.35em] text-center focus:outline-none focus:border-[#E7B83F] focus:ring-2 focus:ring-[#FFE99A]/50 transition-all placeholder:text-[#77736A]/40"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={loading || otpCode.length < 6}
                            className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-[0_4px_16px_rgba(231,184,63,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin text-[#252525]" />
                                <span>Verifying with Supabase Auth...</span>
                              </>
                            ) : (
                              <span>Verify & Enter Homepage →</span>
                            )}
                          </button>

                          <div className="text-center pt-1">
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              disabled={otpCountdown > 0 || loading}
                              className="text-xs font-semibold text-[#77736A] hover:text-[#252525] disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>
                                {otpCountdown > 0 ? `Resend code in ${otpCountdown}s` : 'Resend Verification Code'}
                              </span>
                            </button>
                          </div>
                        </form>
                      )}

                      {/* SUBTLE ADMIN LOGIN LINK AT BOTTOM */}
                      <div className="pt-4 border-t border-[#F0E8D4]/80 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('admin');
                            setError(null);
                            setSuccessMessage(null);
                          }}
                          className="text-xs font-semibold text-[#77736A] hover:text-[#C99A27] transition-colors inline-flex items-center gap-1.5 cursor-pointer group"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#C99A27] group-hover:scale-110 transition-transform" />
                          <span>Event Organizer or Faculty? <strong className="underline underline-offset-2">Admin Login</strong></span>
                        </button>
                      </div>

                    </motion.div>
                  ) : (
                    /* ===================================================== */
                    /* VIEW B: SEPARATE ADMIN AUTHENTICATION FORM            */
                    /* ===================================================== */
                    <motion.div
                      key="admin-user-view"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      {/* Back to Normal User Login Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('user');
                          setError(null);
                          setSuccessMessage(null);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#77736A] hover:text-[#252525] transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Student & User Login</span>
                      </button>

                      {/* Header */}
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9E8] border border-[#FFE99A] text-[11px] font-black uppercase tracking-wider text-[#C99A27]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#E7B83F]" />
                          <span>Authorized Administrator</span>
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight font-sans">
                          Admin Console
                        </h2>
                        
                        <p className="text-xs sm:text-sm text-[#77736A] leading-relaxed">
                          Sign in to manage events, categories, and attendee registers.
                        </p>
                      </div>

                      {/* Admin Form */}
                      <form onSubmit={handleAdminSubmit} className="space-y-4">
                        
                        {/* Username or Email */}
                        <div>
                          <label 
                            htmlFor="admin-user-input" 
                            className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-2"
                          >
                            Username or Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77736A]">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              id="admin-user-input"
                              type="text"
                              required
                              autoFocus
                              autoComplete="username"
                              placeholder="admin or admin@hindusthan.net"
                              value={adminUsername}
                              onChange={(e) => setAdminUsername(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-sm focus:outline-none focus:border-[#E7B83F] focus:ring-2 focus:ring-[#FFE99A]/50 transition-all placeholder:text-[#77736A]/50 font-sans"
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div>
                          <label 
                            htmlFor="admin-pass-input" 
                            className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-2"
                          >
                            Administrator Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77736A]">
                              <Lock className="w-4 h-4" />
                            </div>
                            <input
                              id="admin-pass-input"
                              type={showAdminPassword ? 'text' : 'password'}
                              required
                              autoComplete="current-password"
                              placeholder="Enter administrator password"
                              value={adminPassword}
                              onChange={(e) => setAdminPassword(e.target.value)}
                              className="w-full pl-10 pr-11 py-3 sm:py-3.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-sm focus:outline-none focus:border-[#E7B83F] focus:ring-2 focus:ring-[#FFE99A]/50 transition-all placeholder:text-[#77736A]/50 font-sans"
                            />
                            <button
                              type="button"
                              onClick={() => setShowAdminPassword(!showAdminPassword)}
                              aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
                              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#77736A] hover:text-[#252525] transition-colors cursor-pointer"
                            >
                              {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-2 cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={adminRemember}
                              onChange={(e) => setAdminRemember(e.target.checked)}
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

                        {/* Submit Admin */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-[0_4px_16px_rgba(231,184,63,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99] cursor-pointer mt-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-[#252525]" />
                              <span>Authenticating Administrator...</span>
                            </>
                          ) : (
                            <span>Sign In to Admin Dashboard →</span>
                          )}
                        </button>

                      </form>

                      {/* Footer notice */}
                      <div className="pt-3 border-t border-[#F0E8D4]/80 text-center">
                        <p className="text-[11px] text-[#77736A] leading-relaxed">
                          Authorized institutional access only. Credentials are cryptographically protected.
                        </p>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}

          </motion.div>

        </section>

      </div>

    </main>
  );
}
