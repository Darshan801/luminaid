import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { getProductReviews } from '../../services/reviewService';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('-createdAt'); // Most Recent by default
  const [filterRating, setFilterRating] = useState(null);
  const [filterVerified, setFilterVerified] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setPage(1); // Reset to first page when sort/filter changes
  }, [sortBy, filterRating, filterVerified]);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, page, sortBy, filterRating, filterVerified]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        sort: sortBy
      };

      if (filterRating) {
        params.rating = filterRating;
      }

      if (filterVerified !== null) {
        params.verified = filterVerified;
      }

      const data = await getProductReviews(productId, params);
      setReviews(data.data || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Fetch reviews error:', error);
      setReviews([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterRating(null);
    setFilterVerified(null);
    setSortBy('-createdAt');
  };

  const activeFiltersCount = [filterRating, filterVerified].filter(f => f !== null).length;

  const handleVote = (reviewId, helpful, notHelpful) => {
    // Update with actual counts from server
    // Note: userVote is maintained in ReviewCard's local state
    setReviews((prev) =>
      prev.map((review) => {
        if (review._id === reviewId) {
          return {
            ...review,
            helpful: helpful,
            notHelpful: notHelpful
            // Don't update userVote here - it's handled by ReviewCard
          };
        }
        return review;
      })
    );
  };

  const handleReport = (reviewId) => {
    // Could show a success message or refresh reviews
    console.log('Review reported:', reviewId);
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand-orange border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Sort and Filter Controls */}
      <div className="bg-gray-50 border border-gray-200 rounded-soft p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Filter size={18} />
            <span className="font-semibold">
              {total} {total === 1 ? 'Review' : 'Reviews'}
            </span>
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-brand-orange text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors duration-fast"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {/* Sort and Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {/* Sort By */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-soft px-3 py-2 text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-fast"
              >
                <option value="-createdAt">Most Recent</option>
                <option value="createdAt">Oldest First</option>
                <option value="-rating">Highest Rating</option>
                <option value="rating">Lowest Rating</option>
                <option value="-helpful">Most Helpful</option>
              </select>
            </div>

            {/* Filter by Rating */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Filter by Rating
              </label>
              <select
                value={filterRating || ''}
                onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                className="w-full border border-gray-300 rounded-soft px-3 py-2 text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-fast"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Filter by Verified Purchase */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Purchase Status
              </label>
              <select
                value={filterVerified === null ? '' : filterVerified.toString()}
                onChange={(e) => setFilterVerified(e.target.value === '' ? null : e.target.value === 'true')}
                className="w-full border border-gray-300 rounded-soft px-3 py-2 text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-fast"
              >
                <option value="">All Reviews</option>
                <option value="true">Verified Purchase Only</option>
                <option value="false">Non-Verified Only</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
              <div className="md:col-span-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors duration-fast"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reviews List */}
      {!reviews || reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-soft">
          <p className="text-gray-600 text-lg">No reviews found</p>
          <p className="text-gray-500 text-sm mt-2">
            Be the first to review this product
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onVote={handleVote}
              onReport={handleReport}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && reviews && reviews.length > 0 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-soft font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {[...Array(Math.min(5, totalPages || 1))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={i}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-soft font-semibold transition-all duration-fast ${
                    page === pageNum
                      ? 'bg-brand-orange text-white shadow-glow-sm'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-soft font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
