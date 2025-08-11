# Payment System Implementation

This document describes the complete payment system implementation for the Rental Management application, including address display, payment processing, and Razorpay integration.

## 🏗️ **System Overview**

The payment system allows customers to:
1. **View confirmed orders** that require payment
2. **Make payments** using Razorpay payment gateway
3. **Complete bookings** after successful payment
4. **Get redirected** to homepage after payment success

Admins can:
1. **View customer addresses** in order cards
2. **Confirm orders** to trigger payment requirement
3. **Track payment status** for all orders

## 🔧 **Backend Changes**

### 1. **RentalOrder Model Updates**
- Added `customerAddress` field to store delivery/pickup information
- Address includes: street, city, state, zipCode, phone

### 2. **New Payment Endpoints**
```
GET  /payments/customer/pending          - Get customer's pending payments
POST /payments/rental/:orderId/create-order - Create Razorpay order
POST /payments/rental/verify             - Verify payment and update order
```

### 3. **Enhanced Controllers**
- **rentalController**: Now captures customer address during order creation
- **adminController**: Populates customer address in admin order views
- **paymentController**: Handles Razorpay integration and payment verification

## 🎨 **Frontend Changes**

### 1. **New PaymentPage Component**
- Shows all confirmed orders requiring payment
- Displays order details, items, and total amount
- Integrates Razorpay checkout
- Redirects to homepage after successful payment

### 2. **Enhanced OrderCard Component**
- Displays customer contact information
- Shows delivery address details
- Includes payment status indicators

### 3. **Updated CustomerDashboard**
- Payment alerts for pending payments
- Quick access to payment page
- Order status and payment status display

### 4. **Navigation Updates**
- Added "Payment" link in header for customers
- Protected route for payment page (customer role only)

## 💳 **Razorpay Integration**

### 1. **Payment Flow**
```
Customer → Payment Page → Razorpay Checkout → Payment Success → Homepage Redirect
```

### 2. **Required Environment Variables**
```bash
# Backend (.env)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Frontend (.env)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. **Payment Verification**
- Backend verifies Razorpay signature
- Updates order payment status
- Records transaction details

## 📱 **User Experience Flow**

### **For Customers:**
1. **Order Creation**: Customer creates rental order with address
2. **Admin Confirmation**: Admin confirms order (triggers payment requirement)
3. **Payment Notification**: Customer sees payment alert in dashboard
4. **Payment Process**: Customer visits payment page and completes payment
5. **Success**: Payment successful, redirected to homepage

### **For Admins:**
1. **Order Review**: Admin sees order with customer address
2. **Order Confirmation**: Admin confirms order after availability check
3. **Payment Tracking**: Admin monitors payment status
4. **Order Management**: Admin manages order lifecycle

## 🔒 **Security Features**

- **Role-based Access**: Only customers can access payment page
- **Payment Verification**: Razorpay signature verification
- **Order Ownership**: Customers can only pay for their own orders
- **Status Validation**: Payment only for confirmed orders

## 🚀 **Setup Instructions**

### 1. **Backend Setup**
```bash
cd backend
npm install
# Add Razorpay credentials to .env
npm run dev
```

### 2. **Frontend Setup**
```bash
cd frontend
npm install
# Add Razorpay key to .env
npm run dev
```

### 3. **Environment Variables**
```bash
# Backend .env
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret_key

# Frontend .env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key
```

## 🧪 **Testing the System**

### 1. **Create Test Order**
- Register as customer
- Add items to cart
- Complete checkout

### 2. **Admin Confirmation**
- Login as admin
- Confirm the order
- Check customer address display

### 3. **Customer Payment**
- Login as customer
- Visit payment page
- Complete Razorpay payment
- Verify homepage redirect

## 📋 **API Endpoints Reference**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/payments/customer/pending` | Get pending payments | Customer |
| POST | `/payments/rental/:orderId/create-order` | Create payment order | Customer |
| POST | `/payments/rental/verify` | Verify payment | Customer |
| GET | `/admin/orders` | Get all orders (with addresses) | Admin |

## 🔄 **Order Status Flow**

```
quotation → confirmed → [payment required] → paid → picked_up → returned
```

## 📞 **Support & Troubleshooting**

### **Common Issues:**
1. **Razorpay not loading**: Check script tag in index.html
2. **Payment verification fails**: Verify environment variables
3. **Address not showing**: Check user profile has address data

### **Debug Steps:**
1. Check browser console for JavaScript errors
2. Verify backend API responses
3. Confirm Razorpay credentials
4. Check order status transitions

## 🎯 **Future Enhancements**

- **Multiple Payment Methods**: Add UPI, cards, net banking
- **Payment Plans**: Installment payment options
- **Refund System**: Handle payment refunds
- **Payment History**: Detailed payment transaction logs
- **Email Notifications**: Payment confirmations and receipts
