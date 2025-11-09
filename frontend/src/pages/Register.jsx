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
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#BDD7EB' }}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>

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
