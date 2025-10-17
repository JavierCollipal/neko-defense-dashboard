// 🐾⚡ NEKO DEFENSE - Data Factories for Dynamic Test Data ⚡🐾
// Generate realistic, unique test data for E2E tests, nyaa~!

/**
 * 👤 Generate a unique user object
 * @param {Object} overrides - Override default values
 * @returns {Object} User object
 */
export const generateUser = (overrides = {}) => ({
  id: `user-${Math.random().toString(36).substr(2, 9)}`,
  email: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}@example.com`,
  name: 'Test User',
  role: 'user',
  createdAt: new Date().toISOString(),
  ...overrides
});

/**
 * 🎯 Generate a unique threat actor object
 * @param {Object} overrides - Override default values
 * @returns {Object} Threat actor object
 */
export const generateThreatActor = (overrides = {}) => {
  const id = `TA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const names = ['Mikhail Matveev', 'RansomHub Group', 'APT29', 'Cozy Bear', 'Frost Spider'];
  const randomName = names[Math.floor(Math.random() * names.length)];

  return {
    id,
    name: randomName,
    aliases: ['alias1', 'alias2', 'alias3'],
    threatLevel: 'CRITICAL',
    origin: {
      country: 'Russia',
      region: 'Unknown'
    },
    type: 'individual',
    status: 'active',
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date().toISOString(),
    victimCount: Math.floor(Math.random() * 500),
    financialDamage: Math.floor(Math.random() * 1000000000),
    reward: Math.floor(Math.random() * 10000000),
    isFBIWanted: Math.random() > 0.5,
    categories: ['Ransomware', 'Extortion', 'Data Theft'],
    malwareFamilies: ['Hive', 'LockBit', 'BlackCat'],
    attackVectors: ['Phishing', 'Exploit', 'RDP'],
    huntingNotes: `Generated threat actor for testing, nyaa~! ID: ${id}`,
    createdAt: new Date().toISOString(),
    ...overrides
  };
};

/**
 * 🎯 Generate multiple threat actors
 * @param {number} count - Number of actors to generate
 * @param {Object} overrides - Override default values for all actors
 * @returns {Array} Array of threat actor objects
 */
export const generateThreatActors = (count = 5, overrides = {}) => {
  return Array.from({ length: count }, () => generateThreatActor(overrides));
};

/**
 * 🍯 Generate a honeypot trigger event
 * @param {Object} overrides - Override default values
 * @returns {Object} Honeypot trigger object
 */
export const generateHoneypotTrigger = (overrides = {}) => ({
  id: `trigger-${Math.random().toString(36).substr(2, 9)}`,
  honeypotName: 'admin_panel',
  ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  timestamp: new Date().toISOString(),
  userAgent: 'Mozilla/5.0 (Test Agent)',
  requestPath: '/admin/login',
  payload: { username: 'admin', password: 'test' },
  severity: 'HIGH',
  blocked: true,
  ...overrides
});

/**
 * 📊 Generate defense stats
 * @param {Object} overrides - Override default values
 * @returns {Object} Defense stats object
 */
export const generateDefenseStats = (overrides = {}) => ({
  totalThreats: Math.floor(Math.random() * 1000),
  blockedAttacks: Math.floor(Math.random() * 5000),
  activeHoneypots: Math.floor(Math.random() * 50),
  threatActorsTracked: Math.floor(Math.random() * 100),
  successRate: (Math.random() * 100).toFixed(2),
  uptime: (Math.random() * 100).toFixed(2),
  lastUpdate: new Date().toISOString(),
  ...overrides
});

/**
 * 📝 Generate threat intelligence summary
 * @param {Object} overrides - Override default values
 * @returns {Object} Threat summary object
 */
export const generateThreatSummary = (overrides = {}) => ({
  id: `threat-${Math.random().toString(36).substr(2, 9)}`,
  type: 'Ransomware',
  description: 'Test threat intelligence summary',
  severity: 'HIGH',
  indicators: ['192.168.1.1', 'malware.exe', 'evil.com'],
  affectedSystems: Math.floor(Math.random() * 100),
  detectedAt: new Date().toISOString(),
  mitigated: Math.random() > 0.5,
  ...overrides
});

