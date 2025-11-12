// 🐾 NEKO DEFENSE DASHBOARD - Supported Languages API Route
// Next.js API route that proxies to Express backend on port 5001

import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5001';

// Force dynamic rendering - don't pre-render during build
// This prevents "fetch failed" errors when backend server isn't running during build
export const dynamic = 'force-dynamic';

// GET /api/translate/languages - Get supported languages
export async function GET(request) {
  try {
    // Proxy to Express backend
    const response = await fetch(`${BACKEND_URL}/api/translate/languages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    // Only log errors at runtime, not during build
    if (
      process.env.NODE_ENV !== 'production' ||
      typeof window !== 'undefined'
    ) {
      console.error('❌ Supported Languages API Error:', error.message);
    }
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to get supported languages',
      },
      { status: 500 }
    );
  }
}
