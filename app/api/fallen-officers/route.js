// 🐾🎖️ NEKO DEFENSE DASHBOARD - Fallen Carabineros Officers API Route
// Next.js API route to fetch all 1,245 fallen Carabineros officers from MongoDB Atlas
// Scraped from Memorial Website - October 20, 2025

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('⚠️ MONGODB_URI not configured!');
}

// GET /api/fallen-officers
export async function GET(request) {
  // Return empty array if MongoDB URI not configured (dev/demo mode)
  if (!MONGODB_URI) {
    return NextResponse.json({
      success: true,
      data: [],
      count: 0,
      message: 'Demo mode - MongoDB not configured'
    });
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    const collection = db.collection('fallen-carabineros-officers');

    // Fetch all fallen officers, sorted by name
    const fallenOfficers = await collection
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: fallenOfficers,
      count: fallenOfficers.length,
      message: `Loaded ${fallenOfficers.length} fallen Carabineros officers`
    });

  } catch (error) {
    console.error('❌ API Error (fallen-officers):', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to fetch fallen officers'
      },
      { status: 500 }
    );

  } finally {
    await client.close();
  }
}
