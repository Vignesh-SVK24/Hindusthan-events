export type UserRole = 'admin' | 'student';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  department: string;
  register_number: string;
  created_at: string;
}

export interface EventCategory {
  id: string;
  category_name: string;
  category_description: string;
  created_at: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  speaker_or_venue?: string;
}

export interface PrizeItem {
  rank: string;
  title: string;
  reward: string;
}

export interface CoordinatorItem {
  name: string;
  role: string;
  phone: string;
  email?: string;
}

export interface SponsorItem {
  name: string;
  tier?: string;
  logo?: string;
}

export type PublicationStatus = 'draft' | 'published' | 'unpublished';
export type RegistrationType = 'builtin' | 'external';

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  short_description: string;
  description: string;
  category_id: string;
  department: string;
  organizer: string;
  poster_url: string;
  cover_image_url: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  venue: string;
  registration_enabled: boolean;
  registration_type: RegistrationType;
  registration_url?: string;
  registration_deadline?: string;
  publication_status: PublicationStatus;
  highlights?: string[];
  schedule?: ScheduleItem[];
  rules?: string[];
  eligibility?: string;
  prizes?: PrizeItem[];
  coordinators?: CoordinatorItem[];
  sponsors?: SponsorItem[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type ThemePreset =
  | 'tech-symposium'
  | 'cultural-fest'
  | 'hackathon'
  | 'sports-arena'
  | 'workshop-clean'
  | 'custom';

export interface EventTheme {
  id: string;
  event_id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  heading_font: string;
  body_font: string;
  hero_layout: 'split' | 'centered' | 'fullwidth' | 'poster-focus';
  button_style: 'rounded' | 'pill' | 'sharp' | 'glow' | 'cyber';
  card_style: 'glass' | 'bordered' | 'solid' | 'neon';
  background_style: 'grid' | 'particles' | 'mesh' | 'waves' | 'circuits' | 'minimal' | 'gradient';
  animation_style: 'futuristic' | 'festive' | 'energetic' | 'smooth' | 'minimal';
  theme_preset: ThemePreset;
}

export interface EventMedia {
  id: string;
  event_id: string;
  media_type: 'image' | 'video';
  media_url: string;
  display_order: number;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  full_name: string;
  email: string;
  register_number: string;
  department: string;
  year: string;
  contact_number: string;
  registration_status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
}

export interface DatabaseSchema {
  profiles: Profile[];
  event_categories: EventCategory[];
  events: EventItem[];
  event_themes: EventTheme[];
  event_media: EventMedia[];
  event_registrations: EventRegistration[];
}
