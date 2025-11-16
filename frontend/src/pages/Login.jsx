import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail, MdLock } from 'react-icons/md';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#fafaf9' }}>
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80"
          alt="Luxury Furniture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent" style={{ backgroundColor: 'rgba(137, 95, 66, 0.4)' }}></div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Samrat Agencies</h1>
          <p className="text-lg opacity-90 mb-8">Transform your living space with premium furniture. Quality craftsmanship meets timeless elegance.</p>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm opacity-80">Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold">5000+</p>
              <p className="text-sm opacity-80">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">15+</p>
              <p className="text-sm opacity-80">Years</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border" style={{ borderColor: '#BDD7EB' }}>
            {/* Logo/Brand inside card */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="/samrat-logo.png"
                  alt="Samrat Agencies"
                  className="h-16 w-auto"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#1F2D38' }}>Welcome Back</h3>
              <p style={{ color: '#94A1AB' }}>Login to continue your shopping journey</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 text-red-700 px-4 py-3 rounded mb-6" style={{ borderColor: '#895F42' }}>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2D38' }}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdEmail className="h-5 w-5" style={{ color: '#94A1AB' }} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: '#E0EAF0' }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold" style={{ color: '#1F2D38' }}>
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium transition-colors duration-200 hover:underline"
                    style={{ color: '#895F42' }}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdLock className="h-5 w-5" style={{ color: '#94A1AB' }} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: '#E0EAF0' }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: '#E0EAF0' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white font-medium" style={{ color: '#94A1AB' }}>Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`${import.meta.env.VITE_API_URL}/auth/google`}
                  className="w-full inline-flex justify-center items-center px-6 py-3 border-2 rounded-xl text-base font-semibold hover:shadow-md transition-all duration-300"
                  style={{ borderColor: '#E0EAF0', color: '#1F2D38', backgroundColor: '#ffffff' }}
                >
                  <FcGoogle className="w-6 h-6 mr-3" />
                  Continue with Google
                </a>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm" style={{ color: '#94A1AB' }}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-bold transition-colors duration-200 hover:underline"
                  style={{ color: '#895F42' }}
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
