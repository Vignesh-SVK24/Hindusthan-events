'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Share2, 
  Users, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ExternalLink,
  Phone,
  Mail,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  Ticket,
  ChevronRight
} from 'lucide-react';
import { EventItem, EventCategory, EventTheme, EventMedia, EventRegistration } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

interface EventPageClientProps {
  initialEvent: EventItem & {
    category?: EventCategory;
    theme?: EventTheme;
    media: EventMedia[];
    registration_count: number;
  };
}

export default function EventPageClient({ initialEvent }: EventPageClientProps) {
  const { user } = useAuth();
  const [event, setEvent] = useState(initialEvent);
  const theme = event.theme;

  // Registration State
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationData, setRegistrationData] = useState<EventRegistration | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showRegModal, setShowRegModal] = useState(false);
  const [submittingReg, setSubmittingReg] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Registration Form State
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    register_number: user?.register_number || '',
    department: user?.department || '',
    year: '3rd Year',
    contact_number: '',
  });

  // Keep form updated when user logs in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user.full_name || prev.full_name,
        email: user.email || prev.email,
        register_number: user.register_number || prev.register_number,
        department: user.department || prev.department,
      }));
    }
  }, [user]);

  // Check initial registration status for logged in user
  useEffect(() => {
    async function checkReg() {
      if (!user) return;
      try {
        const res = await fetch(`/api/events/${event.slug}/register`);
        const data = await res.json();
        if (data.registered && data.registration) {
          setIsRegistered(true);
          setRegistrationData(data.registration);
          // Generate QR code
          const qrData = `EVENT:${event.slug}|TICKET:${data.registration.id}|REG:${data.registration.register_number}`;
          const qr = await QRCode.toDataURL(qrData, { margin: 1, width: 200 });
          setQrCodeUrl(qr);
        }
      } catch (err) {
        console.error('Error verifying registration status:', err);
      }
    }
    checkReg();
  }, [user, event.slug]);

  // Live Countdown calculation
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDateTime = new Date(`${event.start_date}T${event.start_time || '09:00'}:00`).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDateTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event.start_date, event.start_time]);

  // Handle Registration Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setRegError('Please log in with a student or user account to register.');
      return;
    }

    if (!event.registration_enabled) {
      setRegError('Registration is closed for this event.');
      return;
    }

    setSubmittingReg(true);
    setRegError(null);

    try {
      const res = await fetch(`/api/events/${event.slug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setIsRegistered(true);
      setRegistrationData(data.registration);
      setShowRegModal(false);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Generate ticket QR code
      const qrData = `EVENT:${event.slug}|TICKET:${data.registration.id}|REG:${data.registration.register_number}`;
      const qr = await QRCode.toDataURL(qrData, { margin: 1, width: 220 });
      setQrCodeUrl(qr);

      // Increment count locally
      setEvent((prev) => ({ ...prev, registration_count: (prev.registration_count || 0) + 1 }));
    } catch (err: any) {
      setRegError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmittingReg(false);
    }
  };

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Dynamic Theme Colors
  const primaryColor = theme?.primary_color || '#3b82f6';
  const secondaryColor = theme?.secondary_color || '#1d4ed8';
  const accentColor = theme?.accent_color || '#38bdf8';
  const backgroundColor = theme?.background_color || '#070b19';
  const textColor = theme?.text_color || '#f8fafc';

  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 transition-colors duration-300"
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      {/* Background Graphic Styles: circuits, grid, waves, mesh, minimal */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        {theme?.background_style === 'circuits' && (
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px), linear-gradient(to right, ${secondaryColor}15 1px, transparent 1px)`,
              backgroundSize: '40px 40px, 80px 80px',
            }}
          />
        )}
        {theme?.background_style === 'grid' && (
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(${primaryColor}22 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}22 1px, transparent 1px)`,
              backgroundSize: '36px 36px',
            }}
          />
        )}
        {theme?.background_style === 'waves' && (
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-600/20 via-violet-900/10 to-transparent" />
        )}
        {theme?.background_style === 'mesh' && (
          <div className="w-full h-full bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500/20 via-red-900/15 to-transparent" />
        )}
        {theme?.background_style === 'minimal' && (
          <div 
            className="w-full h-full opacity-10"
            style={{
              backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
        )}
      </div>

      {/* Top Event Header & Breadcrumb Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: primaryColor }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>

          {/* Theme Preset Badge */}
          <div className="flex items-center gap-2">
            <span 
              className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-md border border-white/15 bg-white/5 backdrop-blur-md hidden sm:inline-block"
            >
              Theme: {theme?.theme_preset || 'Custom'}
            </span>

            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20 bg-white/10 hover:bg-white/20 transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Event Title, Details & Register CTA */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Category Chip & Registration Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span 
                className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-md"
                style={{ backgroundColor: `${primaryColor}25`, color: primaryColor, border: `1px solid ${primaryColor}50` }}
              >
                {event.category?.category_name || 'College Event'}
              </span>

              {event.registration_enabled ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/50 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Registration Open
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-300 bg-rose-950/70 border border-rose-500/50 rounded-full">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  Registration Closed
                </span>
              )}
            </div>

            {/* Event Title */}
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight"
              style={{ fontFamily: theme?.heading_font || 'inherit' }}
            >
              {event.title}
            </h1>

            {/* Tagline */}
            {event.tagline && (
              <p 
                className="text-base sm:text-lg font-medium italic opacity-90"
                style={{ color: accentColor }}
              >
                &ldquo;{event.tagline}&rdquo;
              </p>
            )}

            {/* Event Key Facts Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 shrink-0" style={{ color: primaryColor }}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold tracking-wider opacity-60">Date</p>
                  <p className="text-sm font-semibold">{event.start_date} {event.end_date !== event.start_date && `to ${event.end_date}`}</p>
                  <p className="text-xs opacity-75">{event.start_time} — {event.end_time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 shrink-0" style={{ color: primaryColor }}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold tracking-wider opacity-60">Venue</p>
                  <p className="text-sm font-semibold">{event.venue}</p>
                  <p className="text-xs opacity-75">{event.department}</p>
                </div>
              </div>
            </div>

            {/* Countdown Timer Block */}
            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4" style={{ color: primaryColor }} />
                <span className="text-xs font-bold uppercase tracking-wider opacity-75">Event Countdown</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black block" style={{ color: primaryColor }}>
                    {timeLeft.days}
                  </span>
                  <span className="text-[10px] uppercase font-semibold opacity-60">Days</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black block" style={{ color: primaryColor }}>
                    {timeLeft.hours}
                  </span>
                  <span className="text-[10px] uppercase font-semibold opacity-60">Hours</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black block" style={{ color: primaryColor }}>
                    {timeLeft.minutes}
                  </span>
                  <span className="text-[10px] uppercase font-semibold opacity-60">Minutes</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black block" style={{ color: accentColor }}>
                    {timeLeft.seconds}
                  </span>
                  <span className="text-[10px] uppercase font-semibold opacity-60">Seconds</span>
                </div>
              </div>
            </div>

            {/* PRIMARY REGISTRATION ACTION BAR */}
            <div className="pt-2">
              {event.registration_enabled ? (
                isRegistered ? (
                  /* User is already registered -> Display Ticket Pass Badge */
                  <div className="p-5 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 shadow-xl space-y-3">
                    <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>You are successfully registered for this event!</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Your digital event pass is active. Show the verification QR code at the registration desk on arrival.
                    </p>
                    <div className="flex items-center gap-4 pt-1">
                      {qrCodeUrl && (
                        <div className="bg-white p-2 rounded-xl shadow-md shrink-0">
                          <Image src={qrCodeUrl} alt="QR Pass" width={90} height={90} className="rounded" />
                        </div>
                      )}
                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-white">Ticket Ref: #{registrationData?.id.slice(-8).toUpperCase()}</p>
                        <p className="text-slate-300">Reg No: {registrationData?.register_number}</p>
                        <p className="text-slate-400">Student: {registrationData?.full_name}</p>
                        <Link 
                          href="/profile" 
                          className="inline-flex items-center gap-1 text-amber-400 hover:underline font-semibold pt-1"
                        >
                          View Full Pass in Profile →
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Registration is ON and user not registered yet */
                  <div className="space-y-3">
                    {event.registration_type === 'external' && event.registration_url ? (
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-slate-950 shadow-xl transition-all transform hover:-translate-y-0.5"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <span>Register Now (External Portal)</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        onClick={() => setShowRegModal(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-black text-base text-slate-950 shadow-2xl transition-all transform hover:-translate-y-0.5"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Ticket className="w-5 h-5" />
                        <span>Register for Event</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}

                    {event.registration_deadline && (
                      <p className="text-xs opacity-70 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        Registration Deadline: {new Date(event.registration_deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )
              ) : (
                /* REGISTRATION OFF: Distinct Unavailable Notice */
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span>Registration is currently closed or unavailable</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The event administration has turned off registrations for this event, or seat capacity has been reached. You may still view the schedule and event information below.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Event Poster Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-white/20 p-2 bg-black/40 shadow-2xl">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-950">
                <Image
                  src={event.poster_url || '/college-logo.jpg'}
                  alt={event.title}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 450px"
                />
              </div>

              {/* Organizer signature */}
              <div className="p-4 flex items-center justify-between text-xs opacity-75">
                <span>Organized by {event.organizer}</span>
                <span className="font-mono">{event.department}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Sections */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 w-full">
        
        {/* Section: About the Event */}
        {event.description && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
              <Sparkles className="w-4 h-4" />
              <span>Overview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">About The Event</h2>
            <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md leading-relaxed text-sm sm:text-base opacity-90 whitespace-pre-line">
              {event.description}
            </div>
          </section>
        )}

        {/* Section: Highlights */}
        {event.highlights && event.highlights.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
              <Trophy className="w-4 h-4" />
              <span>Why Participate</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Key Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.highlights.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-start gap-3.5 hover:border-white/30 transition-all"
                >
                  <div className="p-2 rounded-lg bg-white/10 shrink-0" style={{ color: accentColor }}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Schedule */}
        {event.schedule && event.schedule.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
              <Clock className="w-4 h-4" />
              <span>Agenda</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Event Schedule & Timeline</h2>
            <div className="space-y-4">
              {event.schedule.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider shrink-0"
                      style={{ backgroundColor: `${primaryColor}25`, color: primaryColor }}
                    >
                      {item.time}
                    </span>
                    <div>
                      <h4 className="text-base font-bold">{item.title}</h4>
                      <p className="text-xs opacity-75 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  {item.speaker_or_venue && (
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-white/10 self-start md:self-auto">
                      {item.speaker_or_venue}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Prizes & Awards */}
        {event.prizes && event.prizes.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
              <Trophy className="w-4 h-4" />
              <span>Rewards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Prizes & Recognitions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {event.prizes.map((p, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-center space-y-2 relative overflow-hidden"
                >
                  <div 
                    className="w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold text-sm shadow-lg mb-3"
                    style={{ backgroundColor: primaryColor, color: '#000' }}
                  >
                    #{idx + 1}
                  </div>
                  <h4 className="text-xs uppercase font-bold tracking-wider opacity-75">{p.rank}</h4>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="text-base font-extrabold" style={{ color: accentColor }}>{p.reward}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Rules & Eligibility */}
        {(event.rules?.length || event.eligibility) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {event.rules && event.rules.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md space-y-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" style={{ color: primaryColor }} />
                  <span>Rules & Guidelines</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm opacity-80 list-disc list-inside">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="leading-relaxed">{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {event.eligibility && (
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md space-y-3">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: primaryColor }} />
                  <span>Eligibility & Participation</span>
                </h3>
                <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                  {event.eligibility}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Section: Coordinators & Contacts */}
        {event.coordinators && event.coordinators.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Event Coordinators & Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.coordinators.map((c, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md space-y-1">
                  <p className="font-bold text-sm">{c.name}</p>
                  <p className="text-xs opacity-60">{c.role}</p>
                  <div className="pt-2 flex flex-col gap-1 text-xs opacity-90">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                      {c.phone}
                    </span>
                    {c.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                        {c.email}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Sponsors */}
        {event.sponsors && event.sponsors.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-center opacity-60">
              Partners & Sponsors
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {event.sponsors.map((sp, idx) => (
                <div key={idx} className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold">
                  {sp.name} {sp.tier && <span className="opacity-50">({sp.tier})</span>}
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Built-in Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl bg-[#0e1628] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Event Registration</h3>
                <p className="text-xs text-slate-400 truncate max-w-xs">{event.title}</p>
              </div>
              <button
                onClick={() => setShowRegModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {regError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-xs text-red-200">
                {regError}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">College Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Register Number</label>
                  <input
                    type="text"
                    required
                    value={formData.register_number}
                    onChange={(e) => setFormData({ ...formData, register_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. CSE, ECE, Mech"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Year of Study</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp / Contact Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingReg}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20 disabled:opacity-50"
                >
                  {submittingReg ? 'Confirming Registration...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 py-8 px-4 text-center text-xs opacity-60">
        <p>Hindusthan Educational and Charitable Trust • Event Publishing Engine</p>
      </footer>
    </div>
  );
}
