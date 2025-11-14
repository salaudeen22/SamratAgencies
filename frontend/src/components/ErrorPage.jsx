import { useNavigate } from 'react-router-dom';
import Button from './Button';

const ErrorPage = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
    navigate('/');
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#1F2D38' }}>
            Failed to Load Page
          </h1>
          <p className="text-lg mb-2" style={{ color: '#94A1AB' }}>
            We couldn't load this page. This might be due to a network issue.
          </p>
          <p className="text-sm" style={{ color: '#94A1AB' }}>
            Please check your internet connection and try again.
          </p>

          {error && (
            <div className="mt-6 p-4 rounded-lg text-left" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5' }}>
              <p className="text-xs font-medium mb-2 text-red-800">Error Details:</p>
              <p className="text-xs font-mono text-red-600 overflow-auto">
                {error.message || error.toString()}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleReload} size="lg">
            Try Again
          </Button>
          <button
            onClick={handleGoHome}
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
  );
};

export default ErrorPage;
