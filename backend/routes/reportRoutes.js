import express from 'express';
import { getDashboard, getInventoryReport, getTransactionReport } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboard);
router.get('/inventory', protect, getInventoryReport);
router.get('/transactions', protect, getTransactionReport);

export default router;
