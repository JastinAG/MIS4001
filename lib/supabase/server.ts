import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xybnqhsqlaaocqibqhbn.supabase.co'

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY

if (!SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set.')
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    'SUPABASE_SERVICE_ROLE_KEY is not set. Server-side Supabase client will fall back to anon key.',
  )
}

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjUxMTgsImV4cCI6MjA4MDA0MTExOH0.TC8NYtT0h3cx9ZZtvQBy9JcT0yHD-daiXm9MMo8zBR4'

const SERVER_KEY = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY

let supabaseInstance: ReturnType<typeof createServerClient> | null = null

export async function getSupabaseServerClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const cookieStore = await cookies()

  supabaseInstance = createServerClient(SUPABASE_URL, SERVER_KEY, {
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


