import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '../components/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Samrat Agencies</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="prerender-status-code" content="404" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#fafaf9' }}>
        <div className="max-w-lg w-full text-center">
          <div className="mb-8">
            {/* 404 Illustration */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold mb-2" style={{ color: '#816047' }}>404</h1>
              <div className="w-32 h-1 mx-auto rounded-full" style={{ backgroundColor: '#D7B790' }}></div>
            </div>

          <h2 className="text-3xl font-bold mb-4" style={{ color: '#2F1A0F' }}>
            Page Not Found
          </h2>
          <p className="text-lg mb-6" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Helpful Links */}
          <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#F0F9FF', border: '2px solid #D7B790' }}>
            <p className="text-sm font-medium mb-4" style={{ color: '#2F1A0F' }}>
              Here are some helpful links:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate('/')}
                className="text-sm font-medium hover:underline"
                style={{ color: '#816047' }}
              >
                Home
              </button>
              <span style={{ color: '#D7B790' }}>•</span>
              <button
                onClick={() => navigate('/products')}
                className="text-sm font-medium hover:underline"
                style={{ color: '#816047' }}
              >
                Products
              </button>
              <span style={{ color: '#D7B790' }}>•</span>
              <button
                onClick={() => navigate('/about')}
                className="text-sm font-medium hover:underline"
                style={{ color: '#816047' }}
              >
                About Us
              </button>
              <span style={{ color: '#D7B790' }}>•</span>
              <button
                onClick={() => navigate('/contact')}
                className="text-sm font-medium hover:underline"
                style={{ color: '#816047' }}
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
                color: '#816047',
                border: '2px solid #816047'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E6CDB1';
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
    </>
  );
};

export default NotFound;
