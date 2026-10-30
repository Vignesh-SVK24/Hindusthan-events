'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the administrator password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await login(password);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify your credentials.');
        return;
      }
      router.push('/admin');
    } catch {
      setError('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#FFE99A] selection:text-[#252525] relative overflow-hidden">
      
      {/* Subtle Spatial Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-[#FFE99A]/30 via-[#FFF0B3]/25 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Return to Public Hub Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#77736A] hover:text-[#C99A27] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Public Events Hub</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Floating Spatial Card Container */}
        <div className="bg-white border border-[#F0E8D4] rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(231,184,63,0.12),0_8px_20px_rgba(0,0,0,0.03)] space-y-6">
          
          {/* Official Emblem & Branding */}
          <div className="text-center space-y-3">
            <div className="relative w-16 h-20 mx-auto rounded-2xl overflow-hidden bg-white p-1 border border-[#F0E8D4] shadow-sm">
              <Image
                src="/college-logo.jpg"
                alt="Hindusthan Educational and Charitable Trust"
                fill
                priority
                className="object-contain p-0.5"
                sizes="64px"
              />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#252525] uppercase tracking-wider font-sans">
                COLLEGE EVENTS HUB
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-1.5 rounded-full bg-[#FFF9E8] border border-[#F0E8D4]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C99A27]" />
                <span className="text-[11px] font-bold text-[#C99A27] uppercase tracking-wider">
                  Admin Login
                </span>
              </div>
            </div>

            <p className="text-xs text-[#77736A] max-w-xs mx-auto leading-relaxed">
              Enter your secure administrator password to access the event management CMS console.
            </p>
          </div>

          {/* Validation Alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {/* Secure Admin Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="admin-password-input" 
                className="block text-xs font-bold text-[#252525] uppercase tracking-wider mb-2"
              >
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77736A]">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  autoComplete="current-password"
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-sm focus:outline-none focus:border-[#E7B83F] focus:ring-2 focus:ring-[#FFE99A]/50 transition-all placeholder:text-[#77736A]/60 font-sans"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#77736A] hover:text-[#252525] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-black text-sm text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-[0_4px_16px_rgba(231,184,63,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#252525]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Log In to Admin Console →</span>
              )}
            </button>
          </form>

          {/* Institutional Security Notice */}
          <div className="pt-2 text-center border-t border-[#F0E8D4]">
            <p className="text-[11px] text-[#77736A]">
              Protected administrative area • Hindusthan Educational Trust
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
