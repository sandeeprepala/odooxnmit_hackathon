import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import OrderCard from './OrderCard.jsx';
import { useNavigate } from 'react-router-dom';

export default function OrderManagement() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  // Available status options for filtering
  const statusOptions = [
    { value: 'all', label: 'All Orders', color: 'neutral' },
    { value: 'quotation', label: 'Quotation', color: 'blue' },
    { value: 'confirmed', label: 'Confirmed', color: 'yellow' },
    { value: 'picked_up', label: 'Picked Up', color: 'green' },
    { value: 'returned', label: 'Returned', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  async function load() {
    if (!token) return;
    try {
      setLoading(true);
      const res = await api.get('/admin/orders', token);
      setOrders(res.items || []);
      setFilteredOrders(res.items || []);
    } catch (e) {
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = orders;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const customerName = order.customerId?.name || '';
        const customerEmail = order.customerId?.email || '';
        const orderNumber = order.orderNumber || '';
        const productName = order.items?.[0]?.productId?.name || '';
        
        return (
          customerName.toLowerCase().includes(searchLower) ||
          customerEmail.toLowerCase().includes(searchLower) ||
          orderNumber.toLowerCase().includes(searchLower) ||
          productName.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  async function updateStatus(id, status) {
    await api.put(`/admin/orders/${id}/status`, { status }, token);
    await load();
  }

  function openOrder(order) {
    navigate(`/admin/orders/${order._id}`);
  }

  function clearFilters() {
    setSearchTerm('');
    setStatusFilter('all');
  }

  if (loading) return (
    <div className="card text-center">
      <div className="spinner" style={{ margin: '0 auto' }}></div>
      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading orders...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <label className="input-group-label">Search Orders</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by customer name, email, order number, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4"
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="flex-1 sm:flex-none">
              <label className="input-group-label">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={clearFilters}
              className="btn btn-secondary self-end sm:self-auto"
              style={{ minHeight: '42px' }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-muted">
          Showing {filteredOrders.length} of {orders.length} orders
          {statusFilter !== 'all' && ` (${statusOptions.find(s => s.value === statusFilter)?.label})`}
        </div>
        
        {filteredOrders.length > 0 && (
          <div className="flex gap-2">
            {statusOptions.slice(1).map(option => {
              const count = orders.filter(order => order.status === option.value).length;
              if (count === 0) return null;
              
              return (
                <div
                  key={option.value}
                  className="badge"
                  style={{
                    backgroundColor: `var(--${option.color}-50)`,
                    color: `var(--${option.color}-600)`,
                    border: `1px solid var(--${option.color}-200)`,
                    cursor: 'pointer'
                  }}
                  onClick={() => setStatusFilter(option.value)}
                >
                  {option.label}: {count}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="card text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🔍</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No orders found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No orders have been created yet'
            }
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <button onClick={clearFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid">
          {filteredOrders.map((o) => (
            <OrderCard key={o._id} order={o} onOpen={openOrder} />
          ))}
        </div>
      )}
    </div>
  );
}


