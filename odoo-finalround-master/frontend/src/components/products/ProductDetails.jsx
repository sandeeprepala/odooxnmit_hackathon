import { getImageUrl } from '../../utils/imageUtils.js';

export default function ProductDetails({ product }) {
  if (!product) return null;

  return (
    <div className="card">
      {/* Product Name */}
      <h2>{product.name}</h2>

      {/* Product Category */}
      {product.category && (
        <p style={{ fontSize: '0.95em', color: '#6c757d', margin: '6px 0' }}>
          Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </p>
      )}

      {/* Product Images */}
      {product.images && product.images.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
              marginBottom: 16,
            }}
          >
            {product.images.map((image, index) => (
              <div
                key={index}
                style={{
                  height: 200,
                  background: '#f1f3f5',
                  borderRadius: 8,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${product.name} - Image ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

      {/* Description */}
      <p>{product.description}</p>

      {/* Price */}
      <div style={{ fontWeight: 'bold', fontSize: '1.1em', margin: '8px 0' }}>
        Price: ₹{product.basePrice}
      </div>

      {/* Stock */}
      <div style={{ fontSize: '0.95em', color: 'var(--muted)' }}>
        In Stock: {product.availableQuantity}
      </div>
    </div>
  );
}
