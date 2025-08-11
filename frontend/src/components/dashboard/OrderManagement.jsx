import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import OrderCard from './OrderCard.jsx';
import { useNavigate } from 'react-router-dom';

export default function OrderManagement() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    if (!token) return;
    try {
      setLoading(true);
      const res = await api.get('/admin/orders', token);
      setOrders(res.items || []);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  async function updateStatus(id, status) {
    await api.put(`/admin/orders/${id}/status`, { status }, token);
    await load();
  }

  function openOrder(order) {
    navigate(`/admin/orders/${order._id}`);
  }

  if (loading) return <div className="card">Loading orders...</div>;
  if (!orders.length) return <div className="card">No orders yet</div>;

  return (
    <div className="grid">
      {orders.map((o) => (
        <OrderCard key={o._id} order={o} onOpen={openOrder} />
      ))}
    </div>
  );
}


