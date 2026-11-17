import React from 'react';
import { SkeletonBase, SkeletonText, SkeletonTitle, SkeletonButton } from './SkeletonPrimitives';

/**
 * Skeleton for the historical event archive cards (/event-archives).
 */
export function SkeletonArchiveCard() {
  return (
    <article
      aria-hidden="true"
      className="flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial-sm overflow-hidden h-full"
    >
      {/* Event Photo / Thumbnail Skeleton */}
      <div className="relative w-full h-36 xs:h-44 sm:h-56 bg-[#FFF9E8]/70 overflow-hidden">
        <SkeletonBase className="w-full h-full rounded-none" />

        {/* S.No Badge Skeleton */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <SkeletonBase className="w-16 sm:w-20 h-5 sm:h-6 rounded-full bg-white/90" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-5 md:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div className="space-y-2 sm:space-y-3">
          {/* Event Date */}
          <SkeletonText width="w-24 sm:w-28" height="h-3 sm:h-3.5" />

          {/* Event Title (2-3 lines) */}
          <SkeletonTitle width="w-full" height="h-4 sm:h-5" />
          <SkeletonTitle width="w-4/5" height="h-4 sm:h-5" />

          {/* Resource Person & Coordinator Details */}
          <div className="space-y-1.5 pt-1">
            <SkeletonText width="w-3/4" height="h-3" />
            <SkeletonText width="w-2/3" height="h-3" />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 sm:pt-3 border-t border-[#F0E8D4]">
          <SkeletonButton size="h-8 sm:h-10 w-full rounded-xl sm:rounded-full" />
        </div>
      </div>
    </article>
  );
}

/**
 * Grid of SkeletonArchiveCard items.
 */
export function SkeletonArchiveGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading historical archives"
      className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonArchiveCard key={i} />
      ))}
    </div>
  );
}
