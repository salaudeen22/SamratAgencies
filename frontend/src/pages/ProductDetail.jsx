import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productAPI, recommendationAPI, deliveryAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import Button from '../components/Button';
import SEO from '../components/SEO';
import ProductRecommendations from '../components/ProductRecommendations';
import VariantSelector from '../components/VariantSelector';
import ProductReviews from '../components/ProductReviews';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantOptions, setSelectedVariantOptions] = useState({});
  const [displayPrice, setDisplayPrice] = useState(0);

  // Wishlist
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Delivery checker
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);

  // Sticky bar
  const [showStickyBar, setShowStickyBar] = useState(false);
  const productInfoRef = useRef(null);

  // Accordion states
  const [specsOpen, setSpecsOpen] = useState(true);
  const [descriptionOpen, setDescriptionOpen] = useState(true);

  // Recommendations
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [completeTheLook, setCompleteTheLook] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getById(id);
        setProduct(response.data);
        setIsWishlisted(isInWishlist(response.data._id));
        // Add to recently viewed
        addToRecentlyViewed(response.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        if (err.response?.status === 404) {
          // Navigate to 404 page if product not found
          navigate('/404', { replace: true });
        }
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Sticky bar scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (productInfoRef.current) {
        const rect = productInfoRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch recommendations separately
  useEffect(() => {
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
  }, [id]);

  const handleAddToCart = async () => {
    // Use displayPrice if variants are selected, otherwise use product.price
    const finalPrice = displayPrice || product.price;
    const result = await addToCart(product._id, quantity, selectedVariantOptions, finalPrice);
    if (result.success) {
      toast.success('Added to cart!');
    } else if (result.requiresAuth) {
      // Auth modal will be shown automatically, no need for error toast
      return;
    } else if (result.error) {
      toast.error(result.error);
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

  const handleWishlistToggle = async () => {
    if (isWishlisted) {
      const result = await removeFromWishlist(product._id);
      if (result.success) {
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      }
    } else {
      const result = await addToWishlist(product._id);
      if (result.success) {
        setIsWishlisted(true);
        toast.success('Added to wishlist!');
      }
    }
  };

  const handleCheckDelivery = async () => {
    if (!pincode || pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setCheckingDelivery(true);
    try {
      const response = await deliveryAPI.calculateDeliveryCharge(pincode, product.price * quantity);
      setDeliveryInfo(response.data);
      if (response.data.available) {
        toast.success('Delivery available!');
      } else {
        toast.error('Delivery not available for this pincode');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check delivery');
      setDeliveryInfo({ available: false });
    } finally {
      setCheckingDelivery(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${product.name} at Samrat Agencies`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafaf9' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-4" style={{ borderColor: '#816047' }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#2F1A0F' }}>Product not found</h2>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  // Generate comprehensive SEO keywords for the product
  const generateProductKeywords = () => {
    const keywords = [];

    // Base product keywords
    keywords.push(product.name);
    keywords.push(product.name.toLowerCase());
    keywords.push(`buy ${product.name}`);
    keywords.push(`${product.name} online`);
    keywords.push(`${product.name} price`);
    keywords.push(`${product.name} bangalore`);

    // Category keywords
    if (product.category?.name) {
      keywords.push(product.category.name);
      keywords.push(`${product.category.name} bangalore`);
      keywords.push(`buy ${product.category.name}`);
      keywords.push(`${product.category.name} online`);
      keywords.push(`best ${product.category.name}`);
      keywords.push(`premium ${product.category.name}`);
      keywords.push(`luxury ${product.category.name}`);
      keywords.push(`affordable ${product.category.name}`);
    }

    // Brand keywords
    if (product.brand) {
      keywords.push(product.brand);
      keywords.push(`${product.brand} ${product.category?.name || 'furniture'}`);
      keywords.push(`${product.brand} bangalore`);
    }

    // Specification-based keywords
    if (product.specifications) {
      Object.entries(product.specifications).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          keywords.push(value.replace(/_/g, ' '));
          keywords.push(`${value.replace(/_/g, ' ')} ${product.category?.name || 'furniture'}`);
        }
      });
    }

    // Price-based keywords
    if (product.price) {
      const priceRange = Math.floor(product.price / 10000) * 10000;
      keywords.push(`furniture under ${priceRange + 10000}`);
      keywords.push(`${product.category?.name} under ${priceRange + 10000}`);
      if (product.discount > 0) {
        keywords.push(`${product.name} on sale`);
        keywords.push(`${product.name} discount`);
        keywords.push(`${product.category?.name} offers`);
      }
    }

    // Location keywords
    const locations = [
      'bangalore', 'bengaluru', 'karnataka', 'south india',
      'hongasandra', 'begur road', 'bommanahalli', 'btm',
      'hsr layout', 'koramangala', 'jp nagar', 'electronic city'
    ];

    locations.forEach(location => {
      keywords.push(`${product.category?.name || 'furniture'} ${location}`);
      keywords.push(`${product.name} ${location}`);
      keywords.push(`buy ${product.category?.name || 'furniture'} in ${location}`);
    });

    // Generic furniture keywords
    const furnitureTerms = [
      'furniture store', 'furniture shop', 'furniture showroom', 'furniture dealer',
      'online furniture', 'furniture online shopping', 'home furniture', 'quality furniture',
      'premium furniture', 'affordable furniture', 'best furniture', 'furniture near me'
    ];

    furnitureTerms.forEach(term => {
      keywords.push(`${term} bangalore`);
      keywords.push(term);
    });

    // Action keywords
    const actions = ['buy', 'purchase', 'shop', 'order', 'get', 'find'];
    actions.forEach(action => {
      keywords.push(`${action} ${product.name}`);
      keywords.push(`${action} ${product.category?.name || 'furniture'} bangalore`);
    });

    // Quality keywords
    const qualities = ['best', 'top', 'premium', 'luxury', 'quality', 'durable', 'modern', 'latest'];
    qualities.forEach(quality => {
      keywords.push(`${quality} ${product.category?.name || 'furniture'}`);
      keywords.push(`${quality} ${product.category?.name || 'furniture'} bangalore`);
    });

    // Store-specific keywords
    keywords.push('samrat agencies', 'samrat agencies bangalore', 'samrat agencies hongasandra');
    keywords.push('samrat agencies furniture', 'samrat agencies reviews');

    // Delivery & Service keywords
    keywords.push('home delivery furniture', 'free delivery furniture', 'furniture with warranty');
    keywords.push('furniture on emi', 'no cost emi furniture', 'furniture installment');

    // Remove duplicates and return as comma-separated string
    return [...new Set(keywords)].join(', ');
  };

  return (
    <>
      <SEO
        title={`${product.name} | Samrat Agencies Bangalore`}
        description={product.description?.substring(0, 160) || `Buy ${product.name} at Samrat Agencies. Premium quality furniture in Bangalore. ${product.availabilityType === 'immediate' ? 'Immediate delivery available.' : `Delivery in ${product.deliveryDays} days.`} ${product.discount > 0 ? `${product.discount}% OFF!` : ''}`}
        keywords={generateProductKeywords()}
        image={product.images?.[0]?.url || '/samrat-logo.png'}
        url={`/products/${id}`}
        type="product"
        product={product}
      />
      <div className="min-h-screen py-4 lg:py-8" style={{ backgroundColor: '#fafaf9' }}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 flex items-center text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
          <button
            onClick={() => navigate('/')}
            className="hover:underline"
            style={{ color: '#816047' }}
          >
            Home
          </button>
          <span className="mx-2">/</span>
          <button
            onClick={() => navigate('/products')}
            className="hover:underline"
            style={{ color: '#816047' }}
          >
            Products
          </button>
          <span className="mx-2">/</span>
          <span className="font-medium" style={{ color: '#2F1A0F' }}>{product.name}</span>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Product Image Gallery - Takes 3 columns on large screens */}
            <div className="lg:col-span-3 p-4 lg:p-8 space-y-4" style={{ backgroundColor: '#FAFAF9' }}>
              {/* Main Image Display */}
              <div className="relative rounded-2xl h-[400px] lg:h-[600px] flex items-center justify-center overflow-hidden shadow-2xl group" style={{ backgroundColor: 'white', border: '4px solid #D7B790' }}>
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
                          style={{ color: '#816047' }}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % product.images.length)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition"
                          style={{ color: '#816047' }}
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
                  <div className="text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>No Image Available</div>
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
                        borderColor: selectedImageIndex === index ? '#816047' : '#D7B790',
                        borderWidth: '3px',
                        ringColor: '#816047'
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
            <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col" ref={productInfoRef}>
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

                {/* Title with Wishlist & Share */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h1 className="text-3xl lg:text-4xl font-bold leading-tight flex-1" style={{ color: '#2F1A0F' }}>
                    {product.name}
                  </h1>

                  {/* Wishlist & Share Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Wishlist Button */}
                    <button
                      onClick={handleWishlistToggle}
                      className="p-2.5 rounded-full transition-all hover:scale-110"
                      style={{
                        backgroundColor: isWishlisted ? '#FEE2E2' : '#F3F4F6',
                        color: isWishlisted ? '#ef4444' : 'rgba(129, 96, 71, 0.6)'
                      }}
                      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <svg className="w-6 h-6" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* Share Dropdown */}
                    <div className="relative group">
                      <button
                        className="p-2.5 rounded-full transition-all hover:scale-110"
                        style={{ backgroundColor: '#F3F4F6', color: '#816047' }}
                        title="Share"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>

                      {/* Share Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10"
                        style={{ backgroundColor: 'white', border: '2px solid #D7B790' }}
                      >
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
                          style={{ color: '#25D366' }}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WhatsApp
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          style={{ color: '#1877F2' }}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Facebook
                        </button>
                        <button
                          onClick={() => handleShare('copy')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 rounded-b-lg"
                          style={{ color: '#816047' }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5"
                          fill={i < Math.floor(product.rating) ? '#FCD34D' : 'none'}
                          stroke="#FCD34D"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#2F1A0F' }}>
                      {product.rating.toFixed(1)}
                    </span>
                    {product.numReviews > 0 && (
                      <span className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                        ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    )}
                  </div>
                )}

                {/* Category & Brand */}
                <div className="flex flex-wrap gap-2">
                  {product.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E6CDB1', color: '#816047' }}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </span>
                  )}
                  {product.brand && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100" style={{ color: '#2F1A0F' }}>
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
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#E6CDB1', border: '2px solid #816047' }}>
                  <div className="flex items-baseline gap-3 mb-2">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-3xl lg:text-4xl font-bold" style={{ color: '#816047' }}>
                          ₹{(() => {
                            const price = product.price;
                            const discount = product.discount;
                            if (product.discountType === 'percentage') {
                              return Math.round(price - (price * discount / 100)).toLocaleString();
                            } else {
                              return Math.round(Math.max(0, price - discount)).toLocaleString();
                            }
                          })()}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-lg text-gray-600 line-through">
                            ₹{product.price?.toLocaleString()}
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            {product.discountType === 'percentage'
                              ? `${product.discount}% OFF`
                              : `₹${product.discount} OFF`}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-3xl lg:text-4xl font-bold" style={{ color: '#816047' }}>
                        ₹{product.price?.toLocaleString()}
                      </span>
                    )}
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
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#816047' }}></div>
                        <span className="text-sm font-semibold" style={{ color: '#816047' }}>Made to Order</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3" style={{ color: '#2F1A0F' }}>
                  Select Quantity
                </label>
                <div className="inline-flex items-center rounded-lg overflow-hidden" style={{ border: '2px solid #D7B790' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-3 font-bold text-lg transition hover:bg-gray-50"
                    style={{ color: '#816047', borderRight: '2px solid #D7B790' }}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-8 py-3 text-xl font-bold bg-white" style={{ color: '#2F1A0F' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(100, quantity + 1))}
                    className="px-5 py-3 font-bold text-lg transition hover:bg-gray-50"
                    style={{ color: '#816047', borderLeft: '2px solid #D7B790' }}
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
                    backgroundColor: '#816047',
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
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#F0F9FF', border: '1px solid #D7B790' }}>
                  <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#816047' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#2F1A0F' }}>Quality Assured</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#F0F9FF', border: '1px solid #D7B790' }}>
                  <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#816047' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: '#2F1A0F' }}>Free Delivery</span>
                </div>
                {product.availabilityType === 'made-to-order' && product.deliveryDays && (
                  <div className="flex items-center gap-2 p-3 rounded-lg col-span-2" style={{ backgroundColor: '#E6CDB1', border: '1px solid #816047' }}>
                    <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#816047' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-semibold" style={{ color: '#816047' }}>
                      Manufacturing time: {product.deliveryDays} {product.deliveryDays === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="p-4 rounded-lg space-y-2 mb-6" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'rgba(129, 96, 71, 0.6)' }}>SKU:</span>
                  <span className="font-mono text-xs" style={{ color: '#2F1A0F' }}>{product.sku || product._id.slice(-8)}</span>
                </div>
                {product.attributeSet && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Product Type:</span>
                    <span className="font-medium" style={{ color: '#2F1A0F' }}>
                      {typeof product.attributeSet === 'object' ? product.attributeSet.name : product.attributeSet}
                    </span>
                  </div>
                )}
              </div>

              {/* Pincode Delivery Checker */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F9FF', border: '2px solid #D7B790' }}>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5" style={{ color: '#816047' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-semibold" style={{ color: '#2F1A0F' }}>Check Delivery Availability</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter Pincode"
                    className="flex-1 px-3 py-2 border-2 rounded-md focus:outline-none text-sm"
                    style={{ borderColor: '#D7B790' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#816047'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#D7B790'}
                    maxLength={6}
                  />
                  <button
                    onClick={handleCheckDelivery}
                    disabled={checkingDelivery || pincode.length !== 6}
                    className="px-4 py-2 rounded-md font-medium text-sm transition disabled:opacity-50 whitespace-nowrap"
                    style={{ backgroundColor: '#816047', color: 'white' }}
                  >
                    {checkingDelivery ? 'Checking...' : 'Check'}
                  </button>
                </div>

                {deliveryInfo && (
                  <div className={`mt-3 p-3 rounded-md ${deliveryInfo.available ? 'bg-green-50' : 'bg-red-50'}`}>
                    {deliveryInfo.available ? (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm font-semibold text-green-700">Delivery Available!</span>
                        </div>
                        <div className="text-xs space-y-1" style={{ color: '#4B5563' }}>
                          {deliveryInfo.isFree ? (
                            <p className="font-semibold text-green-600">🎉 FREE Delivery</p>
                          ) : (
                            <>
                              <p>Delivery Charge: <span className="font-semibold">₹{deliveryInfo.deliveryCharge}</span></p>
                              {deliveryInfo.freeDeliveryThreshold && (
                                <p className="text-green-600">
                                  Free delivery on orders above ₹{deliveryInfo.freeDeliveryThreshold}
                                </p>
                              )}
                            </>
                          )}
                          {deliveryInfo.estimatedDays && (
                            <p>Estimated Delivery: <span className="font-semibold">{deliveryInfo.estimatedDays} days</span></p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-sm font-semibold text-red-700">Delivery not available for this pincode</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Specifications Section - Accordion */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="px-4 sm:px-8 py-6">
              <div className="pt-6" style={{ borderTop: '2px solid #D7B790' }}>
                <button
                  onClick={() => setSpecsOpen(!specsOpen)}
                  className="w-full flex items-center justify-between gap-3 mb-4 p-4 rounded-lg transition-all hover:shadow-md"
                  style={{ backgroundColor: specsOpen ? '#E6CDB1' : '#F9FAFB' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'white' }}>
                      <svg className="w-6 h-6" style={{ color: '#816047' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-left" style={{ color: '#2F1A0F' }}>
                      Technical Specifications
                    </h3>
                  </div>
                  <svg
                    className="w-6 h-6 transition-transform duration-300 flex-shrink-0"
                    style={{
                      color: '#816047',
                      transform: specsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: specsOpen ? '2000px' : '0',
                    opacity: specsOpen ? 1 : 0
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="p-4 rounded-lg border-l-4 hover:shadow-md transition-shadow" style={{ backgroundColor: '#F9FAFB', borderLeftColor: '#816047' }}>
                        <div className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#816047' }}>
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </div>
                        <div className="text-sm lg:text-base font-bold" style={{ color: '#2F1A0F' }}>
                          {Array.isArray(value) ? value.join(', ') : value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description Section - Accordion */}
          {product.description && (
            <div className="px-4 sm:px-8 py-6">
              <div className="pt-6" style={{ borderTop: '2px solid #D7B790' }}>
                <button
                  onClick={() => setDescriptionOpen(!descriptionOpen)}
                  className="w-full flex items-center justify-between gap-3 mb-4 p-4 rounded-lg transition-all hover:shadow-md"
                  style={{ backgroundColor: descriptionOpen ? '#E6CDB1' : '#F9FAFB' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'white' }}>
                      <svg className="w-6 h-6" style={{ color: '#816047' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-left" style={{ color: '#2F1A0F' }}>
                      Product Description
                    </h3>
                  </div>
                  <svg
                    className="w-6 h-6 transition-transform duration-300 flex-shrink-0"
                    style={{
                      color: '#816047',
                      transform: descriptionOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: descriptionOpen ? '2000px' : '0',
                    opacity: descriptionOpen ? 1 : 0
                  }}
                >
                  <div className="p-6 rounded-lg" style={{ backgroundColor: '#FAFAF9' }}>
                    <p className="leading-relaxed text-sm lg:text-base whitespace-pre-line" style={{ color: '#4B5563' }}>
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Reviews Section */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-xl overflow-hidden p-4 sm:p-6 md:p-8">
          <ProductReviews productId={product?._id} />
        </div>

        {/* Recommendations Sections */}
        {!loadingRecommendations && (frequentlyBought.length > 0 || similarProducts.length > 0 || completeTheLook.length > 0) && (
          <div className="mt-8 space-y-8">
            {/* Frequently Bought Together */}
            {frequentlyBought.length > 0 && (
              <div className="border-t-2 pt-8" style={{ borderColor: '#D7B790' }}>
                <ProductRecommendations
                  title="Frequently Bought Together"
                  products={frequentlyBought}
                  loading={false}
                />
              </div>
            )}

            {/* Complete the Look */}
            {completeTheLook.length > 0 && (
              <div className="border-t-2 pt-8" style={{ borderColor: '#D7B790' }}>
                <ProductRecommendations
                  title="Complete the Look"
                  products={completeTheLook}
                  loading={false}
                />
              </div>
            )}

            {/* Similar Products - You May Also Like */}
            {similarProducts.length > 0 && (
              <div className="border-t-2 pt-8" style={{ borderColor: '#D7B790' }}>
                <ProductRecommendations
                  title="You May Also Like"
                  products={similarProducts}
                  loading={false}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Add-to-Cart Bar */}
      {showStickyBar && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 z-40 transform transition-transform duration-300"
          style={{ borderColor: '#D7B790' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between gap-3 sm:gap-6">
              {/* Product Info */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                {product.images && product.images[0] && (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                    style={{ border: '2px solid #D7B790' }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base truncate" style={{ color: '#2F1A0F' }}>
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm sm:text-base font-bold" style={{ color: '#816047' }}>
                      ₹{(() => {
                        const basePrice = displayPrice || product.price;
                        if (product.discount > 0 && !displayPrice) {
                          if (product.discountType === 'percentage') {
                            return Math.round(basePrice - (basePrice * product.discount / 100)).toLocaleString();
                          } else {
                            return Math.round(Math.max(0, basePrice - product.discount)).toLocaleString();
                          }
                        }
                        return basePrice?.toLocaleString();
                      })()}
                    </p>
                    {product.discount > 0 && !displayPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ₹{product.price?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Wishlist */}
                <button
                  onClick={handleWishlistToggle}
                  className="p-2 sm:p-2.5 rounded-full transition-all hover:scale-110 hidden sm:block"
                  style={{
                    backgroundColor: isWishlisted ? '#FEE2E2' : '#F3F4F6',
                    color: isWishlisted ? '#ef4444' : 'rgba(129, 96, 71, 0.6)'
                  }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all hover:shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: '#816047', color: 'white' }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all hover:shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: '#10B981', color: 'white' }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="hidden sm:inline">Buy Now</span>
                  <span className="sm:hidden">Buy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default ProductDetail;
