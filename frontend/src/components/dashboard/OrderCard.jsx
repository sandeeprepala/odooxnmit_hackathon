import StatusBadge from '../common/StatusBadge.jsx';

export default function OrderCard({ order, onOpen }) {
  const customerName = order.customerId?.name || 'Customer';
  const customerEmail = order.customerId?.email || '';
  const customerPhone = order.customerId?.phone || '';
  const customerAddress = order.customerAddress || order.customerId?.address;
  const firstItem = order.items?.[0];
  const product = firstItem?.productId;
  const productName = product?.name || '-';
  
  return (
    <div className="card" onClick={() => onOpen?.(order)} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{customerName}</strong>
        <StatusBadge status={order.status} />
      </div>
      
      <div style={{ marginTop: 6 }}>Order ID: {order.orderNumber}</div>
      <div>Product: {productName}</div>
      <div style={{ marginTop: 6 }}>Total: ₹{order.totalAmount}</div>
      
      {/* Customer Contact Information */}
      <div style={{ marginTop: 12, padding: 8, backgroundColor: 'rgba(124, 58, 237, 0.1)', borderRadius: 6 }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: 4 }}>Customer Details:</div>
        {customerEmail && <div style={{ fontSize: '0.85rem' }}>📧 {customerEmail}</div>}
        {customerPhone && <div style={{ fontSize: '0.85rem' }}>📱 {customerPhone}</div>}
        
        {/* Customer Address */}
        {customerAddress && (
          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: 2 }}>📍 Address:</div>
            <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
              {customerAddress.street && <div>{customerAddress.street}</div>}
              {customerAddress.city && customerAddress.state && (
                <div>{customerAddress.city}, {customerAddress.state}</div>
              )}
              {customerAddress.zipCode && <div>{customerAddress.zipCode}</div>}
            </div>
          </div>
        )}
      </div>
      
      {/* Payment Status */}
      <div style={{ marginTop: 8, fontSize: '0.85rem' }}>
        Payment: <StatusBadge status={order.paymentStatus} />
      </div>
    </div>
  );
}


