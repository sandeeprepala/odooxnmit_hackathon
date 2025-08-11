import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    images: [{ type: String }],
    isRentable: { type: Boolean, default: true },
    basePrice: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    availableQuantity: { type: Number, default: 0 },
    beginRentTime: { type: Date },
    endRentTime: { type: Date },
    specifications: { type: Object, default: {} },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Ensure availableQuantity defaults to quantity if not provided on create
productSchema.pre('save', function (next) {
  if (this.isNew && (this.availableQuantity === undefined || this.availableQuantity === null)) {
    this.availableQuantity = this.quantity;
  }
  next();
});

productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;


