// 🐾 NEKO DEFENSE DASHBOARD - User Language Preference API Route
// Next.js API route that proxies to Express backend on port 5001

import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5001';

// POST /api/user/language-preference - Save language preference
export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();

    // Proxy to Express backend
    const response = await fetch(`${BACKEND_URL}/api/user/language-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status
    });

  } catch (error) {
    console.error('❌ Language Preference API Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to save language preference'
      },
      { status: 500 }
    );
  }
}