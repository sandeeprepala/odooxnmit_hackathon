import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AdminCreateProductPage from './pages/AdminCreateProductPage.jsx';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';

function AppContent() {
  const { loading, initialized } = useAuth();

  // Show loading spinner while initializing auth state
  if (!initialized || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <LoadingSpinner text="Initializing..." />
        <p style={{ color: '#666' }}>Please wait while we restore your session...</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['admin']}><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrdersPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reports" element={<ProtectedRoute roles={['admin']}><ReportsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute roles={['admin']}><SettingsPage /></ProtectedRoute>} />
          <Route path="/admin/products/new" element={<ProtectedRoute roles={['admin']}><AdminCreateProductPage /></ProtectedRoute>} />
          <Route path="/admin/orders/:id" element={<ProtectedRoute roles={['admin']}><AdminOrderDetailPage /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}


