import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand">Rental Management</Link>
        <nav className="nav">
          <Link className="pill" to="/dashboard">Dashboard</Link>
          <Link className="pill" to="/rentals">Rental</Link>
          <Link className="pill" to="/orders">Order</Link>
          <Link className="pill" to="/products">Products</Link>
          <Link className="pill" to="/reports">Reporting</Link>
          <Link className="pill" to="/settings">Setting</Link>
        </nav>
        <div className="auth" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link className="pill" to="/cart">Cart</Link>
          {user ? (
            <>
              <Link className="pill" to="/profile">{user.name}</Link>
              <button className="btn secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="pill" to="/login">Login</Link>
              <Link className="pill" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


