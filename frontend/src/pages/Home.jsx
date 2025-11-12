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
    { name: 'Sofas', icon: GiSofa, link: '/products?category=69134da33c6b5d0f9ef0f2fa' }, // Sofas & Sofa Sets
    { name: 'Beds', icon: MdOutlineBedroomParent, link: '/products?category=69134fa33c6b5d0f9ef0f36f' }, // Beds
    { name: 'Dining', icon: MdTableRestaurant, link: '/products?category=691352b863378e6200012b11' }, // Dining Room Furniture
    { name: 'Office', icon: MdChair, link: '/products?category=6913533b63378e6200012b48' }, // Office & Study Furniture
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
        title="Samrat Agencies - Furniture Made for Real Life | Bangalore"
        description="Beautiful furniture designed for the way you live. Thoughtfully crafted, honestly priced. From first apartment to forever home—trusted since 1991. Shop sofas, beds, dining tables & more."
        keywords="affordable furniture bangalore, quality furniture, home furniture, modern furniture, samrat agencies, sofas, beds, dining tables, furniture store"
        url="/"
        type="website"
      />
      <div className="min-h-screen" style={{ backgroundColor: '#E5EFF2' }}>
      {/* Original Hero Section */}
      <section className="relative overflow-hidden bg-[#E5EFF2] md:bg-transparent h-[80vh] flex items-center">
        {/* Desktop only: Reversed Golden Ratio split (62:38) */}
        <div className="absolute inset-0 hidden md:block" style={{
          background: 'linear-gradient(to right, #1F2D38 0%, #1F2D38 62%, #E5EFF2 62%, #E5EFF2 100%)'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left">
              <span className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full mb-3 sm:mb-4 shadow-md" style={{ backgroundColor: '#895F42', color: '#FFFFFF' }}>Your Home Deserves This</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight" style={{ color: '#FFFFFF' }}>
                Furniture Made for <span className="font-black" style={{ color: '#C97B63' }}>Real Life</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed font-medium" style={{ color: '#FFFFFF', opacity: 0.9 }}>
                Beautiful pieces designed for the way you live. Thoughtfully crafted, honestly priced, and built to be part of your everyday moments.
              </p>
              <Link to="/products">
                <Button size="lg">Find Your Perfect Piece</Button>
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
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 sm:py-12 md:py-16" style={{ backgroundColor: '#E5EFF2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#1F2D38' }}>Everything Your Home Needs</h2>
            <p className="text-base sm:text-lg" style={{ color: '#94A1AB' }}>From cozy corners to statement pieces, we've got you covered</p>
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1F2D38' }}>Loved by Thousands</h2>
              <p className="text-base sm:text-lg" style={{ color: '#94A1AB' }}>Pieces that make a house feel like home</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" style={{ borderColor: '#895F42' }}></div>
              <p className="mt-6 text-lg" style={{ color: '#94A1AB' }}>Finding your next favorite piece...</p>
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

      {/* Stats Banner */}
      <section className="py-6 sm:py-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #BDD7EB 0%, #E5EFF2 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute top-3 left-3 w-16 h-16 rounded-full opacity-20" style={{ backgroundColor: '#895F42' }}></div>
        <div className="absolute bottom-3 right-3 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: '#C97B63' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-0.5" style={{ color: '#1F2D38' }}>The Numbers Speak</h2>
            <p className="text-xs" style={{ color: '#1F2D38', opacity: 0.7 }}>Your trust is our greatest achievement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {/* Stat 1 */}
            <div className="text-center bg-white rounded-lg p-3 sm:p-4 shadow-md transform hover:scale-105 transition-all duration-300">
              <div className="text-xl sm:text-2xl md:text-3xl font-black mb-0.5" style={{ color: '#895F42' }}>30+</div>
              <div className="text-sm sm:text-base font-bold mb-0.5" style={{ color: '#1F2D38' }}>Years of Trust</div>
              <p className="text-xs" style={{ color: '#94A1AB' }}>Since 1991</p>
            </div>

            {/* Stat 2 */}
            <div className="text-center bg-white rounded-lg p-3 sm:p-4 shadow-md transform hover:scale-105 transition-all duration-300">
              <div className="text-xl sm:text-2xl md:text-3xl font-black mb-0.5" style={{ color: '#895F42' }}>5000+</div>
              <div className="text-sm sm:text-base font-bold mb-0.5" style={{ color: '#1F2D38' }}>Happy Customers</div>
              <p className="text-xs" style={{ color: '#94A1AB' }}>Homes beautiful</p>
            </div>

            {/* Stat 3 */}
            <div className="text-center bg-white rounded-lg p-3 sm:p-4 shadow-md transform hover:scale-105 transition-all duration-300">
              <div className="text-xl sm:text-2xl md:text-3xl font-black mb-0.5" style={{ color: '#895F42' }}>500+</div>
              <div className="text-sm sm:text-base font-bold mb-0.5" style={{ color: '#1F2D38' }}>Quality Products</div>
              <p className="text-xs" style={{ color: '#94A1AB' }}>Curated collection</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#E5EFF2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1F2D38' }}>Just Arrived</h2>
              <p className="text-base sm:text-lg" style={{ color: '#94A1AB' }}>Fresh styles to refresh your space</p>
            </div>
            <Link to="/products?sort=newest">
              <button className="mt-4 sm:mt-0 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md" style={{ backgroundColor: '#895F42', color: '#E5EFF3' }}>
                View All New
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" style={{ borderColor: '#895F42' }}></div>
              <p className="mt-6 text-lg" style={{ color: '#94A1AB' }}>Loading new arrivals...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.slice(0, 4).map((product) => (
                  <div key={product._id} className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <span className="inline-block px-3 py-1 text-xs font-bold rounded-full shadow-md" style={{ backgroundColor: '#C97B63', color: '#FFFFFF' }}>
                        NEW
                      </span>
                    </div>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Partner Brands Section */}
      <section className="py-8 sm:py-12 md:py-16 overflow-hidden" style={{ backgroundColor: '#E0EAF0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1F2D38' }}>Brands You Know & Love</h2>
            <p className="text-base sm:text-lg" style={{ color: '#94A1AB' }}>Quality names you can trust, all in one place</p>
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
                  Take It Home Today
                </button>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Premium Card Layout Section */}
      <section className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#E5EFF2' }}>
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
                  Tables That Bring Everyone Together
                </h2>
                <Link to="/products?category=table">
                  <button className="px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-xl" style={{ backgroundColor: '#1F2D38', color: '#E5EFF3' }}>
                    Shop Tables
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
                      Add Your Personal Touch
                    </h3>
                    <Link to="/products">
                      <button className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-md" style={{ backgroundColor: '#1F2D38', color: '#E5EFF3' }}>
                        Shop Decor
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
                      Sleep Better, Live Better
                    </h3>
                    <Link to="/products?category=bed">
                      <button className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-md" style={{ backgroundColor: '#1F2D38', color: '#E5EFF3' }}>
                        Shop Beds
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 sm:py-12 md:py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#1F2D38' }}>Real Homes, Real Stories</h2>
            <p className="text-base sm:text-lg" style={{ color: '#94A1AB' }}>Hear from families who found their perfect fit</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ border: '2px solid #BDD7EB' }}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5" style={{ color: '#9F8065' }} />
                ))}
              </div>
              <p className="mb-6 leading-relaxed italic" style={{ color: '#1F2D38' }}>"We didn't think we could afford a sofa this beautiful! It's become the heart of our living room where the family gathers every evening. Worth every rupee."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4" style={{ backgroundColor: '#895F42', color: '#E5EFF3' }}>R</div>
                <div>
                  <div className="font-semibold" style={{ color: '#1F2D38' }}>Rajesh Kumar</div>
                  <div className="text-sm" style={{ color: '#94A1AB' }}>Mumbai • Young Family</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ border: '2px solid #BDD7EB' }}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5" style={{ color: '#9F8065' }} />
                ))}
              </div>
              <p className="mb-6 leading-relaxed italic" style={{ color: '#1F2D38' }}>"Setting up our first home felt overwhelming until we found Samrat. The team understood exactly what we needed and made it so easy. Our bedroom looks straight out of a magazine!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4" style={{ backgroundColor: '#1F2D38', color: '#E5EFF3' }}>P</div>
                <div>
                  <div className="font-semibold" style={{ color: '#1F2D38' }}>Priya Sharma</div>
                  <div className="text-sm" style={{ color: '#94A1AB' }}>Delhi • First Home</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ border: '2px solid #BDD7EB' }}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5" style={{ color: '#9F8065' }} />
                ))}
              </div>
              <p className="mb-6 leading-relaxed italic" style={{ color: '#1F2D38' }}>"Three years later, our dining table still looks brand new. Quality that lasts is rare these days. We've recommended Samrat to all our friends—they're family now!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4" style={{ backgroundColor: '#895F42', color: '#E5EFF3' }}>A</div>
                <div>
                  <div className="font-semibold" style={{ color: '#1F2D38' }}>Amit Patel</div>
                  <div className="text-sm" style={{ color: '#94A1AB' }}>Bangalore • Loyal Customer</div>
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
