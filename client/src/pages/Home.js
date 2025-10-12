import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaQuestionCircle, FaUsers, FaGraduationCap, FaFlag, FaGavel } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaBookOpen className="w-8 h-8 text-primary-600" />,
      title: 'Constitutional Blogs',
      description: 'Learn about fundamental rights, duties, and directive principles through comprehensive, easy-to-understand articles.',
      link: '/blogs'
    },
    {
      icon: <FaQuestionCircle className="w-8 h-8 text-primary-600" />,
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with engaging quizzes and track your progress over time.',
      link: '/quizzes'
    },
    {
      icon: <FaUsers className="w-8 h-8 text-primary-600" />,
      title: 'Community Learning',
      description: 'Join thousands of citizens in understanding and appreciating our constitutional framework.',
      link: '/about'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Active Learners' },
    { number: '50+', label: 'Constitutional Articles' },
    { number: '25+', label: 'Interactive Quizzes' },
    { number: '95%', label: 'User Satisfaction' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Understanding India's
              <span className="block text-saffron">Constitution</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              Empowering citizens with constitutional literacy through interactive learning, 
              comprehensive blogs, and engaging quizzes about our nation's fundamental principles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/blogs"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Learning
              </Link>
              <Link
                to="/quizzes"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Take a Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Constitution Connect?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make constitutional knowledge accessible, engaging, and relevant for every Indian citizen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-xl text-gray-600">
              Thousands of citizens are already learning with us
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Constitutional Principles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Core Constitutional Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the fundamental pillars that form the foundation of our democracy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <FaFlag className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Fundamental Rights</h3>
              </div>
              <p className="text-gray-700 mb-4">
                The basic human rights guaranteed to every citizen, including the right to equality, 
                freedom, and constitutional remedies.
              </p>
              <Link
                to="/blogs?category=Fundamental Rights"
                className="text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                Explore Rights →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <FaGavel className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Fundamental Duties</h3>
              </div>
              <p className="text-gray-700 mb-4">
                The moral obligations of every citizen towards the nation, including respecting 
                the Constitution and promoting harmony.
              </p>
              <Link
                to="/blogs?category=Fundamental Duties"
                className="text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                Learn Duties →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <FaGraduationCap className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Directive Principles</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Guidelines for the state to establish a just society, including social, 
                economic, and political justice for all citizens.
              </p>
              <Link
                to="/blogs?category=Directive Principles"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Understand Principles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Constitutional Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of citizens who are already learning about their rights, 
            duties, and the principles that govern our great nation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
