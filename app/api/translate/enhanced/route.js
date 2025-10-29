// 🐾 NEKO DEFENSE DASHBOARD - Enhanced Translation API Route
// Next.js API route that proxies to Express backend on port 5001

import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5001';

// POST /api/translate/enhanced - Enhanced translation with quality scoring
export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();

    // Proxy to Express backend
    const response = await fetch(`${BACKEND_URL}/api/translate/enhanced`, {
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
    console.error('❌ Enhanced Translation API Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to perform enhanced translation'
      },
      { status: 500 }
    );
  }
}