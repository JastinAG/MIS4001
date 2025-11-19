import { getSupabaseBrowserClient } from './singleton'

let supabaseInstance: ReturnType<typeof getSupabaseBrowserClient> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = getSupabaseBrowserClient()
  }
  return supabaseInstance
}
