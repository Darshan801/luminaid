import { Star } from 'lucide-react';

const ReviewStats = ({ stats }) => {
  if (!stats) return null;

  const { totalReviews, averageRating, distribution, percentages } = stats;

  return (
    <div className="bg-white border border-gray-200 rounded-soft p-6 shadow-soft">
      {/* Overall Rating */}
      <div className="text-center pb-6 border-b border-gray-200">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              className={
                i < Math.floor(averageRating)
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }
            />
          ))}
        </div>
        <p className="text-sm text-gray-600">
          Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="pt-6 space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-3">
            <div className="flex items-center gap-1 min-w-[60px]">
              <span className="text-sm font-medium text-gray-700">{rating}</span>
              <Star size={14} className="text-gray-400 fill-gray-400" />
            </div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-orange transition-all duration-normal"
                style={{ width: `${percentages[rating]}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600 min-w-[50px] text-right">
              {percentages[rating]}%
            </span>
            <span className="text-xs text-gray-500 min-w-[30px] text-right">
              ({distribution[rating]})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewStats;
