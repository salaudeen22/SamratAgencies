import { HiPhone } from 'react-icons/hi2';
import Modal from '../Modal';

const OrderDetailModal = ({ isOpen, onClose, order, getStatusColor }) => {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Order Details">
      <div className="space-y-6">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 pb-4 border-b" style={{ borderColor: '#BDD7EB' }}>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: '#94A1AB' }}>Order ID</p>
            <p className="text-sm font-mono break-all" style={{ color: '#1F2D38' }}>{order._id}</p>
            <p className="text-xs mt-2" style={{ color: '#94A1AB' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: '#94A1AB' }}>Status</p>
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold inline-block ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F2D38' }}>Order Items</h3>
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
                    <p className="font-semibold text-sm mb-1" style={{ color: '#1F2D38' }}>
                      {itemName}
                    </p>
                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <div className="text-xs mb-1" style={{ color: '#94A1AB' }}>
                        {Object.entries(item.selectedVariants).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs" style={{ color: '#94A1AB' }}>Quantity: {item.quantity}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: '#895F42' }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t pt-4" style={{ borderColor: '#BDD7EB' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#1F2D38' }}>Price Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: '#94A1AB' }}>Subtotal</span>
              <span style={{ color: '#1F2D38' }}>₹{(order.itemsPrice || 0).toLocaleString()}</span>
            </div>
            {order.taxPrice > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: '#94A1AB' }}>Tax</span>
                <span style={{ color: '#1F2D38' }}>₹{order.taxPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span style={{ color: '#94A1AB' }}>Shipping</span>
              <span className="text-green-600 font-medium">
                {order.shippingPrice > 0 ? `₹${order.shippingPrice.toLocaleString()}` : 'FREE'}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t" style={{ borderColor: '#BDD7EB' }}>
              <span style={{ color: '#1F2D38' }}>Total Amount</span>
              <span style={{ color: '#895F42' }}>₹{(order.totalPrice || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="border-t pt-4" style={{ borderColor: '#BDD7EB' }}>
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#1F2D38' }}>Shipping Address</h3>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#fafaf9' }}>
              <p className="font-semibold mb-1" style={{ color: '#1F2D38' }}>{order.shippingAddress.name}</p>
              <p className="text-sm mb-1" style={{ color: '#1F2D38' }}>{order.shippingAddress.address}</p>
              <p className="text-sm mb-1" style={{ color: '#1F2D38' }}>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-sm flex items-center gap-1 mt-2" style={{ color: '#94A1AB' }}>
                <HiPhone className="w-4 h-4" />
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>
        )}

        {/* Payment Info */}
        <div className="border-t pt-4" style={{ borderColor: '#BDD7EB' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#1F2D38' }}>Payment Information</h3>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#fafaf9' }}>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: '#94A1AB' }}>Payment Method</span>
              <span className="font-medium" style={{ color: '#1F2D38' }}>
                {order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span style={{ color: '#94A1AB' }}>Payment Status</span>
              <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>
            {order.isPaid && order.paidAt && (
              <div className="flex justify-between items-center text-sm mt-2">
                <span style={{ color: '#94A1AB' }}>Paid On</span>
                <span className="font-medium" style={{ color: '#1F2D38' }}>
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
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
