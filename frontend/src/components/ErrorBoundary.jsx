import { Component } from 'react';
import Button from './Button';

// Error Boundary UI Component
const ErrorFallback = ({ error, resetError }) => {
  const handleGoHome = () => {
    resetError();
    window.location.href = '/';
  };

  const handleReload = () => {
    resetError();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#1F2D38' }}>
            Oops! Something went wrong
          </h1>
          <p className="text-lg mb-2" style={{ color: '#94A1AB' }}>
            We encountered an unexpected error
          </p>
          {error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-medium mb-2" style={{ color: '#895F42' }}>
                Technical Details
              </summary>
              <div className="p-4 rounded-lg text-xs font-mono overflow-auto" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', color: '#EF4444' }}>
                {error.toString()}
              </div>
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleReload} size="lg">
            Reload Page
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

// Error Boundary Class Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
