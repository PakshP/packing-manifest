import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL) {
  throw new Error(
    "Missing env var NEXT_PUBLIC_SUPABASE_URL. Add it to .env.local — see .env.local.example."
  );
}

if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing env var NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Use the new sb_publishable_xxx key from your Supabase project's API settings — not the legacy anon key."
  );
}

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
