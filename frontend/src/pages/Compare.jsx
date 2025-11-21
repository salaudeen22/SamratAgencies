import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const Compare = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      toast.success('Added to cart!');
    }
  };

  if (compareList.length === 0) {
    return (
      <>
        <SEO
          title="Compare Products | Samrat Agencies"
          description="Compare furniture products side by side at Samrat Agencies."
          url="/compare"
          robots="noindex, follow"
        />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2F1A0F' }}>
                No Products to Compare
              </h2>
              <p className="mb-8 text-base sm:text-lg max-w-md mx-auto" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                Add products to comparison from the product listing page to see them side-by-side!
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
      </>
    );
  }

  const comparisonAttributes = [
    { label: 'Product', key: 'product' },
    { label: 'Price', key: 'price' },
    { label: 'Category', key: 'category' },
    { label: 'Availability', key: 'availability' },
    { label: 'Delivery Time', key: 'deliveryTime' },
    { label: 'Material', key: 'material' },
    { label: 'Color', key: 'color' },
    { label: 'Dimensions', key: 'dimensions' },
    { label: 'Stock Status', key: 'stock' },
    { label: 'Description', key: 'description' },
  ];

  const getValue = (product, key) => {
    switch (key) {
      case 'product':
        return (
          <div className="sticky top-0 bg-white z-10 p-4">
            <Link to={`/products/${product.slug || product._id}`}>
              <div className="h-48 rounded-lg overflow-hidden mb-3" style={{ backgroundColor: '#E6CDB1' }}>
                {product.images && product.images.length > 0 && product.images[0].url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    No Image
                  </div>
                )}
              </div>
              <h3 className="font-bold text-base sm:text-lg line-clamp-2 hover:text-[#816047] transition" style={{ color: '#2F1A0F' }}>
                {product.name}
              </h3>
            </Link>
          </div>
        );
      case 'price':
        return (
          <span className="text-2xl font-bold" style={{ color: '#816047' }}>
            ₹{product.price?.toLocaleString()}
          </span>
        );
      case 'category':
        return (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E6CDB1', color: '#816047' }}>
            {typeof product.category === 'object' ? product.category.name : product.category || 'N/A'}
          </span>
        );
      case 'availability':
        return product.availabilityType === 'immediate' ? (
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-semibold text-green-600">Immediate</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#816047' }}></div>
            <span className="text-sm font-semibold" style={{ color: '#816047' }}>Made to Order</span>
          </span>
        );
      case 'deliveryTime':
        return product.deliveryDays ? (
          <span className="text-sm font-medium">
            {product.deliveryDays} {product.deliveryDays === 1 ? 'day' : 'days'}
          </span>
        ) : (
          <span className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>N/A</span>
        );
      case 'material':
        return product.specifications?.Material || product.specifications?.material || (
          <span className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>N/A</span>
        );
      case 'color':
        return product.specifications?.Color || product.specifications?.color || (
          <span className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>N/A</span>
        );
      case 'dimensions':
        return product.specifications?.Dimensions || product.dimensions || (
          <span className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>N/A</span>
        );
      case 'stock':
        return product.stock > 0 ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#E0F2E9', color: '#10B981' }}>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            In Stock ({product.stock})
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}>
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            Out of Stock
          </span>
        );
      case 'description':
        return (
          <p className="text-sm line-clamp-3" style={{ color: '#4B5563' }}>
            {product.description || 'No description available'}
          </p>
        );
      default:
        return 'N/A';
    }
  };

  return (
    <>
      <SEO
        title="Compare Products | Samrat Agencies"
        description="Compare selected furniture products side by side."
        url="/compare"
        robots="noindex, follow"
      />
      <div className="min-h-screen py-6 sm:py-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 border-2" style={{ borderColor: '#D7B790' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#2F1A0F' }}>
                Compare Products
              </h1>
              <p className="text-base sm:text-lg font-medium" style={{ color: '#816047' }}>
                Comparing {compareList.length} {compareList.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/products')}
                className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                style={{
                  backgroundColor: 'white',
                  color: '#816047',
                  border: '2px solid #816047'
                }}
              >
                Add More
              </button>
              <button
                onClick={clearCompare}
                className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                style={{
                  backgroundColor: 'white',
                  color: '#ef4444',
                  border: '2px solid #ef4444'
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2" style={{ borderColor: '#D7B790' }}>
          {/* Mobile Scroll Hint */}
          <div className="md:hidden bg-blue-50 px-4 py-2 text-xs text-center" style={{ color: '#816047' }}>
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Scroll horizontally to see all products
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {comparisonAttributes.map((attr, index) => (
                  <tr
                    key={attr.key}
                    className={index % 2 === 0 ? '' : 'bg-gray-50'}
                  >
                    {/* Attribute Label */}
                    <td className="p-3 sm:p-4 font-bold text-xs sm:text-sm md:text-base sticky left-0 bg-white z-20" style={{ color: '#2F1A0F', minWidth: '120px', borderRight: '2px solid #D7B790' }}>
                      {attr.label}
                    </td>

                    {/* Product Values */}
                    {compareList.map((product) => (
                      <td key={product._id} className="p-3 sm:p-4 text-center align-top" style={{ minWidth: '200px', maxWidth: '250px' }}>
                        <div className="relative">
                          {attr.key === 'product' && (
                            <button
                              onClick={() => removeFromCompare(product._id)}
                              className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1 sm:p-1.5 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all z-10"
                              title="Remove"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                          {getValue(product, attr.key)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Action Row */}
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <td className="p-3 sm:p-4 font-bold text-xs sm:text-sm sticky left-0 bg-white z-20" style={{ borderRight: '2px solid #D7B790' }}>
                    Actions
                  </td>
                  {compareList.map((product) => (
                    <td key={product._id} className="p-3 sm:p-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          className="w-full px-3 sm:px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg text-xs sm:text-sm"
                          style={{
                            backgroundColor: '#816047',
                            color: 'white'
                          }}
                        >
                          Add to Cart
                        </button>
                        <Link to={`/products/${product.slug || product._id}`}>
                          <button
                            className="w-full px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm"
                            style={{
                              backgroundColor: '#E6CDB1',
                              color: '#816047'
                            }}
                          >
                            View Details
                          </button>
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Compare;
