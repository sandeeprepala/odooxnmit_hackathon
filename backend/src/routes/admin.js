import express from 'express';
import { getDashboardStats, getAllOrders, updateOrderStatus, getOverdue, getReports } from '../controllers/adminController.js';
import { listProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate, authorize('admin'));
router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/overdue', getOverdue);
router.get('/reports', getReports);

// Admin product management
router.get('/products', listProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;


