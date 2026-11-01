import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getEventArchiveBySlug, getAllEventArchives } from '@/lib/db';
import { 
  Calendar, 
  User, 
  Users, 
  MapPin, 
  Camera, 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  Building2, 
  Sparkles 
} from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static params for fast Next.js pre-rendering of all 20 historical archive records
export async function generateStaticParams() {
  const archives = getAllEventArchives();
  return archives.map((archive) => ({
    slug: archive.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const archive = getEventArchiveBySlug(params.slug);
  if (!archive) {
    return {
      title: 'Historical Record Not Found — AIML Event Archives',
    };
  }

  return {
    title: `${archive.event_name} — AIML Event Archives | HiCET`,
    description: `Official historical record of "${archive.event_name}" conducted on ${archive.event_date_original} by the Department of Artificial Intelligence and Machine Learning (AIML), Hindusthan College of Engineering and Technology.`,
  };
}

export default function EventArchiveDetailPage({ params }: PageProps) {
  const archive = getEventArchiveBySlug(params.slug);

  if (!archive) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#252525] flex flex-col selection:bg-[#FFE99A] selection:text-[#252525]">
      {/* Navigation */}
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Navigation Breadcrumb / Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/event-archives"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#F0E8D4] text-xs font-bold text-[#252525] hover:text-[#C99A27] hover:border-[#E7B83F] shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to AIML Event Archives</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE99A]/40 border border-[#E7B83F]/30 text-xs font-black text-[#252525]">
            <Sparkles className="w-3.5 h-3.5 text-[#C99A27]" />
            <span>Historical Archive Registry</span>
          </div>
        </div>

        {/* Spatial Hero Card */}
        <div className="rounded-3xl bg-white border border-[#F0E8D4] p-6 sm:p-10 shadow-spatial-md space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-[#FFF9E8] border border-[#F0E8D4] text-xs font-black text-[#252525]">
              S.No. {archive.original_serial_number}
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FFFDF5] border border-[#F0E8D4] text-xs font-bold text-[#77736A]">
              Academic Year: {archive.academic_year}
            </span>
            {archive.geo_tag && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10b981]/10 text-[#059669] border border-[#10b981]/25 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>GPS Geo-Tagged Record</span>
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#C99A27]">
              <Calendar className="w-4 h-4" />
              <span>Conducted Date: {archive.event_date_original}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#252525] leading-snug tracking-tight font-sans">
              {archive.event_name}
            </h1>
          </div>
        </div>

        {/* Resource Person & Coordinators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resource Person Section (Only if provided) */}
          {archive.resource_person ? (
            <div className="rounded-3xl bg-white border border-[#F0E8D4] p-6 sm:p-8 shadow-spatial-sm space-y-4">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-[#C99A27]">
                <User className="w-4 h-4 text-[#C99A27]" />
                <span>Resource Person</span>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-lg font-black text-[#252525] whitespace-pre-line leading-relaxed">
                  {archive.resource_person_name || archive.resource_person}
                </h2>
                {archive.resource_person_designation && (
                  <p className="text-xs sm:text-sm text-[#77736A] whitespace-pre-line leading-relaxed">
                    {archive.resource_person_designation}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#FFFDF5] border border-dashed border-[#F0E8D4] p-6 sm:p-8 flex items-center justify-center text-center">
              <p className="text-xs text-[#77736A] italic">
                Resource Person details not recorded in authoritative source document.
              </p>
            </div>
          )}

          {/* Event Coordinators Section (Only if provided) */}
          {archive.event_coordinators ? (
            <div className="rounded-3xl bg-white border border-[#F0E8D4] p-6 sm:p-8 shadow-spatial-sm space-y-4">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-[#C99A27]">
                <Users className="w-4 h-4 text-[#C99A27]" />
                <span>Event Coordinators</span>
              </div>

              <div className="space-y-1">
                <p className="text-sm sm:text-base font-bold text-[#252525] whitespace-pre-line leading-relaxed">
                  {archive.event_coordinators}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F0E8D4]/60">
                <span className="text-[11px] text-[#77736A]">
                  Faculty & Staff Coordinators, Department of AIML, HiCET
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#FFFDF5] border border-dashed border-[#F0E8D4] p-6 sm:p-8 flex items-center justify-center text-center">
              <p className="text-xs text-[#77736A] italic">
                Coordinators not recorded in source document.
              </p>
            </div>
          )}
        </div>

        {/* Photographic Evidence & Geo-Tag Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 6: Event Photograph (Only if available) */}
          {archive.photo_url ? (
            <div className="rounded-3xl bg-white border border-[#F0E8D4] p-6 sm:p-8 shadow-spatial-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#252525]">
                  <Camera className="w-4 h-4 text-[#C99A27]" />
                  <span>Event Photograph / Official Poster</span>
                </div>
                <span className="text-[11px] text-[#77736A]">Archived Asset</span>
              </div>

              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-[#FFF9E8] border border-[#F0E8D4] shadow-xs">
                <Image
                  src={archive.photo_url}
                  alt={archive.event_name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-2"
                  priority
                />
              </div>
              <p className="text-[11px] text-[#77736A] text-center">
                Original event poster / promotional banner as documented in departmental records.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#FFFDF5] border border-dashed border-[#F0E8D4] p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Camera className="w-10 h-10 text-[#C99A27]/40 mb-3" />
              <p className="text-xs font-bold text-[#252525]">No Event Photograph Available</p>
              <p className="text-[11px] text-[#77736A] mt-1 max-w-xs">
                Photo asset was not provided in the source document.
              </p>
            </div>
          )}

          {/* Section 7: Geo Tag Evidence (Only if available) */}
          {archive.geo_tag ? (
            <div className="rounded-3xl bg-white border border-[#F0E8D4] p-6 sm:p-8 shadow-spatial-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#059669]">
                  <MapPin className="w-4 h-4 text-[#059669]" />
                  <span>GPS Geo-Tagged Field Proof</span>
                </div>
                <span className="text-[10px] font-bold text-[#059669] bg-[#10b981]/10 px-2.5 py-0.5 rounded-full">
                  GPS Verified
                </span>
              </div>

              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-[#FFF9E8] border border-[#F0E8D4] shadow-xs">
                <Image
                  src={archive.geo_tag}
                  alt={`GPS Geo-Tag: ${archive.event_name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-2"
                  priority
                />
              </div>
              <p className="text-[11px] text-[#77736A] text-center">
                Field documentation captured with GPS coordinates, timestamp, and venue location.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#FFFDF5] border border-dashed border-[#F0E8D4] p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
              <MapPin className="w-10 h-10 text-[#C99A27]/40 mb-3" />
              <p className="text-xs font-bold text-[#252525]">No Geo-Tag Evidence Recorded</p>
              <p className="text-[11px] text-[#77736A] mt-1 max-w-xs">
                Geo-tag image was not included in the consolidated documentation.
              </p>
            </div>
          )}
        </div>

        {/* Source Document Provenance Card */}
        <div className="rounded-3xl bg-gradient-to-r from-[#FFF9E8] to-[#FFFDF5] border border-[#F0E8D4] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white border border-[#F0E8D4] text-[#C99A27]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#252525]">Authoritative Document Reference</p>
              <p className="text-[11px] text-[#77736A] font-mono">{archive.source_document}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#77736A]">
            <Building2 className="w-4 h-4 text-[#C99A27]" />
            <span>Department of Artificial Intelligence & Machine Learning</span>
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-4 text-center">
          <Link
            href="/event-archives"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#FFE99A] hover:bg-[#E7B83F] text-[#252525] text-xs font-black shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All AIML Event Archives</span>
          </Link>
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
