import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MdLock } from 'react-icons/md';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password: formData.password
      });

      if (response.data.success) {
        setSuccess(true);

        // If JWT token is returned, store it
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
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
          <h1 className="text-4xl font-bold mb-4">Create New Password</h1>
          <p className="text-lg opacity-90 mb-8">Enter your new password to secure your account.</p>
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
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#1F2D38' }}>Reset Password</h3>
              <p className="text-sm" style={{ color: '#94A1AB' }}>
                Enter your new password below
              </p>
            </div>

            {success && (
              <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}>
                <p className="font-semibold mb-1">✓ Password Reset Successful!</p>
                <p className="text-sm">Your password has been updated. Redirecting to login...</p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }}>
                <p className="font-semibold mb-1">✗ Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!token && !error && (
              <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' }}>
                <p className="text-sm">No reset token found. Please request a new password reset link.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2D38' }}>
                  New Password
                </label>
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
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    style={{ borderColor: '#BDD7EB' }}
                    placeholder="••••••••"
                    disabled={loading || !token}
                  />
                </div>
                <p className="mt-1 text-xs" style={{ color: '#94A1AB' }}>
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2D38' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MdLock className="h-5 w-5" style={{ color: '#94A1AB' }} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    style={{ borderColor: '#BDD7EB' }}
                    placeholder="••••••••"
                    disabled={loading || !token}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full text-white py-3 px-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#895F42' }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
