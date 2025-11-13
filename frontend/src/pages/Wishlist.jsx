import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemove = async (productId) => {
    if (window.confirm('Remove this item from wishlist?')) {
      await removeFromWishlist(productId);
    }
  };

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      alert('Added to cart!');
    }
  };

  if (!wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="min-h-screen py-8 sm:py-12 md:py-16" style={{ backgroundColor: '#fafaf9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mb-4 sm:mb-6"
              style={{ color: '#BDD7EB' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: '#1F2D38' }}>
              Your wishlist is empty
            </h2>
            <p className="mb-6 sm:mb-8 text-sm sm:text-base" style={{ color: '#94A1AB' }}>
              Save your favorite items for later
            </p>
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
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1F2D38' }}>
            My Wishlist
          </h1>
          <p className="text-sm sm:text-base" style={{ color: '#94A1AB' }}>
            {wishlist.products.length} {wishlist.products.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {wishlist.products.map((item) => {
            if (!item.product) return null;

            const product = item.product;

            return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                style={{ border: '2px solid #BDD7EB' }}
              >
                {/* Product Image */}
                <Link to={`/products/${product.slug || product._id}`}>
                  <div className="relative h-48 sm:h-56" style={{ backgroundColor: '#E0EAF0' }}>
                    {product.images && product.images.length > 0 && product.images[0].url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ color: '#94A1AB' }}
                      >
                        No Image
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(product._id);
                      }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
                      style={{ color: '#ef4444' }}
                      title="Remove from wishlist"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    {product.inStock === false && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link
                    to={`/products/${product.slug || product._id}`}
                    className="block"
                  >
                    <h3
                      className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 transition"
                      style={{ color: '#1F2D38' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#1F2D38'}
                    >
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm mb-3 line-clamp-2" style={{ color: '#94A1AB' }}>
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-bold" style={{ color: '#895F42' }}>
                      ₹{product.price?.toLocaleString()}
                    </span>
                  </div>

                  {product.category && (
                    <p className="text-xs mt-2" style={{ color: '#94A1AB' }}>
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </p>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.inStock === false}
                    className={`w-full mt-4 px-4 py-2 rounded-md transition-all text-sm sm:text-base ${
                      product.inStock === false ? 'cursor-not-allowed' : ''
                    }`}
                    style={{
                      backgroundColor: product.inStock === false ? '#E0EAF0' : '#895F42',
                      color: product.inStock === false ? '#94A1AB' : '#E5EFF3',
                    }}
                    onMouseEnter={(e) => {
                      if (product.inStock !== false) e.currentTarget.style.backgroundColor = '#9F8065';
                    }}
                    onMouseLeave={(e) => {
                      if (product.inStock !== false) e.currentTarget.style.backgroundColor = '#895F42';
                    }}
                  >
                    {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
