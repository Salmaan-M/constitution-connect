import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, score, totalQuestions, percentage, passed, quizTitle } =
    location.state || {};

  if (!results) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            No quiz results found
          </h1>
          <p className="text-gray-600 mb-4">
            It looks like you haven't completed a quiz yet.
          </p>
          <Link
            to="/quizzes"
            className="text-primary-600 hover:text-primary-700"
          >
            Browse Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90)
      return "Outstanding! You have excellent knowledge of the Constitution!";
    if (percentage >= 80)
      return "Great job! You have a strong understanding of constitutional principles.";
    if (percentage >= 70)
      return "Good work! You have a solid grasp of the material.";
    if (percentage >= 60)
      return "Not bad! You passed, but consider reviewing some topics.";
    return "Keep studying! The Constitution is complex, but you can master it with practice.";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Result Header */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {passed ? (
              <span className="text-green-600 text-4xl">🎉</span>
            ) : (
              <span className="text-red-600 text-4xl">📚</span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {passed ? "Congratulations!" : "Keep Learning!"}
          </h1>

          <p className="text-xl text-gray-600 mb-4">{quizTitle}</p>

          <div
            className={`text-6xl font-bold mb-4 ${getScoreColor(percentage)}`}
          >
            {percentage}%
          </div>

          <p className="text-lg text-gray-600 mb-6">
            {getScoreMessage(percentage)}
          </p>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">{score}</div>
            <div className="text-gray-600">Correct Answers</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {totalQuestions - score}
            </div>
            <div className="text-gray-600">Incorrect Answers</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {totalQuestions}
            </div>
            <div className="text-gray-600">Total Questions</div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Question Review
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {results.map((result, index) => (
              <div key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800 flex-1">
                    Question {index + 1}: {result.questionText}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-4 ${
                      result.isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-24">
                      Your Answer:
                    </span>
                    <span
                      className={`text-sm ${
                        result.isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {result.userAnswer !== null
                        ? `Option ${result.userAnswer + 1}`
                        : "Not answered"}
                    </span>
                  </div>

                  {!result.isCorrect && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 w-24">
                        Correct Answer:
                      </span>
                      <span className="text-sm text-green-600">
                        Option {result.correctAnswer + 1}
                      </span>
                    </div>
                  )}

                  {result.explanation && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">
                        Explanation:
                      </span>
                      <p className="text-sm text-gray-700 mt-1">
                        {result.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/quizzes"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Take Another Quiz
          </Link>

          <Link
            to="/profile"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            View Profile
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
