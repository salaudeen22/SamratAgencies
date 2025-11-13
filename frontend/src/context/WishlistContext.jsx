import { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      // Load from localStorage for guest users
      const savedWishlist = localStorage.getItem('guestWishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      if (isAuthenticated) {
        const response = await wishlistAPI.addItem(productId);
        setWishlist(response.data.wishlist);
        return { success: true };
      } else {
        // Handle guest wishlist in localStorage
        const updatedWishlist = { ...wishlist };
        const existingProduct = updatedWishlist.products.find(
          item => item.product._id === productId
        );

        if (existingProduct) {
          return { success: false, error: 'Product already in wishlist' };
        }

        updatedWishlist.products.push({
          product: { _id: productId },
          addedAt: new Date().toISOString()
        });
        setWishlist(updatedWishlist);
        localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
      return { success: false, error: err.response?.data?.message };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (isAuthenticated) {
        const response = await wishlistAPI.removeItem(productId);
        setWishlist(response.data.wishlist);
        return { success: true };
      } else {
        const updatedWishlist = { ...wishlist };
        updatedWishlist.products = updatedWishlist.products.filter(
          item => item.product._id !== productId
        );
        setWishlist(updatedWishlist);
        localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      return { success: false, error: err.response?.data?.message };
    }
  };

  const clearWishlist = async () => {
    try {
      if (isAuthenticated) {
        await wishlistAPI.clearWishlist();
      } else {
        localStorage.removeItem('guestWishlist');
      }
      setWishlist({ products: [] });
      return { success: true };
    } catch (err) {
      console.error('Failed to clear wishlist:', err);
      return { success: false, error: err.response?.data?.message };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.products.some(
      item => item.product._id === productId || item.product === productId
    );
  };

  const getWishlistCount = () => {
    return wishlist.products.length;
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