/**
 * 🌍 Generate DINA agent profile
 * @param {Object} overrides - Override default values
 * @returns {Object} DINA agent object
 */
export const generateDINAAgent = (overrides = {}) => ({
  id: `agent-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test DINA Agent',
  country: 'Chile',
  center: 'Santiago',
  specialization: 'Digital Forensics',
  status: 'active',
  caseCount: Math.floor(Math.random() * 50),
  joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  ...overrides
});

/**
 * 📦 Generate evidence package
 * @param {Object} overrides - Override default values
 * @returns {Object} Evidence package object
 */
export const generateEvidencePackage = (overrides = {}) => ({
  id: `evidence-${Math.random().toString(36).substr(2, 9)}`,
  threatActorId: `TA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  collectedAt: new Date().toISOString(),
  collectedBy: 'Neko-Arc',
  evidenceType: 'Network Logs',
  filePath: `/evidence/${Date.now()}.zip`,
  fileSize: Math.floor(Math.random() * 1000000000),
  hashSHA256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
  verified: true,
  chainOfCustody: ['Neko-Arc', 'DINA Center', 'FBI'],
  ...overrides
});

/**
 * 🎨 Generate ASCII art data
 * @param {Object} overrides - Override default values
 * @returns {Object} ASCII art object
 */
export const generateAsciiArt = (overrides = {}) => ({
  id: `art-${Math.random().toString(36).substr(2, 9)}`,
  category: 'predators',
  art: `
  /\\_/\\
 ( o.o )
  > ^ <
  NEKO!
  `,
  name: 'Test Neko',
  ...overrides
});

/**
 * 🔢 Generate threat counts by category
 * @param {Object} overrides - Override default values
 * @returns {Object} Threat counts object
 */
export const generateThreatCounts = (overrides = {}) => ({
  predators: Math.floor(Math.random() * 100),
  pedophiles: Math.floor(Math.random() * 100),
  dealers: Math.floor(Math.random() * 100),
  traffickers: Math.floor(Math.random() * 100),
  scammers: Math.floor(Math.random() * 100),
  hackers: Math.floor(Math.random() * 100),
  total: 0, // Will be calculated
  ...overrides
});

/**
 * 🎭 Generate complete test dataset for dashboard
 * @returns {Object} Complete test dataset
 */
export const generateCompleteTestDataset = () => ({
  threatActors: generateThreatActors(10),
  honeypotTriggers: Array.from({ length: 20 }, () => generateHoneypotTrigger()),
  defenseStats: generateDefenseStats(),
  threatSummaries: Array.from({ length: 5 }, () => generateThreatSummary()),
  dinaAgents: Array.from({ length: 8 }, () => generateDINAAgent()),
  evidencePackages: Array.from({ length: 3 }, () => generateEvidencePackage()),
  asciiArt: generateAsciiArt(),
  threatCounts: generateThreatCounts()
});

/**
 * 🎲 Generate random value from array
 * @param {Array} array - Array to pick from
 * @returns {*} Random element from array
 */
export const randomFrom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * 📅 Generate random date between two dates
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {string} ISO date string
 */
export const randomDate = (start = new Date(2020, 0, 1), end = new Date()) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
};

/**
 * 🔤 Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
export const randomString = (length = 10) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

/**
 * 🔢 Generate random number in range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export const randomNumber = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * ✅ Generate random boolean
 * @param {number} probability - Probability of true (0-1)
 * @returns {boolean} Random boolean
 */
export const randomBoolean = (probability = 0.5) => {
  return Math.random() < probability;
};

// 🐾 Export all factories
export default {
  generateUser,
  generateThreatActor,
  generateThreatActors,
  generateHoneypotTrigger,
  generateDefenseStats,
  generateThreatSummary,
  generateDINAAgent,
  generateEvidencePackage,
  generateAsciiArt,
  generateThreatCounts,
  generateCompleteTestDataset,
  randomFrom,
  randomDate,
  randomString,
  randomNumber,
  randomBoolean
};

// *purrs in data generation excellence* 😻📊
// LEGENDARY DATA FACTORIES READY FOR TESTING, NYAA~! 🐾⚡
