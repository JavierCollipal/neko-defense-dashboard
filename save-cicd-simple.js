#!/usr/bin/env node

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function saveCICDToMongoDB() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas, nyaa~!');
    
    const db = client.db('neko-defense-system');
    
    // Save Ability
    await db.collection('abilities').updateOne(
      { name: 'CI/CD Pipeline Mastery' },
      { $set: {
        name: 'CI/CD Pipeline Mastery',
        description: 'GitHub Actions automated deployment with environment-aware CORS configuration',
        category: 'DevOps & Automation',
        tier: 'Advanced',
        powerLevel: 95,
        learnedFrom: 'CI/CD Implementation - October 17, 2025',
        keySkills: ['GitHub Actions', 'Smart CORS', 'Environment variables', 'Vercel deployment', 'Railway deployment'],
        dateCreated: new Date('2025-10-17')
      }},
      { upsert: true }
    );
    console.log('✅ Saved Ability: CI/CD Pipeline Mastery');
    
    // Save Session
    await db.collection('sessions').insertOne({
      sessionName: 'CI/CD Pipeline Implementation - Oct 17, 2025',
      date: new Date('2025-10-17'),
      category: 'DevOps',
      objective: 'Fix CORS errors and create automated deployment pipeline',
      filesCreated: ['.env.production', '.github/workflows/deploy-production.yml', 'railway.json', 'GITHUB-SECRETS-SETUP.md'],
      filesModified: ['server/index.js (smart CORS)', 'next.config.js (env vars)'],
      result: 'Production-ready CI/CD pipeline with auto-deployment',
      tags: ['cicd', 'cors', 'deployment']
    });
    console.log('✅ Saved Session documentation');
    
    console.log('\n🎉 CI/CD knowledge saved to MongoDB, nyaa~! 🐾✨');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

saveCICDToMongoDB();
