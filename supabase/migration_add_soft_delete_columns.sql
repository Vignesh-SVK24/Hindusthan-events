-- ============================================================================
-- HICET EVENTS PLATFORM — SAFE MIGRATION
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- Adds soft deletion, trash recovery tracking, and status columns to events table.
-- ============================================================================

-- 1. Add soft-delete and recovery columns to public.events if they don't already exist
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS deleted_by TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS restored_at TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS restored_by TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_status TEXT DEFAULT 'published';

-- 2. Add performance index on is_deleted
CREATE INDEX IF NOT EXISTS idx_events_is_deleted ON public.events(is_deleted);

-- 3. Update any null is_deleted records to false
UPDATE public.events SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE public.events SET event_status = 'published' WHERE event_status IS NULL;

-- 4. Enable public read access for event-media storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-media',
  'event-media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[];
