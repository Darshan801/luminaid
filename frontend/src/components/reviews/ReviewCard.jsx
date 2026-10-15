import { useState, useEffect, useContext } from 'react';
import { Star, ThumbsUp, Flag, Check } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { voteReview, reportReview } from '../../services/reviewService';
import { formatDistanceToNow } from 'date-fns';

const ReviewCard = ({ review, onVote, onReport }) => {
  const { user } = useContext(AuthContext);
  const [voting, setVoting] = useState(false);
  const [userVote, setUserVote] = useState(review.userVote || null); // 'helpful', 'not-helpful', or null
  const [localHelpful, setLocalHelpful] = useState(review.helpful || 0); // Local count
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);

  // Sync state when review prop changes
  useEffect(() => {
    setUserVote(review.userVote || null);
    setLocalHelpful(review.helpful || 0);
  }, [review._id, review.userVote, review.helpful]); // Only update when review ID or these specific fields change

  const handleVote = async (voteType) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }

    if (voting) return;

    setVoting(true);
    try {
      const response = await voteReview(review._id, voteType);
      
      // The voteReview service already extracts data, so response.data contains the actual data
      // But we need to check if it's the outer wrapper or inner data
      const voteData = response.data || response;
      
      // Update local state with new vote status
      setUserVote(voteData.userVote);
      setLocalHelpful(voteData.helpful);
      
      // Update parent component with new counts
      if (onVote) {
        onVote(review._id, voteData.helpful, voteData.notHelpful);
      }
    } catch (error) {
      console.error('Vote error:', error);
      alert(error.message || 'Failed to record vote');
    } finally {
      setVoting(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      alert('Please provide a reason for reporting');
      return;
    }

    setReporting(true);
    try {
      await reportReview(review._id, reportReason);
      if (onReport) onReport(review._id);
      setShowReportModal(false);
      setReportReason('');
      alert('Review reported successfully');
    } catch (error) {
      console.error('Report error:', error);
      alert(error.message || 'Failed to report review');
    } finally {
      setReporting(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-soft p-6 shadow-soft hover:shadow-medium transition-shadow duration-fast">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-gray-900">{review.authorName}</h4>
              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-soft">
                  <Check size={12} />
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < review.rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          {user && (
            <button
              onClick={() => setShowReportModal(true)}
              className="text-gray-400 hover:text-red-600 transition-colors duration-fast p-1"
              title="Report review"
            >
              <Flag size={16} />
            </button>
          )}
        </div>

        {/* Title */}
        <h5 className="font-bold text-gray-900 mb-2">{review.title}</h5>

        {/* Comment */}
        <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

        {/* Admin Response */}
        {review.response && (
          <div className="bg-gray-50 border-l-4 border-brand-orange p-4 rounded-soft mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-brand-orange uppercase">
                Response from LuminAID
              </span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(review.response.respondedAt), {
                  addSuffix: true
                })}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {review.response.text}
            </p>
          </div>
        )}

        {/* Helpfulness - Facebook Style */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleVote('helpful')}
            disabled={voting || !user}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm transition-all duration-fast disabled:opacity-50 disabled:cursor-not-allowed ${
              userVote === 'helpful'
                ? 'bg-brand-orange text-white shadow-soft hover:bg-brand-orange/90'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ThumbsUp 
              size={16} 
              className={userVote === 'helpful' ? 'fill-white' : ''} 
            />
            <span>Like</span>
            {localHelpful > 0 && (
              <span className={`ml-1 ${userVote === 'helpful' ? 'text-white' : 'text-gray-900'}`}>
                {localHelpful}
              </span>
            )}
          </button>
          
          {!user && (
            <span className="text-xs text-gray-500">Login to like reviews</span>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-soft max-w-md w-full p-6 shadow-glow-lg">
            <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">
              Report Review
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for reporting this review:
            </p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border border-gray-300 rounded-soft p-3 text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-fast min-h-[100px]"
              placeholder="e.g., Inappropriate content, spam, offensive language..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                }}
                disabled={reporting}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-soft hover:bg-gray-50 transition-colors duration-fast disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={reporting || !reportReason.trim()}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-soft hover:bg-red-700 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reporting ? 'Reporting...' : 'Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewCard;
