import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please add it to your .env.local file.')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please add it to your .env.local file.')
}

// Create the Supabase client
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Export createClient function for consistency with imports
export const createClient = () => supabase

export default supabase 