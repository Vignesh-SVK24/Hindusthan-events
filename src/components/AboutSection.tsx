'use client';

import React from 'react';
import Image from 'next/image';
import { Award, Compass, GraduationCap, Building2, MapPin, Phone, Mail } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about-section" className="py-16 sm:py-24 border-t border-[#F0E8D4] bg-[#FFF9E8]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Institutional Trust Logo & Legacy Floating Spatial Panel */}
          <div className="lg:col-span-5 flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial-lg">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden bg-white p-3 border-2 border-[#FFE99A] shadow-md mb-6">
              <Image
                src="/college-logo.jpg"
                alt="Hindusthan Educational and Charitable Trust"
                fill
                className="object-contain p-1"
                sizes="240px"
              />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-[#252525] uppercase tracking-wider font-sans">
              Hindusthan Educational & Charitable Trust
            </h3>
            <p className="text-xs text-[#C99A27] font-bold uppercase tracking-widest mt-1">
              Coimbatore, Tamil Nadu, India
            </p>
            <p className="text-xs sm:text-sm text-[#77736A] mt-3 leading-relaxed">
              Founded with the vision to provide quality engineering, management, and arts education, fostering innovation, athletic supremacy, and cultural brilliance across multiple premier institutions.
            </p>
          </div>

          {/* Core Pillars & Campus Infrastructure */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#C99A27]">
                Institutional Infrastructure
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">
                Empowering Students Through Premier Extra-Curricular Platforms
              </h2>
              <p className="text-xs sm:text-sm text-[#77736A] leading-relaxed">
                Our world-class campuses host air-conditioned indoor auditoriums, high-performance computing centers, outdoor floodlit athletic arenas, and cultural amphitheaters tailored for national and international conclaves.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#F0E8D4] shadow-spatial-sm flex items-start gap-3.5 hover:border-[#E7B83F] transition-all">
                <div className="p-2.5 rounded-xl bg-[#FFF0B3] text-[#252525] shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#252525]">4 Premier Auditoriums</h4>
                  <p className="text-xs text-[#77736A] mt-0.5 leading-relaxed">Seating capacities ranging from 1,200 to 4,500 delegates with acoustic sound systems.</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#F0E8D4] shadow-spatial-sm flex items-start gap-3.5 hover:border-[#E7B83F] transition-all">
                <div className="p-2.5 rounded-xl bg-[#FFE99A] text-[#252525] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#252525]">Synthetic Athletic Track</h4>
                  <p className="text-xs text-[#77736A] mt-0.5 leading-relaxed">International standard 400m synthetic tracks, floodlit turf football & basketball courts.</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#F0E8D4] shadow-spatial-sm flex items-start gap-3.5 hover:border-[#E7B83F] transition-all">
                <div className="p-2.5 rounded-xl bg-[#FFF6D8] text-[#252525] shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#252525]">Innovation Centers</h4>
                  <p className="text-xs text-[#77736A] mt-0.5 leading-relaxed">High-performance AI/ML supercomputing clusters and IoT prototyping laboratories.</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#F0E8D4] shadow-spatial-sm flex items-start gap-3.5 hover:border-[#E7B83F] transition-all">
                <div className="p-2.5 rounded-xl bg-[#FFF0B3] text-[#252525] shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#252525]">Central Hub Automation</h4>
                  <p className="text-xs text-[#77736A] mt-0.5 leading-relaxed">Automated registration tracking, QR verification, and instant dynamic event page publishing.</p>
                </div>
              </div>
            </div>

            {/* Campus Address & Contacts */}
            <div className="pt-4 border-t border-[#F0E8D4] flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#77736A]">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C99A27]" />
                Valley Campus, Pollachi Main Road, Coimbatore — 641 032
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#C99A27]" />
                +91 422 4440555
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#C99A27]" />
                events@hindusthan.net
              </span>
            </div>

          </div>

        </div>

        {/* Department of AIML Initiative & Attribution Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF9E8] border border-[#F0E8D4] flex items-center justify-center text-[#C99A27] font-black text-lg shadow-xs shrink-0">
              AI
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#C99A27] uppercase tracking-wider">Departmental Initiative</p>
              <h4 className="text-sm sm:text-base font-black text-[#252525]">Department of Artificial Intelligence and Machine Learning (AIML)</h4>
              <p className="text-xs text-[#77736A] mt-0.5">Hindusthan College of Engineering and Technology, Coimbatore</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs w-full md:w-auto">
            <div className="px-4 py-2.5 rounded-2xl bg-[#FFFDF5] border border-[#F0E8D4] w-full sm:w-auto text-center sm:text-left">
              <span className="text-[#77736A] font-medium mr-1.5">Organized by:</span>
              <span className="font-bold text-[#252525]">Department of Artificial Intelligence and Machine Learning (AIML)</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#FFF0B3]/50 border border-[#FFE99A] text-[#252525] w-full sm:w-auto text-center sm:text-left shadow-xs">
              <span className="font-black text-[#C99A27]">Website Developed and managed by Vignesh S - AIML</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
