'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Calendar, 
  MapPin, 
  Ticket, 
  ArrowLeft, 
  CheckCircle2, 
  ArrowRight,
  Download,
  GraduationCap,
  Mail,
  ShieldCheck,
  Building
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const { user, isLoading, logout, quickLogin } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadRegs() {
      if (!user) return;
      try {
        setLoadingRegs(true);
        const res = await fetch('/api/user/registrations');
        if (res.ok) {
          const data = await res.json();
          const items = data.registrations || [];
          setRegistrations(items);

          // Generate QR codes for each registration
          const qrs: Record<string, string> = {};
          for (const item of items) {
            const qrStr = `HINDUSTHAN-EVENT|PASS:${item.id}|USER:${item.register_number}|EVENT:${item.event.slug}`;
            qrs[item.id] = await QRCode.toDataURL(qrStr, { margin: 1, width: 140 });
          }
          setQrCodes(qrs);
        }
      } catch (err) {
        console.error('Error fetching registrations:', err);
      } finally {
        setLoadingRegs(false);
      }
    }

    loadRegs();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b19] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070b19] flex flex-col text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full bg-[#0c1222] border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Sign In to View Registrations</h2>
              <p className="text-xs text-slate-400 mt-2">
                Log in to access your registered events, event entry passes, and student profile.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <button
                onClick={() => quickLogin('student')}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
              >
                ⚡ Instant 1-Click Student Demo Login
              </button>
              <Link
                href="/login"
                className="block w-full py-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                Go to Standard Login Page
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b19] text-white flex flex-col selection:bg-amber-400 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0c1222] to-[#111a33] border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-400/20">
              {user.full_name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user.full_name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{user.email}</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-amber-400">Reg: {user.register_number}</span>
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>{user.department}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin CMS Console</span>
              </Link>
            )}
            <button
              onClick={() => logout()}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-800/80 rounded-xl transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Registered Events Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                <Ticket className="w-6 h-6 text-emerald-400" />
                <span>My Registered Events ({registrations.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your confirmed passes for upcoming campus festivals, hackathons, and symposiums.
              </p>
            </div>
          </div>

          {loadingRegs ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              Loading your registered events...
            </div>
          ) : registrations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {registrations.map((reg) => (
                <div 
                  key={reg.id} 
                  className="rounded-3xl border border-slate-800 bg-[#0c1222] p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-amber-400/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Poster thumbnail */}
                    <div className="relative w-full sm:w-28 h-32 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                      <Image
                        src={reg.event.poster_url || '/college-logo.jpg'}
                        alt={reg.event.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        {reg.registration_status}
                      </span>
                      <h3 className="text-base font-bold text-white line-clamp-1">{reg.event.title}</h3>
                      <p className="text-xs text-amber-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {reg.event.start_date} ({reg.event.start_time})
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-xs">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {reg.event.venue}
                      </p>
                    </div>
                  </div>

                  {/* Digital Pass Ticket Strip */}
                  <div className="pt-4 border-t border-dashed border-slate-800 flex items-center justify-between gap-4 bg-slate-950/40 p-4 rounded-2xl">
                    <div className="space-y-1 text-xs">
                      <p className="font-mono text-slate-400">
                        Pass Code: <strong className="text-white">#{reg.id.slice(-8).toUpperCase()}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Registered on {new Date(reg.created_at).toLocaleDateString()}
                      </p>
                      <Link
                        href={`/events/${reg.event.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:underline pt-1"
                      >
                        <span>View Event Page</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {qrCodes[reg.id] && (
                      <div className="bg-white p-1.5 rounded-xl shadow-md shrink-0">
                        <Image src={qrCodes[reg.id]} alt="Ticket QR" width={80} height={80} className="rounded" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-[#0c1222]/50 p-12 text-center space-y-3">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No registrations yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You haven&apos;t registered for any events yet. Explore upcoming hackathons, symposiums, and cultural fests!
              </p>
              <Link
                href="/#events-discovery"
                className="inline-block mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300"
              >
                Browse All Events
              </Link>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
