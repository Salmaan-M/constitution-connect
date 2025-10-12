import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scoresAPI, blogsAPI, quizzesAPI, contactAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalQuizzes: 0,
    totalContacts: 0,
    recentContacts: [],
    topQuizzes: [],
    recentBlogs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statsResponse = await scoresAPI.getStatistics();
      
      // Fetch recent blogs
      const blogsResponse = await blogsAPI.getAll({ page: 1, limit: 5 });
      
      // Fetch recent contacts
      const contactsResponse = await contactAPI.getAll({ page: 1, limit: 5 });
      
      // Fetch recent quizzes
      const quizzesResponse = await quizzesAPI.getAll({ page: 1, limit: 5 });

      setStats({
        totalUsers: statsResponse.statistics.totalUsers,
        totalBlogs: blogsResponse.total,
        totalQuizzes: statsResponse.statistics.totalQuizzes,
        totalContacts: contactsResponse.total,
        recentContacts: contactsResponse.contacts,
        topQuizzes: statsResponse.statistics.quizzes.slice(0, 5),
        recentBlogs: blogsResponse.blogs
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', error);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the Constitution Connect administration panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">📝</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">🧠</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">💬</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/blogs"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">📝</span>
            <div>
              <div className="font-medium text-gray-800">Manage Blogs</div>
              <div className="text-sm text-gray-500">Create and edit blog posts</div>
            </div>
          </Link>

          <Link
            to="/admin/quizzes"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">🧠</span>
            <div>
              <div className="font-medium text-gray-800">Manage Quizzes</div>
              <div className="text-sm text-gray-500">Create and edit quizzes</div>
            </div>
          </Link>

          <Link
            to="/admin/scores"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">📊</span>
            <div>
              <div className="font-medium text-gray-800">View Scores</div>
              <div className="text-sm text-gray-500">Monitor user performance</div>
            </div>
          </Link>

          <Link
            to="/admin/contacts"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">💬</span>
            <div>
              <div className="font-medium text-gray-800">Manage Contacts</div>
              <div className="text-sm text-gray-500">View and respond to messages</div>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contacts */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Contacts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentContacts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No recent contacts</div>
            ) : (
              stats.recentContacts.map((contact) => (
                <div key={contact._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">{contact.name}</h3>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{contact.message}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contact.status === 'new' ? 'bg-red-100 text-red-800' :
                        contact.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                        contact.status === 'replied' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(contact.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-3 bg-gray-50">
            <Link
              to="/admin/contacts"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all contacts →
            </Link>
          </div>
        </div>

        {/* Top Quizzes */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Quiz Performance</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.topQuizzes.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No quiz data available</div>
            ) : (
              stats.topQuizzes.map((quiz) => (
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
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-3 bg-gray-50">
            <Link
              to="/admin/scores"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View detailed analytics →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
