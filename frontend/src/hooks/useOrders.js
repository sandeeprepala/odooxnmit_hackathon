import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { orderService } from '../services/orderService.js';

export function useOrders() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    orderService.getByCustomer(user.id || user._id, token).then(setOrders).finally(() => setLoading(false));
  }, [user, token]);
  return { orders, loading };
}


