'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Zap, Trophy, Users } from 'lucide-react';
import { EventItem } from '@/lib/types';

interface HeroSectionProps {
  featuredEvent?: EventItem;
  totalEventsCount: number;
}

export default function HeroSection({ featuredEvent, totalEventsCount }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80 bg-gradient-to-b from-[#070b19] via-[#090f24] to-[#070b19]">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-blue-600/10 to-purple-600/10 blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Text & Institutional Branding */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Tag */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hindusthan Educational & Charitable Trust</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]"
            >
              Discover, Publish & Experience <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                World-Class Campus Events.
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              The centralized event hub for national hackathons, cultural festivals, academic symposiums, and sports championships. Each event features an independent visual identity, dedicated webpage, and real-time registration engine.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <a
                href="#events-discovery"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/25 transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Explore All Events</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 hover:border-slate-600 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Event Studio</span>
              </Link>
            </motion.div>

            {/* Micro Highlights */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0"
            >
              <div>
                <p className="text-2xl font-black text-white">{totalEventsCount}+</p>
                <p className="text-xs text-slate-400 font-medium">Published Events</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-400">100%</p>
                <p className="text-xs text-slate-400 font-medium">Bespoke Themes</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">Real-time</p>
                <p className="text-xs text-slate-400 font-medium">Instant Reg System</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Featured Event Card Showcase */}
          <div className="lg:col-span-5">
            {featuredEvent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative group rounded-3xl overflow-hidden border border-amber-400/30 bg-gradient-to-b from-slate-900 to-[#0c1222] p-1.5 shadow-2xl shadow-blue-950/50"
              >
                {/* Spotlight Banner Header */}
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-950">
                  <Image
                    src={featuredEvent.poster_url || '/college-logo.jpg'}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-400/40 rounded-full backdrop-blur-md">
                      Featured Spotlight
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                      <Zap className="w-3.5 h-3.5" />
                      Flagship University Event
                    </p>
                    <h3 className="text-xl sm:text-2xl font-black line-clamp-2 leading-tight">
                      {featuredEvent.title}
                    </h3>
                  </div>
                </div>

                {/* Spotlight Body */}
                <div className="p-5 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                    {featuredEvent.short_description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {featuredEvent.start_date}
                    </span>
                    
                    <Link
                      href={`/events/${featuredEvent.slug}`}
                      className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all"
                    >
                      Visit Event Page →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                <p>Welcome to Hindusthan Events Platform</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
