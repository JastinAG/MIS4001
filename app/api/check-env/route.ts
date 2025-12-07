import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
    anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
  }

  const allSet = envCheck.hasUrl && envCheck.hasAnonKey && envCheck.hasServiceKey

  return NextResponse.json({
    status: allSet ? 'ok' : 'missing',
    message: allSet
      ? 'All environment variables are loaded ✅'
      : 'Some environment variables are missing. Restart the dev server after creating/updating .env.local',
    env: envCheck,
  })
}

