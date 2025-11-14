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
    <nav className="bg-white border-b sticky top-0 z-50" style={{ borderColor: '#E0EAF0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2">
            <img src={logo} alt="Samrat Agencies" className="h-6 sm:h-8 w-auto" />
            <span className="text-sm sm:text-base lg:text-lg font-semibold tracking-tight" style={{ color: '#1F2D38' }}>Samrat Agencies</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium tracking-wide uppercase transition-colors relative group"
                style={{ color: isActive(link.path) ? '#895F42' : '#1F2D38' }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: '#895F42' }}
                ></span>
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#895F42' }}></span>
                )}
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
                className="text-sm font-medium tracking-wide uppercase transition-colors relative group"
                style={{ color: isActive('/products') ? '#895F42' : '#1F2D38' }}
              >
                Shop
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: '#895F42' }}
                ></span>
                {isActive('/products') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: '#895F42' }}></span>
                )}
              </Link>

              {/* Mega Menu Dropdown */}
              {isShopMenuOpen && categories.length > 0 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full pt-4 w-screen max-w-6xl z-50">
                  <div className="bg-white rounded-lg shadow-2xl border p-8" style={{ borderColor: '#E0EAF0' }}>
                    <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 5)}, minmax(0, 1fr))` }}>
                      {categories.map((category) => (
                        <div key={category._id}>
                          <Link
                            to={`/products?category=${category._id}`}
                            className="text-sm font-bold mb-4 uppercase tracking-wide block transition-colors"
                            style={{ color: '#895F42' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#9F8065'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#895F42'}
                          >
                            {category.name}
                          </Link>
                          {category.children && category.children.length > 0 && (
                            <ul className="space-y-2">
                              {category.children.map((child) => (
                                <li key={child._id}>
                                  <Link
                                    to={`/products?category=${child._id}`}
                                    className="text-sm transition-colors block"
                                    style={{ color: '#94A1AB' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#94A1AB'}
                                  >
                                    {child.name}
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
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative group">
              <svg className="w-5 h-5 sm:w-5 sm:h-5 transition-colors" style={{ color: '#1F2D38' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold" style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '10px' }}>
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <svg className="w-5 h-5 sm:w-5 sm:h-5 transition-colors" style={{ color: '#1F2D38' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold" style={{ backgroundColor: '#895F42', color: 'white', fontSize: '10px' }}>
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
                  style={{ color: '#1F2D38' }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: '#E0EAF0', color: '#895F42' }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-10 w-44 bg-white rounded-md shadow-lg py-1 border" style={{ borderColor: '#E0EAF0' }}>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm transition-colors"
                      style={{ color: '#1F2D38' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm transition-colors"
                        style={{ color: '#895F42' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
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
                <Link to="/login" className="text-sm font-medium" style={{ color: '#1F2D38' }}>
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium px-4 py-1.5 rounded-sm transition-colors" style={{ backgroundColor: '#1F2D38', color: 'white' }}>
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
              style={{ color: '#1F2D38' }}
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
        <div className="md:hidden bg-white border-t" style={{ borderColor: '#E0EAF0' }}>
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 text-sm font-medium tracking-wide uppercase"
                style={{
                  color: isActive(link.path) ? '#895F42' : '#1F2D38'
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Shop Link with Categories */}
            <div className="pt-3 mt-3" style={{ borderTop: '1px solid #E0EAF0' }}>
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 text-sm font-medium tracking-wide uppercase"
                style={{
                  color: isActive('/products') ? '#895F42' : '#1F2D38'
                }}
              >
                Shop
              </Link>

              {/* Mobile Categories */}
              {categories.length > 0 && (
                <div className="pl-4 mt-2 space-y-2">
                  {categories.map((category) => (
                    <div key={category._id}>
                      <Link
                        to={`/products?category=${category._id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 text-xs font-semibold uppercase"
                        style={{ color: '#895F42' }}
                      >
                        {category.name}
                      </Link>
                      {category.children && category.children.length > 0 && (
                        <div className="pl-3 space-y-1">
                          {category.children.map((child) => (
                            <Link
                              key={child._id}
                              to={`/products?category=${child._id}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-1 text-xs"
                              style={{ color: '#94A1AB' }}
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

            <div className="pt-3 mt-3 space-y-1" style={{ borderTop: '1px solid #E0EAF0' }}>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 text-sm"
                    style={{ color: '#1F2D38' }}
                  >
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2.5 text-sm"
                      style={{ color: '#895F42' }}
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
                    style={{ color: '#1F2D38' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 text-sm text-center mt-2 rounded-md"
                    style={{ backgroundColor: '#1F2D38', color: 'white' }}
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
