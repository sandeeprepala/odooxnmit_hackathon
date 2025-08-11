import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/dashboard', token).then(setStats); }, [token]);
  if (!stats) return <div className="card">Loading...</div>;
  return (
    <div className="grid">
      <div className="card"><h3>Orders</h3><div>{stats.orders}</div></div>
      <div className="card"><h3>Products</h3><div>{stats.products}</div></div>
      <div className="card"><h3>Revenue</h3><div>₹{stats.revenue}</div></div>
    </div>
  );
}


