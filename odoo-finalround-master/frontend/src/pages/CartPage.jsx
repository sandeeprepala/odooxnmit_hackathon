import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { productService } from '../services/productService.js';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProductDetails() {
      if (items.length === 0) return;
      
      setLoading(true);
      const details = {};
      
      for (const item of items) {
        try {
          const product = await productService.get(item.productId);
          details[item.productId] = product;
        } catch (error) {
          console.error('Error fetching product details:', error);
          details[item.productId] = { name: 'Product not found', basePrice: 0 };
        }
      }
      
      setProductDetails(details);
      setLoading(false);
    }

    fetchProductDetails();
  }, [items]);

  if (loading) {
    return (
      <div>
        <h2 className="section-title">Cart</h2>
        <div className="card">Loading cart items...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">Cart</h2>
      {items.length === 0 ? (
        <div className="card">Cart is empty</div>
      ) : (
        <div className="card">
          {items.map((it) => {
            const product = productDetails[it.productId];
            return (
              <div key={it.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{product?.name || 'Product not found'}</div>
                  <div>Quantity: {it.quantity}</div>
                  <div>Price: ₹{product?.basePrice || 0}/day</div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    {new Date(it.startDate).toLocaleString()} → {new Date(it.endDate).toLocaleString()}
                  </div>
                </div>
                <button className="btn danger" onClick={() => removeItem(it.productId)}>Remove</button>
              </div>
            );
          })}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn secondary" onClick={clearCart}>Clear Cart</button>
            <Link to="/checkout" className="btn">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}


