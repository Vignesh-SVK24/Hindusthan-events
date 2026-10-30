'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import EventDiscovery from '@/components/EventDiscovery';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import LogoIntro from '@/components/LogoIntro';
import { EventItem, EventCategory, EventTheme } from '@/lib/types';

export default function HomePage() {
  const [events, setEvents] = useState<(EventItem & { category?: EventCategory; theme?: EventTheme; registration_count?: number })[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [replayIntro, setReplayIntro] = useState(false);

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

  const featuredEvent = events[0];

  return (
    <main className="min-h-screen bg-[#070b19] text-white flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Opening Animated College Logo Zoom-Out Intro */}
      <LogoIntro forceShow={replayIntro} onComplete={() => setReplayIntro(false)} />

      {/* Main Navbar */}
      <Navbar onReplayIntro={() => setReplayIntro(true)} />

      {/* Main Hero Section */}
      <HeroSection featuredEvent={featuredEvent} totalEventsCount={events.length} />

      {/* Central Event Discovery & Categorized Rectangular Divisions */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading college events directory...</p>
        </div>
      ) : (
        <EventDiscovery initialEvents={events} categories={categories} />
      )}

      {/* Institutional About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
