import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });

      if (response.data.success) {
        setSuccess(true);
        setEmail('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
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

        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Reset Your Password</h1>
          <p className="text-lg opacity-90 mb-8">Enter your email address and we'll send you a link to reset your password.</p>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border" style={{ borderColor: '#BDD7EB' }}>
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="/samrat-logo.png"
                  alt="Samrat Agencies"
                  className="h-16 w-auto"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#1F2D38' }}>Forgot Password?</h3>
              <p className="text-sm" style={{ color: '#94A1AB' }}>
                No worries! Enter your email and we'll send you reset instructions.
              </p>
            </div>

            {success && (
              <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}>
                <p className="font-semibold mb-1">✓ Email Sent!</p>
                <p className="text-sm">Please check your email for password reset instructions. The link will expire in 1 hour.</p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }}>
                <p className="font-semibold mb-1">✗ Error</p>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    style={{ borderColor: '#BDD7EB' }}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 px-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#895F42' }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-medium transition-colors"
                style={{ color: '#895F42' }}
              >
                ← Back to Login
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm" style={{ color: '#94A1AB' }}>
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold transition-colors" style={{ color: '#895F42' }}>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
