import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server client for use in Server Components and API routes
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// Service client for admin operations (use sparingly)
export const createServiceSupabaseClient = () => {
  return createServerClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get() {
        return undefined
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
} 