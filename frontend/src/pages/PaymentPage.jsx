import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';

export default function PaymentPage() {
  const { user, token } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

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
    return <LoadingSpinner />;
  }

  if (pendingOrders.length === 0) {
    return (
      <div className="container">
        <div className="card text-center" style={{ maxWidth: 600, margin: '2rem auto' }}>
          <h2>No Pending Payments</h2>
          <p>You don't have any confirmed orders that require payment.</p>
          <button className="btn" onClick={() => navigate('/')}>
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section-header">
        <h1>Payment Required</h1>
        <p>Complete payment for your confirmed orders to proceed with your rental.</p>
      </div>

      <div className="grid gap-6">
        {pendingOrders.map((order) => (
          <div key={order._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.orderNumber}</h3>
                <p className="text-muted">Created: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium mb-2">Order Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {item.productId.image && (
                        <img 
                          src={item.productId.image} 
                          alt={item.productId.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.productId.name}</p>
                        <p className="text-sm text-muted">
                          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{item.totalPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Order Summary:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                  {order.deposit > 0 && (
                    <div className="flex justify-between">
                      <span>Deposit:</span>
                      <span>₹{order.deposit}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span>₹{order.totalAmount + order.deposit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                className="btn btn-primary"
                onClick={() => handlePayment(order)}
                disabled={processingPayment}
              >
                {processingPayment ? 'Processing...' : `Pay ₹${order.totalAmount + order.deposit}`}
              </button>
              
              <div className="text-sm text-muted">
                <p>Payment Status: <StatusBadge status={order.paymentStatus} /></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
