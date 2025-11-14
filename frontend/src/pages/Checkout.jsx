import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, userAPI, paymentAPI } from '../services/api';
import Button from '../components/Button';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (isAuthenticated) {
        try {
          const response = await userAPI.getAddresses();
          setSavedAddresses(response.data);

          // Auto-select default address if available
          const defaultAddress = response.data.find(addr => addr.isDefault);
          if (defaultAddress && !useNewAddress) {
            setSelectedAddressId(defaultAddress._id);
            fillFormWithAddress(defaultAddress);
          }
        } catch (error) {
          console.error('Failed to fetch addresses:', error);
        }
      }
    };
    fetchAddresses();
  }, [isAuthenticated, useNewAddress]);

  // Fill form with selected address
  const fillFormWithAddress = (address) => {
    setFormData({
      ...formData,
      name: address.name,
      phone: address.phone,
      address: `${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}`,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
  };

  // Handle address selection
  const handleAddressSelect = (address) => {
    setSelectedAddressId(address._id);
    setUseNewAddress(false);
    fillFormWithAddress(address);
  };

  // Handle new address
  const handleUseNewAddress = () => {
    setUseNewAddress(true);
    setSelectedAddressId(null);
    setFormData({
      ...formData,
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        items: cart.items
          .filter(item => item.product)
          .map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price || item.product.price,
            image: item.product.images?.[0]?.url || '',
            selectedVariants: item.selectedVariants || {},
          })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: getCartTotal(),
      };

      if (formData.paymentMethod === 'online') {
        // Handle Razorpay payment
        await handleRazorpayPayment(orderData);
      } else {
        // Handle COD
        const response = await orderAPI.create(orderData);
        const orderId = response.data._id;
        await clearCart();
        navigate(`/order-confirmation/${orderId}`);
      }
    } catch (err) {
      console.error('Order failed:', err);
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async (orderData) => {
    try {
      // Create order first
      const order = await orderAPI.create(orderData);
      const orderId = order.data._id;
      const totalAmount = orderData.totalAmount;

      // Get Razorpay key
      const keyResponse = await paymentAPI.getRazorpayKey();
      const razorpayKey = keyResponse.data.key;

      // Create Razorpay order
      const razorpayOrderResponse = await paymentAPI.createRazorpayOrder(
        totalAmount,
        'INR',
        `order_${orderId}`
      );
      const razorpayOrder = razorpayOrderResponse.data;

      // Initialize Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Samrat Agencies',
        description: 'Furniture Purchase',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await paymentAPI.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId,
            });

            if (verifyResponse.data.success) {
              await clearCart();
              navigate(`/order-confirmation/${orderId}`);
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#895F42',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      throw error;
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafaf9' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1F2D38' }}>Your cart is empty</h2>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8" style={{ color: '#1F2D38' }}>Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-2" style={{ borderColor: '#BDD7EB' }}>
              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#1F2D38' }}>Select Delivery Address</h2>
                  <div className="space-y-3">
                    {savedAddresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => handleAddressSelect(address)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                          selectedAddressId === address._id ? 'border-[#895F42] bg-[#FDF8F5]' : 'border-[#BDD7EB] hover:border-[#895F42]'
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddressId === address._id}
                            onChange={() => handleAddressSelect(address)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold" style={{ color: '#1F2D38' }}>{address.name}</p>
                              {address.isDefault && (
                                <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: '#895F42', color: 'white' }}>
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm mt-1" style={{ color: '#94A1AB' }}>{address.phone}</p>
                            <p className="text-sm mt-1" style={{ color: '#94A1AB' }}>
                              {address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm" style={{ color: '#94A1AB' }}>
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleUseNewAddress}
                      className="w-full p-4 border-2 rounded-lg transition text-left"
                      style={{
                        borderColor: useNewAddress ? '#895F42' : '#BDD7EB',
                        backgroundColor: useNewAddress ? '#FDF8F5' : 'white',
                        color: '#1F2D38'
                      }}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={useNewAddress}
                          onChange={handleUseNewAddress}
                          className="mr-3"
                        />
                        <span className="font-semibold">+ Use a new address</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6" style={{ color: '#1F2D38' }}>
                {savedAddresses.length > 0 ? 'Shipping Details' : 'Shipping Information'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#1F2D38' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#BDD7EB' }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#1F2D38' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#BDD7EB' }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#1F2D38' }}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#BDD7EB' }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#1F2D38' }}>
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#BDD7EB' }}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#1F2D38' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#BDD7EB' }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#1F2D38' }}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#BDD7EB' }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#1F2D38' }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#BDD7EB' }}
                  />
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4" style={{ color: '#1F2D38' }}>Payment Method</h3>
                <div className="space-y-2 text-sm sm:text-base">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Cash on Delivery
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Online Payment
                  </label>
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-20 border-2" style={{ borderColor: '#BDD7EB' }}>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#1F2D38' }}>Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cart.items.map((item) => {
                  if (!item.product) return null;

                  return (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span style={{ color: '#94A1AB' }}>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-semibold" style={{ color: '#1F2D38' }}>
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                  );
                })}
              </div>

              <div className="pt-4 space-y-2" style={{ borderTop: '2px solid #BDD7EB' }}>
                <div className="flex justify-between" style={{ color: '#94A1AB' }}>
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ color: '#94A1AB' }}>
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="pt-2 flex justify-between text-lg font-bold" style={{ borderTop: '2px solid #BDD7EB' }}>
                  <span style={{ color: '#1F2D38' }}>Total</span>
                  <span style={{ color: '#895F42' }}>₹{getCartTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
