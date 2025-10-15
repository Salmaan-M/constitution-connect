import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AdminBlogs = () => {
  const { user, isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
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
    'General'
  ];

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    category: 'General',
    tags: '',
    isPublished: true
  });

  useEffect(() => {
    // Debug: Log user authentication status
    console.log('AdminBlogs - User:', user);
    console.log('AdminBlogs - Is Authenticated:', isAuthenticated);
    console.log('AdminBlogs - User Role:', user?.role);
    
    fetchBlogs();
  }, [filters]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getAllAdmin(filters);
      setBlogs(response.blogs || []);
      setPagination({
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
        total: response.total || 0
      });
    } catch (error) {
      toast.error('Failed to load blogs');
      console.error('Error fetching blogs:', error);
      // Set empty state on error
      setBlogs([]);
      setPagination({
        totalPages: 1,
        currentPage: 1,
        total: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      toast.error('You must be an admin to create blogs');
      return;
    }
    
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      // Debug: Log the data being sent
      console.log('Creating blog with data:', blogData);
      
      const response = await blogsAPI.create(blogData);
      toast.success('Blog created successfully');
      setShowCreateForm(false);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        imageUrl: '',
        category: 'General',
        tags: '',
        isPublished: true
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error creating blog:', error);
      if (error.message) {
        toast.error(`Failed to create blog: ${error.message}`);
      } else {
        toast.error('Failed to create blog. Please check your input and try again.');
      }
    }
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      await blogsAPI.update(editingBlog._id, blogData);
      toast.success('Blog updated successfully');
      setEditingBlog(null);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        imageUrl: '',
        category: 'General',
        tags: '',
        isPublished: true
      });
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to update blog');
      console.error('Error updating blog:', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogsAPI.delete(id);
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } catch (error) {
        toast.error('Failed to delete blog');
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      imageUrl: blog.imageUrl,
      category: blog.category,
      tags: blog.tags.join(', '),
      isPublished: blog.isPublished
    });
    setShowCreateForm(true);
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Blogs</h1>
          <p className="text-gray-600">Create, edit, and manage blog posts</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingBlog(null);
            setFormData({
              title: '',
              content: '',
              excerpt: '',
              imageUrl: '',
              category: 'General',
              tags: '',
              isPublished: true
            });
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Create New Blog
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingBlog ? 'Edit Blog' : 'Create New Blog'}
          </h2>
          <form onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="constitution, rights, duties"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                Publish immediately
              </label>
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
                {editingBlog ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blogs List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">All Blogs ({pagination.total})</h2>
        </div>
        
        {blogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No blogs found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <div key={blog._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-800">{blog.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{blog.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Category: {blog.category}</span>
                      <span>•</span>
                      <span>Author: {blog.author?.name || 'Unknown'}</span>
                      <span>•</span>
                      <span>Views: {blog.views}</span>
                      <span>•</span>
                      <span>Created: {formatDate(blog.createdAt)}</span>
                    </div>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditBlog(blog)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
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

export default AdminBlogs;
