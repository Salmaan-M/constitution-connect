import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogsAPI } from '../services/api';
import { toast } from 'react-toastify';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getById(id);
      setBlog(response.blog);
      
      // Fetch related blogs
      const relatedResponse = await blogsAPI.getAll({
        category: response.blog.category,
        page: 1,
        limit: 3
      });
      setRelatedBlogs(relatedResponse.blogs.filter(b => b._id !== id));
    } catch (error) {
      toast.error('Failed to load blog');
      console.error('Error fetching blog:', error);
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h1>
          <Link to="/blogs" className="text-primary-600 hover:text-primary-700">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
          <li>/</li>
          <li><Link to="/blogs" className="hover:text-primary-600">Blogs</Link></li>
          <li>/</li>
          <li className="text-gray-900">{blog.title}</li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto">
        {/* Blog Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded-full">
              {blog.category}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(blog.createdAt)}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>By {blog.author?.name || 'Unknown Author'}</span>
              <span>•</span>
              <span>👁️ {blog.views} views</span>
              <span>•</span>
              <span>❤️ {blog.likes} likes</span>
            </div>
          </div>
        </div>

        {/* Blog Image */}
        {blog.imageUrl && (
          <div className="mb-8">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
          />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <div key={relatedBlog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {relatedBlog.imageUrl && (
                    <div className="h-48 bg-gray-200">
                      <img
                        src={relatedBlog.imageUrl}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {relatedBlog.excerpt}
                    </p>
                    <Link
                      to={`/blogs/${relatedBlog._id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blogs */}
        <div className="mt-8 text-center">
          <Link
            to="/blogs"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            ← Back to All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
