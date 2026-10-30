'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, User, ArrowLeft, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, quickLogin } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [registerNumber, setRegisterNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Invalid credentials');
          return;
        }
        router.push('/');
      } else {
        const res = await signup({
          full_name: fullName,
          email,
          password,
          department,
          register_number: registerNumber,
        });
        if (!res.success) {
          setError(res.error || 'Registration failed');
          return;
        }
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (role: 'admin' | 'student') => {
    setLoading(true);
    await quickLogin(role);
    setLoading(false);
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#FFE99A] selection:text-[#252525]">
      
      {/* Return home link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#77736A] hover:text-[#C99A27] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to College Events Hub</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* College Logo & Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="relative w-16 h-20 mx-auto rounded-2xl overflow-hidden bg-white p-1 border-2 border-[#FFE99A] shadow-md">
            <Image
              src="/college-logo.jpg"
              alt="Hindusthan Educational and Charitable Trust"
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] uppercase tracking-wider font-sans">
            Hindusthan Events Hub
          </h2>
          <p className="text-xs text-[#77736A]">
            Sign in to access event registrations or manage college event publishing
          </p>
        </div>

        {/* 1-Click Fast Switch Demo Cards in Spatial UI */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleQuick('admin')}
            className="p-3.5 rounded-2xl bg-white border border-[#F0E8D4] hover:border-[#E7B83F] shadow-spatial-sm transition-all text-left group"
          >
            <div className="flex items-center gap-1.5 text-[#C99A27] mb-1 font-black text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>1-Click Admin</span>
            </div>
            <p className="text-[10px] text-[#77736A]">admin@hindusthan.net</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuick('student')}
            className="p-3.5 rounded-2xl bg-white border border-[#F0E8D4] hover:border-[#E7B83F] shadow-spatial-sm transition-all text-left group"
          >
            <div className="flex items-center gap-1.5 text-[#C99A27] mb-1 font-black text-xs">
              <User className="w-4 h-4" />
              <span>1-Click Student</span>
            </div>
            <p className="text-[10px] text-[#77736A]">student@hindusthan.net</p>
          </button>
        </div>

        {/* Main Spatial Auth Form Card */}
        <div className="bg-white border border-[#F0E8D4] rounded-3xl p-6 sm:p-8 shadow-spatial-lg space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-[#F0E8D4] pb-3">
            <button
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 pb-2 text-center text-xs sm:text-sm font-black border-b-2 transition-all ${
                mode === 'signin'
                  ? 'border-[#E7B83F] text-[#252525]'
                  : 'border-transparent text-[#77736A] hover:text-[#252525]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 pb-2 text-center text-xs sm:text-sm font-black border-b-2 transition-all ${
                mode === 'signup'
                  ? 'border-[#E7B83F] text-[#252525]'
                  : 'border-transparent text-[#77736A] hover:text-[#252525]'
              }`}
            >
              Student Sign Up
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#252525] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anandha Krishnan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Register No *</label>
                    <input
                      type="text"
                      required
                      placeholder="720721..."
                      value={registerNumber}
                      onChange={(e) => setRegisterNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#252525] mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77736A]" />
                <input
                  type="email"
                  required
                  placeholder="name@hindusthan.net"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#252525] mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77736A]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-[#252525] text-xs sm:text-sm focus:outline-none focus:border-[#E7B83F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-black text-sm text-[#252525] bg-[#FFE99A] hover:bg-[#E7B83F] shadow-[0_4px_16px_rgba(231,184,63,0.3)] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
