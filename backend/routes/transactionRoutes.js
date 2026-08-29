import express from 'express';
import { body } from 'express-validator';
import { getTransactions, createTransaction, getTransaction } from '../controllers/transactionController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.route('/').get(protect, getTransactions).post(
  protect,
  [
    body('product').notEmpty().withMessage('Product is required'),
    body('type').isIn(['in', 'out']).withMessage('Type must be in or out'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be >= 1'),
    body('notes').optional().trim(),
  ],
  validateRequest,
  createTransaction
);

router.get('/:id', protect, getTransaction);

export default router;
