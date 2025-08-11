import express from 'express';
import authRoutes from './auth.js';
import productRoutes from './products.js';
import rentalRoutes from './rentals.js';
import adminRoutes from './admin.js';
import paymentRoutes from './payments.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/rentals', rentalRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);

export default router;


