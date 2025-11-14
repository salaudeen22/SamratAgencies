import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold mb-2" style={{ color: '#895F42' }}>404</h1>
            <div className="w-32 h-1 mx-auto rounded-full" style={{ backgroundColor: '#BDD7EB' }}></div>
          </div>

          <h2 className="text-3xl font-bold mb-4" style={{ color: '#1F2D38' }}>
            Page Not Found
          </h2>
          <p className="text-lg mb-6" style={{ color: '#94A1AB' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Helpful Links */}
          <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#F0F9FF', border: '2px solid #BDD7EB' }}>
            <p className="text-sm font-medium mb-4" style={{ color: '#1F2D38' }}>
              Here are some helpful links:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate('/')}
                className="text-sm font-medium hover:underline"
                style={{ color: '#895F42' }}
              >
                Home
              </button>
              <span style={{ color: '#BDD7EB' }}>•</span>
              <button
                onClick={() => navigate('/products')}
                className="text-sm font-medium hover:underline"
                style={{ color: '#895F42' }}
              >
                Products
              </button>
              <span style={{ color: '#BDD7EB' }}>•</span>
              <button
                onClick={() => navigate('/about')}
                className="text-sm font-medium hover:underline"
                style={{ color: '#895F42' }}
              >
                About Us
              </button>
              <span style={{ color: '#BDD7EB' }}>•</span>
              <button
                onClick={() => navigate('/contact')}
                className="text-sm font-medium hover:underline"
                style={{ color: '#895F42' }}
              >
                Contact
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate(-1)} size="lg">
              Go Back
            </Button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg font-medium transition"
              style={{
                backgroundColor: 'white',
                color: '#895F42',
                border: '2px solid #895F42'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFF8F3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
