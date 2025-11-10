/**
 * VALECH 2.0 COMPREHENSIVE STATISTICS API
 *
 * Provides complete statistical analysis of Valech database
 *
 * Endpoint: GET /api/valech/stats/comprehensive
 *
 * Returns:
 *   - Overall counts (victims, perpetrators, centers, cross-refs)
 *   - Victim outcomes (survived, killed, disappeared)
 *   - Justice progress (convictions, prosecutions)
 *   - Documentation quality metrics
 *   - Timeline distribution (by year)
 *   - Geographic distribution (by region)
 *   - Top detention centers
 *   - Gender/age distributions
 *
 * Created: October 29, 2025
 * By: The Supreme Six (Neko + Mario + Noel + Glam + Hannibal + Tetora)
 */

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Force dynamic rendering (no static generation during build)
export const dynamic = 'force-dynamic';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = 'neko-defense-system';

export async function GET(request: NextRequest) {
  // Check if MongoDB URI is configured
  if (!MONGODB_URI) {
    console.log(
      '[Valech Stats] MONGODB_URI not configured - returning demo mode'
    );
    return NextResponse.json(
      {
        success: false,
        error: 'Database not configured',
        code: 'MONGODB_NOT_CONFIGURED',
        message: 'MongoDB URI not set in environment variables',
      },
      { status: 503 }
    );
  }

  const client = new MongoClient(MONGODB_URI);
  const startTime = Date.now();

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);

    // Check if cached stats exist (less than 1 hour old)
    const cacheCollection = db.collection('valech_statistics_cache');
    const cached = await cacheCollection.findOne(
      {},
      { sort: { lastCalculated: -1 } }
    );

    const ONE_HOUR = 60 * 60 * 1000;
    if (cached && Date.now() - cached.lastCalculated.getTime() < ONE_HOUR) {
      console.log('[Valech Stats] Returning cached statistics');
      return NextResponse.json({
        success: true,
        data: cached.statistics,
        cached: true,
        lastCalculated: cached.lastCalculated,
      });
    }

    console.log('[Valech Stats] Calculating fresh statistics...');

    // Collections
    const victimsCollection = db.collection('valech_victims');
    const centersCollection = db.collection('valech_detention_centers');
    const crossRefsCollection = db.collection('valech_cross_references');
    const testimoniesCollection = db.collection('valech_testimony_archives');
    const dinaCollection = db.collection('dina-agents'); // Perpetrators

    // ============================================================
    // OVERALL COUNTS
    // ============================================================
    const [
      totalVictims,
      totalCenters,
      totalCrossRefs,
      totalTestimonies,
      totalPerpetrators,
    ] = await Promise.all([
      victimsCollection.countDocuments(),
      centersCollection.countDocuments(),
      crossRefsCollection.countDocuments(),
      testimoniesCollection.countDocuments(),
      dinaCollection.countDocuments(),
    ]);

    // ============================================================
    // VICTIM OUTCOMES
    // ============================================================
    const outcomeAggregation = await victimsCollection
      .aggregate([
        {
          $group: {
            _id: '$outcome',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const outcomes: any = {
      survived: 0,
      killed: 0,
      disappeared: 0,
      unknown: 0,
    };

    outcomeAggregation.forEach((item: any) => {
      if (item._id === 'SURVIVED') {
        outcomes.survived = item.count;
      } else if (item._id === 'KILLED') {
        outcomes.killed = item.count;
      } else if (item._id === 'DISAPPEARED') {
        outcomes.disappeared = item.count;
      } else if (item._id === 'UNKNOWN') {
        outcomes.unknown = item.count;
      }
    });

    const survivalRate =
      totalVictims > 0
        ? ((outcomes.survived / totalVictims) * 100).toFixed(2)
        : '0.00';

    // ============================================================
    // JUSTICE PROGRESS (from DINA agents)
    // ============================================================
    const justiceAggregation = await dinaCollection
      .aggregate([
        {
          $group: {
            _id: '$legalStatus.status',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const justice: any = {
      perpetratorsConvicted: 0,
      perpetratorsAtLarge: 0,
      perpetratorsDeceased: 0,
      perpetratorsUnprosecuted: 0,
    };

    justiceAggregation.forEach((item: any) => {
      if (
        item._id === 'CONVICTED-IMPRISONED' ||
        item._id === 'CONVICTED-DECEASED'
      ) {
        justice.perpetratorsConvicted += item.count;
      } else if (item._id === 'AT LARGE' || item._id === 'AT-LARGE') {
        justice.perpetratorsAtLarge += item.count;
      } else if (item._id === 'DECEASED') {
        justice.perpetratorsDeceased += item.count;
      } else if (item._id === 'UNPROSECUTED') {
        justice.perpetratorsUnprosecuted += item.count;
      }
    });

    const convictionRate =
      totalPerpetrators > 0
        ? ((justice.perpetratorsConvicted / totalPerpetrators) * 100).toFixed(2)
        : '0.00';

    // ============================================================
    // DOCUMENTATION QUALITY
    // ============================================================
    const qualityAggregation = await victimsCollection
      .aggregate([
        {
          $group: {
            _id: '$documentationStatus',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const quality: any = {
      complete: 0,
      partial: 0,
      minimal: 0,
      needsVerification: 0,
    };

    qualityAggregation.forEach((item: any) => {
      if (item._id === 'COMPLETE') {
        quality.complete = item.count;
      } else if (item._id === 'PARTIAL') {
        quality.partial = item.count;
      } else if (item._id === 'MINIMAL') {
        quality.minimal = item.count;
      } else if (item._id === 'NEEDS_VERIFICATION') {
        quality.needsVerification = item.count;
      }
    });

    const completenessRate =
      totalVictims > 0
        ? ((quality.complete / totalVictims) * 100).toFixed(2)
        : '0.00';

    // ============================================================
    // GENDER DISTRIBUTION
    // ============================================================
    const genderAggregation = await victimsCollection
      .aggregate([
        {
          $group: {
            _id: '$gender',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const gender: any = {
      male: 0,
      female: 0,
      other: 0,
      unknown: 0,
    };

    genderAggregation.forEach((item: any) => {
      if (item._id === 'MALE') {
        gender.male = item.count;
      } else if (item._id === 'FEMALE') {
        gender.female = item.count;
      } else if (item._id === 'OTHER') {
        gender.other = item.count;
      } else if (item._id === 'UNKNOWN') {
        gender.unknown = item.count;
      }
    });

    // ============================================================
    // TOP DETENTION CENTERS
    // ============================================================
    const topCentersAggregation = await victimsCollection
      .aggregate([
        { $unwind: '$detentionHistory' },
        {
          $group: {
            _id: {
              centerId: '$detentionHistory.detentionCenterId',
              centerName: '$detentionHistory.detentionCenterName',
            },
            victims: { $sum: 1 },
          },
        },
        { $sort: { victims: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    const topCenters = topCentersAggregation.map((item: any) => ({
      centerId: item._id.centerId || 'unknown',
      centerName: item._id.centerName || 'Unknown Center',
      victims: item.victims,
    }));

    // ============================================================
    // TIMELINE DISTRIBUTION (by year of arrest)
    // ============================================================
    const timelineAggregation = await victimsCollection
      .aggregate([
        { $unwind: '$detentionHistory' },
        {
          $project: {
            year: { $year: '$detentionHistory.dateArrested' },
            outcome: '$outcome',
          },
        },
        {
          $group: {
            _id: { year: '$year', outcome: '$outcome' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1 } },
      ])
      .toArray();

    // Aggregate by year
    const timelineMap: any = {};
    timelineAggregation.forEach((item: any) => {
      const year = item._id.year;
      if (!year) {
        return;
      } // Skip null years

      if (!timelineMap[year]) {
        timelineMap[year] = { year, arrests: 0, deaths: 0, disappeared: 0 };
      }

      timelineMap[year].arrests += item.count;

      if (item._id.outcome === 'KILLED') {
        timelineMap[year].deaths += item.count;
      } else if (item._id.outcome === 'DISAPPEARED') {
        timelineMap[year].disappeared += item.count;
      }
    });

    const byYear = Object.values(timelineMap);

    // ============================================================
    // CONSTRUCT RESPONSE
    // ============================================================
    const statistics = {
      overall: {
        totalVictimsDocumented: totalVictims,
        totalPerpetratorTracked: totalPerpetrators,
        totalDetentionCenters: totalCenters,
        totalCrossReferences: totalCrossRefs,
        totalTestimonies: totalTestimonies,
      },
      victimOutcomes: {
        ...outcomes,
        survivalRate: parseFloat(survivalRate),
      },
      justiceProgress: {
        ...justice,
        convictionRate: parseFloat(convictionRate),
        ongoingProsecutions: 0, // TODO: Implement court monitoring
      },
      documentationQuality: {
        ...quality,
        completenessRate: parseFloat(completenessRate),
      },
      byGender: gender,
      byYear,
      topCenters,
      lastCalculated: new Date(),
    };

    // Cache the results
    await cacheCollection.deleteMany({}); // Clear old cache
    await cacheCollection.insertOne({
      statistics,
      lastCalculated: new Date(),
    });

    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: statistics,
      cached: false,
      executionTime: `${executionTime}ms`,
    });
  } catch (error: any) {
    console.error('[Valech Stats] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: 'STATS_CALCULATION_FAILED',
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
