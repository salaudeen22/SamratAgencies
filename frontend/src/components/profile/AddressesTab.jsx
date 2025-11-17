import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiPlus } from 'react-icons/hi2';
import { userAPI } from '../../services/api';
import Modal from '../Modal';
import Button from '../Button';
import AddressCard from './AddressCard';

const AddressesTab = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
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
    fetchAddresses();
  }, []);

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

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        const response = await userAPI.updateAddress(editingAddress._id, addressData);
        setAddresses(response.data);
        toast.success('Address updated successfully!');
      } else {
        const response = await userAPI.addAddress(addressData);
        setAddresses(response.data);
        toast.success('Address added successfully!');
      }
      resetAddressForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
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
    try {
      const response = await userAPI.deleteAddress(addressId);
      setAddresses(response.data);
      toast.success('Address deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete address');
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#2F1A0F' }}>My Addresses</h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Manage your delivery addresses</p>
        </div>
        <button
          onClick={() => setShowAddressForm(true)}
          className="px-5 py-2.5 rounded-xl text-white transition-all text-sm font-medium hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
          style={{ backgroundColor: '#816047' }}
        >
          <HiPlus className="w-4 h-4" />
          Add Address
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
              <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
                Full Name*
              </label>
              <input
                type="text"
                value={addressData.name}
                onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#D7B790' }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
                Phone Number*
              </label>
              <input
                type="tel"
                value={addressData.phone}
                onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#D7B790' }}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
              Address Line 1*
            </label>
            <input
              type="text"
              value={addressData.addressLine1}
              onChange={(e) => setAddressData({ ...addressData, addressLine1: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#D7B790' }}
              placeholder="House/Flat No., Building Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
              Address Line 2
            </label>
            <input
              type="text"
              value={addressData.addressLine2}
              onChange={(e) => setAddressData({ ...addressData, addressLine2: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#D7B790' }}
              placeholder="Street, Area, Landmark"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
                City*
              </label>
              <input
                type="text"
                value={addressData.city}
                onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#D7B790' }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
                State*
              </label>
              <input
                type="text"
                value={addressData.state}
                onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#D7B790' }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
                Pincode*
              </label>
              <input
                type="text"
                value={addressData.pincode}
                onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#D7B790' }}
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
            <label htmlFor="isDefault" className="text-sm" style={{ color: '#2F1A0F' }}>
              Set as default address
            </label>
          </div>
          <div className="flex gap-4 mt-6">
            <Button type="submit">{editingAddress ? 'Update Address' : 'Save Address'}</Button>
            <button
              type="button"
              onClick={resetAddressForm}
              className="px-4 py-2 border rounded-md"
              style={{ borderColor: '#D7B790', color: '#2F1A0F' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 mx-auto" style={{ borderColor: '#816047' }}></div>
          <p className="mt-4 text-sm sm:text-base" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Loading addresses...</p>
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-base sm:text-lg mb-4" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>No addresses saved yet</p>
          <button
            onClick={() => setShowAddressForm(true)}
            className="px-4 py-2 rounded-md text-white text-sm sm:text-base"
            style={{ backgroundColor: '#816047' }}
          >
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressesTab;
