import React from 'react';
import { SkeletonBase, SkeletonText, SkeletonTitle, SkeletonButton, SkeletonCard } from './SkeletonPrimitives';

/**
 * SkeletonEventDetails mirrors the exact layout of EventPageClient.tsx.
 * Provides a fluid, zero-layout-shift preview of the event detail view.
 */
export function SkeletonEventDetails() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading event details"
      className="min-h-screen bg-[#FFFDF5] text-[#252525] pb-24"
    >
      {/* Top Navigation Bar Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <SkeletonBase className="w-36 h-9 rounded-full" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Hero Banner Skeleton */}
        <div className="relative w-full h-64 sm:h-96 lg:h-[460px] rounded-3xl overflow-hidden bg-[#FFF9E8] border border-[#F0E8D4] shadow-spatial-lg">
          <SkeletonBase className="w-full h-full rounded-none" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
            <SkeletonBase className="w-24 h-7 rounded-full bg-white/90" />
            <SkeletonBase className="w-32 h-7 rounded-full bg-white/90" />
          </div>

          {/* Bottom Title & Details Overlay */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 space-y-3">
            <SkeletonTitle width="w-4/5 sm:w-3/5" height="h-8 sm:h-12" className="bg-white/90" />
            <SkeletonText width="w-1/2 sm:w-1/3" height="h-4 sm:h-5" className="bg-white/80" />

            {/* Quick Metadata Chips */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <SkeletonBase className="w-32 h-7 rounded-full bg-white/80" />
              <SkeletonBase className="w-40 h-7 rounded-full bg-white/80" />
              <SkeletonBase className="w-28 h-7 rounded-full bg-white/80" />
            </div>
          </div>
        </div>

        {/* Live Countdown & Primary CTA Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Countdown Blocks (4 items) */}
          <div className="lg:col-span-7 grid grid-cols-4 gap-2 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-3 sm:p-4 rounded-2xl bg-white border border-[#F0E8D4] shadow-spatial-sm text-center space-y-1"
              >
                <SkeletonText width="w-10 mx-auto" height="h-6 sm:h-8" />
                <SkeletonText width="w-12 mx-auto" height="h-3" />
              </div>
            ))}
          </div>

          {/* Primary Action Button */}
          <div className="lg:col-span-5 flex items-center gap-3">
            <SkeletonButton size="h-14 flex-1 rounded-full" />
            <SkeletonBase className="w-14 h-14 rounded-full shrink-0" />
          </div>
        </div>

        {/* Content Section: About Event */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <SkeletonCard className="p-6 sm:p-8 space-y-4">
              <SkeletonTitle width="w-44" height="h-6" />
              <SkeletonText width="w-full" height="h-4" />
              <SkeletonText width="w-11/12" height="h-4" />
              <SkeletonText width="w-4/5" height="h-4" />
              <div className="pt-3 space-y-2">
                <SkeletonText width="w-full" height="h-4" />
                <SkeletonText width="w-3/4" height="h-4" />
              </div>
            </SkeletonCard>

            {/* Highlights Grid */}
            <div className="space-y-4">
              <SkeletonTitle width="w-36" height="h-6" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} className="p-4 space-y-2">
                    <SkeletonBase className="w-8 h-8 rounded-full mb-1" />
                    <SkeletonText width="w-full" height="h-3.5" />
                    <SkeletonText width="w-2/3" height="h-3" />
                  </SkeletonCard>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Quick Info Card */}
          <div className="lg:col-span-4 space-y-6">
            <SkeletonCard className="p-6 space-y-4">
              <SkeletonTitle width="w-32" height="h-5" />
              <div className="space-y-3 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <SkeletonBase className="w-8 h-8 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1">
                      <SkeletonText width="w-20" height="h-3" />
                      <SkeletonText width="w-32" height="h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </SkeletonCard>

            {/* Coordinators Card Skeleton */}
            <SkeletonCard className="p-6 space-y-4">
              <SkeletonTitle width="w-40" height="h-5" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] space-y-1.5">
                    <SkeletonText width="w-28" height="h-3.5" />
                    <SkeletonText width="w-20" height="h-3" />
                    <SkeletonText width="w-36" height="h-3" />
                  </div>
                ))}
              </div>
            </SkeletonCard>
          </div>
        </div>

      </main>
    </div>
  );
}
