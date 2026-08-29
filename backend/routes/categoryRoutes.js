import express from 'express';
import { body } from 'express-validator';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.route('/').get(protect, getCategories).post(
  protect,
  adminOnly,
  [body('name').trim().notEmpty().withMessage('Name is required')],
  validateRequest,
  createCategory
);

router
  .route('/:id')
  .get(protect, getCategory)
  .put(protect, adminOnly, [body('name').trim().notEmpty().withMessage('Name is required')], validateRequest, updateCategory)
  .delete(protect, adminOnly, deleteCategory);

export default router;
