import { useState, useContext } from 'react';
import { Star, Check, AlertCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { createReview } from '../../services/reviewService';

const ReviewForm = ({ productId, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await createReview({
        product: productId,
        rating,
        title: title.trim(),
        comment: comment.trim()
      });

      setSuccess(true);
      setIsPending(response.isPending || false);
      setRating(0);
      setTitle('');
      setComment('');

      setTimeout(() => {
        setSuccess(false);
        setIsPending(false);
        if (onSuccess) onSuccess();
      }, 2000); // Show success message for 2 seconds before refreshing
    } catch (err) {
      console.error('Submit review error:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-soft p-8 text-center">
        <p className="text-gray-700 mb-4">Please login to write a review</p>
        <a
          href="/login"
          className="inline-block bg-brand-orange text-white px-6 py-2.5 font-bold rounded-soft hover:bg-brand-orange-dark transition-colors duration-fast"
        >
          Login
        </a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-soft p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-4">
          <Check size={32} />
        </div>
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
          Thank You!
        </h3>
        <p className="text-gray-700">
          Your review has been submitted and published successfully.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-soft p-6 shadow-soft">
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-6">
        Write a Review
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-soft p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-900 mb-3">
          Your Rating *
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform duration-fast hover:scale-110 focus:outline-none"
            >
              <Star
                size={32}
                className={
                  value <= (hoverRating || rating)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                }
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm font-medium text-gray-700">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label htmlFor="review-title" className="block text-sm font-bold text-gray-900 mb-2">
          Review Title *
        </label>
        <input
          type="text"
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={200}
          className="w-full border border-gray-300 rounded-soft px-4 py-2.5 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-fast"
          required
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Minimum 5 characters</span>
          <span className="text-xs text-gray-500">{title.length}/200</span>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label htmlFor="review-comment" className="block text-sm font-bold text-gray-900 mb-2">
          Your Review *
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={5}
          maxLength={2000}
          className="w-full border border-gray-300 rounded-soft px-4 py-2.5 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-fast resize-none"
          required
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Minimum 10 characters</span>
          <span className="text-xs text-gray-500">{comment.length}/2000</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || rating === 0 || title.trim().length < 5 || comment.trim().length < 10}
        className="w-full bg-brand-orange text-white py-3 px-6 font-bold rounded-soft hover:bg-brand-orange-dark active:scale-95 transition-all duration-fast disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-sm hover:shadow-glow-md"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>

      <p className="text-xs text-gray-500 mt-4 text-center">
        * Required fields. Your review will be visible to other customers immediately.
      </p>
    </form>
  );
};

export default ReviewForm;
