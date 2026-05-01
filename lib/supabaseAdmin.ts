// Server-only. Never import this from a client component or page —
// it requires SUPABASE_SERVICE_ROLE_KEY which must not reach the browser.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing env var NEXT_PUBLIC_SUPABASE_URL.");
  }
  if (!serviceKey) {
    throw new Error(
      "Missing env var SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local — required for admin actions like account deletion. Never expose this key to the browser."
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
