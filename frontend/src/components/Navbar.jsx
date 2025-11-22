import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { categoryAPI } from '../services/api';
import logo from '../assets/samrat-logo.png';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        // Backend now returns hierarchical structure with top-level categories
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm" style={{ borderColor: '#E6CDB1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo with enhanced styling */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#816047] to-[#D7B790] rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <img src={logo} alt="Samrat Agencies" className="h-8 sm:h-10 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight bg-gradient-to-r from-[#2F1A0F] to-[#816047] bg-clip-text text-transparent">
                Samrat Agencies
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-widest uppercase" style={{ color: '#D7B790' }}>
                Since 1996
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-semibold tracking-wider uppercase transition-all duration-300 relative group py-2"
                style={{ color: isActive(link.path) ? '#816047' : '#2F1A0F' }}
              >
                <span className="relative z-10">{link.label}</span>
                {/* Animated underline */}
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ease-out"
                  style={{ backgroundColor: '#816047' }}
                ></span>
                {/* Active indicator */}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 animate-slide-in" style={{ backgroundColor: '#816047' }}></span>
                )}
                {/* Hover glow effect */}
                <span className="absolute inset-0 bg-[#E6CDB1] opacity-0 group-hover:opacity-10 rounded transition-opacity duration-300"></span>
              </Link>
            ))}

            {/* Shop with Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setIsShopMenuOpen(true)}
              onMouseLeave={() => setIsShopMenuOpen(false)}
            >
              <Link
                to="/products"
                className="text-sm font-semibold tracking-wider uppercase transition-all duration-300 relative group py-2 flex items-center gap-1"
                style={{ color: isActive('/products') ? '#816047' : '#2F1A0F' }}
              >
                <span className="relative z-10">Shop</span>
                <svg className={`w-3 h-3 transition-transform duration-300 ${isShopMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {/* Animated underline */}
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ease-out"
                  style={{ backgroundColor: '#816047' }}
                ></span>
                {/* Active indicator */}
                {isActive('/products') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#816047' }}></span>
                )}
                {/* Hover glow effect */}
                <span className="absolute inset-0 bg-[#E6CDB1] opacity-0 group-hover:opacity-10 rounded transition-opacity duration-300"></span>
              </Link>

              {/* Mega Menu Dropdown */}
              {isShopMenuOpen && categories.length > 0 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full pt-4 w-screen max-w-6xl z-50 animate-fade-in-up">
                  <div className="bg-white/98 backdrop-blur-lg rounded-2xl shadow-2xl border-2 p-8 relative overflow-hidden" style={{ borderColor: '#D7B790' }}>
                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E6CDB1]/20 to-transparent rounded-full blur-3xl"></div>
                    <div className="grid gap-8 relative z-10" style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 5)}, minmax(0, 1fr))` }}>
                      {categories.map((category, index) => (
                        <div
                          key={category._id}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <Link
                            to={`/products?category=${category.slug || category._id}`}
                            className="text-sm font-bold mb-4 uppercase tracking-wide block transition-all duration-300 group relative pb-2"
                            style={{ color: '#816047' }}
                          >
                            <span className="relative z-10">{category.name}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#816047] group-hover:w-full transition-all duration-300"></span>
                          </Link>
                          {category.children && category.children.length > 0 && (
                            <ul className="space-y-2.5">
                              {category.children.map((child) => (
                                <li key={child._id} className="group">
                                  <Link
                                    to={`/products?category=${child.slug || child._id}`}
                                    className="text-sm transition-all duration-300 flex items-center gap-2 py-1 px-2 -mx-2 rounded-md hover:bg-[#E6CDB1]/20"
                                    style={{ color: 'rgba(129, 96, 71, 0.7)' }}
                                  >
                                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span className="group-hover:translate-x-1 transition-transform duration-300 group-hover:text-[#816047]">
                                      {child.name}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4 sm:space-x-5 md:space-x-6">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative group">
              <div className="p-2 rounded-full transition-all duration-300 group-hover:bg-[#E6CDB1]/20 group-hover:scale-110">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 group-hover:text-[#ef4444]" style={{ color: '#2F1A0F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              {getWishlistCount() > 0 && (
                <span className="absolute top-0 right-0 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse" style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '10px' }}>
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <div className="p-2 rounded-full transition-all duration-300 group-hover:bg-[#E6CDB1]/30 group-hover:scale-110">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 group-hover:text-[#816047]" style={{ color: '#2F1A0F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse bg-gradient-to-r from-[#816047] to-[#D7B790]" style={{ color: 'white', fontSize: '10px' }}>
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-1.5"
                  style={{ color: '#2F1A0F' }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: '#E6CDB1', color: '#816047' }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-10 w-44 bg-white rounded-md shadow-lg py-1 border" style={{ borderColor: '#E6CDB1' }}>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm transition-colors"
                      style={{ color: '#2F1A0F' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6CDB1'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm transition-colors"
                        style={{ color: '#816047' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6CDB1'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/login" className="text-sm font-medium" style={{ color: '#2F1A0F' }}>
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium px-4 py-1.5 rounded-sm transition-colors" style={{ backgroundColor: '#816047', color: 'white' }}>
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setExpandedCategory(null); // Reset expanded category when toggling menu
              }}
              className="md:hidden"
              style={{ color: '#2F1A0F' }}
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t" style={{ borderColor: '#E6CDB1' }}>
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 text-sm font-medium tracking-wide uppercase"
                style={{
                  color: isActive(link.path) ? '#816047' : '#2F1A0F'
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Shop Link with Categories */}
            <div className="pt-3 mt-3" style={{ borderTop: '1px solid #E6CDB1' }}>
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 text-sm font-medium tracking-wide uppercase"
                style={{
                  color: isActive('/products') ? '#816047' : '#2F1A0F'
                }}
              >
                Shop
              </Link>

              {/* Mobile Categories */}
              {categories.length > 0 && (
                <div className="pl-4 mt-2 space-y-2">
                  {categories.map((category) => (
                    <div key={category._id}>
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/products?category=${category.slug || category._id}`}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setExpandedCategory(null);
                          }}
                          className="block py-1.5 text-xs font-semibold uppercase flex-1"
                          style={{ color: '#816047' }}
                        >
                          {category.name}
                        </Link>
                        {category.children && category.children.length > 0 && (
                          <button
                            onClick={() => setExpandedCategory(expandedCategory === category._id ? null : category._id)}
                            className="p-1"
                            style={{ color: '#816047' }}
                          >
                            <svg
                              className={`w-4 h-4 transition-transform ${expandedCategory === category._id ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>
                      {category.children && category.children.length > 0 && expandedCategory === category._id && (
                        <div className="pl-3 space-y-1 mt-1">
                          {category.children.map((child) => (
                            <Link
                              key={child._id}
                              to={`/products?category=${child.slug || child._id}`}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setExpandedCategory(null);
                              }}
                              className="block py-1 text-xs"
                              style={{ color: 'rgba(129, 96, 71, 0.6)' }}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 mt-3 space-y-1" style={{ borderTop: '1px solid #E6CDB1' }}>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 text-sm"
                    style={{ color: '#2F1A0F' }}
                  >
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2.5 text-sm"
                      style={{ color: '#816047' }}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2.5 text-sm text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 text-sm"
                    style={{ color: '#2F1A0F' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 text-sm text-center mt-2 rounded-md"
                    style={{ backgroundColor: '#816047', color: 'white' }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
