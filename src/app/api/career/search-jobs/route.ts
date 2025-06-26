import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500').replace(/\/$/, '');

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    
    console.log('🔐 Job Search API Proxy - Authorization header:', authHeader ? 'Present' : 'Missing');
    console.log('🔗 Job Search API Proxy - Backend URL:', `${BACKEND_URL}/api/protected/career/search-jobs`);
    
    if (!authHeader) {
      console.log('❌ Job Search API Proxy - No authorization header');
      return NextResponse.json(
        { success: false, message: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();
    console.log('📤 Job Search API Proxy - Request body:', body);

    // Forward the request to the backend
    console.log('📤 Job Search API Proxy - Forwarding request to backend...');
    const response = await fetch(`${BACKEND_URL}/api/protected/career/search-jobs`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📥 Job Search API Proxy - Backend response status:', response.status);
    
    const data = await response.json();
    console.log('📥 Job Search API Proxy - Backend response data preview:', {
      success: data.success,
      jobCount: data.data?.jobs?.length || 0,
      totalCount: data.data?.totalCount || 0,
      error: data.error
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Job Search API Proxy - Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to search for jobs', 
        error: error.message,
        fallbackMessage: 'Job search temporarily unavailable. Please try searching directly on job sites like Indeed.ca, LinkedIn, or Workopolis.'
      },
      { status: 500 }
    );
  }
} 