const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('subject').optional().trim().isLength({ max: 200 }).withMessage('Subject cannot be more than 200 characters'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      subject: subject || 'General Inquiry',
      message
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      contactId: contact._id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

// @route   GET /api/contact/admin
// @desc    Get all contact messages (Admin only)
// @access  Private (Admin only)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/contact/admin/:id
// @desc    Get single contact message (Admin only)
// @access  Private (Admin only)
router.get('/admin/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/contact/admin/:id/status
// @desc    Update contact message status (Admin only)
// @access  Private (Admin only)
router.put('/admin/:id/status', [adminAuth, [
  body('status').isIn(['new', 'read', 'replied', 'closed']).withMessage('Invalid status'),
  body('reply').optional().trim().isLength({ max: 1000 }).withMessage('Reply cannot be more than 1000 characters')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    const { status, reply } = req.body;

    contact.status = status;
    contact.isRead = status !== 'new';
    
    if (reply) {
      contact.reply = reply;
      contact.repliedAt = new Date();
    }

    await contact.save();

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/contact/admin/:id
// @desc    Delete contact message (Admin only)
// @access  Private (Admin only)
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
