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
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-200">
        <div className="relative h-64 overflow-hidden bg-amber-50">
          {product.images && product.images.length > 0 && product.images[0].url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
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
          <h3 className="text-lg font-semibold text-indigo-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-orange-600">
                ₹{product.price?.toLocaleString()}
              </span>
              {product.category && (
                <p className="text-xs text-gray-500 mt-1">{product.category}</p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.inStock === false}
              className={`px-4 py-2 rounded-md transition-all ${
                product.inStock === false
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600'
              }`}
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
