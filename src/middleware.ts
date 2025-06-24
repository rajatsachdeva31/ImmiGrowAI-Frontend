import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const publicRoutes = ['/', '/login', '/signup', '/auth/callback']

// Define role-based access control
const roleBasedAccess = {
  Admin: ['/dashboard/admin'],
  Immigrant: ['/dashboard/user'],
  Realtor: ['/dashboard/realtor'],
  CarDealership: ['/dashboard/car-dealer'],
  ImmigrationConsultant: ['/dashboard/consultant'],
  Onboarding: ['/onboarding'],
  NotVerified: ['/dashboard/not-verified']
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  try {
    const response = NextResponse.next()
    
    // Create Supabase client for middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            response.cookies.set(name, value, options)
          },
          remove(name: string, options: any) {
            response.cookies.set(name, '', { ...options, maxAge: 0 })
          },
        },
      }
    )
    
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('users')
      .select(`
        *,
        role:roles(*)
      `)
      .eq('email', session.user.email)
      .single()

    if (!profile || !profile.role) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    const roleName = profile.role.name.split(" ").join("")
    const allowedRoutes = roleBasedAccess[roleName] || []

    // Check if user is allowed to access this route
    const isAllowed = allowedRoutes.some(route => pathname.startsWith(route))

    if (!isAllowed) {
      // Redirect to appropriate dashboard based on role
      const userDashboard = allowedRoutes[0] || '/dashboard/user'
      return NextResponse.redirect(new URL(userDashboard, request.url))
    }

    // Add token to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${session.access_token}`)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
  ],
}