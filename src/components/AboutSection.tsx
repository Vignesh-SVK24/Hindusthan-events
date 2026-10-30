'use client';

import React from 'react';
import Image from 'next/image';
import { Award, Compass, GraduationCap, Building2, MapPin, Phone, Mail } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about-section" className="py-20 border-t border-slate-800/80 bg-[#060914]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Institutional Trust Logo & Legacy */}
          <div className="lg:col-span-5 flex flex-col items-center text-center p-8 rounded-3xl bg-slate-900/40 border border-amber-400/20 shadow-xl">
            <div className="relative w-40 h-52 sm:w-48 sm:h-60 rounded-2xl overflow-hidden bg-white/95 p-3 border-2 border-amber-400/50 shadow-2xl mb-6">
              <Image
                src="/college-logo.jpg"
                alt="Hindusthan Educational and Charitable Trust"
                fill
                className="object-contain p-1"
                sizes="240px"
              />
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-wider">
              Hindusthan Educational & Charitable Trust
            </h3>
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mt-1">
              Coimbatore, Tamil Nadu, India
            </p>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Founded with the vision to provide quality engineering, management, and arts education, fostering innovation, athletic supremacy, and cultural brilliance across multiple premier institutions.
            </p>
          </div>

          {/* Core Pillars & Infrastructure */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Institutional Infrastructure
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Empowering Students Through Premier Extra-Curricular Platforms
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Our world-class campuses host air-conditioned indoor auditoriums, high-performance computing centers, outdoor floodlit athletic arenas, and cultural amphitheaters tailored for national and international conclaves.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">4 Premier Auditoriums</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Seating capacities ranging from 1,200 to 4,500 delegates with acoustic sound systems.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Synthetic Athletic Track</h4>
                  <p className="text-xs text-slate-400 mt-0.5">International standard 400m synthetic tracks, floodlit turf football & basketball courts.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Innovation Centers</h4>
                  <p className="text-xs text-slate-400 mt-0.5">High-performance AI/ML supercomputing clusters and IoT prototyping laboratories.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Central Hub Automation</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Automated registration tracking, QR verification, and instant dynamic event page publishing.</p>
                </div>
              </div>
            </div>

            {/* Campus Address & Contacts */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                Valley Campus, Pollachi Main Road, Coimbatore — 641 032
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-amber-400" />
                +91 422 4440555
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-400" />
                events@hindusthan.net
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
