import React from 'react';
import { SkeletonBase, SkeletonText } from './SkeletonPrimitives';

interface SkeletonTableProps {
  columns?: number;
  rows?: number;
  showToolbar?: boolean;
}

/**
 * Skeleton for data tables in the Admin console and event rosters.
 */
export function SkeletonTable({
  columns = 6,
  rows = 5,
  showToolbar = true,
}: SkeletonTableProps) {
  return (
    <div aria-busy="true" aria-label="Loading table data" className="space-y-4">
      {/* Optional Top Search & Filter Bar */}
      {showToolbar && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <SkeletonBase className="w-full sm:w-72 h-10 rounded-full" />
          <SkeletonBase className="w-32 h-10 rounded-full self-start sm:self-auto" />
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-3xl border border-[#F0E8D4] bg-white overflow-hidden shadow-spatial">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Header */}
            <thead className="bg-[#FFF9E8] border-b border-[#F0E8D4]">
              <tr>
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i} className="py-4 px-4 sm:px-6">
                    <SkeletonText width={i === 0 ? 'w-28' : 'w-20'} height="h-3" />
                  </th>
                ))}
              </tr>
            </thead>

            {/* Rows */}
            <tbody className="divide-y divide-[#F0E8D4]">
              {Array.from({ length: rows }).map((_, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#FFFDF5]">
                  {Array.from({ length: columns }).map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-4 sm:px-6">
                      {cIdx === 0 ? (
                        <div className="space-y-1">
                          <SkeletonText width="w-36 sm:w-44" height="h-3.5" />
                          <SkeletonText width="w-24" height="h-2.5" />
                        </div>
                      ) : cIdx === columns - 1 ? (
                        <div className="flex items-center justify-end gap-2">
                          <SkeletonBase className="w-16 h-7 rounded-full" />
                          <SkeletonBase className="w-8 h-7 rounded-full" />
                        </div>
                      ) : cIdx === 2 || cIdx === 3 ? (
                        <SkeletonBase className="w-20 h-6 rounded-full" />
                      ) : (
                        <div className="space-y-1">
                          <SkeletonText width="w-24" height="h-3" />
                          <SkeletonText width="w-16" height="h-2.5" />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
