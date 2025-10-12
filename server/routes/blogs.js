const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all published blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    let query = { isPublished: true };
    if (category && category !== 'all') {
      query.category = category;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs
// @desc    Create new blog
// @access  Private (Admin only)
router.post('/', [adminAuth, [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('content').isLength({ min: 100 }).withMessage('Content must be at least 100 characters'),
  body('category').isIn(['Fundamental Rights', 'Fundamental Duties', 'Directive Principles', 'Constitutional History', 'Amendments', 'General']).withMessage('Invalid category')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, imageUrl, category, tags } = req.body;

    const blog = new Blog({
      title,
      content,
      excerpt: excerpt || content.substring(0, 300) + '...',
      imageUrl,
      category,
      tags: tags || [],
      author: req.user._id
    });

    await blog.save();
    await blog.populate('author', 'name');

    res.status(201).json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update blog
// @access  Private (Admin only)
router.put('/:id', [adminAuth, [
  body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('content').optional().isLength({ min: 100 }).withMessage('Content must be at least 100 characters')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const { title, content, excerpt, imageUrl, category, tags, isPublished } = req.body;

    if (title) blog.title = title;
    if (content) {
      blog.content = content;
      blog.excerpt = excerpt || content.substring(0, 300) + '...';
    }
    if (imageUrl !== undefined) blog.imageUrl = imageUrl;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;
    if (isPublished !== undefined) blog.isPublished = isPublished;

    await blog.save();
    await blog.populate('author', 'name');

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete blog
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
