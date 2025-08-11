import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { orderService } from '../services/orderService.js';
import StatusBadge from '../components/common/StatusBadge.jsx';

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    orderService.getByCustomer(user.id || user._id, token).then(setOrders).catch(() => setOrders([]));
  }, [user, token]);

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div className="card">No orders yet</div>
      ) : (
        <div className="grid">
          {orders.map((o) => (
            <div key={o._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{o.orderNumber}</strong>
                <StatusBadge status={o.status} />
              </div>
              <div style={{ marginTop: 8 }}>Total: ₹{o.totalAmount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


