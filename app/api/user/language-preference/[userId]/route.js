// 🐾 NEKO DEFENSE DASHBOARD - Get User Language Preference API Route
// Standalone Next.js API route (no Express backend dependency)

import { NextResponse } from 'next/server';

// GET /api/user/language-preference/[userId] - Get language preference for user
export async function GET(request, { params }) {
  try {
    // Next.js 14+ requires awaiting params
    const resolvedParams = await params;
    const { userId } = resolvedParams;

    // For now, return a default language preference
    // TODO: Implement MongoDB storage when user authentication is added
    const defaultPreference = {
      success: true,
      userId: userId,
      language: 'en', // Default to English
      timestamp: new Date().toISOString(),
      message: 'Default language preference (no backend configured)'
    };

    return NextResponse.json(defaultPreference, { status: 200 });

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