import React, { useState, useEffect } from 'react';
import { scoresAPI, quizzesAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminScores = () => {
  const [scores, setScores] = useState([]);
  const [statistics, setStatistics] = useState({
    totalQuizzes: 0,
    totalUsers: 0,
    usersWithScores: 0,
    totalQuizAttempts: 0,
    quizzes: []
  });
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    quizId: 'all',
    page: 1,
    limit: 20,
    search: ''
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    total: 0
  });
  const [viewMode, setViewMode] = useState('scores'); // 'scores' or 'analytics'
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch data in parallel with individual error handling
      const [statsResponse, quizzesResponse, scoresResponse] = await Promise.allSettled([
        scoresAPI.getStatistics(),
        quizzesAPI.getAll({ page: 1, limit: 100 }),
        scoresAPI.getAllScores(filters)
      ]);

      // Handle statistics
      if (statsResponse.status === 'fulfilled') {
        setStatistics(statsResponse.value.statistics);
      } else {
        console.error('Failed to fetch statistics:', statsResponse.reason);
        toast.error('Failed to load statistics');
      }

      // Handle quizzes
      if (quizzesResponse.status === 'fulfilled') {
        setQuizzes(quizzesResponse.value.quizzes);
      } else {
        console.error('Failed to fetch quizzes:', quizzesResponse.reason);
        toast.error('Failed to load quizzes');
      }

      // Handle scores
      if (scoresResponse.status === 'fulfilled') {
        setScores(scoresResponse.value.users);
        setPagination({
          totalPages: scoresResponse.value.totalPages,
          currentPage: scoresResponse.value.currentPage,
          total: scoresResponse.value.total
        });
      } else {
        console.error('Failed to fetch scores:', scoresResponse.reason);
        toast.error('Failed to load scores');
      }
    } catch (error) {
      toast.error('Failed to load scores data');
      console.error('Error fetching scores data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportScores = () => {
    const csvContent = [
      ['User Name', 'Email', 'Quiz Title', 'Category', 'Difficulty', 'Score', 'Percentage', 'Date'],
      ...scores.flatMap(user => 
        user.quizScores.map(score => [
          user.name,
          user.email,
          score.quizId?.title || 'Unknown Quiz',
          score.quizId?.category || 'Unknown',
          score.quizId?.difficulty || 'Unknown',
          `${score.score}/${score.totalQuestions}`,
          `${score.percentage.toFixed(1)}%`,
          formatDate(score.date)
        ])
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-scores-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Scores Management</h1>
          <p className="text-gray-600">Monitor user performance and quiz analytics</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={exportScores}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'scores' ? 'analytics' : 'scores')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {viewMode === 'scores' ? 'View Analytics' : 'View Scores'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🧠</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalQuizzes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Users with Scores</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.usersWithScores}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">🎯</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalQuizAttempts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Filter</label>
            <select
              value={filters.quizId}
              onChange={(e) => setFilters({ ...filters, quizId: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Quizzes</option>
              {quizzes.map((quiz) => (
                <option key={quiz._id} value={quiz._id}>
                  {quiz.title} ({quiz.category})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search User</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              placeholder="Search by name or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Results per page</label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>
      </div>

      {viewMode === 'scores' ? (
        /* Scores Table */
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">User Scores ({pagination.total})</h2>
          </div>
          
          {scores.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No scores found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scores.map((user) => 
                    user.quizScores.map((score, index) => (
                      <tr key={`${user._id}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{score.quizId?.title || 'Unknown Quiz'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {score.quizId?.category || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(score.quizId?.difficulty)}`}>
                            {score.quizId?.difficulty || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {score.score}/{score.totalQuestions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(score.percentage)}`}>
                            {score.percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(score.date)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
      ) : (
        /* Analytics View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quiz Performance */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Quiz Performance</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {statistics.quizzes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No quiz data available</div>
              ) : (
                statistics.quizzes.map((quiz) => (
                  <div key={quiz.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">{quiz.title}</h3>
                        <p className="text-sm text-gray-500">{quiz.category} • {quiz.difficulty}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">{quiz.attempts} attempts</div>
                        <div className="text-sm text-gray-500">Avg: {quiz.averageScore.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(quiz.averageScore, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Performance Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Participation Rate</span>
                <span className="text-sm font-bold text-gray-900">
                  {statistics.totalUsers > 0 ? ((statistics.usersWithScores / statistics.totalUsers) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Average Attempts per User</span>
                <span className="text-sm font-bold text-gray-900">
                  {statistics.usersWithScores > 0 ? (statistics.totalQuizAttempts / statistics.usersWithScores).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Total Quiz Attempts</span>
                <span className="text-sm font-bold text-gray-900">{statistics.totalQuizAttempts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Active Quizzes</span>
                <span className="text-sm font-bold text-gray-900">{statistics.totalQuizzes}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScores;
