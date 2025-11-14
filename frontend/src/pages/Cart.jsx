import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { couponAPI, recommendationAPI } from '../services/api';
import Button from '../components/Button';
import ProductRecommendations from '../components/ProductRecommendations';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [freeShipping, setFreeShipping] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Recommendations state
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Fetch cart-based recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!cart.items || cart.items.length === 0) {
        setRecommendations([]);
        return;
      }

      try {
        setLoadingRecommendations(true);
        const cartItemIds = cart.items.map(item => item.product._id);
        const response = await recommendationAPI.getCartBasedRecommendations(cartItemIds, 6);
        setRecommendations(response.data || []);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [cart.items]);

  const handleQuantityChange = async (productId, newQuantity, selectedVariants) => {
    await updateQuantity(productId, newQuantity, selectedVariants);
  };

  const handleRemove = async (productId, selectedVariants) => {
    await removeFromCart(productId, selectedVariants);
    toast.success('Item removed from cart');

    // Revalidate coupon if applied
    if (appliedCoupon) {
      handleApplyCoupon();
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsValidating(true);
    try {
      const cartTotal = getCartTotal();
      const cartItems = cart.items?.map(item => ({
        product: item.product._id,
        category: item.product.category?._id || item.product.category,
        price: item.price || item.product.price,
        quantity: item.quantity
      })) || [];

      const response = await couponAPI.validateCoupon(
        couponCode,
        user?._id,
        cartTotal,
        cartItems
      );

      setAppliedCoupon(response.data.coupon);
      setCouponDiscount(response.data.discount);
      setFreeShipping(response.data.freeShipping || false);
      toast.success(response.data.message || 'Coupon applied successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setFreeShipping(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setFreeShipping(false);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const getFinalTotal = () => {
    return Math.max(0, getCartTotal() - couponDiscount);
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen py-8 sm:py-12 md:py-16" style={{ backgroundColor: '#fafaf9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mb-4 sm:mb-6" style={{ color: '#BDD7EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: '#1F2D38' }}>Your cart is empty</h2>
            <p className="mb-6 sm:mb-8 text-sm sm:text-base" style={{ color: '#94A1AB' }}>Start shopping and add items to your cart</p>
            <Link to="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8" style={{ color: '#1F2D38' }}>Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => {
              if (!item.product) return null;

              // Create unique key including variants
              const itemKey = `${item.product._id}-${JSON.stringify(item.selectedVariants || {})}-${index}`;

              // Get the actual price (with variant modifiers)
              const itemPrice = item.price || item.product.price || 0;

              return (
              <div key={itemKey} className="bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ border: '2px solid #BDD7EB' }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
                  {/* Product Image */}
                  <div className="rounded-lg w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0" style={{ backgroundColor: '#E0EAF0' }}>
                    {item.product.images && item.product.images.length > 0 && item.product.images[0].url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: '#94A1AB' }}>
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info & Controls */}
                  <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 w-full">
                    <div className="flex-1">
                      <Link
                        to={`/products/${item.product._id}`}
                        className="text-base sm:text-lg font-semibold transition"
                        style={{ color: '#1F2D38' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#1F2D38'}
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs sm:text-sm mt-1" style={{ color: '#94A1AB' }}>
                        {item.product.category}
                      </p>

                      {/* Display Selected Variants */}
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

                      <p className="font-bold mt-2 text-base sm:text-lg" style={{ color: '#895F42' }}>
                        ₹{itemPrice.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1, item.selectedVariants)}
                          className="px-2 sm:px-3 py-1 rounded-md transition text-sm sm:text-base"
                          style={{ backgroundColor: '#E0EAF0', color: '#1F2D38' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BDD7EB'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
                        >
                          -
                        </button>
                        <span className="text-base sm:text-lg font-semibold min-w-[30px] text-center" style={{ color: '#1F2D38' }}>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1, item.selectedVariants)}
                          className="px-2 sm:px-3 py-1 rounded-md transition text-sm sm:text-base"
                          style={{ backgroundColor: '#E0EAF0', color: '#1F2D38' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BDD7EB'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal & Remove */}
                      <div className="text-right">
                        <p className="text-base sm:text-lg font-bold mb-1 sm:mb-2" style={{ color: '#1F2D38' }}>
                          ₹{(itemPrice * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => handleRemove(item.product._id, item.selectedVariants)}
                          className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-20" style={{ border: '2px solid #BDD7EB' }}>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#1F2D38' }}>Order Summary</h2>

              {/* Coupon Code Section */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                  Have a coupon code?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-md" style={{ backgroundColor: '#E0EAF0' }}>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" style={{ color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold text-sm" style={{ color: '#1F2D38' }}>
                        {appliedCoupon.code}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border-2 rounded-md focus:outline-none text-sm"
                      style={{ borderColor: '#BDD7EB' }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#895F42'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#BDD7EB'}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isValidating}
                      className="px-4 py-2 rounded-md font-medium text-sm transition disabled:opacity-50"
                      style={{ backgroundColor: '#895F42', color: 'white' }}
                      onMouseEnter={(e) => !isValidating && (e.currentTarget.style.backgroundColor = '#9F8065')}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#895F42'}
                    >
                      {isValidating ? 'Validating...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base" style={{ color: '#94A1AB' }}>
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm sm:text-base text-green-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base" style={{ color: '#94A1AB' }}>
                  <span>Shipping</span>
                  {freeShipping ? (
                    <span className="text-green-600 font-medium">Free (Coupon)</span>
                  ) : (
                    <span className="text-green-600 font-medium">Free</span>
                  )}
                </div>

                <div className="pt-2 sm:pt-3 flex justify-between text-base sm:text-lg font-bold" style={{ borderTop: '2px solid #BDD7EB' }}>
                  <span style={{ color: '#1F2D38' }}>Total</span>
                  <span style={{ color: '#895F42' }}>₹{getFinalTotal().toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout', {
                  state: {
                    appliedCoupon,
                    couponDiscount,
                    freeShipping
                  }
                })}
                className="w-full"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              <Link to="/products">
                <button className="w-full mt-3 sm:mt-4 font-medium transition text-sm sm:text-base" style={{ color: '#895F42' }} onMouseEnter={(e) => e.currentTarget.style.color = '#9F8065'} onMouseLeave={(e) => e.currentTarget.style.color = '#895F42'}>
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* You May Also Like - Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <ProductRecommendations
              title="You May Also Like"
              products={recommendations}
              loading={loadingRecommendations}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
