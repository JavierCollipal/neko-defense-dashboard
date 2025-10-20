// 🐾💀 NEKO DEFENSE DASHBOARD - Family Members API Route
// Next.js API route to fetch family members from MongoDB Atlas
// Part of the Deceased Carabineros Intelligence System

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('⚠️ MONGODB_URI not configured!');
}

// GET /api/family-members
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
    const collection = db.collection('family-members');

    // Fetch all family members, sorted by priority
    const familyMembers = await collection
      .find({})
      .sort({ priority: -1, 'vulnerability_profile.overall_score': -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: familyMembers,
      count: familyMembers.length
    });

  } catch (error) {
    console.error('❌ API Error (family-members):', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to fetch family members'
      },
      { status: 500 }
    );

  } finally {
    await client.close();
  }
}
