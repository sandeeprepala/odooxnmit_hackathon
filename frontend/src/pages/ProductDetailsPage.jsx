import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/productService.js';
import { useCart } from '../context/CartContext.jsx';
import ProductDetails from '../components/products/ProductDetails.jsx';
import AvailabilityCalendar from '../components/products/AvailabilityCalendar.jsx';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [available, setAvailable] = useState(null);
  const [nextAvailableTime, setNextAvailableTime] = useState(null);
  const { addItem } = useCart();

  useEffect(() => { 
    productService.get(id)
      .then(setProduct)
      .catch(error => {
        if (error.message === 'Product not available') {
          setProduct({ unavailable: true });
        }
      }); 
  }, [id]);
  
  useEffect(() => {
    // Get next available time for this product
    if (id && !product?.unavailable) {
      productService.getNextAvailableTime(id)
        .then(data => {
          setNextAvailableTime(data.nextAvailableTime);
          // Set start date to next available time if not already set
          if (!startDate) {
            const nextTime = new Date(data.nextAvailableTime);
            const localDateTime = new Date(nextTime.getTime() - nextTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            setStartDate(localDateTime);
          }
        })
        .catch(error => {
          console.error('Error fetching next available time:', error);
          // If error, set to current time
          if (!startDate) {
            const now = new Date();
            const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            setStartDate(localDateTime);
          }
        });
    }
  }, [id, product, startDate]);
  
  useEffect(() => {
    if (startDate && endDate && product && !product.unavailable) {
      productService.availability(id, { startDate, endDate })
        .then((res) => setAvailable(res.available))
        .catch(() => setAvailable(0));
    }
  }, [id, startDate, endDate, product]);

  function addToCart() {
    console.log('Add to cart clicked with:', { id, quantity, startDate, endDate, product });
    
    // Validate required fields
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    if (quantity <= 0) {
      alert('Please select a valid quantity');
      return;
    }

    if (quantity > product.availableQuantity) {
      alert(`Only ${product.availableQuantity} items available`);
      return;
    }

    // Check if start date is before next available time
    if (nextAvailableTime && new Date(startDate) < new Date(nextAvailableTime)) {
      alert(`Product is not available until ${new Date(nextAvailableTime).toLocaleString()}. Please select a later start time.`);
      return;
    }

    // Add item to cart
    console.log('Adding item to cart:', { productId: id, quantity, startDate, endDate });
    addItem({ productId: id, quantity, startDate, endDate });
    alert('Item added to cart successfully!');
  }

  if (!product) return <div>Loading...</div>;
  
  if (product.unavailable) {
    return (
      <div className="card">
        <h2>Product Not Available</h2>
        <p>This product is currently out of stock or unavailable for rental.</p>
        <a href="/products" className="btn">Back to Products</a>
      </div>
    );
  }
  
  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
      <ProductDetails product={product} />
      <div>
        <div className="card">
          <h3>Book</h3>
          {nextAvailableTime && (
            <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '0.9em' }}>
              <strong>Next Available:</strong> {new Date(nextAvailableTime).toLocaleString()}
            </div>
          )}
          <div>
            <label>Start</label>
            <input 
              type="datetime-local" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              min={nextAvailableTime ? new Date(nextAvailableTime).toISOString().slice(0, 16) : undefined}
            />
          </div>
          <div>
            <label>End</label>
            <input 
              type="datetime-local" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </div>
          <div>
            <label>Quantity</label>
            <input type="number" min="1" max={product.availableQuantity} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </div>
          <div>Available: {product.availableQuantity}</div>
          <button 
            className="btn" 
            onClick={addToCart} 
            disabled={!startDate || !endDate || quantity > product.availableQuantity || new Date(startDate) < new Date(nextAvailableTime || 0)}
          >
            Add to Cart
          </button>
        </div>
        <AvailabilityCalendar productId={id} />
      </div>
    </div>
  );
}


