import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';

export default function OrderManagement() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  async function load() { const res = await api.get('/admin/orders', token); setOrders(res.items); }
  useEffect(() => { load(); }, [token]);

  async function updateStatus(id, status) {
    await api.put(`/admin/orders/${id}/status`, { status }, token);
    await load();
  }

  return (
    <div className="grid">
      {orders.map((o) => (
        <div key={o._id} className="card">
          <div><strong>{o.orderNumber}</strong></div>
          <div>Status: {o.status}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn" onClick={() => updateStatus(o._id, 'confirmed')}>Confirm</button>
            <button className="btn" onClick={() => updateStatus(o._id, 'picked_up')}>Pickup</button>
            <button className="btn" onClick={() => updateStatus(o._id, 'returned')}>Return</button>
            <button className="btn secondary" onClick={() => updateStatus(o._id, 'cancelled')}>Cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
}


