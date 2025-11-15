import { useState, useEffect } from 'react';
import { returnAPI } from '../../services/api';
import { HiRefresh, HiX } from 'react-icons/hi';

const ReturnsTab = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const response = await returnAPI.getUserReturns();
      setReturns(response.data);
    } catch (err) {
      console.error('Failed to fetch returns:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      'picked up': 'bg-blue-100 text-blue-800 border-blue-200',
      refunded: 'bg-purple-100 text-purple-800 border-purple-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[statusLower] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getReasonLabel = (reason) => {
    const reasons = {
      defective: 'Defective Product',
      wrong_item: 'Wrong Item Received',
      not_as_described: 'Not as Described',
      damaged: 'Damaged During Shipping',
      changed_mind: 'Changed My Mind',
      size_issue: 'Size/Fit Issue',
      quality_issue: 'Quality Issue',
      other: 'Other'
    };
    return reasons[reason] || reason;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#1F2D38' }}>Return Requests</h2>
            <p className="text-sm mt-1" style={{ color: '#94A1AB' }}>Track your return and refund requests</p>
          </div>
          <button
            onClick={fetchReturns}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Refresh"
          >
            <HiRefresh className="w-5 h-5" style={{ color: '#895F42' }} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 mx-auto" style={{ borderColor: '#895F42' }}></div>
          <p className="mt-4 text-sm sm:text-base" style={{ color: '#94A1AB' }}>Loading returns...</p>
        </div>
      ) : returns.length > 0 ? (
        <div className="space-y-4">
          {returns.map((returnReq) => (
            <div
              key={returnReq._id}
              className="border-2 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
              style={{ borderColor: '#E0EAF0' }}
              onClick={() => {
                setSelectedReturn(returnReq);
                setShowDetails(true);
              }}
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold" style={{ color: '#1F2D38' }}>
                      Return Request #{returnReq._id.slice(-8)}
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: '#94A1AB' }}>
                    Submitted on {new Date(returnReq.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(returnReq.status)}`}>
                  {returnReq.status}
                </span>
              </div>

              <div className="border-t border-b py-2 mb-2" style={{ borderColor: '#f3f4f6' }}>
                <p className="text-sm mb-1" style={{ color: '#1F2D38' }}>
                  <span className="font-medium">Reason:</span> {getReasonLabel(returnReq.returnReason)}
                </p>
                <p className="text-xs" style={{ color: '#94A1AB' }}>
                  {returnReq.items?.length || 0} item(s)
                </p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#94A1AB' }}>
                  Refund Amount
                </span>
                <span className="text-lg font-bold" style={{ color: '#895F42' }}>
                  ₹{returnReq.refundAmount?.toLocaleString()}
                </span>
              </div>

              {returnReq.adminNotes && (
                <div className="mt-3 p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-800 mb-1">Admin Note:</p>
                  <p className="text-xs text-blue-700">{returnReq.adminNotes}</p>
                </div>
              )}

              {returnReq.isRefunded && (
                <div className="mt-3 p-2 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-xs font-semibold text-green-800">
                    ✓ Refunded on {new Date(returnReq.refundedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <HiRefresh className="w-10 h-10" style={{ color: '#94A1AB' }} />
          </div>
          <p className="text-base sm:text-lg mb-2" style={{ color: '#94A1AB' }}>No return requests yet</p>
          <p className="text-sm" style={{ color: '#94A1AB' }}>Your return requests will appear here</p>
        </div>
      )}

      {/* Return Details Modal */}
      {showDetails && selectedReturn && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowDetails(false)}
            ></div>

            <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-2xl transform transition-all">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E0EAF0' }}>
                <h3 className="text-xl font-bold" style={{ color: '#1F2D38' }}>Return Request Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <HiX className="w-5 h-5" style={{ color: '#94A1AB' }} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-6">
                {/* Status */}
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: '#94A1AB' }}>Current Status</p>
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold border ${getStatusColor(selectedReturn.status)}`}>
                    {selectedReturn.status}
                  </span>
                </div>

                {/* Request ID */}
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: '#94A1AB' }}>Request ID</p>
                  <p className="text-sm font-mono" style={{ color: '#1F2D38' }}>{selectedReturn._id}</p>
                </div>

                {/* Reason */}
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: '#94A1AB' }}>Reason</p>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#1F2D38' }}>
                    {getReasonLabel(selectedReturn.returnReason)}
                  </p>
                  <p className="text-sm" style={{ color: '#64748b' }}>{selectedReturn.returnDescription}</p>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: '#94A1AB' }}>Items to Return</p>
                  <div className="space-y-2">
                    {selectedReturn.items?.map((item, index) => (
                      <div key={index} className="flex gap-3 p-3 rounded-lg" style={{ backgroundColor: '#fafaf9' }}>
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold mb-1" style={{ color: '#1F2D38' }}>{item.name}</p>
                          <p className="text-xs" style={{ color: '#94A1AB' }}>Qty: {item.quantity}</p>
                          <p className="text-sm font-bold mt-1" style={{ color: '#895F42' }}>
                            ₹{(item.price * item.quantity)?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                {selectedReturn.images && selectedReturn.images.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: '#94A1AB' }}>
                      Attached Images ({selectedReturn.images.length})
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedReturn.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                          style={{ borderColor: '#E0EAF0' }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Refund Amount */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-xs font-medium mb-1 text-green-800">Refund Amount</p>
                  <p className="text-2xl font-bold text-green-700">
                    ₹{selectedReturn.refundAmount?.toLocaleString()}
                  </p>
                  {selectedReturn.isRefunded && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Refunded on {new Date(selectedReturn.refundedAt).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </div>

                {/* Admin Notes */}
                {selectedReturn.adminNotes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs font-medium mb-1 text-blue-800">Admin Response</p>
                    <p className="text-sm text-blue-700">{selectedReturn.adminNotes}</p>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: '#94A1AB' }}>Timeline</p>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span style={{ color: '#64748b' }}>Submitted:</span>
                      <span style={{ color: '#1F2D38' }}>
                        {new Date(selectedReturn.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {selectedReturn.isRefunded && selectedReturn.refundedAt && (
                      <div className="flex justify-between">
                        <span style={{ color: '#64748b' }}>Refunded:</span>
                        <span className="text-green-600 font-semibold">
                          {new Date(selectedReturn.refundedAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsTab;
