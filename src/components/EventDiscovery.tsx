'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, Layers, SlidersHorizontal, AlertCircle } from 'lucide-react';
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

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((e) => e.category_id === selectedCategory);
    }

    // Filter by Search Query
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

    // Filter by Status (upcoming, ongoing, completed)
    const today = new Date().toISOString().split('T')[0];
    if (statusFilter === 'upcoming') {
      result = result.filter((e) => e.start_date >= today);
    } else if (statusFilter === 'completed') {
      result = result.filter((e) => e.end_date < today);
    } else if (statusFilter === 'registration_open') {
      result = result.filter((e) => e.registration_enabled);
    }

    // Sorting
    if (sortBy === 'date') {
      result.sort((a, b) => a.start_date.localeCompare(b.start_date));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }

    return result;
  }, [initialEvents, selectedCategory, searchQuery, statusFilter, sortBy]);

  return (
    <section id="events-discovery" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-amber-400 uppercase mb-2">
            <Layers className="w-4 h-4" />
            <span>Campus Event Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Centralized Event Discovery
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Browse published college symposia, competitions, sports tournaments, and workshops across all Hindusthan institutions.
          </p>
        </div>

        {/* Stats counter */}
        <div className="text-right hidden md:block">
          <span className="text-xs font-medium text-slate-400">Showing</span>
          <p className="text-xl font-black text-amber-400">{filteredEvents.length} of {initialEvents.length} Events</p>
        </div>
      </div>

      {/* Category Navigation Pills (Horizontally scrollable with smooth slider) */}
      <div className="relative mb-8 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60'
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
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                {cat.category_name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-10">
        
        {/* Search Input */}
        <div className="lg:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by event title, department, venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Timelines</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="registration_open">Registration Open Only</option>
            <option value="completed">Past Events</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="lg:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'newest')}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-400"
          >
            <option value="date">Sort by Event Date</option>
            <option value="newest">Sort by Recently Added</option>
          </select>
        </div>

      </div>

      {/* Events Rectangular Grid */}
      {filteredEvents.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 gap-6"
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
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-slate-800 bg-[#0c1222]/50 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-amber-400/80 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No matching events found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-5">
            We couldn&apos;t find any events matching your selected category or search query.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </section>
  );
}
