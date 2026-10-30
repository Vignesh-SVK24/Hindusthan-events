import React from 'react';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/db';
import EventPageClient from './EventPageClient';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEventBySlug(params.slug);
  if (!event) {
    return { title: 'Event Not Found | Hindusthan Events Hub' };
  }

  return {
    title: `${event.title} | Hindusthan Events Hub`,
    description: event.short_description || event.tagline || 'College Event Details',
  };
}

export default function EventPage({ params }: Props) {
  const event = getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  return <EventPageClient initialEvent={event} />;
}
