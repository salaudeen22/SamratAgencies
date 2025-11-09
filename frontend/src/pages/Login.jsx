import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

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
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 border-2" style={{ borderColor: '#BDD7EB' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold" style={{ color: '#1F2D38' }}>Welcome Back</h2>
            <p className="mt-2" style={{ color: '#94A1AB' }}>Login to your account</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: '#94A1AB' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold transition" style={{ color: '#895F42' }} onMouseEnter={(e) => e.currentTarget.style.color = '#9F8065'} onMouseLeave={(e) => e.currentTarget.style.color = '#895F42'}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
