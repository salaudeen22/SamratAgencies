import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel1, setSelectedLevel1] = useState('');
  const [selectedLevel2, setSelectedLevel2] = useState('');
  const [selectedLevel3, setSelectedLevel3] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: '',
    inStock: false,
  });

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

        const response = await productAPI.getAll(params);
        setProducts(response.data);
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
      inStock: false,
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

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#1F2D38' }}>Our Products</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20" style={{ border: '2px solid #BDD7EB' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold" style={{ color: '#1F2D38' }}>Filters</h2>
                {(filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.sortBy || filters.inStock) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-medium transition"
                    style={{ color: '#895F42' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#9F8065'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#895F42'}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
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
                  style={{ border: '1px solid #BDD7EB', focusRingColor: '#895F42' }}
                />
              </div>

              {/* Category Dropdowns */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium" style={{ color: '#1F2D38' }}>
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
                      className="text-xs font-medium transition"
                      style={{ color: '#895F42' }}
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
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 text-sm"
                    style={{ border: '1px solid #BDD7EB', color: '#1F2D38' }}
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
                      className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 text-sm"
                      style={{ border: '1px solid #BDD7EB', color: '#1F2D38' }}
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
                      className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 text-sm"
                      style={{ border: '1px solid #BDD7EB', color: '#1F2D38' }}
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
                <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Sort By
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                  style={{ border: '1px solid #BDD7EB', color: '#1F2D38' }}
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
                <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
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
                    className="px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                    style={{ border: '1px solid #BDD7EB' }}
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                    style={{ border: '1px solid #BDD7EB' }}
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={filters.inStock}
                    onChange={handleFilterChange}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#895F42' }}
                  />
                  <span className="ml-2 text-sm font-medium" style={{ color: '#1F2D38' }}>
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    In Stock Only
                  </span>
                </label>
              </div>

              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 rounded-md transition font-medium shadow-sm"
                style={{ backgroundColor: '#895F42', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9F8065'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#895F42'}
              >
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#94A1AB' }}>
                  {loading ? 'Loading...' : `${products.length} ${products.length === 1 ? 'product' : 'products'} found`}
                </p>
                {(filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.sortBy || filters.inStock) && (
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
                    {filters.inStock && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        In Stock Only
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, inStock: false }))}
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto" style={{ borderColor: '#895F42' }}></div>
                <p className="mt-4" style={{ color: '#94A1AB' }}>Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg" style={{ color: '#94A1AB' }}>No products found</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 font-medium transition"
                  style={{ color: '#895F42' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#9F8065'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#895F42'}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
