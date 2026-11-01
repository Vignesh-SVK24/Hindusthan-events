'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers, AlertCircle } from 'lucide-react';
import EventCard from './EventCard';
import { EventItem, EventCategory, EventTheme } from '@/lib/types';

interface EventDiscoveryProps {
  initialEvents: (EventItem & {
    category?: EventCategory;
    theme?: EventTheme;
    registration_count?: number;
  })[];
  categories: EventCategory[];
}

export default function EventDiscovery({ initialEvents, categories }: EventDiscoveryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'newest'>('date');

  // Filtered & Sorted events
  const filteredEvents = useMemo(() => {
    let result = [...initialEvents];

    if (selectedCategory !== 'all') {
      result = result.filter((e) => e.category_id === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.tagline.toLowerCase().includes(q) ||
          e.short_description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
      );
    }

    const today = new Date().toISOString().split('T')[0];
    if (statusFilter === 'upcoming') {
      result = result.filter((e) => e.start_date >= today);
    } else if (statusFilter === 'completed') {
      result = result.filter((e) => e.end_date < today);
    } else if (statusFilter === 'registration_open') {
      result = result.filter((e) => e.registration_enabled);
    }

    if (sortBy === 'date') {
      result.sort((a, b) => a.start_date.localeCompare(b.start_date));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }

    return result;
  }, [initialEvents, selectedCategory, searchQuery, statusFilter, sortBy]);

  return (
    <section id="events-discovery" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#C99A27] uppercase mb-2">
            <Layers className="w-4 h-4" />
            <span>Campus Event Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#252525] tracking-tight">
            Centralized Event Discovery
          </h2>
          <p className="text-xs sm:text-sm text-[#77736A] mt-1 max-w-xl">
            Browse published college symposia, competitions, sports tournaments, and workshops across all Hindusthan institutions.
          </p>
        </div>

        {/* Stats pill */}
        <div className="text-left md:text-right">
          <span className="text-[11px] font-semibold text-[#77736A] uppercase tracking-wider">Showing</span>
          <p className="text-xl font-black text-[#252525]">
            <span className="text-[#C99A27]">{filteredEvents.length}</span> of {initialEvents.length} Events
          </p>
        </div>
      </div>

      {/* Floating Spatial Category Pills Bar */}
      <div className="relative mb-8 pb-3 border-b border-[#F0E8D4]">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-[#FFE99A] text-[#252525] border border-[#E7B83F] shadow-[0_4px_12px_rgba(231,184,63,0.25)]'
                : 'text-[#252525] hover:text-[#C99A27] bg-white hover:bg-[#FFF9E8] border border-[#F0E8D4] shadow-sm'
            }`}
          >
            All Events ({initialEvents.length})
          </button>

          {categories.map((cat) => {
            const count = initialEvents.filter((e) => e.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#FFE99A] text-[#252525] border border-[#E7B83F] shadow-[0_4px_12px_rgba(231,184,63,0.25)]'
                    : 'text-[#252525] hover:text-[#C99A27] bg-white hover:bg-[#FFF9E8] border border-[#F0E8D4] shadow-sm'
                }`}
              >
                {cat.category_name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Toolbar in Spatial Floating Containers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-8">
        
        {/* Search Input */}
        <div className="lg:col-span-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77736A]" />
          <input
            type="text"
            placeholder="Search by event title, department, venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-14 py-3 rounded-full bg-white border border-[#F0E8D4] text-[#252525] placeholder-[#77736A] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F] focus:ring-2 focus:ring-[#FFE99A]/50 shadow-spatial-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#77736A] hover:text-[#252525]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Dropdown */}
        <div className="lg:col-span-3">
          <select
            aria-label="Filter events by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-white border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#E7B83F] focus:ring-2 focus:ring-[#FFE99A]/50 shadow-spatial-sm cursor-pointer transition-all"
          >
            <option value="all">All Timelines</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="registration_open">Registration Open Only</option>
            <option value="completed">Past Events</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="lg:col-span-3">
          <select
            aria-label="Sort events"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'newest')}
            className="w-full px-4 py-3 rounded-full bg-white border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#E7B83F] focus:ring-2 focus:ring-[#FFE99A]/50 shadow-spatial-sm cursor-pointer transition-all"
          >
            <option value="date">Sort by Event Date</option>
            <option value="newest">Sort by Recently Added</option>
          </select>
        </div>

      </div>

      {/* Events Rectangular Grid (2 events per row) */}
      {filteredEvents.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="h-full flex flex-col"
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Spatial Empty State */
        <div className="rounded-3xl border border-dashed border-[#F0E8D4] bg-[#FFF9E8]/60 p-10 sm:p-14 text-center shadow-spatial-sm">
          <AlertCircle className="w-12 h-12 text-[#C99A27] mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-black text-[#252525] mb-1">No matching events found</h3>
          <p className="text-xs sm:text-sm text-[#77736A] max-w-md mx-auto mb-5 leading-relaxed">
            We couldn&apos;t find any events matching your selected category or search filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="px-5 py-2.5 text-xs font-black text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] rounded-full shadow-[0_4px_12px_rgba(231,184,63,0.25)] transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </section>
  );
}
