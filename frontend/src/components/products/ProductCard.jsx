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

  // Debug logging
  console.log('ProductCard render:', { 
    productId: product._id, 
    productName: product.name, 
    images: product.images,
    hasImages: product.images && product.images.length > 0 
  });

  const imageUrl = getFirstImageUrl(product.images);
  console.log('Constructed image URL:', imageUrl);

  // Function to handle image load error
  const handleImageError = (e) => {
    console.error('Image failed to load:', imageUrl);
    console.error('Image element:', e.target);
    console.error('Product details:', product);
    
    // Hide the failed image
    e.target.style.display = 'none';
    
    // Show the fallback text
    const fallback = e.target.nextSibling;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  return (
    <div className="card">
      <div style={{ height: 140, background: '#f1f3f5', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {product.images && product.images.length > 0 ? (
          <img 
            src={imageUrl} 
            alt={product.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: 6
            }}
            onError={handleImageError}
            onLoad={() => {
              console.log('Image loaded successfully:', imageUrl);
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
        <Link to={`/products/${product._id}`} className="btn">View</Link>
      </div>
    </div>
  );
}


