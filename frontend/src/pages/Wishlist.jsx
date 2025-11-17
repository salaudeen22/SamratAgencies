import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      toast.success('Added to cart!');
    }
  };

  const handleAddAllToCart = async () => {
    if (!wishlist.products || wishlist.products.length === 0) return;

    let successCount = 0;
    for (const item of wishlist.products) {
      if (item.product) {
        const result = await addToCart(item.product._id, 1);
        if (result.success) successCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} item(s) added to cart!`);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      await clearWishlist();
      toast.success('Wishlist cleared');
    }
  };

  const handleShareWhatsApp = () => {
    const message = `Check out my wishlist with ${wishlist.products.length} items: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Wishlist link copied to clipboard!');
  };

  const calculateDiscount = (product) => {
    if (!product.discount || product.discount === 0) return null;

    if (product.discountType === 'percentage') {
      const discountAmount = product.price * (product.discount / 100);
      return {
        originalPrice: product.price,
        discountedPrice: product.price - discountAmount,
        percentage: product.discount
      };
    } else {
      return {
        originalPrice: product.price,
        discountedPrice: product.price - product.discount,
        amount: product.discount
      };
    }
  };

  if (!wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="min-h-screen py-8 sm:py-12 md:py-16" style={{ backgroundColor: '#fafaf9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 md:p-16 border-2" style={{ borderColor: '#D7B790' }}>
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: '#E6CDB1' }}>
                  <svg
                    className="h-16 w-16 sm:h-20 sm:w-20"
                    style={{ color: '#816047' }}
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
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2F1A0F' }}>
                Your Wishlist is Empty
              </h2>
              <p className="mb-8 text-base sm:text-lg max-w-md mx-auto" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                Save your favorite items to your wishlist and shop them later!
              </p>
              <Link to="/products">
                <button
                  className="px-8 py-4 rounded-xl font-bold transition-all text-lg shadow-lg hover:shadow-xl hover:scale-105"
                  style={{
                    backgroundColor: '#816047',
                    color: 'white'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Browse Products
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 md:py-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 border-2" style={{ borderColor: '#D7B790' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#2F1A0F' }}>
                My Wishlist
              </h1>
              <p className="text-base sm:text-lg font-medium" style={{ color: '#816047' }}>
                {wishlist.products.length} {wishlist.products.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            {/* Quick Share Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="p-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: '#25D366', color: 'white' }}
                title="Share on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
              <button
                onClick={handleCopyLink}
                className="p-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: 'white', color: '#816047', border: '2px solid #816047' }}
                title="Copy Link"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddAllToCart}
              className="flex-1 px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
              style={{
                backgroundColor: '#816047',
                color: 'white'
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add All to Cart
              </div>
            </button>
            <button
              onClick={handleClearWishlist}
              className="px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              style={{
                backgroundColor: 'white',
                color: '#ef4444',
                border: '2px solid #ef4444'
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Wishlist
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.products.map((item) => {
            if (!item.product) return null;

            const product = item.product;
            const discountInfo = calculateDiscount(product);

            return (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2"
                style={{ borderColor: '#D7B790' }}
              >
                {/* Product Image */}
                <Link to={`/products/${product.slug || product._id}`}>
                  <div className="relative h-56 sm:h-64 group" style={{ backgroundColor: '#E6CDB1' }}>
                    {product.images && product.images.length > 0 && product.images[0].url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ color: 'rgba(129, 96, 71, 0.6)' }}
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
                      className="absolute top-3 right-3 p-2.5 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
                      style={{ color: '#ef4444' }}
                      title="Remove from wishlist"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.availabilityType === 'made-to-order' && (
                        <div className="text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg" style={{ backgroundColor: '#816047' }}>
                          Made to Order
                        </div>
                      )}
                      {discountInfo && (
                        <div className="text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg" style={{ backgroundColor: '#22c55e' }}>
                          {discountInfo.percentage ? `${discountInfo.percentage}% OFF` : `₹${discountInfo.amount} OFF`}
                        </div>
                      )}
                      {product.stock <= 0 && (
                        <div className="text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg" style={{ backgroundColor: '#ef4444' }}>
                          Out of Stock
                        </div>
                      )}
                      {product.stock > 0 && product.stock <= 5 && (
                        <div className="text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg" style={{ backgroundColor: '#f59e0b' }}>
                          Only {product.stock} left
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-5">
                  <Link
                    to={`/products/${product.slug || product._id}`}
                    className="block"
                  >
                    <h3
                      className="text-lg font-bold mb-2 line-clamp-2 transition"
                      style={{ color: '#2F1A0F' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#816047'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#2F1A0F'}
                    >
                      {product.name}
                    </h3>
                  </Link>

                  {product.category && (
                    <p className="text-xs font-medium mb-3 px-2.5 py-1 rounded-full inline-block" style={{ backgroundColor: '#E6CDB1', color: '#816047' }}>
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </p>
                  )}

                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    {product.description}
                  </p>

                  {/* Price Display */}
                  <div className="mb-4">
                    {discountInfo ? (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold" style={{ color: '#816047' }}>
                            ₹{Math.round(discountInfo.discountedPrice).toLocaleString()}
                          </span>
                          <span className="text-base line-through" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                            ₹{discountInfo.originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs font-semibold" style={{ color: '#22c55e' }}>
                          You save ₹{Math.round(discountInfo.originalPrice - discountInfo.discountedPrice).toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold" style={{ color: '#816047' }}>
                        ₹{product.price?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {product.availabilityType === 'made-to-order' && product.deliveryDays && (
                    <div className="flex items-center gap-2 mb-4 p-2 rounded-lg" style={{ backgroundColor: '#E6CDB1' }}>
                      <svg className="w-4 h-4" style={{ color: '#816047' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-medium" style={{ color: '#816047' }}>
                        Delivery in {product.deliveryDays} {product.deliveryDays === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock <= 0}
                    className="w-full px-4 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: product.stock <= 0 ? 'rgba(129, 96, 71, 0.6)' : '#816047',
                      color: 'white',
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      {product.stock <= 0 ? 'Out of Stock' : product.availabilityType === 'made-to-order' ? 'Order Now' : 'Add to Cart'}
                    </div>
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
