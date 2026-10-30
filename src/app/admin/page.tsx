'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Calendar, 
  Layers, 
  Users, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  Upload, 
  Download, 
  Search, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Clock,
  AlertCircle
} from 'lucide-react';
import { EventItem, EventCategory, EventTheme, ThemePreset } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/themePresets';

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading, logout, quickLogin } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'manage' | 'create' | 'registrations' | 'categories'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<(EventItem & { category?: EventCategory; theme?: EventTheme; registration_count?: number })[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Search & filter in Manage table
  const [manageSearch, setManageSearch] = useState('');
  const [manageCategory, setManageCategory] = useState('all');

  // Registration overview filter
  const [regFilterEvent, setRegFilterEvent] = useState('all');
  const [regSearch, setRegSearch] = useState('');

  // Editing state (if editing an existing event)
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    slug: '',
    short_description: '',
    description: '',
    category_id: 'cat-1',
    department: '',
    organizer: '',
    poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80',
    start_date: '2026-11-25',
    end_date: '2026-11-26',
    start_time: '09:00',
    end_time: '17:00',
    venue: '',
    registration_enabled: true,
    registration_type: 'builtin' as 'builtin' | 'external',
    registration_url: '',
    registration_deadline: '2026-11-20T23:59:59',
    publication_status: 'published' as 'published' | 'draft' | 'unpublished',
    eligibility: 'Open to all college and university students with valid ID.',
    highlights: ['Cash Prizes & Certificates', 'Keynote Sessions', 'Direct Mentorship'],
    rules: ['Teams must adhere to code of conduct', 'Valid student ID mandatory'],
    schedule: [
      { time: '09:00 AM', title: 'Inauguration & Registration', description: 'Kit distribution and welcome address.' },
      { time: '11:00 AM', title: 'Session 1 / Kickoff', description: 'Main event starts across venues.' },
    ],
    prizes: [
      { rank: '1st Place', title: 'Winner Trophy', reward: '₹25,000' },
      { rank: '2nd Place', title: 'Runner Up', reward: '₹15,000' },
    ],
    coordinators: [
      { name: 'Dr. Coordinator', role: 'Staff In-charge', phone: '+91 98765 00000', email: 'coordinator@hindusthan.net' },
    ],
  });

  // Form Theme State
  const [themeData, setThemeData] = useState<Partial<EventTheme>>({
    theme_preset: 'tech-symposium',
    primary_color: '#00f0ff',
    secondary_color: '#7000ff',
    accent_color: '#38bdf8',
    background_color: '#070b19',
    text_color: '#f8fafc',
    heading_font: 'Rajdhani',
    body_font: 'Inter',
    hero_layout: 'split',
    button_style: 'cyber',
    card_style: 'neon',
    background_style: 'circuits',
    animation_style: 'futuristic',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Load all initial admin data
  const loadAdminData = async () => {
    try {
      setLoadingData(true);
      const [statsRes, eventsRes, catRes, regRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/events?publicOnly=false'),
        fetch('/api/categories'),
        fetch('/api/admin/registrations'),
      ]);

      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData.stats);
      }
      if (eventsRes.ok) {
        const eData = await eventsRes.json();
        setEvents(eData.events || []);
      }
      if (catRes.ok) {
        const cData = await catRes.json();
        setCategories(cData.categories || []);
      }
      if (regRes.ok) {
        const rData = await regRes.json();
        setRegistrations(rData.registrations || []);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  // Handle Preset Selection
  const handlePresetSelect = (presetKey: ThemePreset) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      setThemeData({
        ...preset,
        theme_preset: presetKey,
      });
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'poster_url' | 'cover_image_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      setFormData((prev) => ({ ...prev, [targetField]: data.url }));
    } catch (err: any) {
      alert(`Image upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Toggle Registration ON/OFF instantly from Table
  const handleToggleRegistration = async (eventItem: EventItem) => {
    try {
      const nextState = !eventItem.registration_enabled;
      const res = await fetch(`/api/events/${eventItem.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventData: { registration_enabled: nextState },
        }),
      });
      if (res.ok) {
        await loadAdminData();
      }
    } catch (err) {
      console.error('Failed to toggle registration:', err);
    }
  };

  // Toggle Publication status
  const handleTogglePublish = async (eventItem: EventItem) => {
    try {
      const nextStatus = eventItem.publication_status === 'published' ? 'draft' : 'published';
      const res = await fetch(`/api/events/${eventItem.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventData: { publication_status: nextStatus },
        }),
      });
      if (res.ok) {
        await loadAdminData();
      }
    } catch (err) {
      console.error('Failed to toggle publication:', err);
    }
  };

  // Delete event with confirmation
  const handleDeleteEvent = async (eventItem: EventItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${eventItem.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${eventItem.slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await loadAdminData();
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  // Open Edit Mode
  const startEditEvent = (eventItem: any) => {
    setEditingEventId(eventItem.id);
    setFormData({
      title: eventItem.title,
      tagline: eventItem.tagline || '',
      slug: eventItem.slug,
      short_description: eventItem.short_description || '',
      description: eventItem.description || '',
      category_id: eventItem.category_id,
      department: eventItem.department,
      organizer: eventItem.organizer,
      poster_url: eventItem.poster_url,
      cover_image_url: eventItem.cover_image_url,
      start_date: eventItem.start_date,
      end_date: eventItem.end_date,
      start_time: eventItem.start_time,
      end_time: eventItem.end_time,
      venue: eventItem.venue,
      registration_enabled: eventItem.registration_enabled,
      registration_type: eventItem.registration_type || 'builtin',
      registration_url: eventItem.registration_url || '',
      registration_deadline: eventItem.registration_deadline || '',
      publication_status: eventItem.publication_status,
      eligibility: eventItem.eligibility || '',
      highlights: eventItem.highlights || [],
      rules: eventItem.rules || [],
      schedule: eventItem.schedule || [],
      prizes: eventItem.prizes || [],
      coordinators: eventItem.coordinators || [],
    });

    if (eventItem.theme) {
      setThemeData(eventItem.theme);
    }
    setActiveTab('create');
  };

  // Reset Form for New Event
  const resetForm = () => {
    setEditingEventId(null);
    setFormData({
      title: '',
      tagline: '',
      slug: '',
      short_description: '',
      description: '',
      category_id: 'cat-1',
      department: 'Dept of Computer Science & Engineering',
      organizer: 'Hindusthan Student Affairs',
      poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80',
      start_date: '2026-11-25',
      end_date: '2026-11-26',
      start_time: '09:00',
      end_time: '17:00',
      venue: 'Main Auditorium, Valley Campus',
      registration_enabled: true,
      registration_type: 'builtin',
      registration_url: '',
      registration_deadline: '2026-11-20T23:59:59',
      publication_status: 'published',
      eligibility: 'Open to all college students.',
      highlights: ['Inter-college championship', 'Exciting cash rewards'],
      rules: ['College ID mandatory'],
      schedule: [{ time: '09:30 AM', title: 'Inauguration', description: 'Opening ceremony' }],
      prizes: [{ rank: '1st Place', title: 'Winner Trophy', reward: '₹20,000' }],
      coordinators: [{ name: 'Staff In-charge', role: 'Faculty', phone: '+91 98765 43210', email: 'staff@hindusthan.net' }],
    });
    handlePresetSelect('tech-symposium');
    setFormError(null);
    setFormSuccess(null);
  };

  // Submit Create or Update
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validation
    if (!formData.title.trim() || !formData.venue.trim() || !formData.start_date) {
      setFormError('Please fill in title, venue, and event start date.');
      return;
    }

    try {
      const url = editingEventId 
        ? `/api/events/${formData.slug}`
        : '/api/events';
      const method = editingEventId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventData: formData,
          themeData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save event');
      }

      setFormSuccess(editingEventId ? 'Event updated successfully!' : 'Event published successfully!');
      await loadAdminData();

      setTimeout(() => {
        setActiveTab('manage');
        resetForm();
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    }
  };

  // If user is not admin, show login prompt
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b19] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#070b19] flex items-center justify-center px-4 text-white">
        <div className="max-w-md w-full bg-[#0c1222] border border-amber-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Admin Privileges Required</h2>
            <p className="text-xs text-slate-400 mt-2">
              You must be authenticated as a college administrator to access the CMS management dashboard.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => quickLogin('admin')}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
            >
              ⚡ Instant 1-Click Admin Login
            </button>
            <Link
              href="/login"
              className="block w-full py-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
            >
              Go to Standard Login Page
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 w-full bg-[#090f24] border-b border-slate-800 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 text-white group">
            <div className="relative w-8 h-10 rounded bg-white p-0.5 border border-amber-400/50">
              <Image src="/college-logo.jpg" alt="Logo" fill className="object-contain" sizes="32px" />
            </div>
            <span className="font-bold text-sm hidden sm:inline text-amber-400">
              HINDUSTHAN CMS
            </span>
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-bold text-slate-300 bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/20">
            Admin Console
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden md:inline">
            Admin: <strong className="text-white">{user.full_name}</strong>
          </span>
          <Link
            href="/"
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </Link>
          <button
            onClick={() => logout()}
            className="p-2 text-slate-400 hover:text-red-400 bg-slate-800/60 rounded-lg"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setActiveTab('create');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{editingEventId ? 'Edit Event' : 'Create Event'}</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'manage'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Manage Events ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'registrations'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registrations ({registrations.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Events</p>
                  <p className="text-3xl font-black text-white mt-1">{stats.total}</p>
                  <p className="text-[11px] text-amber-400 mt-1">{stats.published} Published • {stats.drafts} Drafts</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Registration ON</p>
                  <p className="text-3xl font-black text-emerald-400 mt-1">{stats.regEnabled}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{stats.regDisabled} Closed Events</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Registrations</p>
                  <p className="text-3xl font-black text-blue-400 mt-1">{stats.totalRegistrations}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Across all events</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Upcoming Events</p>
                  <p className="text-3xl font-black text-amber-300 mt-1">{stats.upcoming}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{stats.ongoing} Ongoing right now</p>
                </div>
              </div>
            )}

            {/* Quick Actions & Recent Events */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0c1222] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Recent Events Management</h3>
                  <button 
                    onClick={() => setActiveTab('manage')}
                    className="text-xs font-semibold text-amber-400 hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {events.slice(0, 4).map((ev) => (
                    <div 
                      key={ev.id} 
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: ev.theme?.primary_color || '#3b82f6' }} 
                          />
                          <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {ev.start_date} • {ev.venue} • {ev.registration_count || 0} Registered
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {ev.registration_enabled ? (
                          <span className="px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 rounded-md">
                            Reg ON
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 bg-slate-800 rounded-md">
                            Reg OFF
                          </span>
                        )}

                        <button
                          onClick={() => startEditEvent(ev)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                        >
                          Edit
                        </button>

                        <Link
                          href={`/events/${ev.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-amber-400"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Launch Panel */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-[#0c1222] border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white">Event Engine Shortcuts</h3>
                <p className="text-xs text-slate-400">
                  Publish a new event in minutes with customizable cyber, festive, or athletic themes.
                </p>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('create');
                    }}
                    className="w-full py-3 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create New Event</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('registrations')}
                    className="w-full py-3 rounded-xl font-semibold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Participant Sheets</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE EVENTS TABLE */}
        {activeTab === 'manage' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search & Filter header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter events by title or slug..."
                  value={manageSearch}
                  onChange={(e) => setManageSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setActiveTab('create');
                }}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>

            {/* Events Management Table */}
            <div className="rounded-2xl border border-slate-800 bg-[#0c1222] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Event & URL</th>
                      <th className="py-3.5 px-4">Date & Venue</th>
                      <th className="py-3.5 px-4">Theme Preset</th>
                      <th className="py-3.5 px-4 text-center">Registration (ON/OFF)</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Registrations</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {events
                      .filter((e) => !manageSearch || e.title.toLowerCase().includes(manageSearch.toLowerCase()) || e.slug.includes(manageSearch.toLowerCase()))
                      .map((ev) => (
                        <tr key={ev.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-bold text-white text-sm line-clamp-1">{ev.title}</div>
                            <div className="font-mono text-[11px] text-amber-400/80 mt-0.5">/events/{ev.slug}</div>
                          </td>
                          <td className="py-4 px-4 text-slate-300">
                            <div>{ev.start_date}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{ev.venue}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span 
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium"
                              style={{ 
                                backgroundColor: `${ev.theme?.primary_color || '#3b82f6'}20`,
                                color: ev.theme?.primary_color || '#3b82f6'
                              }}
                            >
                              <span 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: ev.theme?.primary_color || '#3b82f6' }}
                              />
                              {ev.theme?.theme_preset || 'Custom'}
                            </span>
                          </td>
                          {/* 1-Click Instant Toggle for Registration ON/OFF */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleToggleRegistration(ev)}
                              title="Click to toggle Registration ON/OFF"
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                ev.registration_enabled
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900'
                                  : 'bg-rose-950 text-rose-300 border border-rose-500/50 hover:bg-rose-900'
                              }`}
                            >
                              {ev.registration_enabled ? (
                                <>
                                  <ToggleRight className="w-4 h-4 text-emerald-400" />
                                  <span>REG ON</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="w-4 h-4 text-rose-400" />
                                  <span>REG OFF</span>
                                </>
                              )}
                            </button>
                          </td>
                          {/* Publish status */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleTogglePublish(ev)}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                                ev.publication_status === 'published'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {ev.publication_status.toUpperCase()}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-white">
                            {ev.registration_count || 0}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/events/${ev.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                                title="View Webpage"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => startEditEvent(ev)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                                title="Edit Event"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(ev)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CREATE / EDIT EVENT CMS EDITOR */}
        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white">
                  {editingEventId ? 'Edit College Event' : 'Create & Publish New Event'}
                </h2>
                <p className="text-xs text-slate-400">
                  Configure event details, upload posters, customize bespoke themes, and toggle student registration.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('manage')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            {formError && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveEvent} className="space-y-8">
              
              {/* SECTION A — Basic Information */}
              <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Section A — Basic Information</span>
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. National Hackathon 2026 or Frame Fest 2026"
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                        setFormData((prev) => ({
                          ...prev,
                          title,
                          slug: editingEventId ? prev.slug : generatedSlug,
                        }));
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">URL Slug *</label>
                      <div className="flex items-center">
                        <span className="px-3 py-2.5 rounded-l-xl bg-slate-800 text-slate-400 text-xs border border-r-0 border-slate-700">
                          /events/
                        </span>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-r-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                      <input
                        type="text"
                        placeholder="Inspiring short motto or punchline"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.category_name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Organizer</label>
                      <input
                        type="text"
                        value={formData.organizer}
                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description (Card summary)</label>
                    <textarea
                      rows={2}
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description (Event webpage)</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B — Media & Poster Upload */}
              <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Section B — Event Images and Media</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Main Event Poster</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-24 h-32 rounded-lg overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                        {formData.poster_url && (
                          <Image src={formData.poster_url} alt="Poster" fill className="object-cover" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'poster_url')}
                          className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-slate-950 hover:file:bg-amber-300"
                        />
                        <input
                          type="text"
                          placeholder="Or paste poster image URL"
                          value={formData.poster_url}
                          onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cover / Background Image</label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'cover_image_url')}
                        className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Cover image URL"
                        value={formData.cover_image_url}
                        onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION C — Date and Venue */}
              <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Section C — Date and Venue (Asia/Kolkata)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / Auditorium *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. APJ Abdul Kalam Auditorium, Hindusthan Valley Campus"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* SECTION E — Mandatory Registration Configuration */}
              <div className="p-6 rounded-2xl bg-[#0c1222] border-2 border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Section E — Registration Configuration (Mandatory)</span>
                  </h3>
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                    Core Business Rule
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Select whether normal students can submit registrations for this event. When OFF, registration is locked and new submissions are rejected at the backend.
                </p>

                {/* Clear Two-Option Switch as required by prompt */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, registration_enabled: true })}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      formData.registration_enabled
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-400" />
                    <p className="font-extrabold text-sm text-white">REGISTRATION ON</p>
                    <p className="text-[11px] opacity-75 mt-0.5">Students can register online</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, registration_enabled: false })}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      !formData.registration_enabled
                        ? 'bg-rose-950/80 border-rose-400 text-rose-200 shadow-lg shadow-rose-500/10'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <XCircle className="w-6 h-6 mx-auto mb-1 text-rose-400" />
                    <p className="font-extrabold text-sm text-white">REGISTRATION OFF</p>
                    <p className="text-[11px] opacity-75 mt-0.5">Registration closed or disabled</p>
                  </button>
                </div>

                {formData.registration_enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Mechanism</label>
                      <select
                        value={formData.registration_type}
                        onChange={(e) => setFormData({ ...formData, registration_type: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                      >
                        <option value="builtin">Built-in Student Form & Digital QR Ticket</option>
                        <option value="external">External Registration URL (Google Form / Unstop)</option>
                      </select>
                    </div>

                    {formData.registration_type === 'external' ? (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">External Link</label>
                        <input
                          type="url"
                          placeholder="https://forms.gle/..."
                          value={formData.registration_url}
                          onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Deadline</label>
                        <input
                          type="datetime-local"
                          value={formData.registration_deadline}
                          onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION F — Event Theme Customizer & Presets */}
              <div className="p-6 rounded-2xl bg-[#0c1222] border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Section F — Event Bespoke Theme Studio</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Dynamic Webpage Engine</span>
                </div>

                {/* Theme Preset Selector Pills */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Ready-Made Category Theme Presets</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {(Object.keys(THEME_PRESETS) as ThemePreset[]).filter(k => k !== 'custom').map((presetKey) => {
                      const p = THEME_PRESETS[presetKey];
                      const isSelected = themeData.theme_preset === presetKey;
                      return (
                        <button
                          key={presetKey}
                          type="button"
                          onClick={() => handlePresetSelect(presetKey)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-amber-400 bg-slate-800 shadow-md'
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primary_color }} />
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.secondary_color }} />
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.accent_color }} />
                          </div>
                          <p className="text-xs font-bold text-white capitalize">{presetKey.replace('-', ' ')}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Granular Color Controls */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeData.primary_color || '#3b82f6'}
                        onChange={(e) => setThemeData({ ...themeData, primary_color: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono">{themeData.primary_color}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeData.secondary_color || '#8b5cf6'}
                        onChange={(e) => setThemeData({ ...themeData, secondary_color: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono">{themeData.secondary_color}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Accent Glow</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeData.accent_color || '#f59e0b'}
                        onChange={(e) => setThemeData({ ...themeData, accent_color: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono">{themeData.accent_color}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Background Tone</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeData.background_color || '#070b19'}
                        onChange={(e) => setThemeData({ ...themeData, background_color: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono">{themeData.background_color}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Background Style</label>
                    <select
                      value={themeData.background_style || 'circuits'}
                      onChange={(e) => setThemeData({ ...themeData, background_style: e.target.value as any })}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                    >
                      <option value="circuits">Circuits (Tech)</option>
                      <option value="grid">Grid (Cyber)</option>
                      <option value="waves">Waves (Festival)</option>
                      <option value="mesh">Mesh (Sports)</option>
                      <option value="minimal">Minimal (Clean)</option>
                    </select>
                  </div>
                </div>

                {/* Typography choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Heading Font</label>
                    <select
                      value={themeData.heading_font || 'Rajdhani'}
                      onChange={(e) => setThemeData({ ...themeData, heading_font: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                    >
                      <option value="Rajdhani">Rajdhani (Futuristic / Tech)</option>
                      <option value="Cinzel">Cinzel (Artistic / Festive)</option>
                      <option value="Orbitron">Orbitron (Cyberpunk / Matrix)</option>
                      <option value="Inter">Inter (Clean / Executive)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Button & Card Design</label>
                    <select
                      value={themeData.button_style || 'cyber'}
                      onChange={(e) => setThemeData({ ...themeData, button_style: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                    >
                      <option value="cyber">Cyberpunk High-Contrast</option>
                      <option value="pill">Pill Rounded Smooth</option>
                      <option value="glow">Energetic Glow Shadow</option>
                      <option value="rounded">Modern Rounded Minimal</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION G — Publishing Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-slate-400">Publication Status:</label>
                  <select
                    value={formData.publication_status}
                    onChange={(e) => setFormData({ ...formData, publication_status: e.target.value as any })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                  >
                    <option value="published">Published (Publicly Visible)</option>
                    <option value="draft">Save as Draft</option>
                    <option value="unpublished">Unpublished</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('manage')}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-xl font-black text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-xl shadow-amber-400/20"
                  >
                    {editingEventId ? 'Save Changes' : 'Publish College Event'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* TAB 4: REGISTRATIONS OVERVIEW & CSV EXPORT */}
        {activeTab === 'registrations' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Event Participant Registrations</h2>
                <p className="text-xs text-slate-400">
                  Inspect student registrations across events, search participants, or export official sheets to CSV.
                </p>
              </div>

              <a
                href={`/api/admin/registrations?format=csv${regFilterEvent !== 'all' ? `&event_id=${regFilterEvent}` : ''}`}
                download
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 self-start sm:self-auto shadow-md shadow-emerald-400/20"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV Spreadsheet</span>
              </a>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student name, email, reg no..."
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <select
                  value={regFilterEvent}
                  onChange={(e) => setRegFilterEvent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="all">All Events ({registrations.length} registrations)</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Registrations Table */}
            <div className="rounded-2xl border border-slate-800 bg-[#0c1222] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Register No</th>
                      <th className="py-3.5 px-4">Event</th>
                      <th className="py-3.5 px-4">Department & Year</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {registrations
                      .filter((r) => regFilterEvent === 'all' || r.event_id === regFilterEvent)
                      .filter((r) => !regSearch || r.full_name.toLowerCase().includes(regSearch.toLowerCase()) || r.email.toLowerCase().includes(regSearch.toLowerCase()) || r.register_number.toLowerCase().includes(regSearch.toLowerCase()))
                      .map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-900/40">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{reg.full_name}</div>
                            <div className="text-[11px] text-slate-400">{reg.email}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-amber-400 font-medium">
                            {reg.register_number}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-semibold max-w-[200px] truncate">
                            {reg.event_title}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            <div>{reg.department}</div>
                            <div className="text-[11px] text-slate-500">{reg.year}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-mono">
                            {reg.contact_number || 'N/A'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                              {reg.registration_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
