import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import './PaymentPage.css';

export default function PaymentPage() {
  const { user, token } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Function to generate order name from products
  const getOrderName = (order) => {
    if (!order.items || order.items.length === 0) {
      return order.orderNumber || 'Order';
    }
    
    const productNames = order.items
      .map(item => item.productId?.name || 'Unknown Product')
      .filter(name => name !== 'Unknown Product');
    
    if (productNames.length === 0) {
      return order.orderNumber || 'Order';
    }
    
    if (productNames.length === 1) {
      return productNames[0];
    }
    
    if (productNames.length === 2) {
      return `${productNames[0]} & ${productNames[1]}`;
    }
    
    return `${productNames[0]} +${productNames.length - 1} more`;
  };

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      navigate('/');
      return;
    }
    fetchPendingPayments();
  }, [user, navigate]);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const orders = await paymentService.getPendingPayments(token);
      setPendingOrders(orders);
    } catch (error) {
      notify('error', error?.response?.data?.message || 'Failed to fetch pending payments');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (order) => {
    try {
      setProcessingPayment(true);
      
      // Create Razorpay order
      const paymentOrder = await paymentService.createRentalPaymentOrder(
        order._id, 
        order.totalAmount, 
        token
      );

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
        amount: paymentOrder.amount * 100, // Convert to paise
        currency: paymentOrder.currency,
        name: 'Rental App',
        description: `Payment for Order ${order.orderNumber}`,
        order_id: paymentOrder.razorpayOrderId,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id
            };

            await paymentService.verifyRentalPayment(verificationData, token);
            
            notify('success', 'Payment successful! Your order has been confirmed.');
            
            // Refresh pending payments
            await fetchPendingPayments();
            
            // Redirect to homepage after successful payment
            setTimeout(() => {
              navigate('/');
            }, 2000);
            
          } catch (error) {
            notify('error', 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#7c3aed'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      notify('error', error?.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (pendingOrders.length === 0) {
    return (
      <div className="no-payments-container">
        <div className="no-payments-card">
          <div className="no-payments-icon">
            <div className="no-payments-icon-circle">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="no-payments-title">No Pending Payments</h2>
          <p className="no-payments-message">You don't have any confirmed orders that require payment.</p>
          <button 
            className="no-payments-button"
            onClick={() => navigate('/')}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
      <div className="payment-header">
        <h1 className="payment-title">Payment Required</h1>
        <p className="payment-subtitle">
          Complete payment for your confirmed orders to proceed with your rental.
        </p>
      </div>

      <div className="space-y-6">
        {pendingOrders.map((order) => (
          <div key={order._id} className="payment-card">
            <div className="payment-card-header">
              <h3 className="payment-card-title">{getOrderName(order)}</h3>
              <div className="payment-card-meta">
                <span>Order: #{order.orderNumber}</span>
                <span>Created: {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="payment-card-content">
              <div className="payment-items-grid">
                {/* Order Items */}
                <div>
                  <h4 className="payment-section-title">Order Items</h4>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="payment-item">
                        <div className="payment-item-image-placeholder">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="payment-item-details">
                          <p className="payment-item-name">{item.productId.name}</p>
                          <div className="payment-item-meta">
                            {/* <p>{new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</p> */}
                            <p>Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="payment-item-price">₹{item.totalPrice}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h4 className="payment-section-title">Order Summary</h4>
                  <div className="payment-summary">
                    <div className="payment-summary-row">
                      <span className="payment-summary-label">Subtotal:</span>
                      <span className="payment-summary-value">₹{order.totalAmount}</span>
                    </div>
                    {order.deposit > 0 && (
                      <div className="payment-summary-row">
                        <span className="payment-summary-label">Deposit:</span>
                        <span className="payment-summary-value">₹{order.deposit}</span>
                      </div>
                    )}
                    <div className="payment-total">
                      <span className="payment-total-label">Total Amount:</span>
                      <span className="payment-total-amount">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-card-footer">
              <div className="payment-status">
                <span className="payment-status-label">Payment Status:</span>
                <StatusBadge status={order.paymentStatus} />
              </div>
              <button
                className="payment-button"
                onClick={() => handlePayment(order)}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <span className="payment-processing">
                    <svg className="payment-processing-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </span>
                ) : (
                  `Pay ₹${order.totalAmount}`
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}