import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, userAPI, paymentAPI, deliveryAPI, settingsAPI } from '../services/api';
import Button from '../components/Button';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const [settings, setSettings] = useState(null);

  // Get coupon data from cart page
  const appliedCoupon = location.state?.appliedCoupon || null;
  const couponDiscount = location.state?.couponDiscount || 0;
  const freeShipping = location.state?.freeShipping || false;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: '',
    specialInstructions: '',
  });

  const [saveAddress, setSaveAddress] = useState(false);

  // Calculate delivery charge when pincode is entered
  const calculateDeliveryCharge = async (pincode) => {
    if (!pincode || pincode.length < 6) {
      setDeliveryCharge(0);
      setDeliveryInfo(null);
      return;
    }

    try {
      setCheckingDelivery(true);
      const response = await deliveryAPI.calculateDeliveryCharge(pincode, getCartTotal());

      if (response.data.available) {
        // If coupon provides free shipping, use that instead
        const finalDeliveryCharge = freeShipping ? 0 : response.data.deliveryCharge;
        setDeliveryCharge(finalDeliveryCharge);
        setDeliveryInfo(response.data);
      } else {
        setDeliveryCharge(0);
        setDeliveryInfo(null);
        toast.error('Delivery not available for this pincode');
      }
    } catch (error) {
      console.error('Failed to calculate delivery charge:', error);
      setDeliveryCharge(0);
      setDeliveryInfo(null);
    } finally {
      setCheckingDelivery(false);
    }
  };

  const getGSTAmount = () => {
    const subtotal = getCartTotal();
    return Math.round((subtotal * 0.18) * 100) / 100; // 18% GST
  };

  const getFinalTotal = () => {
    const subtotal = getCartTotal();
    const gst = getGSTAmount();
    return Math.max(0, subtotal - couponDiscount + gst + deliveryCharge);
  };

  // Calculate expected delivery date range
  const getDeliveryDateRange = () => {
    if (!deliveryInfo?.estimatedDays) return null;

    const today = new Date();
    const minDate = new Date(today);
    const maxDate = new Date(today);

    minDate.setDate(today.getDate() + deliveryInfo.estimatedDays.min);
    maxDate.setDate(today.getDate() + deliveryInfo.estimatedDays.max);

    const options = { month: 'short', day: 'numeric' };
    return {
      min: minDate.toLocaleDateString('en-IN', options),
      max: maxDate.toLocaleDateString('en-IN', options)
    };
  };

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.getSettings();
        setSettings(response.data);
        // Set default payment method based on settings
        if (response.data.codEnabled) {
          setFormData(prev => ({ ...prev, paymentMethod: 'cod' }));
        } else if (response.data.razorpayEnabled) {
          setFormData(prev => ({ ...prev, paymentMethod: 'online' }));
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Default to COD if settings fetch fails
        setFormData(prev => ({ ...prev, paymentMethod: 'cod' }));
      }
    };
    fetchSettings();
  }, []);

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
    // Calculate delivery charge for this address
    if (address.pincode) {
      calculateDeliveryCharge(address.pincode);
    }
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Calculate delivery charge when pincode is entered/changed
    if (name === 'pincode' && value.length === 6) {
      calculateDeliveryCharge(value);
    } else if (name === 'pincode' && value.length < 6) {
      setDeliveryCharge(0);
      setDeliveryInfo(null);
    }
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

      // Save address if checkbox is checked
      if (saveAddress && useNewAddress) {
        try {
          await userAPI.addAddress({
            name: formData.name,
            phone: formData.phone,
            addressLine1: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            isDefault: savedAddresses.length === 0, // Set as default if it's the first address
          });
        } catch (error) {
          console.error('Failed to save address:', error);
          // Continue with order even if address save fails
        }
      }

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
        totalAmount: getFinalTotal(),
        gstAmount: getGSTAmount(),
        couponCode: appliedCoupon?.code || null,
        discount: couponDiscount || 0,
        deliveryCharge: deliveryCharge || 0,
        specialInstructions: formData.specialInstructions || '',
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
          color: '#816047',
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
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#2F1A0F' }}>Your cart is empty</h2>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: '#2F1A0F' }}>Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-2xl">
              {/* Step 1: Cart */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold bg-green-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs mt-1 hidden sm:block" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Cart</span>
              </div>

              <div className="flex-1 h-1 bg-green-500 mx-2"></div>

              {/* Step 2: Checkout */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#816047' }}>
                  2
                </div>
                <span className="text-xs mt-1 font-medium hidden sm:block" style={{ color: '#816047' }}>Checkout</span>
              </div>

              <div className="flex-1 h-1 mx-2" style={{ backgroundColor: '#D7B790' }}></div>

              {/* Step 3: Confirmation */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: '#E6CDB1', color: 'rgba(129, 96, 71, 0.6)' }}>
                  3
                </div>
                <span className="text-xs mt-1 hidden sm:block" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Confirmation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-2" style={{ borderColor: '#D7B790' }}>
              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#2F1A0F' }}>Select Delivery Address</h2>
                  <div className="space-y-3">
                    {savedAddresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => handleAddressSelect(address)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                          selectedAddressId === address._id ? 'border-[#816047] bg-[#E6CDB1]' : 'border-[#D7B790] hover:border-[#816047]'
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
                              <p className="font-semibold" style={{ color: '#2F1A0F' }}>{address.name}</p>
                              {address.isDefault && (
                                <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: '#816047', color: 'white' }}>
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm mt-1" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>{address.phone}</p>
                            <p className="text-sm mt-1" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                              {address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
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
                        borderColor: useNewAddress ? '#816047' : '#D7B790',
                        backgroundColor: useNewAddress ? '#E6CDB1' : 'white',
                        color: '#2F1A0F'
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

              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6" style={{ color: '#2F1A0F' }}>
                {savedAddresses.length > 0 ? 'Shipping Details' : 'Shipping Information'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#2F1A0F' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D7B790' }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#2F1A0F' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D7B790' }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#2F1A0F' }}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D7B790' }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#2F1A0F' }}>
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D7B790' }}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#2F1A0F' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D7B790' }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#2F1A0F' }}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D7B790' }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#2F1A0F' }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    maxLength="6"
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D7B790' }}
                  />
                  {checkingDelivery && (
                    <p className="text-xs mt-1" style={{ color: '#816047' }}>
                      Checking delivery availability...
                    </p>
                  )}
                  {deliveryInfo && (
                    <p className="text-xs mt-1 text-green-600">
                      ✓ Delivery available in {deliveryInfo.estimatedDays?.min}-{deliveryInfo.estimatedDays?.max} days
                    </p>
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mt-4 sm:mt-6">
                <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#2F1A0F' }}>
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Any special delivery instructions..."
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#D7B790' }}
                ></textarea>
              </div>

              {/* Save Address Checkbox */}
              {useNewAddress && (
                <div className="mt-3">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="mr-2"
                    />
                    <span style={{ color: '#2F1A0F' }}>Save this address for future orders</span>
                  </label>
                </div>
              )}

              <div className="mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4" style={{ color: '#2F1A0F' }}>Payment Method</h3>
                <div className="space-y-3">
                  {/* COD Option - Only show if enabled */}
                  {settings?.codEnabled && (
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.paymentMethod === 'cod' ? 'border-[#816047] bg-[#E6CDB1]' : 'border-[#D7B790] hover:border-[#816047]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: '#E6CDB1' }}>
                          <svg className="w-6 h-6" style={{ color: '#816047' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-sm sm:text-base" style={{ color: '#2F1A0F' }}>Cash on Delivery</p>
                          <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Pay when you receive</p>
                        </div>
                      </div>
                    </label>
                  )}

                  {/* Online Payment Option - Only show if enabled */}
                  {settings?.razorpayEnabled && (
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.paymentMethod === 'online' ? 'border-[#816047] bg-[#E6CDB1]' : 'border-[#D7B790] hover:border-[#816047]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: '#E6CDB1' }}>
                          <svg className="w-6 h-6" style={{ color: '#816047' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-sm sm:text-base" style={{ color: '#2F1A0F' }}>Online Payment</p>
                          <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>UPI, Cards, Net Banking</p>
                        </div>
                      </div>
                    </label>
                  )}

                  {/* No payment methods available */}
                  {!settings?.codEnabled && !settings?.razorpayEnabled && (
                    <div className="p-4 border-2 rounded-lg" style={{ borderColor: '#D7B790', backgroundColor: '#FEF3C7' }}>
                      <p className="text-sm text-center" style={{ color: '#92400E' }}>
                        No payment methods are currently available. Please contact support.
                      </p>
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="mt-4 p-3 rounded-lg flex items-center justify-center gap-4 text-center" style={{ backgroundColor: '#F0F9FF' }}>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium text-green-700">100% Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" style={{ color: '#816047' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium" style={{ color: '#816047' }}>SSL Encrypted</span>
                  </div>
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
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-20 border-2" style={{ borderColor: '#D7B790' }}>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#2F1A0F' }}>Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cart.items.map((item, index) => {
                  if (!item.product) return null;
                  const itemPrice = item.price || item.product.price;

                  return (
                  <div key={`${item.product._id}-${index}`} className="flex gap-3 pb-3" style={{ borderBottom: '1px solid #E5E7EB' }}>
                    {/* Product Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: '#E6CDB1' }}>
                      {item.product.images && item.product.images.length > 0 && item.product.images[0].url ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-medium line-clamp-1" style={{ color: '#2F1A0F' }}>
                          {item.product.name}
                        </p>
                        <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: '#816047' }}>
                        ₹{(itemPrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  );
                })}
              </div>

              <div className="pt-4 space-y-2" style={{ borderTop: '2px solid #D7B790' }}>
                <div className="flex justify-between" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>

                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-medium">Coupon ({appliedCoupon.code})</span>
                    </div>
                    <span className="text-green-600 font-medium">-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                  <span>GST (18%)</span>
                  <span style={{ color: '#2F1A0F' }}>₹{getGSTAmount().toLocaleString()}</span>
                </div>

                <div className="flex justify-between" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                  <span>Delivery Charge</span>
                  {deliveryCharge === 0 ? (
                    <span className="text-green-600 font-medium">
                      {freeShipping ? 'Free (Coupon)' : deliveryInfo?.isFree ? 'Free' : 'Free'}
                    </span>
                  ) : (
                    <span style={{ color: '#2F1A0F' }}>₹{deliveryCharge.toLocaleString()}</span>
                  )}
                </div>


                <div className="pt-2 flex justify-between text-lg font-bold" style={{ borderTop: '2px solid #D7B790' }}>
                  <span style={{ color: '#2F1A0F' }}>Total</span>
                  <span style={{ color: '#816047' }}>₹{getFinalTotal().toLocaleString()}</span>
                </div>

                {/* Expected Delivery Date */}
                {deliveryInfo && getDeliveryDateRange() && (
                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#ECFDF5' }}>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div className="text-xs">
                        <p className="font-semibold text-green-700">Expected Delivery</p>
                        <p className="text-green-600">
                          {getDeliveryDateRange().min} - {getDeliveryDateRange().max}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
