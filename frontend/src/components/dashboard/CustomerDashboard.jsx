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
              <strong>{o.orderNumber}</strong>
              <StatusBadge status={o.status} />
            </div>
            <div>Total: ₹{o.totalAmount}</div>
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


