import RentalOrder from '../models/RentalOrder.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Create a new order
export async function createQuotation(req, res) {
  try {
    const { items, notes } = req.body;
    const populated = [];

    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: 'Invalid product' });
      }

      if (product.quantity < it.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${it.quantity}`
        });
      }

      populated.push({
        productId: product._id,
        quantity: it.quantity,
        pricePerUnit: product.basePrice,
        totalPrice: product.basePrice * it.quantity
      });
    }

    const totalAmount = populated.reduce((sum, i) => sum + i.totalPrice, 0);

    // Customer address from profile
    const user = await User.findById(req.user._id);
    const customerAddress = user.address ? {
      street: user.address.street,
      city: user.address.city,
      state: user.address.state,
      zipCode: user.address.zipCode,
      phone: user.phone
    } : null;

    const order = await RentalOrder.create({
      customerId: req.user._id,
      status: 'pending',
      items: populated,
      totalAmount,
      notes,
      customerAddress
    });

    // Reduce stock immediately
    for (const item of populated) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Confirm order
export async function confirmOrder(req, res) {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (String(order.customerId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order already processed' });
    }

    order.status = 'confirmed';
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Customer orders (by admin or self)
export async function getCustomerOrders(req, res) {
  try {
    const userId = req.params.customerId;
    if (String(userId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const orders = await RentalOrder.find({ customerId: userId })
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get one order
export async function getOrderById(req, res) {
  try {
    const order = await RentalOrder.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('items.productId', 'name');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.customerId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get my orders (for logged-in user)
export async function getMyOrders(req, res) {
  try {
    const orders = await RentalOrder.find({ customerId: req.user._id })
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Cancel order (restock items)
export async function cancelOrder(req, res) {
  try {
    const order = await RentalOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order already cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    // Restock items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: item.quantity }
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Add payment
export async function addPayment(req, res) {
  try {
    const { amount, paymentMethod, transactionId } = req.body;
    const order = await RentalOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.paymentDetails.push({
      amount,
      paymentDate: new Date(),
      paymentMethod,
      transactionId
    });

    const paid = order.paymentDetails.reduce((s, p) => s + p.amount, 0);
    if (paid >= order.totalAmount) order.paymentStatus = 'paid';
    else if (paid > 0) order.paymentStatus = 'partial';

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
