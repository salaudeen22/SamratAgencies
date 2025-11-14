import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext(null);

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const MAX_COMPARE_ITEMS = 4;

  // Load from localStorage on mount
  useEffect(() => {
    const savedCompare = localStorage.getItem('compareList');
    if (savedCompare) {
      try {
        setCompareList(JSON.parse(savedCompare));
      } catch (error) {
        console.error('Failed to parse compare list from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever compareList changes
  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product) => {
    if (compareList.length >= MAX_COMPARE_ITEMS) {
      toast.error(`You can only compare up to ${MAX_COMPARE_ITEMS} products`);
      return { success: false, error: 'Maximum limit reached' };
    }

    const exists = compareList.find(item => item._id === product._id);
    if (exists) {
      toast.error('Product already in comparison');
      return { success: false, error: 'Already exists' };
    }

    setCompareList([...compareList, product]);
    toast.success('Added to comparison');
    return { success: true };
  };

  const removeFromCompare = (productId) => {
    setCompareList(compareList.filter(item => item._id !== productId));
    toast.success('Removed from comparison');
    return { success: true };
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem('compareList');
    toast.success('Comparison cleared');
    return { success: true };
  };

  const isInCompare = (productId) => {
    return compareList.some(item => item._id === productId);
  };

  const getCompareCount = () => {
    return compareList.length;
  };

  const value = {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    getCompareCount,
    MAX_COMPARE_ITEMS,
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};
