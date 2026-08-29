import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import { sendResponse } from '../utils/response.js';

export const getDashboard = async (req, res, next) => {
  try {
    const [totalProducts, products, lowStock, outOfStock] = await Promise.all([
      Product.countDocuments(),
      Product.find().populate('category', 'name').populate('supplier', 'name'),
      Product.find({ $expr: { $lt: ['$quantity', '$reorderThreshold'] }, quantity: { $gt: 0 } }).populate('category', 'name'),
      Product.find({ quantity: { $lte: 0 } }).populate('category', 'name'),
    ]);

    const totalStockValue = products.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);

    const categoryStock = {};
    products.forEach((p) => {
      const catName = p.category?.name || 'Uncategorized';
      if (!categoryStock[catName]) categoryStock[catName] = { name: catName, quantity: 0, value: 0 };
      categoryStock[catName].quantity += p.quantity;
      categoryStock[catName].value += p.quantity * p.unitPrice;
    });
    const stockByCategory = Object.values(categoryStock);

    const now = new Date();
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const movementRaw = await Transaction.find({ createdAt: { $gte: last30 } }).sort({ createdAt: 1 });
    const byDay = {};
    movementRaw.forEach((t) => {
      const day = t.createdAt.toISOString().slice(0, 10);
      if (!byDay[day]) byDay[day] = { date: day, stockIn: 0, stockOut: 0 };
      if (t.type === 'in') byDay[day].stockIn += t.quantity;
      else byDay[day].stockOut += t.quantity;
    });
    const stockMovement = Object.values(byDay);

    const recentTransactions = await Transaction.find()
      .populate('product', 'name sku')
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    return sendResponse(res, {
      data: {
        stats: {
          totalProducts,
          totalStockValue,
          lowStockCount: lowStock.length,
          outOfStockCount: outOfStock.length,
        },
        stockByCategory,
        stockMovement,
        recentTransactions,
        lowStockProducts: lowStock,
        outOfStockProducts: outOfStock,
      },
      message: 'Dashboard data',
    });
  } catch (err) {
    next(err);
  }
};

export const getInventoryReport = async (req, res, next) => {
  try {
    const { category, supplier, stockStatus } = req.query;
    const q = {};
    if (category) q.category = category;
    if (supplier) q.supplier = supplier;

    let products = await Product.find(q).populate('category', 'name').populate('supplier', 'name').sort({ name: 1 });

    products = products.filter((p) => {
      if (!stockStatus) return true;
      const status = p.quantity <= 0 ? 'out' : p.quantity < p.reorderThreshold ? 'low' : 'in';
      return status === stockStatus;
    });

    const rows = products.map((p) => ({
      name: p.name,
      sku: p.sku,
      category: p.category?.name || '',
      supplier: p.supplier?.name || '',
      quantity: p.quantity,
      unitPrice: p.unitPrice,
      stockValue: p.quantity * p.unitPrice,
      reorderThreshold: p.reorderThreshold,
      stockStatus: p.quantity <= 0 ? 'Out of Stock' : p.quantity < p.reorderThreshold ? 'Low Stock' : 'In Stock',
    }));

    return sendResponse(res, { data: rows, message: 'Inventory report' });
  } catch (err) {
    next(err);
  }
};

export const getTransactionReport = async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;
    const q = {};
    if (type) q.type = type;
    if (startDate || endDate) {
      q.createdAt = {};
      if (startDate) q.createdAt.$gte = new Date(startDate);
      if (endDate) q.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(q)
      .populate('product', 'name sku')
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const rows = transactions.map((t) => ({
      date: t.createdAt.toISOString().slice(0, 10),
      product: t.product?.name || '',
      sku: t.product?.sku || '',
      type: t.type === 'in' ? 'Stock In' : 'Stock Out',
      quantity: t.quantity,
      user: t.user?.name || '',
      notes: t.notes || '',
    }));

    return sendResponse(res, { data: rows, message: 'Transaction report' });
  } catch (err) {
    next(err);
  }
};
