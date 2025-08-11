import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function ReportsPage() {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    api.get('/admin/reports', token).then(setData).catch(() => {});
  }, [user, token]);

  if (user?.role !== 'admin') return <div className="card">Reporting available for admins</div>;
  if (!data) return <div className="card">Loading...</div>;

  return (
    <div className="two-col">
      <div className="card">
        <h3 className="section-title">Rental Status Counts</h3>
        {data.byStatus.map((r) => (
          <div key={r.status} style={{ display: 'flex', justifyContent: 'space-between', padding: '.25rem 0' }}>
            <span>{r.status}</span>
            <strong>{r.count}</strong>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="section-title">Top Products (by qty)</h3>
        {data.topProducts.map((p) => (
          <div key={p.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '.25rem 0' }}>
            <span>{p.name}</span>
            <strong>{p.rentedQty}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}


