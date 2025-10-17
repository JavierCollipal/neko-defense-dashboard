#!/usr/bin/env node
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pinochito1747:pinochito1747@free-cluster.svjei3w.mongodb.net/';
const DATABASE_NAME = 'neko-defense-system';

async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas!');

    const db = client.db(DATABASE_NAME);

    // Ability Document
    const ability = {
      ability_id: 'cypress-cloud-integration-mastery',
      name: 'Cypress Cloud Integration Mastery',
      category: 'CI/CD & Test Infrastructure',
      tier: 'intermediate',
      description: 'Master ability to connect local Cypress E2E tests with Cypress Cloud for test recording, analytics, and team collaboration',
      skills_included: [
        'Setting up Cypress Cloud account and project',
        'Configuring projectId in cypress.config.js',
        'Managing record keys securely',
        'Running tests with cloud recording',
        'Viewing test results in Cypress Cloud dashboard',
        'Debugging failed test runs with screenshots and videos',
        'Setting up CI/CD pipeline integration',
        'Understanding Cypress Cloud pricing and limits'
      ],
      prerequisites: [
        'Cypress installed locally',
        'Cypress Cloud account (free tier available)',
        'Valid project with record key',
        'Internet connection for cloud uploads'
      ],
      common_errors: [
        {
          error: 'This project has not been setup to record',
          cause: 'Missing projectId in cypress.config.js',
          solution: 'Add projectId to the root of cypress.config.js'
        },
        {
          error: 'Your Record Key is not valid with this projectId',
          cause: 'Record key does not match the projectId',
          solution: 'Ensure BOTH projectId and record key are from the SAME Cypress Cloud project'
        }
      ],
      difficulty: 'intermediate',
      time_to_complete: '10-15 minutes',
      timestamp: new Date()
    };

    await db.collection('abilities').insertOne(ability);
    console.log('✅ Ability saved!');

    // Case Pattern Document
    const casePattern = {
      pattern_id: 'cypress-cloud-local-connection',
      title: 'Connecting Cypress Cloud to Local Development',
      category: 'Testing Infrastructure',
      problem_type: 'Setup & Configuration',
      problem: {
        description: 'Need to connect local Cypress E2E tests to Cypress Cloud for recording results and sharing with team',
        common_questions: [
          'How do I connect my Cypress tests to the cloud?',
          'What is a projectId and where do I get it?',
          'What is a record key and how do I use it?',
          'Why is my record key not working?'
        ]
      },
      solution: {
        overview: 'Set up Cypress Cloud account, get projectId and record key, configure local project, run tests with --record flag',
        quick_start: {
          step1: 'Create account at https://cloud.cypress.io',
          step2: 'Create new project in Cypress Cloud dashboard',
          step3: 'Copy projectId and add to cypress.config.js',
          step4: 'Copy record key (keep secret!)',
          step5: 'Run: npx cypress run --record --key YOUR_KEY',
          step6: 'View results at provided dashboard URL'
        }
      },
      difficulty: 'intermediate',
      time_to_complete: '10-15 minutes',
      reusability: 'very-high',
      tags: ['cypress', 'cloud', 'testing', 'ci-cd', 'setup', 'integration'],
      timestamp: new Date()
    };

    await db.collection('case-patterns').insertOne(casePattern);
    console.log('✅ Case Pattern saved!');

    // Session Document
    const session = {
      session_id: 'cypress-cloud-setup-oct17-2025',
      title: 'Cypress Cloud Integration Setup',
      date: new Date('2025-10-17'),
      category: 'testing-infrastructure',
      tags: ['cypress', 'cloud', 'setup', 'ci-cd', 'test-recording'],
      user_request: 'npx cypress run --record --key 72f44521-8447-4cc2-8d48-a6112813ce57 - use it and create ability + case pattern',
      key_learnings: [
        'Cypress Cloud requires BOTH projectId (in config) AND matching record key (in command)',
        'projectId goes at ROOT of cypress.config.js, NOT inside e2e config',
        'Record keys and projectIds must be from the SAME Cypress Cloud project',
        'Get both values from Cypress Cloud project settings',
        'Never commit record keys to Git (use environment variables)',
        'Free tier includes 500 test results per month'
      ],
      timestamp: new Date(),
      status: 'documented'
    };

    await db.collection('sessions').insertOne(session);
    console.log('✅ Session saved!');

    console.log('\n🎉 CYPRESS CLOUD INTEGRATION DOCUMENTATION COMPLETE! 🎉');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Connection closed!');
  }
}

main().catch(console.error);
