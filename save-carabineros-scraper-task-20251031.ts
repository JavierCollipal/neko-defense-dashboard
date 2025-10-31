#!/usr/bin/env ts-node

/**
 * Task Completion Documentation: Carabineros Website Scraper
 * Saves to hunt-conversations and abilities collections
 *
 * Rule 3.6: Task Completion Auto-Documentation Protocol
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

async function saveTaskCompletion() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');

    // 1. HUNT CONVERSATION
    const conversation = {
      session_id: 'carabineros-web-scraper-oct31-2025',
      date: new Date(),
      title: 'Carabineros Website Data Extraction - Puppeteer Evolution',
      category: 'web-scraping',
      subcategory: 'institutional-data-extraction',
      objective: 'Extract all text and HTML data from https://www.carabineros.cl/ using Puppeteer with visual demonstration and MongoDB persistence',

      conversation_summary: {
        phase1: 'Script Creation - Created TypeScript Puppeteer scraper with all six personalities collaborating',
        phase2: 'Visual Execution - Ran browser with headless:false, slowMo:250, devtools:true for user visibility',
        phase3: 'Data Extraction - Extracted 924 chars of text + 87,696 chars of HTML',
        phase4: 'MongoDB Storage - Saved to marionnette-theater database with performance documentation',
        outcome: 'SUCCESS - Complete data extraction with error monitoring and theatrical documentation'
      },

      key_exchanges: [
        {
          user: 'use the puppeter ability in this page, we are going to evolve the ability',
          neko_response: 'Created comprehensive TypeScript Puppeteer script with visual demonstration mode',
          mario_contribution: 'Documented entire performance to marionnette-theater database',
          noel_contribution: 'Fixed TypeScript type errors and validated syntax',
          glam_contribution: 'Provided Spanish commentary and ethical oversight',
          hannibal_contribution: 'Forensic data collection protocol',
          tetora_contribution: 'Multi-perspective data stream analysis'
        }
      ],

      technical_details: {
        files_created: [
          'puppeteer-carabineros-scraper.ts (TypeScript Puppeteer script)',
          'save-carabineros-scraper-task-20251031.ts (Documentation script)'
        ],
        commands_executed: [
          'npx tsc --noEmit (TypeScript validation)',
          'npx ts-node puppeteer-carabineros-scraper.ts (Script execution)'
        ],
        data_extracted: {
          text_length: 924,
          html_length: 87696,
          page_title: 'Carabineros de Chile',
          console_errors_captured: 3
        },
        mongodb_documents: {
          carabineros_data_id: '69053d858595f811e503f782',
          performance_documented: true,
          console_errors_saved: true
        }
      },

      outcome: 'SUCCESS - Evolved Puppeteer ability with visual demonstration, complete data extraction, and MongoDB persistence',

      tags: ['puppeteer', 'web-scraping', 'carabineros', 'typescript', 'mongodb', 'visual-demonstration', 'six-personalities'],
      created_at: new Date(),
      created_by: 'neko-arc-six-personality-team'
    };

    await db.collection('hunt-conversations').insertOne(conversation);
    console.log('✅ Hunt conversation saved!');

    // 2. ABILITY
    const ability = {
      ability_id: 'puppeteer-visual-data-extraction-oct31',
      name: 'Visual Puppeteer Data Extraction with MongoDB Persistence',
      category: 'web-scraping',
      subcategory: 'institutional-data-collection',
      difficulty: 'intermediate',
      date_learned: new Date(),

      description: 'Complete web scraping workflow using Puppeteer with visual demonstration mode (headless:false, devtools:true) to extract text and HTML content from websites, with automatic MongoDB storage and error monitoring',

      problem_solved: 'Need to extract complete website data (text + HTML) with visual demonstration for user verification, error monitoring, and permanent MongoDB storage',

      approach: [
        'Create TypeScript Puppeteer script with visual demonstration settings',
        'Launch browser with headless:false, slowMo:250, devtools:true',
        'Navigate to target website with error monitoring (console, page errors, failed requests)',
        'Extract text content using document.body.innerText',
        'Extract complete HTML using document.documentElement.outerHTML',
        'Extract metadata (page title, meta description)',
        'Save all data to MongoDB Atlas with structured format',
        'Document performance to marionnette-theater database (Mario)',
        'Save console errors to separate collection for analysis'
      ],

      reusability: 'high',

      applicable_to: [
        'Government institution websites',
        'Public information extraction',
        'Website archival',
        'Data collection for analysis',
        'Educational research',
        'Transparency monitoring'
      ],

      technical_requirements: [
        'TypeScript with ts-node',
        'Puppeteer library',
        'MongoDB Atlas connection',
        'dotenv for environment variables',
        '@types/node for TypeScript support'
      ],

      rule_compliance: [
        'Rule 3.1: Visual demonstration protocol (headless:false, devtools:true)',
        'Rule 3.6: Task completion auto-documentation',
        'Rule 3.7: TypeScript as default language',
        'Rule 3.8: Mandatory syntax validation',
        'Rule 3.11: Mario manages marionnette-theater for Puppeteer operations'
      ],

      tags: ['puppeteer', 'web-scraping', 'typescript', 'mongodb', 'visual-demo', 'error-monitoring'],
      created_at: new Date(),
      created_by: 'neko-arc-six-personality-team'
    };

    await db.collection('abilities').insertOne(ability);
    console.log('✅ Ability documented!');

    console.log('\n🎉 Task documentation saved to MongoDB!');
    console.log('📊 Collections updated: hunt-conversations, abilities');

  } finally {
    await client.close();
  }
}

saveTaskCompletion();
