import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  
  const cartItemCount = items.length;

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand">Rental Management</Link>
        <nav className="nav">
          {user?.role === 'admin' && <Link className="pill" to="/dashboard">Dashboard</Link>}
          <Link className="pill" to={user?.role === 'admin' ? '/admin/orders' : '/orders'}>Order</Link>
          <Link className="pill" to="/products">Products</Link>
          {user?.role === 'customer' && (
            <Link className="pill" to="/payment">Payment</Link>
          )}
          {user?.role === 'admin' && <Link className="pill" to="/reports">Reporting</Link>}
          {/* <Link className="pill" to="/settings">Setting</Link> */}
        </nav>
        <div className="auth" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user?.role === 'admin' && (
            <Link className="pill" to="/admin/products/new">Create Product</Link>
          )}
          {user?.role === 'customer' && <Link className="pill" to="/cart" style={{ position: 'relative' }}>
            Cart
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {cartItemCount}
              </span>
            )}
          </Link>}
          {user ? (
            <>
              <Link className="pill" to="/profile">{user.name}</Link>
              <button className="btn secondary" style={{backgroundColor:"red"}} onClick={logout}>Logout</button>
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


