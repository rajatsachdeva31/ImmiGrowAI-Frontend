import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

 
const publicRoutes = ['/', '/login', '/signup']
 
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
 
  const endpoint = process.env.NEXT_PUBLIC_API_URL;
 
  try {
    const cookies = request.cookies
    const tokenResponse = await fetch(`${endpoint}auth/token`, {
      credentials: 'include',
      headers: {
        Cookie: cookies.toString(),
      },
    })
 
    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
 
    const tokenData = await tokenResponse.json()
    const token = tokenData.token
 
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const roleName = tokenData.roleName.split(" ").join("");
    const allowedRoutes = roleBasedAccess[roleName] || []
 
    // Check if user is allowed to access this route
    const isAllowed = allowedRoutes.some(route => pathname.startsWith(route))
 
    if (!isAllowed) {
      return NextResponse.redirect(new URL('/unauthorized', request.url)) // or any fallback route
    }
 
    // Add token to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${token}`)
 
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
 
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
  ],
}