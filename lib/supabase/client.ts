import { getSupabaseBrowserClient } from './singleton'

let supabaseInstance: ReturnType<typeof getSupabaseBrowserClient> | null = null

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseClient can only be called on the client side')
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = getSupabaseBrowserClient()
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      throw error
    }
  }
  return supabaseInstance
}
