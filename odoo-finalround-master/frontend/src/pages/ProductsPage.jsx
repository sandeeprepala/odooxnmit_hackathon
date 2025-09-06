import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { productService } from '../services/productService.js';
import ProductList from '../components/products/ProductList.jsx';

export default function ProductsPage() {
  const { token, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all'); // <-- new

  // Available filters
  const availabilityOptions = [
    { value: 'all', label: 'All Products', color: 'neutral' },
    { value: 'available', label: 'Available Now', color: 'green' },
    { value: 'scheduled', label: 'Scheduled', color: 'blue' },
    { value: 'unavailable', label: 'Unavailable', color: 'red' }
  ];

  const priceOptions = [
    { value: 'all', label: 'All Prices', color: 'neutral' },
    { value: 'low', label: 'Under ₹500/day', color: 'green' },
    { value: 'medium', label: '₹500-1000/day', color: 'yellow' },
    { value: 'high', label: 'Over ₹1000/day', color: 'purple' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'appliances', label: 'Appliances' },
    // add more categories as needed
  ];

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const query = {
        includeUnavailable: user?.role === 'admin' ? 'true' : 'false',
        ...filters
      };

      const result = await productService.list(query, token, user?.role);
      setProducts(result);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token, user?.role]);

  // Handle search and filtering
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Apply all current filters
  const applyFilters = () => {
    const filters = {};

    if (searchTerm.trim()) {
      filters.q = searchTerm.trim();
    }

    if (availabilityFilter !== 'all') {
      filters.availability = availabilityFilter;
    }

    if (priceFilter !== 'all') {
      filters.price = priceFilter;
    }

    if (categoryFilter !== 'all') {
      filters.category = categoryFilter;
    }

    fetchProducts(filters);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'availability') {
      setAvailabilityFilter(value);
    } else if (filterType === 'price') {
      setPriceFilter(value);
    } else if (filterType === 'category') {
      setCategoryFilter(value);
    }

    // Apply filters immediately
    setTimeout(() => applyFilters(), 100);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setAvailabilityFilter('all');
    setPriceFilter('all');
    setCategoryFilter('all');
    fetchProducts();
  };

  // Filter products by price and category on frontend
  const getFilteredProducts = () => {
    if (!products.items) return [];

    let filtered = [...products.items];

    // Price filtering
    if (priceFilter !== 'all') {
      filtered = filtered.filter(product => {
        const price = product.basePrice;
        switch (priceFilter) {
          case 'low': return price < 500;
          case 'medium': return price >= 500 && price <= 1000;
          case 'high': return price > 1000;
          default: return true;
        }
      });
    }

    // Category filtering
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="section-header">
        <h2 className="section-title">Products</h2>
        <p className="section-subtitle">
          Discover our wide range of rental products. Use the search and filters below to find exactly what you need.
        </p>
      </div>

      {/* Search and Filters Section */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                placeholder="Search products by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=""
              />
              <button type="submit" className="btn">Search</button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Availability Filter */}
            {/* <div>
              <label className="input-group-label text-purple-200 mb-3">Availability Status</label>
              <div className="flex flex-wrap gap-3">
                {availabilityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleFilterChange('availability', option.value)}
                    className='btn'
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Price Filter */}
            <div>
              <label className="input-group-label text-purple-200 mb-3">Price Range</label>
              <div className="flex flex-wrap gap-3">
                {priceOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleFilterChange('price', option.value)}
                    className='btn'
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="input-group-label text-purple-200 mb-3">Category</label>
              <div className="flex flex-wrap gap-3">
                {categoryOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleFilterChange('category', option.value)}
                    className='btn'
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-gray-600 gap-4">
            <div className="text-sm text-gray-400">
              Showing {filteredProducts.length} of {products.total || 0} products
              {priceFilter !== 'all' && (
                <span className="ml-2 text-purple-400">
                  • Price filtered: {priceOptions.find(p => p.value === priceFilter)?.label}
                </span>
              )}
              {categoryFilter !== 'all' && (
                <span className="ml-2 text-purple-400">
                  • Category: {categoryOptions.find(c => c.value === categoryFilter)?.label}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {user?.role === 'admin' && (
                <div className="text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-600">
                  Admin view: All products
                </div>
              )}
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium border border-gray-500 hover:border-gray-400"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="card text-center py-16">
          <div className="spinner-circle mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} />
      ) : (
        <div className="card text-center py-16">
          <div className="text-8xl mb-6">🔍</div>
          <h3 className="text-2xl font-semibold mb-3 text-white">No products found</h3>
          <p className="text-gray-400 mb-6 text-lg max-w-md mx-auto">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <button
            onClick={clearFilters}
            className="btn btn-secondary px-6 py-3 text-lg"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
