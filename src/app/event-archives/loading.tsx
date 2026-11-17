import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SkeletonArchiveGrid, SkeletonBase } from '@/components/skeleton';

export default function EventArchivesLoading() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#252525] flex flex-col selection:bg-[#FFE99A]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 w-full flex-1">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <SkeletonBase className="w-36 h-5 rounded-full" />
          <SkeletonBase className="w-72 sm:w-96 h-10 rounded-2xl" />
          <SkeletonBase className="w-full max-w-xl h-4 rounded-full" />
        </div>

        {/* Filter bar Skeleton */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SkeletonBase className="w-full h-11 rounded-2xl" />
            <SkeletonBase className="w-full h-11 rounded-2xl" />
            <SkeletonBase className="w-full h-11 rounded-2xl" />
            <SkeletonBase className="w-full h-11 rounded-2xl" />
          </div>
        </div>

        {/* Archives Grid Skeleton */}
        <SkeletonArchiveGrid count={6} />
      </div>

      <Footer />
    </main>
  );
}
