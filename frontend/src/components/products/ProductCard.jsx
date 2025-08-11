import { Link } from 'react-router-dom';
import { getFirstImageUrl } from '../../utils/imageUtils.js';

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <div style={{ height: 140, background: '#f1f3f5', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {product.images && product.images.length > 0 ? (
          <img 
            src={getFirstImageUrl(product.images)} 
            alt={product.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: 6
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <span style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}>
          No Image
        </span>
      </div>
      <h3>{product.name}</h3>
      <p style={{ minHeight: 48 }}>{product.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div>₹{product.basePrice}/{product.rentalUnit}</div>
          <div style={{ fontSize: '0.9em', color: 'var(--muted)' }}>
            Available: {product.availableQuantity}
          </div>
        </div>
        <Link to={`/products/${product._id}`} className="btn">View</Link>
      </div>
    </div>
  );
}


