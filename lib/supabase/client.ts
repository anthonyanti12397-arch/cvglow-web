/**
 * Supabase client — cross-device persistence for CVGlow.
 *
 * Setup:
 * 1. Create a free project at https://supabase.com
 * 2. Copy the project URL and anon key from Settings → API
 * 3. Add to .env.local:
 *      NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *      NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
 * 4. Run the SQL in lib/supabase/schema.sql in the Supabase SQL editor
 * 5. Change `SUPABASE_ENABLED` below to `true`
 *
 * Until Supabase is configured the app falls back to localStorage/sessionStorage.
 */

export const SUPABASE_ENABLED =
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Lazy-load the client only when credentials are present
let _client: ReturnType<typeof createBrowserClient> | null = null

function createBrowserClient(url: string, key: string) {
  // Dynamic import so the bundle stays small when Supabase is disabled
  const { createClient } = require('@supabase/supabase-js')
  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

export function getSupabaseClient() {
  if (!SUPABASE_ENABLED) return null
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

export default getSupabaseClient
