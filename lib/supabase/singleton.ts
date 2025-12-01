import { createBrowserClient } from '@supabase/ssr'

// Supabase configuration for this project.
// These values come directly from your Supabase project.
const SUPABASE_URL = 'https://xybnqhsqlaaocqibqhbn.supabase.co'

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjUxMTgsImV4cCI6MjA4MDA0MTExOH0.TC8NYtT0h3cx9ZZtvQBy9JcT0yHD-daiXm9MMo8zBR4'

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (typeof window === 'undefined') {
    return null
  }

  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }

  return browserClient
}

