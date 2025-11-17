import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { reviewAPI, uploadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiStar, FiUser, FiImage, FiX } from 'react-icons/fi';

const ProductReviews = ({ productId }) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

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

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 images
    if (selectedImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Check file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    setSelectedImages([...selectedImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

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

      let uploadedImages = [];

      // Upload images if any selected
      if (selectedImages.length > 0) {
        setUploadingImages(true);
        try {
          const response = await uploadAPI.uploadImages(selectedImages);
          uploadedImages = response.data.images || [];
        } catch (error) {
          toast.error('Failed to upload images');
          console.error('Image upload error:', error);
        } finally {
          setUploadingImages(false);
        }
      }

      await reviewAPI.create({
        product: productId,
        rating,
        comment: comment.trim(),
        images: uploadedImages
      });

      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      setSelectedImages([]);
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
    <div className="py-4 sm:py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#2F1A0F' }}>
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-base sm:text-lg font-semibold" style={{ color: '#816047' }}>
                {averageRating} out of 5
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        {isAuthenticated && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 rounded-lg text-white font-medium transition-colors text-sm sm:text-base w-full sm:w-auto"
            style={{ backgroundColor: '#816047' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D7B790'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#816047'}
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg border-2" style={{ borderColor: '#D7B790', backgroundColor: '#F0F9FF' }}>
          <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: '#2F1A0F' }}>
            Write Your Review
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
              Rating
            </label>
            {renderStars(rating, true, setRating)}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none resize-none"
              style={{ borderColor: '#D7B790' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#816047'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#D7B790'}
              rows={4}
              minLength={10}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
              Add Photos (Optional)
            </label>
            <div className="flex flex-wrap gap-3">
              {/* Selected Images Preview */}
              {selectedImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border-2"
                    style={{ borderColor: '#D7B790' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {selectedImages.length < 5 && (
                <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#D7B790' }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <FiImage className="w-6 h-6" style={{ color: '#816047' }} />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              You can upload up to 5 images (max 5MB each)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting || uploadingImages || comment.trim().length < 10}
              className="px-6 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
              style={{ backgroundColor: '#816047' }}
            >
              {uploadingImages ? 'Uploading images...' : submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReviewForm(false);
                setComment('');
                setRating(5);
                setSelectedImages([]);
              }}
              className="px-6 py-2 rounded-lg font-medium transition-colors border-2 text-sm sm:text-base w-full sm:w-auto"
              style={{ borderColor: '#D7B790', color: '#2F1A0F' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto" style={{ borderColor: '#816047' }}></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
          {isAuthenticated && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#816047' }}
            >
              Write the First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-4 sm:p-6 rounded-lg border-2"
              style={{ borderColor: '#E6CDB1', backgroundColor: 'white' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="flex items-start gap-2 sm:gap-3 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0" style={{ backgroundColor: '#816047' }}>
                    {review.user?.name ? (
                      <span className="text-sm sm:text-base">{review.user.name.charAt(0).toUpperCase()}</span>
                    ) : (
                      <FiUser className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base" style={{ color: '#2F1A0F' }}>
                      {review.user?.name || 'Anonymous'}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      {review.isVerifiedPurchase && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{review.comment}</p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {review.images.map((image, index) => (
                    <a
                      key={index}
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={image.url}
                        alt={`Review image ${index + 1}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 hover:opacity-80 transition-opacity cursor-pointer"
                        style={{ borderColor: '#D7B790' }}
                      />
                    </a>
                  ))}
                </div>
              )}
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
