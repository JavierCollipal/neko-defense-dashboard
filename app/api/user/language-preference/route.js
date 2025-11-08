// 🐾 NEKO DEFENSE DASHBOARD - User Language Preference API Route
// Standalone Next.js API route (no Express backend dependency)

import { NextResponse } from 'next/server';

// POST /api/user/language-preference - Save language preference
export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();

    // For now, acknowledge the save request
    // TODO: Implement MongoDB storage when user authentication is added
    const now = new Date();
    const response = {
      success: true,
      data: {
        language: body.language || 'en',
        isDefault: false, // User explicitly set this
        lastUpdated: now.toISOString(),
      },
      userId: body.userId || 'current-user',
      timestamp: now.toISOString(),
      message:
        'Language preference saved (in-memory only, no backend configured)',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('❌ Language Preference API Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to save language preference',
      },
      { status: 500 }
    );
  }
}
