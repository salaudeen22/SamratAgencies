import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 border-2" style={{ borderColor: '#BDD7EB' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold" style={{ color: '#1F2D38' }}>Create Account</h2>
            <p className="mt-2" style={{ color: '#94A1AB' }}>Sign up for Samrat Agencies</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#BDD7EB' }}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#BDD7EB' }}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#BDD7EB' }}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#BDD7EB' }}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#BDD7EB' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white" style={{ color: '#94A1AB' }}>Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="http://localhost:8000/api/auth/google"
                className="w-full inline-flex justify-center items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 transition"
                style={{ borderColor: '#BDD7EB', color: '#1F2D38' }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </a>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p style={{ color: '#94A1AB' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold transition" style={{ color: '#895F42' }} onMouseEnter={(e) => e.currentTarget.style.color = '#9F8065'} onMouseLeave={(e) => e.currentTarget.style.color = '#895F42'}>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
