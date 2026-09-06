const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Get comments for an article
router.get('/:articleId', async (req, res) => {
  try {
    const comments = await Comment.find({ articleId: req.params.articleId })
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate('parentId', 'content');
    
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Create a new comment
router.post('/', auth, async (req, res) => {
  try {
    const { content, articleId, parentId } = req.body;
    
    const comment = new Comment({
      content,
      articleId,
      author: req.user.id,
      parentId: parentId || null
    });

    await comment.save();
    
    // Populate author info before sending response
    await comment.populate('author', 'username');
    if (parentId) {
      await comment.populate('parentId', 'content');
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
});

// Like a comment
router.post('/:commentId/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.likes += 1;
    await comment.save();

    res.json({ likes: comment.likes });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ message: 'Error liking comment' });
  }
});

module.exports = router; 