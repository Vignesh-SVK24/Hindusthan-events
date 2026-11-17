import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseServerConfigured = Boolean(
  supabaseUrl &&
  (supabaseServiceRoleKey || supabaseAnonKey) &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

/**
 * Creates a server-side Supabase client.
 * @param useServiceRole If true, uses the privileged service role key for administrative/system operations.
 */
export function getSupabaseServerClient(useServiceRole = false) {
  if (!isSupabaseServerConfigured) {
    return null;
  }

  const key = useServiceRole && supabaseServiceRoleKey ? supabaseServiceRoleKey : (supabaseServiceRoleKey || supabaseAnonKey);
  if (!key) {
    return null;
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
