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
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Options
  const priceOptions = [
    { value: 'all', label: 'All Prices' },
    { value: 'low', label: 'Under ₹500/day' },
    { value: 'medium', label: '₹500–1000/day' },
    { value: 'high', label: 'Over ₹1000/day' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'appliances', label: 'Appliances' },
    // extend as needed
  ];

  // Fetch products
  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const query = {
        includeUnavailable: user?.role === 'admin' ? 'true' : 'false',
        ...filters,
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

  // Apply filters
  const applyFilters = () => {
    const filters = {};

    if (searchTerm.trim()) filters.q = searchTerm.trim();
    if (availabilityFilter !== 'all') filters.availability = availabilityFilter;
    if (priceFilter !== 'all') filters.price = priceFilter;
    if (categoryFilter !== 'all') filters.category = categoryFilter;

    fetchProducts(filters);
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Filter change handler
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'availability') setAvailabilityFilter(value);
    if (filterType === 'price') setPriceFilter(value);
    if (filterType === 'category') setCategoryFilter(value);

    applyFilters();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setAvailabilityFilter('all');
    setPriceFilter('all');
    setCategoryFilter('all');
    fetchProducts();
  };

  // Frontend fallback price/category filtering
  const getFilteredProducts = () => {
    if (!products.items) return [];
    let filtered = [...products.items];

    if (priceFilter !== 'all') {
      filtered = filtered.filter(p => {
        const price = p.basePrice;
        return (
          (priceFilter === 'low' && price < 500) ||
          (priceFilter === 'medium' && price >= 500 && price <= 1000) ||
          (priceFilter === 'high' && price > 1000)
        );
      });
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="section-header">
        <h2 className="section-title">Products</h2>
        <p className="section-subtitle">
          Discover our wide range of rental products. Use the search and filters below to find exactly what you need.
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Search */}
          <div className="relative flex">
            <input
              type="text"
              placeholder="Search products by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <button type="submit" className="btn">Search</button>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block mb-2">Price Range</label>
            <div className="flex flex-wrap gap-2">
              {priceOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleFilterChange('price', opt.value)}
                  className={`btn ${priceFilter === opt.value ? 'bg-purple-600 text-white' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleFilterChange('category', opt.value)}
                  className={`btn ${categoryFilter === opt.value ? 'bg-purple-600 text-white' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary + Clear */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-600">
            <div className="text-sm text-gray-400">
              Showing {filteredProducts.length} of {products.total || 0} products
              {priceFilter !== 'all' && ` • Price: ${priceOptions.find(p => p.value === priceFilter)?.label}`}
              {categoryFilter !== 'all' && ` • Category: ${categoryOptions.find(c => c.value === categoryFilter)?.label}`}
            </div>
            <div className="flex gap-2">
              {/* {user?.role === 'admin' && (
                <div className="px-3 py-1 bg-gray-700 rounded text-sm">Admin view</div>
              )} */}
              <button type="button" onClick={clearFilters} className="btn btn-secondary">
                Clear All Filters
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Products */}
      {loading ? (
        <div className="card text-center py-16">
          <div className="spinner-circle mx-auto mb-4"></div>
          <p className="text-gray-400">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} />
      ) : (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search terms or filters.</p>
          <button onClick={clearFilters} className="btn btn-secondary">Clear All Filters</button>
        </div>
      )}
    </div>
  );
}
