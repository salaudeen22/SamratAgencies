import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { MdChair, MdOutlineBedroomParent, MdTableRestaurant } from 'react-icons/md';
import { GiSofa } from 'react-icons/gi';
import { FaStar } from 'react-icons/fa';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productAPI.getAll({ limit: 8 });
        setFeaturedProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: 'Sofas', icon: GiSofa, link: '/products?category=sofa' },
    { name: 'Beds', icon: MdOutlineBedroomParent, link: '/products?category=bed' },
    { name: 'Chairs', icon: MdChair, link: '/products?category=chair' },
    { name: 'Tables', icon: MdTableRestaurant, link: '/products?category=table' },
  ];

  return (
    <div className="min-h-screen">
      {/* Top Banner */}
      <div className="py-2 text-center text-sm" style={{ backgroundColor: '#1F2D38', color: '#E0EAF0' }}>
        <p>Free Delivery on orders over ₹5000. Don't miss discount. <span className="font-semibold underline cursor-pointer" style={{ color: '#9F8065' }}>Shop now</span></p>
      </div>

      {/* Hero Slider Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, #E5EFF3 0%, #E5EFF3 60%, #BDD7EB 60%, #BDD7EB 100%)` }}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFGMkQzOCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-5 py-2 text-sm font-bold rounded-full mb-4 shadow-md" style={{ backgroundColor: '#895F42', color: '#E5EFF3' }}>
                On Demand
              </span>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight" style={{ color: '#1F2D38', textShadow: '0 2px 4px rgba(31, 45, 56, 0.1)' }}>
                Wooden Classic <span className="text-transparent bg-clip-text font-black" style={{ backgroundImage: 'linear-gradient(to right, #895F42, #9F8065)', WebkitBackgroundClip: 'text', textShadow: 'none' }}>Furniture</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed font-medium" style={{ color: '#1F2D38', opacity: 0.8 }}>
                Transform your living space with premium furniture. Quality craftsmanship meets timeless elegance.
              </p>
              <Link to="/products">
                <Button size="lg" className="transition-all duration-300 transform hover:scale-105 shadow-2xl px-10 py-4 text-lg font-bold">
                  Explore Category →
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 opacity-20 rounded-3xl blur-3xl" style={{ background: 'linear-gradient(to right, #895F42, #9F8065)' }}></div>
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
                  alt="Modern Furniture"
                  className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }}>
              <div className="text-4xl font-black" style={{ color: '#895F42' }}>500+</div>
              <div className="text-sm mt-2 font-semibold" style={{ color: '#1F2D38', opacity: 0.8 }}>Products</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }}>
              <div className="text-4xl font-black" style={{ color: '#895F42' }}>5000+</div>
              <div className="text-sm mt-2 font-semibold" style={{ color: '#1F2D38', opacity: 0.8 }}>Happy Customers</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }}>
              <div className="text-4xl font-black" style={{ color: '#895F42' }}>15+</div>
              <div className="text-sm mt-2 font-semibold" style={{ color: '#1F2D38', opacity: 0.8 }}>Years Experience</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }}>
              <div className="text-4xl font-black" style={{ color: '#895F42' }}>100%</div>
              <div className="text-sm mt-2 font-semibold" style={{ color: '#1F2D38', opacity: 0.8 }}>Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16" style={{ background: 'linear-gradient(to bottom, #E0EAF0, #ffffff)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#1F2D38' }}>Shop by Category</h2>
            <p className="text-lg" style={{ color: '#94A1AB' }}>Find exactly what you need for your home</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.name} to={category.link}>
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer border-2" style={{ borderColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                    <div className="flex justify-center items-center mb-4" style={{ color: '#895F42' }}>
                      <IconComponent className="w-16 h-16" />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: '#1F2D38' }}>{category.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Glass Morphism Gallery */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1F2D38 0%, #94A1AB 100%)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#895F42' }}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#9F8065' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#E0EAF0' }}>Our Collection</h2>
            <p className="text-lg" style={{ color: '#BDD7EB' }}>Discover the perfect pieces for your home</p>
          </div>

          {/* Masonry Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-auto">
            {/* Large Vertical - Spans 2 rows */}
            <div className="col-span-1 row-span-2 group cursor-pointer">
              <div className="relative h-full rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"
                  alt="Luxury Sofa"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold">Luxury Sofas</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Square */}
            <div className="col-span-1 row-span-1 group cursor-pointer">
              <div className="relative h-48 rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80"
                  alt="Dining Chairs"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="text-lg font-bold">Dining Chairs</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Wide Horizontal - Spans 2 columns */}
            <div className="col-span-2 row-span-1 group cursor-pointer">
              <div className="relative h-48 rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"
                  alt="Dining Tables"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold">Dining Tables</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Medium Square */}
            <div className="col-span-1 row-span-1 group cursor-pointer">
              <div className="relative h-48 rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80"
                  alt="Accent Chair"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="text-lg font-bold">Armchairs</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Tall - Spans 2 rows */}
            <div className="col-span-1 row-span-2 group cursor-pointer">
              <div className="relative h-full rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80"
                  alt="Bedroom Sets"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold">Bedroom Sets</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Square */}
            <div className="col-span-1 row-span-1 group cursor-pointer">
              <div className="relative h-48 rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80"
                  alt="Beds"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="text-lg font-bold">King Beds</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Medium Square */}
            <div className="col-span-1 row-span-1 group cursor-pointer">
              <div className="relative h-48 rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80"
                  alt="Living Room"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="text-lg font-bold">Living Sets</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Wide Horizontal - Spans 2 columns */}
            <div className="col-span-2 row-span-1 group cursor-pointer">
              <div className="relative h-48 rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80"
                  alt="Chesterfield Sofa"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold">Classic Sofas</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-12" style={{ background: 'linear-gradient(to right, #895F42, #9F8065, #895F42)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#E5EFF3' }}>
              Get offer up to 50% on modern furniture
            </h2>
            <p className="text-xl mb-6" style={{ color: '#E0EAF0' }}>Free shipping for orders over ₹5000</p>
            <Link to="/products">
              <button className="px-10 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl" style={{ backgroundColor: '#E5EFF3', color: '#895F42' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BDD7EB'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E5EFF3'}>
                Shop Collection
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - Best Sellers */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom, #ffffff, #E0EAF0)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2" style={{ color: '#1F2D38' }}>Best Sellers</h2>
              <div className="flex gap-6 mt-4">
                <button className="text-lg font-semibold pb-1 border-b-2" style={{ color: '#1F2D38', borderColor: '#895F42' }}>
                  Best sellers
                </button>
                <button className="text-lg pb-1" style={{ color: '#94A1AB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#1F2D38'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A1AB'}>
                  New arrivals
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" style={{ borderColor: '#895F42' }}></div>
              <p className="mt-6 text-lg" style={{ color: '#94A1AB' }}>Loading amazing products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Lounge Collection Slider */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #BDD7EB, #E5EFF3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-5 py-2 text-sm font-bold rounded-full mb-4 shadow-md" style={{ background: 'linear-gradient(to right, #895F42, #9F8065)', color: '#E5EFF3' }}>
                Save up to 50% off
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#1F2D38' }}>
                Lounge Collection
              </h2>
              <p className="text-xl mb-8 leading-relaxed" style={{ color: '#1F2D38', opacity: 0.8 }}>
                Discover our exclusive lounge furniture collection designed for ultimate comfort and style.
              </p>
              <Link to="/products">
                <Button size="lg" className="transition-all duration-300 px-8 py-4 text-lg font-semibold">
                  Explore Category →
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-lg" style={{ borderLeft: '4px solid #895F42' }}>
                <img
                  src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&q=80"
                  alt="Elegant Sofa"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold mb-1" style={{ color: '#1F2D38' }}>Luxury Sofa Collection</h3>
                <p className="font-bold" style={{ color: '#895F42' }}>From ₹45,000</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-lg" style={{ borderLeft: '4px solid #9F8065' }}>
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80"
                  alt="Modern Chair"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold mb-1" style={{ color: '#1F2D38' }}>Designer Chairs</h3>
                <p className="font-bold" style={{ color: '#895F42' }}>From ₹12,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom, #ffffff, #E0EAF0)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#1F2D38' }}>What Our Customers Say</h2>
            <p className="text-lg" style={{ color: '#94A1AB' }}>Don't just take our word for it</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ border: '2px solid #BDD7EB' }}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5" style={{ color: '#9F8065' }} />
                ))}
              </div>
              <p className="mb-6 leading-relaxed italic" style={{ color: '#1F2D38' }}>"Excellent quality furniture! The sofa we bought is exactly as described. Very comfortable and looks amazing in our living room."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4" style={{ background: 'linear-gradient(to bottom right, #895F42, #9F8065)', color: '#E5EFF3' }}>R</div>
                <div>
                  <div className="font-semibold" style={{ color: '#1F2D38' }}>Rajesh Kumar</div>
                  <div className="text-sm" style={{ color: '#94A1AB' }}>Mumbai</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ border: '2px solid #BDD7EB' }}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5" style={{ color: '#9F8065' }} />
                ))}
              </div>
              <p className="mb-6 leading-relaxed italic" style={{ color: '#1F2D38' }}>"Great service and fast delivery! The team was very helpful in choosing the right furniture for our home. Highly recommended!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4" style={{ background: 'linear-gradient(to bottom right, #1F2D38, #94A1AB)', color: '#E5EFF3' }}>P</div>
                <div>
                  <div className="font-semibold" style={{ color: '#1F2D38' }}>Priya Sharma</div>
                  <div className="text-sm" style={{ color: '#94A1AB' }}>Delhi</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ border: '2px solid #BDD7EB' }}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5" style={{ color: '#9F8065' }} />
                ))}
              </div>
              <p className="mb-6 leading-relaxed italic" style={{ color: '#1F2D38' }}>"Amazing collection and affordable prices! We furnished our entire house from Samrat Agencies. Couldn't be happier!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4" style={{ background: 'linear-gradient(to bottom right, #895F42, #9F8065)', color: '#E5EFF3' }}>A</div>
                <div>
                  <div className="font-semibold" style={{ color: '#1F2D38' }}>Amit Patel</div>
                  <div className="text-sm" style={{ color: '#94A1AB' }}>Bangalore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured On Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#1F2D38' }}>Find Us Online</h2>
            <p style={{ color: '#94A1AB' }}>Rated 5.0 ★ with 108+ reviews across platforms</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <a
              href="https://www.google.com/maps/place/Samrat+Agencies"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center border-2" style={{ background: 'linear-gradient(to bottom right, #E0EAF0, #BDD7EB)', borderColor: '#BDD7EB' }}>
                <p className="text-lg font-bold mb-1 transition" style={{ color: '#1F2D38' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#1F2D38'}>Google</p>
                <p className="text-xs" style={{ color: '#94A1AB' }}>My Business</p>
              </div>
            </a>

            <a
              href="https://www.justdial.com/Bangalore/Samrat-Agencies-Near-Reliance-Fresh-Hongasandra/080P5169625_BZDET"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center border-2" style={{ background: 'linear-gradient(to bottom right, #E0EAF0, #BDD7EB)', borderColor: '#BDD7EB' }}>
                <p className="text-lg font-bold mb-1 transition" style={{ color: '#1F2D38' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#1F2D38'}>JustDial</p>
                <p className="text-xs" style={{ color: '#94A1AB' }}>4.9 Rating</p>
              </div>
            </a>

            <a
              href="https://magicpin.in/Bengaluru/Bommanahalli/Lifestyle/Samrat-Agencies-Dealer-Samsung-Furniture-Expert"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center border-2" style={{ background: 'linear-gradient(to bottom right, #E0EAF0, #BDD7EB)', borderColor: '#BDD7EB' }}>
                <p className="text-lg font-bold mb-1 transition" style={{ color: '#1F2D38' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#1F2D38'}>MagicPIN</p>
                <p className="text-xs" style={{ color: '#94A1AB' }}>Deals & Offers</p>
              </div>
            </a>

            <a
              href="https://www.facebook.com/SamratAgenciesHongasandra"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center border-2" style={{ background: 'linear-gradient(to bottom right, #E0EAF0, #BDD7EB)', borderColor: '#BDD7EB' }}>
                <p className="text-lg font-bold mb-1 transition" style={{ color: '#1F2D38' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#1F2D38'}>Facebook</p>
                <p className="text-xs" style={{ color: '#94A1AB' }}>70+ Followers</p>
              </div>
            </a>

            <a
              href="https://www.indiamart.com/samrat-agencies"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center border-2" style={{ background: 'linear-gradient(to bottom right, #E0EAF0, #BDD7EB)', borderColor: '#BDD7EB' }}>
                <p className="text-lg font-bold mb-1 transition" style={{ color: '#1F2D38' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#1F2D38'}>IndiaMART</p>
                <p className="text-xs" style={{ color: '#94A1AB' }}>B2B Catalog</p>
              </div>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
