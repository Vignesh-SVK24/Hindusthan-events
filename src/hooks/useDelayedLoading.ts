'use client';

import { useState, useEffect, useRef } from 'react';

interface UseDelayedLoadingOptions {
  /**
   * Milliseconds to wait before showing the skeleton.
   * Prevents UI flicker on near-instant responses (default: 200ms).
   */
  delay?: number;
  /**
   * Minimum duration (ms) the skeleton must remain visible once shown.
   * Avoids micro-stutters and jumpy UI transitions (default: 400ms).
   */
  minDuration?: number;
  /**
   * Timeout threshold in milliseconds (default: 8000ms).
   * Flags `isTimedOut = true` so the UI can offer a retry option.
   */
  timeout?: number;
}

/**
 * Custom React hook for jitter-free, anti-flicker skeleton loading transitions.
 */
export function useDelayedLoading(
  isLoading: boolean,
  options: UseDelayedLoadingOptions = {}
) {
  const { delay = 200, minDuration = 400, timeout = 8000 } = options;

  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const shownAtRef = useRef<number | null>(null);

  useEffect(() => {
    let delayTimer: NodeJS.Timeout | null = null;
    let timeoutTimer: NodeJS.Timeout | null = null;
    let hideTimer: NodeJS.Timeout | null = null;

    if (isLoading) {
      setIsTimedOut(false);

      delayTimer = setTimeout(() => {
        setShowSkeleton(true);
        shownAtRef.current = Date.now();
      }, delay);

      timeoutTimer = setTimeout(() => {
        setIsTimedOut(true);
      }, timeout);
    } else {
      if (shownAtRef.current) {
        const elapsed = Date.now() - shownAtRef.current;
        const remaining = Math.max(0, minDuration - elapsed);

        hideTimer = setTimeout(() => {
          setShowSkeleton(false);
          shownAtRef.current = null;
        }, remaining);
      } else {
        setShowSkeleton(false);
      }
    }

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
      if (timeoutTimer) clearTimeout(timeoutTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isLoading, delay, minDuration, timeout]);

  return { showSkeleton, isTimedOut };
}
