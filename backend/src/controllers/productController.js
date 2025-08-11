import Product from '../models/Product.js';
import RentalOrder from '../models/RentalOrder.js';
import { getAvailableQuantity } from '../utils/availability.js';

export async function listProducts(req, res) {
  const { q, category, page = 1, limit = 12 } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
}

export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

export async function createProduct(req, res) {
  const product = await Product.create({ ...req.body, images: req.files?.map(f => `/uploads/${f.filename}`) || [] });
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const images = req.files?.map(f => `/uploads/${f.filename}`);
  const updates = { ...req.body };
  if (images && images.length) updates.$push = { images: { $each: images } };
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

export async function deleteProduct(req, res) {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Deleted' });
}

export async function checkAvailability(req, res) {
  const { startDate, endDate } = req.query;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const activeOrders = await RentalOrder.find({ status: { $in: ['quotation', 'confirmed', 'picked_up'] } });
  const available = getAvailableQuantity({ product, rentals: activeOrders, startDate, endDate });
  res.json({ productId: product._id, available, total: product.quantity });
}


