import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  }
  return context;
};

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse recently viewed:', error);
        localStorage.removeItem('recentlyViewed');
      }
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (recentlyViewed.length > 0) {
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed]);

  const addToRecentlyViewed = (product) => {
    if (!product || !product._id) return;

    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p._id !== product._id);

      // Add to beginning and limit to 12 items
      const updated = [product, ...filtered].slice(0, 12);

      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('recentlyViewed');
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

RecentlyViewedProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
