# Frontend Environment Configuration

Copy the content below to your `.env.local` file in the Frontend directory:

```env
# ==========================================
# SUPABASE CONFIGURATION (Public - safe for browser)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# ==========================================
# SUPABASE CONFIGURATION (Server-side only)
# ==========================================
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ==========================================
# APPLICATION CONFIGURATION
# ==========================================
NEXT_PUBLIC_API_URL=http://localhost:5500
BASE_URL=http://localhost:3000
```

## Variables Removed from Your Current Setup:

### ❌ Firebase Variables (No longer needed):
- All `NEXT_PUBLIC_FIREBASE_*` variables have been replaced with Supabase
- `NEXT_PUBLIC_SECRET_KEY` (encryption now handled by Supabase)

### ✅ Clean Supabase Setup:
- Only 5 environment variables needed for the frontend
- Public Supabase keys are safe for browser exposure
- Service role key is kept for server-side operations only

## Notes:
- Replace `your_supabase_project_url` with your actual Supabase project URL
- Replace `your_supabase_anon_key` with your Supabase anonymous key
- Replace `your_supabase_service_role_key` with your Supabase service role key
- The `NEXT_PUBLIC_API_URL` should point to your backend (currently localhost:5500)
- `BASE_URL` is your frontend URL for redirects and callbacks

## Security:
- Only `NEXT_PUBLIC_*` variables are exposed to the browser
- Service role key remains server-side only
- No sensitive Firebase credentials in client-side code 