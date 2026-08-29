import Transaction from '../models/Transaction.js';
import Product from '../models/Product.js';
import { sendResponse, sendError } from '../utils/response.js';

export const getTransactions = async (req, res, next) => {
  try {
    const { type, product, user, startDate, endDate, search } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const q = {};
    if (type) q.type = type;
    if (product) q.product = product;
    if (user) q.user = user;
    if (startDate || endDate) {
      q.createdAt = {};
      if (startDate) q.createdAt.$gte = new Date(startDate);
      if (endDate) q.createdAt.$lte = new Date(endDate);
    }

    const [items, total] = await Promise.all([
      Transaction.find(q)
        .populate('product', 'name sku')
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Transaction.countDocuments(q),
    ]);

    return sendResponse(res, {
      data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } },
      message: 'Transactions fetched',
    });
  } catch (err) {
    next(err);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const { product: productId, type, quantity, notes } = req.body;
    const product = await Product.findById(productId);
    if (!product) return sendError(res, 'Product not found', 404);

    if (type === 'out' && product.quantity < quantity) {
      return sendError(res, 'Insufficient stock for this transaction', 400);
    }

    const transaction = await Transaction.create({
      product: productId,
      type,
      quantity,
      user: req.user._id,
      notes,
    });

    if (type === 'in') product.quantity += Number(quantity);
    else product.quantity -= Number(quantity);
    await product.save();

    await transaction.populate('product', 'name sku');
    await transaction.populate('user', 'name');

    return sendResponse(res, { statusCode: 201, data: transaction, message: 'Transaction recorded' });
  } catch (err) {
    next(err);
  }
};

export const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('product', 'name sku')
      .populate('user', 'name');
    if (!transaction) return sendError(res, 'Transaction not found', 404);
    return sendResponse(res, { data: transaction, message: 'Transaction fetched' });
  } catch (err) {
    next(err);
  }
};
