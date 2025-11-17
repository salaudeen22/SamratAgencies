import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductBadge from '../ProductBadge';
import toast from 'react-hot-toast';

const RecentlyViewedSection = () => {
  const { recentlyViewed } = useRecentlyViewed();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  if (recentlyViewed.length === 0) return null;

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success('Added to cart');
  };

  const handleAddToWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
    toast.success('Added to wishlist');
  };

  return (
    <section className="py-16 px-4" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#2F1A0F' }}>
              Recently Viewed
            </h2>
            <p className="text-gray-600">
              Continue where you left off
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {recentlyViewed.slice(0, 6).map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <ProductBadge product={product} />
                <img
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleAddToWishlist(e, product)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="Add to wishlist"
                  >
                    <FiHeart className="w-4 h-4" style={{ color: '#816047' }} />
                  </button>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="Add to cart"
                  >
                    <FiShoppingCart className="w-4 h-4" style={{ color: '#816047' }} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-medium text-sm mb-2 line-clamp-2" style={{ color: '#2F1A0F' }}>
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold" style={{ color: '#816047' }}>
                    ₹{product.price?.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {recentlyViewed.length > 6 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Showing 6 of {recentlyViewed.length} recently viewed products
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
