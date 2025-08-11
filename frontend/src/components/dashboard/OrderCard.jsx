import StatusBadge from '../common/StatusBadge.jsx';

export default function OrderCard({ order, onOpen }) {
  const customerName = order.customerId?.name || 'Customer';
  const firstItem = order.items?.[0];
  const product = firstItem?.productId;
  const productName = product?.name || '-';
  return (
    <div className="card" onClick={() => onOpen?.(order)} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{customerName}</strong>
        <StatusBadge status={order.status} />
      </div>
      <div style={{ marginTop: 6 }}>Order ID: {order.orderNumber }</div>
      <div>Product: {productName}</div>
      <div style={{ marginTop: 6 }}>Total: ₹{order.totalAmount}</div>
    </div>
  );
}


