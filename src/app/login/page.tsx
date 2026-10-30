'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, User, ArrowLeft, Lock, Mail, GraduationCap, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, quickLogin } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Sign up fields
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
    <div className="min-h-screen bg-[#070b19] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-amber-400 selection:text-slate-950">
      
      {/* Return home link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to College Events Hub</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        
        {/* College Logo & Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="relative w-16 h-20 mx-auto rounded-xl overflow-hidden bg-white/95 p-1 border-2 border-amber-400/50 shadow-xl">
            <Image
              src="/college-logo.jpg"
              alt="Hindusthan Educational and Charitable Trust"
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            Hindusthan Events Hub
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access event registrations or manage college event publishing
          </p>
        </div>

        {/* 1-Click Quick Demo Switch Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleQuick('admin')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 hover:bg-slate-800 transition-all text-left shadow-lg"
          >
            <div className="flex items-center gap-1.5 text-amber-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold">1-Click Admin</span>
            </div>
            <p className="text-[10px] text-slate-400">admin@hindusthan.net</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuick('student')}
            className="p-3 rounded-2xl bg-slate-900/90 border border-blue-500/40 hover:border-blue-400 hover:bg-slate-800 transition-all text-left shadow-lg"
          >
            <div className="flex items-center gap-1.5 text-blue-400 mb-1">
              <User className="w-4 h-4" />
              <span className="text-xs font-bold">1-Click Student</span>
            </div>
            <p className="text-[10px] text-slate-400">student@hindusthan.net</p>
          </button>
        </div>

        {/* Main Auth Form Container */}
        <div className="bg-[#0c1222] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-slate-800 pb-3">
            <button
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 pb-2 text-center text-xs sm:text-sm font-bold border-b-2 transition-all ${
                mode === 'signin'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 pb-2 text-center text-xs sm:text-sm font-bold border-b-2 transition-all ${
                mode === 'signup'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Student Sign Up
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-xs text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anandha Krishnan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Register No *</label>
                    <input
                      type="text"
                      required
                      placeholder="720721..."
                      value={registerNumber}
                      onChange={(e) => setRegisterNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@hindusthan.net"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-xl shadow-amber-400/20 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
