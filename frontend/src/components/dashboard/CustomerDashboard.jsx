import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { orderService } from '../../services/orderService.js';

export default function CustomerDashboard() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  useEffect(() => { if (user) orderService.getByCustomer(user.id || user._id, token).then(setOrders); }, [user, token]);
  return (
    <div className="grid">
      {orders.map((o) => (
        <div key={o._id} className="card">
          <div><strong>{o.orderNumber}</strong></div>
          <div>Status: {o.status}</div>
          <div>Total: ₹{o.totalAmount}</div>
        </div>
      ))}
    </div>
  );
}


