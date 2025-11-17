import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail, MdLock, MdClose, MdPerson, MdPhone } from 'react-icons/md';

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(loginData.email, loginData.password);

    if (result.success) {
      toast.success('Login successful!');
      onClose();
      setLoginData({ email: '', password: '' });
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(registerData);

    if (result.success) {
      toast.success('Registration successful!');
      onClose();
      setRegisterData({ name: '', email: '', password: '', phone: '' });
    } else {
      setError(result.error || 'Registration failed');
    }

    setLoading(false);
  };

  const handleGoogleAuth = () => {
    // Store the current page to redirect back after login
    localStorage.setItem('authRedirect', window.location.pathname);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with Blur */}
      <div
        className="fixed inset-0 backdrop-blur-md bg-white/10 transition-all duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="/samrat-logo.png"
                  alt="Samrat Agencies"
                  className="h-14 w-auto"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#2F1A0F' }}>
                {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                {activeTab === 'login'
                  ? 'Login to add items to cart and checkout'
                  : 'Join us to start shopping'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setError('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition-all ${
                  activeTab === 'login'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'login' ? { color: '#816047' } : {}}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setError('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition-all ${
                  activeTab === 'register'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'register' ? { color: '#816047' } : {}}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 text-red-700 px-4 py-3 rounded mb-6" style={{ borderColor: '#816047' }}>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdEmail className="h-5 w-5" style={{ color: 'rgba(129, 96, 71, 0.6)' }} />
                    </div>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: '#E6CDB1' }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdLock className="h-5 w-5" style={{ color: 'rgba(129, 96, 71, 0.6)' }} />
                    </div>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: '#E6CDB1' }}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 hover:shadow-lg"
                  style={{ backgroundColor: '#816047' }}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdPerson className="h-5 w-5" style={{ color: 'rgba(129, 96, 71, 0.6)' }} />
                    </div>
                    <input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: '#E6CDB1' }}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdEmail className="h-5 w-5" style={{ color: 'rgba(129, 96, 71, 0.6)' }} />
                    </div>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: '#E6CDB1' }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdPhone className="h-5 w-5" style={{ color: 'rgba(129, 96, 71, 0.6)' }} />
                    </div>
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: '#E6CDB1' }}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdLock className="h-5 w-5" style={{ color: 'rgba(129, 96, 71, 0.6)' }} />
                    </div>
                    <input
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{ borderColor: '#E6CDB1' }}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 hover:shadow-lg"
                  style={{ backgroundColor: '#816047' }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: '#E6CDB1' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white font-medium" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <div className="mt-4">
                <button
                  onClick={handleGoogleAuth}
                  type="button"
                  className="w-full inline-flex justify-center items-center px-6 py-3 border-2 rounded-lg text-base font-semibold hover:shadow-md transition-all duration-300"
                  style={{ borderColor: '#E6CDB1', color: '#2F1A0F', backgroundColor: '#ffffff' }}
                >
                  <FcGoogle className="w-5 h-5 mr-3" />
                  Continue with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
