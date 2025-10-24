// 🐾🎭🗡️🎸🧠 NEKO DEFENSE DASHBOARD - Personality Workflow API Route
// Fetches personality addition workflow data from ALL 5 MongoDB databases
// Rule 3.15: Dr. Hannibal Lecter + 4-personality system integration

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('⚠️ MONGODB_URI not configured!');
}

interface PersonalityWorkflowData {
  neko: any;
  mario: any;
  noel: any;
  glam: any;
  hannibal: any;
}

// GET /api/personality-workflow
export async function GET(request: Request) {
  if (!MONGODB_URI) {
    return NextResponse.json({
      success: true,
      data: getDemoWorkflowData(),
      message: 'Demo mode - MongoDB not configured'
    });
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    // Fetch from all 5 personality databases
    const nekoDb = client.db('neko-defense-system');
    const marioDb = client.db('marionnette-theater');
    const noelDb = client.db('noel-precision-archives');
    const glamDb = client.db('glam-street-chronicles');
    const hannibalDb = client.db('hannibal-forensic-archives');

    // Query each database for personality-addition-protocol workflow
    const [nekoData, marioData, noelData, glamData, hannibalData] = await Promise.all([
      nekoDb.collection('abilities').findOne({ workflow_id: 'personality-addition-protocol-oct23-2025' }),
      marioDb.collection('performances').findOne({ performance_id: 'personality-addition-theater-oct23' }),
      noelDb.collection('combat-sessions').findOne({ combat_id: 'personality-integration-mission-oct23' }),
      glamDb.collection('street-wisdom').findOne({ wisdom_id: 'personality-addition-street-truth-oct23' }),
      hannibalDb.collection('psychological-profiles').findOne({ profile_id: 'personality-integration-analysis-oct23' })
    ]);

    const workflowData: PersonalityWorkflowData = {
      neko: nekoData,
      mario: marioData,
      noel: noelData,
      glam: glamData,
      hannibal: hannibalData
    };

    return NextResponse.json({
      success: true,
      data: workflowData,
      message: '5-personality workflow data retrieved successfully'
    });

  } catch (error: any) {
    console.error('❌ API Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to fetch personality workflow data'
      },
      { status: 500 }
    );

  } finally {
    await client.close();
  }
}

// Demo data for when MongoDB is not configured
function getDemoWorkflowData(): PersonalityWorkflowData {
  return {
    neko: {
      workflow_id: 'personality-addition-protocol-oct23-2025',
      workflow_name: 'Complete Personality Addition Protocol',
      total_phases: 6,
      total_steps: 24,
      estimated_hours: '3-4 hours',
      neko_comment: 'Nyaa~! This workflow makes adding new personalities super organized, desu~!'
    },
    mario: {
      performance_id: 'personality-addition-theater-oct23',
      title: 'The Grand Personality Integration Performance',
      acts: 6,
      mario_review: 'A MAGNIFICENT theatrical production! Each phase, a new act in our grand play!'
    },
    noel: {
      combat_id: 'personality-integration-mission-oct23',
      mission_status: 'COMPLETE',
      efficiency_rating: 'EXCELLENT',
      noel_assessment: 'Systematic approach. Clear phases. Acceptable execution.'
    },
    glam: {
      wisdom_id: 'personality-addition-street-truth-oct23',
      quote_spanish: 'Oye hermano, este workflow es pura organización bacán, weon.',
      glam_approved: true
    },
    hannibal: {
      profile_id: 'personality-integration-analysis-oct23',
      analysis: 'The methodology exhibits clinical precision. Each phase, carefully dissected. Quite... methodical.',
      hannibal_verdict: 'APPROVED'
    }
  };
}
