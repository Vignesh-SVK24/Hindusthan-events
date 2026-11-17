import React from 'react';
import { SkeletonBase, SkeletonText, SkeletonTitle, SkeletonButton } from './SkeletonPrimitives';

/**
 * SkeletonEventCard precisely matches the aspect-ratio, layout, and paddings of EventCard.tsx
 * Eliminates layout shift (CLS = 0) while maintaining Spatial UI design aesthetics.
 */
export function SkeletonEventCard() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-[#F0E8D4] shadow-spatial overflow-hidden h-full"
    >
      {/* Event Poster / Thumbnail Section with overlay badges */}
      <div className="relative w-full h-36 xs:h-44 sm:h-60 md:h-64 shrink-0 overflow-hidden bg-[#FFF9E8]/70">
        <SkeletonBase className="w-full h-full rounded-none" />

        {/* Category Badge skeleton (top-left) */}
        <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10">
          <SkeletonBase className="w-16 sm:w-24 h-5 sm:h-7 rounded-full bg-white/90 shadow-sm" />
        </div>

        {/* Registration Status Pill skeleton (bottom-left) */}
        <div className="absolute bottom-2 left-2 sm:bottom-3.5 sm:left-3.5 z-10">
          <SkeletonBase className="w-20 sm:w-28 h-5 sm:h-7 rounded-full bg-white/90 shadow-sm" />
        </div>
      </div>

      {/* Event Content & Details Section */}
      <div className="flex flex-col justify-between p-3.5 sm:p-6 md:p-7 flex-grow bg-white space-y-3 sm:space-y-4">
        <div>
          {/* Metadata chips: Date, Venue, Registered count */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <SkeletonText width="w-20 sm:w-24" height="h-3 sm:h-3.5" />
            <span className="text-[#F0E8D4]">•</span>
            <SkeletonText width="w-24 sm:w-32" height="h-3 sm:h-3.5" />
          </div>

          {/* Title (2 lines) */}
          <SkeletonTitle width="w-11/12" height="h-4 sm:h-6" className="mb-1" />
          <SkeletonTitle width="w-3/4" height="h-4 sm:h-6" className="mb-2 sm:mb-3" />

          {/* Tagline */}
          <SkeletonText width="w-1/2" height="h-3 sm:h-3.5" className="mb-2" />

          {/* Short description (2 lines) */}
          <SkeletonText width="w-full" height="h-3 sm:h-3.5" />
          <SkeletonText width="w-4/5" height="h-3 sm:h-3.5" className="mb-3" />

          {/* Department organizer */}
          <div className="pt-1 space-y-1">
            <SkeletonText width="w-16" height="h-2.5" />
            <SkeletonText width="w-36" height="h-3" />
          </div>
        </div>

        {/* Card Footer: Action button */}
        <div className="pt-3 sm:pt-5 border-t border-[#F0E8D4] mt-auto">
          <SkeletonButton size="h-9 sm:h-12 w-full rounded-xl sm:rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of SkeletonEventCard items matching the 2-column layout on all viewports.
 */
export function SkeletonEventGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading events directory"
      className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonEventCard key={i} />
      ))}
    </div>
  );
}
