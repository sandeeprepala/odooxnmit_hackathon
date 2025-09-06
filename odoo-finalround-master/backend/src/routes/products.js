import express from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', listProducts); // List products with optional search/category filters
router.get('/:id', getProduct); // Get single product by ID

// Admin routes
router.post('/', authenticate, authorize('admin'), upload.array('images', 5), createProduct);
router.put('/:id', authenticate, authorize('admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default router;
