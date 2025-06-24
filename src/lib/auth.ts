import { createClient } from './supabase/client'

export async function getSession() {
  try {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return null
    }

    return {
      user: session.user,
      token: session.access_token,
      expires_at: session.expires_at
    }
  } catch {
    return null
  }
}

export async function getUserProfile() {
  try {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return null
    }

    // Get user profile from our database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select(`
        *,
        role:roles(*)
      `)
      .eq('email', user.email)
      .single()

    if (profileError) {
      return { 
        user, 
        profile: null 
      }
    }

    return { 
      user, 
      profile 
    }
  } catch {
    return null
  }
}