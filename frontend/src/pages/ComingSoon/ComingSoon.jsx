import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Bell } from 'lucide-react';

const ComingSoon = ({ collectionName = 'This Collection' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-orange/20 rounded-full blur-2xl"></div>
            <div className="relative bg-white rounded-full p-6 shadow-xl">
              <Clock size={64} className="text-primary-orange" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
          Coming Soon
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-600 mb-4">
          {collectionName} is Currently Under Development
        </p>
        <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
          We're working hard to bring you an amazing shopping experience. Check back soon to explore our curated collection!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary-red hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors shadow-lg text-base"
          >
            Browse All Products
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-bold px-8 py-4 rounded-lg transition-colors shadow-md border-2 border-gray-200 text-base"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bell size={24} className="text-primary-orange" />
            <h3 className="text-xl font-bold text-gray-900">Get Notified</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Enter your email to be the first to know when this collection launches.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-orange focus:outline-none text-base"
            />
            <button
              type="submit"
              className="bg-primary-orange hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors whitespace-nowrap text-base"
            >
              Notify Me
            </button>
          </form>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-3">🌟</div>
            <h4 className="font-bold text-gray-900 mb-2">Curated Selection</h4>
            <p className="text-sm text-gray-600">
              Hand-picked products designed for your outdoor adventures
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-bold text-gray-900 mb-2">Solar Powered</h4>
            <p className="text-sm text-gray-600">
              Sustainable lighting solutions that work anywhere, anytime
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-3">🎁</div>
            <h4 className="font-bold text-gray-900 mb-2">Perfect Gifts</h4>
            <p className="text-sm text-gray-600">
              Unique and practical gifts for outdoor enthusiasts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
