# Student Placement System - Setup Guide

## Environment Variables Required

You need to set up the following environment variables in your Vercel project. Go to the **Vars** section in the v0 sidebar to add them.

### Required Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Get from: Supabase Dashboard → Settings → API
   - Format: `https://[project-id].supabase.co`
   - This is safe to expose (NEXT_PUBLIC prefix)

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Get from: Supabase Dashboard → Settings → API → `anon public` key
   - This is safe to expose (NEXT_PUBLIC prefix)

3. **SUPABASE_SERVICE_ROLE_KEY** ⚠️ SENSITIVE
   - Get from: Supabase Dashboard → Settings → API → `service_role secret` key
   - ❌ DO NOT add NEXT_PUBLIC_ prefix to this (server-side only)
   - Keep this secret - never expose to client

## Setup Steps

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Get the API keys from Settings → API

### 2. Add Environment Variables
- Open the **Vars** section in v0 sidebar
- Add the three variables above with their values

### 3. Run Database Migrations
- The SQL schema is in `scripts/01-schema.sql`
- The sample data is in `scripts/02-sample-data.sql`
- Execute these scripts in your Supabase SQL editor

### 4. Deploy
- Push to GitHub using the GitHub button in v0
- Deploy to Vercel
- Vercel will automatically use the environment variables

## Key Difference: NEXT_PUBLIC vs Private

- **NEXT_PUBLIC_*** - Safe to expose in browser (API keys for client library)
- **SUPABASE_SERVICE_ROLE_KEY** - Server-only (dangerous if exposed)

The service role key has elevated permissions and should never be exposed to the client.

## Testing

1. **Student Registration**: Go to `/register` and create a test account
2. **Admin Panel**: Create a user with role 'admin' in Supabase to test admin features
3. **Placement**: Add universities and courses, then trigger placement from admin panel

## Troubleshooting

**Error: "Your project's URL and Key are required"**
- Make sure all three env vars are set correctly in Vars section
- Verify no typos in the values

**Error: "Permission denied" on RLS policies**
- Ensure RLS is enabled on all tables in Supabase
- Check that policies are created correctly (they should be after running migration)

**Students can't log in**
- Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Check that the user was created successfully in Supabase Auth
