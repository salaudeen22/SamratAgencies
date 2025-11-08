import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/samrat-logo.png';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src={logo} alt="Samrat Agencies" className="h-10 w-auto" />
            <span className="text-xl font-bold" style={{ color: '#1F2D38' }}>Samrat Agencies</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="font-medium transition"
                style={{ color: isActive(link.path) ? '#895F42' : '#94A1AB' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'}
                onMouseLeave={(e) => e.currentTarget.style.color = isActive(link.path) ? '#895F42' : '#94A1AB'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <svg className="w-6 h-6 transition" style={{ color: '#94A1AB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A1AB'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold" style={{ backgroundColor: '#895F42', color: '#E5EFF3' }}>
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3 relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 transition"
                  style={{ color: '#94A1AB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94A1AB'}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#895F42', color: '#E5EFF3' }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span>{user?.name || 'Profile'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl py-2" style={{ border: '1px solid #BDD7EB' }}>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 transition"
                      style={{ color: '#1F2D38' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E0EAF0'; e.currentTarget.style.color = '#895F42'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1F2D38'; }}
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="font-medium transition" style={{ color: '#94A1AB' }} onMouseEnter={(e) => e.currentTarget.style.color = '#895F42'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A1AB'}>
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-md transition" style={{ backgroundColor: '#895F42', color: '#E5EFF3' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9F8065'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#895F42'}>
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
              style={{ color: '#94A1AB' }}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white" style={{ borderTop: '1px solid #BDD7EB' }}>
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 px-3 rounded font-semibold"
                style={{
                  backgroundColor: isActive(link.path) ? '#E0EAF0' : 'transparent',
                  color: isActive(link.path) ? '#895F42' : '#1F2D38'
                }}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2" style={{ borderTop: '1px solid #BDD7EB' }}>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded"
                    style={{ color: '#1F2D38' }}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-3 rounded text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded"
                    style={{ color: '#1F2D38' }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded text-center"
                    style={{ backgroundColor: '#895F42', color: '#E5EFF3' }}
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
