-- ============================================================================
-- HICET EVENTS PLATFORM — COMPLETE SUPABASE DATABASE SCHEMA
-- Hindusthan College of Engineering and Technology
-- Department of Artificial Intelligence and Machine Learning (AIML)
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  category_name TEXT NOT NULL,
  category_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 3. PROFILES TABLE (Linked with Supabase Auth auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'HICET Student',
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  profile_photo_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  department TEXT,
  register_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 4. EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT,
  short_description TEXT,
  description TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  department TEXT,
  organizer TEXT,
  event_date DATE,
  end_date DATE,
  start_time TEXT,
  end_time TEXT,
  venue TEXT,
  poster_url TEXT,
  cover_image_url TEXT,
  registration_enabled BOOLEAN DEFAULT true,
  registration_type TEXT DEFAULT 'builtin' CHECK (registration_type IN ('builtin', 'external')),
  registration_url TEXT,
  registration_deadline TIMESTAMPTZ,
  maximum_participants INTEGER,
  publication_status TEXT DEFAULT 'published' CHECK (publication_status IN ('published', 'draft', 'unpublished')),
  eligibility TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  rules JSONB DEFAULT '[]'::jsonb,
  schedule JSONB DEFAULT '[]'::jsonb,
  prizes JSONB DEFAULT '[]'::jsonb,
  coordinators JSONB DEFAULT '[]'::jsonb,
  sponsors JSONB DEFAULT '[]'::jsonb,
  theme JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_publication_status ON public.events(publication_status);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);

-- ============================================================================
-- 5. REGISTRATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  registration_number TEXT NOT NULL UNIQUE,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  department TEXT NOT NULL,
  year_of_study TEXT NOT NULL,
  phone_number TEXT,
  college_name TEXT,
  roll_number TEXT,
  registration_status TEXT DEFAULT 'confirmed' CHECK (registration_status IN ('confirmed', 'pending', 'cancelled')),
  qr_pass_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Database constraint: Prevent duplicate registrations for the same event and email
  CONSTRAINT unique_event_participant_email UNIQUE(event_id, participant_email)
);

CREATE INDEX IF NOT EXISTS idx_registrations_event ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(participant_email);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON public.registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_reg_no ON public.registrations(registration_number);

-- ============================================================================
-- 6. EVENT HISTORY TABLE (Audit Trail for Event Changes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.event_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'CREATED', 'UPDATED', 'REGISTRATION_TOGGLED', 'PUBLISHED', 'ARCHIVED'
  activity_description TEXT NOT NULL,
  performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_history_event ON public.event_history(event_id);

-- ============================================================================
-- 7. ADMIN LOGS TABLE (Sensitive Administrative Operations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON public.admin_logs(admin_user_id);

-- ============================================================================
-- 8. EVENT ARCHIVES TABLE (AIML Historical Department Records)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.event_archives (
  id TEXT PRIMARY KEY,
  original_serial_number TEXT,
  event_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  resource_person TEXT,
  resource_person_name TEXT,
  resource_person_designation TEXT,
  event_coordinators TEXT,
  event_date_original TEXT,
  event_date_parsed DATE,
  photo_url TEXT,
  geo_tag TEXT,
  academic_year TEXT,
  source_document TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_archives_slug ON public.event_archives(slug);

-- ============================================================================
-- 9. TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function: Automatic updated_at timestamp refresher
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_events_updated_at ON public.events;
CREATE TRIGGER trigger_set_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_registrations_updated_at ON public.registrations;
CREATE TRIGGER trigger_set_registrations_updated_at
  BEFORE UPDATE ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Function: Automatic Profile Creation when a user signs in via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, profile_photo_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL),
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    profile_photo_url = COALESCE(EXCLUDED.profile_photo_url, profiles.profile_photo_url),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Security Definer: Check if executing user has admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Trigger: Prevent non-admin users from escalating their own role
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role != OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Users cannot modify their own administrative role.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_protect_profile_role ON public.profiles;
CREATE TRIGGER trigger_protect_profile_role
  BEFORE UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_archives ENABLE ROW LEVEL SECURITY;

-- 10.1 CATEGORIES POLICIES
CREATE POLICY "Public can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 10.2 PROFILES POLICIES
CREATE POLICY "Public can view basic profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 10.3 EVENTS POLICIES
CREATE POLICY "Public can view published events"
  ON public.events FOR SELECT
  USING (publication_status = 'published' OR public.is_admin());

CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 10.4 REGISTRATIONS POLICIES
CREATE POLICY "Users can view own registrations"
  ON public.registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR participant_email = (auth.jwt() ->> 'email') OR public.is_admin());

CREATE POLICY "Anyone can register for published events"
  ON public.registrations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = event_id AND registration_enabled = true AND publication_status = 'published'
    )
  );

CREATE POLICY "Admins can update registrations"
  ON public.registrations FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete registrations"
  ON public.registrations FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 10.5 EVENT HISTORY POLICIES
CREATE POLICY "Public can view event history"
  ON public.event_history FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert event history"
  ON public.event_history FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- 10.6 ADMIN LOGS POLICIES
CREATE POLICY "Admins can view admin logs"
  ON public.admin_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 10.7 EVENT ARCHIVES POLICIES
CREATE POLICY "Public can view event archives"
  ON public.event_archives FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage event archives"
  ON public.event_archives FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 11. SUPABASE STORAGE BUCKETS CONFIGURATION
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('event-posters', 'event-posters', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('profile-photos', 'profile-photos', true, 2097152, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('event-documents', 'event-documents', false, 10485760, ARRAY['application/pdf', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
CREATE POLICY "Public read for event posters"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-posters');

CREATE POLICY "Admins can upload event posters"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-posters' AND public.is_admin());

CREATE POLICY "Admins can delete event posters"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-posters' AND public.is_admin());

CREATE POLICY "Public read for profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own profile photo"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-photos');

-- ============================================================================
-- 12. INITIAL CATEGORIES SEED DATA
-- ============================================================================
INSERT INTO public.categories (id, category_name, category_description)
VALUES
  ('cat-1', 'Technical Events', 'Coding contests, tech quizzes, robotics and technical challenges'),
  ('cat-2', 'Cultural Events', 'Music, dance, drama, fashion shows and artistic performances'),
  ('cat-3', 'Symposiums', 'Departmental paper presentations, technical symposiums and academic conclaves'),
  ('cat-4', 'Workshops', 'Hands-on practical workshops, bootcamps and expert training sessions'),
  ('cat-5', 'Hackathons', '24 to 36-hour continuous software and hardware build sprints'),
  ('cat-6', 'Sports Events', 'Inter-college tournaments, track and field, indoor & outdoor games'),
  ('cat-7', 'Department Events', 'Events organized by individual academic departments'),
  ('cat-8', 'Club Events', 'Student clubs, social responsibility, arts and literature chapters'),
  ('cat-9', 'Other College Events', 'Alumni meets, convocation, annual day and college-wide festivals')
ON CONFLICT (id) DO NOTHING;
