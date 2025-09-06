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

  const getAvailabilityText = () => {
    if (product.nextAvailableTime) {
      return `Next available: ${formatDateTime(product.nextAvailableTime)}`;
    }
    if (product.beginRentTime) {
      return `Available from: ${formatDateTime(product.beginRentTime)}`;
    }
    return `Available Quantity: ${product.availableQuantity}`;
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
      <div>{getAvailabilityText()}</div>
      {product.endRentTime && (
        <div>Available until: {formatDateTime(product.endRentTime)}</div>
      )}
    </div>
  );
}


