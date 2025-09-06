import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import StatusBadge from '../components/common/StatusBadge.jsx';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get(`/rentals/${id}`, token);
        setOrder(data);
      } finally { setLoading(false); }
    }
    load();
  }, [id, token]);

  async function setStatus(status) {
    try {
      await api.put(`/admin/orders/${id}/status`, { status }, token);
      const data = await api.get(`/rentals/${id}`, token);
      setOrder(data);
      
      // Show feedback for quantity changes
      if (status === 'confirmed') {
        alert('Order confirmed! Product quantities have been reduced.');
      } else if (status === 'returned') {
        alert('Order returned! Product quantities have been restored.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status. Please try again.');
    }
  }

  if (loading || !order) return <div className="card">Loading...</div>;
  const customer = order.customerId?.name || 'Customer';
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{order.orderNumber}</h2>
        <StatusBadge status={order.status} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div>Customer: {customer}</div>
          <div>Order Date: {new Date(order.createdAt).toLocaleString()}</div>
          <div>Payment: {order.paymentStatus}</div>
          <div>Deposit: ₹{order.deposit}</div>
          <div>Late Fees: ₹{order.lateFees}</div>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => setStatus('confirmed')}>Quotation → Confirm</button>
            <button className="btn" onClick={() => setStatus('picked_up')}>Ready → Pickup</button>
            <button className="btn" onClick={() => setStatus('returned')}>Pickup → Returned</button>
            <button className="btn secondary" onClick={() => setStatus('cancelled')}>Cancel</button>
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3 className="section-title">Order lines</h3>
        {order.items?.map((it, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, padding: '.4rem 0', borderBottom: '1px solid var(--line)' }}>
            <div>
              <div><strong>{it.productId?.name || it.productId}</strong></div>
            </div>
            <div>Qty: {it.quantity}</div>
            <div>Unit: ₹{it.pricePerUnit}</div>
            <div>Subtotal: ₹{it.totalPrice}</div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 12 }}>
          <div><strong>Total:</strong> ₹{order.totalAmount}</div>
        </div>
      </div>
    </div>
  );
}


