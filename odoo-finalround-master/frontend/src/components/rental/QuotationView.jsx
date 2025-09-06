export default function QuotationView({ order }) {
  if (!order) return null;
  return (
    <div className="card">
      <h3>Quotation {order.orderNumber}</h3>
      {order.items?.map((it, idx) => (
        <div key={idx} style={{ padding: '.5rem 0', borderBottom: '1px solid #eee' }}>
          <div>Product: {it.productId}</div>
          <div>Qty: {it.quantity}</div>
          <div>Total: ₹{it.totalPrice}</div>
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        <strong>Total Amount: ₹{order.totalAmount}</strong>
      </div>
    </div>
  );
}


