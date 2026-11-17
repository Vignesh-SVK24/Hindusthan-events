import React from 'react';
import { SkeletonBase, SkeletonText, SkeletonTitle, SkeletonButton } from './SkeletonPrimitives';

/**
 * Skeleton for HeroSection's Featured Event Spotlight card.
 */
export function SkeletonHeroSpotlight() {
  return (
    <div
      aria-hidden="true"
      className="relative rounded-3xl overflow-hidden bg-white/95 border border-[#F0E8D4] p-3 shadow-spatial-lg"
    >
      {/* Spotlight Image Skeleton */}
      <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden bg-[#FFF9E8]">
        <SkeletonBase className="w-full h-full rounded-none" />

        {/* Featured Tag */}
        <div className="absolute top-3 left-3">
          <SkeletonBase className="w-32 h-6 rounded-full bg-white/90" />
        </div>

        {/* Bottom Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
          <SkeletonText width="w-40" height="h-3" className="bg-white/80" />
          <SkeletonTitle width="w-3/4" height="h-6" className="bg-white/90" />
        </div>
      </div>

      {/* Spotlight Body */}
      <div className="p-4 sm:p-5 space-y-3">
        <SkeletonText width="w-full" height="h-3.5" />
        <SkeletonText width="w-4/5" height="h-3.5" />

        <div className="flex items-center justify-between pt-3 border-t border-[#F0E8D4]">
          <SkeletonText width="w-28" height="h-4" />
          <SkeletonButton size="h-8 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}
