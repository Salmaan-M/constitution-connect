import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizzesAPI } from "../services/api";
import { toast } from "react-toastify";

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmitQuiz();
    }
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizzesAPI.getById(id);
      setQuiz(response.quiz);
      setAnswers(new Array(response.quiz.questions.length).fill(null));
      setTimeLeft(response.quiz.timeLimit * 60); // Convert minutes to seconds
    } catch (error) {
      toast.error("Failed to load quiz");
      console.error("Error fetching quiz:", error);
      navigate("/quizzes");
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await quizzesAPI.submit(id, answers);
      navigate("/quiz-result", {
        state: {
          results: response.results,
          score: response.score,
          totalQuestions: response.totalQuestions,
          percentage: response.percentage,
          passed: response.passed,
          quizTitle: quiz.title,
        },
      });
    } catch (error) {
      toast.error("Failed to submit quiz");
      console.error("Error submitting quiz:", error);
    }
  };

  const handleFinishQuiz = () => {
    setShowFinishConfirm(true);
  };

  const confirmFinishQuiz = () => {
    setShowFinishConfirm(false);
    handleSubmitQuiz();
  };

  const cancelFinishQuiz = () => {
    setShowFinishConfirm(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Quiz not found
          </h1>
          <button
            onClick={() => navigate("/quizzes")}
            className="text-primary-600 hover:text-primary-700"
          >
            ← Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {quiz.title}
            </h1>
            <p className="text-gray-600 mb-6">{quiz.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {quiz.questions.length}
                </div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {quiz.timeLimit}
                </div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {quiz.passingScore}%
                </div>
                <div className="text-sm text-gray-600">To Pass</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {quiz.difficulty}
                </div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startQuiz}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
            <div className="text-right">
              <div className="text-sm text-gray-600">Time Remaining</div>
              <div
                className={`text-2xl font-bold ${
                  timeLeft < 60 ? "text-red-600" : "text-gray-800"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
            <div className="w-64 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestion + 1) / quiz.questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQ.questionText}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <label
                key={index}
                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[currentQuestion] === index
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswerSelect(currentQuestion, index)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      answers[currentQuestion] === index
                        ? "border-primary-500 bg-primary-500"
                        : "border-gray-300"
                    }`}
                  >
                    {answers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <span className="text-gray-800">{option}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          {/* Question Navigation */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium ${
                    index === currentQuestion
                      ? "bg-primary-600 text-white"
                      : answers[index] !== null
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                onClick={handleFinishQuiz}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
              >
                Finish Quiz
              </button>

              {currentQuestion === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Finish Confirmation Modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                <span className="text-orange-600 text-2xl">⚠️</span>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Finish Quiz Early?
              </h3>

              <p className="text-sm text-gray-500 mb-6">
                You still have{" "}
                {quiz.questions.length -
                  answers.filter((answer) => answer !== null).length}{" "}
                unanswered questions. Are you sure you want to finish the quiz
                now?
              </p>

              <div className="flex space-x-3 justify-center">
                <button
                  onClick={cancelFinishQuiz}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Continue Quiz
                </button>
                <button
                  onClick={confirmFinishQuiz}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                >
                  Yes, Finish Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetail;
