import { Link } from 'react-router-dom';
import { getFirstImageUrl } from '../../utils/imageUtils.js';

export default function ProductCard({ product }) {
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const imageUrl = getFirstImageUrl(product.images);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextSibling;
    if (fallback) fallback.style.display = 'flex';
  };

  return (
    <div className="card">
      <div style={{ height: 140, background: '#f1f3f5', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {product.images && product.images.length > 0 ? (
          <img 
            src={imageUrl} 
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
            onError={handleImageError}
          />
        ) : null}
        <span style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}>
          No Image
        </span>
      </div>

      {/* Product Name */}
      <h3>{product.name}</h3>

      {/* Product Category */}
      {product.category && (
        <p style={{ fontSize: '0.9em', color: '#6c757d', margin: '4px 0' }}>
          Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </p>
      )}

      {/* Product Description */}
      <p style={{ minHeight: 48 }}>{product.description}</p>

      {/* Price & Availability */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div>₹{product.basePrice}/day</div>
          <div style={{ fontSize: '0.9em', color: 'var(--muted)' }}>
            Available: {product.availableQuantity}
          </div>
          {product.beginRentTime && (
            <div style={{ fontSize: '0.8em', color: 'var(--muted)' }}>
              From: {formatDateTime(product.beginRentTime)}
            </div>
          )}
          {product.endRentTime && (
            <div style={{ fontSize: '0.8em', color: 'var(--muted)' }}>
              Until: {formatDateTime(product.endRentTime)}
            </div>
          )}
          {!product.beginRentTime && !product.endRentTime && (
            <div style={{ fontSize: '0.8em', color: '#28a745' }}>
              ✓ Available anytime
            </div>
          )}
        </div>

        {/* View Button */}
        <Link to={`/products/${product._id}`} className="btn">View</Link>
      </div>
    </div>
  );
}
