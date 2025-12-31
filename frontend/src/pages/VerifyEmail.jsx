import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdEmail, MdCheckCircle, MdError } from 'react-icons/md';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, error
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setError('Invalid or missing verification token.');
      setLoading(false);
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, {
        token
      });

      if (response.data.success) {
        setVerificationStatus('success');
        toast.success('Email verified successfully!');

        // If JWT token is returned, store it
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to verify email. The link may have expired.';
      setVerificationStatus('error');
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    // Get email from URL if available, otherwise ask user
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');

    let email = emailFromUrl;
    if (!email) {
      email = prompt('Please enter your email address to resend verification:');
      if (!email) return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/resend-verification-email`, {
        email
      });

      if (response.data.success) {
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (err) {
      if (err.response?.data?.alreadyVerified) {
        toast.success('Email already verified! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const errorMsg = err.response?.data?.message || 'Failed to resend verification email';
        toast.error(errorMsg);
      }
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#fafaf9' }}>
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80"
          alt="Luxury Furniture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent" style={{ backgroundColor: 'rgba(137, 95, 66, 0.4)' }}></div>

        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Email Verification</h1>
          <p className="text-lg opacity-90 mb-8">Verify your email to unlock all features.</p>
        </div>
      </div>

      {/* Right Side - Verification Status Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border" style={{ borderColor: '#D7B790' }}>
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="/samrat-logo.png"
                  alt="Samrat Agencies"
                  className="h-16 w-auto"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#2F1A0F' }}>Email Verification</h3>
            </div>

            {/* Verifying State */}
            {verificationStatus === 'verifying' && (
              <div className="text-center py-8">
                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2" style={{ borderColor: '#816047' }}></div>
                </div>
                <h4 className="text-xl font-semibold mb-2" style={{ color: '#2F1A0F' }}>
                  Verifying your email...
                </h4>
                <p className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                  Please wait while we verify your email address.
                </p>
              </div>
            )}

            {/* Success State */}
            {verificationStatus === 'success' && (
              <div className="text-center py-8">
                <div className="flex justify-center mb-6">
                  <div className="rounded-full p-4" style={{ backgroundColor: '#d4edda' }}>
                    <MdCheckCircle className="h-16 w-16" style={{ color: '#155724' }} />
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>
                  Email Verified Successfully!
                </h4>
                <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}>
                  <p className="text-sm">
                    Your email has been verified. You now have full access to all features!
                  </p>
                </div>
                <p className="text-sm mb-6" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                  Redirecting you to the homepage...
                </p>
                <Link
                  to="/"
                  className="inline-block text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: '#816047' }}
                >
                  Go to Homepage
                </Link>
              </div>
            )}

            {/* Error State */}
            {verificationStatus === 'error' && (
              <div className="text-center py-8">
                <div className="flex justify-center mb-6">
                  <div className="rounded-full p-4" style={{ backgroundColor: '#f8d7da' }}>
                    <MdError className="h-16 w-16" style={{ color: '#721c24' }} />
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-3" style={{ color: '#2F1A0F' }}>
                  Verification Failed
                </h4>
                <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }}>
                  <p className="font-semibold mb-1">Error</p>
                  <p className="text-sm">{error}</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={resendVerificationEmail}
                    className="w-full text-white py-3 px-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: '#816047' }}
                  >
                    Resend Verification Email
                  </button>

                  <Link
                    to="/login"
                    className="block w-full py-3 px-4 rounded-lg font-semibold transition-all border-2 text-center"
                    style={{ borderColor: '#816047', color: '#816047' }}
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            )}

            {/* Additional Help */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: '#D7B790' }}>
              <div className="text-center">
                <p className="text-sm mb-3" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                  Need help?
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <a href="tel:+919880914457" className="font-semibold transition-colors" style={{ color: '#816047' }}>
                      +91 98809 14457
                    </a>
                  </p>
                  <p className="text-sm">
                    <Link to="/contact" className="font-semibold transition-colors" style={{ color: '#816047' }}>
                      Contact Support
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
