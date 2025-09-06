import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { orderService } from '../services/orderService.js';
import StatusBadge from '../components/common/StatusBadge.jsx';

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
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
                <strong>Product : {getOrderName(o)}</strong>
                {/* {console.log(getOrderName(o))} */}
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


