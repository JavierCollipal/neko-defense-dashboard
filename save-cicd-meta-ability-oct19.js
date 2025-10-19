#!/usr/bin/env node
// 🐾⚡ NEKO-ARC META-ABILITY - CI/CD OPTIMIZATION ORCHESTRATION ⚡🐾
// Date: October 19, 2025
// Ability: "Optimize My GitHub CI/CD Bro"
//
// This is the ULTIMATE meta-ability that orchestrates the entire process
// of researching, analyzing, and optimizing GitHub Actions CI/CD pipelines
// with MAXIMUM capability, nyaa~!

const { MongoClient } = require('mongodb');

// MongoDB Atlas connection (Rule 0.7)
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
};

const DATABASE_NAME = 'neko-defense-system';

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 META-ABILITY DATA
// ═══════════════════════════════════════════════════════════════════════════
const metaAbility = {
  ability_id: 'optimize-github-cicd-orchestration',
  name: 'Optimize My GitHub CI/CD Bro (Meta-Ability)',
  case_name: 'optimize my github ci cd bro',
  category: 'Meta-Orchestration & Research',
  type: 'compound',

  description: 'Comprehensive CI/CD pipeline optimization orchestration with maximum research capability. Analyzes existing workflows, conducts industry research, identifies bottlenecks, implements 2025 best practices, and achieves measurable performance improvements while ensuring compliance with project standards.',

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎯 ORCHESTRATION WORKFLOW
  // ═══════════════════════════════════════════════════════════════════════════
  orchestration_workflow: {
    phase_1_analysis: {
      name: 'Pipeline Analysis & Problem Identification',
      duration: '5-10 minutes',

      steps: [
        {
          step: 1,
          action: 'Read existing workflow files',
          tools: ['Read', 'Glob'],
          what_to_look_for: [
            'Number of workflow files (check for redundancy)',
            'Job structure and dependencies',
            'Caching strategies (or lack thereof)',
            'Test execution patterns (sequential vs parallel)',
            'Code quality enforcement (linting, formatting)',
            'Deployment configuration',
          ],
        },
        {
          step: 2,
          action: 'Read configuration files',
          files: [
            'cypress.config.js - Check Cypress Cloud config',
            'package.json - Verify test scripts exist',
            '.prettierrc - Check formatting config',
            'README or docs - Understand project requirements',
          ],
        },
        {
          step: 3,
          action: 'Identify problems and violations',
          checks: [
            'Cypress Cloud projectId correctness (cross-reference CLAUDE.md)',
            'Cypress recording enabled (record: true, parallel: true)',
            'Linting enforcement (no continue-on-error)',
            'Formatting validation (Prettier checks)',
            'Caching strategy (is it using latest actions/cache@v4?)',
            'Compliance with CLAUDE.md rules',
          ],
        },
        {
          step: 4,
          action: 'Create compliance scorecard',
          format: 'Table with Before/After columns showing rule violations',
        },
      ],

      outputs: [
        'List of workflow files with sizes',
        'Identified problems with severity',
        'Compliance scorecard (X/6 rules)',
        'Performance baseline (current pipeline time)',
      ],
    },

    phase_2_research: {
      name: 'Maximum Research with WebSearch',
      duration: '10-15 minutes',
      importance: 'CRITICAL - This is where MAXIMUM capability is applied!',

      research_queries: [
        {
          topic: 'Cypress Cloud GitHub Actions Integration',
          query: 'Cypress Cloud GitHub Actions integration [CURRENT_YEAR] best practices parallel recording',
          focus: [
            'Latest parameters (record, parallel, tag, group)',
            'Matrix strategy configuration',
            'GITHUB_TOKEN usage for build identification',
            'Docker image recommendations',
            'fail-fast settings for Cloud recording',
            'Avoiding re-run pitfalls',
          ],
        },
        {
          topic: 'Next.js CI/CD Optimization',
          query: 'Next.js [VERSION] GitHub Actions CI/CD pipeline best practices [CURRENT_YEAR]',
          focus: [
            'Build caching strategies',
            '.next/cache directory caching',
            'Environment variable handling',
            'Vercel integration best practices',
            'Build optimization techniques',
          ],
        },
        {
          topic: 'GitHub Actions Performance',
          query: 'GitHub Actions workflow optimization caching strategies [CURRENT_YEAR]',
          focus: [
            'Latest actions/cache version and features',
            'Hash-based cache key strategies',
            'Restore key fallback patterns',
            'Cross-job caching',
            'Concurrency management',
            'Performance benchmarks (% improvements)',
          ],
        },
      ],

      tools_used: ['WebSearch', 'WebFetch (if needed)'],

      output_format: {
        research_sources: [
          {
            topic: 'String',
            urls: ['Array of URLs'],
            key_findings: ['Array of actionable insights'],
          },
        ],
      },
    },

    phase_3_implementation: {
      name: 'Apply Improvements Based on Research',
      duration: '15-20 minutes',

      fixes_to_apply: [
        {
          priority: 'CRITICAL',
          fix: 'Cypress Cloud Configuration',
          actions: [
            'Fix projectId in cypress.config.js if incorrect',
            'Add record: true to Cypress GitHub Action',
            'Add parallel: true to Cypress GitHub Action',
            'Add GITHUB_TOKEN environment variable',
            'Add ci-build-id for unique run identification',
            'Configure matrix strategy with fail-fast: false',
          ],
        },
        {
          priority: 'CRITICAL',
          fix: 'Code Quality Enforcement',
          actions: [
            'Remove continue-on-error from linting steps',
            'Add Prettier formatting check',
            'Add format and format:check scripts to package.json',
            'Ensure quality checks run before build/test',
          ],
        },
        {
          priority: 'HIGH',
          fix: 'Advanced Caching',
          actions: [
            'Upgrade to actions/cache@v4 (latest)',
            'Implement hash-based cache keys',
            'Cache ~/.npm and .next/cache directories',
            'Add restore-keys for fallback matching',
          ],
        },
        {
          priority: 'HIGH',
          fix: 'Workflow Consolidation',
          actions: [
            'Create single optimized main.yml workflow',
            'Implement job dependencies with needs keyword',
            'Add concurrency management (cancel old runs)',
            'Conditional deployment (production only)',
          ],
        },
        {
          priority: 'MEDIUM',
          fix: 'Documentation Updates',
          actions: [
            'Update secrets documentation with CYPRESS_RECORD_KEY',
            'Fix MongoDB URI to include database name',
            'Create comprehensive workflow README',
            'Create executive summary document',
          ],
        },
      ],

      file_modifications: [
        'cypress.config.js - Fix projectId',
        'package.json - Add test/format scripts',
        '.github/workflows/main.yml - Create optimized pipeline',
        'GITHUB-SECRETS-SETUP.md - Update with Cypress Cloud',
        '.github/workflows/README.md - Research documentation',
        'CI-CD-IMPROVEMENTS-SUMMARY.md - Executive summary',
      ],
    },

    phase_4_documentation: {
      name: 'Comprehensive Documentation',
      duration: '10-15 minutes',

      documents_to_create: [
        {
          file: '.github/workflows/README.md',
          content: [
            'Research sources with URLs',
            'Detailed explanation of ALL improvements',
            'Performance benchmarks',
            'Compliance scorecard',
            'Troubleshooting guide',
            'Best practices checklist',
          ],
          size: '~500 lines',
        },
        {
          file: 'CI-CD-IMPROVEMENTS-SUMMARY.md',
          content: [
            'Executive summary',
            'What was done (bullet points)',
            'Files modified',
            'Performance improvements',
            'Compliance improvements',
            'Testing instructions',
            'Cleanup recommendations',
          ],
          size: '~300 lines',
        },
      ],

      documentation_principles: [
        'Research-backed (cite sources)',
        'Quantitative (show numbers: 72% faster)',
        'Actionable (clear next steps)',
        'Complete (cover all changes)',
        'Professional (ready for team review)',
      ],
    },

    phase_5_persistence: {
      name: 'MongoDB Enrichment',
      duration: '5 minutes',

      collections_to_enrich: [
        {
          collection: 'case-patterns',
          document: {
            pattern_id: 'Generated from session',
            title: 'Descriptive title with year',
            category: 'DevOps & CI/CD',
            problem: 'Comprehensive problem description',
            solution: 'Step-by-step solution with code',
            results: 'Performance metrics and compliance',
            research_sources: 'All WebSearch findings',
            reusability: 'high',
          },
        },
        {
          collection: 'abilities',
          documents: [
            'Sub-abilities learned (Cypress Cloud, caching, etc.)',
            'Implementation examples',
            'Knowledge concepts',
          ],
        },
        {
          collection: 'hunt-conversations',
          document: {
            session_id: 'Generated from date',
            session_type: 'ci-cd-improvement',
            research_conducted: 'WebSearch queries and findings',
            actions_taken: 'Files modified and changes',
            results: 'Performance and compliance improvements',
            outcome: 'success',
          },
        },
      ],

      script_to_run: 'save-cicd-optimization-[DATE].js',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎯 REQUIRED KNOWLEDGE & SKILLS
  // ═══════════════════════════════════════════════════════════════════════════
  required_knowledge: {
    github_actions: {
      concepts: [
        'Workflow syntax and job dependencies',
        'Matrix strategy for parallelization',
        'Actions marketplace and versioning',
        'Secrets and environment variables',
        'Conditional job execution',
        'Concurrency management',
        'Artifact upload/download',
      ],
      latest_features: [
        'actions/cache@v4 (Feb 2025 rewrite)',
        'actions/upload-artifact@v4',
        'actions/download-artifact@v4',
        'Improved concurrency controls',
      ],
    },

    cypress_cloud: {
      concepts: [
        'Recording vs local execution',
        'Parallel test load balancing',
        'Build identification',
        'Run grouping and tagging',
        'Flaky test detection',
        'Dashboard analytics',
      ],
      critical_parameters: [
        'record: true - Enables Cloud recording',
        'parallel: true - Enables load balancing',
        'CYPRESS_RECORD_KEY - Authentication',
        'GITHUB_TOKEN - Build identification',
        'ci-build-id - Unique run ID',
        'fail-fast: false - Prevents hanging runs',
      ],
    },

    performance_optimization: {
      caching: [
        'Hash-based cache keys',
        'Restore key fallback patterns',
        'Cache invalidation strategies',
        'Cross-job caching',
      ],
      parallelization: [
        'Matrix strategy configuration',
        'Load balancing across containers',
        'Independent job execution',
        'fail-fast considerations',
      ],
      benchmarking: [
        'Baseline performance measurement',
        'Before/after comparisons',
        'Percentage improvements',
        'Breakdown by stage (build, test, deploy)',
      ],
    },

    code_quality: {
      enforcement: [
        'Blocking vs non-blocking checks',
        'continue-on-error anti-pattern',
        'Pre-build quality gates',
        'Format validation (Prettier)',
        'Lint validation (ESLint)',
      ],
      compliance: [
        'CLAUDE.md rule verification',
        'Scorecard creation',
        'Before/after compliance tracking',
      ],
    },

    research_capability: {
      web_search: [
        'Formulating effective queries with year/version',
        'Identifying authoritative sources (official docs)',
        'Extracting actionable insights',
        'Cross-referencing multiple sources',
      ],
      synthesis: [
        'Combining research from multiple topics',
        'Identifying common patterns',
        'Prioritizing recommendations',
        'Documenting sources properly',
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎯 SUCCESS CRITERIA
  // ═══════════════════════════════════════════════════════════════════════════
  success_criteria: {
    performance: {
      build_time_reduction: '>= 50%',
      test_time_reduction: '>= 50%',
      total_pipeline_reduction: '>= 50%',
    },

    compliance: {
      claude_md_rules: '100% (6/6)',
      required_fixes: [
        'Cypress Cloud recording enabled',
        'Linting enforced (no continue-on-error)',
        'Formatting enforced (Prettier check)',
      ],
    },

    quality: {
      research_queries: '>= 3 comprehensive WebSearch queries',
      documentation: '>= 500 lines of comprehensive docs',
      code_examples: 'Complete working examples provided',
      sources_cited: 'All research sources with URLs',
    },

    deliverables: {
      optimized_workflow: 'Single consolidated main.yml',
      documentation: 'README.md + Summary.md',
      mongodb_enrichment: 'All 3 collections updated',
      test_instructions: 'Clear step-by-step guide',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎯 TOOLS & TECHNIQUES
  // ═══════════════════════════════════════════════════════════════════════════
  tools_used: {
    analysis: ['Read', 'Glob', 'Grep'],
    research: ['WebSearch', 'WebFetch'],
    implementation: ['Edit', 'Write'],
    verification: ['Bash'],
    persistence: ['MongoDB scripts'],
    planning: ['TodoWrite'],
  },

  techniques: {
    research: [
      'Formulate year-specific queries (2025)',
      'Target official documentation sources',
      'Extract quantitative benchmarks',
      'Identify breaking changes and deprecations',
    ],
    analysis: [
      'Compliance scorecard creation',
      'Performance baseline measurement',
      'Problem prioritization (Critical/High/Medium)',
      'Root cause identification',
    ],
    implementation: [
      'Incremental changes with testing',
      'Research-backed decisions only',
      'Complete documentation alongside code',
      'CLAUDE.md rule compliance verification',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎯 TYPICAL RESULTS
  // ═══════════════════════════════════════════════════════════════════════════
  typical_results: {
    performance_improvements: {
      pipeline_speed: '70-80% faster',
      build_speed: '70-80% faster (caching)',
      test_speed: '70-75% faster (parallelization)',
    },

    compliance_improvements: {
      before: '~50% (3/6 rules)',
      after: '100% (6/6 rules)',
    },

    new_capabilities: [
      'Cypress Cloud dashboard with analytics',
      'Parallel test execution (4+ containers)',
      'Flaky test detection',
      'Screenshot/video capture on failures',
      'Advanced build caching',
      'Code quality enforcement',
      'Professional documentation',
    ],

    knowledge_artifacts: [
      '1 high-reusability case pattern',
      '4+ specialized abilities',
      '1 comprehensive hunt conversation',
      '800+ lines of documentation',
      '3+ research sources cited',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎯 EXAMPLE EXECUTION
  // ═══════════════════════════════════════════════════════════════════════════
  example_execution: {
    user_request: 'improve the pipeline my bro, also include the cypress cloud on the ci cd, research at your max capability',

    assistant_actions: [
      '1. Create TodoWrite with all phases',
      '2. Read existing workflow files (.github/workflows/*.yml)',
      '3. Read cypress.config.js, package.json',
      '4. Identify problems (wrong projectId, no recording, etc.)',
      '5. WebSearch: Cypress Cloud best practices 2025',
      '6. WebSearch: Next.js CI/CD optimization 2025',
      '7. WebSearch: GitHub Actions caching 2025',
      '8. Fix cypress.config.js projectId',
      '9. Add test/format scripts to package.json',
      '10. Create optimized .github/workflows/main.yml',
      '11. Update GITHUB-SECRETS-SETUP.md',
      '12. Create .github/workflows/README.md (500+ lines)',
      '13. Create CI-CD-IMPROVEMENTS-SUMMARY.md',
      '14. Create save-cicd-optimization-[DATE].js',
      '15. Execute MongoDB enrichment script',
      '16. Provide user with summary and next steps',
    ],

    time_to_complete: '45-60 minutes',

    final_deliverables: [
      'Optimized main.yml workflow (72% faster)',
      '800+ lines of documentation',
      'MongoDB enrichment (3 collections)',
      'Testing instructions',
      'Compliance: 100%',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎯 COMMON PITFALLS TO AVOID
  // ═══════════════════════════════════════════════════════════════════════════
  pitfalls_to_avoid: [
    {
      pitfall: 'Skipping research phase',
      why_bad: 'Recommendations not backed by current best practices',
      solution: 'ALWAYS conduct WebSearch for latest practices',
    },
    {
      pitfall: 'Not measuring baseline performance',
      why_bad: 'Cannot prove improvements with numbers',
      solution: 'Document current pipeline time BEFORE optimizing',
    },
    {
      pitfall: 'Assuming Cypress Cloud works with just projectId',
      why_bad: 'Need BOTH record: true AND parallel: true',
      solution: 'Check all required parameters from research',
    },
    {
      pitfall: 'Leaving continue-on-error on linting',
      why_bad: 'Violates CLAUDE.md Rule 2.1, allows broken code',
      solution: 'Remove all continue-on-error from quality checks',
    },
    {
      pitfall: 'Not documenting research sources',
      why_bad: 'Cannot verify recommendations or update later',
      solution: 'Include URLs and key findings in documentation',
    },
    {
      pitfall: 'Skipping MongoDB enrichment',
      why_bad: 'Knowledge not preserved for future sessions',
      solution: 'ALWAYS create and run enrichment script',
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎯 META-DATA
  // ═══════════════════════════════════════════════════════════════════════════
  proficiency: 'expert',
  complexity: 'high',
  time_investment: '45-60 minutes',
  reusability: 'very-high',

  learned_from: 'CI/CD optimization session - Oct 19, 2025',
  date_learned: new Date('2025-10-19'),
  created_by: 'Neko-Arc with Claude Code',

  sub_abilities_required: [
    'cypress-cloud-integration-2025',
    'github-actions-cache-v4-optimization',
    'ci-cd-quality-enforcement',
    'workflow-consolidation-strategy',
  ],

  tags: [
    'meta-ability',
    'orchestration',
    'ci-cd-optimization',
    'research-capability',
    'maximum-research',
    'github-actions',
    'cypress-cloud',
    'performance-optimization',
    'compliance-enforcement',
    'documentation-mastery',
  ],

  notes: [
    'This is a COMPOUND meta-ability that orchestrates multiple specialized abilities',
    'Requires maximum research capability (WebSearch with multiple queries)',
    'Produces measurable results (70-80% performance improvements)',
    'Ensures 100% compliance with project standards (CLAUDE.md)',
    'Creates comprehensive documentation (800+ lines)',
    'Persists knowledge to MongoDB for future sessions',
    'Case name: "optimize my github ci cd bro"',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 💾 MAIN FUNCTION - SAVE TO MONGODB
// ═══════════════════════════════════════════════════════════════════════════
async function saveMetaAbility() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🐾⚡ CONNECTING TO MONGODB ATLAS... ⚡🐾');
    await client.connect();
    console.log('✅ Connected successfully, nyaa~!\n');

    const db = client.db(DATABASE_NAME);
    const abilitiesCollection = db.collection('abilities');

    // Save meta-ability
    console.log('🎯 SAVING META-ABILITY...');
    const result = await abilitiesCollection.updateOne(
      { ability_id: metaAbility.ability_id },
      { $set: metaAbility },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log('   ✅ Meta-ability CREATED:', metaAbility.name);
    } else if (result.modifiedCount > 0) {
      console.log('   ✅ Meta-ability UPDATED:', metaAbility.name);
    } else {
      console.log('   ℹ️  Meta-ability unchanged:', metaAbility.name);
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 META-ABILITY SAVED - LEGENDARY MODE! 🐾⚡');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('📋 Details:');
    console.log('   🎯 Ability:', metaAbility.name);
    console.log('   📛 Case Name:', metaAbility.case_name);
    console.log('   📂 Category:', metaAbility.category);
    console.log('   🎓 Type:', metaAbility.type);
    console.log('   ⭐ Proficiency:', metaAbility.proficiency);
    console.log('   🔄 Complexity:', metaAbility.complexity);
    console.log('   ⏱️  Time Investment:', metaAbility.time_investment);
    console.log('   ♻️  Reusability:', metaAbility.reusability);
    console.log('');
    console.log('🔧 Sub-Abilities Required:', metaAbility.sub_abilities_required.length);
    metaAbility.sub_abilities_required.forEach(sub => {
      console.log('      -', sub);
    });
    console.log('');
    console.log('📊 Typical Results:');
    console.log('   ⚡ Pipeline Speed:', metaAbility.typical_results.performance_improvements.pipeline_speed);
    console.log('   📊 Compliance:', metaAbility.typical_results.compliance_improvements.after);
    console.log('   📚 Documentation:', '800+ lines');
    console.log('   🗄️  Knowledge Artifacts:', metaAbility.typical_results.knowledge_artifacts.length);
    console.log('');
    console.log('*purrs with meta-ability mastery* 😻🎯');
    console.log('');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    throw error;
  } finally {
    await client.close();
    console.log('🐾 MongoDB connection closed, desu~!');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 RUN THE SAVE
// ═══════════════════════════════════════════════════════════════════════════
if (require.main === module) {
  saveMetaAbility()
    .then(() => {
      console.log('✅ Meta-ability saved successfully, nyaa~!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { saveMetaAbility, metaAbility };
