import express from 'express';
import {
  listProducts,
  listPublicProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  checkAvailability,
  getNextAvailableTime,
  getAvailableTimeSlots
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', listPublicProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, authorize('admin'), upload.array('images', 5), createProduct);
router.put('/:id', authenticate, authorize('admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);
router.get('/:id/availability', checkAvailability);
router.get('/:id/next-available-time', getNextAvailableTime);
router.get('/:id/available-time-slots', getAvailableTimeSlots);

export default router;


