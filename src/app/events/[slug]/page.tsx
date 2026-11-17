import React from 'react';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/supabase/dbAdapter';
import EventPageClient from './EventPageClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event || event.is_deleted) {
    return { title: 'Event Not Found | Hindusthan Events Hub' };
  }

  return {
    title: `${event.title} | Hindusthan Events Hub`,
    description: event.short_description || event.tagline || 'College Event Details',
  };
}

export default async function EventPage({ params }: Props) {
  const event = await getEventBySlug(params.slug);

  if (!event || event.is_deleted) {
    notFound();
  }

  return <EventPageClient initialEvent={event} />;
}
