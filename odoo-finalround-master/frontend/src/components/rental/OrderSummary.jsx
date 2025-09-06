export default function OrderSummary({ order }) {
  if (!order) return null;
  return (
    <div className="card">
      <h3>Order {order.orderNumber}</h3>
      <div>Status: {order.status}</div>
      <div>Payment: {order.paymentStatus}</div>
      <div>Deposit: ₹{order.deposit}</div>
      <div>Late Fees: ₹{order.lateFees}</div>
      <div>Total: ₹{order.totalAmount}</div>
    </div>
  );
}


