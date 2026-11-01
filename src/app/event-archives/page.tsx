'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { EventArchive } from '@/lib/types';
import { 
  Search, 
  Calendar, 
  User, 
  Users, 
  MapPin, 
  Camera, 
  ArrowRight, 
  Sparkles, 
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Filter
} from 'lucide-react';

export default function EventArchivesPage() {
  const [archives, setArchives] = useState<EventArchive[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('all');

  useEffect(() => {
    async function fetchArchives() {
      try {
        const res = await fetch('/api/archives');
        const data = await res.json();
        if (data.archives) {
          setArchives(data.archives);
        }
      } catch (err) {
        console.error('Failed to load archives:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArchives();
  }, []);

  // Filter computation
  const filteredArchives = useMemo(() => {
    return archives.filter((item) => {
      // Academic year
      if (selectedAcademicYear !== 'all' && item.academic_year !== selectedAcademicYear) {
        return false;
      }

      // Year filter (from event_date_parsed or original string)
      if (selectedYear !== 'all') {
        const parsedYear = item.event_date_parsed?.split('-')[0];
        const matchesParsed = parsedYear === selectedYear;
        const matchesOriginal = item.event_date_original.includes(selectedYear);
        if (!matchesParsed && !matchesOriginal) return false;
      }

      // Month filter (from event_date_parsed: YYYY-MM-DD)
      if (selectedMonth !== 'all') {
        if (!item.event_date_parsed) return false;
        const month = item.event_date_parsed.split('-')[1];
        if (month !== selectedMonth) return false;
      }

      // Search query across event title, resource person, and coordinator
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.event_name.toLowerCase().includes(q);
        const matchesResource = item.resource_person.toLowerCase().includes(q);
        const matchesCoords = item.event_coordinators.toLowerCase().includes(q);
        const matchesSno = item.original_serial_number.toLowerCase().includes(q);
        const matchesDate = item.event_date_original.toLowerCase().includes(q);
        if (!matchesName && !matchesResource && !matchesCoords && !matchesSno && !matchesDate) {
          return false;
        }
      }

      return true;
    });
  }, [archives, selectedAcademicYear, selectedYear, selectedMonth, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedYear('all');
    setSelectedMonth('all');
    setSelectedAcademicYear('all');
  };

  const hasPhotosCount = archives.filter(a => !!a.photo_url).length;
  const hasGeoTagsCount = archives.filter(a => !!a.geo_tag).length;

  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#252525] flex flex-col selection:bg-[#FFE99A] selection:text-[#252525]">
      {/* Navigation */}
      <Navbar />

      {/* Header & Introductory Section */}
      <header className="relative pt-8 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Spatial Floating Hero Container */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#FFF9E8] via-white to-[#FFFDF5] border border-[#F0E8D4] p-6 sm:p-10 lg:p-12 shadow-[0_12px_40px_-8px_rgba(231,184,63,0.14)] overflow-hidden">
          <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full bg-[#FFE99A]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-80 h-80 rounded-full bg-[#FFF0B3]/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE99A]/40 border border-[#E7B83F]/30 text-xs font-black text-[#252525]">
              <Sparkles className="w-3.5 h-3.5 text-[#C99A27]" />
              <span>Department of Artificial Intelligence & Machine Learning</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#252525] tracking-tight">
              AIML EVENT ARCHIVES
            </h1>

            <p className="text-sm sm:text-base text-[#77736A] leading-relaxed font-sans">
              Explore the events, workshops, technical sessions, seminars and departmental activities conducted by the Department of Artificial Intelligence and Machine Learning.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-[#252525]">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#F0E8D4] shadow-xs">
                <span className="text-[#C99A27] font-black text-sm">{archives.length}</span>
                <span>Archived Events</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#F0E8D4] shadow-xs">
                <span className="text-[#C99A27] font-black text-sm">2025–2026</span>
                <span>Academic Year</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#F0E8D4] shadow-xs">
                <Camera className="w-3.5 h-3.5 text-[#C99A27]" />
                <span>{hasPhotosCount} Event Photos</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#F0E8D4] shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-[#C99A27]" />
                <span>{hasGeoTagsCount} GPS Geo-Tags</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area: Search & Filters + Archive Grid */}
      <section className="flex-1 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Filter Controls (Spatial Pill Card) */}
        <div className="rounded-3xl bg-white border border-[#F0E8D4] p-5 sm:p-6 shadow-spatial-sm space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-[#F0E8D4]/60 pb-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#252525]">
              <Filter className="w-4 h-4 text-[#C99A27]" />
              <span>Archive Filter & Discovery</span>
            </div>
            {(searchQuery || selectedYear !== 'all' || selectedMonth !== 'all' || selectedAcademicYear !== 'all') && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Live Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77736A]" />
              <input
                type="text"
                placeholder="Search event, resource person, coordinator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-xs font-medium text-[#252525] placeholder-[#77736A] focus:outline-none focus:border-[#E7B83F] focus:ring-2 focus:ring-[#FFE99A]/40 transition-all"
              />
            </div>

            {/* Academic Year Filter */}
            <div>
              <select
                aria-label="Filter by Academic Year"
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-xs font-semibold text-[#252525] focus:outline-none focus:border-[#E7B83F] transition-all cursor-pointer"
              >
                <option value="all">Academic Year: All (2025–2026)</option>
                <option value="2025-2026">Academic Year 2025–2026</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <select
                aria-label="Filter by Calendar Year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-xs font-semibold text-[#252525] focus:outline-none focus:border-[#E7B83F] transition-all cursor-pointer"
              >
                <option value="all">Year: All Years</option>
                <option value="2025">2025 (15 Events)</option>
                <option value="2026">2026 (5 Events)</option>
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <select
                aria-label="Filter by Month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-xs font-semibold text-[#252525] focus:outline-none focus:border-[#E7B83F] transition-all cursor-pointer"
              >
                <option value="all">Month: All Months</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#77736A] pt-1">
            <span>
              Showing <strong className="text-[#252525]">{filteredArchives.length}</strong> of{' '}
              <strong className="text-[#252525]">{archives.length}</strong> official archive records
            </span>
            <span className="hidden sm:inline">Authoritative Source: 2025-2026 AIML EVENT DETAILS CONSOLIDATED.docx</span>
          </div>
        </div>

        {/* Archives Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#E7B83F] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[#77736A] text-xs sm:text-sm font-semibold">Loading historical archives...</p>
          </div>
        ) : filteredArchives.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white border border-[#F0E8D4] p-8 shadow-spatial-sm">
            <BookOpen className="w-12 h-12 text-[#C99A27] mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-black text-[#252525]">No historical records found</h3>
            <p className="text-xs text-[#77736A] mt-1 max-w-sm mx-auto">
              No archived events matched your selected filter criteria. Try resetting your search filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-[#FFE99A] text-xs font-bold text-[#252525] hover:bg-[#E7B83F] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArchives.map((archive) => (
              <article
                key={archive.id}
                className="group flex flex-col justify-between rounded-3xl bg-white border border-[#F0E8D4] hover:border-[#E7B83F] shadow-spatial-sm hover:shadow-[0_16px_36px_rgba(231,184,63,0.18)] transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Event Photo / Thumbnail */}
                <div className="relative w-full h-52 sm:h-56 bg-[#FFF9E8] overflow-hidden border-b border-[#F0E8D4]/60">
                  {archive.photo_url ? (
                    <Image
                      src={archive.photo_url}
                      alt={archive.event_name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : archive.geo_tag ? (
                    <Image
                      src={archive.geo_tag}
                      alt={archive.event_name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#77736A] p-4 text-center">
                      <Camera className="w-10 h-10 text-[#C99A27]/50 mb-2" />
                      <span className="text-xs font-bold text-[#252525]">Official Department Event</span>
                      <span className="text-[10px] text-[#77736A]">Photographic Record Archived in Department</span>
                    </div>
                  )}

                  {/* S.No Badge (Preserves original serial number) */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#F0E8D4] text-[11px] font-black text-[#252525] shadow-sm">
                    S.No. {archive.original_serial_number}
                  </div>

                  {/* Geo-Tag badge if available */}
                  {archive.geo_tag && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#10b981]/15 text-[#059669] border border-[#10b981]/30 backdrop-blur-md text-[10px] font-black shadow-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Geo-Tagged</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Event Date (Original format strictly preserved) */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#C99A27]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{archive.event_date_original}</span>
                    </div>

                    {/* Event Title (Exact original text) */}
                    <h3 className="text-base font-black text-[#252525] group-hover:text-[#C99A27] transition-colors leading-snug font-sans line-clamp-3">
                      {archive.event_name}
                    </h3>

                    {/* Resource Person (if provided) */}
                    {archive.resource_person && (
                      <div className="p-3 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-xs">
                        <div className="flex items-start gap-2">
                          <User className="w-3.5 h-3.5 text-[#C99A27] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736A] block">
                              Resource Person
                            </span>
                            <p className="font-bold text-[#252525] whitespace-pre-line leading-relaxed">
                              {archive.resource_person}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Event Coordinators */}
                    {archive.event_coordinators && (
                      <div className="p-3 rounded-2xl bg-[#FFF9E8]/40 border border-[#F0E8D4] text-xs">
                        <div className="flex items-start gap-2">
                          <Users className="w-3.5 h-3.5 text-[#C99A27] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736A] block">
                              Event Coordinators
                            </span>
                            <p className="font-semibold text-[#252525] whitespace-pre-line leading-relaxed">
                              {archive.event_coordinators}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-3 border-t border-[#F0E8D4]/60">
                    <Link
                      href={`/event-archives/${archive.slug}`}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#FFFDF5] group-hover:bg-[#FFE99A] border border-[#F0E8D4] text-xs font-black text-[#252525] transition-all shadow-xs"
                    >
                      <span>View Historical Record</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </section>

      {/* Dedicated Attribution Area on Archive Page */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-6 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFE99A]/50 border border-[#E7B83F]/30 flex items-center justify-center text-[#252525] font-black text-sm">
              AIML
            </div>
            <div>
              <p className="text-xs font-black text-[#252525]">Historical Archive Registry</p>
              <p className="text-[11px] text-[#77736A]">Consolidated Department Activity Records • HiCET Coimbatore</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
            <div className="px-4 py-2 rounded-xl bg-[#FFFDF5] border border-[#F0E8D4]">
              <span className="text-[#77736A] font-semibold mr-1.5">Organized by:</span>
              <span className="font-bold text-[#252525]">Department of Artificial Intelligence and Machine Learning (AIML)</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#FFF0B3]/50 border border-[#FFE99A] text-[#252525] shadow-xs">
              <span className="text-[#77736A] font-semibold mr-1.5">Developed by:</span>
              <span className="font-black text-[#C99A27]">Vignesh S — AIML</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
