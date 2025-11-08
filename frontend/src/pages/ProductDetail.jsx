import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getById(id);
        setProduct(response.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      alert('Added to cart!');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #E0EAF0, #ffffff)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-4" style={{ borderColor: '#895F42' }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1F2D38' }}>Product not found</h2>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(to bottom, #E0EAF0, #ffffff)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center font-medium transition"
          style={{ color: '#895F42' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#9F8065'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#895F42'}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ border: '2px solid #BDD7EB' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="rounded-lg h-96 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#E0EAF0' }}>
              {product.images && product.images.length > 0 && product.images[0].url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-lg" style={{ color: '#94A1AB' }}>No Image Available</div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4" style={{ color: '#1F2D38' }}>{product.name}</h1>

              {product.category && (
                <span className="inline-block px-3 py-1 rounded-full text-sm mb-4 font-medium" style={{ backgroundColor: '#E0EAF0', color: '#895F42' }}>
                  {product.category}
                </span>
              )}

              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ color: '#895F42' }}>
                  ₹{product.price?.toLocaleString()}
                </span>
              </div>

              <p className="mb-6 leading-relaxed" style={{ color: '#94A1AB' }}>
                {product.description || 'No description available.'}
              </p>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <span className="text-green-600 font-semibold">In Stock</span>
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </div>

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 rounded-md transition"
                      style={{ backgroundColor: '#E0EAF0', color: '#1F2D38' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BDD7EB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold" style={{ color: '#1F2D38' }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 rounded-md transition"
                      style={{ backgroundColor: '#E0EAF0', color: '#1F2D38' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BDD7EB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                  size="lg"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  variant="success"
                  className="flex-1"
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-6" style={{ borderTop: '2px solid #BDD7EB' }}>
                <h3 className="font-semibold mb-4" style={{ color: '#1F2D38' }}>Product Details</h3>
                <ul className="space-y-2" style={{ color: '#94A1AB' }}>
                  <li>• SKU: {product._id}</li>
                  <li>• Category: {product.category || 'N/A'}</li>
                  <li>• Availability: {product.inStock ? 'In Stock' : 'Out of Stock'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
