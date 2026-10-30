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
    if (!forceShow) {
      const viewed = sessionStorage.getItem('hindusthan_intro_viewed');
      if (viewed) {
        setShow(false);
        onComplete?.();
        return;
      }
    }

    setShow(true);
    const timer1 = setTimeout(() => {
      setStage('zooming');
    }, 400);

    const timer2 = setTimeout(() => {
      setStage('fadeout');
    }, 2800);

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
        key="spatial-intro-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === 'fadeout' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFDF5] overflow-hidden select-none pointer-events-auto"
      >
        {/* Spatial Warm Ambient Radial Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FFF0B3]/40 via-[#FFF9E8]/80 to-[#FFFDF5] pointer-events-none" />
        
        {/* Subtle Spatial Mesh Dots */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#E7B83F 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />

        {/* Floating Spatial Geometric Rings */}
        <div className="absolute w-[500px] h-[500px] rounded-full border border-[#FFE99A]/50 pointer-events-none animate-pulse opacity-40" />
        <div className="absolute w-[700px] h-[700px] rounded-full border border-[#FFF0B3]/40 pointer-events-none opacity-30" />

        {/* Cinematic Spatial Camera Pullback Container */}
        <div className="relative flex flex-col items-center justify-center z-10 px-4">
          <motion.div
            initial={{ scale: 2.3, opacity: 0, y: 15 }}
            animate={
              stage === 'initial'
                ? { scale: 2.1, opacity: 1, y: 0 }
                : stage === 'zooming'
                ? { scale: 1.0, opacity: 1, y: 0 }
                : { scale: 0.94, opacity: 0.9, y: 0 }
            }
            transition={{
              duration: 2.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative flex flex-col items-center"
          >
            {/* Soft Golden Aura Glow behind Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.25, 1.1], opacity: [0.35, 0.7, 0.45] }}
              transition={{ duration: 2.4, ease: 'easeInOut' }}
              className="absolute -inset-10 bg-gradient-to-tr from-[#FFE99A]/60 via-[#FFF0B3]/50 to-transparent rounded-full blur-3xl pointer-events-none"
            />

            {/* Elevated Floating Spatial Card for College Logo */}
            <div className="relative w-44 h-56 sm:w-56 sm:h-72 md:w-64 md:h-80 rounded-3xl bg-white/95 p-4 border border-[#F0E8D4] shadow-[0_20px_50px_rgba(231,184,63,0.18),0_10px_20px_rgba(0,0,0,0.04)] backdrop-blur-md">
              <Image
                src="/college-logo.jpg"
                alt="Hindusthan Educational and Charitable Trust"
                fill
                priority
                className="object-contain p-2"
                sizes="(max-width: 768px) 240px, 320px"
              />
            </div>

            {/* Institutional Brand Reveal with Spatial Typography */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={stage === 'zooming' ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ delay: 0.6, duration: 1.0, ease: 'easeOut' }}
              className="text-center mt-7 px-4"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-[#252525] uppercase font-sans">
                Hindusthan Educational & Charitable Trust
              </h1>
              
              <div className="flex items-center justify-center gap-3 mt-2.5">
                <span className="h-[1.5px] w-12 bg-gradient-to-r from-transparent to-[#E7B83F]"></span>
                <p className="text-xs sm:text-sm tracking-[0.25em] text-[#C99A27] uppercase font-bold">
                  Central Event Hub & Discovery Platform
                </p>
                <span className="h-[1.5px] w-12 bg-gradient-to-l from-transparent to-[#E7B83F]"></span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Spatial Skip Pill Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={handleSkip}
          className="absolute bottom-8 right-8 z-20 px-5 py-2.5 text-xs font-bold tracking-wider text-[#252525] bg-white/85 hover:bg-white border border-[#F0E8D4] hover:border-[#E7B83F] rounded-full shadow-[0_4px_16px_rgba(231,184,63,0.15)] backdrop-blur-md transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Skip Intro →
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
