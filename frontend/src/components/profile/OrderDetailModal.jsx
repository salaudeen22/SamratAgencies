import { useState, useEffect } from 'react';
import { HiPhone, HiXCircle } from 'react-icons/hi2';
import Modal from '../Modal';
import ReturnRequestModal from './ReturnRequestModal';
import { returnAPI, orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const OrderDetailModal = ({ isOpen, onClose, order, getStatusColor, onReturnSubmitted }) => {
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [existingReturn, setExistingReturn] = useState(null);
  const [checkingReturn, setCheckingReturn] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const canReturn = order?.status?.toLowerCase() === 'delivered';
  const canCancel = ['Pending', 'Processing'].includes(order?.status);

  useEffect(() => {
    if (isOpen && order && canReturn) {
      checkExistingReturn();
    }
  }, [isOpen, order?._id, canReturn]);

  const checkExistingReturn = async () => {
    if (!order) return;

    try {
      setCheckingReturn(true);
      const response = await returnAPI.getUserReturns();
      const activeReturn = response.data.find(
        ret => ret.order._id === order._id &&
        ['Pending', 'Approved', 'Picked Up'].includes(ret.status)
      );
      setExistingReturn(activeReturn);
    } catch (error) {
      console.error('Error checking returns:', error);
    } finally {
      setCheckingReturn(false);
    }
  };

  if (!order) return null;

  const handleReturnSuccess = () => {
    setShowReturnModal(false);
    onReturnSubmitted?.();
    onClose();
  };

  const handleRequestReturn = () => {
    if (existingReturn) {
      toast.error(`A ${existingReturn.status.toLowerCase()} return request already exists for this order`);
      return;
    }
    setShowReturnModal(true);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      setCancelling(true);
      await orderAPI.cancelOrder(order._id, { cancellationReason: cancelReason });
      toast.success('Order cancelled successfully');
      setShowCancelConfirm(false);
      setCancelReason('');
      onReturnSubmitted?.(); // Refresh orders list
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Order Details">
        <div className="space-y-6">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 pb-4 border-b" style={{ borderColor: '#D7B790' }}>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Order ID</p>
            <p className="text-sm font-mono break-all" style={{ color: '#2F1A0F' }}>{order._id}</p>
            <p className="text-xs mt-2" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Status</p>
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold inline-block ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#2F1A0F' }}>Order Items</h3>
          <div className="space-y-3">
            {order.items?.map((item, index) => {
              const itemImage = item.image || item.product?.images?.[0]?.url || item.product?.images?.[0];
              const itemName = item.name || item.product?.name || 'Product';
              return (
                <div key={index} className="flex gap-4 p-3 rounded-lg" style={{ backgroundColor: '#fafaf9' }}>
                  {itemImage && (
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1" style={{ color: '#2F1A0F' }}>
                      {itemName}
                    </p>
                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <div className="text-xs mb-1" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                        {Object.entries(item.selectedVariants).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Quantity: {item.quantity}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: '#816047' }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t pt-4" style={{ borderColor: '#D7B790' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#2F1A0F' }}>Price Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Subtotal</span>
              <span style={{ color: '#2F1A0F' }}>₹{(order.itemsPrice || 0).toLocaleString()}</span>
            </div>
            {order.taxPrice > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Tax</span>
                <span style={{ color: '#2F1A0F' }}>₹{order.taxPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Shipping</span>
              <span className="text-green-600 font-medium">
                {order.shippingPrice > 0 ? `₹${order.shippingPrice.toLocaleString()}` : 'FREE'}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t" style={{ borderColor: '#D7B790' }}>
              <span style={{ color: '#2F1A0F' }}>Total Amount</span>
              <span style={{ color: '#816047' }}>₹{(order.totalPrice || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="border-t pt-4" style={{ borderColor: '#D7B790' }}>
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#2F1A0F' }}>Shipping Address</h3>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#fafaf9' }}>
              <p className="font-semibold mb-1" style={{ color: '#2F1A0F' }}>{order.shippingAddress.name}</p>
              <p className="text-sm mb-1" style={{ color: '#2F1A0F' }}>{order.shippingAddress.address}</p>
              <p className="text-sm mb-1" style={{ color: '#2F1A0F' }}>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-sm flex items-center gap-1 mt-2" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                <HiPhone className="w-4 h-4" />
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>
        )}

        {/* Payment Info */}
        <div className="border-t pt-4" style={{ borderColor: '#D7B790' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#2F1A0F' }}>Payment Information</h3>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#fafaf9' }}>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Payment Method</span>
              <span className="font-medium" style={{ color: '#2F1A0F' }}>
                {order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Payment Status</span>
              <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>
            {order.isPaid && order.paidAt && (
              <div className="flex justify-between items-center text-sm mt-2">
                <span style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Paid On</span>
                <span className="font-medium" style={{ color: '#2F1A0F' }}>
                  {new Date(order.paidAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Cancel Order Button */}
        {canCancel && (
          <div className="border-t pt-4" style={{ borderColor: '#D7B790' }}>
            {!showCancelConfirm ? (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full py-3 px-4 rounded-lg font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
              >
                <HiXCircle className="w-5 h-5" />
                Cancel Order
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-800 mb-3">
                  Are you sure you want to cancel this order?
                </p>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation..."
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  style={{ borderColor: '#fecaca' }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling || !cancelReason.trim()}
                    className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#dc2626' }}
                  >
                    {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                  <button
                    onClick={() => {
                      setShowCancelConfirm(false);
                      setCancelReason('');
                    }}
                    disabled={cancelling}
                    className="flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#E6CDB1', color: '#2F1A0F' }}
                  >
                    Keep Order
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Return Button */}
        {canReturn && (
          <div className="border-t pt-4" style={{ borderColor: '#D7B790' }}>
            {existingReturn ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-800 mb-1">
                  Return Request Already Submitted
                </p>
                <p className="text-xs text-yellow-700">
                  Status: <span className="font-semibold">{existingReturn.status}</span>
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  Please wait for the existing return request to be resolved before submitting a new one.
                </p>
              </div>
            ) : (
              <button
                onClick={handleRequestReturn}
                disabled={checkingReturn}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#816047' }}
              >
                {checkingReturn ? 'Checking...' : 'Request Return'}
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>

    <ReturnRequestModal
      isOpen={showReturnModal}
      onClose={() => setShowReturnModal(false)}
      order={order}
      onSuccess={handleReturnSuccess}
    />
    </>
  );
};

export default OrderDetailModal;
