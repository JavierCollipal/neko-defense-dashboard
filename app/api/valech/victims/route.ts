/**
 * VALECH 2.0 VICTIMS API
 *
 * Comprehensive victim search, filtering, and CRUD operations
 *
 * Endpoints:
 *   GET /api/valech/victims - List/search victims
 *   POST /api/valech/victims - Create new victim record
 *
 * Created: October 29, 2025
 * By: The Supreme Six (Neko + Mario + Noel + Glam + Hannibal + Tetora)
 */

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const DATABASE_NAME = 'neko-defense-system';
const COLLECTION_NAME = 'valech_victims';

/**
 * GET /api/valech/victims
 *
 * Advanced victim search with multiple filter parameters
 *
 * Query Parameters:
 *   - name: string (fuzzy search on fullName)
 *   - nameExact: boolean (exact match if true)
 *   - detentionCenter: string (filter by detention center name)
 *   - detentionCenterId: string (filter by center ID)
 *   - dateArrestedFrom: ISO date string
 *   - dateArrestedTo: ISO date string
 *   - outcome: SURVIVED | KILLED | DISAPPEARED | UNKNOWN
 *   - gender: MALE | FEMALE | OTHER | UNKNOWN
 *   - profession: string
 *   - politicalAffiliation: string
 *   - perpetratorId: string (filter by associated perpetrator)
 *   - documentationStatus: COMPLETE | PARTIAL | MINIMAL | NEEDS_VERIFICATION
 *   - confidenceLevel: CONFIRMED | PROBABLE | ALLEGED | DISPUTED
 *   - page: number (default 1)
 *   - limit: number (default 50, max 100)
 *   - sortBy: string field name (default: fullName)
 *   - sortOrder: asc | desc (default: asc)
 */
export async function GET(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI);
  const startTime = Date.now();

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Parse query parameters
    const params = request.nextUrl.searchParams;

    // Build MongoDB query
    const query: any = {};

    // Name search (fuzzy or exact)
    if (params.get('name')) {
      const nameValue = params.get('name')!;
      const isExact = params.get('nameExact') === 'true';

      if (isExact) {
        query.fullName = nameValue;
      } else {
        query.fullName = {
          $regex: nameValue,
          $options: 'i'  // Case-insensitive
        };
      }
    }

    // Alternative names search
    if (params.get('alternativeName')) {
      query.alternativeNames = {
        $regex: params.get('alternativeName')!,
        $options: 'i'
      };
    }

    // Detention center filter
    if (params.get('detentionCenter')) {
      query['detentionHistory.detentionCenterName'] = {
        $regex: params.get('detentionCenter')!,
        $options: 'i'
      };
    }

    if (params.get('detentionCenterId')) {
      query['detentionHistory.detentionCenterId'] = params.get('detentionCenterId')!;
    }

    // Date range filter
    if (params.get('dateArrestedFrom') || params.get('dateArrestedTo')) {
      query['detentionHistory.dateArrested'] = {};

      if (params.get('dateArrestedFrom')) {
        query['detentionHistory.dateArrested'].$gte = new Date(params.get('dateArrestedFrom')!);
      }

      if (params.get('dateArrestedTo')) {
        query['detentionHistory.dateArrested'].$lte = new Date(params.get('dateArrestedTo')!);
      }
    }

    // Outcome filter
    if (params.get('outcome')) {
      query.outcome = params.get('outcome')!;
    }

    // Gender filter
    if (params.get('gender')) {
      query.gender = params.get('gender')!;
    }

    // Profession filter
    if (params.get('profession')) {
      query.profession = {
        $regex: params.get('profession')!,
        $options: 'i'
      };
    }

    // Political affiliation filter
    if (params.get('politicalAffiliation')) {
      query.politicalAffiliation = {
        $regex: params.get('politicalAffiliation')!,
        $options: 'i'
      };
    }

    // Documentation status filter
    if (params.get('documentationStatus')) {
      query.documentationStatus = params.get('documentationStatus')!;
    }

    // Confidence level filter
    if (params.get('confidenceLevel')) {
      query.confidenceLevel = params.get('confidenceLevel')!;
    }

    // Public visibility filter (for access control)
    if (params.get('publicOnly') === 'true') {
      query.publicVisibility = 'PUBLIC';
    }

    // Perpetrator cross-reference filter
    if (params.get('perpetratorId')) {
      // This requires a cross-reference lookup
      const crossRefs = await db.collection('valech_cross_references')
        .find({ perpetratorId: params.get('perpetratorId')! })
        .toArray();

      const victimIds = crossRefs.map((ref: any) => ref.victimId);
      query.victimId = { $in: victimIds };
    }

    // Pagination
    const page = parseInt(params.get('page') || '1');
    const limit = Math.min(parseInt(params.get('limit') || '50'), 100);  // Max 100 per page
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = params.get('sortBy') || 'fullName';
    const sortOrder = params.get('sortOrder') === 'desc' ? -1 : 1;
    const sort: any = { [sortBy]: sortOrder };

    // Execute query
    const [victims, totalCount] = await Promise.all([
      collection
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ]);

    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: victims,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      query: query,  // For debugging
      executionTime: `${executionTime}ms`
    });

  } catch (error: any) {
    console.error('[Valech Victims API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: 'VICTIMS_QUERY_FAILED'
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

/**
 * POST /api/valech/victims
 *
 * Create a new victim record
 *
 * Body: ValechVictim object (see types/valech.ts)
 */
export async function POST(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Parse request body
    const body = await request.json() as any;

    // Validate required fields
    const requiredFields = ['victimId', 'fullName', 'outcome'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
          code: 'MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      );
    }

    // Check for duplicate victimId
    const existing = await collection.findOne({ victimId: body.victimId });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Victim with ID "${body.victimId}" already exists`,
          code: 'DUPLICATE_VICTIM_ID'
        },
        { status: 409 }
      );
    }

    // Add metadata
    const now = new Date();
    const victimRecord = {
      ...body,
      createdAt: now,
      lastUpdated: now,
      createdBy: body.createdBy || 'api-user'
    };

    // Insert
    const result = await collection.insertOne(victimRecord);

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: result.insertedId,
          victimId: body.victimId
        },
        message: 'Victim record created successfully'
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('[Valech Victims API] Error creating victim:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: 'VICTIM_CREATION_FAILED'
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
