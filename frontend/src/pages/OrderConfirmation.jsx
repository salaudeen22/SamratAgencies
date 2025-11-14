import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI, recommendationAPI } from '../services/api';
import Button from '../components/Button';
import ProductRecommendations from '../components/ProductRecommendations';
import toast from 'react-hot-toast';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

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

  // Fetch recommendations based on ordered products
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!order || !order.items || order.items.length === 0) return;

      try {
        setLoadingRecommendations(true);
        const productIds = order.items.map(item => item.product);
        const response = await recommendationAPI.getCartBasedRecommendations(productIds, 6);
        setRecommendations(response.data || []);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [order]);

  // Calculate estimated delivery date (5-7 days from order date)
  const getEstimatedDeliveryDate = () => {
    if (!order) return null;

    const orderDate = new Date(order.createdAt);
    const minDate = new Date(orderDate);
    const maxDate = new Date(orderDate);

    minDate.setDate(orderDate.getDate() + 5);
    maxDate.setDate(orderDate.getDate() + 7);

    const options = { day: 'numeric', month: 'short' };
    return {
      min: minDate.toLocaleDateString('en-IN', options),
      max: maxDate.toLocaleDateString('en-IN', options)
    };
  };

  // Print order
  const handlePrint = () => {
    window.print();
  };

  // Share order via WhatsApp
  const handleShareWhatsApp = () => {
    const orderNumber = order._id.slice(-8).toUpperCase();
    const message = `My order #${orderNumber} has been placed successfully! Track it here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Copy order link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Order link copied to clipboard!');
  };

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
    <div className="min-h-screen py-4 sm:py-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="bg-green-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-green-200">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-green-800">Order Placed Successfully!</h1>
          <p className="text-center text-sm sm:text-base text-green-700 mb-4">
            Thank you for your order. We've sent a confirmation email with your order details.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition"
              style={{ backgroundColor: 'white', color: '#895F42', border: '1px solid #895F42' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F3'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Order
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition"
              style={{ backgroundColor: '#25D366', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1EBE55'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#25D366'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share on WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition"
              style={{ backgroundColor: 'white', color: '#895F42', border: '1px solid #895F42' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF8F3'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6" style={{ border: '2px solid #BDD7EB' }}>
          <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: '#1F2D38' }}>Order Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: '#1F2D38' }}>Items Ordered</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex-shrink-0" style={{ backgroundColor: '#E0EAF0' }}>
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
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base" style={{ color: '#1F2D38' }}>{item.name}</h4>

                    {/* Display Variants if available */}
                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
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

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>
                        Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: '#895F42' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Tracking Timeline */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6" style={{ border: '2px solid #BDD7EB' }}>
          <h2 className="text-lg sm:text-xl font-semibold mb-6" style={{ color: '#1F2D38' }}>Order Timeline</h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#BDD7EB' }}></div>

            {/* Order Placed */}
            <div className="relative flex gap-4 mb-8">
              <div className="w-8 h-8 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: '#22c55e' }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 pb-8">
                <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#1F2D38' }}>Order Placed</h3>
                <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>
                  {new Date(order.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-xs mt-1" style={{ color: '#22c55e' }}>Completed</p>
              </div>
            </div>

            {/* Processing */}
            <div className="relative flex gap-4 mb-8">
              <div className="w-8 h-8 rounded-full flex items-center justify-center z-10" style={{
                backgroundColor: order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? '#22c55e' : '#E0EAF0',
                color: order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'white' : '#94A1AB'
              }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 pb-8">
                <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#1F2D38' }}>Processing</h3>
                <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>We're preparing your order</p>
                <p className="text-xs mt-1" style={{ color: order.status === 'Processing' ? '#895F42' : order.status === 'Shipped' || order.status === 'Delivered' ? '#22c55e' : '#94A1AB' }}>
                  {order.status === 'Processing' ? 'In Progress' : order.status === 'Shipped' || order.status === 'Delivered' ? 'Completed' : 'Pending'}
                </p>
              </div>
            </div>

            {/* Shipped */}
            <div className="relative flex gap-4 mb-8">
              <div className="w-8 h-8 rounded-full flex items-center justify-center z-10" style={{
                backgroundColor: order.status === 'Shipped' || order.status === 'Delivered' ? '#22c55e' : '#E0EAF0',
                color: order.status === 'Shipped' || order.status === 'Delivered' ? 'white' : '#94A1AB'
              }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="flex-1 pb-8">
                <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#1F2D38' }}>Shipped</h3>
                <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>Your order is on the way</p>
                <p className="text-xs mt-1" style={{ color: order.status === 'Shipped' ? '#895F42' : order.status === 'Delivered' ? '#22c55e' : '#94A1AB' }}>
                  {order.status === 'Shipped' ? 'In Transit' : order.status === 'Delivered' ? 'Completed' : 'Pending'}
                </p>
              </div>
            </div>

            {/* Delivered */}
            <div className="relative flex gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center z-10" style={{
                backgroundColor: order.status === 'Delivered' ? '#22c55e' : '#E0EAF0',
                color: order.status === 'Delivered' ? 'white' : '#94A1AB'
              }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#1F2D38' }}>Delivered</h3>
                <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>
                  {getEstimatedDeliveryDate() && `Expected: ${getEstimatedDeliveryDate().min} - ${getEstimatedDeliveryDate().max}`}
                </p>
                <p className="text-xs mt-1" style={{ color: order.status === 'Delivered' ? '#22c55e' : '#94A1AB' }}>
                  {order.status === 'Delivered' ? 'Completed' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ border: '2px solid #BDD7EB' }}>
            <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: '#1F2D38' }}>Shipping Address</h3>
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
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ border: '2px solid #BDD7EB' }}>
            <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: '#1F2D38' }}>Order Summary</h3>
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
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: '#895F42' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold mb-1 text-sm sm:text-base" style={{ color: '#1F2D38' }}>Cash on Delivery</h4>
                <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>
                  Please keep ₹{order.totalPrice.toLocaleString()} ready in cash. Our delivery partner will collect the payment at the time of delivery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help & Support Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 mb-6 border-2" style={{ borderColor: '#BDD7EB' }}>
          <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: '#1F2D38' }}>Need Help?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: 'white' }}>
                <svg className="w-5 h-5" style={{ color: '#895F42' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1F2D38' }}>Call Us</p>
                <p className="text-xs" style={{ color: '#94A1AB' }}>+91 1234567890</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: 'white' }}>
                <svg className="w-5 h-5" style={{ color: '#895F42' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1F2D38' }}>Email Us</p>
                <p className="text-xs" style={{ color: '#94A1AB' }}>support@samratagencies.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: '#25D366' }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1F2D38' }}>WhatsApp</p>
                <p className="text-xs" style={{ color: '#94A1AB' }}>Chat with us</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-6">
            <ProductRecommendations
              title="You May Also Like"
              products={recommendations}
              loading={loadingRecommendations}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={() => navigate('/profile')}
            className="flex-1 w-full sm:w-auto"
            size="lg"
          >
            View Order Details
          </Button>
          <button
            onClick={() => navigate('/products')}
            className="flex-1 w-full sm:w-auto px-4 sm:px-6 py-3 rounded-lg font-medium transition text-sm sm:text-base"
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
