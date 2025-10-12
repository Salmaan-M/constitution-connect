import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { scoresAPI } from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, logout } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserScores();
  }, []);

  const fetchUserScores = async () => {
    try {
      setLoading(true);
      const response = await scoresAPI.getUserScores();
      setScores(response.scores);
    } catch (error) {
      toast.error('Failed to load quiz scores');
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
                <p className="text-gray-600">{user?.email}</p>
                <span className="inline-block mt-2 bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {user?.role === 'admin' ? 'Administrator' : 'Member'}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📝</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Quizzes Taken</p>
                <p className="text-2xl font-bold text-gray-900">{scores.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scores.length > 0 
                    ? Math.round(scores.reduce((sum, score) => sum + score.percentage, 0) / scores.length)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">🏆</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scores.length > 0 
                    ? Math.max(...scores.map(score => score.percentage))
                    : 0
                  }%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Scores */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Quiz History</h2>
          </div>
          
          {scores.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No quiz scores yet</h3>
              <p className="text-gray-500 mb-4">Start taking quizzes to see your progress here!</p>
              <a
                href="/quizzes"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Browse Quizzes
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {scores.map((score, index) => (
                <div key={index} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {score.quizId?.title || 'Quiz'}
                      </h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Category: {score.quizId?.category || 'Unknown'}</span>
                        <span>•</span>
                        <span>Difficulty: {score.quizId?.difficulty || 'Unknown'}</span>
                        <span>•</span>
                        <span>Date: {formatDate(score.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {score.score}/{score.totalQuestions} questions
                        </div>
                        <div className={`text-lg font-semibold ${getScoreColor(score.percentage)}`}>
                          {score.percentage}%
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeColor(score.percentage)}`}>
                        {score.percentage >= 80 ? 'Excellent' : score.percentage >= 60 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
