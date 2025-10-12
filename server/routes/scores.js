const express = require('express');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/scores/user
// @desc    Get current user's quiz scores
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('quizScores.quizId', 'title category difficulty');

    res.json({
      success: true,
      scores: user.quizScores
    });
  } catch (error) {
    console.error('Get user scores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/scores/quiz/:quizId
// @desc    Get user's scores for a specific quiz
// @access  Private
router.get('/quiz/:quizId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const quizScores = user.quizScores.filter(
      score => score.quizId.toString() === req.params.quizId
    );

    if (quizScores.length === 0) {
      return res.json({
        success: true,
        scores: [],
        message: 'No scores found for this quiz'
      });
    }

    res.json({
      success: true,
      scores: quizScores
    });
  } catch (error) {
    console.error('Get quiz scores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/scores/leaderboard
// @desc    Get leaderboard for a specific quiz
// @access  Public
router.get('/leaderboard/:quizId', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const users = await User.find({
      'quizScores.quizId': req.params.quizId
    })
      .select('name quizScores')
      .populate('quizScores.quizId', 'title');

    // Filter and sort scores for the specific quiz
    const leaderboard = users
      .map(user => {
        const quizScore = user.quizScores.find(
          score => score.quizId._id.toString() === req.params.quizId
        );
        return {
          userId: user._id,
          name: user.name,
          score: quizScore ? quizScore.score : 0,
          totalQuestions: quizScore ? quizScore.totalQuestions : 0,
          percentage: quizScore ? quizScore.percentage : 0,
          date: quizScore ? quizScore.date : null
        };
      })
      .filter(entry => entry.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/scores/admin/all
// @desc    Get all user scores (Admin only)
// @access  Private (Admin only)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, quizId } = req.query;

    let matchQuery = {};
    if (quizId) {
      matchQuery['quizScores.quizId'] = quizId;
    }

    const users = await User.find(matchQuery)
      .populate('quizScores.quizId', 'title category difficulty')
      .select('name email quizScores createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(matchQuery);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all scores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/scores/admin/statistics
// @desc    Get quiz statistics (Admin only)
// @access  Private (Admin only)
router.get('/admin/statistics', adminAuth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .select('title category difficulty attempts averageScore createdAt');

    const totalUsers = await User.countDocuments();
    const usersWithScores = await User.countDocuments({
      'quizScores.0': { $exists: true }
    });

    const totalQuizAttempts = quizzes.reduce((sum, quiz) => sum + quiz.attempts, 0);

    res.json({
      success: true,
      statistics: {
        totalQuizzes: quizzes.length,
        totalUsers,
        usersWithScores,
        totalQuizAttempts,
        quizzes: quizzes.map(quiz => ({
          id: quiz._id,
          title: quiz.title,
          category: quiz.category,
          difficulty: quiz.difficulty,
          attempts: quiz.attempts,
          averageScore: quiz.averageScore,
          createdAt: quiz.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
