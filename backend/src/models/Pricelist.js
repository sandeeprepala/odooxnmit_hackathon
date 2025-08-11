import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    duration: String, // e.g., '1hour', '1day', '1week'
    price: { type: Number, required: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'fixed' },
    discountValue: { type: Number, default: 0 }
  },
  { _id: false }
);

const pricelistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    customerSegment: String,
    validFrom: Date,
    validTo: Date,
    rules: [ruleSchema],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Pricelist = mongoose.model('Pricelist', pricelistSchema);
export default Pricelist;


