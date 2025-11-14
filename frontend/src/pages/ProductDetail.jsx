import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productAPI, recommendationAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import SEO from '../components/SEO';
import ProductRecommendations from '../components/ProductRecommendations';
import VariantSelector from '../components/VariantSelector';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantOptions, setSelectedVariantOptions] = useState({});
  const [displayPrice, setDisplayPrice] = useState(0);

  // Recommendations
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [completeTheLook, setCompleteTheLook] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

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

  // Fetch recommendations separately
  useEffect(() => {
    if (!product) return;

    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);

        // Fetch all recommendations in parallel
        const [frequentlyBoughtRes, similarRes, completeTheLookRes] = await Promise.all([
          recommendationAPI.getFrequentlyBoughtTogether(id, 3).catch(() => ({ data: [] })),
          recommendationAPI.getSimilarProducts(id, 6).catch(() => ({ data: [] })),
          recommendationAPI.getCompleteTheLook(id, 4).catch(() => ({ data: [] }))
        ]);

        setFrequentlyBought(frequentlyBoughtRes.data || []);
        setSimilarProducts(similarRes.data || []);
        setCompleteTheLook(completeTheLookRes.data || []);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [id, product]);

  const handleAddToCart = async () => {
    // Use displayPrice if variants are selected, otherwise use product.price
    const finalPrice = displayPrice || product.price;
    const result = await addToCart(product._id, quantity, selectedVariantOptions, finalPrice);
    if (result.success) {
      toast.success('Added to cart!');
    }
  };

  const handleVariantChange = (options, price) => {
    setSelectedVariantOptions(options);
    setDisplayPrice(price);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafaf9' }}>
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
    <>
      <SEO
        title={`${product.name} | Samrat Agencies`}
        description={product.description?.substring(0, 160) || `Buy ${product.name} at Samrat Agencies. Premium furniture in Bangalore.`}
        keywords={`${product.name}, ${product.category?.name || 'furniture'}, ${product.brand || ''}, furniture bangalore, samrat agencies`}
        image={product.images?.[0]?.url || '/samrat-logo.png'}
        url={`/products/${id}`}
        type="product"
        product={product}
      />
      <div className="min-h-screen py-4 lg:py-8" style={{ backgroundColor: '#fafaf9' }}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 flex items-center text-sm" style={{ color: '#94A1AB' }}>
          <button
            onClick={() => navigate('/')}
            className="hover:underline"
            style={{ color: '#895F42' }}
          >
            Home
          </button>
          <span className="mx-2">/</span>
          <button
            onClick={() => navigate('/products')}
            className="hover:underline"
            style={{ color: '#895F42' }}
          >
            Products
          </button>
          <span className="mx-2">/</span>
          <span className="font-medium" style={{ color: '#1F2D38' }}>{product.name}</span>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Product Image Gallery - Takes 3 columns on large screens */}
            <div className="lg:col-span-3 p-4 lg:p-8 space-y-4" style={{ backgroundColor: '#FAFAF9' }}>
              {/* Main Image Display */}
              <div className="relative rounded-2xl h-[400px] lg:h-[600px] flex items-center justify-center overflow-hidden shadow-2xl group" style={{ backgroundColor: 'white', border: '4px solid #BDD7EB' }}>
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={product.images[selectedImageIndex]?.url}
                      alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Navigation Arrows - Only show if multiple images */}
                    {product.images.length > 1 && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + product.images.length) % product.images.length)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition"
                          style={{ color: '#895F42' }}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % product.images.length)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition"
                          style={{ color: '#895F42' }}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                          {selectedImageIndex + 1} / {product.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-lg" style={{ color: '#94A1AB' }}>No Image Available</div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-3 transition-all duration-200 ${
                        selectedImageIndex === index
                          ? 'ring-4 ring-offset-2 shadow-lg scale-105'
                          : 'hover:scale-105 hover:shadow-md opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        borderColor: selectedImageIndex === index ? '#895F42' : '#BDD7EB',
                        borderWidth: '3px',
                        ringColor: '#895F42'
                      }}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col">
              {/* Product Title & Category */}
              <div className="mb-4">
                {product.featured && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900 mb-3">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured Product
                  </span>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-3" style={{ color: '#1F2D38' }}>
                  {product.name}
                </h1>

                {/* Category & Brand */}
                <div className="flex flex-wrap gap-2">
                  {product.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E0EAF0', color: '#895F42' }}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </span>
                  )}
                  {product.brand && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100" style={{ color: '#1F2D38' }}>
                      {product.brand}
                    </span>
                  )}
                </div>
              </div>

              {/* Price Section - Show variant selector if variants exist */}
              {product.variantPricing && product.variantPricing.length > 0 ? (
                <div className="mb-6">
                  <VariantSelector
                    product={product}
                    onVariantChange={handleVariantChange}
                  />
                </div>
              ) : (
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FFF8F3', border: '2px solid #895F42' }}>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl lg:text-4xl font-bold" style={{ color: '#895F42' }}>
                      ₹{product.price?.toLocaleString()}
                    </span>
                  </div>

                  {/* Availability Type */}
                  <div className="flex items-center gap-2">
                    {product.availabilityType === 'immediate' ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-green-600">Immediate Delivery</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#895F42' }}></div>
                        <span className="text-sm font-semibold" style={{ color: '#895F42' }}>Made to Order</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3" style={{ color: '#1F2D38' }}>
                  Select Quantity
                </label>
                <div className="inline-flex items-center rounded-lg overflow-hidden" style={{ border: '2px solid #BDD7EB' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-3 font-bold text-lg transition hover:bg-gray-50"
                    style={{ color: '#895F42', borderRight: '2px solid #BDD7EB' }}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-8 py-3 text-xl font-bold bg-white" style={{ color: '#1F2D38' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(100, quantity + 1))}
                    className="px-5 py-3 font-bold text-lg transition hover:bg-gray-50"
                    style={{ color: '#895F42', borderLeft: '2px solid #BDD7EB' }}
                    disabled={quantity >= 100}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-4 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: '#895F42',
                    color: 'white'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {product.availabilityType === 'made-to-order' ? 'Order Now' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-4 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: '#10B981',
                    color: 'white'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {product.availabilityType === 'made-to-order' ? 'Order & Buy Now' : 'Buy Now'}
                </button>
              </div>

              {/* Product Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#F0F9FF', border: '1px solid #BDD7EB' }}>
                  <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#895F42' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#1F2D38' }}>Quality Assured</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#F0F9FF', border: '1px solid #BDD7EB' }}>
                  <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#895F42' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#1F2D38' }}>Free Delivery</span>
                </div>
                {product.availabilityType === 'made-to-order' && product.deliveryDays && (
                  <div className="flex items-center gap-2 p-3 rounded-lg col-span-2" style={{ backgroundColor: '#FFF8F3', border: '1px solid #895F42' }}>
                    <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#895F42' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-semibold" style={{ color: '#895F42' }}>
                      Manufacturing time: {product.deliveryDays} {product.deliveryDays === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="p-4 rounded-lg space-y-2" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: '#94A1AB' }}>SKU:</span>
                  <span className="font-mono text-xs" style={{ color: '#1F2D38' }}>{product.sku || product._id.slice(-8)}</span>
                </div>
                {product.attributeSet && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#94A1AB' }}>Product Type:</span>
                    <span className="font-medium" style={{ color: '#1F2D38' }}>
                      {typeof product.attributeSet === 'object' ? product.attributeSet.name : product.attributeSet}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="px-4 sm:px-8 py-6">
              <div className="pt-6" style={{ borderTop: '2px solid #BDD7EB' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#E0EAF0' }}>
                    <svg className="w-6 h-6" style={{ color: '#895F42' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold" style={{ color: '#1F2D38' }}>Technical Specifications</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="p-4 rounded-lg border-l-4 hover:shadow-md transition-shadow" style={{ backgroundColor: '#F9FAFB', borderLeftColor: '#895F42' }}>
                      <div className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#895F42' }}>
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </div>
                      <div className="text-sm lg:text-base font-bold" style={{ color: '#1F2D38' }}>
                        {Array.isArray(value) ? value.join(', ') : value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Description Section */}
          {product.description && (
            <div className="px-4 sm:px-8 py-6">
              <div className="pt-6" style={{ borderTop: '2px solid #BDD7EB' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#E0EAF0' }}>
                    <svg className="w-6 h-6" style={{ color: '#895F42' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold" style={{ color: '#1F2D38' }}>Product Description</h3>
                </div>
                <div className="p-6 rounded-lg" style={{ backgroundColor: '#FAFAF9' }}>
                  <p className="leading-relaxed text-sm lg:text-base whitespace-pre-line" style={{ color: '#4B5563' }}>
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations Sections */}
        <div className="mt-8 space-y-8">
          {/* Frequently Bought Together */}
          {frequentlyBought.length > 0 && (
            <div className="border-t-2 pt-8" style={{ borderColor: '#BDD7EB' }}>
              <ProductRecommendations
                title="Frequently Bought Together"
                products={frequentlyBought}
                loading={loadingRecommendations}
              />
            </div>
          )}

          {/* Complete the Look */}
          {completeTheLook.length > 0 && (
            <div className="border-t-2 pt-8" style={{ borderColor: '#BDD7EB' }}>
              <ProductRecommendations
                title="Complete the Look"
                products={completeTheLook}
                loading={loadingRecommendations}
              />
            </div>
          )}

          {/* Similar Products - You May Also Like */}
          {similarProducts.length > 0 && (
            <div className="border-t-2 pt-8" style={{ borderColor: '#BDD7EB' }}>
              <ProductRecommendations
                title="You May Also Like"
                products={similarProducts}
                loading={loadingRecommendations}
              />
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default ProductDetail;
