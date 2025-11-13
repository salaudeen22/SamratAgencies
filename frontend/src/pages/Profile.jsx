import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI, userAPI } from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [addressData, setAddressData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }

    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'addresses') {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, activeTab, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAddresses();
      setAddresses(response.data);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile(profileData);
      alert('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        const response = await userAPI.updateAddress(editingAddress._id, addressData);
        setAddresses(response.data);
        alert('Address updated successfully!');
      } else {
        const response = await userAPI.addAddress(addressData);
        setAddresses(response.data);
        alert('Address added successfully!');
      }
      resetAddressForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressData({
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.isDefault
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await userAPI.deleteAddress(addressId);
      setAddresses(response.data);
      alert('Address deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete address');
    }
  };

  const resetAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressData({
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      isDefault: false
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8" style={{ color: '#1F2D38' }}>My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-2" style={{ borderColor: '#BDD7EB' }}>
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{ backgroundColor: '#BDD7EB' }}>
                  <span className="text-xl sm:text-2xl font-bold" style={{ color: '#895F42' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold" style={{ color: '#1F2D38' }}>{user?.name}</h2>
                <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>{user?.email}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => { setActiveTab('profile'); setEditMode(false); }}
                  className={`w-full text-left px-3 sm:px-4 py-2 rounded-md transition text-sm sm:text-base ${
                    activeTab === 'profile'
                      ? 'text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  style={activeTab === 'profile' ? { backgroundColor: '#895F42' } : { color: '#1F2D38' }}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-3 sm:px-4 py-2 rounded-md transition text-sm sm:text-base ${
                    activeTab === 'addresses'
                      ? 'text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  style={activeTab === 'addresses' ? { backgroundColor: '#895F42' } : { color: '#1F2D38' }}
                >
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-3 sm:px-4 py-2 rounded-md transition text-sm sm:text-base ${
                    activeTab === 'orders'
                      ? 'text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  style={activeTab === 'orders' ? { backgroundColor: '#895F42' } : { color: '#1F2D38' }}
                >
                  My Orders
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 sm:px-4 py-2 rounded-md text-red-600 hover:bg-red-50 transition text-sm sm:text-base"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-2" style={{ borderColor: '#BDD7EB' }}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: '#1F2D38' }}>Profile Information</h2>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 rounded-md text-white transition text-sm sm:text-base"
                      style={{ backgroundColor: '#895F42' }}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                        style={{ borderColor: '#BDD7EB' }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                        style={{ borderColor: '#BDD7EB' }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                        style={{ borderColor: '#BDD7EB' }}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button type="submit">Save Changes</Button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 border rounded-md"
                        style={{ borderColor: '#BDD7EB', color: '#1F2D38' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: '#94A1AB' }}>
                        Full Name
                      </label>
                      <p className="text-base sm:text-lg" style={{ color: '#1F2D38' }}>{user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: '#94A1AB' }}>
                        Email
                      </label>
                      <p className="text-base sm:text-lg break-all" style={{ color: '#1F2D38' }}>{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: '#94A1AB' }}>
                        Phone Number
                      </label>
                      <p className="text-base sm:text-lg" style={{ color: '#1F2D38' }}>{user?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: '#94A1AB' }}>
                        Member Since
                      </label>
                      <p className="text-base sm:text-lg" style={{ color: '#1F2D38' }}>
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-2" style={{ borderColor: '#BDD7EB' }}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: '#1F2D38' }}>My Addresses</h2>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="px-4 py-2 rounded-md text-white transition text-sm sm:text-base"
                    style={{ backgroundColor: '#895F42' }}
                  >
                    Add New Address
                  </button>
                </div>

                {/* Address Modal */}
                <Modal
                  isOpen={showAddressForm}
                  onClose={resetAddressForm}
                  title={editingAddress ? 'Edit Address' : 'Add New Address'}
                >
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                            Full Name*
                          </label>
                          <input
                            type="text"
                            value={addressData.name}
                            onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                            style={{ borderColor: '#BDD7EB' }}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                            Phone Number*
                          </label>
                          <input
                            type="tel"
                            value={addressData.phone}
                            onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                            style={{ borderColor: '#BDD7EB' }}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                          Address Line 1*
                        </label>
                        <input
                          type="text"
                          value={addressData.addressLine1}
                          onChange={(e) => setAddressData({ ...addressData, addressLine1: e.target.value })}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                          style={{ borderColor: '#BDD7EB' }}
                          placeholder="House/Flat No., Building Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          value={addressData.addressLine2}
                          onChange={(e) => setAddressData({ ...addressData, addressLine2: e.target.value })}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                          style={{ borderColor: '#BDD7EB' }}
                          placeholder="Street, Area, Landmark"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                            City*
                          </label>
                          <input
                            type="text"
                            value={addressData.city}
                            onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                            style={{ borderColor: '#BDD7EB' }}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                            State*
                          </label>
                          <input
                            type="text"
                            value={addressData.state}
                            onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                            style={{ borderColor: '#BDD7EB' }}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                            Pincode*
                          </label>
                          <input
                            type="text"
                            value={addressData.pincode}
                            onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                            style={{ borderColor: '#BDD7EB' }}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={addressData.isDefault}
                          onChange={(e) => setAddressData({ ...addressData, isDefault: e.target.checked })}
                          className="rounded"
                        />
                        <label htmlFor="isDefault" className="text-sm" style={{ color: '#1F2D38' }}>
                          Set as default address
                        </label>
                      </div>
                    <div className="flex gap-4 mt-6">
                      <Button type="submit">{editingAddress ? 'Update Address' : 'Save Address'}</Button>
                      <button
                        type="button"
                        onClick={resetAddressForm}
                        className="px-4 py-2 border rounded-md"
                        style={{ borderColor: '#BDD7EB', color: '#1F2D38' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Modal>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 mx-auto" style={{ borderColor: '#895F42' }}></div>
                    <p className="mt-4 text-sm sm:text-base" style={{ color: '#94A1AB' }}>Loading addresses...</p>
                  </div>
                ) : addresses.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {addresses.map((address) => (
                      <div key={address._id} className="border rounded-lg p-3 sm:p-4 relative" style={{ borderColor: '#BDD7EB' }}>
                        {address.isDefault && (
                          <span className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2 py-1 rounded text-xs font-semibold text-white" style={{ backgroundColor: '#895F42' }}>
                            Default
                          </span>
                        )}
                        <div className="mb-2 pr-16 sm:pr-20">
                          <p className="font-semibold text-sm sm:text-base" style={{ color: '#1F2D38' }}>{address.name}</p>
                          <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>{address.phone}</p>
                        </div>
                        <p className="text-xs sm:text-sm" style={{ color: '#1F2D38' }}>
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-xs sm:text-sm" style={{ color: '#1F2D38' }}>
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>{address.country}</p>
                        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-xs sm:text-sm px-3 py-1.5 sm:py-1 border rounded-md transition hover:bg-gray-50"
                            style={{ borderColor: '#BDD7EB', color: '#895F42' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="text-xs sm:text-sm px-3 py-1.5 sm:py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-base sm:text-lg mb-4" style={{ color: '#94A1AB' }}>No addresses saved yet</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="px-4 py-2 rounded-md text-white text-sm sm:text-base"
                      style={{ backgroundColor: '#895F42' }}
                    >
                      Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-2" style={{ borderColor: '#BDD7EB' }}>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6" style={{ color: '#1F2D38' }}>Order History</h2>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 mx-auto" style={{ borderColor: '#895F42' }}></div>
                    <p className="mt-4 text-sm sm:text-base" style={{ color: '#94A1AB' }}>Loading orders...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-3 sm:p-4" style={{ borderColor: '#BDD7EB' }}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2 sm:gap-0">
                          <div className="flex-1">
                            <p className="text-xs sm:text-sm break-all" style={{ color: '#94A1AB' }}>
                              Order ID: {order._id}
                            </p>
                            <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>
                              Date: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold self-start ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-3 sm:mb-4">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between text-xs sm:text-sm gap-2">
                              <span className="flex-1" style={{ color: '#1F2D38' }}>
                                {item.product?.name || 'Product'} x {item.quantity}
                              </span>
                              <span className="font-semibold whitespace-nowrap" style={{ color: '#1F2D38' }}>
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-2 sm:pt-3 flex justify-between items-center" style={{ borderColor: '#BDD7EB' }}>
                          <span className="font-semibold text-sm sm:text-base" style={{ color: '#1F2D38' }}>Total</span>
                          <span className="text-base sm:text-lg font-bold" style={{ color: '#895F42' }}>
                            ₹{order.totalAmount?.toLocaleString()}
                          </span>
                        </div>

                        {order.shippingAddress && (
                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t text-xs sm:text-sm" style={{ borderColor: '#BDD7EB', color: '#94A1AB' }}>
                            <p className="font-semibold mb-1 text-sm sm:text-base" style={{ color: '#1F2D38' }}>Shipping Address:</p>
                            <p>{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                              {order.shippingAddress.pincode}
                            </p>
                            <p>Phone: {order.shippingAddress.phone}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-base sm:text-lg mb-4" style={{ color: '#94A1AB' }}>No orders yet</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="font-semibold transition text-sm sm:text-base"
                      style={{ color: '#895F42' }}
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
