import AdminDashboard from '../components/dashboard/AdminDashboard.jsx';
import CustomerDashboard from '../components/dashboard/CustomerDashboard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  return <CustomerDashboard />;
}


