import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _client;
}

// Proxy so imports can use `supabase.from(...)` directly
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop: string) {
    return (getSupabase() as unknown as Record<string, unknown>)[prop];
  },
});
