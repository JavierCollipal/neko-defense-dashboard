/**
 * 💬 Comment Thread Component
 * Displays threaded comments with reactions, replies, and editing
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  Flag as FlagIcon,
  PushPin as PinIcon,
} from '@mui/icons-material';

// Neko reactions from backend
const NEKO_REACTIONS = [
  { emoji: '🐾', name: 'paw', label: 'Nyaa!' },
  { emoji: '😻', name: 'heart_eyes', label: 'Kawaii!' },
  { emoji: '⚔️', name: 'sword', label: 'Epic!' },
  { emoji: '🎭', name: 'mask', label: 'Dramatic!' },
  { emoji: '🔥', name: 'fire', label: 'Fire!' },
  { emoji: '💎', name: 'gem', label: 'Gem!' },
  { emoji: '🏆', name: 'trophy', label: 'Winner!' },
  { emoji: '🤔', name: 'thinking', label: 'Hmm...' },
  { emoji: '😂', name: 'laugh', label: 'LOL!' },
  { emoji: '🎯', name: 'target', label: 'On Point!' },
  { emoji: '💖', name: 'love', label: 'Love it!' },
  { emoji: '⚡', name: 'lightning', label: 'Electric!' },
  { emoji: '🌟', name: 'star', label: 'Amazing!' },
  { emoji: '🛡️', name: 'shield', label: 'Protected!' },
  { emoji: '🔍', name: 'search', label: 'Insightful!' },
];

/**
 * Single Comment Component
 */
