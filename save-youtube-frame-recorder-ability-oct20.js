#!/usr/bin/env node

/**
 * 🐾💾 Save YouTube Frame Recorder Ability - October 20, 2025
 *
 * Documents the Puppeteer frame recording ability for creating YouTube videos
 * from automated browser demonstrations (Family Tracker memorial tribute).
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  process.exit(1);
}

async function saveYouTubeFrameRecorderAbility() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db('neko-defense-system');

    // ABILITY - YouTube Frame Recorder with Puppeteer
    const ability = {
      ability_id: 'youtube-frame-recorder-puppeteer-oct20',
      name: 'Puppeteer Frame Recorder for YouTube Video Creation',
      category: 'video-production',
      subcategory: 'frame-capture',
      difficulty: 'intermediate',
      date_learned: new Date('2025-10-20'),

      description: 'Capture frames from Puppeteer automated browser demonstrations and compile them into YouTube-ready videos. Perfect for creating memorial tributes, tutorials, feature demonstrations, and visual documentation.',

      problem_solved: 'How to create YouTube videos from automated browser demonstrations that show every action step-by-step with visual proof that can be watched in real-time and saved as numbered frames for video compilation.',

      approach: [
        '1. CREATE OUTPUT DIRECTORY: mkdir -p ~/Documents/[project-name]/',
        '2. PUPPETEER SETUP (VISUAL MODE - RULE 3.1):',
        '   - headless: false (MUST see browser window!)',
        '   - slowMo: 250 (slow down for visibility)',
        '   - devtools: true (open DevTools Console)',
        '   - viewport: 1920x1080 (YouTube Full HD standard)',
        '   - args: [--start-maximized, --auto-open-devtools-for-tabs]',
        '3. FRAME CAPTURE FUNCTION:',
        '   - Numbered filenames: frame-001.png, frame-002.png, ...',
        '   - page.screenshot({ path, fullPage: false })',
        '   - 500ms delay after each capture',
        '4. SCENE STRUCTURE:',
        '   - Organize by scenes (Scene 1, Scene 2, ...)',
        '   - Capture frame after each action',
        '   - Add 1-2 second pauses between actions',
        '   - Console log what\'s being captured',
        '5. BROWSER NAVIGATION:',
        '   - Navigate to target page',
        '   - Interact with elements (click, type, scroll)',
        '   - Switch tabs/views',
        '   - Test responsive design (viewport changes)',
        '6. ERROR HANDLING:',
        '   - Try-catch around entire recording',
        '   - Timeout settings for slow pages',
        '   - Graceful browser closure (5 second delay)',
        '7. VIDEO COMPILATION WITH FFMPEG:',
        '   - framerate 1/3 (each frame shows 3 seconds)',
        '   - pattern_type glob -i "frame-*.png"',
        '   - libx264 codec, yuv420p pixel format',
        '   - crf 18 (high quality)',
        '   - scale and pad to 1920:1080',
        '   - output framerate 30fps',
        '8. VIDEO OUTPUT:',
        '   - H.264 codec (YouTube compatible)',
        '   - 1920x1080 Full HD resolution',
        '   - .mp4 format',
        '   - Ready for YouTube upload',
        '9. VALIDATION:',
        '   - Check frame count: ls frame-*.png | wc -l',
        '   - Verify video: ffprobe output.mp4',
        '   - Test playback before upload',
        '10. CLEANUP:',
        '    - Keep frames for re-encoding if needed',
        '    - Archive to project directory',
        '    - Document frame descriptions'
      ],

      code_example: `
// Puppeteer Frame Recorder Template
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const FRAME_OUTPUT_DIR = path.join(require('os').homedir(), 'Documents', 'project-name');
let frameCounter = 1;

async function captureFrame(page, description) {
  const framePath = path.join(FRAME_OUTPUT_DIR, \`frame-\${String(frameCounter).padStart(3, '0')}.png\`);
  console.log(\`📸 Frame \${frameCounter}: \${description}\`);
  await page.screenshot({ path: framePath, fullPage: false });
  frameCounter++;
  await new Promise(resolve => setTimeout(resolve, 500));
}

async function recordFrames() {
  const browser = await puppeteer.launch({
    headless: false,       // 🎭 VISIBLE!
    slowMo: 250,          // Slow down
    devtools: true,       // Open DevTools
    defaultViewport: null,
    args: ['--start-maximized', '--auto-open-devtools-for-tabs']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('🎬 SCENE 1: Opening page');
    await page.goto('http://localhost:3000/route');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await captureFrame(page, 'Initial page load');

    console.log('🎬 SCENE 2: User interaction');
    await page.click('.button');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await captureFrame(page, 'Button clicked');

    console.log('✅ Recording complete!');
  } finally {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
  }
}

recordFrames();
      `.trim(),

      ffmpeg_command: `
# Create video from frames (3 seconds per frame)
ffmpeg -y \\
  -framerate 1/3 \\
  -pattern_type glob \\
  -i "frame-*.png" \\
  -c:v libx264 \\
  -pix_fmt yuv420p \\
  -crf 18 \\
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \\
  -r 30 \\
  output.mp4
      `.trim(),

      reusability: 'high',

      applicable_to: [
        'Memorial tribute videos (Pacos memorial)',
        'Software feature demonstrations',
        'Tutorial video creation',
        'Bug reproduction videos',
        'User onboarding videos',
        'Marketing demo videos',
        'Testing documentation',
        'Visual proof of concept',
        'YouTube content creation',
        'Training material videos'
      ],

      benefits: [
        'YouTube-ready video output (1920x1080, H.264)',
        'Visual demonstration visible in real-time',
        'Numbered frames for easy re-editing',
        'High-quality video compilation',
        'Automated capture of all actions',
        'No manual screen recording needed',
        'Consistent frame sizing and timing',
        'Memorial tribute capability for fallen officers',
        'Educational and documentary value',
        'Professional video production workflow'
      ],

      use_case_pacos_memorial: {
        purpose: 'Memorial tribute to fallen Carabineros officers',
        frames_captured: 3,
        scenes: [
          'Family Tracker - Initial page load',
          'Statistics summary bar',
          'Family Members tab - Active view'
        ],
        output_video: 'pacos-memorial-tribute.mp4',
        duration: '9 seconds',
        resolution: '1920x1080',
        size: '330 KB',
        location: '/home/wakibaka/Documents/pacos memorial/',
        ready_for: 'YouTube upload'
      },

      related_abilities: [
        'puppeteer-visual-demonstration-oct19',
        'puppeteer-silent-scanning-oct19',
        'video-maker-integration',
        'youtube-content-creation'
      ],

      requirements: [
        'Node.js with Puppeteer installed',
        'ffmpeg for video compilation',
        'Chrome/Chromium browser',
        'Localhost server running (for demonstrations)',
        'Output directory with write permissions'
      ],

      learned_from_session: 'youtube-frame-recorder-oct20-2025',

      tags: [
        'puppeteer',
        'frame-capture',
        'video-production',
        'youtube',
        'memorial-tribute',
        'automation',
        'visual-demonstration',
        'ffmpeg',
        'tutorial-creation',
        'content-creation'
      ],

      created_at: new Date(),
      created_by: 'neko-arc'
    };

    const abilityResult = await db.collection('abilities').insertOne(ability);
    console.log('✅ Ability saved:', abilityResult.insertedId);

    console.log('\n🎉 YouTube Frame Recorder ability documented!');
    console.log('\nSummary:');
    console.log('🎯 Ability: youtube-frame-recorder-puppeteer-oct20');
    console.log('🎬 Category: Video Production → Frame Capture');
    console.log('💀 Use Case: Pacos memorial tribute video');
    console.log('📹 Output: 9-second memorial video (3 frames)');
    console.log('✅ Ready for YouTube upload');
    console.log('\n💖 NYAA~! Ability saved to MongoDB Atlas, desu~! 🐾✨');

  } catch (error) {
    console.error('❌ Error saving ability:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

saveYouTubeFrameRecorderAbility();
