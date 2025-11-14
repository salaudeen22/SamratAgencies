import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductRecommendations = ({ title, products, loading }) => {
  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#1F2D38' }}>{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  const getDiscountedPrice = (product) => {
    if (!product.discount || product.discount === 0) return product.price;

    if (product.discountType === 'percentage') {
      return product.price - (product.price * product.discount / 100);
    } else {
      return product.price - product.discount;
    }
  };

  return (
    <div className="py-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: '#1F2D38' }}>
        {title}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2"
            style={{ borderColor: '#BDD7EB' }}
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.images?.[0]?.url || '/placeholder.png'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />

              {/* Discount Badge */}
              {product.discount > 0 && (
                <div
                  className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold text-white shadow-lg"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  {product.discountType === 'percentage'
                    ? `${product.discount}% OFF`
                    : `₹${product.discount} OFF`
                  }
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-3">
              {/* Category */}
              {product.category && (
                <p className="text-xs mb-1" style={{ color: '#94A1AB' }}>
                  {product.category.name}
                </p>
              )}

              {/* Product Name */}
              <h3
                className="text-sm md:text-base font-semibold mb-2 line-clamp-2 min-h-[2.5rem]"
                style={{ color: '#1F2D38' }}
              >
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex flex-col gap-1">
                {product.discount > 0 ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base md:text-lg font-bold" style={{ color: '#895F42' }}>
                        ₹{Math.round(getDiscountedPrice(product)).toLocaleString()}
                      </span>
                      <span className="text-xs line-through" style={{ color: '#94A1AB' }}>
                        ₹{product.price?.toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-base md:text-lg font-bold" style={{ color: '#895F42' }}>
                    ₹{product.price?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

ProductRecommendations.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.array,
  loading: PropTypes.bool
};

ProductRecommendations.defaultProps = {
  products: [],
  loading: false
};

export default ProductRecommendations;
