import Product from '../models/Product.js';
import RentalOrder from '../models/RentalOrder.js';

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
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter)
  ]);
  
  // For each product, calculate the next available time based on existing bookings
  const itemsWithNextAvailable = await Promise.all(items.map(async (product) => {
    const productObj = product.toObject();
    
    // Find the next available time based on existing confirmed/picked_up orders
    const overlappingOrders = await RentalOrder.find({
      status: { $in: ['confirmed', 'picked_up'] },
      'items.productId': product._id
    }).sort({ 'items.endDate': 1 });
    
    let nextAvailableTime = null;
    if (overlappingOrders.length > 0) {
      // Find the latest end time from overlapping orders
      let latestEndTime = null;
      for (const order of overlappingOrders) {
        for (const item of order.items) {
          if (String(item.productId) === String(product._id)) {
            if (!latestEndTime || new Date(item.endDate) > latestEndTime) {
              latestEndTime = new Date(item.endDate);
            }
          }
        }
      }
      if (latestEndTime) {
        nextAvailableTime = latestEndTime;
      }
    }
    
    productObj.nextAvailableTime = nextAvailableTime;
    return productObj;
  }));
  
  res.json({ items: itemsWithNextAvailable, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
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

  console.log('listPublicProducts filter:', filter);

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter)
  ]);
  
  console.log('listPublicProducts found items:', items.length);
  console.log('Sample product images:', items.slice(0, 3).map(p => ({ id: p._id, name: p.name, images: p.images })));
  
  // For each product, calculate the next available time based on existing bookings
  const itemsWithNextAvailable = await Promise.all(items.map(async (product) => {
    const productObj = product.toObject();
    
    // Find the next available time based on existing confirmed/picked_up orders
    const overlappingOrders = await RentalOrder.find({
      status: { $in: ['confirmed', 'picked_up'] },
      'items.productId': product._id
    }).sort({ 'items.endDate': 1 });
    
    let nextAvailableTime = null;
    if (overlappingOrders.length > 0) {
      // Find the latest end time from overlapping orders
      let latestEndTime = null;
      for (const order of overlappingOrders) {
        for (const item of order.items) {
          if (String(item.productId) === String(product._id)) {
            if (!latestEndTime || new Date(item.endDate) > latestEndTime) {
              latestEndTime = new Date(item.endDate);
            }
          }
        }
      }
      if (latestEndTime) {
        nextAvailableTime = latestEndTime;
      }
    }
    
    productObj.nextAvailableTime = nextAvailableTime;
    return productObj;
  }));
  
  res.json({ items: itemsWithNextAvailable, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
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
  
  if (!startDate || !endDate) {
    // If no date range provided, return current static availability
    return res.json({ 
      productId: product._id, 
      available: product.availableQuantity,
      total: product.quantity,
      availableQuantity: product.availableQuantity 
    });
  }
  
  // Calculate dynamic availability based on overlapping bookings
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Get all confirmed/picked_up orders that overlap with the requested period
  const overlappingOrders = await RentalOrder.find({
    status: { $in: ['confirmed', 'picked_up'] },
    'items.productId': product._id,
    'items.startDate': { $lt: end },
    'items.endDate': { $gt: start }
  });
  
  let bookedQuantity = 0;
  for (const order of overlappingOrders) {
    for (const item of order.items) {
      if (String(item.productId) === String(product._id)) {
        // Check if this item overlaps with the requested period
        if (start < new Date(item.endDate) && end > new Date(item.startDate)) {
          bookedQuantity += item.quantity;
        }
      }
    }
  }
  
  const available = Math.max(0, product.quantity - bookedQuantity);
  
  res.json({ 
    productId: product._id, 
    available, 
    total: product.quantity,
    availableQuantity: product.availableQuantity 
  });
}

export async function getNextAvailableTime(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  // Get all confirmed orders for this product
  const confirmedOrders = await RentalOrder.find({
    status: { $in: ['confirmed', 'picked_up'] },
    'items.productId': product._id
  });
  
  let nextAvailableTime = new Date(); // Default to now
  
  // Find the latest end time from all confirmed bookings
  for (const order of confirmedOrders) {
    for (const item of order.items) {
      if (String(item.productId) === String(product._id)) {
        const itemEndTime = new Date(item.endDate);
        if (itemEndTime > nextAvailableTime) {
          nextAvailableTime = itemEndTime;
        }
      }
    }
  }
  
  // If product has a beginRentTime, use the later of the two
  if (product.beginRentTime && product.beginRentTime > nextAvailableTime) {
    nextAvailableTime = product.beginRentTime;
  }
  
  res.json({ 
    productId: product._id,
    nextAvailableTime: nextAvailableTime.toISOString(),
    beginRentTime: product.beginRentTime ? product.beginRentTime.toISOString() : null
  });
}

// New function to get available time slots for a product
export async function getAvailableTimeSlots(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  // Get all confirmed orders for this product
  const confirmedOrders = await RentalOrder.find({
    status: { $in: ['confirmed', 'picked_up'] },
    'items.productId': product._id
  });
  
  const now = new Date();
  const availableSlots = [];
  
  // If product has time restrictions, use them as base
  let currentStart = product.beginRentTime || now;
  let productEnd = product.endRentTime;
  
  // Sort confirmed orders by start date
  const sortedOrders = [];
  for (const order of confirmedOrders) {
    for (const item of order.items) {
      if (String(item.productId) === String(product._id)) {
        sortedOrders.push({
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate)
        });
      }
    }
  }
  
  sortedOrders.sort((a, b) => a.startDate - b.startDate);
  
  // Find available time slots
  for (const booking of sortedOrders) {
    // If there's a gap between current start and booking start, it's available
    if (currentStart < booking.startDate) {
      availableSlots.push({
        startDate: currentStart.toISOString(),
        endDate: booking.startDate.toISOString(),
        available: true
      });
    }
    
    // Move current start to the end of this booking
    currentStart = booking.endDate;
  }
  
  // If there's time remaining after the last booking, it's available
  if (!productEnd || currentStart < productEnd) {
    availableSlots.push({
      startDate: currentStart.toISOString(),
      endDate: productEnd ? productEnd.toISOString() : null,
      available: true
    });
  }
  
  res.json({ 
    productId: product._id,
    availableSlots,
    totalSlots: availableSlots.length
  });
}


