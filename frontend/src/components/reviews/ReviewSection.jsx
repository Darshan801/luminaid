import { useState, useEffect, useContext } from 'react';
import { MessageSquare } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import ReviewStats from './ReviewStats';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { getReviewStats, canUserReview } from '../../services/reviewService';

const ReviewSection = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key to force ReviewList re-fetch

  useEffect(() => {
    fetchStats();
  }, [productId]);

  useEffect(() => {
    if (user) {
      checkReviewEligibility();
    }
  }, [productId, user?._id]); // Only re-run when user ID changes, not the entire user object

  const fetchStats = async () => {
    try {
      const data = await getReviewStats(productId);
      setStats(data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const checkReviewEligibility = async () => {
    setCheckingEligibility(true);
    try {
      const result = await canUserReview(productId);
      setCanReview(result);
    } catch (error) {
      console.error('Check eligibility error:', error);
      setCanReview(null);
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    fetchStats();
    setRefreshKey(prev => prev + 1); // Increment key to force ReviewList refresh
    if (user) {
      checkReviewEligibility();
    }
  };

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-3">
            Customer Reviews
          </h2>
          <p className="text-base text-gray-600">
            Read what our customers have to say about this product
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Stats */}
          <div>
            {stats ? (
              <ReviewStats stats={stats} />
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-soft p-6 text-center">
                <p className="text-gray-600">Loading statistics...</p>
              </div>
            )}

            {/* Write Review Button */}
            {user && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full mt-6 bg-brand-orange text-white py-3 px-6 font-bold rounded-soft hover:bg-brand-orange-dark active:scale-95 transition-all duration-fast shadow-glow-sm hover:shadow-glow-md flex items-center justify-center gap-2"
              >
                <MessageSquare size={20} />
                Write a Review
              </button>
            )}

            {/* Not Logged In Message */}
            {!user && (
              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-soft p-4 text-center">
                <p className="text-sm text-gray-700 mb-3">Want to share your experience?</p>
                <a
                  href="/login"
                  className="inline-block bg-brand-orange text-white px-6 py-2.5 font-bold rounded-soft hover:bg-brand-orange-dark transition-colors duration-fast"
                >
                  Login to Review
                </a>
              </div>
            )}

            {/* Already Reviewed Message */}
            {user && canReview && !canReview.canReview && canReview.reason === 'Already reviewed' && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-soft p-4 text-center">
                <p className="text-sm text-blue-800 font-medium">
                  You have already reviewed this product
                </p>
              </div>
            )}
          </div>

          {/* Right: Reviews or Form */}
          <div className="lg:col-span-2">
            {showReviewForm ? (
              <div className="space-y-4">
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-sm text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors duration-fast"
                >
                  ← Back to Reviews
                </button>
                <ReviewForm productId={productId} onSuccess={handleReviewSuccess} />
              </div>
            ) : (
              <ReviewList key={refreshKey} productId={productId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
