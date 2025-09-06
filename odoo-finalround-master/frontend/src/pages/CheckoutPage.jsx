import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { orderService } from '../services/orderService.js';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { token } = useAuth();
  const { notify } = useNotifications();
  const [loading, setLoading] = useState(false);

  async function createQuotation() {
    try {
      setLoading(true);
      const order = await orderService.createQuotation({ items }, token);
      notify('success', `Quotation created: ${order.orderNumber}`);
      clearCart();
    } catch (e) {
      notify('error', e?.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="two-col">
      <div className="card">
        <h3 className="section-title">Delivery Address</h3>
        <textarea placeholder="Address" rows="5" />
        {/* <label>
          <input type="checkbox" /> Billing address same as delivery address
        </label> */}
        {/* <label>Delivery Method</label> */}
        {/* <select>
          <option>Please Pick Something</option>
        </select> */}
      </div>
      <div className="card">
        <h3 className="section-title">Order Summary</h3>
        <div style={{ marginBottom: 12 }}>Items: {items.length}</div>
        <label>Coupon Code</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Coupon Code" />
          <button className="btn secondary">Apply</button>
        </div>
        <button className="btn" style={{ marginTop: 12 }} disabled={loading || items.length === 0} onClick={createQuotation}>Confirm</button>
      </div>
    </div>
  );
}


