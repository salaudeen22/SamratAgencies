import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import { returnAPI } from '../../services/api';

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchReturns();
  }, [statusFilter]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (statusFilter) params.status = statusFilter;

      const response = await returnAPI.getAllReturns(params);
      setReturns(response.data.returns);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch returns');
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (returnId) => {
    try {
      const response = await returnAPI.getById(returnId);
      setSelectedReturn(response.data);
      setShowDetails(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch return details');
    }
  };

  const updateReturnStatus = async (returnId, status, notes = '') => {
    try {
      await returnAPI.updateReturnStatus(returnId, {
        status,
        adminNotes: notes,
        refundMethod: status === 'Refunded' ? 'original_payment' : undefined
      });
      fetchReturns();
      if (selectedReturn?._id === returnId) {
        viewDetails(returnId);
      }
      toast.success(`Return status updated to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update return status');
    }
  };

  const statuses = ['Pending', 'Approved', 'Rejected', 'Picked Up', 'Refunded', 'Cancelled'];

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      'Picked Up': 'bg-blue-100 text-blue-800',
      Refunded: 'bg-purple-100 text-purple-800',
      Cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getReasonLabel = (reason) => {
    const reasons = {
      defective: 'Defective',
      wrong_item: 'Wrong Item',
      not_as_described: 'Not as Described',
      damaged: 'Damaged',
      changed_mind: 'Changed Mind',
      size_issue: 'Size Issue',
      quality_issue: 'Quality Issue',
      other: 'Other'
    };
    return reasons[reason] || reason;
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Returns & Refunds Management"
        subtitle={`Manage ${returns.length} return requests`}
        action={
          showDetails && (
            <button
              onClick={() => setShowDetails(false)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: '#64748b' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#475569'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#64748b'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to List
            </button>
          )
        }
      />

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === '' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#e2e8f0', borderTopColor: '#895F42' }}></div>
            <p className="text-lg font-medium" style={{ color: '#64748b' }}>Loading returns...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-lg font-semibold text-red-600 mb-2">Error loading returns</p>
          <p className="text-sm" style={{ color: '#64748b' }}>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Returns List */}
          <div className={`bg-white rounded-lg shadow overflow-hidden ${showDetails ? 'hidden lg:block' : ''}`}>
            <div className="px-4 lg:px-6 py-3 lg:py-4 bg-gray-50 border-b">
              <h3 className="font-semibold text-sm lg:text-base">Return Requests ({returns.length})</h3>
            </div>
            <div className="max-h-[400px] lg:max-h-[600px] overflow-y-auto">
              {returns.map((returnReq) => (
                <div
                  key={returnReq._id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedReturn?._id === returnReq._id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => viewDetails(returnReq._id)}
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{returnReq.user?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600 truncate">{returnReq.user?.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${getStatusColor(returnReq.status)}`}>
                      {returnReq.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>Reason:</strong> {getReasonLabel(returnReq.returnReason)}
                  </div>
                  <div className="flex justify-between items-center text-sm gap-2">
                    <span className="text-gray-600">{returnReq.items?.length || 0} items</span>
                    <span className="font-semibold">₹{returnReq.refundAmount?.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(returnReq.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              ))}
              {returns.length === 0 && (
                <div className="text-center py-8 text-gray-500">No return requests found</div>
              )}
            </div>
          </div>

          {/* Return Details */}
          <div className={`bg-white rounded-lg shadow ${showDetails ? 'block' : 'hidden lg:block'}`}>
            {showDetails && selectedReturn ? (
              <div className="lg:relative">
                <div className="px-4 lg:px-6 py-3 lg:py-4 bg-gray-50 border-b flex justify-between items-center sticky top-0 z-10">
                  <h3 className="font-semibold text-sm lg:text-base">Return Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="hidden lg:block text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 lg:p-6 max-h-[calc(100vh-200px)] lg:max-h-[600px] overflow-y-auto">
                  {/* Customer Info */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Customer</h4>
                    <p className="text-sm">{selectedReturn.user?.name}</p>
                    <p className="text-sm text-gray-600">{selectedReturn.user?.email}</p>
                    <p className="text-sm text-gray-600">{selectedReturn.user?.phone}</p>
                  </div>

                  {/* Return Reason */}
                  <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <h4 className="font-semibold mb-2">Return Reason</h4>
                    <p className="text-sm font-medium text-blue-600">{getReasonLabel(selectedReturn.returnReason)}</p>
                    <p className="text-sm text-gray-700 mt-2">{selectedReturn.returnDescription}</p>
                  </div>

                  {/* Return Items */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Items</h4>
                    <div className="space-y-2">
                      {selectedReturn.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b">
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            {item.reason && (
                              <p className="text-xs text-red-600">Reason: {item.reason}</p>
                            )}
                          </div>
                          <p className="text-sm font-semibold">₹{(item.price * item.quantity)?.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Images */}
                  {selectedReturn.images && selectedReturn.images.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Attached Images ({selectedReturn.images.length})</h4>
                      {console.log('Return Images:', selectedReturn.images)}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedReturn.images.map((image, index) => {
                          console.log(`Image ${index + 1}:`, image);
                          return (
                            <div key={index} className="relative group">
                              {!image || imageErrors[`${selectedReturn._id}-${index}`] ? (
                                <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
                                  <div className="text-center text-xs text-gray-500">
                                    <svg className="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-xs">{!image ? 'No URL' : 'Failed to load'}</p>
                                    {image && <p className="text-xs mt-1 break-all px-2">{image.substring(0, 30)}...</p>}
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={image}
                                  alt={`Return evidence ${index + 1}`}
                                  className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setSelectedImage(image)}
                                  onError={(e) => {
                                    console.error(`Failed to load image ${index + 1}:`, image);
                                    setImageErrors(prev => ({ ...prev, [`${selectedReturn._id}-${index}`]: true }));
                                  }}
                                />
                              )}
                              <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                                {index + 1}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Pickup Address */}
                  {selectedReturn.pickupAddress && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Pickup Address</h4>
                      <p className="text-sm">{selectedReturn.pickupAddress.name}</p>
                      <p className="text-sm">{selectedReturn.pickupAddress.phone}</p>
                      <p className="text-sm">{selectedReturn.pickupAddress.address}</p>
                      <p className="text-sm">
                        {selectedReturn.pickupAddress.city}, {selectedReturn.pickupAddress.state}
                      </p>
                      <p className="text-sm">{selectedReturn.pickupAddress.pincode}</p>
                    </div>
                  )}

                  {/* Refund Amount */}
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold mb-1">Refund Amount</h4>
                    <p className="text-2xl font-bold text-green-700">₹{selectedReturn.refundAmount?.toLocaleString()}</p>
                    {selectedReturn.isRefunded && selectedReturn.refundedAt && (
                      <p className="text-xs text-green-600 mt-1">
                        Refunded on: {new Date(selectedReturn.refundedAt).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>

                  {/* Admin Notes */}
                  {selectedReturn.adminNotes && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="font-semibold mb-1 text-blue-800">Admin Notes</h4>
                      <p className="text-sm text-blue-700">{selectedReturn.adminNotes}</p>
                    </div>
                  )}

                  {/* Status Update */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm lg:text-base">Update Status</h4>
                    <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            const notes = prompt(`Enter notes for ${status} status (optional):`);
                            updateReturnStatus(selectedReturn._id, status, notes || '');
                          }}
                          className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                            selectedReturn.status === status
                              ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-300'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Select a return request to view details
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Return evidence"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default Returns;
