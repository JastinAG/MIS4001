import { createBrowserClient } from '@supabase/ssr'

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (typeof window !== 'undefined' && !browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      console.error('[v0] Missing Supabase environment variables:', {
        url: !!url,
        key: !!key,
        allEnvKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
      })
      throw new Error(
        'Supabase URL and Anon Key are required. Check your environment variables.\n' +
        'Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
      )
    }

    browserClient = createBrowserClient(url, key)
  }
  return browserClient
}
