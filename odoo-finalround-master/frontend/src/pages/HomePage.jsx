import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import './HomePage.css';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch featured products
        try {
          const productsResponse = await api.get('/products');
          const products = productsResponse.items || [];
          setFeaturedProducts(products.slice(0, 6)); // Show first 6 products
        } catch (error) {
          console.error('Error fetching featured products:', error);
          // Set dummy products if API fails
          setFeaturedProducts([
            {
              _id: '1',
              name: 'Premium SUV',
              description: 'Luxury SUV with all modern amenities',
              basePrice: 2500,
              images: []
            },
            {
              _id: '2', 
              name: 'Sports Bike',
              description: 'High-performance sports bike for adventure',
              basePrice: 1200,
              images: []
            },
            {
              _id: '3',
              name: 'Camera Equipment',
              description: 'Professional photography gear',
              basePrice: 800,
              images: []
            },
            {
              _id: '4',
              name: 'Camping Gear',
              description: 'Complete camping set for outdoor adventures',
              basePrice: 600,
              images: []
            },
            {
              _id: '5',
              name: 'Party Equipment',
              description: 'Everything you need for a great party',
              basePrice: 1500,
              images: []
            },
            {
              _id: '6',
              name: 'Office Furniture',
              description: 'Ergonomic furniture for your workspace',
              basePrice: 900,
              images: []
            }
          ]);
        }

        // Fetch stats
        try {
          const statsResponse = await api.get('/admin/dashboard');
          setStats(statsResponse);
        } catch (error) {
          // Use dummy stats if API fails
          setStats({
            orders: 156,
            products: 89,
            revenue: 125000,
            customers: 234
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="homepage-loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="home-hero-content">
          <div className="home-hero-text">
            <h1 className="home-hero-title">
              Eco-Finds
              <span className="home-gradient-text"> Made Simple</span>
            </h1>
            <p className="home-hero-subtitle">
              Discover, shop, and manage products effortlessly. From electronics to home essentials, 
              EcoFinds connects you with quality items that fit your needs and budget.
            </p>
            <div className="home-hero-buttons">
              <Link to="/products" className="home-btn home-btn-primary">
                <svg className="home-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Products
              </Link>
              <Link to="/register" className="home-btn home-btn-secondary">
                <svg className="home-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Get Started
              </Link>
            </div>
          </div>
          {/* <div className="home-hero-visual">
            <div className="home-floating-card home-card-1">
              <div className="home-card-icon">🚗</div>
              <div className="home-card-text">Luxury Cars</div>
            </div>
            <div className="home-floating-card home-card-2">
              <div className="home-card-icon">🏍️</div>
              <div className="home-card-text">Premium Bikes</div>
            </div>
            <div className="home-floating-card home-card-3">
              <div className="home-card-icon">🛠️</div>
              <div className="home-card-text">Equipment</div>
            </div>
            <div className="home-hero-image">
              <div className="home-hero-image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-9 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div> */}
          <img src="" alt="" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="home-stats-section">
        <div className="home-stats-grid">
          <div className="home-stat-card">
            <div className="home-stat-icon">📦</div>
            <div className="home-stat-number">{stats?.products || 89}+</div>
            <div className="home-stat-label">Products Available</div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-icon">👥</div>
            <div className="home-stat-number">{stats?.customers || 234}+</div>
            <div className="home-stat-label">Happy Customers</div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-icon">📋</div>
            <div className="home-stat-number">{stats?.orders || 156}+</div>
            <div className="home-stat-label">Orders Completed</div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-icon">💰</div>
            <div className="home-stat-number">₹{(stats?.revenue || 125000).toLocaleString()}</div>
            <div className="home-stat-label">Total Revenue</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features-section">
        <div className="home-section-header">
          <h2 className="home-section-title">Why Choose EcoFinds?</h2>
          <p className="home-section-subtitle">Experience the difference with our comprehensive rental platform</p>
        </div>
        <div className="home-features-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>24/7 Availability</h3>
            <p>Book and manage your rentals anytime, anywhere with our round-the-clock platform.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Quality Assured</h3>
            <p>All products are verified and maintained to ensure you get the best quality rentals.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3>Secure Payments</h3>
            <p>Multiple payment options with secure transactions and transparent pricing.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3>Instant Booking</h3>
            <p>Quick and easy booking process with instant confirmation and real-time availability.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
              </svg>
            </div>
            <h3>Smart Scheduling</h3>
            <p>Intelligent calendar system that helps you find the perfect rental time slots.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
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
      <section className="home-featured-section">
        <div className="home-section-header">
          <h2 className="home-section-title">Featured Products</h2>
          <p className="home-section-subtitle">Discover our most popular rental items</p>
        </div>
        <div className="home-products-grid">
          {featuredProducts.map((product) => (
            <div key={product._id} className="home-product-card">
              <div className="home-product-image">
                <div className="home-product-image-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="home-product-badge">Featured</div>
              </div>
              <div className="home-product-content">
                <h3 className="home-product-title">{product.name}</h3>
                <p className="home-product-description">{product.description}</p>
                <div className="home-product-price">₹{product.basePrice}/day</div>
                <Link to={`/products/${product._id}`} className="home-btn home-btn-outline">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="home-section-footer">
          <Link to="/products" className="home-btn home-btn-primary">View All Products</Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="home-testimonials-section">
        <div className="home-section-header">
          <h2 className="home-section-title">What Our Customers Say</h2>
          <p className="home-section-subtitle">Real experiences from satisfied customers</p>
        </div>
        <div className="home-testimonials-grid">
          <div className="home-testimonial-card">
            <div className="home-testimonial-content">
              <div className="home-stars">★★★★★</div>
              <p>"Amazing service! The booking process was smooth and the car was in perfect condition. Will definitely use again!"</p>
            </div>
            <div className="home-testimonial-author">
              <div className="home-author-avatar">P</div>
              <div className="home-author-info">
                <h4>Priya Sharma</h4>
                <span>Business Owner</span>
              </div>
            </div>
          </div>
          <div className="home-testimonial-card">
            <div className="home-testimonial-content">
              <div className="home-stars">★★★★★</div>
              <p>"The equipment rental saved our project! Quality tools, on-time delivery, and excellent customer support."</p>
            </div>
            <div className="home-testimonial-author">
              <div className="home-author-avatar">R</div>
              <div className="home-author-info">
                <h4>Rahul Kumar</h4>
                <span>Construction Manager</span>
              </div>
            </div>
          </div>
          <div className="home-testimonial-card">
            <div className="home-testimonial-content">
              <div className="home-stars">★★★★★</div>
              <p>"Best rental platform I've used! User-friendly interface, transparent pricing, and reliable service."</p>
            </div>
            <div className="home-testimonial-author">
              <div className="home-author-avatar">N</div>
              <div className="home-author-info">
                <h4>Neha Patel</h4>
                <span>Event Planner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta-section">
        <div className="home-cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers who trust us for their rental needs</p>
          <div className="home-cta-buttons">
            <Link to="/register" className="home-btn home-btn-primary">Sign Up Now</Link>
            <Link to="/products" className="home-btn home-btn-secondary">Browse Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}