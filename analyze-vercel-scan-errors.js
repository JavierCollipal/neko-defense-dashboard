#!/usr/bin/env node

/**
 * 🔍 ANALYZE VERCEL SCAN ERRORS
 *
 * Queries MongoDB Atlas for the latest Puppeteer scan errors
 * and generates a detailed analysis report
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI not set!');
  process.exit(1);
}

async function analyzeErrors() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('🐾 Connected to MongoDB Atlas, nyaa~!\n');

    const db = client.db('neko-defense-system');
    const collection = db.collection('puppeteer-error-collections');
    const summaryCollection = db.collection('puppeteer-session-summaries');

    // Get latest session
    const latestSession = await summaryCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    if (latestSession.length === 0) {
      console.log('⚠️  No scan sessions found!');
      return;
    }

    const session = latestSession[0];
    console.log('📊 LATEST SCAN SESSION');
    console.log('════════════════════════════════════════════════════════════');
    console.log(`🆔 Session ID: ${session.session_id}`);
    console.log(`⏰ Timestamp: ${session.timestamp}`);
    console.log(`🎯 Target: ${session.target_url || 'N/A'}`);
    console.log(`📋 Routes Tested: ${session.routes_tested}`);
    console.log(`🔢 Total Errors: ${session.total_errors}`);
    console.log('════════════════════════════════════════════════════════════\n');

    // Get all errors for this session
    const errors = await collection
      .find({ session_id: session.session_id })
      .sort({ timestamp: 1 })
      .toArray();

    console.log(`📦 FOUND ${errors.length} ERRORS\n`);

    // Analyze by error type
    const errorTypes = {};
    const failedRequests = [];
    const consoleErrors = [];
    const jsExceptions = [];

    errors.forEach(error => {
      errorTypes[error.error_type] = (errorTypes[error.error_type] || 0) + 1;

      if (error.error_type === 'failed_request') {
        failedRequests.push({
          status: error.http_status,
          url: error.url,
          route: error.context.route
        });
      } else if (error.error_type === 'console_error') {
        consoleErrors.push({
          type: error.console_type,
          message: error.message,
          route: error.context.route
        });
      } else if (error.error_type === 'javascript_exception') {
        jsExceptions.push({
          message: error.message,
          route: error.context.route
        });
      }
    });

    // Print error type breakdown
    console.log('🔢 ERROR TYPE BREAKDOWN');
    console.log('────────────────────────────────────────────────────────────');
    Object.entries(errorTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
    console.log('');

    // Analyze failed requests
    if (failedRequests.length > 0) {
      console.log('\n⚠️  FAILED HTTP REQUESTS');
      console.log('════════════════════════════════════════════════════════════');

      // Group by status code
      const statusCodes = {};
      failedRequests.forEach(req => {
        statusCodes[req.status] = (statusCodes[req.status] || 0) + 1;
      });

      console.log('\n📊 Status Code Summary:');
      Object.entries(statusCodes).forEach(([status, count]) => {
        console.log(`   HTTP ${status}: ${count} requests`);
      });

      // Show unique failed URLs
      const uniqueUrls = [...new Set(failedRequests.map(r => r.url))];
      console.log('\n🔗 Failed URLs:');
      uniqueUrls.slice(0, 10).forEach(url => {
        console.log(`   - ${url}`);
      });

      // Show which routes have issues
      const routesWithErrors = {};
      failedRequests.forEach(req => {
        routesWithErrors[req.route] = (routesWithErrors[req.route] || 0) + 1;
      });

      console.log('\n📍 Errors by Route:');
      Object.entries(routesWithErrors).forEach(([route, count]) => {
        console.log(`   ${route}: ${count} failed requests`);
      });
    }

    // Analyze console errors
    if (consoleErrors.length > 0) {
      console.log('\n\n❌ CONSOLE ERRORS');
      console.log('════════════════════════════════════════════════════════════');

      // Get unique error messages
      const uniqueMessages = [...new Set(consoleErrors.map(e => e.message))];
      console.log(`\n📝 ${uniqueMessages.length} Unique Error Messages:\n`);

      uniqueMessages.slice(0, 10).forEach((msg, i) => {
        const count = consoleErrors.filter(e => e.message === msg).length;
        console.log(`${i + 1}. [${count}x] ${msg.substring(0, 120)}${msg.length > 120 ? '...' : ''}`);
      });
    }

    // Analyze JS exceptions
    if (jsExceptions.length > 0) {
      console.log('\n\n🚨 JAVASCRIPT EXCEPTIONS');
      console.log('════════════════════════════════════════════════════════════');

      const uniqueExceptions = [...new Set(jsExceptions.map(e => e.message))];
      console.log(`\n📝 ${uniqueExceptions.length} Unique Exception Messages:\n`);

      uniqueExceptions.forEach((msg, i) => {
        const count = jsExceptions.filter(e => e.message === msg).length;
        console.log(`${i + 1}. [${count}x] ${msg}`);
      });
    }

    // ROOT CAUSE ANALYSIS
    console.log('\n\n🎯 ROOT CAUSE ANALYSIS');
    console.log('════════════════════════════════════════════════════════════');

    // Check for 401 errors (authentication issues)
    const has401 = failedRequests.some(r => r.status === 401);
    if (has401) {
      console.log('\n⚠️  CRITICAL: HTTP 401 Unauthorized Errors Detected');
      console.log('   ⮕ Frontend is making API calls without authentication');
      console.log('   ⮕ Possible causes:');
      console.log('      - Missing or invalid JWT token');
      console.log('      - Backend API not configured on Vercel');
      console.log('      - CORS or authentication middleware issue');
      console.log('      - Environment variables not set on Vercel');
    }

    // Check for 403 errors
    const has403 = failedRequests.some(r => r.status === 403);
    if (has403) {
      console.log('\n⚠️  HTTP 403 Forbidden Errors Detected');
      console.log('   ⮕ Resource access is denied');
      console.log('   ⮕ Check Vercel API permissions');
    }

    // Check for scanner bugs
    const hasScannerBug = jsExceptions.some(e => e.message.includes('waitForTimeout'));
    if (hasScannerBug) {
      console.log('\n⚠️  Scanner Bug Detected (ALREADY FIXED!)');
      console.log('   ⮕ waitForTimeout() method deprecated in Puppeteer');
      console.log('   ✅ Fixed: Replaced with setTimeout()');
    }

    console.log('\n\n💡 RECOMMENDED ACTIONS');
    console.log('════════════════════════════════════════════════════════════');
    console.log('\n1. Fix Frontend-API Integration:');
    console.log('   - Check if GraphQL API endpoint is configured on Vercel');
    console.log('   - Verify REACT_APP_GRAPHQL_URL environment variable');
    console.log('   - Ensure backend API is deployed and accessible');
    console.log('\n2. Fix Authentication:');
    console.log('   - Check if API requires authentication');
    console.log('   - Implement token handling on frontend');
    console.log('   - Configure CORS settings properly');
    console.log('\n3. Re-run Scanner:');
    console.log('   - After fixes, run scanner again to verify');
    console.log('   - Expected: 0 errors on all routes');

    console.log('\n════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('🐾 Connection closed, desu~!\n');
  }
}

analyzeErrors().catch(console.error);
