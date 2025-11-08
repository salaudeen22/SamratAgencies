import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await addToCart(product._id, 1);
    if (result.success) {
      alert('Added to cart!');
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="group">
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
          {product.inStock === false && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
              Out of Stock
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
                <p className="text-xs mt-1" style={{ color: '#94A1AB' }}>{product.category}</p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.inStock === false}
              className={`px-4 py-2 rounded-md transition-all ${
                product.inStock === false
                  ? 'cursor-not-allowed'
                  : ''
              }`}
              style={{
                backgroundColor: product.inStock === false ? '#E0EAF0' : '#895F42',
                color: product.inStock === false ? '#94A1AB' : '#E5EFF3'
              }}
              onMouseEnter={(e) => { if (product.inStock !== false) e.currentTarget.style.backgroundColor = '#9F8065'; }}
              onMouseLeave={(e) => { if (product.inStock !== false) e.currentTarget.style.backgroundColor = '#895F42'; }}
            >
              {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
