import RentalOrder from '../models/RentalOrder.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { areRangesOverlapping } from '../utils/availability.js';

export async function getDashboardStats(req, res) {
  const [ordersCount, productsCount, revenueAgg] = await Promise.all([
    RentalOrder.countDocuments({}),
    Product.countDocuments({}),
    RentalOrder.aggregate([
      { $match: { status: { $in: ['confirmed', 'picked_up', 'returned'] } } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' } } }
    ])
  ]);
  res.json({
    orders: ordersCount,
    products: productsCount,
    revenue: revenueAgg?.[0]?.revenue || 0
  });
}

export async function getAllOrders(req, res) {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    RentalOrder.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('customerId', 'name email')
      .populate('items.productId', 'name'),
    RentalOrder.countDocuments(filter)
  ]);
  res.json({ items, total });
}

export async function updateOrderStatus(req, res) {
  const { status } = req.body;
  const order = await RentalOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  
  const previousStatus = order.status;
  
  // If changing to confirmed status, check availability first
  if (status === 'confirmed' && previousStatus !== 'confirmed') {
    // Check availability for all items before confirming
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }
      
      // Get all confirmed orders for this product that overlap with the current booking
      const overlappingOrders = await RentalOrder.find({
        status: { $in: ['confirmed', 'picked_up'] },
        'items.productId': item.productId,
        _id: { $ne: order._id } // Exclude current order
      });
      
      let bookedQuantity = 0;
      for (const overlappingOrder of overlappingOrders) {
        for (const overlappingItem of overlappingOrder.items) {
          if (String(overlappingItem.productId) === String(item.productId)) {
            if (areRangesOverlapping(
              overlappingItem.startDate, 
              overlappingItem.endDate, 
              item.startDate, 
              item.endDate
            )) {
              bookedQuantity += overlappingItem.quantity;
            }
          }
        }
      }
      
      const availableQuantity = product.quantity - bookedQuantity;
      if (availableQuantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient availability for ${product.name}. Available: ${availableQuantity}, Requested: ${item.quantity}` 
        });
      }
    }
  }
  
  // Update the order status
  order.status = status;
  await order.save();
  
  // Handle quantity management based on status change
  if (status === 'confirmed' && previousStatus !== 'confirmed') {
    // Decrease product available quantities when confirming an order
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, { 
        $inc: { availableQuantity: -Math.abs(item.quantity) } 
      });
    }
  } else if (status === 'returned' && previousStatus !== 'returned') {
    // Increase product available quantities when marking as returned
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, { 
        $inc: { availableQuantity: Math.abs(item.quantity) } 
      });
    }
  }
  
  res.json(order);
}

export async function getOverdue(req, res) {
  const now = new Date();
  const overdue = await RentalOrder.find({
    status: { $in: ['confirmed', 'picked_up'] },
    returnDate: { $lt: now }
  }).sort({ returnDate: 1 });
  res.json(overdue);
}

export async function getReports(req, res) {
  const [byStatus, topProducts] = await Promise.all([
    RentalOrder.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } }
    ]),
    RentalOrder.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.productId', rentedQty: { $sum: '$items.quantity' } } },
      { $sort: { rentedQty: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { productId: '$_id', name: '$product.name', rentedQty: 1, _id: 0 } }
    ])
  ]);
  res.json({ byStatus, topProducts });
}


