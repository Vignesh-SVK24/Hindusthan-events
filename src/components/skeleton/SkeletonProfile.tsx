import React from 'react';
import { SkeletonBase, SkeletonAvatar, SkeletonText } from './SkeletonPrimitives';

/**
 * Skeleton for user profile badge, account card, and navbar profile drawer.
 */
export function SkeletonProfile() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-3 p-2 rounded-2xl bg-white/90 border border-[#F0E8D4] shadow-sm"
    >
      <SkeletonAvatar size="w-9 h-9 sm:w-10 sm:h-10" />
      <div className="flex-1 min-w-0 space-y-1">
        <SkeletonText width="w-24 sm:w-28" height="h-3.5" />
        <SkeletonText width="w-32 sm:w-36" height="h-2.5" />
      </div>
      <SkeletonBase className="w-14 h-5 rounded-full" />
    </div>
  );
}

/**
 * Skeleton for the full profile card inside settings / account modal.
 */
export function SkeletonProfileCard() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading profile details"
      className="p-6 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial space-y-4 max-w-sm w-full"
    >
      <div className="flex items-center gap-4">
        <SkeletonAvatar size="w-16 h-16" />
        <div className="space-y-1.5 flex-1">
          <SkeletonText width="w-32" height="h-4 sm:h-5" />
          <SkeletonText width="w-40" height="h-3" />
          <SkeletonBase className="w-16 h-5 rounded-full mt-1" />
        </div>
      </div>
      <div className="pt-3 border-t border-[#F0E8D4] space-y-2">
        <SkeletonText width="w-full" height="h-3" />
        <SkeletonText width="w-3/4" height="h-3" />
      </div>
    </div>
  );
}
