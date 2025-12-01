import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Use the same project URL and anon key on the server.
// For stricter security you can switch to a service role key via env later.
const SUPABASE_URL = 'https://xybnqhsqlaaocqibqhbn.supabase.co'

const SUPABASE_KEY =
  process.env.SUPABASE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjUxMTgsImV4cCI6MjA4MDA0MTExOH0.TC8NYtT0h3cx9ZZtvQBy9JcT0yHD-daiXm9MMo8zBR4'

let supabaseInstance: ReturnType<typeof createServerClient> | null = null

export async function getSupabaseServerClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const cookieStore = await cookies()

  supabaseInstance = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Handle error
        }
      },
    },
  })

  return supabaseInstance
}

