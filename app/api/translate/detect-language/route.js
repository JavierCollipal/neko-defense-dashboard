// 🐾 NEKO DEFENSE DASHBOARD - Language Detection API Route
// Next.js API route that proxies to Express backend on port 5001

import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5001';

// POST /api/translate/detect-language - Detect language of text
export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();

    // Proxy to Express backend
    const response = await fetch(`${BACKEND_URL}/api/translate/detect-language`, {
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
    console.error('❌ Language Detection API Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to detect language'
      },
      { status: 500 }
    );
  }
}