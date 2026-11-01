'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { EventItem } from '@/lib/types';

interface HeroSectionProps {
  featuredEvent?: EventItem;
  totalEventsCount: number;
}

export default function HeroSection({ featuredEvent, totalEventsCount }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-20">
      {/* Soft Yellow Spatial Ambient Light Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-tr from-[#FFF0B3]/50 via-[#FFF9E8]/90 to-transparent blur-[80px] pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-[350px] h-[350px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#FFE99A]/30 to-transparent blur-[60px] pointer-events-none -z-10" />

      {/* Floating Spatial Micro Decorative Elements */}
      <div className="absolute top-12 left-10 w-24 h-24 rounded-3xl bg-white/60 border border-[#F0E8D4] shadow-spatial-sm rotate-12 pointer-events-none hidden lg:block" />
      <div className="absolute bottom-10 right-16 w-32 h-32 rounded-3xl bg-[#FFF6D8]/60 border border-[#F0E8D4] shadow-spatial-sm -rotate-6 pointer-events-none hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Text & Spatial CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Spatial Pill Tag */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-[#F0E8D4] shadow-spatial-sm text-[#252525] text-xs font-bold tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E7B83F]" />
              <span>Hindusthan Educational & Charitable Trust</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#252525] tracking-tight leading-[1.12]"
            >
              Discover, Publish & Experience <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C99A27] via-[#E7B83F] to-[#B38318]">
                World-Class Campus Events.
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base lg:text-lg text-[#77736A] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              The centralized event hub for national hackathons, cultural festivals, academic symposiums, and sports championships. Each event features an independent visual identity, dedicated webpage, and real-time registration engine.
            </motion.p>

            {/* CTAs in Spatial UI */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2"
            >
              <a
                href="#events-discovery"
                className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-black text-sm text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-[0_10px_25px_rgba(231,184,63,0.3)] hover:shadow-[0_12px_30px_rgba(231,184,63,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-4 h-4 text-[#252525]" />
                <span>Explore All Events</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-bold text-sm text-[#252525] bg-white hover:bg-[#FFF9E8] border border-[#F0E8D4] hover:border-[#E7B83F] shadow-spatial transition-all transform hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#C99A27]" />
                <span>Admin Event Studio</span>
              </Link>
            </motion.div>

            {/* Micro Highlights Pill Panels */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-2 sm:gap-3 pt-6 max-w-lg mx-auto lg:mx-0"
            >
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/85 border border-[#F0E8D4] shadow-spatial-sm text-center lg:text-left">
                <p className="text-lg sm:text-2xl font-black text-[#252525]">{totalEventsCount}+</p>
                <p className="text-[10px] sm:text-[11px] text-[#77736A] font-semibold mt-0.5 leading-tight">Published Events</p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/85 border border-[#F0E8D4] shadow-spatial-sm text-center lg:text-left">
                <p className="text-lg sm:text-2xl font-black text-[#C99A27]">100%</p>
                <p className="text-[10px] sm:text-[11px] text-[#77736A] font-semibold mt-0.5 leading-tight">Bespoke Themes</p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/85 border border-[#F0E8D4] shadow-spatial-sm text-center lg:text-left">
                <p className="text-lg sm:text-2xl font-black text-emerald-600">Live</p>
                <p className="text-[10px] sm:text-[11px] text-[#77736A] font-semibold mt-0.5 leading-tight">QR Entry System</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Featured Event Spatial Floating Showcase */}
          <div className="lg:col-span-5">
            {featuredEvent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative group rounded-3xl overflow-hidden bg-white/95 border border-[#F0E8D4] p-3 shadow-spatial-lg hover:shadow-spatial-float transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Spotlight Image Card */}
                <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <Image
                    src={featuredEvent.poster_url || '/college-logo.jpg'}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#252525] bg-[#FFE99A] border border-white/50 rounded-full shadow-md">
                      Featured Spotlight
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-bold text-[#FFE99A] flex items-center gap-1.5 mb-1">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      Flagship University Event
                    </p>
                    <h3 className="text-lg sm:text-xl font-black line-clamp-2 leading-tight drop-shadow-md">
                      {featuredEvent.title}
                    </h3>
                  </div>
                </div>

                {/* Spotlight Body */}
                <div className="p-4 sm:p-5 space-y-3">
                  <p className="text-xs sm:text-sm text-[#77736A] line-clamp-2 leading-relaxed">
                    {featuredEvent.short_description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-[#F0E8D4]">
                    <span className="text-xs text-[#252525] font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C99A27]" />
                      {featuredEvent.start_date}
                    </span>
                    
                    <Link
                      href={`/events/${featuredEvent.slug}`}
                      className="px-4 py-2 text-xs font-black text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] rounded-full shadow-sm transition-all"
                    >
                      Visit Event Page →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>

        </div>
      </div>
    </section>
  );
}
