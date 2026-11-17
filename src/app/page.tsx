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
import { useDelayedLoading } from '@/hooks/useDelayedLoading';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [events, setEvents] = useState<(EventItem & { category?: EventCategory; theme?: EventTheme; registration_count?: number })[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [replayIntro, setReplayIntro] = useState(false);

  const { showSkeleton, isTimedOut } = useDelayedLoading(loading, { delay: 150, minDuration: 350, timeout: 8000 });

  useEffect(() => {
    if (!authLoading && !user) {
      const viewed = typeof window !== 'undefined' ? sessionStorage.getItem('hindusthan_intro_viewed') : null;
      if (viewed) {
        // If intro was already seen in this session, go directly to login
        router.push('/login');
      }
    }
  }, [authLoading, user, router]);

  const loadData = async () => {
    setLoading(true);
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
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIntroComplete = () => {
    setReplayIntro(false);
    sessionStorage.setItem('hindusthan_intro_viewed', 'true');
    // If not authenticated, smoothly transition to /login upon intro completion
    if (!authLoading && !user) {
      router.push('/login');
    }
  };

  const featuredEvent = events[0];

  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#252525] flex flex-col selection:bg-[#FFE99A] selection:text-[#252525]">
      {/* Opening Animated College Logo Zoom-Out Intro */}
      <LogoIntro
        forceShow={replayIntro}
        onComplete={handleIntroComplete}
      />

      {/* Spatial Floating Navbar with Account Profile Dropdown */}
      <Navbar onReplayIntro={() => setReplayIntro(true)} />

      {/* Spatial Hero Section */}
      <HeroSection
        featuredEvent={featuredEvent}
        totalEventsCount={events.length}
        isLoading={showSkeleton}
      />

      {/* Central Event Discovery & Categorized Rectangular Divisions */}
      <EventDiscovery
        initialEvents={events}
        categories={categories}
        isLoading={showSkeleton}
        isTimedOut={isTimedOut}
        onRetry={loadData}
      />

      {/* AIML Historical Archives Highlight */}
      <AimlArchiveBanner />

      {/* Institutional About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
