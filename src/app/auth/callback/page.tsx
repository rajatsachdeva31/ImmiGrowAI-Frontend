'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FaSpinner } from 'react-icons/fa'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()
      
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/login?error=callback-failed')
          return
        }

        if (data.session && data.session.user) {
          // Check if user exists in our database
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select(`
              *,
              role:roles(*)
            `)
            .eq('email', data.session.user.email)
            .single()

          if (profileError || !profile) {
            // User needs onboarding
            router.push('/onboarding')
            return
          }

          if (!profile.user_verified) {
            router.push('/dashboard/not-verified?reason=user')
            return
          }

          // Route based on role
          if (profile.role?.name === "Car Dealership") {
            router.push("/dashboard/car-dealer")
          } else if (profile.role?.name === "Immigrant") {
            router.push("/dashboard/user")
          } else if (profile.role?.name === "Realtor") {
            router.push("/dashboard/realtor")
          } else if (profile.role?.name === "Immigration Consultant") {
            router.push("/dashboard/consultant")
          } else if (profile.role?.name === "Admin") {
            router.push("/dashboard/admin")
          } else {
            router.push("/dashboard")
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login?error=callback-failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <FaSpinner className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  )
} 