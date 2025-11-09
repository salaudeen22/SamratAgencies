import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleGoogleLogin } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      handleGoogleLogin(token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, handleGoogleLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafaf9' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#895F42' }}></div>
        <p className="mt-4" style={{ color: '#1F2D38' }}>Completing login...</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
