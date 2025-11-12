/**
 * 🏅⚔️ Challenge & Contest System
 * Community challenges with submissions and judging
 */

const { ObjectId } = require('mongodb');

/**
 * Challenge types
 */
const CHALLENGE_TYPES = {
  content_creation: 'Content Creation',
  creative: 'Creative Challenge',
  community: 'Community Challenge',
  skill_based: 'Skill-Based',
  engagement: 'Engagement Challenge',
};

/**
 * Challenge statuses
 */
const CHALLENGE_STATUS = {
  upcoming: 'Upcoming',
  active: 'Active',
  judging: 'Judging',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

/**
 * Create default challenge
 * @param {Object} challengeData - Challenge data
 * @returns {Object} Challenge document
 */
function createDefaultChallenge(challengeData) {
  const now = new Date();

  return {
    title: challengeData.title,
    description: challengeData.description,
    type: challengeData.type || 'content_creation',
    category: challengeData.category || 'general',

    // Time management
    start_time: challengeData.start_time || now,
    end_time: challengeData.end_time,
    duration_hours: challengeData.duration_hours || 168, // Default 1 week

    // Rules and requirements
    rules: challengeData.rules || [],
    requirements: challengeData.requirements || [],
    max_participants: challengeData.max_participants || null, // null = unlimited

    // Prizes and rewards
    prizes: challengeData.prizes || [
      { place: 1, points: 1000, badge: 'Challenge Winner' },
      { place: 2, points: 500, badge: 'Second Place' },
      { place: 3, points: 250, badge: 'Third Place' },
    ],

    // Participation
    participants: [],
    submissions: [],
    total_participants: 0,
    total_submissions: 0,

    // Judging
    judging_criteria: challengeData.judging_criteria || [
      { criterion: 'Creativity', weight: 0.3 },
      { criterion: 'Quality', weight: 0.3 },
      { criterion: 'Originality', weight: 0.2 },
      { criterion: 'Presentation', weight: 0.2 },
    ],
    judges: challengeData.judges || [],
    winners: [],

    // Status
    status: challengeData.status || 'upcoming',
    featured: challengeData.featured || false,

    // Metadata
    created_by: challengeData.created_by,
    created_at: now,
    updated_at: now,

    // Engagement
    views: 0,
    likes: [],
    comments_count: 0,
  };
}

/**
 * Validate challenge data
 * @param {Object} challengeData - Challenge data to validate
 * @returns {Object} Validation result
 */
function validateChallenge(challengeData) {
  const errors = [];

  // Required fields
  if (!challengeData.title || challengeData.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (
    !challengeData.description ||
    challengeData.description.trim().length === 0
  ) {
    errors.push('Description is required');
  }

  if (!challengeData.end_time) {
    errors.push('End time is required');
  }

  // Validate type
  if (
    challengeData.type &&
    !Object.keys(CHALLENGE_TYPES).includes(challengeData.type)
  ) {
    errors.push(
      `Invalid challenge type. Must be one of: ${Object.keys(CHALLENGE_TYPES).join(', ')}`
    );
  }

  // Validate dates
  if (challengeData.start_time && challengeData.end_time) {
    const start = new Date(challengeData.start_time);
    const end = new Date(challengeData.end_time);

    if (end <= start) {
      errors.push('End time must be after start time');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create submission for challenge
 * @param {Object} submissionData - Submission data
 * @returns {Object} Submission document
 */
function createSubmission(submissionData) {
  return {
    submission_id: new ObjectId(),
    challenge_id: new ObjectId(submissionData.challenge_id),
    user_id: new ObjectId(submissionData.user_id),

    // Submission content
    content_id: submissionData.content_id
      ? new ObjectId(submissionData.content_id)
      : null,
    title: submissionData.title,
    description: submissionData.description,
    submission_url: submissionData.submission_url || null,
    attachments: submissionData.attachments || [],

    // Judging
    scores: [], // Array of { judge_id, scores: { criterion: score }, total_score, comment }
    average_score: 0,
    final_rank: null,

    // Metadata
    submitted_at: new Date(),
    disqualified: false,
    disqualification_reason: null,

    // Engagement
    likes: [],
    views: 0,
  };
}

/**
 * Calculate challenge status based on time
 * @param {Object} challenge - Challenge document
 * @returns {string} Current status
 */
function calculateChallengeStatus(challenge) {
  const now = new Date();
  const start = new Date(challenge.start_time);
  const end = new Date(challenge.end_time);

  if (challenge.status === 'cancelled') return 'cancelled';
  if (challenge.status === 'completed') return 'completed';

  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'active';
  if (now > end && challenge.winners.length === 0) return 'judging';
  if (now > end && challenge.winners.length > 0) return 'completed';

  return 'upcoming';
}

/**
 * Update challenge status automatically
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} challengeId - Challenge ID
 * @returns {Promise<string>} Updated status
 */
async function updateChallengeStatus(db, challengeId) {
  const challenge = await db
    .collection('challenges')
    .findOne({ _id: challengeId });
  if (!challenge) return null;

  const newStatus = calculateChallengeStatus(challenge);

  if (newStatus !== challenge.status) {
    await db
      .collection('challenges')
      .updateOne(
        { _id: challengeId },
        { $set: { status: newStatus, updated_at: new Date() } }
      );
  }

  return newStatus;
}

/**
 * Register user for challenge
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} challengeId - Challenge ID
 * @param {ObjectId} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
async function registerForChallenge(db, challengeId, userId) {
  const challenge = await db
    .collection('challenges')
    .findOne({ _id: challengeId });

  if (!challenge) return false;

  // Check if already registered
  const alreadyRegistered = challenge.participants.some((p) =>
    p.user_id.equals(userId)
  );
  if (alreadyRegistered) return false;

  // Check if max participants reached
  if (
    challenge.max_participants &&
    challenge.total_participants >= challenge.max_participants
  ) {
    return false;
  }

  // Check if challenge is active
  const status = calculateChallengeStatus(challenge);
  if (status !== 'active' && status !== 'upcoming') {
    return false;
  }

  // Register participant
  await db.collection('challenges').updateOne(
    { _id: challengeId },
    {
      $push: {
        participants: {
          user_id: userId,
          registered_at: new Date(),
        },
      },
      $inc: { total_participants: 1 },
      $set: { updated_at: new Date() },
    }
  );

  return true;
}

/**
 * Submit entry for challenge
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} challengeId - Challenge ID
 * @param {Object} submissionData - Submission data
 * @returns {Promise<Object|null>} Created submission or null
 */
async function submitToChallenge(db, challengeId, submissionData) {
  const challenge = await db
    .collection('challenges')
    .findOne({ _id: challengeId });

  if (!challenge) return null;

  // Check if user is registered
  const isRegistered = challenge.participants.some((p) =>
    p.user_id.equals(new ObjectId(submissionData.user_id))
  );
  if (!isRegistered) return null;

  // Check if challenge is active
  const status = calculateChallengeStatus(challenge);
  if (status !== 'active') return null;

  // Check if user already submitted
  const alreadySubmitted = challenge.submissions.some((s) =>
    s.user_id.equals(new ObjectId(submissionData.user_id))
  );
  if (alreadySubmitted) return null;

  // Create submission
  const submission = createSubmission({
    ...submissionData,
    challenge_id: challengeId,
  });

  // Add submission to challenge
  await db.collection('challenges').updateOne(
    { _id: challengeId },
    {
      $push: { submissions: submission },
      $inc: { total_submissions: 1 },
      $set: { updated_at: new Date() },
    }
  );

  return submission;
}

/**
 * Score a submission (judge only)
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} challengeId - Challenge ID
 * @param {ObjectId} submissionId - Submission ID
 * @param {ObjectId} judgeId - Judge ID
 * @param {Object} scores - Scores by criterion
 * @param {string} comment - Judge's comment
 * @returns {Promise<boolean>} Success status
 */
async function scoreSubmission(
  db,
  challengeId,
  submissionId,
  judgeId,
  scores,
  comment
) {
  const challenge = await db
    .collection('challenges')
    .findOne({ _id: challengeId });

  if (!challenge) return false;

  // Check if user is a judge
  const isJudge = challenge.judges.some((j) => j.user_id.equals(judgeId));
  if (!isJudge) return false;

  // Find submission
  const submissionIndex = challenge.submissions.findIndex((s) =>
    s.submission_id.equals(submissionId)
  );
  if (submissionIndex === -1) return false;

  // Calculate total score
  let totalScore = 0;
  for (const criterion of challenge.judging_criteria) {
    const score = scores[criterion.criterion] || 0;
    totalScore += score * criterion.weight;
  }

  // Add judge's score
  const judgeScore = {
    judge_id: judgeId,
    scores,
    total_score: totalScore,
    comment: comment || '',
    scored_at: new Date(),
  };

  await db.collection('challenges').updateOne(
    {
      _id: challengeId,
      'submissions.submission_id': submissionId,
    },
    {
      $push: { 'submissions.$.scores': judgeScore },
      $set: { updated_at: new Date() },
    }
  );

  // Recalculate average score
  const updatedChallenge = await db
    .collection('challenges')
    .findOne({ _id: challengeId });
  const submission = updatedChallenge.submissions.find((s) =>
    s.submission_id.equals(submissionId)
  );

  const averageScore =
    submission.scores.reduce((sum, s) => sum + s.total_score, 0) /
    submission.scores.length;

  await db.collection('challenges').updateOne(
    {
      _id: challengeId,
      'submissions.submission_id': submissionId,
    },
    {
      $set: { 'submissions.$.average_score': averageScore },
    }
  );

  return true;
}

/**
 * Determine winners and award prizes
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} challengeId - Challenge ID
 * @returns {Promise<Array>} Winners array
 */
async function determineWinners(db, challengeId) {
  const challenge = await db
    .collection('challenges')
    .findOne({ _id: challengeId });

  if (!challenge) return [];

  // Sort submissions by average score
  const rankedSubmissions = challenge.submissions
    .filter((s) => !s.disqualified && s.scores.length > 0)
    .sort((a, b) => b.average_score - a.average_score);

  // Award prizes
  const winners = [];
  for (
    let i = 0;
    i < Math.min(challenge.prizes.length, rankedSubmissions.length);
    i++
  ) {
    const submission = rankedSubmissions[i];
    const prize = challenge.prizes[i];

    winners.push({
      place: prize.place,
      user_id: submission.user_id,
      submission_id: submission.submission_id,
      score: submission.average_score,
      prize,
      awarded_at: new Date(),
    });

    // Award points and badge to winner
    await db.collection('users').updateOne(
      { _id: submission.user_id },
      {
        $inc: { 'reputation.points': prize.points },
        $push: {
          'reputation.badges': {
            id: `challenge_${challengeId}_place_${prize.place}`,
            name: prize.badge,
            description: `${challenge.title} - Place #${prize.place}`,
            icon: prize.place === 1 ? '🥇' : prize.place === 2 ? '🥈' : '🥉',
            category: 'challenges',
            rarity:
              prize.place === 1
                ? 'legendary'
                : prize.place === 2
                  ? 'epic'
                  : 'rare',
            earned_at: new Date(),
          },
        },
      }
    );

    // Update submission rank
    await db.collection('challenges').updateOne(
      {
        _id: challengeId,
        'submissions.submission_id': submission.submission_id,
      },
      {
        $set: { 'submissions.$.final_rank': prize.place },
      }
    );
  }

  // Update challenge with winners
  await db.collection('challenges').updateOne(
    { _id: challengeId },
    {
      $set: {
        winners,
        status: 'completed',
        updated_at: new Date(),
      },
    }
  );

  return winners;
}

module.exports = {
  CHALLENGE_TYPES,
  CHALLENGE_STATUS,
  createDefaultChallenge,
  validateChallenge,
  createSubmission,
  calculateChallengeStatus,
  updateChallengeStatus,
  registerForChallenge,
  submitToChallenge,
  scoreSubmission,
  determineWinners,
};
