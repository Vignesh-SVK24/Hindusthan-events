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
    <div className="group relative flex flex-col bg-white rounded-3xl border border-[#F0E8D4] hover:border-[#E7B83F] shadow-spatial hover:shadow-spatial-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
      
      {/* Event Poster / Thumbnail Section */}
      <div className="relative w-full h-56 sm:h-64 shrink-0 overflow-hidden bg-[#FFF9E8]">
        <Image
          src={event.poster_url || '/college-logo.jpg'}
          alt={event.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="px-3.5 py-1.5 text-xs font-black tracking-wider uppercase text-[#252525] bg-white/95 border border-[#F0E8D4] rounded-full shadow-sm backdrop-blur-md">
            {event.category?.category_name || 'College Event'}
          </span>
        </div>

        {/* Registration Status Pill */}
        <div className="absolute bottom-3.5 left-3.5 z-10">
          {isRegistrationOpen ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/95 border border-emerald-300 rounded-full backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Registration Open
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#77736A] bg-white/95 border border-[#F0E8D4] rounded-full backdrop-blur-md shadow-sm">
              <XCircle className="w-3.5 h-3.5 text-[#77736A]" />
              Registration Closed
            </span>
          )}
        </div>
      </div>

      {/* Event Content & Details */}
      <div className="flex flex-col justify-between p-6 sm:p-7 flex-grow bg-white space-y-4">
        <div>
          {/* Metadata chips: Date, Venue, Registered counts */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#77736A] mb-3">
            <span className="flex items-center gap-1.5 font-bold text-[#C99A27]">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="text-[#F0E8D4]">•</span>
            <span className="flex items-center gap-1.5 text-[#252525] truncate max-w-[220px]">
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
          <h3 className="text-xl sm:text-2xl font-black text-[#252525] group-hover:text-[#C99A27] transition-colors line-clamp-2 mb-2 leading-snug font-sans">
            {event.title}
          </h3>

          {/* Tagline */}
          {event.tagline && (
            <p className="text-xs sm:text-sm font-bold text-[#C99A27] italic mb-3">
              &ldquo;{event.tagline}&rdquo;
            </p>
          )}

          {/* Short description */}
          <p className="text-xs sm:text-sm text-[#77736A] line-clamp-3 leading-relaxed mb-4">
            {event.short_description || event.description}
          </p>

          {/* Department organizer */}
          <div className="text-xs text-[#77736A] font-medium pt-1">
            <span className="text-[#C99A27] uppercase tracking-wider text-[10px] font-bold block mb-0.5">Organized by</span>
            {event.department}
          </div>
        </div>

        {/* Card Footer: Large Action button & removed /events/slug text */}
        <div className="pt-5 border-t border-[#F0E8D4] mt-auto">
          <Link
            href={`/events/${event.slug}`}
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 text-sm sm:text-base font-black text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] rounded-2xl sm:rounded-full transition-all shadow-[0_6px_20px_rgba(231,184,63,0.28)] hover:shadow-[0_8px_26px_rgba(231,184,63,0.38)] transform hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            <span>View Event</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}
