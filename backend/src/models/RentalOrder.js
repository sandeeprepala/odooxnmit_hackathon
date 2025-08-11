import mongoose from 'mongoose';

const paymentDetailSchema = new mongoose.Schema(
  {
    amount: Number,
    paymentDate: Date,
    paymentMethod: String,
    transactionId: String
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    pricePerUnit: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 }
  },
  { _id: false }
);

const rentalOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['quotation', 'confirmed', 'picked_up', 'returned', 'cancelled'], default: 'quotation' },
    items: [itemSchema],
    totalAmount: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
    pickupDate: Date,
    returnDate: Date,
    actualReturnDate: Date,
    lateFees: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
    paymentDetails: [paymentDetailSchema],
    notes: String,
    // Customer address for delivery/pickup
    customerAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      phone: String
    }
  },
  { timestamps: true }
);

rentalOrderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const ts = Date.now().toString().slice(-6);
    this.orderNumber = `RNT-${ts}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

const RentalOrder = mongoose.model('RentalOrder', rentalOrderSchema);
export default RentalOrder;


