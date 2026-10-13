import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Bell } from 'lucide-react';

const ComingSoon = ({ collectionName = 'This Collection' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-orange/10 rounded-full blur-3xl"></div>
            <div className="relative bg-white rounded-full p-8 shadow-medium">
              <Clock size={72} className="text-brand-orange" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-6 leading-tight">
          Coming Soon
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl font-medium text-gray-700 mb-4">
          {collectionName} is Currently Under Development
        </p>
        <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed">
          We're working hard to bring you an amazing shopping experience. Check back soon to explore our curated collection!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark 
                     text-white font-bold px-8 py-4 rounded-soft 
                     transition-all duration-fast shadow-glow-sm hover:shadow-glow-md
                     active:scale-95 text-base"
          >
            Browse All Products
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 
                     text-gray-900 font-bold px-8 py-4 rounded-soft 
                     transition-all duration-fast shadow-soft hover:shadow-medium
                     border-2 border-gray-300 hover:border-gray-400
                     active:scale-95 text-base"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white rounded-soft shadow-medium p-8 md:p-10 max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
              <Bell size={22} className="text-brand-orange" />
            </div>
            <h3 className="text-xl font-heading font-bold text-gray-900">Get Notified</h3>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Enter your email to be the first to know when this collection launches.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-soft 
                       focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20
                       transition-all duration-fast text-base"
            />
            <button
              type="submit"
              className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-3 rounded-soft 
                       transition-all duration-fast shadow-glow-sm hover:shadow-glow-md
                       active:scale-95 whitespace-nowrap text-base"
            >
              Notify Me
            </button>
          </form>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-soft p-6 shadow-soft hover:shadow-medium transition-all duration-normal">
            <div className="text-4xl mb-3">🌟</div>
            <h4 className="font-bold text-gray-900 mb-2 text-lg">Curated Selection</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Hand-picked products designed for your outdoor adventures
            </p>
          </div>
          <div className="bg-white rounded-soft p-6 shadow-soft hover:shadow-medium transition-all duration-normal">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="font-bold text-gray-900 mb-2 text-lg">Solar Powered</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Sustainable lighting solutions that work anywhere, anytime
            </p>
          </div>
          <div className="bg-white rounded-soft p-6 shadow-soft hover:shadow-medium transition-all duration-normal">
            <div className="text-4xl mb-3">🎁</div>
            <h4 className="font-bold text-gray-900 mb-2 text-lg">Perfect Gifts</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Unique and practical gifts for outdoor enthusiasts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
