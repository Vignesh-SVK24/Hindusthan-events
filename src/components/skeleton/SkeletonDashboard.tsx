import React from 'react';
import { SkeletonBase, SkeletonText, SkeletonTitle, SkeletonCard } from './SkeletonPrimitives';

/**
 * Skeleton for the Admin Overview Dashboard:
 * - 4 Stat Metric Cards
 * - Recent Events Management List
 * - Quick Action Studio Shortcuts
 */
export function SkeletonDashboard() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard metrics" className="space-y-8">
      {/* 4 Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial space-y-2"
          >
            <SkeletonText width="w-24" height="h-3" />
            <SkeletonText width="w-16" height="h-8" />
            <SkeletonText width="w-32" height="h-2.5" />
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Events + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Events (8 Cols) */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial space-y-4">
          <div className="flex items-center justify-between pb-1">
            <SkeletonTitle width="w-48" height="h-5" />
            <SkeletonBase className="w-16 h-4 rounded-full" />
          </div>

          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <SkeletonBase className="w-3 h-3 rounded-full shrink-0" />
                  <div className="space-y-1">
                    <SkeletonText width="w-40 sm:w-56" height="h-4" />
                    <SkeletonText width="w-28 sm:w-36" height="h-3" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <SkeletonBase className="w-20 h-6 rounded-full" />
                  <SkeletonBase className="w-14 h-7 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Shortcuts (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <SkeletonCard className="p-6 space-y-4">
            <SkeletonTitle width="w-32" height="h-5" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] space-y-1">
                  <SkeletonText width="w-28" height="h-3.5" />
                  <SkeletonText width="w-44" height="h-2.5" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

      </div>
    </div>
  );
}
