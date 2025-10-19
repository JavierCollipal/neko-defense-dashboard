#!/usr/bin/env node

/**
 * 🐾 PUPPETEER ERROR COLLECTOR - MongoDB Persistence Module
 *
 * Collects and saves all browser errors to MongoDB in real-time
 * Collection: "puppeteer-error-collections"
 *
 * Error Types Tracked:
 * - Console errors (console.error)
 * - Console warnings (console.warn)
 * - JavaScript exceptions (uncaught errors)
 * - Failed HTTP requests (404, 500, etc.)
 * - Network failures (ERR_CONNECTION_REFUSED)
 *
 * Nyaa~! ⚡✨
 */

const { MongoClient } = require('mongodb');

class PuppeteerErrorCollector {
  constructor(mongoUri, sessionId = null) {
    this.mongoUri = mongoUri;
    this.sessionId = sessionId || `puppeteer-session-${Date.now()}`;
    this.client = null;
    this.db = null;
    this.collection = null;
    this.errorBuffer = [];
    this.isConnected = false;
  }

  /**
   * Connect to MongoDB Atlas
   */
  async connect() {
    try {
      this.client = new MongoClient(this.mongoUri);
      await this.client.connect();

      this.db = this.client.db('neko-defense-system');
      this.collection = this.db.collection('puppeteer-error-collections');

      this.isConnected = true;
      console.log('🐾 [ErrorCollector] Connected to MongoDB Atlas, nyaa~!');
      console.log(`📋 [ErrorCollector] Session ID: ${this.sessionId}\n`);

      return true;
    } catch (error) {
      console.error('❌ [ErrorCollector] Failed to connect to MongoDB:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Save a console error to MongoDB
   */
  async saveConsoleError(type, text, context = {}) {
    const errorDoc = {
      session_id: this.sessionId,
      timestamp: new Date(),
      error_type: 'console_error',
      console_type: type, // 'error', 'warning', 'log'
      message: text,
      context: {
        route: context.route || 'unknown',
        action: context.action || 'page_load',
        url: context.url || null
      },
      severity: type === 'error' ? 'high' : type === 'warning' ? 'medium' : 'low',
      tags: ['console', type],
      metadata: {
        browser: 'Chromium (Puppeteer)',
        created_at: new Date()
      }
    };

    return this.saveError(errorDoc);
  }

  /**
   * Save a JavaScript exception to MongoDB
   */
  async saveJavaScriptError(error, context = {}) {
    const errorDoc = {
      session_id: this.sessionId,
      timestamp: new Date(),
      error_type: 'javascript_exception',
      message: error.message,
      stack: error.stack || null,
      context: {
        route: context.route || 'unknown',
        action: context.action || 'page_interaction',
        url: context.url || null
      },
      severity: 'critical',
      tags: ['javascript', 'exception', 'uncaught'],
      metadata: {
        browser: 'Chromium (Puppeteer)',
        created_at: new Date()
      }
    };

    return this.saveError(errorDoc);
  }

  /**
   * Save a failed HTTP request to MongoDB
   */
  async saveFailedRequest(status, url, context = {}) {
    const errorDoc = {
      session_id: this.sessionId,
      timestamp: new Date(),
      error_type: 'failed_request',
      http_status: status,
      url: url,
      context: {
        route: context.route || 'unknown',
        action: context.action || 'api_call',
        initiator: context.initiator || null
      },
      severity: status >= 500 ? 'high' : status >= 400 ? 'medium' : 'low',
      tags: ['http', 'network', `status_${status}`],
      metadata: {
        browser: 'Chromium (Puppeteer)',
        created_at: new Date()
      }
    };

    return this.saveError(errorDoc);
  }

  /**
   * Save error to MongoDB (with buffering fallback)
   */
  async saveError(errorDoc) {
    if (!this.isConnected) {
      // Buffer errors if not connected
      this.errorBuffer.push(errorDoc);
      return false;
    }

    try {
      await this.collection.insertOne(errorDoc);
      console.log(`   💾 [ErrorCollector] Saved error: ${errorDoc.error_type} - ${errorDoc.message?.substring(0, 60)}...`);
      return true;
    } catch (error) {
      console.error(`   ❌ [ErrorCollector] Failed to save error:`, error.message);
      this.errorBuffer.push(errorDoc);
      return false;
    }
  }

  /**
   * Flush buffered errors to MongoDB
   */
  async flushBuffer() {
    if (this.errorBuffer.length === 0) {
      return 0;
    }

    if (!this.isConnected) {
      console.log(`   ⚠️ [ErrorCollector] Cannot flush buffer - not connected to MongoDB`);
      return 0;
    }

    try {
      const result = await this.collection.insertMany(this.errorBuffer);
      const count = result.insertedCount;
      console.log(`\n   💾 [ErrorCollector] Flushed ${count} buffered errors to MongoDB`);
      this.errorBuffer = [];
      return count;
    } catch (error) {
      console.error(`   ❌ [ErrorCollector] Failed to flush buffer:`, error.message);
      return 0;
    }
  }

  /**
   * Get error statistics for current session
   */
  async getSessionStats() {
    if (!this.isConnected) {
      return null;
    }

    try {
      const stats = await this.collection.aggregate([
        { $match: { session_id: this.sessionId } },
        {
          $group: {
            _id: '$error_type',
            count: { $sum: 1 },
            severity_breakdown: {
              $push: '$severity'
            }
          }
        }
      ]).toArray();

      return stats;
    } catch (error) {
      console.error(`   ❌ [ErrorCollector] Failed to get stats:`, error.message);
      return null;
    }
  }

  /**
   * Create session summary document
   */
  async createSessionSummary(additionalData = {}) {
    if (!this.isConnected) {
      return null;
    }

    try {
      const stats = await this.getSessionStats();

      const summary = {
        session_id: this.sessionId,
        timestamp: new Date(),
        total_errors: stats.reduce((sum, s) => sum + s.count, 0),
        error_breakdown: stats.map(s => ({
          type: s._id,
          count: s.count
        })),
        ...additionalData,
        metadata: {
          browser: 'Chromium (Puppeteer)',
          created_at: new Date()
        }
      };

      await this.db.collection('puppeteer-session-summaries').insertOne(summary);
      console.log(`\n   📊 [ErrorCollector] Session summary saved!`);

      return summary;
    } catch (error) {
      console.error(`   ❌ [ErrorCollector] Failed to create summary:`, error.message);
      return null;
    }
  }

  /**
   * Close MongoDB connection
   */
  async close() {
    // Flush any remaining buffered errors
    await this.flushBuffer();

    if (this.client) {
      await this.client.close();
      console.log('\n🐾 [ErrorCollector] MongoDB connection closed, nyaa~!');
    }
  }
}

module.exports = PuppeteerErrorCollector;
