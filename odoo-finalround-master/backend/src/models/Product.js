import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    images: [{ type: String }],
    isRentable: { type: Boolean, default: false }, // Not relevant for selling
    basePrice: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    availableQuantity: { type: Number, default: 0 },
    specifications: { type: Object, default: {} },
    category: { type: String, default: 'General' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ensure availableQuantity defaults to quantity if not provided
productSchema.pre('save', function (next) {
  if (this.isNew && (this.availableQuantity === undefined || this.availableQuantity === null)) {
    this.availableQuantity = this.quantity;
  }
  next();
});

// Text index for search
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
