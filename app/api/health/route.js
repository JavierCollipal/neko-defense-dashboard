// 🐾 NEKO DEFENSE DASHBOARD - Health Check API Route
// Simple health check endpoint

import { NextResponse } from 'next/server';

// GET /api/health
export async function GET(request) {
  return NextResponse.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Neko Defense Dashboard API is running, nyaa~! 🐾⚡'
  });
}
