import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiStar, FiUser } from 'react-icons/fi';

const ProductReviews = ({ productId }) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!productId) return; // Don't fetch if no productId

    try {
      setLoading(true);
      const response = await reviewAPI.getProductReviews(productId);
      // Ensure we always set an array
      const reviewsData = response.data?.reviews || response.data || [];
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviews([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Don't render if no productId
  if (!productId) {
    return null;
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    try {
      setSubmitting(true);
      await reviewAPI.create({
        product: productId,
        rating,
        comment: comment.trim()
      });

      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      setShowReviewForm(false);
      fetchReviews(); // Refresh reviews
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onRate(star) : undefined}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <FiStar
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1F2D38' }}>
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-lg font-semibold" style={{ color: '#895F42' }}>
                {averageRating} out of 5
              </span>
              <span className="text-sm text-gray-500">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        {isAuthenticated && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
            style={{ backgroundColor: '#895F42' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9F8065'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#895F42'}
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 rounded-lg border-2" style={{ borderColor: '#BDD7EB', backgroundColor: '#F0F9FF' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2D38' }}>
            Write Your Review
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
              Rating
            </label>
            {renderStars(rating, true, setRating)}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none resize-none"
              style={{ borderColor: '#BDD7EB' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#895F42'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#BDD7EB'}
              rows={4}
              minLength={10}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || comment.trim().length < 10}
              className="px-6 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#895F42' }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReviewForm(false);
                setComment('');
                setRating(5);
              }}
              className="px-6 py-2 rounded-lg font-medium transition-colors border-2"
              style={{ borderColor: '#BDD7EB', color: '#1F2D38' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto" style={{ borderColor: '#895F42' }}></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
          {isAuthenticated && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#895F42' }}
            >
              Write the First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-6 rounded-lg border-2"
              style={{ borderColor: '#E0EAF0', backgroundColor: 'white' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#895F42' }}>
                    {review.user?.name ? (
                      review.user.name.charAt(0).toUpperCase()
                    ) : (
                      <FiUser className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#1F2D38' }}>
                      {review.user?.name || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      {review.isVerifiedPurchase && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ProductReviews.propTypes = {
  productId: PropTypes.string.isRequired
};

export default ProductReviews;
