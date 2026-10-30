'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, XCircle, Users } from 'lucide-react';
import { EventItem, EventCategory, EventTheme } from '@/lib/types';

interface EventCardProps {
  event: EventItem & {
    category?: EventCategory;
    theme?: EventTheme;
    registration_count?: number;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.start_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isRegistrationOpen = event.registration_enabled;

  return (
    <div className="group relative flex flex-col md:flex-row bg-white rounded-3xl border border-[#F0E8D4] hover:border-[#E7B83F] shadow-spatial hover:shadow-spatial-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      
      {/* Event Poster / Thumbnail Section */}
      <div className="relative w-full md:w-80 h-56 md:h-auto min-h-[220px] shrink-0 overflow-hidden bg-[#FFF9E8]">
        <Image
          src={event.poster_url || '/college-logo.jpg'}
          alt={event.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="px-3 py-1 text-[11px] font-black tracking-wider uppercase text-[#252525] bg-white/95 border border-[#F0E8D4] rounded-full shadow-sm backdrop-blur-md">
            {event.category?.category_name || 'College Event'}
          </span>
        </div>

        {/* Registration Status Pill */}
        <div className="absolute bottom-3.5 left-3.5 z-10">
          {isRegistrationOpen ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 rounded-full backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Registration Open
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#77736A] bg-white/90 border border-[#F0E8D4] rounded-full backdrop-blur-md shadow-sm">
              <XCircle className="w-3.5 h-3.5 text-[#77736A]" />
              Registration Closed
            </span>
          )}
        </div>
      </div>

      {/* Event Content & Details */}
      <div className="flex flex-col justify-between p-5 sm:p-6 md:p-7 flex-grow bg-white">
        <div>
          {/* Metadata chips: Date, Venue, Registered counts */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#77736A] mb-2.5">
            <span className="flex items-center gap-1 font-bold text-[#C99A27]">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="text-[#F0E8D4]">•</span>
            <span className="flex items-center gap-1 text-[#252525] truncate max-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-[#C99A27] shrink-0" />
              {event.venue}
            </span>
            {event.registration_count !== undefined && event.registration_count > 0 && (
              <>
                <span className="text-[#F0E8D4]">•</span>
                <span className="flex items-center gap-1 text-[#C99A27] font-bold">
                  <Users className="w-3.5 h-3.5" />
                  {event.registration_count} Registered
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-black text-[#252525] group-hover:text-[#C99A27] transition-colors line-clamp-1 mb-1 leading-snug">
            {event.title}
          </h3>

          {/* Tagline */}
          {event.tagline && (
            <p className="text-xs font-bold text-[#C99A27] italic mb-2">
              &ldquo;{event.tagline}&rdquo;
            </p>
          )}

          {/* Short description */}
          <p className="text-xs sm:text-sm text-[#77736A] line-clamp-2 leading-relaxed mb-4">
            {event.short_description || event.description}
          </p>

          {/* Department organizer */}
          <div className="text-[11px] text-[#77736A] font-medium mb-4">
            <span className="text-[#C99A27] uppercase tracking-wider text-[10px] font-bold block">Organized by</span>
            {event.department}
          </div>
        </div>

        {/* Card Footer: Action button & Unique Theme indicator */}
        <div className="pt-4 border-t border-[#F0E8D4] flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full border border-white shadow-sm" 
              style={{ backgroundColor: event.theme?.primary_color || '#E7B83F' }}
              title={`Custom Event Palette: ${event.theme?.theme_preset || 'Default'}`}
            />
            <span className="text-[11px] font-mono text-[#77736A]">
              /events/{event.slug}
            </span>
          </div>

          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] rounded-full transition-all shadow-[0_4px_12px_rgba(231,184,63,0.2)] group-hover:shadow-[0_6px_16px_rgba(231,184,63,0.3)]"
          >
            <span>View Event</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}
