import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStock,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.route('/').get(protect, getProducts).post(
  protect,
  adminOnly,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('sku').trim().notEmpty().withMessage('SKU is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('supplier').notEmpty().withMessage('Supplier is required'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be >= 0'),
    body('unitPrice').optional().isFloat({ min: 0 }).withMessage('Unit price must be >= 0'),
    body('reorderThreshold').optional().isInt({ min: 0 }).withMessage('Reorder threshold must be >= 0'),
  ],
  validateRequest,
  createProduct
);

router.get('/low-stock', protect, getLowStock);

router
  .route('/:id')
  .get(protect, getProduct)
  .put(protect, adminOnly, validateRequest, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

export default router;
