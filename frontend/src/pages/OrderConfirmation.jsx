import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Button from '../components/Button';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderAPI.getById(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafaf9' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-4" style={{ borderColor: '#895F42' }}></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafaf9' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1F2D38' }}>Order not found</h2>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="bg-green-50 rounded-lg p-6 mb-8 border-2 border-green-200">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-green-800">Order Placed Successfully!</h1>
          <p className="text-center text-green-700">
            Thank you for your order. We've sent a confirmation email with your order details.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ border: '2px solid #BDD7EB' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#1F2D38' }}>Order Details</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm" style={{ color: '#94A1AB' }}>Order ID</p>
              <p className="font-semibold" style={{ color: '#1F2D38' }}>#{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#94A1AB' }}>Order Date</p>
              <p className="font-semibold" style={{ color: '#1F2D38' }}>
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#94A1AB' }}>Payment Method</p>
              <p className="font-semibold capitalize" style={{ color: '#1F2D38' }}>
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#94A1AB' }}>Order Status</p>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold" style={{
                backgroundColor: order.status === 'Pending' ? '#FFF8F3' : '#E0F2E9',
                color: order.status === 'Pending' ? '#895F42' : '#10B981'
              }}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Items Ordered */}
          <div className="border-t-2 pt-4" style={{ borderColor: '#BDD7EB' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#1F2D38' }}>Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                  <div className="w-20 h-20 rounded-lg flex-shrink-0" style={{ backgroundColor: '#E0EAF0' }}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: '#94A1AB' }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold" style={{ color: '#1F2D38' }}>{item.name}</h4>

                    {/* Display Variants if available */}
                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(item.selectedVariants).map(([key, value]) => (
                          <span
                            key={key}
                            className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: '#E0EAF0', color: '#1F2D38' }}
                          >
                            <span className="capitalize font-medium">{key}:</span> {value}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm" style={{ color: '#94A1AB' }}>
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-semibold" style={{ color: '#895F42' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6" style={{ border: '2px solid #BDD7EB' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#1F2D38' }}>Shipping Address</h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold" style={{ color: '#1F2D38' }}>{order.shippingAddress.name}</p>
              <p style={{ color: '#94A1AB' }}>{order.shippingAddress.phone}</p>
              <p style={{ color: '#94A1AB' }}>{order.shippingAddress.address}</p>
              <p style={{ color: '#94A1AB' }}>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p style={{ color: '#94A1AB' }}>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6" style={{ border: '2px solid #BDD7EB' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#1F2D38' }}>Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm" style={{ color: '#94A1AB' }}>
                <span>Subtotal</span>
                <span>₹{order.itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: '#94A1AB' }}>
                <span>Tax</span>
                <span>₹{order.taxPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: '#94A1AB' }}>
                <span>Shipping</span>
                <span className="text-green-600 font-medium">
                  {order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice.toLocaleString()}`}
                </span>
              </div>
              <div className="pt-3 flex justify-between text-lg font-bold" style={{ borderTop: '2px solid #BDD7EB' }}>
                <span style={{ color: '#1F2D38' }}>Total</span>
                <span style={{ color: '#895F42' }}>₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Estimate */}
        {order.paymentMethod === 'cod' && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 flex-shrink-0" style={{ color: '#895F42' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: '#1F2D38' }}>Cash on Delivery</h4>
                <p className="text-sm" style={{ color: '#94A1AB' }}>
                  Please keep ₹{order.totalPrice.toLocaleString()} ready in cash. Our delivery partner will collect the payment at the time of delivery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate('/profile')}
            className="flex-1"
            size="lg"
          >
            View Order Details
          </Button>
          <button
            onClick={() => navigate('/products')}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition"
            style={{
              backgroundColor: 'white',
              color: '#895F42',
              border: '2px solid #895F42'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFF8F3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
