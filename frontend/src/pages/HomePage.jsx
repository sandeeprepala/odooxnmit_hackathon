import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="container homepage">
      
      {/* Hero Section */}
      <div className="card mb-2">
        <h2>Welcome to Rental Management</h2>
        <p>
          Effortlessly manage, browse, and rent products with our streamlined platform.
          Whether you’re a business or an individual, we make rental management simple and efficient.
        </p>
        <Link to="/products" className="btn mt-1">Browse Products</Link>
      </div>

      {/* About Section */}
      <div className="card mb-2">
        <h3 className="section-title">About Our Platform</h3>
        <p>
          Our Rental Management system is designed to help individuals and businesses keep track of 
          their rental products, bookings, and customers in one place. From listing products to 
          managing orders and returns, we provide a complete solution that saves time and boosts efficiency.
        </p>
        <p className="mt-1">
          With features like real-time availability, automated reminders, and a user-friendly 
          interface, you can focus on growing your business while we handle the rest.
        </p>
      </div>

      {/* Testimonials Section */}
      <div className="card">
        <h3 className="section-title">What People Say</h3>
        <div className="grid">
          <blockquote className="card">
            <p>“This website made renting so easy! I found exactly what I needed in minutes.”</p>
            <footer>— <strong>Priya S.</strong></footer>
          </blockquote>
          <blockquote className="card">
            <p>“A game changer for my business. Managing multiple rentals has never been this organized.”</p>
            <footer>— <strong>Rahul K.</strong></footer>
          </blockquote>
          <blockquote className="card">
            <p>“Fast, reliable, and user-friendly. Highly recommended!”</p>
            <footer>— <strong>Neha P.</strong></footer>
          </blockquote>
        </div>
      </div>

    </div>
  );
}
