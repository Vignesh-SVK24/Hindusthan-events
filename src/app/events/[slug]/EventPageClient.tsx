'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    async function checkReg() {
      if (!user) return;
      try {
        const res = await fetch(`/api/events/${event.slug}/register`);
        const data = await res.json();
        if (data.registered && data.registration) {
          setIsRegistered(true);
          setRegistrationData(data.registration);
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
      setRegError('Please log in with a student account to register.');
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

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      const qrData = `EVENT:${event.slug}|TICKET:${data.registration.id}|REG:${data.registration.register_number}`;
      const qr = await QRCode.toDataURL(qrData, { margin: 1, width: 220 });
      setQrCodeUrl(qr);

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

  // Event Bespoke Accent Colors integrated with Spatial UI Foundation
  const primaryColor = theme?.primary_color || '#E7B83F';
  const secondaryColor = theme?.secondary_color || '#FFE99A';
  const accentColor = theme?.accent_color || '#C99A27';

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#252525] flex flex-col selection:bg-[#FFE99A] selection:text-[#252525] transition-colors duration-300">
      
      {/* Event Bespoke Spatial Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        {/* Soft radial color glow matching event primary color */}
        <div 
          className="absolute top-0 right-0 w-[600px] h-[500px] blur-[100px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${primaryColor}25 0%, transparent 70%)` }}
        />
        <div 
          className="absolute bottom-10 left-0 w-[500px] h-[400px] blur-[90px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${secondaryColor}30 0%, transparent 70%)` }}
        />
      </div>

      {/* Floating Spatial Header & Breadcrumb Bar */}
      <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-2">
        <div className="max-w-7xl mx-auto rounded-full bg-white/90 backdrop-blur-xl border border-[#F0E8D4] shadow-spatial-sm px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#252525] hover:text-[#C99A27] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>

          {/* Theme Preset Badge */}
          <div className="flex items-center gap-2.5">
            <span 
              className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider rounded-full border border-[#F0E8D4] bg-[#FFF9E8] text-[#252525] hidden sm:inline-block font-semibold"
            >
              Theme: {theme?.theme_preset || 'Custom'}
            </span>

            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#F0E8D4] bg-white hover:bg-[#FFF9E8] text-[#252525] shadow-sm transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#C99A27]" />}
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Spatial Container */}
      <section className="relative z-10 pt-8 sm:pt-12 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Event Title, Facts & Registration Panel */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Category Chip & Registration Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span 
                className="px-3.5 py-1 text-xs font-black uppercase tracking-wider rounded-full border shadow-sm"
                style={{ backgroundColor: `${primaryColor}18`, borderColor: `${primaryColor}60`, color: '#1f2937' }}
              >
                {event.category?.category_name || 'College Event'}
              </span>

              {event.registration_enabled ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 rounded-full shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Registration Open
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold text-rose-800 bg-rose-100/90 border border-rose-300 rounded-full shadow-sm">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Registration Closed
                </span>
              )}
            </div>

            {/* Event Title */}
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] text-[#252525]"
              style={{ fontFamily: theme?.heading_font || 'inherit' }}
            >
              {event.title}
            </h1>

            {/* Tagline */}
            {event.tagline && (
              <p 
                className="text-base sm:text-lg font-bold italic"
                style={{ color: accentColor }}
              >
                &ldquo;{event.tagline}&rdquo;
              </p>
            )}

            {/* Event Key Facts Spatial Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-3xl border border-[#F0E8D4] bg-white shadow-spatial">
              <div className="flex items-start gap-3.5">
                <div 
                  className="p-3 rounded-2xl shrink-0" 
                  style={{ backgroundColor: `${primaryColor}20`, color: '#252525' }}
                >
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-wider text-[#77736A]">Date & Time</p>
                  <p className="text-sm font-bold text-[#252525] mt-0.5">{event.start_date} {event.end_date !== event.start_date && `to ${event.end_date}`}</p>
                  <p className="text-xs text-[#77736A]">{event.start_time} — {event.end_time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div 
                  className="p-3 rounded-2xl shrink-0" 
                  style={{ backgroundColor: `${primaryColor}20`, color: '#252525' }}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-wider text-[#77736A]">Venue & Campus</p>
                  <p className="text-sm font-bold text-[#252525] mt-0.5">{event.venue}</p>
                  <p className="text-xs text-[#77736A] truncate max-w-[180px]">{event.department}</p>
                </div>
              </div>
            </div>

            {/* Countdown Timer Floating Card */}
            <div className="p-5 sm:p-6 rounded-3xl border border-[#F0E8D4] bg-white shadow-spatial">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#C99A27]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#77736A]">Event Countdown</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FFF9E8] border border-[#F0E8D4]">
                  <span className="text-2xl sm:text-3xl font-black block text-[#252525]">
                    {timeLeft.days}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#77736A]">Days</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FFF9E8] border border-[#F0E8D4]">
                  <span className="text-2xl sm:text-3xl font-black block text-[#252525]">
                    {timeLeft.hours}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#77736A]">Hours</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FFF9E8] border border-[#F0E8D4]">
                  <span className="text-2xl sm:text-3xl font-black block text-[#252525]">
                    {timeLeft.minutes}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#77736A]">Mins</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FFF0B3] border border-[#FFE99A]">
                  <span className="text-2xl sm:text-3xl font-black block text-[#252525]">
                    {timeLeft.seconds}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#77736A]">Secs</span>
                </div>
              </div>
            </div>

            {/* PRIMARY REGISTRATION ACTION BAR */}
            <div className="pt-2">
              {event.registration_enabled ? (
                isRegistered ? (
                  /* Confirmed Digital Ticket Pass */
                  <div className="p-6 rounded-3xl bg-[#FFF9E8] border-2 border-emerald-400 shadow-spatial space-y-4">
                    <div className="flex items-center gap-2.5 text-emerald-800 font-black text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>You are successfully registered for this event!</span>
                    </div>
                    <p className="text-xs text-[#77736A] leading-relaxed">
                      Your digital pass is confirmed. Present the verification QR code at the check-in reception desk on arrival.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1 bg-white p-4 rounded-2xl border border-[#F0E8D4]">
                      {qrCodeUrl && (
                        <div className="bg-white p-2 rounded-xl shadow-sm border border-[#F0E8D4] shrink-0">
                          <Image src={qrCodeUrl} alt="QR Pass" width={90} height={90} className="rounded" />
                        </div>
                      )}
                      <div className="space-y-1 text-xs text-center sm:text-left">
                        <p className="font-mono font-bold text-[#252525]">Ticket Ref: #{registrationData?.id.slice(-8).toUpperCase()}</p>
                        <p className="text-[#77736A]">Reg No: {registrationData?.register_number}</p>
                        <p className="text-[#77736A]">Student: {registrationData?.full_name}</p>
                        <Link 
                          href="/profile" 
                          className="inline-flex items-center gap-1 text-[#C99A27] hover:underline font-bold pt-1"
                        >
                          View Full Pass in Profile →
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Registration is Open */
                  <div className="space-y-3">
                    {event.registration_type === 'external' && event.registration_url ? (
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-black text-base text-[#252525] shadow-spatial-lg hover:shadow-spatial-float transition-all transform hover:-translate-y-0.5"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <span>Register Now (External Portal)</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        onClick={() => setShowRegModal(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-black text-base text-[#252525] shadow-spatial-lg hover:shadow-spatial-float transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Ticket className="w-5 h-5 text-[#252525]" />
                        <span>Register for Event</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}

                    {event.registration_deadline && (
                      <p className="text-xs text-[#77736A] font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#C99A27]" />
                        Registration Deadline: {new Date(event.registration_deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )
              ) : (
                /* REGISTRATION OFF: Distinct Spatial Notice */
                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial space-y-2">
                  <div className="flex items-center gap-2.5 text-rose-700 font-bold text-sm">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    <span>Registration is currently closed or unavailable</span>
                  </div>
                  <p className="text-xs text-[#77736A] leading-relaxed">
                    The event administration has turned off registrations for this event, or seat capacity has been reached. You may still view the schedule and event agenda below.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Event Poster Floating Spatial Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-[#F0E8D4] p-3 shadow-spatial-lg">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#FFF9E8]">
                <Image
                  src={event.poster_url || '/college-logo.jpg'}
                  alt={event.title}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 450px"
                />
              </div>

              <div className="p-4 flex items-center justify-between text-xs text-[#77736A]">
                <span>Organized by <strong className="text-[#252525]">{event.organizer}</strong></span>
                <span className="font-mono font-semibold text-[#C99A27]">{event.department}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Sections in Spatial Floating Panels */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 sm:space-y-16 w-full">
        
        {/* Section: About Overview */}
        {event.description && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#C99A27]">
              <Sparkles className="w-4 h-4" />
              <span>Overview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">About The Event</h2>
            <div className="p-6 sm:p-8 rounded-3xl border border-[#F0E8D4] bg-white shadow-spatial leading-relaxed text-sm sm:text-base text-[#252525] whitespace-pre-line">
              {event.description}
            </div>
          </section>
        )}

        {/* Section: Highlights */}
        {event.highlights && event.highlights.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#C99A27]">
              <Trophy className="w-4 h-4" />
              <span>Why Participate</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">Key Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.highlights.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl border border-[#F0E8D4] bg-white shadow-spatial-sm flex items-start gap-3.5 hover:border-[#E7B83F] transition-all"
                >
                  <div 
                    className="p-2 rounded-xl shrink-0" 
                    style={{ backgroundColor: `${primaryColor}20`, color: '#252525' }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold text-[#252525] leading-snug">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Schedule */}
        {event.schedule && event.schedule.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#C99A27]">
              <Clock className="w-4 h-4" />
              <span>Agenda</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">Event Schedule & Timeline</h2>
            <div className="space-y-3">
              {event.schedule.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl border border-[#F0E8D4] bg-white shadow-spatial-sm flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[#E7B83F] transition-all"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span 
                      className="px-3 py-1.5 rounded-full text-xs font-black font-mono tracking-wider shrink-0"
                      style={{ backgroundColor: `${primaryColor}25`, color: '#252525' }}
                    >
                      {item.time}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-[#252525]">{item.title}</h4>
                      <p className="text-xs text-[#77736A] mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  {item.speaker_or_venue && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFF9E8] border border-[#F0E8D4] text-[#77736A] self-start md:self-auto">
                      {item.speaker_or_venue}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Prizes */}
        {event.prizes && event.prizes.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#C99A27]">
              <Trophy className="w-4 h-4" />
              <span>Rewards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">Prizes & Recognitions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {event.prizes.map((p, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-3xl border border-[#F0E8D4] bg-white shadow-spatial text-center space-y-2 hover:border-[#E7B83F] transition-all"
                >
                  <div 
                    className="w-10 h-10 mx-auto rounded-full flex items-center justify-center font-black text-sm shadow-sm mb-2"
                    style={{ backgroundColor: `${primaryColor}30`, color: '#252525' }}
                  >
                    #{idx + 1}
                  </div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#77736A]">{p.rank}</h4>
                  <p className="text-sm font-black text-[#252525]">{p.title}</p>
                  <p className="text-base font-black text-[#C99A27]">{p.reward}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Rules & Eligibility */}
        {(event.rules?.length || event.eligibility) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.rules && event.rules.length > 0 && (
              <div className="p-6 sm:p-7 rounded-3xl border border-[#F0E8D4] bg-white shadow-spatial space-y-3">
                <h3 className="text-lg font-black text-[#252525] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C99A27]" />
                  <span>Rules & Guidelines</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#77736A] list-disc list-inside">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="leading-relaxed">{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {event.eligibility && (
              <div className="p-6 sm:p-7 rounded-3xl border border-[#F0E8D4] bg-white shadow-spatial space-y-3">
                <h3 className="text-lg font-black text-[#252525] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#C99A27]" />
                  <span>Eligibility & Participation</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#77736A] leading-relaxed">
                  {event.eligibility}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Section: Coordinators */}
        {event.coordinators && event.coordinators.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">Event Coordinators & Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.coordinators.map((c, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-[#F0E8D4] bg-white shadow-spatial-sm space-y-1">
                  <p className="font-bold text-sm text-[#252525]">{c.name}</p>
                  <p className="text-xs text-[#77736A]">{c.role}</p>
                  <div className="pt-2 flex flex-col gap-1 text-xs text-[#252525]">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C99A27]" />
                      {c.phone}
                    </span>
                    {c.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#C99A27]" />
                        {c.email}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Built-in Registration Modal in Spatial Surface */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial-float p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#F0E8D4] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#252525]">Event Registration</h3>
                <p className="text-xs text-[#77736A] truncate max-w-xs">{event.title}</p>
              </div>
              <button
                onClick={() => setShowRegModal(false)}
                className="p-1.5 rounded-full text-[#77736A] hover:text-[#252525] hover:bg-[#FFF9E8]"
              >
                ✕
              </button>
            </div>

            {regError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {regError}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#252525] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F] shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#252525] mb-1">College Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#252525] mb-1">Register Number</label>
                  <input
                    type="text"
                    required
                    value={formData.register_number}
                    onChange={(e) => setFormData({ ...formData, register_number: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F] shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#252525] mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. CSE, ECE, Mech"
                    className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#252525] mb-1">Year of Study</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#E7B83F] shadow-sm"
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
                <label className="block text-xs font-bold text-[#252525] mb-1">WhatsApp / Contact Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F] shadow-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingReg}
                  className="w-full py-3.5 rounded-full font-black text-sm text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] transition-all shadow-[0_4px_16px_rgba(231,184,63,0.3)] disabled:opacity-50"
                >
                  {submittingReg ? 'Confirming Registration...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-[#F0E8D4] bg-white py-8 px-4 text-center text-xs text-[#77736A]">
        <p>Hindusthan Educational and Charitable Trust • Event Publishing Engine</p>
      </footer>
    </div>
  );
}
