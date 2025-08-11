import Product from '../models/Product.js';

export async function listProducts(req, res) {
  const { q, page = 1, limit = 12, includeUnavailable } = req.query;
  const filter = { isActive: true };
  if (q) filter.$text = { $search: q };
  
  // For admin users, show all products including unavailable ones
  if (req.user?.role === 'admin') {
    // Admin sees all products
  } else {
    // Customers only see available products (availableQuantity > 0)
    filter.availableQuantity = { $gt: 0 };
    
    // Add time-based filtering for rental availability
    const now = new Date();
    filter.$or = [
      // Products without time restrictions
      { beginRentTime: { $exists: false }, endRentTime: { $exists: false } },
      // Products that are currently within their rental window
      { 
        beginRentTime: { $lte: now },
        endRentTime: { $gte: now }
      },
      // Products that have started but no end time
      { 
        beginRentTime: { $lte: now },
        endRentTime: { $exists: false }
      },
      // Products with no start time but have end time in future
      { 
        beginRentTime: { $exists: false },
        endRentTime: { $gte: now }
      }
    ];
  }

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
  
  // For customers, don't show products with availableQuantity = 0
  if (req.user?.role !== 'admin' && product.availableQuantity <= 0) {
    return res.status(404).json({ message: 'Product not available' });
  }
  
  res.json(product);
}

export async function listPublicProducts(req, res) {
  const { q, page = 1, limit = 12 } = req.query;
  const filter = { isActive: true, availableQuantity: { $gt: 0 } };
  if (q) filter.$text = { $search: q };

  // Add time-based filtering for rental availability
  const now = new Date();
  filter.$or = [
    // Products without time restrictions
    { beginRentTime: { $exists: false }, endRentTime: { $exists: false } },
    // Products that are currently within their rental window
    { 
      beginRentTime: { $lte: now },
      endRentTime: { $gte: now }
    },
    // Products that have started but no end time
    { 
      beginRentTime: { $lte: now },
      endRentTime: { $exists: false }
    },
    // Products with no start time but have end time in future
    { 
      beginRentTime: { $exists: false },
      endRentTime: { $gte: now }
    }
  ];

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
}

export async function createProduct(req, res) {
  const body = { ...req.body };
  // Coerce numeric/boolean fields
  if (body.basePrice !== undefined) body.basePrice = Number(body.basePrice);
  if (body.quantity !== undefined) body.quantity = Number(body.quantity);
  if (body.isRentable !== undefined) body.isRentable = body.isRentable === 'true' || body.isRentable === true;
  if (body.beginRentTime) body.beginRentTime = new Date(body.beginRentTime);
  if (body.endRentTime) body.endRentTime = new Date(body.endRentTime);
  const images = req.files?.map(f => `/uploads/${f.filename}`) || [];
  
  // Set availableQuantity to quantity when creating a new product
  const product = await Product.create({ 
    ...body, 
    images,
    availableQuantity: body.quantity || 0
  });
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
  
  // Use the current availableQuantity from the database
  // This reflects real-time changes when orders are confirmed/cancelled
  const available = product.availableQuantity;
  
  res.json({ 
    productId: product._id, 
    available, 
    total: product.quantity,
    availableQuantity: product.availableQuantity 
  });
}


