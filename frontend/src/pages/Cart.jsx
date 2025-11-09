import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, newQuantity) => {
    await updateQuantity(productId, newQuantity);
  };

  const handleRemove = async (productId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(productId);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen py-16" style={{ backgroundColor: '#fafaf9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg className="mx-auto h-24 w-24 mb-6" style={{ color: '#BDD7EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1F2D38' }}>Your cart is empty</h2>
            <p className="mb-8" style={{ color: '#94A1AB' }}>Start shopping and add items to your cart</p>
            <Link to="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#1F2D38' }}>Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.product._id} className="bg-white rounded-lg shadow-md p-6" style={{ border: '2px solid #BDD7EB' }}>
                <div className="flex items-center space-x-6">
                  {/* Product Image */}
                  <div className="rounded-lg w-24 h-24 flex-shrink-0" style={{ backgroundColor: '#E0EAF0' }}>
                    {item.product.images && item.product.images.length > 0 && item.product.images[0].url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: '#94A1AB' }}>
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.product._id}`}
                      className="text-lg font-semibold transition"
                      style={{ color: '#1F2D38' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#1F2D38'}
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm mt-1" style={{ color: '#94A1AB' }}>
                      {item.product.category}
                    </p>
                    <p className="font-bold mt-2" style={{ color: '#895F42' }}>
                      ₹{item.product.price?.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      className="px-3 py-1 rounded-md transition"
                      style={{ backgroundColor: '#E0EAF0', color: '#1F2D38' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BDD7EB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold" style={{ color: '#1F2D38' }}>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      className="px-3 py-1 rounded-md transition"
                      style={{ backgroundColor: '#E0EAF0', color: '#1F2D38' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BDD7EB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal & Remove */}
                  <div className="text-right">
                    <p className="text-lg font-bold mb-2" style={{ color: '#1F2D38' }}>
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20" style={{ border: '2px solid #BDD7EB' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#1F2D38' }}>Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between" style={{ color: '#94A1AB' }}>
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ color: '#94A1AB' }}>
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="pt-3 flex justify-between text-lg font-bold" style={{ borderTop: '2px solid #BDD7EB' }}>
                  <span style={{ color: '#1F2D38' }}>Total</span>
                  <span style={{ color: '#895F42' }}>₹{getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              <Link to="/products">
                <button className="w-full mt-4 font-medium transition" style={{ color: '#895F42' }} onMouseEnter={(e) => e.currentTarget.style.color = '#9F8065'} onMouseLeave={(e) => e.currentTarget.style.color = '#895F42'}>
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
