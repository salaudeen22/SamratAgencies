import { useState } from 'react';
import { createPortal } from 'react-dom';
import { HiX, HiUpload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { returnAPI, uploadAPI } from '../../services/api';

const ReturnRequestModal = ({ isOpen, onClose, order, onSuccess }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const reasons = [
    { value: 'defective', label: 'Defective Product' },
    { value: 'wrong_item', label: 'Wrong Item Received' },
    { value: 'not_as_described', label: 'Not as Described' },
    { value: 'damaged', label: 'Damaged During Shipping' },
    { value: 'changed_mind', label: 'Changed My Mind' },
    { value: 'size_issue', label: 'Size/Fit Issue' },
    { value: 'quality_issue', label: 'Quality Not Satisfactory' },
    { value: 'other', label: 'Other' }
  ];

  const toggleItemSelection = (itemIndex) => {
    setSelectedItems(prev =>
      prev.includes(itemIndex)
        ? prev.filter(i => i !== itemIndex)
        : [...prev, itemIndex]
    );
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadAPI.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map(res => res.data.file?.url || res.data.url);
      setImages(prev => [...prev, ...imageUrls]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to return');
      return;
    }

    if (!returnReason) {
      toast.error('Please select a return reason');
      return;
    }

    if (!returnDescription.trim()) {
      toast.error('Please provide a detailed description');
      return;
    }

    setSubmitting(true);
    try {
      const returnItems = selectedItems.map(index => ({
        product: order.items[index].product._id || order.items[index].product,
        name: order.items[index].name,
        quantity: order.items[index].quantity,
        price: order.items[index].price,
        image: order.items[index].image,
        reason: returnReason
      }));

      const returnData = {
        orderId: order._id,
        items: returnItems,
        returnReason,
        returnDescription,
        images,
        pickupAddress: order.shippingAddress
      };

      await returnAPI.create(returnData);
      toast.success('Return request submitted successfully');
      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedItems([]);
    setReturnReason('');
    setReturnDescription('');
    setImages([]);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E6CDB1' }}>
            <h3 className="text-xl font-bold" style={{ color: '#2F1A0F' }}>Request Return</h3>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <HiX className="w-5 h-5" style={{ color: 'rgba(129, 96, 71, 0.6)' }} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            {/* Select Items */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3" style={{ color: '#2F1A0F' }}>
                Select Items to Return <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => toggleItemSelection(index)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedItems.includes(index)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(index)}
                      onChange={() => {}}
                      className="w-4 h-4"
                    />
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: '#2F1A0F' }}>{item.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Reason */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>
                Reason for Return <span className="text-red-500">*</span>
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a reason</option>
                {reasons.map(reason => (
                  <option key={reason.value} value={reason.value}>{reason.label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={returnDescription}
                onChange={(e) => setReturnDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Please provide details about why you want to return this item..."
                required
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>
                Upload Images (Optional, Max 5)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading || images.length >= 5}
                />
                <label
                  htmlFor="image-upload"
                  className={`flex flex-col items-center justify-center cursor-pointer ${
                    uploading || images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <HiUpload className="w-8 h-8 mb-2" style={{ color: 'rgba(129, 96, 71, 0.6)' }} />
                  <p className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    {uploading ? 'Uploading...' : 'Click to upload images'}
                  </p>
                </label>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Return ${index + 1}`}
                          className="w-full h-24 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12"%3EImage%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                        >
                          <HiX className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pickup Address Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>Pickup Address</p>
              <p className="text-sm" style={{ color: '#64748b' }}>
                Items will be picked up from your delivery address
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#E6CDB1' }}>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                style={{ color: '#2F1A0F' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#816047' }}
              >
                {submitting ? 'Submitting...' : 'Submit Return Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReturnRequestModal;
