import express from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  checkAvailability
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, authorize('admin'), upload.array('images', 5), createProduct);
router.put('/:id', authenticate, authorize('admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);
router.get('/:id/availability', checkAvailability);

export default router;


