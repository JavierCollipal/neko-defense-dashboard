// 🐾📝 NEKO DEFENSE - Confession Submission API Route
// Next.js API route to submit new confessions/reports
// All submissions require moderation before publication

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('⚠️ MONGODB_URI not configured!');
}

// POST /api/confessions/submit
export async function POST(request) {
  // Return demo success if MongoDB URI not configured
  if (!MONGODB_URI) {
    return NextResponse.json({
      success: true,
      confession_id: 'demo_' + Date.now(),
      message: 'Demo mode - Confession received but not saved',
      status: 'pending'
    });
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    // Parse request body
    const body = await request.json();

    console.log('📝 [Confessions API] New confession submission received, nyaa~!');

    // Validate required fields
    const requiredFields = ['category', 'title', 'description', 'threat_actor_name'];
    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === '') {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
            message: 'Please fill in all required fields'
          },
          { status: 400 }
        );
      }
    }

    await client.connect();
    const db = client.db('neko-defense-system');

    // Generate unique confession ID
    const confession_id = `confession_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create confession document
    const confession = {
      confession_id,
      category: body.category,
      title: body.title.trim(),
      description: body.description.trim(),
      threat_actor_name: body.threat_actor_name.trim(),
      threat_actor_location: body.threat_actor_location?.trim() || 'Unknown',
      evidence_links: Array.isArray(body.evidence_links) ? body.evidence_links : [],
      submitted_by: body.submitted_by?.trim() || 'Anonymous',
      contact_info: body.contact_info?.trim() || null,
      priority: body.priority || 'medium',
      status: 'pending', // All submissions start as pending
      submitted_at: new Date(),
      views: 0,
      upvotes: 0,
      downvotes: 0,
      moderation_notes: null,
      approved_at: null,
      approved_by: null
    };

    // Insert into MongoDB
    await db.collection('confessions').insertOne(confession);

    console.log(`✅ [Confessions API] Confession submitted: ${confession_id}`);

    return NextResponse.json({
      success: true,
      confession_id,
      message: 'Confession submitted successfully! It will be reviewed before publication.',
      status: 'pending'
    });

  } catch (error) {
    console.error('❌ [Confessions API] Submission failed:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to submit confession'
      },
      { status: 500 }
    );

  } finally {
    await client.close();
  }
}
