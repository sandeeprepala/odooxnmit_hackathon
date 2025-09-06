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
    pricePerUnit: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 }
  },
  { _id: false }
);

const rentalOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'cancelled'], 
      default: 'pending' 
    },
    items: [itemSchema],
    totalAmount: { type: Number, default: 0 },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'partial', 'paid'], 
      default: 'pending' 
    },
    paymentDetails: [paymentDetailSchema],
    notes: String,
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
    this.orderNumber = `ORD-${ts}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

const RentalOrder = mongoose.model('RentalOrder', rentalOrderSchema);
export default RentalOrder;
