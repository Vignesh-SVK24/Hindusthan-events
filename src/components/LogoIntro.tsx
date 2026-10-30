'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface LogoIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export default function LogoIntro({ onComplete, forceShow = false }: LogoIntroProps) {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState<'initial' | 'zooming' | 'fadeout'>('initial');

  useEffect(() => {
    // If not forced, check if already viewed in this session
    if (!forceShow) {
      const viewed = sessionStorage.getItem('hindusthan_intro_viewed');
      if (viewed) {
        setShow(false);
        onComplete?.();
        return;
      }
    }

    setShow(true);
    // Stage 1: Initial focus, starts zooming out at 0.6s
    const timer1 = setTimeout(() => {
      setStage('zooming');
    }, 400);

    // Stage 2: Fade out overlay into homepage
    const timer2 = setTimeout(() => {
      setStage('fadeout');
    }, 2800);

    // Stage 3: Complete & cleanup
    const timer3 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('hindusthan_intro_viewed', 'true');
      onComplete?.();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [forceShow, onComplete]);

  const handleSkip = () => {
    setShow(false);
    sessionStorage.setItem('hindusthan_intro_viewed', 'true');
    onComplete?.();
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === 'fadeout' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070b19] overflow-hidden select-none pointer-events-auto"
      >
        {/* Subtle background ambiance and radial lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-blue-950/40 to-[#070b19] pointer-events-none" />
        
        {/* Subtle grid backdrop */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Cinematic camera zoom-out container */}
        <div className="relative flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 2.4, opacity: 0, y: 10 }}
            animate={
              stage === 'initial'
                ? { scale: 2.2, opacity: 1, y: 0 }
                : stage === 'zooming'
                ? { scale: 1.0, opacity: 1, y: 0 }
                : { scale: 0.92, opacity: 0.9, y: 0 }
            }
            transition={{
              duration: 2.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative flex flex-col items-center"
          >
            {/* Glowing aura around logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.25, 1.1], opacity: [0.3, 0.6, 0.4] }}
              transition={{ duration: 2.4, ease: 'easeInOut' }}
              className="absolute -inset-8 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"
            />

            {/* High-res College Logo — Preserving exact proportions */}
            <div className="relative w-44 h-56 sm:w-56 sm:h-72 md:w-64 md:h-80 drop-shadow-[0_15px_35px_rgba(245,158,11,0.25)] rounded-2xl overflow-hidden bg-white/95 p-3.5 border border-amber-300/40 shadow-2xl">
              <Image
                src="/college-logo.jpg"
                alt="Hindusthan Educational and Charitable Trust"
                fill
                priority
                className="object-contain p-1"
                sizes="(max-width: 768px) 240px, 320px"
              />
            </div>

            {/* Institutional Tagline & Title reveal as camera pulls back */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={stage === 'zooming' ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ delay: 0.6, duration: 1.0, ease: 'easeOut' }}
              className="text-center mt-6 px-4"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider text-white uppercase drop-shadow-md">
                Hindusthan Educational & Charitable Trust
              </h1>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="h-[1px] w-12 bg-amber-400/70"></span>
                <p className="text-xs sm:text-sm tracking-[0.25em] text-amber-300 uppercase font-semibold">
                  Central Event Hub & Discovery Platform
                </p>
                <span className="h-[1px] w-12 bg-amber-400/70"></span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Skip button for rapid navigation */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={handleSkip}
          className="absolute bottom-8 right-8 z-20 px-4 py-2 text-xs font-medium tracking-wider text-slate-300 hover:text-white bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/60 rounded-full backdrop-blur-md transition-all duration-200"
        >
          Skip Intro →
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
