import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Card from '../../components/admin/ui/Card';
import Button from '../../components/admin/ui/Button';
import { reviewAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FaStar, FaCheck, FaTimes, FaTrash, FaShieldAlt, FaClock, FaImage, FaBoxOpen } from 'react-icons/fa';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [filterStatus, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 10 };
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      const response = await reviewAPI.getAllReviews(params);
      setReviews(response.data.reviews);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await reviewAPI.updateReviewStatus(reviewId, true);
      toast.success('Review approved successfully');
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve review');
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await reviewAPI.updateReviewStatus(reviewId, false);
      toast.success('Review rejected successfully');
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewAPI.adminDelete(reviewId);
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}
            size={18}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#e2e8f0', borderTopColor: '#816047' }}></div>
            <p className="text-lg font-medium" style={{ color: '#64748b' }}>Loading reviews...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Reviews Management"
          subtitle="Manage and moderate customer product reviews"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Total Reviews</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#2F1A0F' }}>{total}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                <FaStar className="text-xl text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Approved</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{reviews.filter(r => r.isApproved).length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                <FaCheck className="text-xl text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Pending</p>
                <p className="text-2xl font-bold mt-1 text-orange-600">{reviews.filter(r => !r.isApproved).length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100">
                <FaClock className="text-xl text-orange-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Avg Rating</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#2F1A0F' }}>{getAverageRating()}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100">
                <FaStar className="text-xl text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setFilterStatus('all');
                  setCurrentPage(1);
                }}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'approved' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setFilterStatus('approved');
                  setCurrentPage(1);
                }}
              >
                Approved
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setFilterStatus('pending');
                  setCurrentPage(1);
                }}
              >
                Pending
              </Button>
            </div>
            <span className="text-sm font-medium" style={{ color: '#64748b' }}>
              {reviews.length} reviews
            </span>
          </div>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <Card>
              <div className="text-center py-16">
                <FaBoxOpen className="text-5xl mx-auto mb-4" style={{ color: '#cbd5e1' }} />
                <p className="text-lg font-medium mb-1" style={{ color: '#64748b' }}>No reviews found</p>
                <p className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                  {filterStatus === 'pending' ? 'All reviews are approved!' : 'Reviews will appear here'}
                </p>
              </div>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review._id}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="shrink-0">
                      {review.product?.images?.[0] ? (
                        <img
                          src={review.product.images[0]}
                          alt={review.product.name}
                          className="w-24 h-24 object-cover rounded-lg border"
                          style={{ borderColor: '#e2e8f0' }}
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-lg border flex items-center justify-center bg-gray-50" style={{ borderColor: '#e2e8f0' }}>
                          <FaBoxOpen className="text-3xl text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="grow space-y-3">
                      {/* Product Name & Status */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold mb-1" style={{ color: '#2F1A0F' }}>
                            {review.product?.name || 'Product Deleted'}
                          </h3>
                          <div className="flex items-center gap-3">
                            {renderStars(review.rating)}
                            <span className="text-sm font-medium" style={{ color: '#64748b' }}>
                              {review.rating}.0
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className="px-4 py-2 rounded-full text-sm font-semibold shrink-0"
                          style={{
                            backgroundColor: review.isApproved ? '#dcfce7' : '#fef3c7',
                            color: review.isApproved ? '#166534' : '#92400e'
                          }}
                        >
                          {review.isApproved ? '✓ Approved' : '⏱ Pending'}
                        </span>
                      </div>

                      {/* Review Title */}
                      {review.title && (
                        <h4 className="text-base font-semibold" style={{ color: '#2F1A0F' }}>
                          {review.title}
                        </h4>
                      )}

                      {/* Review Comment */}
                      <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                        {review.comment}
                      </p>

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {review.images.map((img, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={img.url}
                                alt={`Review ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border cursor-pointer transition-transform hover:scale-105"
                                style={{ borderColor: '#e2e8f0' }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                                <FaImage className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 text-sm flex-wrap" style={{ color: '#64748b' }}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#816047' }}>
                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="font-medium">{review.user?.name || 'Unknown User'}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <FaClock size={12} />
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                        {review.isVerifiedPurchase && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1.5 text-green-600 font-medium">
                              <FaShieldAlt size={12} />
                              <span>Verified Purchase</span>
                            </div>
                          </>
                        )}
                        {review.user?.email && (
                          <>
                            <span>•</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{review.user.email}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t" style={{ borderColor: '#e2e8f0' }}>
                    {!review.isApproved ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(review._id)}
                      >
                        <FaCheck className="mr-2" size={14} />
                        Approve Review
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(review._id)}
                      >
                        <FaTimes className="mr-2" size={14} />
                        Reject
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(review._id)}
                    >
                      <FaTrash className="mr-2" size={12} />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <span className="px-4 font-medium" style={{ color: '#64748b' }}>
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Reviews;
