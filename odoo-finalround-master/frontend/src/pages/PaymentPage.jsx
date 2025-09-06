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
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (pendingOrders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 text-center max-w-md mx-auto border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="bg-green-900 w-24 h-24 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">No Pending Payments</h2>
          <p className="text-gray-400 mb-6">You don't have any confirmed orders that require payment.</p>
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            onClick={() => navigate('/')}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-3">Payment Required</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Complete payment for your confirmed orders to proceed with your rental.
        </p>
      </div>

      <div className="space-y-6">
        {pendingOrders.map((order) => (
          <div key={order._id} className=" rounded-xl shadow-lg overflow-hidden border border-gray-700 transition-all hover:shadow-xl">
            <div className="p-6 border-b border-gray-700">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-1">{getOrderName(order)}</h3>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <span className="mr-4">Order: #{order.orderNumber}</span>
                    <span>Created: {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Items */}
                <div>
                  <h4 className="text-lg font-medium text-gray-100 mb-4">Order Items</h4>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-900 rounded-lg">
                        {/* {item.productId.image ? (
                          <img 
                            src={item.productId.image} 
                            alt={item.productId.name}
                            className="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-700"
                          />
                        ) : (
                          <div className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-xl w-16 h-16 mr-4 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )} */}
                        <div className="flex-1 min-w-0" style={{padding: '20px'}}>
                          <p className="font-medium text-gray-100 truncate">{item.productId.name}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-100">₹{item.totalPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h4 className="text-lg font-medium text-gray-100 mb-4">Order Summary</h4>
                  <div className="bg-gray-900 rounded-lg p-5" style={{padding: '20px'}}>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="font-medium text-gray-100">₹{order.totalAmount}</span>
                      </div>
                      {order.deposit > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Deposit:</span>
                          <span className="font-medium text-gray-100">₹{order.deposit}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-700 pt-3 mt-3">
                        <div className="flex justify-between font-bold text-lg">
                          <span className="text-gray-200">Total Amount:</span>
                          <span className="text-purple-300">₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0 flex items-center">
                <span className="text-gray-400 mr-2">Payment Status:</span>
                <StatusBadge status={order.paymentStatus} />
              </div>
              <button
                className={`px-18 py-3 rounded-lg font-medium text-white transition-all duration-300 ${
                  processingPayment 
                    ? 'bg-purple-500 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'
                }`}
                onClick={() => handlePayment(order)}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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