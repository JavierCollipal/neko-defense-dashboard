/**
 * 🎨 Content Editor Component
 * Rich text editor with React Quill for creating user-generated content
 */

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Stack,
} from '@mui/material';
import {
  Send as PublishIcon,
  Save as SaveIcon,
  Close as CancelIcon,
} from '@mui/icons-material';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Content categories from backend
const CONTENT_CATEGORIES = {
  'threat-intel': {
    name: 'Threat Intelligence',
    description: 'Security research, threat actor analysis, vulnerability reports',
    icon: '🔍',
  },
  defense: {
    name: 'Defense Strategies',
    description: 'Security best practices, defense mechanisms, protection methods',
    icon: '🛡️',
  },
  research: {
    name: 'Research',
    description: 'Security research, academic papers, technical analysis',
    icon: '📊',
  },
  ideas: {
    name: 'Ideas & Suggestions',
    description: 'Feature requests, improvement ideas, community feedback',
    icon: '💡',
  },
  general: {
    name: 'General Discussion',
    description: 'Community discussions, off-topic posts, general content',
    icon: '💬',
  },
  'ascii-art': {
    name: 'ASCII Art',
    description: 'ASCII art creations, threat actor representations',
    icon: '🎨',
  },
  video: {
    name: 'Videos',
    description: 'Educational videos, demonstrations, tutorials',
    icon: '🎥',
  },
};

// Quill editor modules configuration
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'code-block'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'indent',
  'link',
  'code-block',
  'align',
];

/**
 * ContentEditor Component
 * @param {Function} onSave - Callback when content is saved (draft or published)
 * @param {Function} onCancel - Callback when editor is cancelled
 * @param {Object} initialContent - Initial content for editing (optional)
 * @param {string} authToken - JWT authentication token
 */
const ContentEditor = ({
  onSave,
  onCancel,
  initialContent = null,
  authToken,
}) => {
  const [title, setTitle] = useState(initialContent?.title || '');
  const [description, setDescription] = useState(initialContent?.description || '');
  const [content, setContent] = useState(initialContent?.content?.text || '');
  const [category, setCategory] = useState(initialContent?.category || 'general');
  const [tags, setTags] = useState(initialContent?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [visibility, setVisibility] = useState(initialContent?.visibility || 'public');
  const [publishImmediately, setPublishImmediately] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  const handleDeleteTag = useCallback((tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  }, [tags]);

  const handleSave = async (publish = false) => {
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length > 200) {
      setError('Title must be at most 200 characters');
      return;
    }

    if (description.length > 1000) {
      setError('Description must be at most 1000 characters');
      return;
    }

    setLoading(true);

    try {
      const contentData = {
        title: title.trim(),
        description: description.trim(),
        content: {
          text: content,
          media: [],
        },
        category,
        tags,
        visibility,
        status: publish ? 'published' : 'draft',
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const endpoint = initialContent?._id
        ? `${API_URL}/api/content/${initialContent._id}`
        : `${API_URL}/api/content/create`;

      const method = initialContent?._id ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(contentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save content');
      }

      // Call onSave callback with the saved content
      if (onSave) {
        onSave(result.content);
      }

      // Reset form if creating new content
      if (!initialContent) {
        setTitle('');
        setDescription('');
        setContent('');
        setTags([]);
        setCategory('general');
      }
    } catch (err) {
      console.error('Save content error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {initialContent ? 'Edit Content' : 'Create New Content'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Title */}
          <TextField
            label="Title"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title..."
            helperText={`${title.length}/200 characters`}
            error={title.length > 200}
          />

          {/* Description */}
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of your content..."
            helperText={`${description.length}/1000 characters`}
            error={description.length > 1000}
          />

          {/* Category */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {Object.entries(CONTENT_CATEGORIES).map(([key, cat]) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Tags */}
          <Box>
            <TextField
              label="Tags"
              fullWidth
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add tags (press Enter)"
              helperText="Press Enter to add tags"
            />
            {tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Rich Text Editor */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Content
            </Typography>
            <Box
              sx={{
                '& .quill': {
                  bgcolor: 'background.paper',
                },
                '& .ql-container': {
                  minHeight: '300px',
                  fontSize: '16px',
                },
                '& .ql-editor': {
                  minHeight: '300px',
                },
              }}
            >
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Write your content here..."
              />
            </Box>
          </Box>

          {/* Visibility */}
          <FormControl fullWidth>
            <InputLabel>Visibility</InputLabel>
            <Select
              value={visibility}
              label="Visibility"
              onChange={(e) => setVisibility(e.target.value)}
            >
              <MenuItem value="public">
                🌍 Public - Anyone can see this
              </MenuItem>
              <MenuItem value="unlisted">
                🔗 Unlisted - Only people with the link can see this
              </MenuItem>
              <MenuItem value="private">
                🔒 Private - Only you can see this
              </MenuItem>
            </Select>
          </FormControl>

          {/* Publish Immediately Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={publishImmediately}
                onChange={(e) => setPublishImmediately(e.target.checked)}
              />
            }
            label="Publish immediately (otherwise save as draft)"
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>

            <Button
              variant="outlined"
              onClick={() => handleSave(false)}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              Save Draft
            </Button>

            <Button
              variant="contained"
              onClick={() => handleSave(true)}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PublishIcon />}
            >
              {publishImmediately ? 'Publish Now' : 'Save & Publish'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ContentEditor;
