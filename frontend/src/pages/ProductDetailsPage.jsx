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
  const { addItem } = useCart();

  useEffect(() => { productService.get(id).then(setProduct); }, [id]);
  useEffect(() => {
    if (startDate && endDate) productService.availability(id, { startDate, endDate }).then((res) => setAvailable(res.available));
  }, [id, startDate, endDate]);

  function addToCart() {
    addItem({ productId: id, quantity, startDate, endDate });
  }

  if (!product) return <div>Loading...</div>;
  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
      <ProductDetails product={product} />
      <div>
        <div className="card">
          <h3>Book</h3>
          <div>
            <label>Start</label>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label>End</label>
            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div>
            <label>Quantity</label>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </div>
          {available !== null && <div>Available: {available}</div>}
          <button className="btn" onClick={addToCart} disabled={!startDate || !endDate}>Add to Cart</button>
        </div>
        <AvailabilityCalendar productId={id} />
      </div>
    </div>
  );
}


