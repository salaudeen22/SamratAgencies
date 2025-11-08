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
      <div className="bg-indigo-900 text-amber-50 py-2 text-center text-sm">
        <p>Free Delivery on orders over ₹5000. Don't miss discount. <span className="font-semibold underline cursor-pointer">Shop now</span></p>
      </div>

      {/* Hero Slider Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold rounded-full mb-4">
                On Demand
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                Wooden Classic <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Furniture</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed opacity-95 text-blue-50">
                Transform your living space with premium furniture. Quality craftsmanship meets timeless elegance.
              </p>
              <Link to="/products">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-xl px-8 py-4 text-lg font-semibold">
                  Explore Category →
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-20 rounded-3xl blur-3xl"></div>
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
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">500+</div>
              <div className="text-sm mt-2 opacity-90 text-blue-100">Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">5000+</div>
              <div className="text-sm mt-2 opacity-90 text-blue-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">15+</div>
              <div className="text-sm mt-2 opacity-90 text-blue-100">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">100%</div>
              <div className="text-sm mt-2 opacity-90 text-blue-100">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">Shop by Category</h2>
            <p className="text-gray-700 text-lg">Find exactly what you need for your home</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.name} to={category.link}>
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-orange-400">
                    <div className="flex justify-center items-center mb-4 text-indigo-700">
                      <IconComponent className="w-16 h-16" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Glass Morphism Gallery */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Collection</h2>
            <p className="text-blue-100 text-lg">Discover the perfect pieces for your home</p>
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
      <section className="py-12 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get offer up to 50% on modern furniture
            </h2>
            <p className="text-xl mb-6 text-amber-50">Free shipping for orders over ₹5000</p>
            <Link to="/products">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-amber-50 transition-all duration-300 px-10 py-4 text-lg font-semibold">
                Shop Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - Best Sellers */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-indigo-900 mb-2">Best Sellers</h2>
              <div className="flex gap-6 mt-4">
                <button className="text-lg font-semibold text-indigo-900 border-b-2 border-orange-500 pb-1">
                  Best sellers
                </button>
                <button className="text-lg text-gray-700 hover:text-indigo-900 pb-1">
                  New arrivals
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
              <p className="mt-6 text-gray-700 text-lg">Loading amazing products...</p>
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
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold rounded-full mb-4">
                Save up to 50% off
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Lounge Collection
              </h2>
              <p className="text-xl mb-8 text-blue-50 leading-relaxed">
                Discover our exclusive lounge furniture collection designed for ultimate comfort and style.
              </p>
              <Link to="/products">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-300 px-8 py-4 text-lg font-semibold">
                  Explore Category →
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 text-gray-900 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&q=80"
                  alt="Elegant Sofa"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold mb-1">Luxury Sofa Collection</h3>
                <p className="text-orange-600 font-bold">From ₹45,000</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-gray-900 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80"
                  alt="Modern Chair"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold mb-1">Designer Chairs</h3>
                <p className="text-orange-600 font-bold">From ₹12,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-700 text-lg">Don't just take our word for it</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-orange-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5 text-amber-500" />
                ))}
              </div>
              <p className="text-gray-800 mb-6 leading-relaxed italic">"Excellent quality furniture! The sofa we bought is exactly as described. Very comfortable and looks amazing in our living room."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold mr-4">R</div>
                <div>
                  <div className="font-semibold text-indigo-900">Rajesh Kumar</div>
                  <div className="text-sm text-gray-600">Mumbai</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-orange-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5 text-amber-500" />
                ))}
              </div>
              <p className="text-gray-800 mb-6 leading-relaxed italic">"Great service and fast delivery! The team was very helpful in choosing the right furniture for our home. Highly recommended!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold mr-4">P</div>
                <div>
                  <div className="font-semibold text-indigo-900">Priya Sharma</div>
                  <div className="text-sm text-gray-600">Delhi</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-orange-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5 text-amber-500" />
                ))}
              </div>
              <p className="text-gray-800 mb-6 leading-relaxed italic">"Amazing collection and affordable prices! We furnished our entire house from Samrat Agencies. Couldn't be happier!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold mr-4">A</div>
                <div>
                  <div className="font-semibold text-indigo-900">Amit Patel</div>
                  <div className="text-sm text-gray-600">Bangalore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500 opacity-20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-95 text-blue-50">
            Browse our complete collection and find the perfect pieces that match your style and budget
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/products">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-xl px-10 py-5 text-lg font-bold">
                Explore Collection →
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-2 border-orange-400 text-blue-50 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white transition-all duration-300 px-10 py-5 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
