import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail, MdLock } from 'react-icons/md';

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailNotVerified(false);
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      // Check if it's an email verification error
      if (result.emailNotVerified) {
        setEmailNotVerified(true);
        setUnverifiedEmail(result.email || formData.email);
        setShowVerificationModal(true); // Auto-open modal
      }
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    try {
      const response = await axios.post(`${API_URL}/auth/resend-verification-email`, {
        email: unverifiedEmail
      });

      if (response.data.success) {
        toast.success('Verification email sent! Please check your inbox.');
        setShowVerificationModal(false);
        setEmailNotVerified(false);
        setError('');
      }
    } catch (err) {
      if (err.response?.data?.alreadyVerified) {
        toast.success('Email already verified! You can login now.');
        setShowVerificationModal(false);
        setEmailNotVerified(false);
        setError('');
      } else {
        const errorMsg = err.response?.data?.message || 'Failed to resend email';
        toast.error(errorMsg);
      }
    } finally {
      setResendingEmail(false);
    }
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
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-sm opacity-80">Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold">10 Lakh+</p>
              <p className="text-sm opacity-80">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">29+</p>
              <p className="text-sm opacity-80">Years</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border" style={{ borderColor: '#D7B790' }}>
            {/* Logo/Brand inside card */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="/samrat-logo.png"
                  alt="Samrat Agencies"
                  className="h-16 w-auto"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#2F1A0F' }}>Welcome Back</h3>
              <p style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Login to continue your shopping journey</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 text-red-700 px-4 py-3 rounded mb-6" style={{ borderColor: '#816047' }}>
                <p className="text-sm">{error}</p>
                {emailNotVerified && (
                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="mt-2 text-xs font-semibold underline hover:no-underline"
                    style={{ color: '#816047' }}
                  >
                    Resend verification email
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdEmail className="h-5 w-5" style={{ color: 'rgba(129, 96, 71, 0.6)' }} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: '#E6CDB1' }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold" style={{ color: '#2F1A0F' }}>
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium transition-colors duration-200 hover:underline"
                    style={{ color: '#816047' }}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdLock className="h-5 w-5" style={{ color: 'rgba(129, 96, 71, 0.6)' }} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: '#E6CDB1' }}
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
                  <div className="w-full border-t" style={{ borderColor: '#E6CDB1' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white font-medium" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`${import.meta.env.VITE_API_URL}/auth/google`}
                  className="w-full inline-flex justify-center items-center px-6 py-3 border-2 rounded-xl text-base font-semibold hover:shadow-md transition-all duration-300"
                  style={{ borderColor: '#E6CDB1', color: '#2F1A0F', backgroundColor: '#ffffff' }}
                >
                  <FcGoogle className="w-6 h-6 mr-3" />
                  Continue with Google
                </a>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-bold transition-colors duration-200 hover:underline"
                  style={{ color: '#816047' }}
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#fff3cd' }}>
                <MdEmail className="w-8 h-8" style={{ color: '#92400e' }} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#2F1A0F' }}>
                Email Not Verified
              </h3>
              <p className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                Please verify your email to continue
              </p>
              <p className="text-base font-semibold mt-2" style={{ color: '#816047' }}>
                {unverifiedEmail}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dbeafe' }}>
                  <MdEmail className="w-4 h-4" style={{ color: '#1e40af' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2F1A0F' }}>Check your inbox</p>
                  <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    Look for the verification email we sent you
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dbeafe' }}>
                  <span className="text-sm font-bold" style={{ color: '#1e40af' }}>1</span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2F1A0F' }}>Click the verification link</p>
                  <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    The link expires in 24 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dbeafe' }}>
                  <span className="text-sm font-bold" style={{ color: '#1e40af' }}>2</span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2F1A0F' }}>Login after verification</p>
                  <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    Come back and login once verified
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#fff3cd', border: '1px solid #f59e0b' }}>
              <p className="text-xs text-center" style={{ color: '#92400e' }}>
                Didn't receive the email? Click below to send a new one
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={resendingEmail}
                className="w-full py-3 px-4 rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                style={{ backgroundColor: '#816047' }}
              >
                {resendingEmail ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </span>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
              <button
                onClick={() => setShowVerificationModal(false)}
                disabled={resendingEmail}
                className="w-full py-3 px-4 rounded-xl font-semibold transition-all border-2 disabled:opacity-50"
                style={{ borderColor: '#D7B790', color: '#816047' }}
              >
                Close
              </button>
            </div>

            <p className="text-xs text-center mt-4" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
              Check your spam folder or contact support if you need help
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
