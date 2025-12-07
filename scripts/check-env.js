// Quick script to verify environment variables are loaded
// Run: node scripts/check-env.js

require('dotenv').config({ path: '.env.local' })

console.log('\n=== Environment Variables Check ===\n')

const checks = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
}

let allPass = true

for (const [key, value] of Object.entries(checks)) {
  const exists = !!value
  const length = value?.length || 0
  const status = exists ? '✅' : '❌'
  
  console.log(`${status} ${key}`)
  if (exists) {
    console.log(`   Length: ${length} characters`)
    console.log(`   Preview: ${value?.substring(0, 30)}...`)
  } else {
    console.log(`   ❌ NOT FOUND`)
    allPass = false
  }
  console.log()
}

if (allPass) {
  console.log('✅ All environment variables are set!')
  console.log('\n⚠️  Remember: Restart your dev server (npm run dev) for Next.js to load these variables.\n')
} else {
  console.log('❌ Some environment variables are missing!')
  console.log('\nMake sure .env.local exists in the project root with all required variables.\n')
}

process.exit(allPass ? 0 : 1)

