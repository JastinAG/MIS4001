# How to Create a Super Admin User

## Method 1: Create Admin via Supabase Dashboard (Recommended)

### Step 1: Create Auth User
1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication → Users**
3. Click **"Add User"** or **"Invite User"**
4. Fill in:
   - **Email**: `admin@yourdomain.com` (or your preferred admin email)
   - **Password**: Set a strong password
   - **Auto Confirm User**: ✅ Check this box
5. Click **"Create User"**

### Step 2: Add User Record with Admin Role
1. Go to **Table Editor → `users`**
2. Click **"Insert" → "Insert row"**
3. Fill in:
   - **id**: Copy the UUID from the auth user you just created (from Authentication → Users)
   - **email**: Same email you used in Step 1
   - **role**: `admin`
4. Click **"Save"**

### Step 3: Test Login
1. Go to your app's login page: `/login`
2. Select **"Admin"** from the role dropdown
3. Enter the email and password you created
4. You should be redirected to `/admin` dashboard

## Method 2: Create Admin via SQL Script

### Step 1: Create Auth User in Supabase
1. Go to **Supabase Dashboard → Authentication → Users**
2. Create a new user with email and password
3. **Copy the user's UUID** (you'll need it for the SQL)

### Step 2: Run SQL Script
1. Go to **Supabase Dashboard → SQL Editor**
2. Run this script (replace with your values):

```sql
-- Replace 'your-admin-email@example.com' with your admin email
-- Replace 'your-user-uuid-here' with the UUID from Step 1
INSERT INTO users (id, email, role)
VALUES (
  'your-user-uuid-here',
  'your-admin-email@example.com',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## Method 3: Convert Existing User to Admin

If you already have a user account and want to make it an admin:

1. Go to **Supabase Dashboard → Table Editor → `users`**
2. Find the user you want to make admin
3. Click on the row to edit
4. Change **role** from `student` to `admin`
5. Click **"Save"**

Or run this SQL (replace the email):

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Method 4: Create Admin via Signup API (Programmatic)

You can also create an admin by calling the signup API with `role: 'admin'`:

```javascript
// This would need to be done via API call or modified signup form
fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'secure-password',
    role: 'admin'
  })
})
```

**Note**: Currently the signup route accepts `role` parameter, but it defaults to 'student'. You may need to modify the signup form or use the API directly.

## Verify Admin Access

After creating the admin user:

1. **Log out** if you're currently logged in
2. Go to `/login`
3. Select **"Admin"** from the role dropdown
4. Enter your admin credentials
5. You should be redirected to `/admin` dashboard
6. You should see:
   - Admin dashboard with statistics
   - Access to `/admin/students` (view all students)
   - Access to `/admin/universities` (add/manage universities)

## Admin Capabilities

Once you have admin access, you can:

- ✅ View all students at `/admin/students`
- ✅ View dashboard statistics at `/admin`
- ✅ Add universities at `/admin/universities`
- ✅ Add courses to universities
- ✅ View university-wise admission statistics

## Troubleshooting

### "Access denied" error
- Make sure the `role` in the `users` table is exactly `'admin'` (lowercase)
- Verify you selected "Admin" in the login dropdown
- Check that the user exists in both `auth.users` and `users` table

### Can't see admin dashboard
- Verify the user's role is `'admin'` in the `users` table
- Check browser console for errors
- Make sure you selected "Admin" role when logging in

### User not found
- Ensure the user exists in `auth.users` (Supabase Authentication)
- Ensure the user has a corresponding record in `users` table
- The `id` in `users` table must match the `id` in `auth.users`

