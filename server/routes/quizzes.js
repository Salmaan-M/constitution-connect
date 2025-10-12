const express = require('express');
const { body, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/quizzes
// @desc    Get all active quizzes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name')
      .select('-questions.correctAnswer')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Quiz.countDocuments(query);

    res.json({
      success: true,
      quizzes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get single quiz by ID (without correct answers)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name')
      .select('-questions.correctAnswer');

    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quizzes
// @desc    Create new quiz
// @access  Private (Admin only)
router.post('/', [adminAuth, [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('questions.*.questionText').trim().isLength({ min: 10 }).withMessage('Question text must be at least 10 characters'),
  body('questions.*.options').isArray({ min: 2, max: 4 }).withMessage('Each question must have 2-4 options'),
  body('questions.*.correctAnswer').isInt({ min: 0, max: 3 }).withMessage('Correct answer must be a valid option index')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, questions, category, difficulty, timeLimit, passingScore } = req.body;

    const quiz = new Quiz({
      title,
      description,
      questions,
      category,
      difficulty,
      timeLimit,
      passingScore,
      createdBy: req.user._id
    });

    await quiz.save();
    await quiz.populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/quizzes/:id
// @desc    Update quiz
// @access  Private (Admin only)
router.put('/:id', [adminAuth, [
  body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('questions').optional().isArray({ min: 1 }).withMessage('At least one question is required')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { title, description, questions, category, difficulty, timeLimit, passingScore, isActive } = req.body;

    if (title) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (questions) quiz.questions = questions;
    if (category) quiz.category = category;
    if (difficulty) quiz.difficulty = difficulty;
    if (timeLimit !== undefined) quiz.timeLimit = timeLimit;
    if (passingScore !== undefined) quiz.passingScore = passingScore;
    if (isActive !== undefined) quiz.isActive = isActive;

    await quiz.save();
    await quiz.populate('createdBy', 'name');

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/quizzes/:id
// @desc    Delete quiz
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quizzes/:id/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/:id/submit', [auth, [
  body('answers').isArray().withMessage('Answers must be an array'),
  body('answers.*').isInt({ min: 0, max: 3 }).withMessage('Each answer must be a valid option index')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { answers } = req.body;

    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: 'Number of answers must match number of questions' });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = quiz.questions.map((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionIndex: index,
        questionText: question.questionText,
        userAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const score = correctAnswers;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Update quiz statistics
    quiz.attempts += 1;
    quiz.averageScore = ((quiz.averageScore * (quiz.attempts - 1)) + percentage) / quiz.attempts;
    await quiz.save();

    // Save user's score
    const user = await User.findById(req.user._id);
    const existingScoreIndex = user.quizScores.findIndex(
      score => score.quizId.toString() === quiz._id.toString()
    );

    const scoreData = {
      quizId: quiz._id,
      score,
      totalQuestions,
      percentage,
      date: new Date()
    };

    if (existingScoreIndex >= 0) {
      // Update existing score if this attempt is better
      if (percentage > user.quizScores[existingScoreIndex].percentage) {
        user.quizScores[existingScoreIndex] = scoreData;
      }
    } else {
      // Add new score
      user.quizScores.push(scoreData);
    }

    await user.save();

    res.json({
      success: true,
      score,
      totalQuestions,
      percentage,
      passed: percentage >= quiz.passingScore,
      results
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
