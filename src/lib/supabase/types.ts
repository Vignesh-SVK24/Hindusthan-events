export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          category_name: string;
          category_description: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          category_name: string;
          category_description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_name?: string;
          category_description?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone_number: string | null;
          profile_photo_url: string | null;
          role: 'user' | 'admin';
          department: string | null;
          register_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          email: string;
          phone_number?: string | null;
          profile_photo_url?: string | null;
          role?: 'user' | 'admin';
          department?: string | null;
          register_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone_number?: string | null;
          profile_photo_url?: string | null;
          role?: 'user' | 'admin';
          department?: string | null;
          register_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          tagline: string | null;
          short_description: string | null;
          description: string | null;
          category_id: string | null;
          department: string | null;
          organizer: string | null;
          event_date: string | null;
          end_date: string | null;
          start_time: string | null;
          end_time: string | null;
          venue: string | null;
          poster_url: string | null;
          cover_image_url: string | null;
          registration_enabled: boolean;
          registration_type: 'builtin' | 'external';
          registration_url: string | null;
          registration_deadline: string | null;
          maximum_participants: number | null;
          publication_status: 'published' | 'draft' | 'unpublished';
          eligibility: string | null;
          highlights: Json;
          rules: Json;
          schedule: Json;
          prizes: Json;
          coordinators: Json;
          sponsors: Json;
          theme: Json;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          tagline?: string | null;
          short_description?: string | null;
          description?: string | null;
          category_id?: string | null;
          department?: string | null;
          organizer?: string | null;
          event_date?: string | null;
          end_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          venue?: string | null;
          poster_url?: string | null;
          cover_image_url?: string | null;
          registration_enabled?: boolean;
          registration_type?: 'builtin' | 'external';
          registration_url?: string | null;
          registration_deadline?: string | null;
          maximum_participants?: number | null;
          publication_status?: 'published' | 'draft' | 'unpublished';
          eligibility?: string | null;
          highlights?: Json;
          rules?: Json;
          schedule?: Json;
          prizes?: Json;
          coordinators?: Json;
          sponsors?: Json;
          theme?: Json;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          tagline?: string | null;
          short_description?: string | null;
          description?: string | null;
          category_id?: string | null;
          department?: string | null;
          organizer?: string | null;
          event_date?: string | null;
          end_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          venue?: string | null;
          poster_url?: string | null;
          cover_image_url?: string | null;
          registration_enabled?: boolean;
          registration_type?: 'builtin' | 'external';
          registration_url?: string | null;
          registration_deadline?: string | null;
          maximum_participants?: number | null;
          publication_status?: 'published' | 'draft' | 'unpublished';
          eligibility?: string | null;
          highlights?: Json;
          rules?: Json;
          schedule?: Json;
          prizes?: Json;
          coordinators?: Json;
          sponsors?: Json;
          theme?: Json;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string | null;
          registration_number: string;
          participant_name: string;
          participant_email: string;
          department: string;
          year_of_study: string;
          phone_number: string | null;
          college_name: string | null;
          roll_number: string | null;
          registration_status: 'confirmed' | 'pending' | 'cancelled';
          qr_pass_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id?: string | null;
          registration_number: string;
          participant_name: string;
          participant_email: string;
          department: string;
          year_of_study: string;
          phone_number?: string | null;
          college_name?: string | null;
          roll_number?: string | null;
          registration_status?: 'confirmed' | 'pending' | 'cancelled';
          qr_pass_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string | null;
          registration_number?: string;
          participant_name?: string;
          participant_email?: string;
          department?: string;
          year_of_study?: string;
          phone_number?: string | null;
          college_name?: string | null;
          roll_number?: string | null;
          registration_status?: 'confirmed' | 'pending' | 'cancelled';
          qr_pass_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_history: {
        Row: {
          id: string;
          event_id: string;
          activity_type: string;
          activity_description: string;
          performed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          activity_type: string;
          activity_description: string;
          performed_by?: string | null;
          created_at?: string;
        };
      };
      admin_logs: {
        Row: {
          id: string;
          admin_user_id: string | null;
          action: string;
          target_type: string;
          target_id: string | null;
          created_at: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          admin_user_id?: string | null;
          action: string;
          target_type: string;
          target_id?: string | null;
          created_at?: string;
          metadata?: Json;
        };
      };
      event_archives: {
        Row: {
          id: string;
          original_serial_number: string | null;
          event_name: string;
          slug: string;
          resource_person: string | null;
          resource_person_name: string | null;
          resource_person_designation: string | null;
          event_coordinators: string | null;
          event_date_original: string | null;
          event_date_parsed: string | null;
          photo_url: string | null;
          geo_tag: string | null;
          academic_year: string | null;
          source_document: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          original_serial_number?: string | null;
          event_name: string;
          slug: string;
          resource_person?: string | null;
          resource_person_name?: string | null;
          resource_person_designation?: string | null;
          event_coordinators?: string | null;
          event_date_original?: string | null;
          event_date_parsed?: string | null;
          photo_url?: string | null;
          geo_tag?: string | null;
          academic_year?: string | null;
          source_document?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
