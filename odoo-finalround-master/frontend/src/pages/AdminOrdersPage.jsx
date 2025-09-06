import OrderManagement from '../components/dashboard/OrderManagement.jsx';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="section-header">
        <h2 className="section-title">Rental Orders Management</h2>
        <p className="section-subtitle">
          Manage all rental orders, track their status, and handle customer requests efficiently.
          Use the search and filters below to quickly find specific orders.
        </p>
      </div>
      
      <OrderManagement />
    </div>
  );
}


