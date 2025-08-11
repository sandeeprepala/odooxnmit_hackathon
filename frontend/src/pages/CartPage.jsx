import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  return (
    <div>
      <h2 className="section-title">Cart</h2>
      {items.length === 0 ? (
        <div className="card">Cart is empty</div>
      ) : (
        <div className="card">
          {items.map((it) => (
            <div key={it.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0' }}>
              <div>
                <div>Product: {it.productId}</div>
                <div>Qty: {it.quantity}</div>
                <div>{new Date(it.startDate).toLocaleString()} → {new Date(it.endDate).toLocaleString()}</div>
              </div>
              <button className="btn danger" onClick={() => removeItem(it.productId)}>Remove</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn secondary" onClick={clearCart}>Clear</button>
            <Link to="/checkout" className="btn">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}


