import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { orderService } from '../../services/orderService.js';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge.jsx';

export default function CustomerDashboard() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  
  useEffect(() => { 
    if (user) orderService.getByCustomer(user.id || user._id, token).then(setOrders); 
  }, [user, token]);
  
  const pendingPayments = orders.filter(o => o.status === 'confirmed' && o.paymentStatus !== 'paid');
  
  // Function to generate order name from products
  const getOrderName = (order) => {
    if (!order.items || order.items.length === 0) {
      return order.orderNumber || 'Order';
    }
    
    const productNames = order.items
      .map(item => item.productId?.name || 'Unknown Product')
      .filter(name => name !== 'Unknown Product');
    
    if (productNames.length === 0) {
      return order.orderNumber || 'Order';
    }
    
    if (productNames.length === 1) {
      return productNames[0];
    }
    
    if (productNames.length === 2) {
      return `${productNames[0]} & ${productNames[1]}`;
    }
    
    return `${productNames[0]} +${productNames.length - 1} more`;
  };
  
  return (
    <div>
      {/* Payment Alert */}
      {pendingPayments.length > 0 && (
        <div className="card" style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Payment Required</h3>
              <p style={{ color: '#7f1d1d', margin: 0 }}>
                You have {pendingPayments.length} confirmed order(s) that require payment.
              </p>
            </div>
            <Link to="/payment" className="btn btn-primary">
              Make Payment
            </Link>
          </div>
        </div>
      )}
      
      {/* Orders List */}
      <div className="grid">
        {orders.map((o) => (
          <div key={o._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div>
                <strong className="text-lg">{getOrderName(o)}</strong>
                <div className="text-sm text-gray-400 mt-1">#{o.orderNumber}</div>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div>Total: ₹{o.totalAmount}</div>
            {o.items && o.items.length > 0 && o.items[0].startDate && (
              <div className="text-sm text-gray-400 mt-2">
                📅 {new Date(o.items[0].startDate).toLocaleDateString()} - {new Date(o.items[0].endDate).toLocaleDateString()}
              </div>
            )}
            <div style={{ marginTop: '0.5rem' }}>
              Payment: <StatusBadge status={o.paymentStatus} />
            </div>
            {o.status === 'confirmed' && o.paymentStatus !== 'paid' && (
              <div style={{ marginTop: '0.5rem' }}>
                <Link to="/payment" className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>
                  Pay Now
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


