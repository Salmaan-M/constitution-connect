import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">About Constitution Connect</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Empowering citizens with knowledge of the Indian Constitution through interactive learning and engagement.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Constitution Connect is dedicated to making the Indian Constitution accessible, understandable, and engaging for all citizens. We believe that a well-informed citizenry is the foundation of a strong democracy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Education</h3>
              <p className="text-gray-600">Comprehensive learning resources about constitutional principles</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Engagement</h3>
              <p className="text-gray-600">Interactive quizzes and assessments to test knowledge</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600">Building a community of constitutionally aware citizens</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📖 Educational Blogs</h3>
              <p className="text-gray-600">
                In-depth articles covering various aspects of the Indian Constitution, from fundamental rights to directive principles, written by constitutional experts and legal scholars.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🧠 Interactive Quizzes</h3>
              <p className="text-gray-600">
                Test your knowledge with our comprehensive quiz system covering different categories and difficulty levels, designed to reinforce learning and track progress.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed analytics, score tracking, and personalized recommendations to help you focus on areas that need improvement.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">💬 Community Support</h3>
              <p className="text-gray-600">
                Connect with fellow learners, ask questions, and participate in discussions about constitutional matters in a supportive and educational environment.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">🇮🇳 Constitutional Integrity</h3>
              <p className="text-gray-600">
                We are committed to presenting the Constitution accurately and without bias, ensuring that all citizens have access to reliable constitutional knowledge.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">🎓 Educational Excellence</h3>
              <p className="text-gray-600">
                Our content is created by experts and reviewed for accuracy, ensuring that learners receive the highest quality educational experience.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">🌍 Inclusivity</h3>
              <p className="text-gray-600">
                We believe constitutional education should be accessible to everyone, regardless of background, education level, or prior knowledge.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">🔄 Continuous Learning</h3>
              <p className="text-gray-600">
                We continuously update our content and features based on user feedback and the evolving understanding of constitutional principles.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Team</h2>
          <p className="text-lg text-gray-600 mb-8">
            Constitution Connect is built by a dedicated team of legal experts, educators, and technologists who share a passion for constitutional education.
          </p>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 text-2xl">⚖️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Legal Experts</h3>
                <p className="text-gray-600">Constitutional law scholars and practicing lawyers</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 text-2xl">👨‍🏫</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Educators</h3>
                <p className="text-gray-600">Experienced teachers and curriculum designers</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 text-2xl">💻</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Technologists</h3>
                <p className="text-gray-600">Developers and designers creating the platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-600 mb-6">Join thousands of citizens who are already learning about the Constitution</p>
          <div className="space-x-4">
            <a
              href="/register"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/quizzes"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Take a Quiz
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
