import { getImageUrl } from '../../utils/imageUtils.js';

export default function ProductDetails({ product }) {
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!product) return null;
  return (
    <div className="card">
      <h2>{product.name}</h2>
      
      {/* Product Images */}
      {product.images && product.images.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 12,
            marginBottom: 16
          }}>
            {product.images.map((image, index) => (
              <div key={index} style={{ 
                height: 200, 
                background: '#f1f3f5', 
                borderRadius: 8, 
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={getImageUrl(image)} 
                  alt={`${product.name} - Image ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span>Image not found</span>';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <p>{product.description}</p>
      <div>Price: ₹{product.basePrice}/day</div>
      <div>Available Quantity: {product.availableQuantity}</div>
      
      {/* Time Availability Information */}
      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Availability Information</h4>
        
        {product.beginRentTime && (
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Available from:</strong> {formatDateTime(product.beginRentTime)}
          </div>
        )}
        
        {product.endRentTime && (
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Available until:</strong> {formatDateTime(product.endRentTime)}
          </div>
        )}
        
        {!product.beginRentTime && !product.endRentTime && (
          <div style={{ marginBottom: '0.5rem', color: '#28a745' }}>
            <strong>✓ Available anytime</strong>
          </div>
        )}
        
        <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '0.5rem' }}>
          <em>Note: This product may be available for partial time periods. Check the availability calendar for specific time slots.</em>
        </div>
      </div>
    </div>
  );
}


