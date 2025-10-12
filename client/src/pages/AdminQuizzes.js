import React, { useState, useEffect } from 'react';
import { quizzesAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    page: 1
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    total: 0
  });

  const categories = [
    'all',
    'Fundamental Rights',
    'Fundamental Duties',
    'Directive Principles',
    'Constitutional History',
    'Amendments',
    'Mixed'
  ];

  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Mixed',
    difficulty: 'Medium',
    timeLimit: 30,
    passingScore: 60,
    isActive: true,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  useEffect(() => {
    fetchQuizzes();
  }, [filters]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizzesAPI.getAll(filters);
      setQuizzes(response.quizzes);
      setPagination({
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        total: response.total
      });
    } catch (error) {
      toast.error('Failed to load quizzes');
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    try {
      await quizzesAPI.create(formData);
      toast.success('Quiz created successfully');
      setShowCreateForm(false);
      resetForm();
      fetchQuizzes();
    } catch (error) {
      toast.error('Failed to create quiz');
      console.error('Error creating quiz:', error);
    }
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    try {
      await quizzesAPI.update(editingQuiz._id, formData);
      toast.success('Quiz updated successfully');
      setEditingQuiz(null);
      resetForm();
      fetchQuizzes();
    } catch (error) {
      toast.error('Failed to update quiz');
      console.error('Error updating quiz:', error);
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizzesAPI.delete(id);
        toast.success('Quiz deleted successfully');
        fetchQuizzes();
      } catch (error) {
        toast.error('Failed to delete quiz');
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      isActive: quiz.isActive,
      questions: quiz.questions
    });
    setShowCreateForm(true);
  };

  const addQuestion = () => {
    if (!currentQuestion.questionText || currentQuestion.options.some(opt => !opt.trim())) {
      toast.error('Please fill in all question fields');
      return;
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, { ...currentQuestion }]
    });

    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Mixed',
      difficulty: 'Medium',
      timeLimit: 30,
      passingScore: 60,
      isActive: true,
      questions: []
    });
    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Quizzes</h1>
          <p className="text-gray-600">Create, edit, and manage quiz content</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingQuiz(null);
            resetForm();
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Create New Quiz
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Difficulties' : difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
          </h2>
          <form onSubmit={editingQuiz ? handleUpdateQuiz : handleCreateQuiz} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.filter(cat => cat !== 'all').map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {difficulties.filter(diff => diff !== 'all').map((difficulty) => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (min)</label>
                <input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
                <input
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>

            {/* Questions */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Questions ({formData.questions.length})</h3>
              
              {/* Add Question Form */}
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <h4 className="text-md font-medium text-gray-700 mb-3">Add New Question</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                    <input
                      type="text"
                      value={currentQuestion.questionText}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter the question..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={currentQuestion.correctAnswer === index}
                          onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                          className="mr-3"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion({ ...currentQuestion, options: newOptions });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (optional)</label>
                    <input
                      type="text"
                      value={currentQuestion.explanation}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Explain why this is the correct answer..."
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Add Question
                  </button>
                </div>
              </div>

              {/* Questions List */}
              {formData.questions.length > 0 && (
                <div className="space-y-3">
                  {formData.questions.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 mb-2">
                            Q{index + 1}: {question.questionText}
                          </h4>
                          <div className="space-y-1">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <span className={`w-4 h-4 rounded-full mr-3 ${
                                  optIndex === question.correctAnswer ? 'bg-green-500' : 'bg-gray-300'
                                }`}></span>
                                <span className={optIndex === question.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                          {question.explanation && (
                            <p className="text-sm text-gray-500 mt-2">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeQuestion(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium ml-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quizzes List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">All Quizzes ({pagination.total})</h2>
        </div>
        
        {quizzes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No quizzes found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-800">{quiz.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        quiz.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {quiz.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Category: {quiz.category}</span>
                      <span>•</span>
                      <span>Difficulty: {quiz.difficulty}</span>
                      <span>•</span>
                      <span>Questions: {quiz.questions?.length || 0}</span>
                      <span>•</span>
                      <span>Time: {quiz.timeLimit} min</span>
                      <span>•</span>
                      <span>Pass: {quiz.passingScore}%</span>
                      <span>•</span>
                      <span>Attempts: {quiz.attempts}</span>
                    </div>
                    {quiz.averageScore > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        Average Score: {quiz.averageScore.toFixed(1)}%
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditQuiz(quiz)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setFilters({ ...filters, page })}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    page === pagination.currentPage
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuizzes;
