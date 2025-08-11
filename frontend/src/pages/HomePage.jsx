import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="card">
      <h2>Welcome to Rental Management</h2>
      <p>Browse products and create rental orders easily.</p>
      <Link to="/products" className="btn">Browse Products</Link>
    </div>
  );
}


