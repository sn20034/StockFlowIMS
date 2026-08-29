import express from 'express';
import { body } from 'express-validator';
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.route('/').get(protect, getSuppliers).post(
  protect,
  adminOnly,
  [body('name').trim().notEmpty().withMessage('Name is required')],
  validateRequest,
  createSupplier
);

router
  .route('/:id')
  .get(protect, getSupplier)
  .put(protect, adminOnly, [body('name').trim().notEmpty().withMessage('Name is required')], validateRequest, updateSupplier)
  .delete(protect, adminOnly, deleteSupplier);

export default router;
