'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';
import { EventItem, EventCategory, EventTheme } from '@/lib/types';

interface EventCardProps {
  event: EventItem & {
    category?: EventCategory;
    theme?: EventTheme;
    registration_count?: number;
  };
}

export default function EventCard({ event }: EventCardProps) {
  // Format date nicely e.g., "Nov 20, 2026"
  const formattedDate = new Date(event.start_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isRegistrationOpen = event.registration_enabled;

  return (
    <div className="group relative flex flex-col md:flex-row bg-[#0c1326] border border-slate-800 hover:border-amber-400/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
      
      {/* Event Poster / Thumbnail Section (Rectangular ratio) */}
      <div className="relative w-full md:w-80 h-56 md:h-auto min-h-[220px] shrink-0 overflow-hidden bg-slate-900">
        <Image
          src={event.poster_url || '/college-logo.jpg'}
          alt={event.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        
        {/* Category Badge on image */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-amber-300 bg-black/70 backdrop-blur-md border border-amber-400/40 rounded-full shadow-sm">
            {event.category?.category_name || 'College Event'}
          </span>
        </div>

        {/* Registration Status Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          {isRegistrationOpen ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 rounded-md backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Registration Open
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-900/80 border border-slate-700/60 rounded-md backdrop-blur-md">
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              Registration Closed
            </span>
          )}
        </div>
      </div>

      {/* Event Content & Details */}
      <div className="flex flex-col justify-between p-5 md:p-6 flex-grow">
        <div>
          {/* Metadata chips: Date, Venue, Department */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-2.5">
            <span className="flex items-center gap-1 font-medium text-amber-400">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-300 truncate max-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {event.venue}
            </span>
            {event.registration_count !== undefined && event.registration_count > 0 && (
              <>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-blue-400 font-medium">
                  <Users className="w-3.5 h-3.5" />
                  {event.registration_count} Registered
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1.5">
            {event.title}
          </h3>

          {/* Tagline */}
          {event.tagline && (
            <p className="text-xs font-medium text-amber-300/80 italic mb-2">
              &quot;{event.tagline}&quot;
            </p>
          )}

          {/* Short description */}
          <p className="text-xs md:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {event.short_description || event.description}
          </p>

          {/* Department organizer */}
          <div className="text-[11px] text-slate-400 font-medium mb-4">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Organized by</span>
            {event.department}
          </div>
        </div>

        {/* Card Footer: Action button & Unique Theme indicator */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: event.theme?.primary_color || '#3b82f6' }}
              title={`Custom Event Palette: ${event.theme?.theme_preset || 'Default'}`}
            />
            <span className="text-[11px] font-mono text-slate-400">
              /events/{event.slug}
            </span>
          </div>

          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-amber-500 hover:text-slate-950 rounded-lg transition-all shadow-sm group-hover:shadow-amber-500/20"
          >
            <span>View Event</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}
