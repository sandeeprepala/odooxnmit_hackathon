import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService.js';
import { useCart } from '../context/CartContext.jsx';
import ProductDetails from '../components/products/ProductDetails.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { user } = useAuth();

  // ✅ Fetch product details
  useEffect(() => {
    let ignore = false;
    productService.get(id)
      .then(data => {
        if (!ignore) setProduct(data);
      })
      .catch(error => {
        if (!ignore) {
          if (error.message === 'Product not available') {
            setProduct({ unavailable: true });
          } else {
            console.error('Error loading product:', error);
          }
        }
      });
    return () => { ignore = true; };
  }, [id]);

  // ✅ Add to cart
  function addToCart() {
    if (quantity <= 0) {
      alert('Please select a valid quantity');
      return;
    }

    if (quantity > product.availableQuantity) {
      alert(`Only ${product.availableQuantity} items available`);
      return;
    }

    addItem({ productId: id, quantity });
    navigate('/cart');
  }

  // ✅ Loading state
  if (!product) return <div>Loading...</div>;

  // ✅ Product unavailable state
  if (product.unavailable) {
    return (
      <div className="card">
        <h2>Product Not Available</h2>
        <p>This product is currently out of stock.</p>
        <a href="/products" className="btn">Back to Products</a>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
      <ProductDetails product={product} />
      {user?.role === 'customer' && (
        <div>
          <div className="card">
            <h3>Buy Now</h3>

            <div>
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                max={product.availableQuantity}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
              />
            </div>

            <div>Available: {product.availableQuantity}</div>

            <button
              className="btn"
              onClick={addToCart}
              disabled={quantity > product.availableQuantity || quantity <= 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