const Comment = ({
  comment,
  currentUser,
  authToken,
  onReply,
  onEdit,
  onDelete,
  onReact,
  level = 0,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [reactionMenuAnchor, setReactionMenuAnchor] = useState(null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const isOwnComment = currentUser && comment.author?._id === currentUser._id;
  const maxNestingLevel = 3; // Maximum reply nesting

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReactionMenuOpen = (event) => {
    setReactionMenuAnchor(event.currentTarget);
  };

  const handleReactionMenuClose = () => {
    setReactionMenuAnchor(null);
  };

  const handleReactionClick = (emoji) => {
    if (onReact) {
      onReact(comment._id, emoji);
    }
    handleReactionMenuClose();
  };

  const handleReplySubmit = () => {
    if (onReply && replyText.trim()) {
      onReply(comment._id, replyText.trim());
      setReplyText('');
      setShowReplyBox(false);
    }
  };

  const handleEditSubmit = () => {
    if (onEdit && editText.trim()) {
      onEdit(comment._id, editText.trim());
      setEditMode(false);
    }
  };

  const handleEditCancel = () => {
    setEditText(comment.text);
    setEditMode(false);
  };

  return (
    <Box
      sx={{
        ml: level > 0 ? 4 : 0,
        mb: 2,
        borderLeft: level > 0 ? '2px solid' : 'none',
        borderColor: 'divider',
        pl: level > 0 ? 2 : 0,
      }}
    >
      <Card variant="outlined">
        <CardContent>
          {/* Comment Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <Avatar
              src={comment.author?.avatar_url}
              alt={comment.author?.display_name}
              sx={{ width: 40, height: 40, mr: 2 }}
            >
              {comment.author?.display_name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2">
                  {comment.author?.display_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  @{comment.author?.username}
                </Typography>
                {comment.is_pinned && (
                  <Chip
                    icon={<PinIcon />}
                    label="Pinned"
                    size="small"
                    color="primary"
                  />
                )}
              </Box>

              <Typography variant="caption" color="text.secondary">
                {new Date(comment.created_at).toLocaleString()}
                {comment.is_edited && ' (edited)'}
              </Typography>
            </Box>

            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {isOwnComment && (
                <MenuItem
                  onClick={() => {
                    setEditMode(true);
                    handleMenuClose();
                  }}
                >
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  Edit
                </MenuItem>
              )}
              {isOwnComment && (
                <MenuItem
                  onClick={() => {
                    if (onDelete) onDelete(comment._id);
                    handleMenuClose();
                  }}
                >
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              )}
              <MenuItem onClick={handleMenuClose}>
                <FlagIcon fontSize="small" sx={{ mr: 1 }} />
                Report
              </MenuItem>
            </Menu>
          </Box>

          {/* Comment Text */}
          {editMode ? (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                multiline
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button size="small" onClick={handleEditCancel}>
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleEditSubmit}
                >
                  Save
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
              {comment.text}
            </Typography>
          )}

          {/* Reactions */}
          {comment.reaction_counts && Object.keys(comment.reaction_counts).length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {Object.entries(comment.reaction_counts).map(([emoji, count]) => (
                <Chip
                  key={emoji}
                  label={`${emoji} ${count}`}
                  size="small"
                  onClick={() => handleReactionClick(emoji)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon="😊"
              onClick={handleReactionMenuOpen}
            >
              React
            </Button>

            {level < maxNestingLevel && (
              <Button
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => setShowReplyBox(!showReplyBox)}
              >
                Reply
              </Button>
            )}
          </Box>

          {/* Reaction Menu */}
          <Menu
            anchorEl={reactionMenuAnchor}
            open={Boolean(reactionMenuAnchor)}
            onClose={handleReactionMenuClose}
          >
            <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
              {NEKO_REACTIONS.map((reaction) => (
                <Tooltip key={reaction.emoji} title={reaction.label}>
                  <IconButton
                    onClick={() => handleReactionClick(reaction.emoji)}
                    sx={{ fontSize: '1.5rem' }}
                  >
                    {reaction.emoji}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Menu>

          {/* Reply Box */}
          {showReplyBox && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  onClick={() => setShowReplyBox(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim()}
                >
                  Reply
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {comment.replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              currentUser={currentUser}
              authToken={authToken}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReact={onReact}
              level={level + 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

/**
 * CommentThread Component
 * @param {string} contentId - ID of the content to display comments for
 * @param {Object} currentUser - Current authenticated user
 * @param {string} authToken - JWT authentication token
 */
const CommentThread = ({ contentId, currentUser, authToken }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [posting, setPosting] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/comments/${contentId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch comments');
      }

      setComments(result.comments || []);
    } catch (err) {
      console.error('Fetch comments error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [contentId, API_URL]);

  useEffect(() => {
    if (contentId) {
      fetchComments();
    }
  }, [contentId, fetchComments]);

  // Post new comment
  const handlePostComment = async () => {
    if (!newCommentText.trim() || !authToken) return;

    try {
      setPosting(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content_id: contentId,
          text: newCommentText.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to post comment');
      }

      // Refresh comments
      await fetchComments();
      setNewCommentText('');
    } catch (err) {
      console.error('Post comment error:', err);
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  // Post reply
  const handleReply = async (parentCommentId, text) => {
    if (!authToken) return;

    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content_id: contentId,
          parent_comment_id: parentCommentId,
          text,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to post reply');
      }

      // Refresh comments
      await fetchComments();
    } catch (err) {
      console.error('Post reply error:', err);
      setError(err.message);
    }
  };

  // Edit comment
  const handleEdit = async (commentId, text) => {
    if (!authToken) return;

    try {
      const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to edit comment');
      }

      // Refresh comments
      await fetchComments();
    } catch (err) {
      console.error('Edit comment error:', err);
      setError(err.message);
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    if (!authToken || !confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete comment');
      }

      // Refresh comments
      await fetchComments();
    } catch (err) {
      console.error('Delete comment error:', err);
      setError(err.message);
    }
  };

  // React to comment
  const handleReact = async (commentId, emoji) => {
    if (!authToken) return;

    try {
      const response = await fetch(`${API_URL}/api/comments/${commentId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ emoji }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add reaction');
      }

      // Refresh comments to show updated reactions
      await fetchComments();
    } catch (err) {
      console.error('React error:', err);
      // Silently fail for reactions
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* New Comment Box */}
      {authToken ? (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={posting ? <CircularProgress size={20} /> : <SendIcon />}
                onClick={handlePostComment}
                disabled={!newCommentText.trim() || posting}
              >
                Post Comment
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please log in to post comments
        </Alert>
      )}

      {/* Comment List */}
      <Stack spacing={2}>
        {comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
              authToken={authToken}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReact={handleReact}
            />
          ))
        )}
      </Stack>
    </Box>
  );
};

export default CommentThread;
