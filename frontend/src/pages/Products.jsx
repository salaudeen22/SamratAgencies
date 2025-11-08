import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

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
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
    });
  };

  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(to bottom, #E0EAF0, #ffffff)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#1F2D38' }}>Our Products</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20" style={{ border: '2px solid #BDD7EB' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#1F2D38' }}>Filters</h2>

              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
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

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                  style={{ border: '1px solid #BDD7EB', color: '#1F2D38' }}
                >
                  <option value="">All Categories</option>
                  <option value="sofa">Sofa</option>
                  <option value="bed">Bed</option>
                  <option value="chair">Chair</option>
                  <option value="table">Table</option>
                  <option value="cabinet">Cabinet</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
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

              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 rounded-md transition font-medium"
                style={{ backgroundColor: '#E0EAF0', color: '#895F42' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BDD7EB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E0EAF0'}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
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
