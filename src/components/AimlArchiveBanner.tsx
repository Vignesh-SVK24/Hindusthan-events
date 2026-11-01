'use client';

import React from 'react';
import Link from 'next/link';
import { History, ArrowRight, Sparkles, MapPin, Camera, Calendar } from 'lucide-react';

export default function AimlArchiveBanner() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9E8] via-white to-[#FFFDF5] border border-[#F0E8D4] p-6 sm:p-10 shadow-[0_12px_36px_-6px_rgba(231,184,63,0.12)]">
        {/* Ambient Spatial Accents */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 rounded-full bg-[#FFE99A]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 rounded-full bg-[#FFF0B3]/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE99A]/40 border border-[#E7B83F]/30 text-xs font-black text-[#252525]">
              <Sparkles className="w-3.5 h-3.5 text-[#C99A27]" />
              <span>Departmental Historical Records</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#252525] tracking-tight">
              AIML EVENT ARCHIVES
            </h2>

            <p className="text-xs sm:text-sm text-[#77736A] leading-relaxed">
              Explore the events, workshops, technical sessions, seminars and departmental activities conducted by the Department of Artificial Intelligence and Machine Learning. Complete with original resource person profiles, event coordinators, and GPS geo-tagged documentation.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs font-bold text-[#252525]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#F0E8D4] shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-[#C99A27]" />
                <span>20 Archived Events</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#F0E8D4] shadow-xs">
                <Camera className="w-3.5 h-3.5 text-[#C99A27]" />
                <span>Photo Documentation</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#F0E8D4] shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-[#C99A27]" />
                <span>GPS Geo-Tags</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
            <Link
              href="/event-archives"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#FFE99A] hover:bg-[#E7B83F] text-[#252525] font-black text-sm shadow-[0_8px_20px_rgba(231,184,63,0.28)] hover:shadow-[0_10px_25px_rgba(231,184,63,0.36)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <History className="w-4 h-4 text-[#252525]" />
              <span>Explore AIML Event Archives</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
