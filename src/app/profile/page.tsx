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
  ArrowRight,
  GraduationCap,
  Mail,
  ShieldCheck
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
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center text-[#252525]">
        <div className="w-8 h-8 border-4 border-[#E7B83F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex flex-col text-[#252525]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full bg-white border border-[#F0E8D4] rounded-3xl p-8 text-center space-y-6 shadow-spatial-lg">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF0B3] text-[#252525] mx-auto flex items-center justify-center">
              <User className="w-8 h-8 text-[#C99A27]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#252525]">Sign In to View Registrations</h2>
              <p className="text-xs text-[#77736A] mt-2">
                Log in to access your registered events, event entry passes, and student profile.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <button
                onClick={() => quickLogin('student')}
                className="w-full py-3.5 rounded-full font-black text-sm text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-[0_4px_16px_rgba(231,184,63,0.3)] transition-all"
              >
                ⚡ Instant 1-Click Student Demo Login
              </button>
              <Link
                href="/login"
                className="block w-full py-3 text-xs font-bold text-[#77736A] hover:text-[#252525] bg-[#FFF9E8] rounded-full border border-[#F0E8D4]"
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
    <div className="min-h-screen bg-[#FFFDF5] text-[#252525] flex flex-col selection:bg-[#FFE99A] selection:text-[#252525]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Profile Header Spatial Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FFE99A] text-[#252525] font-black text-2xl flex items-center justify-center shadow-md">
              {user.full_name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#252525]">{user.full_name}</h1>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFF0B3] text-[#252525] border border-[#F0E8D4]">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[#77736A] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C99A27]" />
                <span>{user.email}</span>
                <span className="text-[#F0E8D4]">•</span>
                <span className="font-mono font-bold text-[#C99A27]">Reg: {user.register_number}</span>
              </p>
              <p className="text-xs text-[#77736A] flex items-center gap-1.5 pt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#C99A27]" />
                <span>{user.department}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="px-5 py-2.5 text-xs font-bold text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] rounded-full shadow-sm flex items-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin CMS Console</span>
              </Link>
            )}
            <button
              onClick={() => logout()}
              className="px-5 py-2.5 text-xs font-bold text-[#77736A] hover:text-rose-600 bg-[#FFF9E8] hover:bg-rose-50 border border-[#F0E8D4] rounded-full transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Registered Events Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0E8D4] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#252525] flex items-center gap-2.5">
                <Ticket className="w-6 h-6 text-[#C99A27]" />
                <span>My Registered Events ({registrations.length})</span>
              </h2>
              <p className="text-xs text-[#77736A] mt-1">
                Your confirmed passes for upcoming campus festivals, hackathons, and symposiums.
              </p>
            </div>
          </div>

          {loadingRegs ? (
            <div className="py-16 text-center text-[#77736A] text-sm">
              Loading your registered events...
            </div>
          ) : registrations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {registrations.map((reg) => (
                <div 
                  key={reg.id} 
                  className="rounded-3xl border border-[#F0E8D4] bg-white p-6 shadow-spatial flex flex-col justify-between space-y-5 hover:border-[#E7B83F] transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="relative w-full sm:w-28 h-32 rounded-2xl overflow-hidden bg-[#FFF9E8] shrink-0 border border-[#F0E8D4]">
                      <Image
                        src={reg.event.poster_url || '/college-logo.jpg'}
                        alt={reg.event.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {reg.registration_status}
                      </span>
                      <h3 className="text-base font-bold text-[#252525] line-clamp-1">{reg.event.title}</h3>
                      <p className="text-xs text-[#C99A27] font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {reg.event.start_date} ({reg.event.start_time})
                      </p>
                      <p className="text-xs text-[#77736A] flex items-center gap-1 truncate max-w-xs">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {reg.event.venue}
                      </p>
                    </div>
                  </div>

                  {/* Digital Pass Ticket Strip */}
                  <div className="pt-4 border-t border-dashed border-[#F0E8D4] flex items-center justify-between gap-4 bg-[#FFFDF5] p-4 rounded-2xl border border-[#F0E8D4]">
                    <div className="space-y-1 text-xs">
                      <p className="font-mono text-[#77736A]">
                        Pass Code: <strong className="text-[#252525]">#{reg.id.slice(-8).toUpperCase()}</strong>
                      </p>
                      <p className="text-[11px] text-[#77736A]">
                        Registered on {new Date(reg.created_at).toLocaleDateString()}
                      </p>
                      <Link
                        href={`/events/${reg.event.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#C99A27] hover:underline pt-1"
                      >
                        <span>View Event Page</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {qrCodes[reg.id] && (
                      <div className="bg-white p-1.5 rounded-xl shadow-sm border border-[#F0E8D4] shrink-0">
                        <Image src={qrCodes[reg.id]} alt="Ticket QR" width={80} height={80} className="rounded" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#F0E8D4] bg-white p-12 text-center space-y-3 shadow-spatial-sm">
              <Ticket className="w-12 h-12 text-[#E7B83F] mx-auto" />
              <h3 className="text-base font-bold text-[#252525]">No registrations yet</h3>
              <p className="text-xs text-[#77736A] max-w-sm mx-auto">
                You haven&apos;t registered for any events yet. Explore upcoming hackathons, symposiums, and cultural fests!
              </p>
              <Link
                href="/#events-discovery"
                className="inline-block mt-2 px-6 py-2.5 rounded-full text-xs font-black text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-sm"
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
