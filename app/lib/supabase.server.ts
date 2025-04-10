import {createClient} from '@supabase/supabase-js';

function getSupabaseClient(supabaseKey: string, supabaseUrl: string) {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSupabaseAdmin(
  SUPABASE_SERVICE_ROLE: string,
  SUPABASE_URL: string,
) {
  return getSupabaseClient(SUPABASE_SERVICE_ROLE, SUPABASE_URL);
}
