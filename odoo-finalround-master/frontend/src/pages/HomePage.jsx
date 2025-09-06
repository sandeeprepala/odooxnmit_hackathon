import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products');
        
        const products = response.items || [];
        console.log(products);
        setFeaturedProducts(products.slice(0, 6)); // Show first 6 products
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    // Fetch stats
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response);
      } catch (error) {
        // Use dummy stats if API fails
        setStats({
          orders: 156,
          products: 89,
          revenue: 125000,
          customers: 234
        });
      }
    };

    fetchFeaturedProducts();
    fetchStats();
  }, []);

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Premium Rental Solutions
              <span className="gradient-text"> Made Simple</span>
            </h1>
            <p className="hero-subtitle">
              Discover, rent, and manage products effortlessly. From luxury cars to professional equipment, 
              we connect you with quality rentals that fit your needs and budget.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Products
              </Link>
              <Link to="/register" className="btn btn-secondary">
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Get Started
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">🚗</div>
              <div className="card-text">Luxury Cars</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">🏍️</div>
              <div className="card-text">Premium Bikes</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🛠️</div>
              <div className="card-text">Equipment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-number">{stats?.products || 89}+</div>
            <div className="stat-label">Products Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">{stats?.customers || 234}+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-number">{stats?.orders || 156}+</div>
            <div className="stat-label">Orders Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-number">₹{(stats?.revenue || 125000).toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title" style={{color:"Black"}}>Why Choose Us?</h2>
          <p className="section-subtitle">Experience the difference with our comprehensive rental platform</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>24/7 Availability</h3>
            <p>Book and manage your rentals anytime, anywhere with our round-the-clock platform.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Quality Assured</h3>
            <p>All products are verified and maintained to ensure you get the best quality rentals.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3>Secure Payments</h3>
            <p>Multiple payment options with secure transactions and transparent pricing.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3>Instant Booking</h3>
            <p>Quick and easy booking process with instant confirmation and real-time availability.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
              </svg>
            </div>
            <h3>Smart Scheduling</h3>
            <p>Intelligent calendar system that helps you find the perfect rental time slots.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3>Customer Support</h3>
            <p>Dedicated support team ready to help you with any questions or concerns.</p>
          </div>
      </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title" style={{color: 'Black'}}>Featured Products</h2>
          <p className="section-subtitle">Discover our most popular rental items</p>
        </div>
        <div className="products-grid">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="placeholder-image">📦</div>
                  )}
                  <div className="product-badge">Featured</div>
                </div>
                <div className="product-content">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">₹{product.basePrice}/day</div>
                  <Link to={`/products/${product._id}`} className="btn btn-outline">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="loading-products">
              <div className="spinner"></div>
              <p>Loading featured products...</p>
            </div>
          )}
        </div>
        <div className="section-footer">
          <Link to="/products" className="btn btn-primary">View All Products</Link>
      </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real experiences from satisfied customers</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Amazing service! The booking process was smooth and the car was in perfect condition. Will definitely use again!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👤</div>
              <div className="author-info">
                <h4>Priya Sharma</h4>
                <span>Business Owner</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"The equipment rental saved our project! Quality tools, on-time delivery, and excellent customer support."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👤</div>
              <div className="author-info">
                <h4>Rahul Kumar</h4>
                <span>Construction Manager</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Best rental platform I've used! User-friendly interface, transparent pricing, and reliable service."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👤</div>
              <div className="author-info">
                <h4>Neha Patel</h4>
                <span>Event Planner</span>
              </div>
            </div>
        </div>
      </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers who trust us for their rental needs</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Sign Up Now</Link>
            <Link to="/products" className="btn btn-secondary">Browse Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
