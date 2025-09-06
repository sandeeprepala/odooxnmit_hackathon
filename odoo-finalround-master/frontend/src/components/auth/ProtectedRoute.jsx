import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

export default function ProtectedRoute({ children, roles }) {
  const { user, token, loading, initialized } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while initializing auth state
  if (!initialized || loading) {
    return <LoadingSpinner />;
  }
  
  // Redirect to login if no token, with return URL
  if (!token) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }
  
  // Check role-based access
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}


