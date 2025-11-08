import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load from localStorage for guest users
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (isAuthenticated) {
        const response = await cartAPI.addItem(productId, quantity);
        setCart(response.data);
      } else {
        // Handle guest cart in localStorage
        const updatedCart = { ...cart };
        const existingItem = updatedCart.items.find(item => item.product._id === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          updatedCart.items.push({ product: { _id: productId }, quantity });
        }
        setCart(updatedCart);
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      }
      return { success: true };
    } catch (err) {
      console.error('Failed to add to cart:', err);
      return { success: false, error: err.response?.data?.message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      if (isAuthenticated) {
        const response = await cartAPI.updateItem(productId, quantity);
        setCart(response.data);
      } else {
        const updatedCart = { ...cart };
        const item = updatedCart.items.find(item => item.product._id === productId);
        if (item) {
          item.quantity = quantity;
          setCart(updatedCart);
          localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
      }
      return { success: true };
    } catch (err) {
      console.error('Failed to update cart:', err);
      return { success: false, error: err.response?.data?.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (isAuthenticated) {
        const response = await cartAPI.removeItem(productId);
        setCart(response.data);
      } else {
        const updatedCart = { ...cart };
        updatedCart.items = updatedCart.items.filter(item => item.product._id !== productId);
        setCart(updatedCart);
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      }
      return { success: true };
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      return { success: false, error: err.response?.data?.message };
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartAPI.clearCart();
      } else {
        localStorage.removeItem('guestCart');
      }
      setCart({ items: [], total: 0 });
      return { success: true };
    } catch (err) {
      console.error('Failed to clear cart:', err);
      return { success: false, error: err.response?.data?.message };
    }
  };

  const getCartCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
