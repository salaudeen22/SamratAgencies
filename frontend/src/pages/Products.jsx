import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all fetched products
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel1, setSelectedLevel1] = useState('');
  const [selectedLevel2, setSelectedLevel2] = useState('');
  const [selectedLevel3, setSelectedLevel3] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  // Initialize filters from URL on first render
  const initializeFiltersFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      search: searchParams.get('search') || '',
      sortBy: searchParams.get('sort') || '',
      availabilityType: '',
    };
  };

  const [filters, setFilters] = useState(initializeFiltersFromUrl());

  // Update filters when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setFilters(prev => ({
      ...prev,
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      search: searchParams.get('search') || '',
      sortBy: searchParams.get('sort') || '',
    }));
  }, [location.search]);

  // Read URL parameters on mount and resolve category slug to ID
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category');

    console.log('URL Search Params:', location.search);
    console.log('Category from URL:', categoryFromUrl);

    if (categoryFromUrl && categories.length > 0) {
      // Check if it's already an ID (24-character hex) or a slug
      const isId = /^[0-9a-fA-F]{24}$/.test(categoryFromUrl);

      if (isId) {
        // It's an ID, use it directly
        setFilters(prev => ({ ...prev, category: categoryFromUrl }));

        // Set the appropriate level selection
        const category = findCategoryById(categories, categoryFromUrl);
        if (category) {
          // Find which level this category is at
          const isLevel1 = categories.some(c => c._id === categoryFromUrl);
          if (isLevel1) {
            setSelectedLevel1(categoryFromUrl);
          } else {
            // Check if it's level 2
            for (const level1 of categories) {
              const isLevel2 = level1.children?.some(c => c._id === categoryFromUrl);
              if (isLevel2) {
                setSelectedLevel1(level1._id);
                setSelectedLevel2(categoryFromUrl);
                break;
              }
              // Check if it's level 3
              for (const level2 of (level1.children || [])) {
                const isLevel3 = level2.children?.some(c => c._id === categoryFromUrl);
                if (isLevel3) {
                  setSelectedLevel1(level1._id);
                  setSelectedLevel2(level2._id);
                  setSelectedLevel3(categoryFromUrl);
                  break;
                }
              }
            }
          }
        }
      } else {
        // It's a slug, find the category by slug
        const findCategoryBySlug = (cats) => {
          for (const cat of cats) {
            if (cat.slug === categoryFromUrl) return cat;
            if (cat.children && cat.children.length > 0) {
              const found = findCategoryBySlug(cat.children);
              if (found) return found;
            }
          }
          return null;
        };

        const category = findCategoryBySlug(categories);
        if (category) {
          setFilters(prev => ({ ...prev, category: category._id }));

          // Find which level this category is at
          const isLevel1 = categories.some(c => c._id === category._id);
          if (isLevel1) {
            setSelectedLevel1(category._id);
          } else {
            // Check if it's level 2
            for (const level1 of categories) {
              const isLevel2 = level1.children?.some(c => c._id === category._id);
              if (isLevel2) {
                setSelectedLevel1(level1._id);
                setSelectedLevel2(category._id);
                break;
              }
              // Check if it's level 3
              for (const level2 of (level1.children || [])) {
                const isLevel3 = level2.children?.some(c => c._id === category._id);
                if (isLevel3) {
                  setSelectedLevel1(level1._id);
                  setSelectedLevel2(level2._id);
                  setSelectedLevel3(category._id);
                  break;
                }
              }
            }
          }
        }
      }
    }
  }, [location.search, categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.search) params.search = filters.search;
        if (filters.availabilityType) params.availabilityType = filters.availabilityType;
        if (filters.sortBy) {
          // Convert frontend sortBy format to backend format
          const sortMap = {
            'price_asc': 'price-asc',
            'price_desc': 'price-desc',
            'name_asc': 'name-asc',
            'name_desc': 'name-desc',
            'newest': 'newest'
          };
          params.sort = sortMap[filters.sortBy] || filters.sortBy;
        }

        let productsData = await productAPI.getAll(params);
        const fetchedProducts = productsData.data;

        // Store all products
        setAllProducts(fetchedProducts);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sortBy: '',
      availabilityType: '',
    });
    setSelectedLevel1('');
    setSelectedLevel2('');
    setSelectedLevel3('');
  };

  // Helper to find category by ID in nested structure
  const findCategoryById = (cats, id) => {
    for (const cat of cats) {
      if (cat._id === id) return cat;
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Handle level 1 category change
  const handleLevel1Change = (value) => {
    setSelectedLevel1(value);
    setSelectedLevel2('');
    setSelectedLevel3('');
    setFilters(prev => ({ ...prev, category: value }));
  };

  // Handle level 2 category change
  const handleLevel2Change = (value) => {
    setSelectedLevel2(value);
    setSelectedLevel3('');
    setFilters(prev => ({ ...prev, category: value }));
  };

  // Handle level 3 category change
  const handleLevel3Change = (value) => {
    setSelectedLevel3(value);
    setFilters(prev => ({ ...prev, category: value }));
  };

  // Get level 2 categories based on selected level 1
  const getLevel2Categories = () => {
    if (!selectedLevel1) return [];
    const level1Category = categories.find(cat => cat._id === selectedLevel1);
    return level1Category?.children || [];
  };

  // Get level 3 categories based on selected level 2
  const getLevel3Categories = () => {
    if (!selectedLevel2) return [];
    const level2Categories = getLevel2Categories();
    const level2Category = level2Categories.find(cat => cat._id === selectedLevel2);
    return level2Category?.children || [];
  };

  // Get the current category info for dynamic SEO
  const currentCategory = filters.category ? findCategoryById(categories, filters.category) : null;
  const canonicalUrl = currentCategory
    ? `/products?category=${currentCategory.slug || currentCategory._id}`
    : '/products';

  const seoTitle = currentCategory
    ? `${currentCategory.name} - ${products.length > 0 ? products.length + '+ Designs' : 'Best Deals'} | Starting ₹${products.length > 0 && products[0]?.price ? Math.min(...products.map(p => p.discount > 0 ? (p.discountType === 'percentage' ? p.price - (p.price * p.discount / 100) : p.price - p.discount) : p.price)).toLocaleString() : '9,999'}+ | Samrat Agencies Bangalore`
    : `Premium Furniture Store Bangalore - ${products.length}+ Products | Sofas, Beds, Dining Sets | Free Delivery | EMI | Samrat Agencies`;

  const seoDescription = currentCategory
    ? `Explore ${products.length}+ Premium ${currentCategory.name} Designs in Bangalore. Starting at ₹${products.length > 0 && products[0]?.price ? Math.min(...products.map(p => p.discount > 0 ? (p.discountType === 'percentage' ? p.price - (p.price * p.discount / 100) : p.price - p.discount) : p.price)).toLocaleString() : '9,999'}. ${products.filter(p => p.discount > 0).length > 0 ? products.filter(p => p.discount > 0).length + ' Items on SALE' : 'Best Prices Guaranteed'}. FREE Home Delivery across Bangalore, Chennai, Hyderabad, Kochi. No Cost EMI - Bajaj Finserv, HDFC, ICICI, SBI. 5.0/5 Customer Rating (108+ Reviews). ${products.filter(p => p.availabilityType === 'immediate').length > 0 ? products.filter(p => p.availabilityType === 'immediate').length + ' Products Available for Same-Day Delivery' : 'Fast Delivery Available'}. Better Prices than IKEA & Royaloak. Quality Assured. Trusted Since 1996. Visit our Showroom at Begur Road, Hongasandra, Bommanahalli, Bangalore.`
    : `Shop 1000+ Premium Furniture Designs Online at Best Prices in South India. Upto 50% OFF on Sofas, Beds, Dining Tables, Wardrobes, Mattresses & More. FREE Home Delivery in Bangalore, Chennai, Hyderabad, Kochi. No Cost EMI Available - Bajaj Finserv, HDFC, ICICI, SBI. 5-Star Rated Furniture Store (108+ Reviews). Better Prices Than IKEA & Royaloak. ${products.filter(p => p.availabilityType === 'immediate').length}+ Products Available for Immediate Delivery. Premium Quality Wooden, Leather & Fabric Furniture. Special Offers on Sofa Sets, Storage Beds, 4-6 Seater Dining Tables. Warranty Included. Trusted Since 1996. Visit Samrat Agencies Showroom - Begur Road, Hongasandra, Bommanahalli, Bangalore.`;

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="furniture products, buy furniture online, sofas, beds, dining tables, chairs, wardrobes, bangalore furniture"
        url={canonicalUrl}
        canonical={`https://samratagencies.in${canonicalUrl}`}
      />
      <div className="min-h-screen py-4 sm:py-6 md:py-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#2F1A0F' }}>Our Products</h1>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all"
            style={{ backgroundColor: '#816047', color: 'white' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-20" style={{ border: '2px solid #D7B790' }}>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-semibold" style={{ color: '#2F1A0F' }}>Filters</h2>
                {(filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.sortBy || filters.availabilityType) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-medium transition"
                    style={{ color: '#816047' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#D7B790'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#816047'}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#2F1A0F' }}>
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                  style={{ border: '1px solid #D7B790', focusRingColor: '#816047' }}
                />
              </div>

              {/* Category Dropdowns */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <label className="block text-xs sm:text-sm font-medium" style={{ color: '#2F1A0F' }}>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    Categories
                  </label>
                  {filters.category && (
                    <button
                      onClick={() => {
                        setSelectedLevel1('');
                        setSelectedLevel2('');
                        setSelectedLevel3('');
                        setFilters(prev => ({ ...prev, category: '' }));
                      }}
                      className="text-xs font-medium transition"
                      style={{ color: '#816047' }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Level 1 - Main Categories */}
                <div className="space-y-3">
                  <select
                    value={selectedLevel1}
                    onChange={(e) => handleLevel1Change(e.target.value)}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-md focus:outline-none focus:ring-2 text-xs sm:text-sm"
                    style={{ border: '1px solid #D7B790', color: '#2F1A0F' }}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {/* Level 2 - Sub Categories */}
                  {selectedLevel1 && getLevel2Categories().length > 0 && (
                    <select
                      value={selectedLevel2}
                      onChange={(e) => handleLevel2Change(e.target.value)}
                      className="w-full px-3 py-1.5 sm:py-2 rounded-md focus:outline-none focus:ring-2 text-xs sm:text-sm"
                      style={{ border: '1px solid #D7B790', color: '#2F1A0F' }}
                    >
                      <option value="">All in {categories.find(c => c._id === selectedLevel1)?.name}</option>
                      {getLevel2Categories().map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Level 3 - Sub-Sub Categories */}
                  {selectedLevel2 && getLevel3Categories().length > 0 && (
                    <select
                      value={selectedLevel3}
                      onChange={(e) => handleLevel3Change(e.target.value)}
                      className="w-full px-3 py-1.5 sm:py-2 rounded-md focus:outline-none focus:ring-2 text-xs sm:text-sm"
                      style={{ border: '1px solid #D7B790', color: '#2F1A0F' }}
                    >
                      <option value="">All in {getLevel2Categories().find(c => c._id === selectedLevel2)?.name}</option>
                      {getLevel3Categories().map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#2F1A0F' }}>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Sort By
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-md focus:outline-none focus:ring-2 text-xs sm:text-sm"
                  style={{ border: '1px solid #D7B790', color: '#2F1A0F' }}
                >
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#2F1A0F' }}>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-2"
                    style={{ border: '1px solid #D7B790' }}
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-2"
                    style={{ border: '1px solid #D7B790' }}
                  />
                </div>
              </div>

              {/* Availability Type */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: '#2F1A0F' }}>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Availability
                </label>
                <select
                  name="availabilityType"
                  value={filters.availabilityType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-md focus:outline-none focus:ring-2 text-xs sm:text-sm"
                  style={{ border: '1px solid #D7B790', color: '#2F1A0F' }}
                >
                  <option value="">All Products</option>
                  <option value="immediate">Immediate Delivery</option>
                  <option value="made-to-order">Made to Order</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md transition font-medium shadow-sm"
                style={{ backgroundColor: '#816047', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D7B790'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#816047'}
              >
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                  {loading ? 'Loading...' : `${products.length} ${products.length === 1 ? 'product' : 'products'} found`}
                </p>
                {(filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.sortBy || filters.availabilityType) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Category: {findCategoryById(categories, filters.category)?.name || 'Selected'}
                        <button
                          onClick={() => {
                            setSelectedLevel1('');
                            setSelectedLevel2('');
                            setSelectedLevel3('');
                            setFilters(prev => ({ ...prev, category: '' }));
                          }}
                          className="ml-1.5 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.search && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Search: "{filters.search}"
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                          className="ml-1.5 hover:text-purple-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {(filters.minPrice || filters.maxPrice) && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Price: {filters.minPrice || '0'} - {filters.maxPrice || '∞'}
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))}
                          className="ml-1.5 hover:text-green-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.availabilityType && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {filters.availabilityType === 'immediate' ? 'Immediate Delivery' : 'Made to Order'}
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, availabilityType: '' }))}
                          className="ml-1.5 hover:text-yellow-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="relative w-12 h-12 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-[#E6CDB1]"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-[#816047] border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 animate-pulse" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <div
                    key={product._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(index % 12) * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>No products found</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 font-medium transition"
                  style={{ color: '#816047' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D7B790'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#816047'}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            ></div>

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 lg:hidden overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b-2 px-4 py-4 flex items-center justify-between" style={{ borderColor: '#D7B790' }}>
                <h2 className="text-xl font-semibold" style={{ color: '#2F1A0F' }}>Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  style={{ color: '#816047' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Filter Content */}
              <div className="p-4">
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search products..."
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                    style={{ border: '1px solid #D7B790' }}
                  />
                </div>

                {/* Category Dropdowns */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium" style={{ color: '#2F1A0F' }}>
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      Categories
                    </label>
                    {filters.category && (
                      <button
                        onClick={() => {
                          setSelectedLevel1('');
                          setSelectedLevel2('');
                          setSelectedLevel3('');
                          setFilters(prev => ({ ...prev, category: '' }));
                        }}
                        className="text-xs font-medium"
                        style={{ color: '#816047' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <select
                      value={selectedLevel1}
                      onChange={(e) => handleLevel1Change(e.target.value)}
                      className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 text-sm"
                      style={{ border: '1px solid #D7B790', color: '#2F1A0F' }}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>

                    {selectedLevel1 && getLevel2Categories().length > 0 && (
                      <select
                        value={selectedLevel2}
                        onChange={(e) => handleLevel2Change(e.target.value)}
                        className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 text-sm"
                        style={{ border: '1px solid #D7B790', color: '#2F1A0F' }}
                      >
                        <option value="">All in {categories.find(c => c._id === selectedLevel1)?.name}</option>
                        {getLevel2Categories().map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}

                    {selectedLevel2 && getLevel3Categories().length > 0 && (
                      <select
                        value={selectedLevel3}
                        onChange={(e) => handleLevel3Change(e.target.value)}
                        className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 text-sm"
                        style={{ border: '1px solid #D7B790', color: '#2F1A0F' }}
                      >
                        <option value="">All in {getLevel2Categories().find(c => c._id === selectedLevel2)?.name}</option>
                        {getLevel3Categories().map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Sort By
                  </label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 text-sm"
                    style={{ border: '1px solid #D7B790', color: '#2F1A0F' }}
                  >
                    <option value="">Default</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2"
                      style={{ border: '1px solid #D7B790' }}
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2"
                      style={{ border: '1px solid #D7B790' }}
                    />
                  </div>
                </div>

                {/* Availability Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Availability
                  </label>
                  <select
                    name="availabilityType"
                    value={filters.availabilityType}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 text-sm"
                    style={{ border: '1px solid #D7B790', color: '#2F1A0F' }}
                  >
                    <option value="">All Products</option>
                    <option value="immediate">Immediate Delivery</option>
                    <option value="made-to-order">Made to Order</option>
                  </select>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="sticky bottom-0 bg-white border-t-2 p-4 flex gap-3" style={{ borderColor: '#D7B790' }}>
                <button
                  onClick={() => {
                    clearFilters();
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-md font-medium transition"
                  style={{ backgroundColor: '#F3F4F6', color: '#816047' }}
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-4 py-3 rounded-md font-medium transition"
                  style={{ backgroundColor: '#816047', color: 'white' }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default Products;
