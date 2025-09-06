import Product from '../models/Product.js';

// List products with search, category filter, and pagination
export async function listProducts(req, res) {
  const { q, page = 1, limit = 12, category } = req.query;
  const filter = { isActive: true };

  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter)
  ]);

  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit))
  });
}

// Get single product by ID
export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  res.json(product);
}

// Create a new product
export async function createProduct(req, res) {
  const body = { ...req.body };

  if (body.basePrice !== undefined) body.basePrice = Number(body.basePrice);
  if (body.quantity !== undefined) body.quantity = Number(body.quantity);

  const images = req.files?.map(f => `/uploads/${f.filename}`) || [];

  const product = await Product.create({
    ...body,
    images,
    availableQuantity: body.quantity || 0
  });

  res.status(201).json(product);
}

// Update existing product
export async function updateProduct(req, res) {
  const images = req.files?.map(f => `/uploads/${f.filename}`);
  const updates = { ...req.body };

  if (images && images.length) updates.$push = { images: { $each: images } };

  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  res.json(product);
}

// Delete product
export async function deleteProduct(req, res) {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Product not found' });

  res.json({ message: 'Deleted' });
}
