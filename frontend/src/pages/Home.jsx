import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { MdChair, MdOutlineBedroomParent, MdTableRestaurant } from 'react-icons/md';
import { GiSofa } from 'react-icons/gi';
import { FaStar } from 'react-icons/fa';
import century from '../assets/brand/centuray.png';
import godrej from '../assets/brand/Gemini_Generated_Image_81baro81baro81ba-removebg-preview.png';
import duroflex from '../assets/brand/duroflex.png';
import kurlon from '../assets/brand/kurlon.png';
import restolex from '../assets/brand/restolex.png';
import sleepwell from '../assets/brand/sleepweel.png';
import wakefit from '../assets/brand/wakefir.png';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState('Furniture');

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

  const categoryGroups = {
    'Furniture': [
      { label: 'Modern chair', path: '/products?category=modern-chair' },
      { label: 'Luxurious sofa', path: '/products?category=luxurious-sofa' },
      { label: 'Sitting tables', path: '/products?category=sitting-tables' },
      { label: 'Century cabinet', path: '/products?category=century-cabinet' },
      { label: 'Wooden stool', path: '/products?category=wooden-stool' },
      { label: 'Dining table', path: '/products?category=dining-table' },
    ],
    'Lighting': [
      { label: 'Table lamps', path: '/products?category=table-lamps' },
      { label: 'Wall lights', path: '/products?category=wall-lights' },
      { label: 'Ceiling lights', path: '/products?category=ceiling-lights' },
      { label: 'Chandeliers', path: '/products?category=chandeliers' },
      { label: 'Smart lights', path: '/products?category=smart-lights' },
      { label: 'Outdoor lights', path: '/products?category=outdoor-lights' },
    ],
    'Decor': [
      { label: 'Home decor', path: '/products?category=home-decor' },
      { label: 'Kitchen decor', path: '/products?category=kitchen-decor' },
      { label: 'Office decor', path: '/products?category=office-decor' },
      { label: 'Wooden mirrors', path: '/products?category=wooden-mirrors' },
      { label: 'Designer clocks', path: '/products?category=designer-clocks' },
      { label: 'Spiritual', path: '/products?category=spiritual' },
    ],
    'Cabinetry': [
      { label: 'Wardrobes', path: '/products?category=wardrobes' },
      { label: 'Shoe racks', path: '/products?category=shoe-racks' },
      { label: 'Movable', path: '/products?category=movable' },
      { label: 'Folding storage', path: '/products?category=folding-storage' },
      { label: 'Wooden units', path: '/products?category=wooden-units' },
      { label: 'Kids storage', path: '/products?category=kids-storage' },
    ],
    'Commercial': [
      { label: 'Hotel furniture', path: '/products?category=hotel-furniture' },
      { label: 'Bar furniture', path: '/products?category=bar-furniture' },
      { label: 'School furniture', path: '/products?category=school-furniture' },
      { label: 'Public furniture', path: '/products?category=public-furniture' },
      { label: 'Office furniture', path: '/products?category=office-furniture' },
      { label: 'Lab furniture', path: '/products?category=lab-furniture' },
    ],
  };

  return (
    <>
      <SEO
        title="Samrat Agencies - Furniture Expert | Samsung Dealer | Bangalore"
        description="Samrat Agencies - Premium Furniture & Samsung Dealer in Bangalore. Established 1991. Rated 5.0★ with 108+ reviews. Shop sofas, beds, dining tables & more."
        keywords="furniture bangalore, samsung dealer, premium furniture, home furniture, office furniture, samrat agencies, sofas, beds, dining tables"
        url="/"
        type="website"
      />
      <div className="min-h-screen" style={{ backgroundColor: '#fafaf9' }}>
      {/* Original Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: '#E5EFF3' }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left">
              <span className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full mb-3 sm:mb-4 shadow-md" style={{ backgroundColor: '#895F42', color: '#E5EFF3' }}>On Demand</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight" style={{ color: '#1F2D38' }}>
                Wooden Classic <span className="font-black" style={{ color: '#895F42' }}>Furniture</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed font-medium" style={{ color: '#1F2D38', opacity: 0.8 }}>
                Transform your living space with premium furniture. Quality craftsmanship meets timeless elegance.
              </p>
              <Link to="/products">
                <Button size="lg">Explore Category →</Button>
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
                  alt="Premium Furniture"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg text-center border-2" style={{ borderColor: '#BDD7EB' }}>
                  <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#895F42' }}>500+</p>
                  <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>Products</p>
                </div>
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg text-center border-2" style={{ borderColor: '#BDD7EB' }}>
                  <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#895F42' }}>5000+</p>
                  <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>Happy Customers</p>
                </div>
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg text-center border-2" style={{ borderColor: '#BDD7EB' }}>
                  <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#895F42' }}>15+</p>
                  <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>Years Experience</p>
                </div>
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg text-center border-2" style={{ borderColor: '#BDD7EB' }}>
                  <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#895F42' }}>100%</p>
                  <p className="text-xs sm:text-sm" style={{ color: '#94A1AB' }}>Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Brands Section */}
      <section className="py-8 sm:py-12 md:py-16 overflow-hidden" style={{ backgroundColor: '#E0EAF0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1F2D38' }}>Our Trusted Partners</h2>
            <p className="text-base sm:text-lg" style={{ color: '#94A1AB' }}>Premium brands we work with</p>
          </div>

          {/* Auto-scrolling carousel */}
          <div className="relative">
            <style>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-scroll {
                animation: scroll 30s linear infinite;
              }
              .animate-scroll:hover {
                animation-play-state: paused;
              }
            `}</style>

            <div className="flex animate-scroll">
              {/* First set of logos */}
              <div className="flex gap-12 px-6">
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={duroflex} alt="Duroflex" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={century} alt="Century" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={restolex} alt="Restolex" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={sleepwell} alt="Sleepwell" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={godrej} alt="Godrej" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={kurlon} alt="Kurlon" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={wakefit} alt="Wakefit" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex gap-12 px-6">
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={duroflex} alt="Duroflex" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={century} alt="Century" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={restolex} alt="Restolex" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={sleepwell} alt="Sleepwell" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={godrej} alt="Godrej" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={kurlon} alt="Kurlon" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
                <div className="flex items-center justify-center h-32 w-52 shrink-0 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <img src={wakefit} alt="Wakefit" className="h-24 w-44 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 sm:py-12 md:py-16" style={{ backgroundColor: '#fafaf9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#1F2D38' }}>Shop by Category</h2>
            <p className="text-base sm:text-lg" style={{ color: '#94A1AB' }}>Find exactly what you need for your home</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.name} to={category.link}>
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer border-2" style={{ borderColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                    <div className="flex justify-center items-center mb-2 sm:mb-4" style={{ color: '#895F42' }}>
                      <IconComponent className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#1F2D38' }}>{category.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products - Best Sellers */}
      <section className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1F2D38' }}>Best Sellers</h2>
              <div className="flex gap-4 sm:gap-6 mt-3 sm:mt-4">
                <button className="text-sm sm:text-base md:text-lg font-semibold pb-1 border-b-2" style={{ color: '#1F2D38', borderColor: '#895F42' }}>
                  Best sellers
                </button>
                <button className="text-sm sm:text-base md:text-lg pb-1" style={{ color: '#94A1AB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#1F2D38'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A1AB'}>
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

      {/* Bajaj Finserv Banner */}
      <section className="py-4" style={{ backgroundColor: '#E0EAF0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-4 border" style={{ borderColor: '#895F42' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">

              {/* Logo */}
              <div className="flex items-center gap-4">
                <img
                  src="https://storage.googleapis.com/ck-prod/logo-2024-11-07-174515-e68da450-b76b-4e67-b2c5-88225fbd5a14.jpg"
                  alt="Bajaj Finserv"
                  className="h-8 object-contain"
                />
                <div className="h-8 w-px" style={{ backgroundColor: '#BDD7EB' }}></div>
                <div>
                  <p className="text-lg md:text-xl font-black" style={{ color: '#895F42' }}>₹0 Down Payment</p>
                  <p className="text-xs" style={{ color: '#94A1AB' }}>*T&C apply</p>
                </div>
              </div>

              {/* CTA */}
              <Link to="/products">
                <button className="px-6 py-2 text-sm font-bold rounded-full shadow-md transition-all duration-300 hover:scale-105 whitespace-nowrap" style={{ backgroundColor: '#895F42', color: '#E5EFF3' }}>
                  Shop with Easy EMI →
                </button>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#1F2D38' }}>What Our Customers Say</h2>
            <p className="text-base sm:text-lg" style={{ color: '#94A1AB' }}>Don't just take our word for it</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ border: '2px solid #BDD7EB' }}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5" style={{ color: '#9F8065' }} />
                ))}
              </div>
              <p className="mb-6 leading-relaxed italic" style={{ color: '#1F2D38' }}>"Excellent quality furniture! The sofa we bought is exactly as described. Very comfortable and looks amazing in our living room."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4" style={{ backgroundColor: '#895F42', color: '#E5EFF3' }}>R</div>
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
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4" style={{ backgroundColor: '#1F2D38', color: '#E5EFF3' }}>P</div>
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
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4" style={{ backgroundColor: '#895F42', color: '#E5EFF3' }}>A</div>
                <div>
                  <div className="font-semibold" style={{ color: '#1F2D38' }}>Amit Patel</div>
                  <div className="text-sm" style={{ color: '#94A1AB' }}>Bangalore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Card Layout Section */}
      <section className="py-8 sm:py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

            {/* Large Left Card */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg group cursor-pointer h-[400px] sm:h-[500px] md:h-[600px]">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85"
                alt="Wooden classic table"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
                  Wooden classic table
                </h2>
                <Link to="/products?category=table">
                  <button className="px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-xl" style={{ backgroundColor: '#1F2D38', color: '#E5EFF3' }}>
                    Explore category
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Side - Two Stacked Cards */}
            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">

              {/* Top Card - Pottery Products */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg group cursor-pointer h-[200px] sm:h-[250px] md:h-[290px]" style={{ backgroundColor: '#E0EAF0' }}>
                <div className="grid grid-cols-2 h-full items-center">
                  <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 sm:mb-4 md:mb-6 leading-tight" style={{ color: '#1F2D38' }}>
                      Pottery products
                    </h3>
                    <Link to="/products">
                      <button className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-md" style={{ backgroundColor: '#1F2D38', color: '#E5EFF3' }}>
                        Explore category
                      </button>
                    </Link>
                  </div>
                  <div className="h-full relative">
                    <img
                      src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=85"
                      alt="Pottery products"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Card - Florence Compact */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg group cursor-pointer h-[200px] sm:h-[250px] md:h-[290px]" style={{ backgroundColor: '#f5f5f4' }}>
                <div className="grid grid-cols-2 h-full items-center">
                  <div className="h-full relative">
                    <img
                      src="https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=85"
                      alt="Florence compact"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 sm:mb-4 md:mb-6 leading-tight" style={{ color: '#1F2D38' }}>
                      Florence compact
                    </h3>
                    <Link to="/products?category=bed">
                      <button className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-md" style={{ backgroundColor: '#1F2D38', color: '#E5EFF3' }}>
                        Explore category
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
    </>
  );
};

export default Home;
