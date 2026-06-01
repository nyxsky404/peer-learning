import { createClient } from "@supabase/supabase-js";

let supabaseAdminClient = null;

export const getSupabaseAdmin = () => {
  if (supabaseAdminClient) return supabaseAdminClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  supabaseAdminClient = createClient(supabaseUrl, supabaseKey);
  return supabaseAdminClient;
};
