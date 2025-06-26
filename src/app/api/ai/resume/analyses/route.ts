import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500').replace(/\/$/, '');

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    
    console.log('🔐 API Proxy - Authorization header:', authHeader ? 'Present' : 'Missing');
    console.log('🔗 API Proxy - Backend URL:', `${BACKEND_URL}/api/protected/ai-local/resume/analyses`);
    
    if (!authHeader) {
      console.log('❌ API Proxy - No authorization header');
      return NextResponse.json(
        { success: false, message: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Forward the request to the backend with the correct route
    console.log('📤 API Proxy - Forwarding request to backend...');
    const response = await fetch(`${BACKEND_URL}/api/protected/ai-local/resume/analyses`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 API Proxy - Backend response status:', response.status);
    console.log('📥 API Proxy - Backend response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('📥 API Proxy - Backend response data:', data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ API Proxy - Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resume analyses', error: error.message },
      { status: 500 }
    );
  }
} 