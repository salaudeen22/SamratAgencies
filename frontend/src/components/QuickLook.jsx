import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const QuickLook = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      alert('Added to cart!');
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-white bg-opacity-30 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all z-10"
          style={{ color: '#1F2D38' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image Section */}
          <div>
            <div className="relative rounded-lg h-80 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#E0EAF0' }}>
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImageIndex]?.url}
                  alt={`${product.name} - ${selectedImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div style={{ color: '#94A1AB' }}>No Image</div>
              )}

              {product.availabilityType === 'made-to-order' && (
                <div className="absolute top-2 right-2 text-white px-3 py-1 rounded-md text-sm font-semibold" style={{ backgroundColor: '#895F42' }}>
                  Made to Order
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-[#895F42]' : 'border-[#BDD7EB]'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1F2D38' }}>
              {product.name}
            </h2>

            {product.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-fit mb-3" style={{ backgroundColor: '#E0EAF0', color: '#895F42' }}>
                {typeof product.category === 'object' ? product.category.name : product.category}
              </span>
            )}

            <div className="mb-4">
              <span className="text-3xl font-bold" style={{ color: '#895F42' }}>
                ₹{product.price?.toLocaleString()}
              </span>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-4">
              {product.availabilityType === 'immediate' ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-green-600">Immediate Delivery</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#895F42' }}></div>
                  <span className="text-sm font-semibold" style={{ color: '#895F42' }}>Made to Order</span>
                </>
              )}
            </div>

            {product.availabilityType === 'made-to-order' && product.deliveryDays && (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FFF8F3', border: '1px solid #895F42' }}>
                <svg className="w-4 h-4" style={{ color: '#895F42' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-semibold" style={{ color: '#895F42' }}>
                  Manufacturing time: {product.deliveryDays} {product.deliveryDays === 1 ? 'day' : 'days'}
                </span>
              </div>
            )}

            <p className="text-sm mb-4 line-clamp-4" style={{ color: '#4B5563' }}>
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2D38' }}>
                Quantity
              </label>
              <div className="inline-flex items-center rounded-lg overflow-hidden" style={{ border: '2px solid #BDD7EB' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 font-bold transition hover:bg-gray-50"
                  style={{ color: '#895F42', borderRight: '2px solid #BDD7EB' }}
                >
                  −
                </button>
                <span className="px-6 py-2 font-bold bg-white" style={{ color: '#1F2D38' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(100, quantity + 1))}
                  className="px-4 py-2 font-bold transition hover:bg-gray-50"
                  style={{ color: '#895F42', borderLeft: '2px solid #BDD7EB' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: '#895F42', color: 'white' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>

              <Link
                to={`/products/${product.slug || product._id}`}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-all text-center"
                style={{ backgroundColor: '#E0EAF0', color: '#895F42' }}
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLook;
