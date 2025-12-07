# Setting Up the Project on a New Machine

Complete guide to get the project running locally from scratch.

## Prerequisites

1. **Git** (already installed ✅)
2. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Or use a version manager like `nvm`

## Step-by-Step Setup

### Step 1: Clone the Repository

```bash
# Navigate to where you want the project
cd ~/Documents  # or any directory you prefer

# Clone the repository
git clone https://github.com/JastinAG/MIS4001.git

# Navigate into the project directory
cd MIS4001
```

### Step 2: Install Node.js (if not already installed)

**Check if Node.js is installed:**
```bash
node --version
npm --version
```

**If not installed:**
- **Windows**: Download from https://nodejs.org/ (install LTS version)
- **Mac**: 
  ```bash
  # Using Homebrew
  brew install node
  ```
- **Linux**:
  ```bash
  # Ubuntu/Debian
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

### Step 3: Install Project Dependencies

```bash
# Install all required packages
npm install --legacy-peer-deps
```

**Note**: The `--legacy-peer-deps` flag is needed due to some dependency conflicts. This is normal.

### Step 4: Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# Windows (PowerShell)
New-Item -Path .env.local -ItemType File

# Mac/Linux
touch .env.local
```

**Add these environment variables to `.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xybnqhsqlaaocqibqhbn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjUxMTgsImV4cCI6MjA4MDA0MTExOH0.TC8NYtT0h3cx9ZZtvQBy9JcT0yHD-daiXm9MMo8zBR4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Ym5xaHNxbGFhb2NxaWJxaGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQ2NTExOCwiZXhwIjoyMDgwMDQxMTE4fQ.x6nE8dxJ2KsmDllZxHlq_A_yfk_pKmtg0jgpSj2IiZU
```

**Important:**
- No quotes around values
- No spaces around `=`
- Save as UTF-8 encoding (not Word format)

### Step 5: Set Up Supabase Database (One-time setup)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Run these scripts in order:

   **a) Main Schema:**
   - Open `scripts/01-schema.sql`
   - Copy and paste into SQL Editor
   - Click "Run"

   **b) Sample Data (optional):**
   - Open `scripts/02-sample-data.sql`
   - Copy and paste into SQL Editor
   - Click "Run"

   **c) RLS Policies:**
   - Open `scripts/03-add-missing-rls-policies.sql`
   - Copy and paste into SQL Editor
   - Click "Run"

   **d) Fix Placements RLS:**
   - Open `scripts/07-fix-placements-rls.sql`
   - Copy and paste into SQL Editor
   - Click "Run"

### Step 6: Run the Development Server

```bash
# Start the development server
npm run dev
```

The app will be available at: **http://localhost:3000**

### Step 7: Verify Everything Works

1. **Check environment variables:**
   - Visit: http://localhost:3000/api/check-env
   - Should show all variables as `true`

2. **Test the app:**
   - Visit: http://localhost:3000
   - Try registering a new account
   - Try logging in

## Quick Command Reference

```bash
# Clone repository
git clone https://github.com/JastinAG/MIS4001.git
cd MIS4001

# Install dependencies
npm install --legacy-peer-deps

# Create .env.local file (then add the environment variables manually)
# Windows: notepad .env.local
# Mac/Linux: nano .env.local

# Run development server
npm run dev

# Build for production (optional)
npm run build

# Start production server (optional)
npm start
```

## Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # Mac/Linux
Remove-Item -Recurse -Force node_modules, package-lock.json  # Windows PowerShell

# Try installing again
npm install --legacy-peer-deps
```

### Issue: Environment variables not loading

**Solution:**
```bash
# Delete .next folder
rm -rf .next  # Mac/Linux
Remove-Item -Recurse -Force .next  # Windows PowerShell

# Restart the dev server
npm run dev
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Use a different port
PORT=3001 npm run dev

# Or kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### Issue: Database connection errors

**Solution:**
1. Verify `.env.local` has all three variables
2. Check Supabase project is active
3. Verify database schema is set up (run SQL scripts)
4. Check Supabase dashboard for any service issues

## Project Structure

```
student-placement-system/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── dashboard/         # Student dashboard
│   └── login/             # Login page
├── components/            # React components
├── contexts/              # React contexts (auth, student)
├── lib/                   # Utility libraries
├── scripts/               # SQL scripts for database
├── .env.local            # Environment variables (create this)
├── package.json          # Dependencies
└── README.md             # Project documentation
```

## Next Steps After Setup

1. ✅ Database is set up
2. ✅ Environment variables are configured
3. ✅ App is running locally
4. Create an admin user (see `CREATE_ADMIN.md`)
5. Test the full workflow:
   - Register as a student
   - View grades
   - Select courses
   - Accept admission

## Need Help?

- Check `DEPLOY_VERCEL.md` for deployment info
- Check `CREATE_ADMIN.md` for admin setup
- Check `TESTING_GUIDE.md` for testing procedures

