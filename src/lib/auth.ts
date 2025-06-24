import { cookies } from 'next/headers'

export async function getSession() {
  const endpoint = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    const cookieHeader = await cookies()
    const tokenResponse = await fetch(`${endpoint}auth/token`, {
      credentials: 'include',
      headers: {
        Cookie: cookieHeader.toString()
      }
    })
    
    if (!tokenResponse.ok) {
      return null
    }

    const tokenData = await tokenResponse.json()
    return tokenData.token ? { token: tokenData.token } : null
  } catch {
    return null
  }
}