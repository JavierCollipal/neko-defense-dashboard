#!/usr/bin/env ts-node

/**
 * 🔍 TERMINAL ERROR COLLECTOR ABILITY 🔍
 *
 * Comprehensive terminal error collection and analysis system
 * Monitors, categorizes, and stores terminal errors to MongoDB
 *
 * Created: October 30, 2025
 * By: The Supreme Six (Neko-Arc + Mario + Noel + Glam + Hannibal + Tetora)
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as readline from 'readline';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

interface TerminalError {
  error_id: string;
  timestamp: Date;
  error_type: string;
  error_category: string;
  error_message: string;
  file_path?: string;
  line_number?: number;
  column_number?: number;
  stack_trace?: string;
  command_executed?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  context: {
    working_directory: string;
    git_branch?: string;
    last_commit?: string;
  };
  resolution_attempted?: string;
  status: 'DETECTED' | 'ANALYZING' | 'RESOLVED' | 'UNRESOLVED';
  created_at: Date;
  created_by: string;
}

interface ErrorPattern {
  pattern_id: string;
  pattern_name: string;
  error_signature: string;
  occurrences: number;
  first_seen: Date;
  last_seen: Date;
  common_causes: string[];
  recommended_solutions: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  created_at: Date;
}

class TerminalErrorCollector {
  private client: MongoClient;
  private db: any;
  private errors: TerminalError[] = [];
  private patterns: Map<string, ErrorPattern> = new Map();

  constructor(mongoUri: string) {
    this.client = new MongoClient(mongoUri);
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db('neko-defense-system');
    console.log('✅ Connected to MongoDB Atlas - Terminal Error Collector');
  }

  /**
   * Parse terminal output and extract errors
   */
  parseTerminalOutput(output: string): TerminalError[] {
    const detectedErrors: TerminalError[] = [];
    const lines = output.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // TypeScript errors
      const tsErrorMatch = line.match(/(.+\.tsx?):(\d+):(\d+)\s+-\s+error\s+TS(\d+):\s+(.+)/);
      if (tsErrorMatch) {
        detectedErrors.push({
          error_id: `ts-error-${Date.now()}-${i}`,
          timestamp: new Date(),
          error_type: 'TypeScript',
          error_category: 'COMPILATION_ERROR',
          error_message: tsErrorMatch[5],
          file_path: tsErrorMatch[1],
          line_number: parseInt(tsErrorMatch[2]),
          column_number: parseInt(tsErrorMatch[3]),
          severity: 'HIGH',
          context: {
            working_directory: process.cwd(),
          },
          status: 'DETECTED',
          created_at: new Date(),
          created_by: 'terminal-error-collector'
        });
      }

      // ESLint errors
      const eslintErrorMatch = line.match(/(.+)\s+(\d+):(\d+)\s+error\s+(.+)\s+(.+)/);
      if (eslintErrorMatch) {
        detectedErrors.push({
          error_id: `eslint-error-${Date.now()}-${i}`,
          timestamp: new Date(),
          error_type: 'ESLint',
          error_category: 'LINTING_ERROR',
          error_message: eslintErrorMatch[4],
          file_path: eslintErrorMatch[1],
          line_number: parseInt(eslintErrorMatch[2]),
          column_number: parseInt(eslintErrorMatch[3]),
          severity: 'MEDIUM',
          context: {
            working_directory: process.cwd(),
          },
          status: 'DETECTED',
          created_at: new Date(),
          created_by: 'terminal-error-collector'
        });
      }

      // Build errors (Next.js, npm, etc.)
      if (line.includes('Failed to compile') || line.includes('Build failed')) {
        detectedErrors.push({
          error_id: `build-error-${Date.now()}-${i}`,
          timestamp: new Date(),
          error_type: 'Build',
          error_category: 'BUILD_FAILURE',
          error_message: line.trim(),
          severity: 'CRITICAL',
          context: {
            working_directory: process.cwd(),
          },
          status: 'DETECTED',
          created_at: new Date(),
          created_by: 'terminal-error-collector'
        });
      }

      // Runtime errors (console errors, exceptions)
      if (line.includes('Error:') || line.includes('TypeError:') || line.includes('ReferenceError:')) {
        detectedErrors.push({
          error_id: `runtime-error-${Date.now()}-${i}`,
          timestamp: new Date(),
          error_type: 'Runtime',
          error_category: 'RUNTIME_ERROR',
          error_message: line.trim(),
          severity: 'HIGH',
          context: {
            working_directory: process.cwd(),
          },
          status: 'DETECTED',
          created_at: new Date(),
          created_by: 'terminal-error-collector'
        });
      }

      // MongoDB connection errors
      if (line.includes('ECONNREFUSED') || line.includes('MongoServerError')) {
        detectedErrors.push({
          error_id: `mongodb-error-${Date.now()}-${i}`,
          timestamp: new Date(),
          error_type: 'MongoDB',
          error_category: 'DATABASE_ERROR',
          error_message: line.trim(),
          severity: 'CRITICAL',
          context: {
            working_directory: process.cwd(),
          },
          status: 'DETECTED',
          created_at: new Date(),
          created_by: 'terminal-error-collector'
        });
      }

      // Git errors
      if (line.includes('fatal:') || line.includes('error: failed to push')) {
        detectedErrors.push({
          error_id: `git-error-${Date.now()}-${i}`,
          timestamp: new Date(),
          error_type: 'Git',
          error_category: 'VERSION_CONTROL_ERROR',
          error_message: line.trim(),
          severity: 'MEDIUM',
          context: {
            working_directory: process.cwd(),
          },
          status: 'DETECTED',
          created_at: new Date(),
          created_by: 'terminal-error-collector'
        });
      }

      // npm/yarn errors
      if (line.includes('npm ERR!') || line.includes('yarn error')) {
        detectedErrors.push({
          error_id: `npm-error-${Date.now()}-${i}`,
          timestamp: new Date(),
          error_type: 'npm',
          error_category: 'DEPENDENCY_ERROR',
          error_message: line.trim(),
          severity: 'MEDIUM',
          context: {
            working_directory: process.cwd(),
          },
          status: 'DETECTED',
          created_at: new Date(),
          created_by: 'terminal-error-collector'
        });
      }
    }

    return detectedErrors;
  }

  /**
   * Analyze error pattern and categorize
   */
  analyzeErrorPattern(error: TerminalError): ErrorPattern {
    // Create signature based on error type + first 50 chars of message
    const signature = `${error.error_type}:${error.error_message.substring(0, 50)}`;

    if (this.patterns.has(signature)) {
      const pattern = this.patterns.get(signature)!;
      pattern.occurrences++;
      pattern.last_seen = new Date();
      return pattern;
    }

    // Create new pattern
    const newPattern: ErrorPattern = {
      pattern_id: `pattern-${Date.now()}`,
      pattern_name: `${error.error_type} - ${error.error_category}`,
      error_signature: signature,
      occurrences: 1,
      first_seen: new Date(),
      last_seen: new Date(),
      common_causes: this.identifyCommonCauses(error),
      recommended_solutions: this.recommendSolutions(error),
      severity: error.severity,
      created_at: new Date()
    };

    this.patterns.set(signature, newPattern);
    return newPattern;
  }

  /**
   * Identify common causes for error types
   */
  private identifyCommonCauses(error: TerminalError): string[] {
    const causes: Record<string, string[]> = {
      TypeScript: [
        'Missing type definitions',
        'Type mismatch',
        'Property does not exist on type',
        'Strict null checks violation'
      ],
      ESLint: [
        'Code style violation',
        'Unused variables',
        'Missing semicolons',
        'Deprecated API usage'
      ],
      Build: [
        'TypeScript compilation failure',
        'Missing dependencies',
        'Syntax errors in code',
        'Configuration issues'
      ],
      Runtime: [
        'Null pointer exception',
        'Undefined variable access',
        'Async operation failure',
        'Network request failure'
      ],
      MongoDB: [
        'Connection refused (service not running)',
        'Authentication failed',
        'Network timeout',
        'Invalid connection string'
      ],
      Git: [
        'Merge conflicts',
        'Authentication issues',
        'Branch protection rules',
        'Network connectivity'
      ],
      npm: [
        'Missing package',
        'Version conflict',
        'Network timeout',
        'Corrupted node_modules'
      ]
    };

    return causes[error.error_type] || ['Unknown cause'];
  }

  /**
   * Recommend solutions based on error type
   */
  private recommendSolutions(error: TerminalError): string[] {
    const solutions: Record<string, string[]> = {
      TypeScript: [
        'Add type assertions with "as any"',
        'Update interface definitions',
        'Install missing @types packages',
        'Use optional chaining (?.)'
      ],
      ESLint: [
        'Run eslint --fix to auto-fix',
        'Update .eslintrc configuration',
        'Remove unused variables',
        'Follow code style guide'
      ],
      Build: [
        'Run npm install to update dependencies',
        'Clear .next cache and rebuild',
        'Fix TypeScript errors first',
        'Check tsconfig.json configuration'
      ],
      Runtime: [
        'Add null checks before property access',
        'Use try-catch blocks for async operations',
        'Verify API endpoints are accessible',
        'Check environment variables are set'
      ],
      MongoDB: [
        'Start MongoDB service: sudo systemctl start mongod',
        'Use MongoDB Atlas cloud connection',
        'Verify MONGODB_URI in .env file',
        'Check network connectivity'
      ],
      Git: [
        'Resolve merge conflicts manually',
        'Update git credentials: git config',
        'Pull latest changes before push',
        'Check branch protection settings'
      ],
      npm: [
        'Delete node_modules and reinstall',
        'Clear npm cache: npm cache clean --force',
        'Update package.json versions',
        'Use npm ci for clean install'
      ]
    };

    return solutions[error.error_type] || ['Consult documentation'];
  }

  /**
   * Save errors to MongoDB
   */
  async saveErrors() {
    if (this.errors.length === 0) {
      console.log('ℹ️  No errors detected to save');
      return;
    }

    await this.db.collection('terminal-errors').insertMany(this.errors);
    console.log(`✅ Saved ${this.errors.length} terminal errors to MongoDB`);
  }

  /**
   * Save error patterns to MongoDB
   */
  async savePatterns() {
    if (this.patterns.size === 0) {
      console.log('ℹ️  No error patterns detected to save');
      return;
    }

    const patternArray = Array.from(this.patterns.values());
    await this.db.collection('error-patterns').insertMany(patternArray);
    console.log(`✅ Saved ${patternArray.length} error patterns to MongoDB`);
  }

  /**
   * Generate error summary report
   */
  generateReport(): void {
    console.log('\n📊 TERMINAL ERROR COLLECTION REPORT\n');
    console.log(`Total Errors Detected: ${this.errors.length}`);
    console.log(`Unique Error Patterns: ${this.patterns.size}\n`);

    // Group by type
    const byType = this.errors.reduce((acc, err) => {
      acc[err.error_type] = (acc[err.error_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('📈 Errors by Type:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    // Group by severity
    const bySeverity = this.errors.reduce((acc, err) => {
      acc[err.severity] = (acc[err.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n⚠️  Errors by Severity:');
    Object.entries(bySeverity).forEach(([severity, count]) => {
      console.log(`   ${severity}: ${count}`);
    });

    console.log();
  }

  /**
   * Collect errors from a log file
   */
  async collectFromFile(logFilePath: string): Promise<void> {
    if (!fs.existsSync(logFilePath)) {
      console.error(`❌ Log file not found: ${logFilePath}`);
      return;
    }

    const fileContent = fs.readFileSync(logFilePath, 'utf-8');
    const detectedErrors = this.parseTerminalOutput(fileContent);

    detectedErrors.forEach(error => {
      this.errors.push(error);
      this.analyzeErrorPattern(error);
    });

    console.log(`✅ Collected ${detectedErrors.length} errors from ${logFilePath}`);
  }

  /**
   * Collect errors from terminal output string
   */
  async collectFromOutput(output: string): Promise<void> {
    const detectedErrors = this.parseTerminalOutput(output);

    detectedErrors.forEach(error => {
      this.errors.push(error);
      this.analyzeErrorPattern(error);
    });

    console.log(`✅ Collected ${detectedErrors.length} errors from terminal output`);
  }

  async close() {
    await this.client.close();
  }
}

// CLI Usage
async function main() {
  const collector = new TerminalErrorCollector(MONGODB_URI!);

  try {
    await collector.connect();

    // Example: Collect from a log file
    const args = process.argv.slice(2);

    if (args.length > 0 && args[0] === '--file') {
      const logFile = args[1] || './error.log';
      await collector.collectFromFile(logFile);
    } else if (args.length > 0 && args[0] === '--text') {
      // Collect from text argument
      const errorText = args.slice(1).join(' ');
      await collector.collectFromOutput(errorText);
    } else {
      console.log('🔍 Terminal Error Collector - Usage:');
      console.log('   --file <path>   : Collect errors from log file');
      console.log('   --text <error>  : Collect errors from text input');
      console.log('\nExample:');
      console.log('   npx ts-node terminal-error-collector.ts --file ./build.log');
      console.log('   npx ts-node terminal-error-collector.ts --text "Error: Cannot find module"');
    }

    // Save to MongoDB
    await collector.saveErrors();
    await collector.savePatterns();

    // Generate report
    collector.generateReport();

  } catch (error: any) {
    console.error('❌ Error collector failed:', error.message);
  } finally {
    await collector.close();
  }
}

// Export for use as module
export { TerminalErrorCollector, TerminalError, ErrorPattern };

// Run if executed directly
if (require.main === module) {
  main();
}
