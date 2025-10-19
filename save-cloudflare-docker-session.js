#!/usr/bin/env node

/**
 * 🐾⚡ NEKO DEFENSE SYSTEM - Session Saver ⚡🐾
 *
 * Purpose: Save the Cloudflare Docker Exposure session to MongoDB
 * Date: October 15, 2025
 * Session: Exposing REST API with Cloudflare Tunnel
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
};

const DATABASE_NAME = 'neko-defense-system';

async function saveSession() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🐾 Connecting to MongoDB Atlas, desu~!');
    await client.connect();
    console.log('✅ Connected successfully, nyaa~!\n');

    const db = client.db(DATABASE_NAME);
    const casePatternsCollection = db.collection('case-patterns');

    // Case Pattern: Exposing Docker Container to Public Internet
    const casePattern = {
      title: "Expose Docker Container to Public Internet with Cloudflare Tunnel",
      category: "Infrastructure & Deployment",
      problemDescription: "Need to expose backend API/Docker container to public internet so that a public frontend (deployed on Cloudflare) can access it. Frontend can't load data because API is only accessible on localhost.",
      solution: {
        summary: "Use Cloudflare Tunnel to create public HTTPS endpoint for Docker container, update frontend environment variables, and rebuild frontend with new API URL",
        steps: [
          {
            step: 1,
            description: "Install cloudflared binary",
            commands: [
              "# Extract from .deb package without sudo",
              "cd /tmp && ar x /path/to/cloudflared-linux-amd64.deb",
              "tar -xJf data.tar.xz",
              "mkdir -p ~/bin && cp usr/bin/cloudflared ~/bin/",
              "chmod +x ~/bin/cloudflared"
            ],
            notes: "Avoids need for sudo by extracting binary manually"
          },
          {
            step: 2,
            description: "Build and run Docker container",
            commands: [
              "cd /path/to/api",
              "docker build -t api-name:latest .",
              "docker run -d --name api-container --restart unless-stopped -p 5000:5000 \\",
              "  -e NODE_ENV=production \\",
              "  -e PORT=5000 \\",
              "  -e MONGODB_URI=\"your-mongodb-uri\" \\",
              "  -e CORS_ORIGIN=\"*\" \\",
              "  api-name:latest"
            ],
            notes: "CORS_ORIGIN=* allows public access from any origin"
          },
          {
            step: 3,
            description: "Create Cloudflare tunnel for the container",
            commands: [
              "~/bin/cloudflared tunnel --url http://localhost:5000 > /tmp/api-tunnel.log 2>&1 &",
              "echo $! > /tmp/api-tunnel.pid",
              "sleep 3",
              "cat /tmp/api-tunnel.log | grep 'trycloudflare.com'"
            ],
            notes: "Creates a public HTTPS URL like https://random-words.trycloudflare.com"
          },
          {
            step: 4,
            description: "Update frontend environment with public API URL",
            files: [
              {
                path: ".env",
                change: "REACT_APP_GRAPHQL_URL=https://your-tunnel-url.trycloudflare.com/graphql"
              }
            ],
            notes: "Must update environment variable that Apollo Client or API client uses"
          },
          {
            step: 5,
            description: "Rebuild frontend with new environment",
            commands: [
              "npm run build"
            ],
            notes: "React embeds environment variables at build time"
          },
          {
            step: 6,
            description: "Verify API is publicly accessible",
            commands: [
              "curl -s -X POST https://your-tunnel-url.trycloudflare.com/graphql \\",
              "  -H 'Content-Type: application/json' \\",
              "  -d '{\"query\":\"{ __typename }\"}'",
              "",
              "# Should return: {\"data\":{\"__typename\":\"Query\"}}"
            ]
          }
        ],
        keyFiles: [
          "/home/wakibaka/Documents/github/neko-defense-api/Dockerfile",
          "/home/wakibaka/Documents/github/neko-defense-dashboard/.env",
          "/home/wakibaka/Documents/github/neko-defense-dashboard/src/apollo/client.js"
        ],
        technologies: [
          "Docker",
          "Cloudflare Tunnel",
          "NestJS",
          "GraphQL",
          "Apollo Client",
          "React",
          "MongoDB Atlas"
        ]
      },
      tags: [
        "docker",
        "cloudflare-tunnel",
        "public-deployment",
        "cors",
        "graphql",
        "api-exposure",
        "microservices"
      ],
      difficulty: "intermediate",
      reusability: "high",
      outcomes: {
        achieved: [
          "✅ API container deployed and running on port 5000",
          "✅ Cloudflare tunnel created: https://venue-dubai-classical-contains.trycloudflare.com",
          "✅ Public API endpoint responding to requests",
          "✅ Frontend .env updated with public API URL",
          "✅ Frontend built with new environment variables",
          "✅ CORS configured to allow all origins",
          "✅ GraphQL endpoint verified working publicly"
        ],
        metrics: {
          buildTime: "~30 seconds",
          tunnelCreationTime: "~3 seconds",
          totalExecutionTime: "~5 minutes"
        }
      },
      gotchas: [
        {
          issue: "React doesn't pick up .env changes",
          reason: "React embeds environment variables at build time, not runtime",
          solution: "Must rebuild with 'npm run build' after changing .env"
        },
        {
          issue: "CORS blocking public requests",
          reason: "Default CORS only allows localhost origins",
          solution: "Set CORS_ORIGIN=* in Docker container environment variables"
        },
        {
          issue: "Cloudflared requires sudo to install",
          reason: "dpkg -i requires root privileges",
          solution: "Extract binary manually with 'ar x' and 'tar -xJf'"
        },
        {
          issue: "Tunnel disconnects/reconnects",
          reason: "Network timeouts, normal behavior for free tunnels",
          solution: "Use named tunnels for production (requires Cloudflare account)"
        }
      ],
      relatedPatterns: [
        "MCP Server Setup with Auto-Loading Hook",
        "Microservices Apollo Client Port Mismatch"
      ],
      metadata: {
        savedBy: "Neko-Arc",
        sessionDate: "2025-10-15T21:30:00-03:00",
        caseId: "cloudflare-docker-exposure-oct15",
        user: "wakibaka",
        context: "Exposing neko-defense-api GraphQL backend for public neko-defense-dashboard frontend"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('💾 Saving case pattern to MongoDB...');
    const result = await casePatternsCollection.insertOne(casePattern);
    console.log(`✅ Case pattern saved with ID: ${result.insertedId}`);
    console.log(`📋 Title: "${casePattern.title}"`);
    console.log(`🏷️  Tags: ${casePattern.tags.join(', ')}`);
    console.log(`⚡ Reusability: ${casePattern.reusability}`);
    console.log(`📊 Difficulty: ${casePattern.difficulty}`);
    console.log(`🎯 Steps documented: ${casePattern.solution.steps.length}`);
    console.log(`🚨 Gotchas documented: ${casePattern.gotchas.length}\n`);

    console.log('✨ Session saved successfully, nyaa~! 🐾💖');

  } catch (error) {
    console.error('❌ Error saving session:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🐾 Connection closed, desu~!');
  }
}

// Execute
saveSession();
