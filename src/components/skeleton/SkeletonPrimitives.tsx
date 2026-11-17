import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  subtle?: boolean;
}

/**
 * Base atomic Skeleton component with GPU-accelerated spatial-shimmer animation.
 * Automatically marks itself with aria-hidden="true" for screen readers.
 */
export function SkeletonBase({ className = '', subtle = false, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`${subtle ? 'spatial-shimmer-subtle' : 'spatial-shimmer'} rounded-xl ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton for body text lines with configurable width and height.
 */
export function SkeletonText({
  className = '',
  width = 'w-full',
  height = 'h-3.5',
  ...props
}: SkeletonProps & { width?: string; height?: string }) {
  return (
    <SkeletonBase
      className={`${height} ${width} rounded-full my-1 ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton for headings and titles (taller and more prominent).
 */
export function SkeletonTitle({
  className = '',
  width = 'w-3/4',
  height = 'h-6 sm:h-7',
  ...props
}: SkeletonProps & { width?: string; height?: string }) {
  return (
    <SkeletonBase
      className={`${height} ${width} rounded-xl my-1.5 ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton for user avatars or circular iconography.
 */
export function SkeletonAvatar({
  className = '',
  size = 'w-10 h-10',
  ...props
}: SkeletonProps & { size?: string }) {
  return (
    <SkeletonBase
      className={`${size} rounded-full shrink-0 ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton for image containers, banners, and media thumbnails.
 */
export function SkeletonImage({
  className = '',
  aspectRatio = 'aspect-[16/9]',
  ...props
}: SkeletonProps & { aspectRatio?: string }) {
  return (
    <SkeletonBase
      className={`w-full ${aspectRatio} rounded-2xl sm:rounded-3xl overflow-hidden ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton for buttons and clickable spatial actions.
 */
export function SkeletonButton({
  className = '',
  size = 'h-11 sm:h-12 w-full',
  ...props
}: SkeletonProps & { size?: string }) {
  return (
    <SkeletonBase
      className={`${size} rounded-full ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton for form inputs, search bars, and dropdown fields.
 */
export function SkeletonInput({
  className = '',
  height = 'h-11 sm:h-12',
  ...props
}: SkeletonProps & { height?: string }) {
  return (
    <div className="w-full space-y-1.5" aria-hidden="true">
      <SkeletonText width="w-24" height="h-3" />
      <SkeletonBase
        className={`w-full ${height} rounded-full border border-[#F0E8D4]/80 ${className}`}
        {...props}
      />
    </div>
  );
}

/**
 * Skeleton for card shells with Spatial UI borders, shadows, and rounded corners.
 */
export function SkeletonCard({
  className = '',
  children,
  ...props
}: SkeletonProps & { children?: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-white rounded-2xl sm:rounded-3xl border border-[#F0E8D4] shadow-spatial overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
