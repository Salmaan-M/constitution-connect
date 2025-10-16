import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { quizzesAPI } from "../services/api";
import { toast } from "react-toastify";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    difficulty: "all",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    total: 0,
  });

  const categories = [
    "all",
    "Fundamental Rights",
    "Fundamental Duties",
    "Directive Principles",
    "Constitutional History",
    "Amendments",
    "Mixed",
  ];

  const difficulties = ["all", "Easy", "Medium", "Hard"];

  const fetchQuizzes = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await quizzesAPI.getAll(filters);
      setQuizzes(response.quizzes);
      setPagination({
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
        total: response.total || 0,
      });
    } catch (error) {
      toast.error("Failed to load quizzes");
      setQuizzes([]);
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
    fetchQuizzes();
  }, [filters, fetchQuizzes]);

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          Constitutional Quizzes
        </h1>
        <p className="text-gray-600">
          Test your knowledge of the Indian Constitution with our interactive
          quizzes
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange("category", category)}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => handleFilterChange("difficulty", difficulty)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.difficulty === difficulty
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {difficulty === "all" ? "All Levels" : difficulty}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No quizzes found
          </h3>
          <p className="text-gray-500">
            {filters.category === "all" && filters.difficulty === "all"
              ? "No quizzes are available yet."
              : `No quizzes found with the selected filters.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {quiz.category}
                  </span>
                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded ${getDifficultyColor(
                      quiz.difficulty
                    )}`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {quiz.title}
                </h3>

                {quiz.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {quiz.description}
                  </p>
                )}

                <div className="space-y-2 mb-4 text-sm text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>📝 {quiz.questions?.length || 0} questions</span>
                    <span>⏱️ {quiz.timeLimit} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>🎯 {quiz.passingScore}% to pass</span>
                    <span>👥 {quiz.attempts} attempts</span>
                  </div>
                  {quiz.averageScore > 0 && (
                    <div className="flex items-center justify-between">
                      <span>📊 Avg: {quiz.averageScore.toFixed(1)}%</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Created {formatDate(quiz.createdAt)}
                  </span>
                  <Link
                    to={`/quizzes/${quiz._id}`}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    Start Quiz
                  </Link>
                </div>
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

export default Quizzes;
