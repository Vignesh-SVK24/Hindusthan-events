'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import EventDiscovery from '@/components/EventDiscovery';
import AboutSection from '@/components/AboutSection';
import AimlArchiveBanner from '@/components/AimlArchiveBanner';
import Footer from '@/components/Footer';
import LogoIntro from '@/components/LogoIntro';
import { EventItem, EventCategory, EventTheme } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [events, setEvents] = useState<(EventItem & { category?: EventCategory; theme?: EventTheme; registration_count?: number })[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [replayIntro, setReplayIntro] = useState(false);

  // Check initial entry sequence:
  // If visitor is unauthenticated, the intro plays first and transitions to /login,
  // making /login the default landing experience for unauthenticated users.
  useEffect(() => {
    if (!authLoading && !user) {
      const viewed = typeof window !== 'undefined' ? sessionStorage.getItem('hindusthan_intro_viewed') : null;
      if (viewed) {
        // If intro was already seen in this session, go directly to login
        router.push('/login');
      }
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function loadData() {
      try {
        const [evRes, catRes] = await Promise.all([
          fetch('/api/events?publicOnly=true'),
          fetch('/api/categories'),
        ]);

        const evData = await evRes.json();
        const catData = await catRes.json();

        if (evData.events) setEvents(evData.events);
        if (catData.categories) setCategories(catData.categories);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleIntroComplete = () => {
    setReplayIntro(false);
    sessionStorage.setItem('hindusthan_intro_viewed', 'true');
    // If not authenticated, smoothly transition to /login upon intro completion
    if (!user) {
      router.push('/login');
    }
  };

  const featuredEvent = events[0];

  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#252525] flex flex-col selection:bg-[#FFE99A] selection:text-[#252525]">
      {/* Opening Animated College Logo Zoom-Out Intro */}
      <LogoIntro
        forceShow={replayIntro}
        disabled={!replayIntro && !!user}
        onComplete={handleIntroComplete}
      />

      {/* Spatial Floating Navbar with Account Profile Dropdown */}
      <Navbar onReplayIntro={() => setReplayIntro(true)} />

      {/* Spatial Hero Section */}
      <HeroSection featuredEvent={featuredEvent} totalEventsCount={events.length} />

      {/* Central Event Discovery & Categorized Rectangular Divisions */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#E7B83F] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#77736A] text-xs sm:text-sm font-semibold">Loading college events directory...</p>
        </div>
      ) : (
        <EventDiscovery initialEvents={events} categories={categories} />
      )}

      {/* AIML Historical Archives Highlight */}
      <AimlArchiveBanner />

      {/* Institutional About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
