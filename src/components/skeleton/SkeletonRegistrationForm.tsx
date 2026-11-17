import React from 'react';
import { SkeletonBase, SkeletonText, SkeletonTitle, SkeletonButton, SkeletonInput } from './SkeletonPrimitives';

/**
 * Skeleton for the Event Registration Form modal / embedded card.
 */
export function SkeletonRegistrationForm() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading registration form"
      className="w-full max-w-lg rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial-float p-6 sm:p-8 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F0E8D4] pb-4">
        <div className="space-y-1">
          <SkeletonTitle width="w-36" height="h-6" />
          <SkeletonText width="w-48" height="h-3" />
        </div>
        <SkeletonBase className="w-8 h-8 rounded-full" />
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Full Name */}
        <SkeletonInput height="h-10 sm:h-11" />

        {/* Email & Register No */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SkeletonInput height="h-10 sm:h-11" />
          <SkeletonInput height="h-10 sm:h-11" />
        </div>

        {/* Department & Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SkeletonInput height="h-10 sm:h-11" />
          <SkeletonInput height="h-10 sm:h-11" />
        </div>

        {/* Contact */}
        <SkeletonInput height="h-10 sm:h-11" />

        {/* Action Button */}
        <div className="pt-2">
          <SkeletonButton size="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
