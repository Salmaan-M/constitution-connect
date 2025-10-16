import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { blogsAPI } from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Blogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    total: 0,
  });
  const [likingBlogs, setLikingBlogs] = useState(new Set());

  const categories = [
    "all",
    "Fundamental Rights",
    "Fundamental Duties",
    "Directive Principles",
    "Constitutional History",
    "Amendments",
    "General",
  ];

  const fetchBlogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getAll(filters);
      setBlogs(response.blogs);
      setPagination({
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
        total: response.total || 0,
      });
    } catch (error) {
      toast.error("Failed to load blogs");
      setBlogs([]);
      setPagination({
        totalPages: 1,
        currentPage: 1,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBlogs();
  }, [filters, fetchBlogs]);

  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLike = async (blogId) => {
    if (!user) {
      toast.error("Please login to like blogs");
      return;
    }

    try {
      setLikingBlogs((prev) => new Set([...prev, blogId]));
      const response = await blogsAPI.like(blogId);

      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === blogId
            ? { ...blog, likes: response.likes, isLiked: response.liked }
            : blog
        )
      );

      toast.success(response.message);
    } catch (error) {
      toast.error("Failed to like blog");
      console.error("Error liking blog:", error);
    } finally {
      setLikingBlogs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(blogId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Constitutional Blogs
        </h1>
        <p className="text-gray-600">
          Explore articles about the Indian Constitution and its principles
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.category === category
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category === "all" ? "All Categories" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Grid */}
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No blogs found
          </h3>
          <p className="text-gray-500">
            {filters.category === "all"
              ? "No blogs have been published yet."
              : `No blogs found in the ${filters.category} category.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {blog.imageUrl && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {blog.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(blog.createdAt)}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">👁️ {blog.views}</span>
                    <button
                      onClick={() => handleLike(blog._id)}
                      disabled={likingBlogs.has(blog._id)}
                      className={`flex items-center space-x-1 mr-4 ${
                        blog.isLiked ? "text-red-500" : "text-gray-500"
                      } ${
                        likingBlogs.has(blog._id)
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:text-red-500"
                      }`}
                    >
                      <span>{blog.isLiked ? "❤️" : "🤍"}</span>
                      <span>{blog.likes}</span>
                    </button>
                  </div>
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Read More →
                  </Link>
                </div>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {blog.tags.slice(0, 3).map((tag, index) => (
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
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === pagination.currentPage
                    ? "bg-primary-600 text-white"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Blogs;
