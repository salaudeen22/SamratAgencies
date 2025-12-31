import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// Session timeout: 24 hours in milliseconds
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;
// Check session every 5 minutes
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update last activity time
  const updateLastActivity = useCallback(() => {
    localStorage.setItem('lastActivity', Date.now().toString());
  }, []);

  // Check if session is expired
  const isSessionExpired = useCallback(() => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) return false;

    const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
    return timeSinceLastActivity > SESSION_TIMEOUT;
  }, []);

  // Logout function (defined early to avoid dependency issues)
  const logout = useCallback((isSessionTimeout = false) => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastActivity');
    setUser(null);

    if (isSessionTimeout) {
      toast.error('Your session has expired. Please login again.');
    }
  }, []);

  // Memoize checkAuth to prevent unnecessary calls
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Check if session is expired
        if (isSessionExpired()) {
          logout(true);
          return;
        }

        const response = await authAPI.getProfile();
        setUser(response.data);
        updateLastActivity();
      }
    } catch (err) {
      // If token is invalid or expired on backend, clear it
      if (err.response?.status === 401) {
        logout();
      }
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  }, [isSessionExpired, updateLastActivity, logout]);

  useEffect(() => {
    // Only check auth once on mount
    checkAuth();

    // Set up activity listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });

    // Check session periodically
    const sessionCheckInterval = setInterval(() => {
      if (isSessionExpired() && user) {
        logout(true); // true indicates session timeout
      }
    }, SESSION_CHECK_INTERVAL);

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
      clearInterval(sessionCheckInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      updateLastActivity();
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      const emailNotVerified = err.response?.data?.emailNotVerified || false;
      const email = err.response?.data?.email || '';
      setError(message);
      return {
        success: false,
        error: message,
        emailNotVerified,
        email
      };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const { token, ...user } = response.data;
      localStorage.setItem('token', token);
      updateLastActivity();
      setUser(user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const handleGoogleLogin = async (token) => {
    try {
      localStorage.setItem('token', token);
      updateLastActivity();
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (err) {
      localStorage.removeItem('token');
      console.error('Google login failed:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    handleGoogleLogin,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
