import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product._id));

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await addToCart(product._id, 1);
    if (result.success) {
      alert('Added to cart!');
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      const result = await removeFromWishlist(product._id);
      if (result.success) {
        setIsWishlisted(false);
      }
    } else {
      const result = await addToWishlist(product._id);
      if (result.success) {
        setIsWishlisted(true);
      }
    }
  };

  return (
    <Link to={`/products/${product.slug || product._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-2" style={{ borderColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#BDD7EB'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
        <div className="relative h-64 overflow-hidden" style={{ backgroundColor: '#E0EAF0' }}>
          {product.images && product.images.length > 0 && product.images[0].url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ color: '#94A1AB' }}>
              No Image
            </div>
          )}

          {/* Wishlist Heart Icon */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 left-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
            style={{
              color: isWishlisted ? '#ef4444' : '#94A1AB',
            }}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill={isWishlisted ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {product.availabilityType === 'made-to-order' && (
            <div className="absolute top-2 right-2 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-lg" style={{ backgroundColor: '#895F42' }}>
              Made to Order
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: '#1F2D38' }}>
            {product.name}
          </h3>

          <p className="text-sm mb-3 line-clamp-2" style={{ color: '#94A1AB' }}>
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold" style={{ color: '#895F42' }}>
                ₹{product.price?.toLocaleString()}
              </span>
              {product.category && (
                <p className="text-xs mt-1" style={{ color: '#94A1AB' }}>
                  {typeof product.category === 'object' ? product.category.name : product.category}
                </p>
              )}
              {product.availabilityType === 'made-to-order' && product.deliveryDays && (
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-3 h-3" style={{ color: '#895F42' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs" style={{ color: '#895F42' }}>
                    {product.deliveryDays} {product.deliveryDays === 1 ? 'day' : 'days'}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="px-4 py-2 rounded-md transition-all"
              style={{
                backgroundColor: '#895F42',
                color: '#E5EFF3'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9F8065'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#895F42'}
            >
              {product.availabilityType === 'made-to-order' ? 'Order Now' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
