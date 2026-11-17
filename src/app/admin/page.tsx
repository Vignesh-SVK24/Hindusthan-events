'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Calendar, 
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
  AlertCircle,
  History,
  RotateCcw,
  ShieldAlert,
  Key
} from 'lucide-react';
import { EventItem, EventCategory, EventTheme, ThemePreset } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/themePresets';
import AdminArchiveManager from '@/components/AdminArchiveManager';
import { SkeletonDashboard, SkeletonTable, SkeletonBase } from '@/components/skeleton';

export default function AdminPage() {
  const { user, isAdmin, isDeveloper, isLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'manage' | 'create' | 'registrations' | 'archives' | 'trash'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<(EventItem & { category?: EventCategory; theme?: EventTheme; registration_count?: number; maximum_participants?: number })[]>([]);
  const [trashedEvents, setTrashedEvents] = useState<any[]>([]);
  const [actionLoadingSlug, setActionLoadingSlug] = useState<string | null>(null);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Search & filter in Manage table
  const [manageSearch, setManageSearch] = useState('');

  // Registration overview filter
  const [regFilterEvent, setRegFilterEvent] = useState('all');
  const [regSearch, setRegSearch] = useState('');

  // Editing state
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
    maximum_participants: undefined as number | undefined,
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

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const loadAdminData = async () => {
    setDataLoading(true);
    try {
      const [statsRes, eventsRes, catRes, regRes, trashRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/events?publicOnly=false'),
        fetch('/api/categories'),
        fetch('/api/admin/registrations'),
        fetch('/api/admin/trash'),
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
      if (trashRes.ok) {
        const tData = await trashRes.json();
        setTrashedEvents(tData.events || []);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const handlePresetSelect = (presetKey: ThemePreset) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      setThemeData({
        ...preset,
        theme_preset: presetKey,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'poster_url' | 'cover_image_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    }
  };

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

  const handleMoveToTrash = async (eventItem: EventItem) => {
    if (!confirm(`Move "${eventItem.title}" to Trash?\n\nIt will be immediately removed from the live website, homepage, and searches. All participant registrations remain safely preserved and can be restored by the developer.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${eventItem.slug}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        await loadAdminData();
        alert(data.message || `"${eventItem.title}" has been moved to Trash.`);
      } else {
        alert(data.error || 'Failed to move event to Trash.');
      }
    } catch (err) {
      console.error('Failed to move event to trash:', err);
    }
  };

  const handleRestoreEvent = async (eventItem: any) => {
    if (!confirm(`Restore "${eventItem.title}" from Trash?\n\nThis will reinstate the event on the public website and restore its dynamic URL (/events/${eventItem.slug}).`)) {
      return;
    }

    setActionLoadingSlug(eventItem.slug);
    try {
      const res = await fetch(`/api/admin/events/${eventItem.slug}/restore`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        await loadAdminData();
        alert(data.message || `Event "${eventItem.title}" has been restored successfully!`);
      } else {
        alert(data.error || 'Failed to restore event');
      }
    } catch (err: any) {
      alert(err.message || 'Restoration failed');
    } finally {
      setActionLoadingSlug(null);
    }
  };

  const handlePermanentDelete = async (eventItem: any) => {
    const confirmation = prompt(
      `WARNING: PERMANENT IRREVERSIBLE DELETION\n\nThis will permanently erase "${eventItem.title}" and all its ${eventItem.registration_count || 0} registration records from the database.\n\nTo confirm, type the slug "${eventItem.slug}" below:`
    );

    if (confirmation !== eventItem.slug) {
      if (confirmation !== null) {
        alert('Slug did not match. Permanent deletion cancelled.');
      }
      return;
    }

    setActionLoadingSlug(eventItem.slug);
    try {
      const res = await fetch(`/api/admin/events/${eventItem.slug}/permanent`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        await loadAdminData();
        alert(data.message || `Event "${eventItem.title}" has been permanently erased.`);
      } else {
        alert(data.error || 'Failed to delete event');
      }
    } catch (err: any) {
      alert(err.message || 'Permanent deletion failed');
    } finally {
      setActionLoadingSlug(null);
    }
  };

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
      maximum_participants: eventItem.maximum_participants,
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
      maximum_participants: undefined,
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

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

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

  if (isLoading) {
    return (
      <div aria-busy="true" aria-label="Loading Admin Console" className="min-h-screen bg-[#FFFDF5] text-[#252525] flex flex-col">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F0E8D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SkeletonBase className="w-9 h-9 rounded-xl" />
              <SkeletonBase className="w-32 h-6 rounded-full" />
              <span className="text-[#F0E8D4]">|</span>
              <SkeletonBase className="w-24 h-6 rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <SkeletonBase className="w-24 h-8 rounded-full" />
              <SkeletonBase className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </header>

        {/* Workspace Skeleton */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="flex items-center gap-2 pb-2">
            <SkeletonBase className="w-28 h-10 rounded-full" />
            <SkeletonBase className="w-32 h-10 rounded-full" />
            <SkeletonBase className="w-36 h-10 rounded-full" />
            <SkeletonBase className="w-36 h-10 rounded-full" />
          </div>
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center px-4 text-[#252525]">
        <div className="max-w-md w-full bg-white border border-[#F0E8D4] rounded-3xl p-8 text-center space-y-6 shadow-spatial-lg">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0B3] text-[#252525] mx-auto flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-[#C99A27]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#252525]">Admin Privileges Required</h2>
            <p className="text-xs text-[#77736A] mt-2">
              You must be authenticated as a college administrator to access the CMS management dashboard.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href="/login"
              className="block w-full py-3.5 rounded-full font-black text-sm text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-[0_4px_16px_rgba(231,184,63,0.3)] transition-all"
            >
              Sign In to Admin Console →
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#77736A] hover:text-[#C99A27]"
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
    <div className="min-h-screen bg-[#FFFDF5] text-[#252525] flex flex-col selection:bg-[#FFE99A] selection:text-[#252525]">
      
      {/* Admin Floating Spatial Header */}
      <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-2">
        <div className="max-w-7xl mx-auto rounded-full bg-white/95 backdrop-blur-xl border border-[#F0E8D4] shadow-spatial-sm px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 text-[#252525] group">
              <div className="relative w-8 h-10 rounded bg-white p-0.5 border border-[#F0E8D4]">
                <Image src="/college-logo.jpg" alt="Logo" fill className="object-contain" sizes="32px" />
              </div>
              <span className="font-black text-sm hidden sm:inline text-[#252525]">
                HINDUSTHAN CMS
              </span>
            </Link>
            <span className="text-[#F0E8D4]">|</span>
            <span className="text-[11px] font-bold text-[#C99A27] bg-[#FFF0B3]/50 px-3 py-1 rounded-full border border-[#F0E8D4]">
              Admin Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#77736A] hidden md:inline">
              Admin: <strong className="text-[#252525]">{user?.full_name || 'Administrator'}</strong>
            </span>
            <Link
              href="/"
              className="px-3.5 py-1.5 text-xs font-bold text-[#252525] bg-[#FFF9E8] hover:bg-[#FFE99A] border border-[#F0E8D4] rounded-full flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-[#C99A27]" />
              <span>Live Site</span>
            </Link>
            <button
              onClick={() => logout()}
              className="p-2 text-[#77736A] hover:text-rose-600 bg-[#FFFDF5] hover:bg-rose-50 border border-[#F0E8D4] rounded-full"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Spatial Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs Bar in Spatial Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-[#FFE99A] text-[#252525] border border-[#E7B83F] shadow-[0_4px_12px_rgba(231,184,63,0.25)]'
                : 'text-[#77736A] hover:text-[#252525] bg-white border border-[#F0E8D4] shadow-sm'
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-[#FFE99A] text-[#252525] border border-[#E7B83F] shadow-[0_4px_12px_rgba(231,184,63,0.25)]'
                : 'text-[#77736A] hover:text-[#252525] bg-white border border-[#F0E8D4] shadow-sm'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{editingEventId ? 'Edit Event' : 'Create Event'}</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'manage'
                ? 'bg-[#FFE99A] text-[#252525] border border-[#E7B83F] shadow-[0_4px_12px_rgba(231,184,63,0.25)]'
                : 'text-[#77736A] hover:text-[#252525] bg-white border border-[#F0E8D4] shadow-sm'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Manage Events ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'registrations'
                ? 'bg-[#FFE99A] text-[#252525] border border-[#E7B83F] shadow-[0_4px_12px_rgba(231,184,63,0.25)]'
                : 'text-[#77736A] hover:text-[#252525] bg-white border border-[#F0E8D4] shadow-sm'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registrations ({registrations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('archives')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'archives'
                ? 'bg-[#FFE99A] text-[#252525] border border-[#E7B83F] shadow-[0_4px_12px_rgba(231,184,63,0.25)]'
                : 'text-[#77736A] hover:text-[#252525] bg-white border border-[#F0E8D4] shadow-sm'
            }`}
          >
            <History className="w-4 h-4 text-[#C99A27]" />
            <span>Manage Event Archives</span>
          </button>

          {/* TAB 6: DEVELOPER TRASH & RECOVERY */}
          <button
            onClick={() => setActiveTab('trash')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'trash'
                ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-[0_4px_12px_rgba(244,63,94,0.2)]'
                : 'text-[#77736A] hover:text-rose-700 bg-white border border-[#F0E8D4] shadow-sm'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Developer Trash ({trashedEvents.length})</span>
            {isDeveloper && (
              <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-black uppercase">
                Dev Console
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          dataLoading && !stats ? (
            <SkeletonDashboard />
          ) : (
            <div className="space-y-8 animate-in fade-in duration-200">
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial">
                    <p className="text-[11px] text-[#77736A] uppercase font-bold tracking-wider">Total Events</p>
                    <p className="text-3xl font-black text-[#252525] mt-1">{stats.total}</p>
                    <p className="text-[11px] text-[#C99A27] font-semibold mt-1">{stats.published} Published • {stats.drafts} Drafts</p>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial">
                    <p className="text-[11px] text-[#77736A] uppercase font-bold tracking-wider">Registration ON</p>
                    <p className="text-3xl font-black text-emerald-600 mt-1">{stats.regEnabled}</p>
                    <p className="text-[11px] text-[#77736A] font-semibold mt-1">{stats.regDisabled} Closed Events</p>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial">
                    <p className="text-[11px] text-[#77736A] uppercase font-bold tracking-wider">Total Registrations</p>
                    <p className="text-3xl font-black text-[#252525] mt-1">{stats.totalRegistrations}</p>
                    <p className="text-[11px] text-[#C99A27] font-semibold mt-1">Across all published events</p>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial">
                    <p className="text-[11px] text-[#77736A] uppercase font-bold tracking-wider">Upcoming Events</p>
                    <p className="text-3xl font-black text-[#C99A27] mt-1">{stats.upcoming}</p>
                    <p className="text-[11px] text-[#77736A] font-semibold mt-1">{stats.ongoing} Ongoing right now</p>
                  </div>
                </div>
              )}

            {/* Recent Events & Shortcuts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#252525]">Recent Events Management</h3>
                  <button 
                    onClick={() => setActiveTab('manage')}
                    className="text-xs font-bold text-[#C99A27] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {events.slice(0, 4).map((ev) => (
                    <div 
                      key={ev.id} 
                      className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#E7B83F] transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-white shadow-sm" 
                            style={{ backgroundColor: ev.theme?.primary_color || '#E7B83F' }} 
                          />
                          <h4 className="text-sm font-bold text-[#252525]">{ev.title}</h4>
                        </div>
                        <p className="text-xs text-[#77736A] mt-1">
                          {ev.start_date} • {ev.venue} • {ev.registration_count || 0} Registered
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {ev.registration_enabled ? (
                          <span className="px-3 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 rounded-full">
                            Reg ON
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-[11px] font-bold text-[#77736A] bg-[#FFF9E8] rounded-full border border-[#F0E8D4]">
                            Reg OFF
                          </span>
                        )}

                        <button
                          onClick={() => startEditEvent(ev)}
                          className="px-3 py-1.5 text-xs font-bold text-[#252525] bg-white hover:bg-[#FFF9E8] border border-[#F0E8D4] rounded-full shadow-sm"
                        >
                          Edit
                        </button>

                        <Link
                          href={`/events/${ev.slug}`}
                          target="_blank"
                          className="p-1.5 text-[#77736A] hover:text-[#C99A27]"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Launch Panel */}
              <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial space-y-4">
                <h3 className="text-lg font-black text-[#252525]">Event Engine Shortcuts</h3>
                <p className="text-xs text-[#77736A] leading-relaxed">
                  Publish a new event in minutes with bespoke cyber, festive, or athletic spatial themes.
                </p>
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('create');
                    }}
                    className="w-full py-3.5 rounded-full font-black text-xs text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(231,184,63,0.25)]"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create New Event</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('registrations')}
                    className="w-full py-3.5 rounded-full font-bold text-xs text-[#252525] bg-[#FFF9E8] hover:bg-white border border-[#F0E8D4] flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4 text-[#C99A27]" />
                    <span>Download Participant Sheets</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          )
        )}

        {/* TAB 2: MANAGE EVENTS TABLE */}
        {activeTab === 'manage' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77736A]" />
                <input
                  type="text"
                  placeholder="Filter events by title or slug..."
                  value={manageSearch}
                  onChange={(e) => setManageSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F] shadow-spatial-sm"
                />
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setActiveTab('create');
                }}
                className="px-5 py-2.5 rounded-full font-black text-xs text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>

            {dataLoading && events.length === 0 ? (
              <SkeletonTable columns={7} rows={6} showToolbar={false} />
            ) : (
            <div className="rounded-3xl border border-[#F0E8D4] bg-white overflow-hidden shadow-spatial">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF9E8] border-b border-[#F0E8D4] text-[#77736A] uppercase font-bold">
                    <tr>
                      <th className="py-4 px-4 sm:px-6">Event & URL</th>
                      <th className="py-4 px-4">Date & Venue</th>
                      <th className="py-4 px-4">Theme Preset</th>
                      <th className="py-4 px-4 text-center">Registration (ON/OFF)</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-4 text-center">Registrations</th>
                      <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8D4]">
                    {events
                      .filter((e) => !manageSearch || e.title.toLowerCase().includes(manageSearch.toLowerCase()) || e.slug.includes(manageSearch.toLowerCase()))
                      .map((ev) => (
                        <tr key={ev.id} className="hover:bg-[#FFFDF5] transition-colors">
                          <td className="py-4 px-4 sm:px-6">
                            <div className="font-bold text-[#252525] text-sm line-clamp-1">{ev.title}</div>
                            <div className="font-mono text-[11px] text-[#C99A27] mt-0.5">/events/{ev.slug}</div>
                          </td>
                          <td className="py-4 px-4 text-[#77736A]">
                            <div className="font-semibold text-[#252525]">{ev.start_date}</div>
                            <div className="text-[11px] text-[#77736A] truncate max-w-[150px]">{ev.venue}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span 
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                              style={{ 
                                backgroundColor: `${ev.theme?.primary_color || '#E7B83F'}20`,
                                color: '#1f2937'
                              }}
                            >
                              <span 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: ev.theme?.primary_color || '#E7B83F' }}
                              />
                              {ev.theme?.theme_preset || 'Custom'}
                            </span>
                          </td>
                          {/* 1-Click Instant Toggle */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleToggleRegistration(ev)}
                              title="Click to toggle Registration ON/OFF"
                              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                                ev.registration_enabled
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                              }`}
                            >
                              {ev.registration_enabled ? (
                                <>
                                  <ToggleRight className="w-4 h-4 text-emerald-600" />
                                  <span>REG ON</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="w-4 h-4 text-rose-600" />
                                  <span>REG OFF</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleTogglePublish(ev)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                ev.publication_status === 'published'
                                  ? 'bg-[#FFE99A] text-[#252525] border border-[#E7B83F]'
                                  : 'bg-[#FFF9E8] text-[#77736A] border border-[#F0E8D4]'
                              }`}
                            >
                              {ev.publication_status}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center justify-center gap-1 font-black text-[#252525]">
                              <span>{ev.registration_count || 0}</span>
                              <span className="text-[#77736A] font-normal text-[11px]">/ {ev.maximum_participants || '∞'}</span>
                              <button
                                onClick={() => {
                                  setRegFilterEvent(ev.id);
                                  setActiveTab('registrations');
                                }}
                                className="ml-1 p-1 rounded-full text-[#C99A27] hover:bg-[#FFF0B3] transition-colors"
                                title="View registrations for this event"
                              >
                                <Users className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/events/${ev.slug}`}
                                target="_blank"
                                className="p-2 rounded-full text-[#77736A] hover:text-[#252525] hover:bg-[#FFF9E8]"
                                title="View Webpage"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => startEditEvent(ev)}
                                className="p-2 rounded-full text-[#77736A] hover:text-[#C99A27] hover:bg-[#FFF9E8]"
                                title="Edit Event"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleMoveToTrash(ev)}
                                className="p-2 rounded-full text-[#77736A] hover:text-rose-600 hover:bg-rose-50"
                                title="Move to Trash (Soft Delete)"
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
            )}
          </div>
        )}

        {/* TAB 3: CREATE / EDIT EVENT */}
        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#F0E8D4] pb-4">
              <div>
                <h2 className="text-xl font-black text-[#252525]">
                  {editingEventId ? 'Edit College Event' : 'Create & Publish New Event'}
                </h2>
                <p className="text-xs text-[#77736A]">
                  Configure event details, upload posters, customize bespoke themes, and toggle student registration.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('manage')}
                className="text-xs font-bold text-[#77736A] hover:text-[#252525]"
              >
                Cancel
              </button>
            </div>

            {formError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveEvent} className="space-y-6">
              
              {/* Section A: Basic Info */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#C99A27] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Section A — Basic Information</span>
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Event Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. National Hackathon 2026"
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
                      className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#252525] mb-1">URL Slug *</label>
                      <div className="flex items-center">
                        <span className="px-3.5 py-2.5 rounded-l-full bg-[#FFF9E8] text-[#77736A] text-xs font-bold border border-r-0 border-[#F0E8D4]">
                          /events/
                        </span>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-r-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F] font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#252525] mb-1">Tagline</label>
                      <input
                        type="text"
                        placeholder="Short motto or punchline"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#252525] mb-1">Category *</label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#E7B83F]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.category_name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#252525] mb-1">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#252525] mb-1">Organizer</label>
                      <input
                        type="text"
                        value={formData.organizer}
                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Short Description (Card summary)</label>
                    <textarea
                      rows={2}
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Full Description (Webpage)</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F]"
                    />
                  </div>
                </div>
              </div>

              {/* Section B: Media */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#C99A27] flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Section B — Event Images and Media</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Main Event Poster</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-24 h-32 rounded-2xl overflow-hidden bg-[#FFF9E8] border border-[#F0E8D4] shrink-0">
                        {formData.poster_url && (
                          <Image src={formData.poster_url} alt="Poster" fill className="object-cover" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'poster_url')}
                          className="text-xs text-[#77736A] file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#FFE99A] file:text-[#252525] hover:file:bg-[#E7B83F]"
                        />
                        <input
                          type="text"
                          placeholder="Or paste poster image URL"
                          value={formData.poster_url}
                          onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-xs text-[#252525]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Cover / Background Image</label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'cover_image_url')}
                        className="text-xs text-[#77736A] file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#FFF9E8] file:text-[#252525] border border-[#F0E8D4]"
                      />
                      <input
                        type="text"
                        placeholder="Cover image URL"
                        value={formData.cover_image_url}
                        onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-xs text-[#252525]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section C: Date & Venue */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#C99A27] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Section C — Date and Venue</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Start Time</label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">End Time</label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#252525] mb-1">Venue / Auditorium *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. APJ Abdul Kalam Auditorium, Hindusthan Valley Campus"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F]"
                  />
                </div>
              </div>

              {/* Section E: Registration ON/OFF Switch */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#FFF9E8] border-2 border-[#FFE99A] shadow-spatial space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#C99A27] flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Section E — Registration Configuration (Mandatory)</span>
                  </h3>
                  <span className="text-[10px] font-bold text-[#252525] bg-white px-2.5 py-1 rounded-full border border-[#F0E8D4]">
                    Core Business Rule
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, registration_enabled: true })}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      formData.registration_enabled
                        ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 shadow-sm'
                        : 'bg-white border-[#F0E8D4] text-[#77736A] hover:border-[#E7B83F]'
                    }`}
                  >
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                    <p className="font-black text-sm">REGISTRATION ON</p>
                    <p className="text-[11px] opacity-75 mt-0.5">Students can register online</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, registration_enabled: false })}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      !formData.registration_enabled
                        ? 'bg-rose-100/90 border-rose-400 text-rose-950 shadow-sm'
                        : 'bg-white border-[#F0E8D4] text-[#77736A] hover:border-[#E7B83F]'
                    }`}
                  >
                    <XCircle className="w-6 h-6 mx-auto mb-1 text-rose-600" />
                    <p className="font-black text-sm">REGISTRATION OFF</p>
                    <p className="text-[11px] opacity-75 mt-0.5">Registration locked/closed</p>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#FFE99A]">
                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">
                      Participant Capacity Limit (Max Seats)
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 250 (leave empty for unlimited)"
                      value={formData.maximum_participants ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maximum_participants: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-full bg-white border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#E7B83F]"
                    />
                    <p className="text-[11px] text-[#77736A] mt-1">
                      Registration automatically closes once this seat limit is reached.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">
                      Registration Deadline (Date & Time)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.registration_deadline ? formData.registration_deadline.slice(0, 16) : ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registration_deadline: e.target.value ? new Date(e.target.value).toISOString() : '',
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-full bg-white border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#E7B83F]"
                    />
                    <p className="text-[11px] text-[#77736A] mt-1">
                      Cut-off time after which new registrations are locked.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section F: Event Theme Studio */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#C99A27] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Section F — Bespoke Theme Studio</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {(Object.keys(THEME_PRESETS) as ThemePreset[]).filter(k => k !== 'custom').map((presetKey) => {
                    const p = THEME_PRESETS[presetKey];
                    const isSelected = themeData.theme_preset === presetKey;
                    return (
                      <button
                        key={presetKey}
                        type="button"
                        onClick={() => handlePresetSelect(presetKey)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#E7B83F] bg-[#FFF9E8] shadow-sm'
                            : 'border-[#F0E8D4] bg-[#FFFDF5] hover:border-[#E7B83F]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primary_color }} />
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.secondary_color }} />
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.accent_color }} />
                        </div>
                        <p className="text-xs font-black text-[#252525] capitalize">{presetKey.replace('-', ' ')}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#77736A] mb-1">Primary Color</label>
                    <div className="flex items-center gap-2 bg-[#FFFDF5] p-1.5 rounded-full border border-[#F0E8D4]">
                      <input
                        type="color"
                        value={themeData.primary_color || '#E7B83F'}
                        onChange={(e) => setThemeData({ ...themeData, primary_color: e.target.value })}
                        className="w-7 h-7 rounded-full cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono font-bold">{themeData.primary_color}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#77736A] mb-1">Heading Font</label>
                    <select
                      value={themeData.heading_font || 'Rajdhani'}
                      onChange={(e) => setThemeData({ ...themeData, heading_font: e.target.value })}
                      className="w-full px-3 py-2 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs font-bold"
                    >
                      <option value="Rajdhani">Rajdhani (Tech / Bold)</option>
                      <option value="Cinzel">Cinzel (Cultural / Royal)</option>
                      <option value="Orbitron">Orbitron (Cyber / Matrix)</option>
                      <option value="Inter">Inter (Clean / Executive)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section G: Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F0E8D4]">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-[#77736A]">Publication Status:</label>
                  <select
                    value={formData.publication_status}
                    onChange={(e) => setFormData({ ...formData, publication_status: e.target.value as any })}
                    className="px-4 py-2 rounded-full bg-white border border-[#F0E8D4] text-[#252525] text-xs font-bold shadow-sm"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('manage')}
                    className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold text-[#77736A] hover:text-[#252525] bg-[#FFF9E8]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full font-black text-sm text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-[0_4px_16px_rgba(231,184,63,0.3)] transition-all"
                  >
                    {editingEventId ? 'Save Changes' : 'Publish College Event'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* TAB 4: REGISTRATIONS ROSTER */}
        {activeTab === 'registrations' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#252525]">Event Participant Registrations</h2>
                <p className="text-xs text-[#77736A]">
                  Inspect student registrations across events, search participants, or export official sheets to CSV.
                </p>
              </div>

              <a
                href={`/api/admin/registrations?format=csv${regFilterEvent !== 'all' ? `&event_id=${regFilterEvent}` : ''}`}
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-sm transition-all"
              >
                <Download className="w-4 h-4 text-[#252525]" />
                <span>Export CSV Spreadsheet</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77736A]" />
                <input
                  type="text"
                  placeholder="Search student name, email, reg no..."
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#F0E8D4] text-[#252525] text-xs font-semibold shadow-sm"
                />
              </div>

              <div>
                <select
                  value={regFilterEvent}
                  onChange={(e) => setRegFilterEvent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-white border border-[#F0E8D4] text-[#252525] text-xs font-bold shadow-sm"
                >
                  <option value="all">All Events ({registrations.length} registrations)</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {dataLoading && registrations.length === 0 ? (
              <SkeletonTable columns={6} rows={6} showToolbar={false} />
            ) : (
            <div className="rounded-3xl border border-[#F0E8D4] bg-white overflow-hidden shadow-spatial">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF9E8] border-b border-[#F0E8D4] text-[#77736A] uppercase font-bold">
                    <tr>
                      <th className="py-4 px-4 sm:px-6">Student</th>
                      <th className="py-4 px-4">Register No</th>
                      <th className="py-4 px-4">Event</th>
                      <th className="py-4 px-4">Department & Year</th>
                      <th className="py-4 px-4">Contact</th>
                      <th className="py-4 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8D4]">
                    {registrations
                      .filter((r) => regFilterEvent === 'all' || r.event_id === regFilterEvent)
                      .filter((r) => !regSearch || r.full_name.toLowerCase().includes(regSearch.toLowerCase()) || r.email.toLowerCase().includes(regSearch.toLowerCase()) || r.register_number.toLowerCase().includes(regSearch.toLowerCase()))
                      .map((reg) => (
                        <tr key={reg.id} className="hover:bg-[#FFFDF5]">
                          <td className="py-4 px-4 sm:px-6">
                            <div className="font-bold text-[#252525]">{reg.full_name}</div>
                            <div className="text-[11px] text-[#77736A]">{reg.email}</div>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-[#C99A27]">
                            {reg.register_number}
                          </td>
                          <td className="py-4 px-4 text-[#252525] font-semibold max-w-[200px] truncate">
                            {reg.event_title}
                          </td>
                          <td className="py-4 px-4 text-[#77736A]">
                            <div>{reg.department}</div>
                            <div className="text-[11px]">{reg.year}</div>
                          </td>
                          <td className="py-4 px-4 text-[#252525] font-mono">
                            {reg.contact_number || 'N/A'}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                              {reg.registration_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
        )}

        {/* TAB 5: AIML EVENT ARCHIVES */}
        {activeTab === 'archives' && (
          <AdminArchiveManager />
        )}

        {/* TAB 6: DEVELOPER TRASH & RECOVERY CONSOLE */}
        {activeTab === 'trash' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[#252525]">Developer Trash & Event Recovery Console</h2>
                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                    Cold Storage
                  </span>
                </div>
                <p className="text-xs text-[#77736A] mt-1 max-w-2xl leading-relaxed">
                  Events moved to Trash by administrators are immediately removed from public listings and the homepage, but their database schemas, schedules, and student registration records remain 100% preserved. Only verified developers can restore or permanently delete these events.
                </p>
              </div>

              <div>
                {isDeveloper ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Developer Clearance: Authorized</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-sm">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Admin View (Recovery requires Developer role)</span>
                  </span>
                )}
              </div>
            </div>

            {trashedEvents.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FFF9E8] border border-[#F0E8D4] flex items-center justify-center mx-auto text-[#C99A27]">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#252525]">Trash is completely empty</h3>
                <p className="text-xs text-[#77736A] max-w-md mx-auto">
                  No events have been moved to Trash. All created events are currently active or published in the main management table.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-[#F0E8D4] bg-white overflow-hidden shadow-spatial">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FFF9E8] border-b border-[#F0E8D4] text-[#77736A] uppercase font-bold">
                      <tr>
                        <th className="py-4 px-4 sm:px-6">Trashed Event</th>
                        <th className="py-4 px-4">Deleted At</th>
                        <th className="py-4 px-4">Deleted By</th>
                        <th className="py-4 px-4 text-center">Preserved Registrations</th>
                        <th className="py-4 px-4 text-center">Lifecycle</th>
                        <th className="py-4 px-4 sm:px-6 text-right">Developer Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0E8D4]">
                      {trashedEvents.map((ev) => (
                        <tr key={ev.id} className="hover:bg-[#FFFDF5] transition-colors">
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-[#FFF9E8] border border-[#F0E8D4] shrink-0">
                                <Image
                                  src={ev.poster_url || '/college-logo.jpg'}
                                  alt={ev.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-[#252525] text-sm">{ev.title}</div>
                                <div className="font-mono text-[11px] text-[#C99A27]">/events/{ev.slug}</div>
                                <div className="text-[10px] text-[#77736A]">{ev.category_id || 'General Event'}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-[#77736A]">
                            <div className="font-medium text-[#252525]">
                              {ev.deleted_at ? new Date(ev.deleted_at).toLocaleDateString() : 'Recent'}
                            </div>
                            <div className="text-[10px] text-[#77736A]">
                              {ev.deleted_at ? new Date(ev.deleted_at).toLocaleTimeString() : ''}
                            </div>
                          </td>

                          <td className="py-4 px-4 text-[#77736A]">
                            <span className="font-mono text-xs text-[#252525]">
                              {ev.deleted_by || 'Admin Console'}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-800 border border-blue-200">
                              <Users className="w-3.5 h-3.5 text-blue-600" />
                              <span>{ev.registration_count || 0} Preserved</span>
                            </span>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-300">
                              Soft Deleted
                            </span>
                          </td>

                          <td className="py-4 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* 1-Click Developer Restore */}
                              <button
                                onClick={() => handleRestoreEvent(ev)}
                                disabled={actionLoadingSlug === ev.slug || !isDeveloper}
                                title={isDeveloper ? "Restore event to public website" : "Developer role required to restore"}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black shadow-sm transition-all ${
                                  isDeveloper
                                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                }`}
                              >
                                <RotateCcw className={`w-3.5 h-3.5 ${actionLoadingSlug === ev.slug ? 'animate-spin' : ''}`} />
                                <span>Restore Event</span>
                              </button>

                              {/* Developer Permanent Delete with Safety Dialog */}
                              <button
                                onClick={() => handlePermanentDelete(ev)}
                                disabled={actionLoadingSlug === ev.slug || !isDeveloper}
                                title={isDeveloper ? "Permanently erase from database" : "Developer role required"}
                                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                                  isDeveloper
                                    ? 'text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-200'
                                    : 'text-gray-300 cursor-not-allowed'
                                }`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Delete Permanently</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
