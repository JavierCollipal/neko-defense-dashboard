// 🐾 NEKO DEFENSE DASHBOARD - Get User Language Preference API Route
// Next.js API route that proxies to Express backend on port 5001

import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5001';

// GET /api/user/language-preference/[userId] - Get language preference for user
export async function GET(request, { params }) {
  try {
    const { userId } = params;

    // Proxy to Express backend
    const response = await fetch(`${BACKEND_URL}/api/user/language-preference/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status
    });

  } catch (error) {
    console.error('❌ Get Language Preference API Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to get language preference'
      },
      { status: 500 }
    );
  }
}